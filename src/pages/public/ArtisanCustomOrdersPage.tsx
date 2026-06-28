import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Inbox,
  ChevronRight,
  Loader2,
  RefreshCw,
  Clock,
  Calendar,
  CircleDollarSign,
  ShieldAlert,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyProfile } from "../../features/user/userThunk";
import { fetchArtisanCustomOrders } from "../../features/customOrders/customOrderThunk";
import { clearCustomOrderMessages } from "../../features/customOrders/customOrderSlice";
import type { CustomOrderDTO, CustomOrderStatus } from "../../features/customOrders/customOrderType";

const formatCurrency = (n: number) => n.toLocaleString("vi-VN") + "₫";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "Chưa cập nhật" : date.toLocaleDateString("vi-VN");
};

const STATUS_CONFIG: Record<CustomOrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Chờ phản hồi", className: "bg-amber-100 text-amber-700 border-amber-200" },
  ACCEPTED: { label: "Đã chấp nhận - Chờ TT", className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED: { label: "Đã từ chối", className: "bg-red-100 text-red-700 border-red-200" },
  CANCELLED: { label: "Đã hủy", className: "bg-stone-100 text-stone-600 border-stone-200" },
  PAYMENT_PENDING: { label: "Đang xử lý TT", className: "bg-blue-100 text-blue-700 border-blue-200" },
  IN_PROGRESS: { label: "Đang thực hiện", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  DELIVERED: { label: "Đã bàn giao", className: "bg-purple-100 text-purple-700 border-purple-200" },
  COMPLETED: { label: "Hoàn thành", className: "bg-teal-100 text-teal-700 border-teal-200" },
};

function StatusBadge({ status }: { status: CustomOrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function ArtisanOrderCard({ order }: { order: CustomOrderDTO }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-stone-100 bg-stone-50/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {order.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-xs text-stone-400">Khách hàng</span>
            <p className="text-xs font-bold text-stone-700 leading-tight">@{order.username}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        <h3 className="font-bold text-stone-800 text-base leading-tight">{order.title}</h3>
        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{order.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <CircleDollarSign size={13} className="text-stone-400 shrink-0" />
            <span>Ngân sách: <strong className="text-stone-700">{formatCurrency(order.budget)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-stone-400 shrink-0" />
            <span>Hạn: <strong className="text-stone-700">{formatDate(order.deadline)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Clock size={13} className="text-stone-400 shrink-0" />
            <span>Số lượng: <strong className="text-stone-700">{order.quantity}</strong></span>
          </div>
        </div>

        {order.referenceImageUrls && order.referenceImageUrls.length > 0 && (
          <div className="flex gap-2 pt-1">
            {order.referenceImageUrls.slice(0, 4).map((url, i) => (
              <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                <img src={url} alt={`ref ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {order.referenceImageUrls.length > 4 && (
              <div className="w-10 h-10 rounded-lg border border-stone-200 bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400">
                +{order.referenceImageUrls.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-stone-100">
        <span className="text-[10px] text-stone-400 uppercase font-semibold">
          Gửi lúc: {formatDate(order.createdAt)}
        </span>
        <Link
          to={`/custom-orders/artisan/${order.id}`}
          className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/5 transition-colors"
        >
          Xem & Phản hồi
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ArtisanCustomOrdersPage() {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading: profileLoading } = useAppSelector((state) => state.user);
  const { artisanOrders, isLoading, error, totalPages, currentPage } = useAppSelector(
    (state) => state.customOrders
  );

  const [statusFilter, setStatusFilter] = useState<CustomOrderStatus | "ALL">("ALL");

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.role === "ARTISAN") {
      dispatch(fetchArtisanCustomOrders({ status: statusFilter, page: 0, size: 10 }));
    }
    return () => {
      dispatch(clearCustomOrderMessages());
    };
  }, [dispatch, statusFilter, currentUser]);

  const handlePageChange = (page: number) => {
    dispatch(fetchArtisanCustomOrders({ status: statusFilter, page, size: 10 }));
  };

  const tabs: { label: string; value: CustomOrderStatus | "ALL" }[] = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ phản hồi", value: "PENDING" },
    { label: "Chờ thanh toán", value: "ACCEPTED" },
    { label: "Đang thực hiện", value: "IN_PROGRESS" },
    { label: "Đã bàn giao", value: "DELIVERED" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã từ chối", value: "REJECTED" },
    { label: "Đã hủy", value: "CANCELLED" },
  ];

  // Guard: check profile loading
  if (profileLoading && !currentUser) {
    return (
      <div className="flex justify-center items-center py-40 flex-col gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-sm text-secondary">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // Guard: only ARTISAN role
  if (currentUser && currentUser.role !== "ARTISAN") {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
          <ShieldAlert size={36} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Không có quyền truy cập</h2>
          <p className="text-stone-500 text-sm max-w-sm">
            Trang này chỉ dành cho Nghệ nhân của Atelier. Hãy đăng ký trở thành nghệ nhân để nhận đơn gia công riêng.
          </p>
        </div>
        <Link
          to="/profile"
          className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:brightness-105 transition-all text-sm shadow-md shadow-primary/20"
        >
          Đăng ký làm Nghệ nhân
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-stone-50/55">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Yêu cầu gia công nhận được</h1>
            <p className="text-stone-400 text-sm mt-1">Xem và phản hồi các yêu cầu gia công riêng từ khách hàng</p>
          </div>
          <button
            onClick={() => dispatch(fetchArtisanCustomOrders({ status: statusFilter, page: currentPage, size: 10 }))}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 disabled:opacity-40 cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-6 scrollbar-hide border-b border-stone-100">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === tab.value
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && artisanOrders.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-stone-400">
            <Loader2 size={40} className="animate-spin opacity-40 text-primary" />
            <p className="text-sm italic">Đang tải danh sách yêu cầu...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && artisanOrders.length === 0 && !error && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white border border-stone-100 flex items-center justify-center shadow-sm">
              <Inbox size={36} className="text-stone-300" />
            </div>
            <div>
              <p className="text-stone-500 font-semibold">Chưa có yêu cầu gia công nào</p>
              <p className="text-stone-400 text-sm mt-1">
                {statusFilter === "ALL"
                  ? "Chưa có khách hàng nào gửi yêu cầu gia công đến bạn."
                  : `Không có yêu cầu nào ở trạng thái "${STATUS_CONFIG[statusFilter as CustomOrderStatus]?.label}".`}
              </p>
            </div>
          </div>
        )}

        {/* Orders list */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {artisanOrders.map((order) => (
              <ArtisanOrderCard key={order.id} order={order} />
            ))}
          </div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all cursor-pointer ${i === currentPage
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-primary hover:text-primary"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
