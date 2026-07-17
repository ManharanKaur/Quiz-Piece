import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const REFRESH_TOKEN_COOKIE_NAME = "quiz_app_refresh_token";
const REFRESH_TOKEN_MAX_AGE_MS =
  Number(process.env.JWT_REFRESH_COOKIE_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000;

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

const createRefreshToken = (userId) => {
  const tokenId = crypto.randomBytes(32).toString("hex");

  const token = jwt.sign(
    {
      userId,
      tokenId,
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  );

  return { token, tokenId };
};

const getRefreshCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  };
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    getRefreshCookieOptions(),
  );
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

const buildUserPayload = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const issueAuthTokens = async (user) => {
  const accessToken = createToken(user._id);
  const { token: refreshToken, tokenId } = createRefreshToken(user._id);

  user.setRefreshToken(
    tokenId,
    new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS),
  );
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken } = await issueAuthTokens(user);

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: accessToken,
      user: buildUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // password has select:false, so we must explicitly add it here.
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { accessToken, refreshToken } = await issueAuthTokens(user);

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: accessToken,
      user: buildUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      );
    } catch (verificationError) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid.",
      });
    }

    if (decoded.tokenType !== "refresh") {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid.",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "+refreshTokenHash +refreshTokenExpiresAt",
    );

    if (!user || !user.hasRefreshToken(decoded.tokenId)) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token is not valid anymore.",
      });
    }

    const { accessToken, refreshToken: rotatedRefreshToken } =
      await issueAuthTokens(user);

    setRefreshTokenCookie(res, rotatedRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      token: accessToken,
      user: buildUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post("/logout", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        );

        if (decoded?.userId) {
          const user = await User.findById(decoded.userId).select(
            "+refreshTokenHash +refreshTokenExpiresAt",
          );

          if (user) {
            user.clearRefreshToken();
            await user.save();
          }
        }
      } catch (verificationError) {
        // Ignore invalid refresh tokens during logout.
      }
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: buildUserPayload(req.user),
  });
});

router.delete("/delete-account", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "+refreshTokenHash +refreshTokenExpiresAt",
    );

    if (user) {
      user.clearRefreshToken();
      await user.save();
    }

    await User.findByIdAndDelete(req.user._id);

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
