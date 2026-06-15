import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  X,
  Home,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { logout } from "../../../features/auth/authSlice";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const adminName = user?.username || localStorage.getItem("username") || "Administrator";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Tổng Quan",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/orders",
      name: "Quản Lý Đơn Hàng",
      icon: ShoppingBag,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-stone-950 text-stone-200">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-stone-800 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white uppercase block">
            Atelier
          </span>
          <span className="text-[10px] text-stone-500 uppercase tracking-widest -mt-1 block font-medium">
            Quản trị viên
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        <div className="px-3 mb-2 text-stone-500 text-[10px] uppercase font-bold tracking-wider">
          Mục quản trị
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/10"
                  : "hover:bg-stone-900 text-stone-400 hover:text-stone-100"
                }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-stone-500 group-hover:text-stone-300"} />
              <span>{item.name}</span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-white" />
              )}
            </Link>
          );
        })}

        <div className="border-t border-stone-800 my-6 pt-4">
          <div className="px-3 mb-2 text-stone-500 text-[10px] uppercase font-bold tracking-wider">
            Liên kết ngoài
          </div>
          <Link
            to="/home"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:bg-stone-900 hover:text-stone-100 transition-colors"
          >
            <Home size={18} className="text-stone-500" />
            <span>Xem cửa hàng</span>
          </Link>
        </div>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-stone-800 bg-stone-900/50">
        <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
          <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-primary font-bold">
            <Shield size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{adminName}</p>
            <p className="text-xs text-stone-500 truncate">Admin Account</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-800 rounded-xl text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 font-sans selection:bg-primary/10 selection:text-primary">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (backdrop & sheet) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white z-50 p-1.5 bg-stone-900 rounded-lg"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">

        {/* Content Outlet */}
        <main className="flex-1 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
