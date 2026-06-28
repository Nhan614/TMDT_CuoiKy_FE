import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Loader2,
  Building2,
  User,
  Hash,
  Coins,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchWalletBalance,
  fetchWalletTransactions,
  fetchWithdrawals,
  requestWithdrawal,
} from "../../features/wallet/walletThunk";
import { clearWalletMessages } from "../../features/wallet/walletSlice";
import type { WithdrawalStatus } from "../../features/wallet/walletType";

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
    label: "Thành công",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  },
};

export default function ArtisanWalletPage() {
  const dispatch = useAppDispatch();
  const {
    balance,
    transactions,
    withdrawals,
    isLoading,
    isSubmitting,
    error,
  } = useAppSelector((state) => state.wallet);

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const [activeTab, setActiveTab] = useState<"transactions" | "withdrawals">("transactions");

  useEffect(() => {
    dispatch(fetchWalletBalance());
    dispatch(fetchWalletTransactions({ page: 0, size: 10 }));
    dispatch(fetchWithdrawals({ page: 0, size: 10 }));
    return () => {
      dispatch(clearWalletMessages());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchWalletBalance());
    dispatch(fetchWalletTransactions({ page: 0, size: 10 }));
    dispatch(fetchWithdrawals({ page: 0, size: 10 }));
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 1000) {
      alert("Số tiền rút tối thiểu là 1,000 VNĐ");
      return;
    }
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng");
      return;
    }

    const res = await dispatch(
      requestWithdrawal({
        amount: Number(amount),
        bankName,
        accountNumber,
        accountHolder,
      })
    );

    if (requestWithdrawal.fulfilled.match(res)) {
      setShowModal(false);
      setAmount("");
      setBankName("");
      setAccountNumber("");
      setAccountHolder("");
      dispatch(fetchWalletBalance());
      dispatch(fetchWithdrawals({ page: 0, size: 10 }));
      alert(res.payload.message || "Tạo yêu cầu rút tiền thành công!");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-50/55">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Ví tiền Nghệ nhân</h1>
            <p className="text-stone-400 text-sm mt-1">Xem số dư, lịch sử giao dịch và gửi yêu cầu rút tiền</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="p-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title="Làm mới"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                dispatch(clearWalletMessages());
                setShowModal(true);
              }}
              className="bg-primary hover:brightness-105 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-primary/20 text-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Yêu cầu rút tiền
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Balance Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
              <Wallet size={200} />
            </div>
            <div className="space-y-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-widest block">Số dư hiện tại</span>
              <h2 className="text-4xl font-extrabold tracking-tight">{formatCurrency(balance)}</h2>
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs text-stone-400">
              <Coins size={14} className="text-primary" />
              <span>Đơn vị tiền tệ mặc định: Việt Nam Đồng (VND)</span>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 flex flex-col justify-between space-y-4">
            <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wider">Hạn mức rút tiền</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Dưới 5.000.000₫:</span>
                <span className="font-bold text-green-600">Tự động duyệt</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Từ 5.000.000₫ trở lên:</span>
                <span className="font-bold text-amber-500">Admin xét duyệt</span>
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-400 leading-relaxed border border-stone-100">
              Yêu cầu tự động duyệt sẽ lập tức trừ số dư. Yêu cầu chờ Admin duyệt sẽ chỉ tạm khóa số dư và sẽ trừ khi được phê duyệt.
            </div>
          </div>
        </div>

        {/* Tab Controls & History List */}
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-stone-100 px-6 pt-4 gap-4">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "transactions"
                  ? "border-primary text-stone-800"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Lịch sử giao dịch
            </button>
            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "withdrawals"
                  ? "border-primary text-stone-800"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Lịch sử rút tiền
            </button>
          </div>

          <div className="p-6">
            {isLoading && transactions.length === 0 && withdrawals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-xs italic">Đang tải lịch sử...</span>
              </div>
            ) : activeTab === "transactions" ? (
              
              /* Transactions List */
              transactions.length === 0 ? (
                <div className="text-center py-16 text-stone-400 text-sm">
                  Chưa có giao dịch phát sinh nào.
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center p-4 hover:bg-stone-50 rounded-2xl transition-colors border border-stone-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.type === "CREDIT"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {tx.type === "CREDIT" ? (
                            <ArrowUpRight size={18} />
                          ) : (
                            <ArrowDownRight size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-700 leading-tight">
                            {tx.description}
                          </p>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {formatDate(tx.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-extrabold ${
                            tx.type === "CREDIT" ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {tx.type === "CREDIT" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
                        <span className="text-[10px] text-stone-400">
                          Sau giao dịch: {formatCurrency(tx.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              
              /* Withdrawals List */
              withdrawals.length === 0 ? (
                <div className="text-center py-16 text-stone-400 text-sm">
                  Chưa có yêu cầu rút tiền nào được tạo.
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((req) => {
                    const cfg = STATUS_WITHDRAWAL_CFG[req.status];
                    return (
                      <div
                        key={req.id}
                        className="p-4 border border-stone-100 rounded-2xl space-y-3 bg-stone-50/20"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-50 pb-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-stone-400 font-mono">
                              Yêu cầu #{req.id} • {formatDate(req.createdAt)}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-extrabold text-stone-700">
                                {formatCurrency(req.amount)}
                              </span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-500">
                          <div>
                            <span className="text-stone-400">Ngân hàng:</span>{" "}
                            <span className="font-bold text-stone-600">{req.bankName}</span>
                          </div>
                          <div>
                            <span className="text-stone-400">Số tài khoản:</span>{" "}
                            <span className="font-mono text-stone-600">{req.accountNumber}</span>
                          </div>
                          <div>
                            <span className="text-stone-400">Chủ tài khoản:</span>{" "}
                            <span className="font-bold text-stone-600 uppercase">{req.accountHolder}</span>
                          </div>
                        </div>
                        {req.note && (
                          <div className="p-3 bg-red-50/40 border border-red-100 rounded-xl text-xs text-red-700">
                            <strong>Ghi chú:</strong> {req.note}
                            {req.reviewerName && (
                              <span className="block text-[10px] text-red-500 mt-1 font-mono">
                                Phản hồi bởi admin: @{req.reviewerName} vào lúc {formatDate(req.reviewedAt || "")}
                              </span>
                            )}
                          </div>
                        )}
                        {req.status === "APPROVED" && req.reviewedAt && (
                          <div className="text-[10px] text-stone-400 text-right italic font-mono">
                            Đã chuyển khoản bởi admin: @{req.reviewerName} ({formatDate(req.reviewedAt)})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ─── Create Withdrawal Request Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <Wallet size={18} className="text-primary" />
                Yêu cầu rút tiền
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Số tiền muốn rút (VNĐ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Coins className="absolute left-3.5 top-3.5 text-stone-400" size={16} />
                  <input
                    type="number"
                    min="1000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Tối thiểu 1000 VNĐ"
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-stone-800 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Tên ngân hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 text-stone-400" size={16} />
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="VD: Vietcombank, Techcombank..."
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-3.5 text-stone-400" size={16} />
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Nhập số tài khoản ngân hàng"
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Tên chủ tài khoản (Viết hoa không dấu) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-stone-400" size={16} />
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="VD: NGUYEN VAN A"
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-stone-800 uppercase"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
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
                  className="flex-1 px-4 py-3 rounded-xl bg-primary hover:brightness-105 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Plus size={14} />
                  )}
                  Tạo yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
