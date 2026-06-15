import { Navigate } from "react-router-dom";
import LoginFeature from "../../features/auth/LoginFeature";

export default function LoginPage() {
  const isAuthenticated = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu đã đăng nhập, không cho ở lại trang login/guest, đẩy sang /dashboard nếu là ADMIN, ngược lại đẩy sang /
  if (isAuthenticated) {
    if (role === "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <LoginFeature />;
}
