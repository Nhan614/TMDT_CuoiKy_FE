import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Package, ArrowLeft, Home, RefreshCw } from 'lucide-react';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get('status'); // "success" | "failed"
  const orderCode = searchParams.get('orderCode');
  const message = searchParams.get('message');

  const isSuccess = status === 'success';

  useEffect(() => {
    // Auto-redirect to order detail after 5s on success
    if (isSuccess && orderCode) {
      const timer = setTimeout(() => {
        navigate('/orders');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, orderCode, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20 flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-100 border border-stone-100 overflow-hidden">
          {/* Top color band */}
          <div
            className={`h-2 w-full ${isSuccess ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`}
          />

          <div className="p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                isSuccess ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 size={52} className="text-emerald-500" />
              ) : (
                <XCircle size={52} className="text-red-500" />
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`}
            >
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </motion.h1>

            {/* Sub message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-stone-500 text-sm mb-6 leading-relaxed"
            >
              {isSuccess
                ? 'Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ sớm nhất có thể!'
                : message || 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.'}
            </motion.p>

            {/* Order code badge */}
            {orderCode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono font-semibold mb-8 ${
                  isSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-stone-50 text-stone-600 border border-stone-200'
                }`}
              >
                <Package size={14} />
                {orderCode}
              </motion.div>
            )}

            {/* Auto-redirect hint */}
            {isSuccess && (
              <p className="text-xs text-stone-400 mb-6 italic">
                Tự động chuyển đến lịch sử đơn hàng sau 6 giây...
              </p>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {isSuccess ? (
                <>
                  <Link
                    to="/orders"
                    id="payment-view-orders-btn"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                  >
                    <Package size={16} />
                    Xem đơn hàng
                  </Link>
                  <Link
                    to="/home"
                    id="payment-back-home-btn"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-700 font-bold py-3 px-5 rounded-xl hover:bg-stone-200 transition-all"
                  >
                    <Home size={16} />
                    Trang chủ
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    id="payment-retry-btn"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                  >
                    <RefreshCw size={16} />
                    Thử lại
                  </Link>
                  <Link
                    to="/home"
                    id="payment-failed-home-btn"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-700 font-bold py-3 px-5 rounded-xl hover:bg-stone-200 transition-all"
                  >
                    <ArrowLeft size={16} />
                    Về trang chủ
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Support link */}
        <p className="text-center text-xs text-stone-400 mt-6">
          Cần hỗ trợ?{' '}
          <a href="mailto:support@artisanmarket.vn" className="text-primary hover:underline">
            Liên hệ chúng tôi
          </a>
        </p>
      </motion.div>
    </div>
  );
}
