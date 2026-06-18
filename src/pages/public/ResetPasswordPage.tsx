import { Navigate } from "react-router-dom";
import ResetPasswordFeature from "../../features/auth/ResetPasswordFeature";

export default function ResetPasswordPage() {
  const isAuthenticated = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (isAuthenticated) {
    if (role === "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <ResetPasswordFeature />;
}
