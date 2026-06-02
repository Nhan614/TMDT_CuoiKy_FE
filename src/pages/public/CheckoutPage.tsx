import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  MessageSquare,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createOrder } from '../../features/orders/orderThunk';
import { createVNPayPayment } from '../../features/orders/paymentThunk';
import { clearOrderMessages } from '../../features/orders/orderSlice';
import type { PaymentMethod } from '../../features/orders/orderType';

const formatCurrency = (amount: number) =>
  amount.toLocaleString('vi-VN') + '₫';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart } = useAppSelector((state) => state.cart);
  const { isCreating, error, currentOrder } = useAppSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VNPAY');
  const [step, setStep] = useState<'form' | 'redirecting'>('form');

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  useEffect(() => {
    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim() || items.length === 0) return;

    const result = await dispatch(createOrder({ shippingAddress, note, paymentMethod }));

    if (createOrder.fulfilled.match(result) && result.payload.success) {
      const order = result.payload.data;

      if (paymentMethod === 'COD') {
        navigate(`/orders/${order.id}`);
      } else {
        // VNPAY: create payment URL then redirect
        setStep('redirecting');
        const payResult = await dispatch(createVNPayPayment({ orderId: order.id }));
        if (createVNPayPayment.fulfilled.match(payResult) && payResult.payload.success) {
          window.location.href = payResult.payload.data.paymentUrl;
        } else {
          setStep('form');
        }
      }
    }
  };

  if (items.length === 0 && !currentOrder) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag size={48} className="mx-auto text-stone-300" />
          <p className="text-stone-500">Giỏ hàng trống. Vui lòng thêm sản phẩm trước.</p>
          <Link to="/products" className="inline-block text-primary font-bold hover:underline">
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Back */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Quay lại giỏ hàng</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-10">
          Xác nhận đơn hàng
        </h1>

        {/* Redirect overlay */}
        <AnimatePresence>
          {step === 'redirecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-stone-800">Đang chuyển đến VNPay...</p>
                <p className="text-stone-500 mt-1 text-sm">Vui lòng không đóng trang này</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Left: Form ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shipping address */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-stone-800">Địa chỉ giao hàng</h2>
                </div>
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2"
                  >
                    Địa chỉ <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Ví dụ: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                    required
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-300 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-note"
                    className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={12} />
                      Ghi chú (không bắt buộc)
                    </span>
                  </label>
                  <textarea
                    id="checkout-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Hướng dẫn giao hàng, yêu cầu đặc biệt..."
                    rows={3}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-300 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm resize-none"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard size={18} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-stone-800">Phương thức thanh toán</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* VNPay */}
                  <label
                    htmlFor="pay-vnpay"
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'VNPAY'
                        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      id="pay-vnpay"
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={() => setPaymentMethod('VNPAY')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'VNPAY' ? 'border-primary' : 'border-stone-300'}`}>
                      {paymentMethod === 'VNPAY' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-blue-600" />
                        <span className="font-bold text-stone-800">VNPay</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">Thanh toán trực tuyến an toàn</p>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    htmlFor="pay-cod"
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      id="pay-cod"
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-stone-300'}`}>
                      {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote size={16} className="text-green-600" />
                        <span className="font-bold text-stone-800">COD</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">Thanh toán khi nhận hàng</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-stone-800 mb-5 pb-4 border-b border-stone-100">
                  Tóm tắt đơn hàng
                </h2>

                {/* Items list */}
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <img
                          src={item.productThumbnailUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://i.pinimg.com/736x/cb/fe/1a/cbfe1ae789e4b7b3b28c6f8e1558425a.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{item.productName}</p>
                        <p className="text-xs text-stone-400">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-stone-800 shrink-0">
                        {formatCurrency(item.subTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Tạm tính ({cart?.totalItems ?? 0} sản phẩm)</span>
                    <span className="font-semibold text-stone-700">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Phí vận chuyển</span>
                    <span className="italic text-stone-400">Tính toán sau</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-end">
                  <span className="text-base font-bold text-stone-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                </div>

                <motion.button
                  type="submit"
                  id="checkout-submit-btn"
                  disabled={isCreating || items.length === 0 || !shippingAddress.trim()}
                  whileHover={{ scale: isCreating ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-6 w-full bg-primary text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {paymentMethod === 'VNPAY' ? 'Đặt hàng & Thanh toán VNPay' : 'Đặt hàng (COD)'}
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-stone-400 mt-3">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
