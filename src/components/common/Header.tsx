import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Spool,
  Triangle,
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
  const isAdmin =
    user?.role === "ADMIN" || localStorage.getItem("role") === "ADMIN";
  const role = user?.role || localStorage.getItem("role");

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
          {/* Logo + hamburger */}
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
              <span className="text-xl font-bold tracking-tight text-primary uppercase">
                Atelier
              </span>
            </div>
          </div>

          {/* Desktop nav links */}
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
            <Link
              to="/about"
              className="hover:text-stone-900 transition-colors"
            >
              Về chúng tôi
            </Link>
            <Link
              to="/artisan"
              className="hover:text-stone-900 transition-colors"
            >
              Đặt hàng riêng
            </Link>
            <Link
              to="/my-application"
              className="hover:text-stone-900 transition-colors"
            >
              Đăng ký làm thợ
            </Link>
          </div>

          {/* User dropdown */}
          <div className="flex items-center">
            <UserMenu
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              role={role}
              cart={cart}
              handleLogout={handleLogout}
            />
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
          {isAdmin && (
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 text-primary font-bold py-2 border-b border-stone-100 hover:text-stone-900 transition-colors"
            >
              <LayoutDashboard size={18} />
              Trang Quản Trị (Admin)
            </Link>
          )}
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
          {isLoggedIn && (
            <Link
              to="/orders"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 text-stone-600 font-medium py-2 hover:text-primary transition-colors"
            >
              Đơn hàng của tôi
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}

// ── Dropdown user menu ────────────────────────────────────────────────────────
interface UserMenuProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  role: string | null | undefined;
  cart: { totalItems: number } | null;
  handleLogout: () => void;
}

function UserMenu({
  isLoggedIn,
  isAdmin,
  role,
  cart,
  handleLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-menu-wrapper")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const cartCount = cart?.totalItems ?? 0;

  return (
    <div id="user-menu-wrapper" className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-stone-100 transition-colors text-stone-600 hover:text-stone-900 focus:outline-none cursor-pointer"
        title="Tài khoản"
      >
        <div className="relative">
          <User size={20} />
        </div>
        <motion.span
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          className="text-stone-400 text-xs"
        >
          <Triangle size={9} />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50"
        >
          {/* Admin Dashboard */}
          {isAdmin && (
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-primary font-semibold hover:bg-stone-50 transition-colors border-b border-stone-100"
            >
              <LayoutDashboard size={16} />
              Admin Dashboard
            </Link>
          )}



          {isLoggedIn ? (
            <>
              {/* Giỏ hàng */}
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <ShoppingBag size={16} />
                <span>Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-stone-800 text-white text-[10px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Đơn hàng */}
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Package size={16} />
                Đơn hàng
              </Link>

              {/* Hồ sơ */}
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <User size={16} />
                Hồ sơ
              </Link>

              {/* Đơn gia công riêng */}
              {role === "USER" && (
                <Link
                  to="/custom-orders/my"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Spool size={16} />
                  Đơn gia công riêng
                </Link>
              )}
              {role === "ARTISAN" && (
                <Link
                  to="/custom-orders/artisan"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Spool size={16} />
                  Đơn gia công riêng
                </Link>
              )}
              {role === "ARTISAN" && (
                <Link
                  to="/wallet"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <CreditCard size={16} />
                  Ví tiền & Rút tiền
                </Link>
              )}
              {role === "ARTISAN" && (
                <Link
                  to="/artisan/products"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Package size={16} />
                  Quản Lý Sản Phẩm
                </Link>
              )}

              {/* Đăng xuất */}
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-stone-100 cursor-pointer"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </>
          ) : (
            /* Đăng nhập */
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors border-t border-stone-100"
            >
              <User size={16} />
              Đăng nhập
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Header;
