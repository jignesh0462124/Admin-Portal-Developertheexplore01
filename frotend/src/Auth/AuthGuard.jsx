// src/auth/AuthGuard.jsx
import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem("admin_token"));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
