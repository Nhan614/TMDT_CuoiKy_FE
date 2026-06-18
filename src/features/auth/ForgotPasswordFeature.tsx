import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Snowflake, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import axios from "axios";

export default function ForgotPasswordFeature() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Định dạng email không hợp lệ.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/auth/forgot-password", { email });
      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setError(response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Yêu cầu thất bại, vui lòng kiểm tra lại email.");
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

        {/* Right column: Forgot Password Form or Success Screen */}
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

            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                    Quên mật khẩu?
                  </h1>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Nhập địa chỉ email đăng ký của bạn bên dưới. Chúng tôi sẽ gửi cho bạn liên kết để khôi phục mật khẩu.
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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600 block pl-1">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98] mt-4 cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Đang gửi liên kết..." : "Gửi liên kết đặt lại"}
                  </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-8">
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại trang Đăng nhập</span>
                  </Link>
                </div>
              </>
            ) : (
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
                  Kiểm tra email của bạn
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến địa chỉ email <strong className="text-slate-800">{email}</strong>. Vui lòng kiểm tra hộp thư của bạn (và thư rác nếu không tìm thấy).
                </p>

                <Link
                  to="/login"
                  className="inline-flex justify-center items-center w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98]"
                >
                  Quay lại Đăng nhập
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
