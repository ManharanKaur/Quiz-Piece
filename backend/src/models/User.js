import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
      select: false,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },

    refreshTokenExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.setRefreshToken = function (refreshTokenId, expiresAt) {
  this.refreshTokenHash = hashToken(refreshTokenId);
  this.refreshTokenExpiresAt = expiresAt;
};

userSchema.methods.clearRefreshToken = function () {
  this.refreshTokenHash = undefined;
  this.refreshTokenExpiresAt = undefined;
};

userSchema.methods.hasRefreshToken = function (refreshTokenId) {
  if (!this.refreshTokenHash || !refreshTokenId) {
    return false;
  }

  if (
    this.refreshTokenExpiresAt &&
    this.refreshTokenExpiresAt.getTime() < Date.now()
  ) {
    return false;
  }

  return this.refreshTokenHash === hashToken(refreshTokenId);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
