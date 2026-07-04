import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Get token saved after login
  const token = localStorage.getItem("token");

  // If token does not exist, send user to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the protected page
  return children;
}

export default ProtectedRoute;
