import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Loader2,
  Calendar,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAdminOrders } from "../../features/orders/orderThunk";
import type { OrderDTO } from "../../features/orders/orderType";

const formatCurrency = (n: number) => n.toLocaleString("vi-VN") + " ₫";
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAdminOrders({ page: 0, size: 50 }));
  }, [dispatch]);

  const loadData = () => {
    dispatch(fetchAdminOrders({ page: 0, size: 50 }));
  };

  // Calculate stats from orders list
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((s, o) => s + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const deliveryOrders = orders.filter((o) => o.status === "SHIPPED" || o.status === "PROCESSING").length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      desc: "Doanh thu từ các đơn đã thanh toán",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Đơn chờ xác nhận",
      value: pendingOrders,
      desc: "Đơn hàng mới cần được xử lý",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-100",
    },
    {
      label: "Đang vận chuyển",
      value: deliveryOrders,
      desc: "Đơn hàng đang giao hoặc đang xử lý",
      icon: Truck,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-100",
    },
    {
      label: "Đã hoàn thành",
      value: completedOrders,
      desc: "Đơn hàng giao thành công",
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-8">
      {/* Upper header action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Tổng Quan Hệ Thống</h1>
          <p className="text-stone-500 text-sm mt-1">
            Theo dõi doanh thu, trạng thái đơn hàng và các hoạt động quản trị
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-xs">
            <Calendar size={13} className="text-stone-400" />
            Hôm nay: {formatDate(new Date().toISOString())}
          </span>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-stone-600 shadow-xs active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <RefreshCw size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-stone-800 tracking-tight mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.textColor} transition-colors group-hover:scale-110 duration-200`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-xs text-stone-400 leading-normal">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm shadow-xs">
          Có lỗi xảy ra: {error}
        </div>
      )}

      {/* Table & Dashboard Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table (Take 2 columns wide on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-800">Đơn Hàng Gần Đây</h3>
              <p className="text-xs text-stone-400 mt-0.5">Top 5 giao dịch mới nhất trên hệ thống</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-primary hover:text-stone-900 transition-colors flex items-center gap-1 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
            >
              Xem tất cả
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {isLoading && orders.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm">Đang tải danh sách đơn hàng...</span>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-20 text-center text-stone-400 text-sm">
                Chưa có đơn hàng nào được ghi nhận.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    <th className="px-6 py-3">Mã Đơn</th>
                    <th className="px-6 py-3">Khách Hàng</th>
                    <th className="px-6 py-3">Ngày Đặt</th>
                    <th className="px-6 py-3 text-right">Tổng Tiền</th>
                    <th className="px-6 py-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {recentOrders.map((order: OrderDTO) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-stone-700">
                        {order.orderCode}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-800">{order.userFullName || order.username}</p>
                        <p className="text-[10px] text-stone-400">@{order.username}</p>
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-stone-800">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : order.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : order.status === "CANCELLED"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          {order.status === "DELIVERED"
                            ? "Đã giao"
                            : order.status === "PENDING"
                            ? "Chờ duyệt"
                            : order.status === "CANCELLED"
                            ? "Đã hủy"
                            : "Đang xử lý"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar Info Panels (Take 1 column) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Lối Tắt Quản Trị
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/orders"
                className="w-full flex items-center justify-between p-3 border border-stone-100 hover:border-primary/20 hover:bg-primary/5 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingBag size={15} />
                  </div>
                  <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">
                    Xử lý đơn hàng
                  </span>
                </div>
                <ArrowUpRight size={14} className="text-stone-400 group-hover:text-primary transition-colors" />
              </Link>
              <Link
                to="/home"
                className="w-full flex items-center justify-between p-3 border border-stone-100 hover:border-stone-300 hover:bg-stone-50 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-500 flex items-center justify-center">
                    <ArrowUpRight size={15} />
                  </div>
                  <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">
                    Xem cửa hàng bán lẻ
                  </span>
                </div>
                <ArrowUpRight size={14} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Revenue distribution breakdown card */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h3 className="font-bold text-stone-800 mb-4">Phương thức thanh toán</h3>
            <div className="space-y-4">
              {[
                { name: "Chuyển khoản / Online", percentage: "75%", color: "bg-primary" },
                { name: "Thanh toán khi nhận hàng (COD)", percentage: "25%", color: "bg-stone-400" },
              ].map((method) => (
                <div key={method.name}>
                  <div className="flex justify-between text-xs font-medium text-stone-600 mb-1.5">
                    <span>{method.name}</span>
                    <span className="font-bold text-stone-800">{method.percentage}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${method.color}`} style={{ width: method.percentage }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
