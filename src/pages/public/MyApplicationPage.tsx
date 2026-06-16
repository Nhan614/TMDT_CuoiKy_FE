import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMyApplication } from '../../features/artisanApplications/artisanApplicationThunk';
import { clearApplicationMessages } from '../../features/artisanApplications/artisanApplicationSlice';
import type { ApplicationStatus } from '../../features/artisanApplications/artisanApplicationType';

// --- Helpers ---
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

// --- Status Config ---
const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; className: string; ringClass: string }
> = {
  PENDING: {
    label: 'Đang Chờ Duyệt',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    ringClass: 'ring-amber-200',
  },
  APPROVED: {
    label: 'Đã Được Duyệt',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ringClass: 'ring-emerald-200',
  },
  REJECTED: {
    label: 'Bị Từ Chối',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
    ringClass: 'ring-red-200',
  },
};

// --- Image Lightbox ---
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src={src} alt="Lightbox" className="w-full h-full object-contain" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Page ---
export default function MyApplicationPage() {
  const dispatch = useAppDispatch();
  const { myApplication, myApplicationLoading, error } = useAppSelector(
    (state) => state.artisanApplications
  );
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyApplication());
    return () => {
      dispatch(clearApplicationMessages());
    };
  }, [dispatch]);

  // Loading
  if (myApplicationLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-32">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-stone-400">Đang tải thông tin đơn đăng ký...</p>
      </div>
    );
  }

  // No Application
  if (!myApplication) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 bg-stone-50/55">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-stone-100 shadow-sm p-10 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-beige/60 flex items-center justify-center mx-auto">
              <Award size={36} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-stone-800">Chưa có đơn đăng ký</h1>
              <p className="text-stone-500 text-sm leading-relaxed">
                Bạn chưa nộp đơn đăng ký làm Nghệ nhân. Hãy trở thành một phần của cộng đồng
                nghệ nhân Atelier!
              </p>
              {error && (
                <p className="text-xs text-stone-400 mt-1">({error})</p>
              )}
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-primary/25"
            >
              Nộp Đơn Ngay
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[myApplication.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 bg-stone-50/55">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 flex items-center gap-2">
            <Award className="text-primary" size={28} />
            Đơn Đăng Ký Nghệ Nhân
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Theo dõi trạng thái xét duyệt hồ sơ của bạn
          </p>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {myApplication.status === 'APPROVED' && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 flex items-center gap-4">
              <CheckCircle2 size={36} className="shrink-0" />
              <div>
                <p className="font-bold text-lg">Chúc mừng! Hồ sơ đã được duyệt</p>
                <p className="text-sm opacity-90 mt-0.5">
                  Bạn đã chính thức trở thành Nghệ nhân của Atelier. Hãy vào trang hồ sơ để
                  bắt đầu hoạt động!
                </p>
              </div>
            </div>
          )}

          {myApplication.status === 'REJECTED' && (
            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-5 text-white shadow-lg shadow-red-200">
              <div className="flex items-center gap-3 mb-3">
                <XCircle size={28} className="shrink-0" />
                <p className="font-bold text-lg">Hồ sơ bị từ chối</p>
              </div>
              {myApplication.rejectionReason && (
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                    Lý do từ chối
                  </p>
                  <p className="text-sm leading-relaxed">{myApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          {myApplication.status === 'PENDING' && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white shadow-lg shadow-amber-200 flex items-center gap-4">
              <Clock size={32} className="shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-lg">Đang chờ xét duyệt</p>
                <p className="text-sm opacity-90 mt-0.5">
                  Hồ sơ của bạn đang được Admin xem xét. Vui lòng kiên nhẫn chờ đợi.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Application Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-stone-50/60 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              {myApplication.avatarUrl ? (
                <img
                  src={myApplication.avatarUrl}
                  alt={myApplication.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {myApplication.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-stone-800">{myApplication.fullName}</h2>
                <p className="text-sm text-stone-500 mt-0.5">
                  {myApplication.skillDisplayName || myApplication.skill}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.className}`}
            >
              <StatusIcon size={13} />
              {cfg.label}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Bio */}
            {myApplication.bio && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Tiểu sử</p>
                <p className="text-sm text-stone-700 leading-relaxed">{myApplication.bio}</p>
              </div>
            )}

            {/* Quote */}
            {myApplication.quote && (
              <div className="bg-stone-50 rounded-xl p-4 border-l-4 border-primary">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Châm ngôn
                </p>
                <p className="text-sm text-stone-700 italic">"{myApplication.quote}"</p>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                  <Calendar size={15} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Ngày bắt đầu làm nghề
                  </p>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5">
                    {myApplication.startedCraftingDate
                      ? formatDate(myApplication.startedCraftingDate)
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                  <Calendar size={15} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Ngày nộp đơn
                  </p>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5">
                    {formatDate(myApplication.createdAt)}
                  </p>
                </div>
              </div>

              {myApplication.portfolioUrl && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                    <ExternalLink size={15} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      Portfolio
                    </p>
                    <a
                      href={myApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline mt-0.5 flex items-center gap-1"
                    >
                      Xem portfolio
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Proof Images */}
            {myApplication.proofImageUrls && myApplication.proofImageUrls.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon size={15} className="text-stone-400" />
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Ảnh minh chứng ({myApplication.proofImageUrls.length})
                  </p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {myApplication.proofImageUrls.map((url, i) => (
                    <button
                      key={i}
                      id={`proof-img-${i}`}
                      onClick={() => setLightboxSrc(url)}
                      className="aspect-square rounded-xl overflow-hidden border border-stone-200 hover:border-primary/50 hover:scale-105 transition-all shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Minh chứng ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Review info */}
            {myApplication.reviewedAt && (
              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-400">
                <Clock size={12} />
                <span>
                  Xét duyệt lúc: {formatDate(myApplication.reviewedAt)}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Back to Profile */}
        <div className="text-center">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition-colors font-semibold"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Quay lại trang hồ sơ
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}
