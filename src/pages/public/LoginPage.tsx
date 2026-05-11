import { motion } from "framer-motion"; 
import { Apple, Snowflake, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5E4E2] flex items-center justify-center p-4 font-sans selection:bg-purple-100 selection:text-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-black/5 w-full max-w-5xl flex flex-col md:flex-row min-h-[640px]"
      >
        {/* Cột trái: Ảnh minh họa (Giống trang Register) */}
        <div className="w-full md:w-1/2 relative bg-[#F3F2F0] p-4 hidden md:block">
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full rounded-[24px] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=2070&auto=format&fit=crop"
              alt="Crochet materials"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/5 pointer-events-none" />
          </motion.div>
        </div>

        {/* Cột phải: Form Đăng nhập */}
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
              <span className="text-xl font-semibold tracking-tight text-slate-900 uppercase">Konekta</span>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                Chào mừng trở lại
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Vui lòng nhập thông tin để truy cập vào tài khoản của bạn.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-600 block pl-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-600 block pl-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Ghi nhớ & Quên mật khẩu */}
              <div className="flex items-center justify-between text-sm pt-1">
                <button 
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center space-x-2 group cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-[#5D429F] border-[#5D429F]' : 'border-slate-300 group-hover:border-purple-400'}`}>
                    {rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
                </button>
                <a href="#" className="text-slate-900 font-semibold hover:text-purple-600 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Nút Login */}
              <button
                type="submit"
                className="w-full bg-[#5D429F] hover:bg-[#4A3285] text-white font-semibold py-4 rounded-full shadow-lg shadow-purple-900/10 transition-all active:scale-[0.98] mt-4"
              >
                Đăng nhập
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400 uppercase tracking-widest font-medium">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-3 py-3.5 px-6 border border-slate-200 rounded-full bg-[#f8f9fa] hover:bg-slate-100 transition-all group">
                <Apple className="w-5 h-5 text-black" />
                <span className="text-sm font-semibold text-slate-900">Apple</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-3 py-3.5 px-6 border border-slate-200 rounded-full bg-[#f8f9fa] hover:bg-slate-100 transition-all group">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-semibold text-slate-900">Google</span>
              </button>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-slate-600 mt-10">
              Bạn chưa có tài khoản? <a href="/register" className="text-slate-900 font-bold hover:text-purple-600 transition-colors">Tạo tài khoản ngay</a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}