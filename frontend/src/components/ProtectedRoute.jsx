import { Navigate } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../services/authService";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
