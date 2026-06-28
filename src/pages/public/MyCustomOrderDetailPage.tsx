import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  Clock,
  Loader2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileImage,
  CreditCard,
  Hourglass,
  Hammer,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMyCustomOrderById,
  cancelMyCustomOrder,
  confirmAndPay,
  confirmReceived,
} from "../../features/customOrders/customOrderThunk";
import {
  clearCustomOrderMessages,
  clearPaymentUrl,
} from "../../features/customOrders/customOrderSlice";
import type { CustomOrderStatus } from "../../features/customOrders/customOrderType";

const formatCurrency = (n: number) => n.toLocaleString("vi-VN") + "₫";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "Chưa cập nhật" : date.toLocaleDateString("vi-VN");
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Chưa cập nhật"
    : date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
};

const STATUS_CONFIG: Record<CustomOrderStatus, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Chờ xử lý",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  ACCEPTED: {
    label: "Đã chấp nhận - Chờ thanh toán",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
  },
  REJECTED: {
    label: "Đã từ chối",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-stone-100 text-stone-600 border-stone-200",
    icon: <Trash2 className="w-4 h-4 text-stone-500" />,
  },
  PAYMENT_PENDING: {
    label: "Đang xử lý thanh toán",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Hourglass className="w-4 h-4 text-blue-500" />,
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: <Hammer className="w-4 h-4 text-indigo-500" />,
  },
  DELIVERED: {
    label: "Đã bàn giao - Chờ nhận",
    className: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <CheckCircle className="w-4 h-4 text-purple-500" />,
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-teal-100 text-teal-700 border-teal-200",
    icon: <CheckCircle className="w-4 h-4 text-teal-500" />,
  },
};

export default function MyCustomOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const dispatch = useAppDispatch();

  const { myCurrentOrder, isLoading, isSubmitting, error, paymentUrl } = useAppSelector(
    (state) => state.customOrders
  );

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchMyCustomOrderById(orderId));
    }
    return () => {
      dispatch(clearCustomOrderMessages());
      dispatch(clearPaymentUrl());
    };
  }, [dispatch, orderId]);

  // Redirect to VNPay when paymentUrl is ready
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  useEffect(() => {
    if (myCurrentOrder?.referenceImageUrls && myCurrentOrder.referenceImageUrls.length > 0) {
      setActiveImage(myCurrentOrder.referenceImageUrls[0]);
    }
  }, [myCurrentOrder]);

  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy yêu cầu gia công này không?")) return;
    const result = await dispatch(cancelMyCustomOrder(orderId));
    if (cancelMyCustomOrder.fulfilled.match(result)) {
      alert("Hủy yêu cầu thành công!");
    }
  };

  const handleConfirmPayment = async () => {
    if (
      !window.confirm(
        "Bạn xác nhận báo giá từ nghệ nhân và tiến hành thanh toán qua VNPay?"
      )
    )
      return;
    dispatch(confirmAndPay(orderId));
  };

  const handleConfirmReceived = async () => {
    if (
      !window.confirm(
        "Bạn xác nhận đã nhận hàng gia công thành công? Tiền sẽ được chuyển cho thợ thủ công."
      )
    )
      return;
    const result = await dispatch(confirmReceived(orderId));
    if (confirmReceived.fulfilled.match(result)) {
      alert("Xác nhận đã nhận hàng thành công!");
    }
  };

  if (isLoading && !myCurrentOrder) {
    return (
      <div className="flex justify-center items-center py-40 flex-col gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-sm text-secondary">Đang tải thông tin chi tiết...</p>
      </div>
    );
  }

  if (!myCurrentOrder) {
    return (
      <div className="text-center py-40">
        <p className="text-secondary mb-4">Không tìm thấy thông tin yêu cầu gia công hoặc lỗi kết nối.</p>
        <Link to="/custom-orders/my" className="text-primary font-bold underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[myCurrentOrder.status];
  const canCancel =
    myCurrentOrder.status === "PENDING" || myCurrentOrder.status === "ACCEPTED";
  const canPay = myCurrentOrder.status === "ACCEPTED" && myCurrentOrder.quotedPrice;
  const canConfirmReceived = myCurrentOrder.status === "DELIVERED";

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-50/55">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/custom-orders/my"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại danh sách đơn gia công
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Info Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-6">

              {/* Title & Status */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <span className="text-xs text-stone-400 font-mono">Mã số yêu cầu: #{myCurrentOrder.id}</span>
                  <h1 className="text-2xl font-bold text-stone-800 leading-tight">{myCurrentOrder.title}</h1>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}>
                  {statusCfg.icon}
                  {statusCfg.label}
                </span>
              </div>

              {/* General Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-stone-700">Mô tả yêu cầu</h3>
                <p className="text-sm text-stone-500 whitespace-pre-line leading-relaxed">
                  {myCurrentOrder.description}
                </p>
              </div>

              {/* Order Metadata */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-stone-50 rounded-2xl text-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Ngân sách</span>
                  <div className="flex items-center justify-center text-primary font-bold text-sm sm:text-base">
                    <CircleDollarSign size={14} className="mr-1 shrink-0" />
                    {formatCurrency(myCurrentOrder.budget)}
                  </div>
                </div>
                <div className="space-y-1 border-x border-stone-200">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Số lượng</span>
                  <div className="flex items-center justify-center text-stone-700 font-bold text-sm sm:text-base">
                    <Clock size={14} className="mr-1 shrink-0" />
                    {myCurrentOrder.quantity} sản phẩm
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Hạn hoàn thành</span>
                  <div className="flex items-center justify-center text-stone-700 font-bold text-sm sm:text-base">
                    <Calendar size={14} className="mr-1 shrink-0" />
                    {formatDate(myCurrentOrder.deadline)}
                  </div>
                </div>
              </div>

              {/* Artisan Response Detail */}
              {(myCurrentOrder.quotedPrice || myCurrentOrder.artisanNote) && (
                <div className="p-5 border border-primary/10 rounded-2xl space-y-3 bg-gradient-to-br from-beige/10 to-transparent">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <CheckCircle size={16} />
                    Phản hồi từ Nghệ nhân
                  </h3>

                  {myCurrentOrder.quotedPrice && (
                    <div className="flex items-center justify-between py-2 border-b border-primary/5">
                      <span className="text-xs text-stone-500 font-medium">Báo giá của nghệ nhân:</span>
                      <strong className="text-primary text-base font-bold">{formatCurrency(myCurrentOrder.quotedPrice)}</strong>
                    </div>
                  )}

                  {myCurrentOrder.artisanNote && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-400 font-bold block uppercase">
                        {myCurrentOrder.status === "REJECTED" ? "Lý do từ chối:" : "Ghi chú của nghệ nhân:"}
                      </span>
                      <p className="text-sm text-stone-600 italic">
                        "{myCurrentOrder.artisanNote}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Info (when paid) */}
              {myCurrentOrder.paymentStatus === "PAID" && myCurrentOrder.paymentAt && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                  <h3 className="text-sm font-bold text-teal-700 flex items-center gap-1.5">
                    <CreditCard size={15} />
                    Thông tin thanh toán
                  </h3>
                  <div className="flex items-center justify-between text-xs text-teal-700">
                    <span>Trạng thái:</span>
                    <span className="font-bold">Đã thanh toán ✓</span>
                  </div>
                  {myCurrentOrder.paymentTransactionId && (
                    <div className="flex items-center justify-between text-xs text-teal-700">
                      <span>Mã giao dịch:</span>
                      <span className="font-mono font-bold">{myCurrentOrder.paymentTransactionId}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-teal-700">
                    <span>Thời gian thanh toán:</span>
                    <span className="font-bold">{formatDateTime(myCurrentOrder.paymentAt)}</span>
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {myCurrentOrder.referenceImageUrls && myCurrentOrder.referenceImageUrls.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                    <FileImage size={16} className="text-stone-400" />
                    Ảnh mẫu tham khảo ({myCurrentOrder.referenceImageUrls.length})
                  </h3>

                  <div className="space-y-4">
                    {activeImage && (
                      <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                        <img src={activeImage} alt="Active Preview" className="w-full h-full object-contain" />
                      </div>
                    )}

                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {myCurrentOrder.referenceImageUrls.map((url, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveImage(url)}
                          className={`w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border shrink-0 transition-all ${activeImage === url ? "border-primary ring-2 ring-primary/10" : "border-stone-200"
                            }`}
                        >
                          <img src={url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Artisan Details & Actions */}
          <div className="lg:col-span-4 space-y-6">

            {/* Artisan Summary Card */}
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 text-center space-y-4">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">
                Nghệ nhân thực hiện
              </span>
              <img
                src={myCurrentOrder.artisanImage}
                alt={myCurrentOrder.artisanName}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-sm mx-auto"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-stone-800 text-lg leading-tight">{myCurrentOrder.artisanName}</h3>
                <Link
                  to={`/artisans/${myCurrentOrder.artisanId}`}
                  className="text-xs text-primary font-bold hover:underline mt-1 inline-block"
                >
                  Xem hồ sơ nghệ nhân
                </Link>
              </div>
            </div>

            {/* Pay Action Card — only when ACCEPTED and has quotedPrice */}
            {canPay && (
              <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-6 space-y-4">
                <h4 className="text-sm font-bold text-stone-700">Xác nhận & Thanh toán</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Nghệ nhân đã báo giá{" "}
                  <strong className="text-primary">{formatCurrency(myCurrentOrder.quotedPrice!)}</strong>.
                  Nhấn xác nhận để thanh toán qua VNPay và bắt đầu sản xuất.
                </p>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:brightness-105 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 text-sm cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  Thanh toán ngay
                </button>
              </div>
            )}

            {/* Confirm Received Action Card */}
            {canConfirmReceived && (
              <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-4">
                <h4 className="text-sm font-bold text-stone-700">Xác nhận nhận hàng</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Nghệ nhân đã hoàn thành và bàn giao sản phẩm. Nhấn xác nhận nếu bạn đã nhận đúng và đủ sản phẩm gia công.
                </p>
                <button
                  onClick={handleConfirmReceived}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:brightness-105 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 text-sm cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Đã nhận được hàng
                </button>
              </div>
            )}

            {/* Cancel Action Card */}
            {canCancel && (
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 space-y-4">
                <h4 className="text-sm font-bold text-stone-700">Hành động của bạn</h4>
                <button
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-red-200 text-sm cursor-pointer"
                >
                  <Trash2 size={16} />
                  Hủy yêu cầu này
                </button>
                <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                  {myCurrentOrder.status === "PENDING"
                    ? "Bạn có thể hủy yêu cầu bất cứ lúc nào trước khi nghệ nhân chấp nhận."
                    : "Bạn có thể hủy khi chưa thanh toán (đơn sẽ về trạng thái Đã hủy)."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
