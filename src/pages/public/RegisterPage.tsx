import { Navigate } from "react-router-dom";
import RegisterFeature from "../../features/auth/RegisterFeature";

function RegisterPage() {
  const isAuthenticated = !!localStorage.getItem("token");

  // Nếu đã đăng nhập, không cho ở lại trang register, đẩy sang /home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <RegisterFeature />;
}

export default RegisterPage;
