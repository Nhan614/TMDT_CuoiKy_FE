import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { RegisterRequestDTO } from "./authType";
import { registerUser } from "./authThunk";
import { motion } from "motion/react";
import { Check, Eye, EyeOff } from "lucide-react";
import useAuth from "./useAuth";
import { GoogleLogin } from "@react-oauth/google";

function RegisterFeature() {
  // States
  const [formData, setFormData] = useState<RegisterRequestDTO>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redux
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // useAuth
  const { actions } = useAuth();

  // Handle register
  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (!formData.fullName.trim())
      return setValidationError("Vui lòng nhập họ và tên.");

    if (!formData.username.trim())
      return setValidationError("Vui lòng nhập email.");
    if (formData.username.includes(" "))
      return setValidationError("Email không được chứa khoảng trắng.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return setValidationError("Email không hợp lệ.");

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone))
      return setValidationError("Số điện thoại phải từ 10-11 chữ số.");

    if (formData.password.length < 6)
      return setValidationError("Mật khẩu phải có ít nhất 6 ký tự.");

    if (confirmPassword !== formData.password) {
      setValidationError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!isAgreed)
      return setValidationError("Bạn phải đồng ý với điều khoản dịch vụ.");

    setValidationError("");

    // send data
    const response = await dispatch(registerUser({ ...formData })).unwrap();

    if (response.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E4E2] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Column - Image Section */}
        <div className="w-full md:w-[45%] h-64 md:h-auto relative overflow-hidden p-6 md:p-4">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full rounded-[30px] overflow-hidden shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=2070&auto=format&fit=crop"
              alt="Handmade Wool Craft"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay for a softer look */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </motion.div>
        </div>

        {/* Right Column - Form Section */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Đăng ký - Đồ len Handmade
            </h1>
            <p className="text-brand-muted font-medium">
              Chào mừng bạn! Vui lòng nhập thông tin để đăng ký
            </p>
          </div>

          {/* Error alert */}
          {(validationError || error) && (
            <div className="p-3 mb-6 text-sm text-white bg-red-900/50 border border-red-500/50 rounded-lg text-center">
              {validationError || error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="peer h-5 w-5 appearance-none rounded border border-gray-300 bg-white checked:bg-[#5D429F] checked:border-[#5D429F] transition-all cursor-pointer"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-snug cursor-pointer select-none"
              >
                Tôi đồng ý với các{" "}
                <span className="text-brand-purple font-semibold hover:underline">
                  Điều khoản
                </span>{" "}
                và{" "}
                <span className="text-brand-purple font-semibold hover:underline">
                  Chính sách bảo mật
                </span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98] mt-4 cursor-pointer"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </motion.button>
          </form>

          {/* Divide */}
          <div className="mt-8 mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] font-bold text-gray-400 tracking-wider">
              HOẶC TIẾP TỤC VỚI
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Socials register */}
          <div className="space-y-3">
            <div className="relative w-full group">
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-3 py-3 px-6 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  Đăng nhập với Google
                </span>
              </button>

              <div className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden flex justify-center items-center [&>div]:w-full">
                <GoogleLogin
                  onSuccess={actions.handleSuccess}
                  onError={actions.handleError}
                  width="100%"
                />
              </div>

            </div>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-600 mt-10">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-bold hover:text-purple-600 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterFeature;
