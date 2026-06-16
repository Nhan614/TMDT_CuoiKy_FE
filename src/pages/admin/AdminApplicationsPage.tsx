import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Check,
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAdminApplications,
  approveApplication,
  rejectApplication,
} from '../../features/artisanApplications/artisanApplicationThunk';
import { clearApplicationMessages } from '../../features/artisanApplications/artisanApplicationSlice';
import type {
  ArtisanApplicationDTO,
  ApplicationStatus,
} from '../../features/artisanApplications/artisanApplicationType';

// --- Helpers ---
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// --- Status Config ---
const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDING: {
    label: 'Chờ Duyệt',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  APPROVED: {
    label: 'Đã Duyệt',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  REJECTED: {
    label: 'Từ Chối',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
];

// --- Reject Modal ---
function RejectModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">Lý do từ chối</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-stone-500">
            Vui lòng nhập lý do từ chối để ứng viên có thể cải thiện hồ sơ.
          </p>
          <textarea
            id="reject-reason-input"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="VD: Ảnh minh chứng chưa rõ ràng, cần chụp lại trong điều kiện ánh sáng tốt hơn..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none transition-all"
          />
          <div className="flex justify-end gap-3">
            <button
              id="reject-cancel-btn"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              id="reject-confirm-btn"
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim() || loading}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Detail Modal ---
function DetailModal({
  application,
  onClose,
  onApprove,
  onReject,
  loading,
}: {
  application: ArtisanApplicationDTO;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const cfg = STATUS_CONFIG[application.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {application.avatarUrl ? (
              <img
                src={application.avatarUrl}
                alt={application.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {application.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-stone-800">{application.fullName}</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {application.skillDisplayName || application.skill}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.className}`}
            >
              <StatusIcon size={12} />
              {cfg.label}
            </span>
            <button
              id="detail-modal-close"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Bio */}
          {application.bio && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Tiểu sử
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">{application.bio}</p>
            </div>
          )}

          {/* Quote */}
          {application.quote && (
            <div className="bg-stone-50 rounded-xl p-4 border-l-4 border-primary">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Châm ngôn
              </p>
              <p className="text-sm text-stone-700 italic">"{application.quote}"</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Ngày bắt đầu làm nghề
              </p>
              <p className="font-semibold text-stone-700">
                {application.startedCraftingDate
                  ? new Date(application.startedCraftingDate).toLocaleDateString('vi-VN')
                  : '—'}
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Ngày nộp đơn
              </p>
              <p className="font-semibold text-stone-700">{formatDate(application.createdAt)}</p>
            </div>
          </div>

          {application.portfolioUrl && (
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-stone-400 shrink-0" />
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline font-semibold truncate"
              >
                {application.portfolioUrl}
              </a>
            </div>
          )}

          {/* Proof Images */}
          {application.proofImageUrls && application.proofImageUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <ImageIcon size={11} />
                Ảnh minh chứng ({application.proofImageUrls.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {application.proofImageUrls.map((url, i) => (
                  <button
                    key={i}
                    id={`modal-proof-${application.id}-${i}`}
                    onClick={() => setLightboxSrc(url)}
                    className="aspect-square rounded-lg overflow-hidden border border-stone-200 hover:border-primary/50 hover:scale-105 transition-all"
                  >
                    <img
                      src={url}
                      alt={`Proof ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason if exists */}
          {application.status === 'REJECTED' && application.rejectionReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                Lý do từ chối
              </p>
              <p className="text-sm text-red-700">{application.rejectionReason}</p>
            </div>
          )}

          {/* Reviewed at */}
          {application.reviewedAt && (
            <p className="text-xs text-stone-400">
              Xét duyệt lúc: {formatDate(application.reviewedAt)}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        {application.status === 'PENDING' && (
          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/60 flex justify-end gap-3">
            <button
              id={`modal-reject-btn-${application.id}`}
              onClick={onReject}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <XCircle size={15} />
              Từ chối
            </button>
            <button
              id={`modal-approve-btn-${application.id}`}
              onClick={onApprove}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer shadow-md shadow-emerald-200"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              Duyệt đơn
            </button>
          </div>
        )}

        {application.status !== 'PENDING' && (
          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/60 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}
      </motion.div>

      {/* Lightbox inside modal */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={lightboxSrc}
              alt="Lightbox"
              className="max-w-3xl max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              onClick={() => setLightboxSrc(null)}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Application Row ---
function ApplicationRow({
  app,
  onView,
}: {
  app: ArtisanApplicationDTO;
  onView: (a: ArtisanApplicationDTO) => void;
}) {
  const cfg = STATUS_CONFIG[app.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="hover:bg-stone-50/60 transition-colors border-b border-stone-100 last:border-0"
    >
      {/* Người dùng */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {app.avatarUrl ? (
            <img
              src={app.avatarUrl}
              alt={app.fullName}
              className="w-9 h-9 rounded-full object-cover border border-stone-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
              {app.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-sm font-semibold text-stone-700">{app.fullName}</p>
        </div>
      </td>

      {/* Kỹ năng */}
      <td className="px-5 py-4">
        <p className="text-sm text-stone-600">{app.skillDisplayName || app.skill}</p>
      </td>

      {/* Ngày nộp */}
      <td className="px-5 py-4">
        <p className="text-sm text-stone-500">{formatDate(app.createdAt)}</p>
      </td>

      {/* Trạng thái */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}
        >
          <StatusIcon size={11} />
          {cfg.label}
        </span>
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <button
          id={`view-app-btn-${app.id}`}
          onClick={() => onView(app)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-primary hover:text-white text-stone-600 text-xs font-semibold transition-all cursor-pointer"
        >
          <Eye size={13} />
          Xem chi tiết
        </button>
      </td>
    </motion.tr>
  );
}

// --- Page ---
export default function AdminApplicationsPage() {
  const dispatch = useAppDispatch();
  const { applications, adminLoading, error, successMessage, totalPages, currentPage } =
    useAppSelector((state) => state.artisanApplications);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ArtisanApplicationDTO | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = (page = 0) => {
    dispatch(fetchAdminApplications({ page, size: 15, status: filterStatus }));
  };

  useEffect(() => {
    load(0);
    return () => {
      dispatch(clearApplicationMessages());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  // Client-side search
  const filtered = searchQuery.trim()
    ? applications.filter((a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : applications;

  const handleApprove = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    await dispatch(approveApplication(selectedApp.id));
    setActionLoading(false);
    setSelectedApp(null);
    load(currentPage);
  };

  const handleReject = async (reason: string) => {
    if (!selectedApp) return;
    setActionLoading(true);
    await dispatch(rejectApplication({ id: selectedApp.id, reason }));
    setActionLoading(false);
    setShowRejectModal(false);
    setSelectedApp(null);
    load(currentPage);
  };

  // Stats
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 flex items-center gap-2">
            <FileText className="text-primary" size={28} />
            Phiếu Đăng Ký Nghệ Nhân
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Xem xét và duyệt các đơn đăng ký trở thành nghệ nhân
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Tổng đơn',
              value: applications.length,
              color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
              label: 'Chờ duyệt',
              value: pendingCount,
              color: 'bg-amber-50 text-amber-700 border-amber-200',
            },
            {
              label: 'Đã duyệt',
              value: approvedCount,
              color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            },
            {
              label: 'Từ chối',
              value: rejectedCount,
              color: 'bg-red-50 text-red-700 border-red-200',
            },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Success / Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              {successMessage}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-4 p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-grow max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="admin-apps-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên ứng viên..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`admin-apps-filter-${opt.value}`}
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

          {/* Refresh */}
          <button
            id="admin-apps-refresh"
            onClick={() => load(currentPage)}
            disabled={adminLoading}
            className="ml-auto p-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 disabled:opacity-40"
          >
            <RefreshCw size={16} className={adminLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {adminLoading && filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-stone-400">
              <Loader2 size={36} className="animate-spin opacity-40" />
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                <FileText size={28} className="text-stone-300" />
              </div>
              <p className="text-sm">Không có đơn đăng ký nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {['Ứng viên', 'Kỹ năng', 'Ngày nộp', 'Trạng thái', 'Hành động'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-bold text-stone-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((app) => (
                      <ApplicationRow
                        key={app.id}
                        app={app}
                        onView={setSelectedApp}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                id={`admin-apps-page-${i}`}
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

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 text-xs text-stone-400 justify-end">
          <Users size={12} />
          <span>{filtered.length} đơn hiển thị</span>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && !showRejectModal && (
          <DetailModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onApprove={handleApprove}
            onReject={() => setShowRejectModal(true)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <RejectModal
            onConfirm={handleReject}
            onCancel={() => setShowRejectModal(false)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
