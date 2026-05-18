import { Navigate } from "react-router-dom";
import LoginFeature from "../../features/auth/LoginFeature";

export default function LoginPage() {
  const isAuthenticated = !!localStorage.getItem("token");

  // Nếu đã đăng nhập, không cho ở lại trang login/guest, đẩy sang /home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginFeature />;
}
