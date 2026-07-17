import { createContext, useContext, useEffect, useState } from "react";
import {
  TOKEN_STORAGE_KEY,
  deleteAccount,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
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
        if (!token) {
          setUser(null);
          setAuthLoading(false);
          return;
        }

        const data = await getCurrentUser(token);

        setUser(data.user);
      } catch (error) {
        try {
          const refreshedData = await refreshAccessToken();

          localStorage.setItem(TOKEN_STORAGE_KEY, refreshedData.token);
          setToken(refreshedData.token);
          setUser(refreshedData.user);

          return;
        } catch (refreshError) {
          console.error("Auth check failed:", error.message);
          console.error("Token refresh failed:", refreshError.message);

          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
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
    logoutUser().catch((error) => {
      console.error("Logout request failed:", error.message);
    });

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
