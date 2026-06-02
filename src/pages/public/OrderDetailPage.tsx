import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Package,
  MapPin,
  MessageSquare,
  CreditCard,
  Banknote,
  Loader2,
  XCircle,
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  Home,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchOrderById, cancelOrder } from '../../features/orders/orderThunk';
import { createVNPayPayment } from '../../features/orders/paymentThunk';
import { clearOrderMessages } from '../../features/orders/orderSlice';
import type { OrderStatus, PaymentStatus } from '../../features/orders/orderType';

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
  FAILED: { label: 'Thanh toán thất bại', className: 'bg-red-100 text-red-600 border-red-200' },
};

// ─── Timeline steps ──────────────────────────────────────────────────────────
const TIMELINE_STEPS: { status: OrderStatus; icon: React.ElementType; label: string }[] = [
  { status: 'PENDING',    icon: Clock,       label: 'Chờ xác nhận' },
  { status: 'CONFIRMED',  icon: CheckCircle, label: 'Đã xác nhận' },
  { status: 'PROCESSING', icon: Package,     label: 'Đang xử lý' },
  { status: 'SHIPPED',    icon: Truck,       label: 'Đang giao hàng' },
  { status: 'DELIVERED',  icon: Home,        label: 'Đã nhận hàng' },
];

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentOrder, isLoading, isCreating, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(Number(id)));
    return () => { dispatch(clearOrderMessages()); };
  }, [dispatch, id]);

  const handleCancel = async () => {
    if (!currentOrder) return;
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    await dispatch(cancelOrder(currentOrder.id));
  };

  const handleRepay = async () => {
    if (!currentOrder) return;
    const result = await dispatch(createVNPayPayment({ orderId: currentOrder.id }));
    if (createVNPayPayment.fulfilled.match(result) && result.payload.success) {
      window.location.href = result.payload.data.paymentUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary opacity-60" />
      </div>
    );
  }

  if (error && !currentOrder) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>
    );
  }

  if (!currentOrder) return null;

  const order = currentOrder;
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';
  const currentStepIdx = isCancelled ? -1 : STATUS_ORDER.indexOf(order.status);
  const canCancel = order.status === 'PENDING' && order.paymentStatus === 'UNPAID';
  const canRepay =
    order.status === 'PENDING' &&
    order.paymentStatus === 'UNPAID' &&
    order.paymentMethod === 'VNPAY';

  const orderStatusCfg = ORDER_STATUS_CONFIG[order.status];
  const paymentStatusCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Tất cả đơn hàng</span>
        </Link>

        {/* Error banner */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ── Header card ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-stone-800 to-stone-700 px-6 py-5 text-white">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Mã đơn hàng</p>
                  <p className="text-xl font-mono font-bold">{order.orderCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-stone-400 text-xs mb-1">Ngày đặt</p>
                  <p className="text-sm">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusCfg.className}`}>
                  {orderStatusCfg.label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${paymentStatusCfg.className}`}>
                  {paymentStatusCfg.label}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                  {order.paymentMethod === 'VNPAY' ? <CreditCard size={11} /> : <Banknote size={11} />}
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            {/* ── Timeline ── */}
            {!isCancelled && (
              <div className="px-6 py-5 overflow-x-auto">
                <div className="flex items-center min-w-max gap-0">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= currentStepIdx;
                    const isActive = idx === currentStepIdx;
                    return (
                      <div key={step.status} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-primary text-white shadow-md shadow-primary/30'
                                : 'bg-stone-100 text-stone-300'
                            } ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                          >
                            <Icon size={16} />
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-center whitespace-nowrap max-w-[72px] ${
                              isCompleted ? 'text-primary' : 'text-stone-300'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && (
                          <div
                            className={`w-16 h-0.5 mx-1 mb-4 transition-colors ${
                              idx < currentStepIdx ? 'bg-primary' : 'bg-stone-200'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="px-6 py-4 flex items-center gap-2 text-red-500 bg-red-50 border-t border-red-100">
                <XCircle size={16} />
                <span className="text-sm font-medium">Đơn hàng này đã bị hủy / hoàn tiền</span>
              </div>
            )}
          </div>

          {/* ── Items list ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
              <Package size={16} className="text-stone-400" />
              <h2 className="font-bold text-stone-800">Sản phẩm đã đặt</h2>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {formatCurrency(item.productPrice)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-stone-800 text-sm shrink-0">
                    {formatCurrency(item.subTotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
              <span className="font-bold text-stone-700">Tổng cộng</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* ── Shipping info ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Địa chỉ giao hàng</p>
                <p className="text-sm text-stone-700 font-medium">{order.shippingAddress}</p>
              </div>
            </div>
            {order.note && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-stone-400" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Ghi chú</p>
                  <p className="text-sm text-stone-600">{order.note}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          {(canCancel || canRepay) && (
            <div className="flex flex-wrap gap-3">
              {canRepay && (
                <button
                  id="repay-order-btn"
                  onClick={handleRepay}
                  disabled={isCreating}
                  className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  Thanh toán lại (VNPay)
                </button>
              )}
              {canCancel && (
                <button
                  id="cancel-order-detail-btn"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-red-200 text-red-500 font-bold px-5 py-3 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Hủy đơn hàng
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
