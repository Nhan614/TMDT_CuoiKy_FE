import { motion } from 'motion/react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useState } from 'react';

export default function RegistrationCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-brand-card w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Đăng ký - Đồ len Handmade</h1>
            <p className="text-brand-muted font-medium">Chào mừng bạn! Vui lòng nhập thông tin để đăng ký</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Họ và tên</label>
              <input 
                type="text" 
                placeholder="Nhập họ và tên của bạn"
                className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="Nhập email của bạn"
                className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Số điện thoại</label>
              <input 
                type="tel" 
                placeholder="Nhập số điện thoại"
                className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Mật khẩu</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Nhập mật khẩu"
                  className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
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
              <label className="text-[13px] font-semibold text-gray-700 ml-1">Nhập lại mật khẩu</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Nhập lại mật khẩu"
                  className="w-full h-12 bg-brand-input border border-gray-100 rounded-xl px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-gray-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="peer h-5 w-5 appearance-none rounded border border-gray-300 bg-white checked:bg-brand-purple checked:border-brand-purple transition-all cursor-pointer"
                />
                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-600 leading-snug cursor-pointer select-none">
                Tôi đồng ý với các <span className="text-brand-purple font-semibold hover:underline">Điều khoản</span> và <span className="text-brand-purple font-semibold hover:underline">Chính sách bảo mật</span>
              </label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-brand-purple text-black font-semibold rounded-xl shadow-lg shadow-brand-purple/20 hover:bg-brand-purple-hover transition-all mt-4"
            >
              Đăng ký
            </motion.button>
          </form>

          <div className="mt-8 mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] font-bold text-gray-400 tracking-wider">HOẶC TIẾP TỤC VỚI</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ y: -2 }}
              className="flex items-center justify-center gap-3 h-12 bg-brand-input border border-gray-100 rounded-xl hover:bg-gray-100 transition-all font-medium text-sm text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
              </svg>
              Đăng ký bằng Apple
            </motion.button>
            <motion.button 
              whileHover={{ y: -2 }}
              className="flex items-center justify-center gap-3 h-12 bg-brand-input border border-gray-100 rounded-xl hover:bg-gray-100 transition-all font-medium text-sm text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng ký bằng Google
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
