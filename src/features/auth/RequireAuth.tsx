import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ staff = false, admin = false }: { staff?: boolean; admin?: boolean }) {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen pt-24 text-center text-gray-500">Loading…</div>;
  }
  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (staff && profile.role !== "editor" && profile.role !== "admin") {
    return <Navigate to="/account" replace />;
  }
  if (admin && profile.role !== "admin") {
    return <Navigate to="/account" replace />;
  }
  return <Outlet />;
}
