import { useEffect, useState } from "react";
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

import { 
  dashboardService, 
  type DashboardReportDTO 
} from "../dashboard/dashboardService"; 

const formatCurrency = (n: number) => (n || 0).toLocaleString("vi-VN") + " ₫";
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function DashboardPage() {

  const [report, setReport] = useState<DashboardReportDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getReport();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Không thể kết nối đến máy chủ Backend!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const overview = report?.overview;

  const statCards = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(overview?.totalRevenue || 0),
      desc: `Hàng có sẵn: ${formatCurrency(overview?.totalRegularRevenue || 0)} | Đặt riêng: ${formatCurrency(overview?.totalCustomRevenue || 0)}`,
      icon: DollarSign,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Tổng số đơn hàng",
      value: ((overview?.totalOrders || 0)).toLocaleString("vi-VN"),
      desc: `Hàng sẵn: ${overview?.totalRegularOrders || 0} | Custom: ${overview?.totalCustomOrders || 0}`,
      icon: ShoppingBag,
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-100",
    },
    {
      label: "Tổng số nghệ nhân",
      value: (overview?.totalArtisans || 0).toLocaleString("vi-VN"),
      desc: "Nghệ nhân thủ công hoạt động",
      icon: Clock,
      textColor: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-100",
    },
    {
      label: "Tổng sản phẩm",
      value: (overview?.totalProducts || 0).toLocaleString("vi-VN"),
      desc: `Tổng số khách hàng mua sắm: ${overview?.totalCustomers || 0}`,
      icon: Truck,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-8">
      {/* Upper header action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Tổng Quan Hệ Thống</h1>
          <p className="text-stone-500 text-sm mt-1">
            Dữ liệu đồng bộ qua kiến trúc DashboardService an toàn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-xs">
            <Calendar size={13} className="text-stone-400" />
            Hôm nay: {formatDate(new Date().toISOString())}
          </span>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="p-2 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-stone-600 shadow-xs active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-amber-600" />
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
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between relative overflow-hidden"
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
        {/* Top Products Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-800">Sản Phẩm Bán Chạy Nhất</h3>
              <p className="text-xs text-stone-400 mt-0.5">Danh sách các sản phẩm có sức tiêu thụ tốt nhất</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg"
            >
              Xem tất cả đơn
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
                <Loader2 className="animate-spin text-amber-600" size={32} />
                <span className="text-sm">Đang tải báo cáo từ Service...</span>
              </div>
            ) : !report?.topProducts || report.topProducts.length === 0 ? (
              <div className="py-20 text-center text-stone-400 text-sm">
                Chưa có dữ liệu sản phẩm bán chạy nào.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    <th className="px-6 py-3">Sản phẩm thủ công</th>
                    <th className="px-6 py-3 text-center">Số lượng đã bán</th>
                    <th className="px-6 py-3 text-right">Tổng Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {report.topProducts.map((product) => (
                    <tr key={product.productId} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img 
                          src={product.thumbnailUrl || "https://placehold.co/40"} 
                          alt={product.productName} 
                          className="w-10 h-10 object-cover rounded-xl border border-stone-100 bg-stone-100"
                        />
                        <span className="font-semibold text-stone-800">{product.productName}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-stone-600">
                        {product.quantitySold} sản phẩm
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        {formatCurrency(product.totalRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-stone-700" />
              Lối Tắt Quản Trị
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/orders"
                className="w-full flex items-center justify-between p-3 border border-stone-100 hover:border-stone-300 hover:bg-stone-50 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
                    <ShoppingBag size={15} />
                  </div>
                  <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">
                    Xử lý đơn hàng
                  </span>
                </div>
                <ArrowUpRight size={14} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Revenue distribution breakdown card */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h3 className="font-bold text-stone-800 mb-4">Phương thức thanh toán</h3>
            <div className="space-y-4">
              {[
                { name: "Chuyển khoản / Online", percentage: "75%", color: "bg-stone-800" },
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