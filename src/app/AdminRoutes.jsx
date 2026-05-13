import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdmin = (user) => {
  if (!user) return false;
  if (user.user_metadata?.role === "admin") return true;
  return ADMIN_EMAILS.includes(user.email?.toLowerCase());
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user || !isAdmin(user)) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;