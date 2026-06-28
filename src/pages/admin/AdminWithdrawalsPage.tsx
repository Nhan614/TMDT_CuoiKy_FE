import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  User,
  Hash,
  Clock,
  MessageSquare,
  X,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAdminWithdrawals, reviewWithdrawal } from "../../features/wallet/walletThunk";
import { clearWalletMessages } from "../../features/wallet/walletSlice";
import type { WithdrawalStatus, WithdrawalRequestDTO } from "../../features/wallet/walletType";

const formatCurrency = (n: number) => n.toLocaleString("vi-VN") + "₫";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "Chưa cập nhật" : date.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const STATUS_WITHDRAWAL_CFG: Record<
  WithdrawalStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  },
  COMPLETED: {
    label: "Tự động duyệt",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  },
};

export default function AdminWithdrawalsPage() {
  const dispatch = useAppDispatch();
  const { adminWithdrawals, isLoading, isSubmitting, error, totalPages, currentPage } = useAppSelector(
    (state) => state.wallet
  );

  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | "ALL">("PENDING");

  // Review Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<WithdrawalRequestDTO | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    dispatch(fetchAdminWithdrawals({ status: statusFilter, page: 0, size: 10 }));
    return () => {
      dispatch(clearWalletMessages());
    };
  }, [dispatch, statusFilter]);

  const handlePageChange = (page: number) => {
    dispatch(fetchAdminWithdrawals({ status: statusFilter, page, size: 10 }));
  };

  const handleReviewClick = (req: WithdrawalRequestDTO, type: "APPROVE" | "REJECT") => {
    setSelectedReq(req);
    setActionType(type);
    setReviewNote("");
    dispatch(clearWalletMessages());
    setShowModal(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (actionType === "REJECT" && !reviewNote.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }

    const res = await dispatch(
      reviewWithdrawal({
        id: selectedReq.id,
        action: actionType,
        note: reviewNote,
      })
    );

    if (reviewWithdrawal.fulfilled.match(res)) {
      setShowModal(false);
      setSelectedReq(null);
      setReviewNote("");
      dispatch(fetchAdminWithdrawals({ status: statusFilter, page: currentPage, size: 10 }));
      alert(res.payload.message || "Xử lý yêu cầu rút tiền thành công!");
    }
  };

  const tabs: { label: string; value: WithdrawalStatus | "ALL" }[] = [
    { label: "Chờ xét duyệt (PENDING)", value: "PENDING" },
    { label: "Đã duyệt (APPROVED)", value: "APPROVED" },
    { label: "Tự động duyệt (COMPLETED)", value: "COMPLETED" },
    { label: "Bị từ chối (REJECTED)", value: "REJECTED" },
    { label: "Tất cả", value: "ALL" },
  ];

  return (
    <div className="min-h-screen bg-stone-100/50 p-6 sm:p-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-stone-850">Duyệt yêu cầu rút tiền</h1>
        <p className="text-xs text-stone-400 mt-1">
          Duyệt hoặc từ chối các yêu cầu rút tiền có giá trị lớn hơn hoặc bằng 5,000,000 VNĐ từ thợ thủ công.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.value
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-6">
        
        {isLoading && adminWithdrawals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-stone-400 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="text-xs italic">Đang tải các yêu cầu rút tiền...</span>
          </div>
        ) : adminWithdrawals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-2">
            <AlertCircle size={36} className="text-stone-350" />
            <span className="text-sm">Không tìm thấy yêu cầu rút tiền nào ở trạng thái này.</span>
          </div>
        ) : (
          <div className="space-y-6">
            {adminWithdrawals.map((req) => {
              const cfg = STATUS_WITHDRAWAL_CFG[req.status];
              const isPending = req.status === "PENDING";
              return (
                <div
                  key={req.id}
                  className="p-5 border border-stone-200 rounded-2xl space-y-4 hover:shadow-sm transition-shadow bg-stone-50/20"
                >
                  
                  {/* Item Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-400 font-mono">YÊU CẦU #{req.id}</span>
                        <span className="text-[10px] text-stone-300">•</span>
                        <span className="text-[10px] text-stone-400 font-mono">{formatDate(req.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">Thợ thủ công:</span>
                        <span className="text-sm font-bold text-stone-700">@{req.username}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-stone-400 text-[10px] uppercase font-bold block">Số tiền rút</span>
                        <span className="text-base font-extrabold text-stone-800">{formatCurrency(req.amount)}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Bank Account Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Building2 className="text-stone-450 shrink-0" size={16} />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold">NGÂN HÀNG</span>
                        <span className="font-bold text-stone-700">{req.bankName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Hash className="text-stone-450 shrink-0" size={16} />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold">SỐ TÀI KHOẢN</span>
                        <span className="font-mono font-bold text-stone-700">{req.accountNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <User className="text-stone-450 shrink-0" size={16} />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold">TÊN CHỦ TÀI KHOẢN</span>
                        <span className="font-bold text-stone-700 uppercase">{req.accountHolder}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action or Notes */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div>
                      {req.note && (
                        <div className="p-3 bg-stone-100/50 border border-stone-200 rounded-xl text-xs text-stone-600 max-w-lg">
                          <strong>Ghi chú duyệt:</strong> {req.note}
                          <span className="block text-[10px] text-stone-400 mt-1 font-mono">
                            Phê duyệt bởi: @{req.reviewerName} vào {formatDate(req.reviewedAt || "")}
                          </span>
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReviewClick(req, "APPROVE")}
                          className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-green-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Duyệt chuyển khoản
                        </button>
                        <button
                          onClick={() => handleReviewClick(req, "REJECT")}
                          className="px-4 py-2.5 bg-white border border-red-300 hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle size={14} /> Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  i === currentPage
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

      {/* ─── Review Modal ─── */}
      {showModal && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                {actionType === "APPROVE" ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                {actionType === "APPROVE" ? "Duyệt yêu cầu rút tiền" : "Từ chối yêu cầu rút tiền"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Yêu cầu từ thợ:</span>
                  <span className="font-bold text-stone-700">@{selectedReq.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Số tiền rút:</span>
                  <span className="font-extrabold text-stone-800 text-sm">{formatCurrency(selectedReq.amount)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200/60 pt-2 text-[11px] text-stone-500">
                  <span>Chuyển tới:</span>
                  <span className="font-bold text-stone-600 uppercase">
                    {selectedReq.bankName} • {selectedReq.accountNumber} • {selectedReq.accountHolder}
                  </span>
                </div>
              </div>

              {actionType === "APPROVE" ? (
                <div className="p-3 bg-green-50 border border-green-200 text-[11px] text-green-700 rounded-xl leading-relaxed">
                  Bấm duyệt đồng nghĩa bạn xác nhận **đã thực chuyển tiền** {formatCurrency(selectedReq.amount)} qua ngân hàng cho thợ thủ công. Số dư của thợ sẽ bị trừ lập tức.
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 text-[11px] text-red-700 rounded-xl leading-relaxed">
                  Bấm từ chối sẽ hủy bỏ yêu cầu này, số dư thợ sẽ được giải tỏa (không bị tạm giữ nữa). Bạn **bắt buộc** phải nhập lý do từ chối dưới đây.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  {actionType === "APPROVE" ? "Ghi chú duyệt (tùy chọn)" : "Lý do từ chối (bắt buộc) *"}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 text-stone-400" size={16} />
                  <textarea
                    rows={3}
                    required={actionType === "REJECT"}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder={
                      actionType === "APPROVE"
                        ? "VD: Đã chuyển khoản qua Vietcombank..."
                        : "VD: Thông tin tài khoản ngân hàng không chính xác..."
                    }
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-stone-800 resize-y"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    actionType === "APPROVE"
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
                      : "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : actionType === "APPROVE" ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {actionType === "APPROVE" ? "Duyệt" : "Từ chối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
