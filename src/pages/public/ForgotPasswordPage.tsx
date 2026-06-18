import { Navigate } from "react-router-dom";
import ForgotPasswordFeature from "../../features/auth/ForgotPasswordFeature";

export default function ForgotPasswordPage() {
  const isAuthenticated = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (isAuthenticated) {
    if (role === "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <ForgotPasswordFeature />;
}
