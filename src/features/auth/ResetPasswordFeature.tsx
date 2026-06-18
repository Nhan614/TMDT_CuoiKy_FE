import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, Snowflake, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import axios from "axios";

export default function ResetPasswordFeature() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // States
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "valid" | "invalid">("verifying");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus("invalid");
        return;
      }

      try {
        const response = await axiosClient.get(`/auth/verify-reset-token?token=${token}`);
        if (response.data.success) {
          setVerificationStatus("valid");
        } else {
          setVerificationStatus("invalid");
        }
      } catch (err) {
        setVerificationStatus("invalid");
      }
    };

    verifyToken();
  }, [token]);

  // Form submission
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError("Mã xác thực không tìm thấy.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setError(response.data.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      } else {
        setError("Lỗi kết nối đến máy chủ!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E4E2] flex items-center justify-center p-4 font-sans selection:bg-purple-100 selection:text-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-4xl overflow-hidden shadow-2xl shadow-black/5 w-full max-w-5xl flex flex-col md:flex-row min-h-160"
      >
        {/* Left column: Image */}
        <div className="w-full md:w-1/2 relative bg-[#F3F2F0] p-4 hidden md:block">
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full rounded-3xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=2070&auto=format&fit=crop"
              alt="Artisan materials"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/5 pointer-events-none" />
          </motion.div>
        </div>

        {/* Right column: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Snowflake className="w-6 h-6 text-slate-800" />
              <span className="text-xl font-semibold tracking-tight text-slate-900 uppercase">
                Konekta
              </span>
            </div>

            {/* 1. VERIFYING STATE */}
            {verificationStatus === "verifying" && (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#5D429F] animate-spin" />
                <p className="text-slate-500 font-medium text-sm">
                  Đang xác thực liên kết đặt lại mật khẩu của bạn...
                </p>
              </div>
            )}

            {/* 2. INVALID TOKEN STATE */}
            {verificationStatus === "invalid" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-red-50 rounded-full">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  Liên kết không hợp lệ
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Yêu cầu đặt lại mật khẩu có thể đã hết hạn (hiệu lực trong 15 phút) hoặc mã xác thực không đúng. Vui lòng gửi lại yêu cầu mới.
                </p>

                <Link
                  to="/forgot-password"
                  className="inline-flex justify-center items-center w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98]"
                >
                  Yêu cầu liên kết mới
                </Link>
              </motion.div>
            )}

            {/* 3. VALID STATE */}
            {verificationStatus === "valid" && (
              <>
                {!isSuccess ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-10">
                      <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                        Đặt lại mật khẩu
                      </h1>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Nhập mật khẩu mới của bạn bên dưới để khôi phục quyền truy cập vào tài khoản.
                      </p>
                    </div>

                    {/* Error alert */}
                    {error && (
                      <div className="p-3 mb-6 text-sm text-red-200 bg-red-900/50 border border-red-500/50 rounded-lg text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      {/* New Password */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-600 block pl-1">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-600 block pl-1">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98] mt-6 cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                      </button>
                    </form>
                  </>
                ) : (
                  /* SUCCESS STATE */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-green-50 rounded-full">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                      </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                      Thành công!
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                      Mật khẩu của bạn đã được đặt lại thành công. Vui lòng bấm vào nút dưới đây để đăng nhập bằng mật khẩu mới.
                    </p>

                    <Link
                      to="/login"
                      className="inline-flex justify-center items-center w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98]"
                    >
                      Đăng nhập ngay
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
