import { createContext, useContext, useEffect, useState } from "react";
import {
  TOKEN_STORAGE_KEY,
  deleteAccount,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user stores logged-in user data.
  const [user, setUser] = useState(null);

  // token stores JWT token.
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  // authLoading is true while checking saved token.
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        // If there is no token, user is not logged in.
        if (!token) {
          setUser(null);
          setAuthLoading(false);
          return;
        }

        // Verify token by calling protected backend route.
        const data = await getCurrentUser(token);

        setUser(data.user);
      } catch (error) {
        // If token is expired/invalid, remove it.
        console.error("Auth check failed:", error.message);

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUserFromToken();
  }, [token]);

  const register = async (formData) => {
    // Backend returns token and user after successful register.
    const data = await registerUser(formData);

    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const login = async (formData) => {
    // Backend returns token and user after successful login.
    const data = await loginUser(formData);

    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    // Remove token from browser storage.
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    setToken(null);
    setUser(null);
  };

  const deleteMyAccount = async () => {
    if (!token) {
      throw new Error("You are not logged in.");
    }

    await deleteAccount(token);

    // After deleting account, clear local auth state.
    logout();
  };

  const value = {
    user,
    token,
    authLoading,
    register,
    login,
    logout,
    deleteMyAccount,
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  // This error helps if we accidentally use useAuth outside AuthProvider.
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
