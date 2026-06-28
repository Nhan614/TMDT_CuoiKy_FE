import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  CircleDollarSign,
  CheckCircle,
  X,
  FileImage,
  ShieldAlert,
  Hammer,
  CreditCard,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyProfile } from "../../features/user/userThunk";
import {
  fetchArtisanCustomOrderById,
  acceptCustomOrder,
  rejectCustomOrder,
  completeCustomOrder,
} from "../../features/customOrders/customOrderThunk";
import { clearCustomOrderMessages } from "../../features/customOrders/customOrderSlice";
import type { CustomOrderStatus } from "../../features/customOrders/customOrderType";

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
  PAYMENT_PENDING: { label: "Đang xử lý thanh toán", className: "bg-blue-100 text-blue-700 border-blue-200" },
  IN_PROGRESS: { label: "Đang thực hiện", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  DELIVERED: { label: "Đã giao hàng - Chờ khách nhận", className: "bg-purple-100 text-purple-700 border-purple-200" },
  COMPLETED: { label: "Hoàn thành", className: "bg-teal-100 text-teal-700 border-teal-200" },
};

export default function ArtisanCustomOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state.user);
  const { artisanCurrentOrder, isLoading, isSubmitting, error, successMessage } = useAppSelector(
    (state) => state.customOrders
  );

  // Accept form state
  const [quotedPrice, setQuotedPrice] = useState("");
  const [acceptNote, setAcceptNote] = useState("");

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  // Image gallery state
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyProfile());
    if (orderId) {
      dispatch(fetchArtisanCustomOrderById(orderId));
    }
    return () => {
      dispatch(clearCustomOrderMessages());
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    if (artisanCurrentOrder?.referenceImageUrls?.length) {
      setActiveImage(artisanCurrentOrder.referenceImageUrls[0]);
    }
  }, [artisanCurrentOrder]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotedPrice || Number(quotedPrice) <= 0) {
      alert("Vui lòng nhập giá báo hợp lệ!");
      return;
    }
    const result = await dispatch(
      acceptCustomOrder({
        id: orderId,
        payload: { quotedPrice: Number(quotedPrice), artisanNote: acceptNote },
      })
    );
    if (acceptCustomOrder.fulfilled.match(result)) {
      alert("Bạn đã chấp nhận yêu cầu gia công này! Khách hàng sẽ tiến hành thanh toán.");
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectNote.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }
    const result = await dispatch(
      rejectCustomOrder({
        id: orderId,
        payload: { artisanNote: rejectNote },
      })
    );
    if (rejectCustomOrder.fulfilled.match(result)) {
      setShowRejectModal(false);
      alert("Bạn đã từ chối yêu cầu gia công này.");
    }
  };

  const handleComplete = async () => {
    if (!window.confirm("Đánh dấu đơn gia công này đã hoàn thành & giao hàng?")) return;
    const result = await dispatch(completeCustomOrder(orderId));
    if (completeCustomOrder.fulfilled.match(result)) {
      alert("Đơn gia công đã được đánh dấu bàn giao thành công!");
    }
  };

  if (isLoading && !artisanCurrentOrder) {
    return (
      <div className="flex justify-center items-center py-40 flex-col gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-sm text-secondary">Đang tải thông tin chi tiết...</p>
      </div>
    );
  }

  if (currentUser && currentUser.role !== "ARTISAN") {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
          <ShieldAlert size={36} className="text-amber-500" />
        </div>
        <p className="text-stone-500 text-sm">Trang này chỉ dành cho Nghệ nhân.</p>
        <Link to="/profile" className="text-primary font-bold text-sm underline">
          Đăng ký làm Nghệ nhân
        </Link>
      </div>
    );
  }

  if (!artisanCurrentOrder) {
    return (
      <div className="text-center py-40">
        <p className="text-secondary mb-4">Không tìm thấy thông tin yêu cầu gia công.</p>
        <Link to="/custom-orders/artisan" className="text-primary font-bold underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[artisanCurrentOrder.status];
  const isPending = artisanCurrentOrder.status === "PENDING";
  const isInProgress = artisanCurrentOrder.status === "IN_PROGRESS";

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-50/55">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          to="/custom-orders/artisan"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại danh sách yêu cầu
        </Link>

        {(error || successMessage) && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${error
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
            }`}>
            {error || successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-6">

              {/* Title & Status */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <span className="text-xs text-stone-400 font-mono">Mã yêu cầu: #{artisanCurrentOrder.id}</span>
                  <h1 className="text-2xl font-bold text-stone-800 leading-tight">
                    {artisanCurrentOrder.title}
                  </h1>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}>
                  {statusCfg.label}
                </span>
              </div>

              {/* Customer info */}
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {artisanCurrentOrder.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Khách hàng gửi yêu cầu</p>
                  <p className="font-bold text-stone-800 text-sm">@{artisanCurrentOrder.username}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Gửi lúc: {formatDate(artisanCurrentOrder.createdAt)}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-stone-700">Mô tả yêu cầu chi tiết</h3>
                <p className="text-sm text-stone-500 whitespace-pre-line leading-relaxed">
                  {artisanCurrentOrder.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-stone-50 rounded-2xl text-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Ngân sách</span>
                  <div className="flex items-center justify-center text-primary font-bold text-sm sm:text-base">
                    <CircleDollarSign size={14} className="mr-1 shrink-0" />
                    {formatCurrency(artisanCurrentOrder.budget)}
                  </div>
                </div>
                <div className="space-y-1 border-x border-stone-200">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Số lượng</span>
                  <div className="flex items-center justify-center text-stone-700 font-bold text-sm sm:text-base">
                    <Clock size={14} className="mr-1 shrink-0" />
                    {artisanCurrentOrder.quantity} sản phẩm
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Hạn hoàn thành</span>
                  <div className="flex items-center justify-center text-stone-700 font-bold text-sm sm:text-base">
                    <Calendar size={14} className="mr-1 shrink-0" />
                    {formatDate(artisanCurrentOrder.deadline)}
                  </div>
                </div>
              </div>

              {/* Reference Images Gallery */}
              {artisanCurrentOrder.referenceImageUrls?.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                    <FileImage size={16} className="text-stone-400" />
                    Ảnh mẫu tham khảo ({artisanCurrentOrder.referenceImageUrls.length})
                  </h3>

                  <div className="space-y-3">
                    {activeImage && (
                      <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                        <img src={activeImage} alt="Active" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {artisanCurrentOrder.referenceImageUrls.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImage(url)}
                          className={`w-14 h-14 rounded-xl overflow-hidden border shrink-0 transition-all ${activeImage === url
                              ? "border-primary ring-2 ring-primary/15"
                              : "border-stone-200 hover:border-stone-400"
                            }`}
                        >
                          <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Action Panel (only when PENDING) ─── */}
            {isPending && (
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-4">
                  Phản hồi yêu cầu này
                </h2>

                {/* Accept Form */}
                <form onSubmit={handleAccept} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-700">
                      Báo giá của bạn (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1000"
                      required
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      placeholder="VD: 750000"
                      className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-stone-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-700">
                      Ghi chú cho khách hàng (tùy chọn)
                    </label>
                    <textarea
                      rows={3}
                      value={acceptNote}
                      onChange={(e) => setAcceptNote(e.target.value)}
                      placeholder="VD: Tôi có thể thực hiện yêu cầu này trong vòng 2 tuần với loại len Nhật..."
                      className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-stone-800 resize-y"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-200 text-sm cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Chấp nhận & Báo giá
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none sm:w-40 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
                    >
                      <X size={16} />
                      Từ chối
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ─── Complete Order Panel (only when IN_PROGRESS) ─── */}
            {isInProgress && (
              <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-4 flex items-center gap-2">
                  <Hammer size={18} className="text-indigo-500" />
                  Giao hàng & Hoàn thành
                </h2>
                <p className="text-sm text-stone-500">
                  Khi bạn đã hoàn thành sản phẩm và bàn giao/gửi hàng cho khách, hãy đánh dấu đơn này đã được giao. Tiền sẽ được cộng vào số dư của bạn khi khách hàng bấm xác nhận đã nhận hàng.
                </p>
                {artisanCurrentOrder.quotedPrice && (
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-between text-sm">
                    <span className="text-teal-700 font-medium flex items-center gap-1.5"><CreditCard size={14} /> Đã thanh toán (tạm giữ):</span>
                    <strong className="text-teal-700">{formatCurrency(artisanCurrentOrder.quotedPrice)}</strong>
                  </div>
                )}
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200 text-sm cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Xác nhận đã giao hàng
                </button>
              </div>
            )}

            {/* ─── Delivered Wait Panel (only when DELIVERED) ─── */}
            {artisanCurrentOrder.status === "DELIVERED" && (
              <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-4 flex items-center gap-2">
                  <Clock size={18} className="text-purple-500" />
                  Đang chờ xác nhận
                </h2>
                <p className="text-sm text-stone-500">
                  Bạn đã đánh dấu bàn giao sản phẩm này. Đang chờ khách hàng xác nhận đã nhận hàng để cộng số dư tài khoản của bạn.
                </p>
                {artisanCurrentOrder.quotedPrice && (
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between text-sm">
                    <span className="text-purple-700 font-medium flex items-center gap-1.5"><CreditCard size={14} /> Số tiền sẽ nhận:</span>
                    <strong className="text-purple-700">{formatCurrency(artisanCurrentOrder.quotedPrice)}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Show final response when not PENDING */}
            {!isPending && (artisanCurrentOrder.quotedPrice || artisanCurrentOrder.artisanNote) && (
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 space-y-3">
                <h3 className="text-sm font-bold text-stone-700">Phản hồi của bạn</h3>
                {artisanCurrentOrder.quotedPrice && (
                  <div className="flex items-center justify-between py-2 border-b border-stone-100">
                    <span className="text-xs text-stone-500">Giá báo:</span>
                    <strong className="text-primary font-bold">{formatCurrency(artisanCurrentOrder.quotedPrice)}</strong>
                  </div>
                )}
                {artisanCurrentOrder.artisanNote && (
                  <p className="text-sm text-stone-500 italic">"{artisanCurrentOrder.artisanNote}"</p>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 space-y-3 text-sm sticky top-28">
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Tóm tắt đơn</p>
              <div className="space-y-3">
                <div className="flex justify-between text-stone-600">
                  <span>Trạng thái</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusCfg.className}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Ngân sách khách</span>
                  <strong className="text-stone-800">{formatCurrency(artisanCurrentOrder.budget)}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Số lượng</span>
                  <strong className="text-stone-800">{artisanCurrentOrder.quantity}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Hạn hoàn thành</span>
                  <strong className="text-stone-800">{formatDate(artisanCurrentOrder.deadline)}</strong>
                </div>
                {artisanCurrentOrder.quotedPrice && (
                  <div className="flex justify-between text-green-700 pt-2 border-t border-stone-100">
                    <span className="font-bold">Báo giá của bạn</span>
                    <strong>{formatCurrency(artisanCurrentOrder.quotedPrice)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Reject Modal ─── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
              <h2 className="text-lg font-bold text-stone-800">Từ chối yêu cầu</h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReject} className="p-6 space-y-4">
              <p className="text-sm text-stone-500">
                Vui lòng cung cấp lý do từ chối để khách hàng hiểu và cải thiện yêu cầu của họ.
              </p>

              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="VD: Tôi hiện không có đủ thời gian để thực hiện yêu cầu này trong thời hạn đã nêu..."
                  className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-red-200 focus:border-red-400 rounded-xl px-4 py-3 outline-none transition-all text-sm text-stone-800 resize-y"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-red-200 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <X size={16} />}
                  Xác nhận từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
