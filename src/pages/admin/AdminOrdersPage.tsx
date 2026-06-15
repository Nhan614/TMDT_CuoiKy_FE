import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Loader2,
  RefreshCw,
  ChevronDown,
  Search,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAdminOrders, updateOrderStatus } from '../../features/orders/orderThunk';
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

// ─── Config ──────────────────────────────────────────────────────────────────
const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  PROCESSING: { label: 'Đang xử lý', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  SHIPPED: { label: 'Đang giao', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  DELIVERED: { label: 'Đã giao', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-700 border-red-200' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'bg-rose-100 text-rose-700 border-rose-200' },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  UNPAID: { label: 'Chưa TT', className: 'bg-orange-100 text-orange-600 border-orange-200' },
  PAID: { label: 'Đã TT', className: 'bg-green-100 text-green-700 border-green-200' },
  FAILED: { label: 'TT lỗi', className: 'bg-red-100 text-red-600 border-red-200' },
};

// Status transitions: what statuses can each current status transition to
const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPED', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

// ─── Status Dropdown ─────────────────────────────────────────────────────────
function StatusDropdown({
  order,
  onUpdate,
  updating,
}: {
  order: OrderDTO;
  onUpdate: (id: number, status: OrderStatus) => void;
  updating: boolean;
}) {
  const nextOptions = NEXT_STATUSES[order.status] ?? [];
  const cfg = ORDER_STATUS_CONFIG[order.status];

  if (nextOptions.length === 0) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
        {cfg.label}
      </span>
    );
  }

  return (
    <div className="relative group">
      <button
        id={`admin-status-btn-${order.id}`}
        disabled={updating}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 transition-opacity ${cfg.className} ${updating ? 'opacity-50' : ''}`}
      >
        {updating ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <ChevronDown size={11} />
        )}
        {cfg.label}
      </button>

      {/* Dropdown */}
      <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-20 min-w-[160px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150">
        {nextOptions.map((status) => {
          const scfg = ORDER_STATUS_CONFIG[status];
          return (
            <button
              key={status}
              id={`admin-status-opt-${order.id}-${status}`}
              onClick={() => onUpdate(order.id, status)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-stone-50 transition-colors flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-full border ${scfg.className}`} />
              {scfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({
  order,
  onUpdate,
  updating,
}: {
  order: OrderDTO;
  onUpdate: (id: number, status: OrderStatus) => void;
  updating: boolean;
}) {
  const paymentCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="hover:bg-stone-50/60 transition-colors border-b border-stone-100 last:border-0"
    >
      {/* Order code */}
      <td className="px-5 py-4">
        <span className="font-mono text-sm font-bold text-stone-700">{order.orderCode}</span>
        <p className="text-[10px] text-stone-400 mt-0.5">{formatDate(order.createdAt)}</p>
      </td>

      {/* Customer */}
      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-stone-700">{order.userFullName || order.username || '—'}</p>
        {order.username && order.userFullName && (
          <p className="text-xs text-stone-400">@{order.username}</p>
        )}
      </td>

      {/* Items + amount */}
      <td className="px-5 py-4">
        <p className="text-sm font-bold text-stone-800">{formatCurrency(order.totalAmount)}</p>
        <p className="text-[10px] text-stone-400 mt-0.5">{order.items.length} sản phẩm</p>
      </td>

      {/* Payment */}
      <td className="px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-stone-500">{order.paymentMethod}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border w-fit ${paymentCfg.className}`}>
            {paymentCfg.label}
          </span>
        </div>
      </td>

      {/* Status dropdown */}
      <td className="px-5 py-4">
        <StatusDropdown order={order} onUpdate={onUpdate} updating={updating} />
      </td>
    </motion.tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error, totalPages, currentPage } = useAppSelector(
    (state) => state.orders
  );

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = (page = 0) => {
    dispatch(fetchAdminOrders({ page, size: 15, status: filterStatus }));
  };

  useEffect(() => {
    load(0);
    return () => { dispatch(clearOrderMessages()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleStatusUpdate = async (id: number, status: OrderStatus) => {
    setUpdatingId(id);
    await dispatch(updateOrderStatus({ id, payload: { status } }));
    setUpdatingId(null);
  };

  // Client-side search by order code
  const filtered = searchQuery.trim()
    ? orders.filter((o) =>
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.username ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.userFullName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    : orders;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Quản lý đơn hàng</h1>
          <p className="text-stone-400 text-sm mt-1">Xem và cập nhật trạng thái tất cả đơn hàng</p>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng đơn', value: orders.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Chờ xác nhận', value: orders.filter((o) => o.status === 'PENDING').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Đang giao', value: orders.filter((o) => o.status === 'SHIPPED').length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Doanh thu (TT)', value: formatCurrency(totalRevenue), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-4 p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-grow max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="admin-orders-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên khách..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`admin-filter-${opt.value}`}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === opt.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            id="admin-orders-refresh"
            onClick={() => load(currentPage)}
            disabled={isLoading}
            className="ml-auto p-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {isLoading && filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-stone-400">
              <Loader2 size={36} className="animate-spin opacity-40" />
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                <Package size={28} className="text-stone-300" />
              </div>
              <p className="text-sm">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {['Mã đơn hàng', 'Khách hàng', 'Giá trị', 'Thanh toán', 'Trạng thái'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        onUpdate={handleStatusUpdate}
                        updating={updatingId === order.id}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                id={`admin-orders-page-${i}`}
                onClick={() => load(i)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${i === currentPage
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-primary hover:text-primary'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-6 flex items-center gap-2 text-xs text-stone-400 justify-end">
          <Users size={12} />
          <span>{filtered.length} đơn hàng hiển thị</span>
        </div>
      </div>
    </div>
  );
}
