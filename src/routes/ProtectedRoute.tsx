import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "../features/auth/authType";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as UserRole | null;

  // Chưa đăng nhập → redirect về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Có roles yêu cầu → kiểm tra role của user
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
