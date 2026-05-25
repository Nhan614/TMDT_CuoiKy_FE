import {
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { fetchCart } from "../../features/cart/cartThunk";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.cart);

  // Kiểm tra đăng nhập: Có user trong Store HOẶC có token trong LocalStorage
  const isLoggedIn = !!user || !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold">
                A
              </div>
              <span className="text-xl  font-bold tracking-tight text-primary uppercase">
                Atelier
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-600 uppercase tracking-wider">
            <Link to="/home" className="hover:text-stone-900 transition-colors">
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="hover:text-stone-900 transition-colors"
            >
              Sản phẩm
            </Link>
            <a href="#" className="hover:text-stone-900 transition-colors">
              Bộ Sưu Tập
            </a>
            <Link
              to="/about"
              className="hover:text-stone-900 transition-colors"
            >
              Về chúng tôi
            </Link>
            <a
              href="/artisan"
              className="hover:text-stone-900 transition-colors"
            >
              Đặt hàng riêng
            </a>
            <a href="#" className="hover:text-stone-900 transition-colors">
              Liên Hệ
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="hover:text-stone-900 transition-colors">
              <button className="p-2 text-gray-600 hover:text-stone-900 transition-colors relative">
                <ShoppingBag size={20} />
                {cart && cart.totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-stone-800 text-white text-[10px] flex items-center justify-center rounded-full">
                    {cart.totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Xử lý hiển thị User hoặc Logout dựa trên trạng thái đăng nhập */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block p-2 text-gray-600 hover:text-stone-900 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block p-2 text-gray-600 hover:text-stone-900 transition-colors"
                title="Đăng nhập"
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-b border-gray-100 p-4 space-y-4"
        >
          <a href="#" className="block text-stone-600 font-medium py-2">
            Cửa Hàng
          </a>
          <a href="#" className="block text-stone-600 font-medium py-2">
            Bộ Sưu Tập
          </a>
          <a href="#" className="block text-stone-600 font-medium py-2">
            Về Chúng Tôi
          </a>
          <a href="#" className="block text-stone-600 font-medium py-2">
            Liên Hệ
          </a>
        </motion.div>
      )}
    </nav>
  );
}

export default Header;
