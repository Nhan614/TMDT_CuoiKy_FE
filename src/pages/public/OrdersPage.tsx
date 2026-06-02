import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  ChevronRight,
  XCircle,
  Loader2,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMyOrders, cancelOrder } from '../../features/orders/orderThunk';
import { clearOrderMessages } from '../../features/orders/orderSlice';
import type { OrderDTO, OrderStatus, PaymentStatus } from '../../features/orders/orderType';

const formatCurrency = (n: number) => n.toLocaleString('vi-VN') + '₫';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// ─── Status badge config ─────────────────────────────────────────────────────
const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:    { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  CONFIRMED:  { label: 'Đã xác nhận',  className: 'bg-blue-100 text-blue-700 border-blue-200' },
  PROCESSING: { label: 'Đang xử lý',   className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  SHIPPED:    { label: 'Đang giao',    className: 'bg-purple-100 text-purple-700 border-purple-200' },
  DELIVERED:  { label: 'Đã giao',      className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED:  { label: 'Đã hủy',       className: 'bg-red-100 text-red-700 border-red-200' },
  REFUNDED:   { label: 'Đã hoàn tiền', className: 'bg-rose-100 text-rose-700 border-rose-200' },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  UNPAID: { label: 'Chưa thanh toán', className: 'bg-orange-100 text-orange-600 border-orange-200' },
  PAID:   { label: 'Đã thanh toán',   className: 'bg-green-100 text-green-700 border-green-200' },
  FAILED: { label: 'TT thất bại',     className: 'bg-red-100 text-red-600 border-red-200' },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onCancel, cancelling }: { order: OrderDTO; onCancel: (id: number) => void; cancelling: boolean }) {
  const canCancel = order.status === 'PENDING' && order.paymentStatus === 'UNPAID';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-stone-100 bg-stone-50/60">
        <div className="flex items-center gap-3">
          <Package size={16} className="text-stone-400" />
          <span className="font-mono text-sm font-bold text-stone-700">{order.orderCode}</span>
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <span className="text-xs text-stone-400">{formatDate(order.createdAt)}</span>
      </div>

      {/* Items preview */}
      <div className="px-5 py-4 space-y-2">
        {order.items.slice(0, 2).map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-stone-600 truncate max-w-[240px]">
              {item.productName} <span className="text-stone-400">×{item.quantity}</span>
            </span>
            <span className="font-semibold text-stone-800 shrink-0 ml-2">
              {formatCurrency(item.subTotal)}
            </span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-stone-400 italic">+{order.items.length - 2} sản phẩm khác</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-stone-100">
        <div className="text-right">
          <p className="text-xs text-stone-400">Tổng tiền</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {canCancel && (
            <button
              id={`cancel-order-btn-${order.id}`}
              onClick={() => onCancel(order.id)}
              disabled={cancelling}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              <XCircle size={14} />
              Hủy đơn
            </button>
          )}
          <Link
            to={`/orders/${order.id}`}
            id={`view-order-btn-${order.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/5 transition-colors"
          >
            Xem chi tiết
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error, totalPages, currentPage } = useAppSelector(
    (state) => state.orders
  );
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 0, size: 10 }));
    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setCancellingId(id);
    await dispatch(cancelOrder(id));
    setCancellingId(null);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchMyOrders({ page, size: 10 }));
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Đơn hàng của tôi</h1>
            <p className="text-stone-400 text-sm mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
          </div>
          <button
            id="refresh-orders-btn"
            onClick={() => dispatch(fetchMyOrders({ page: currentPage, size: 10 }))}
            disabled={isLoading}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-stone-400">
            <Loader2 size={40} className="animate-spin opacity-40" />
            <p className="text-sm italic">Đang tải đơn hàng...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && orders.length === 0 && !error && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center">
              <ShoppingBag size={36} className="text-stone-300" />
            </div>
            <div>
              <p className="text-stone-500 font-medium">Bạn chưa có đơn hàng nào</p>
              <p className="text-stone-400 text-sm mt-1">Hãy mua sắm ngay!</p>
            </div>
            <Link
              to="/products"
              className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}

        {/* Orders list */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancel}
                cancelling={cancellingId === order.id}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                id={`orders-page-btn-${i}`}
                onClick={() => handlePageChange(i)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                  i === currentPage
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-primary hover:text-primary'
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
