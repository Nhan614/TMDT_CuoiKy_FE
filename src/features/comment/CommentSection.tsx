import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Star, Trash2, Loader2, AlertCircle, CheckCircle2, MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    fetchCommentsByProduct,
    addComment,
    deleteComment,
} from "./commentThunk";
import { clearCommentMessages, resetComments } from "./commentSlice";
import { fetchProductById } from "../products/productThunk";
interface CommentSectionProps {
    productId: number;
}
// Simple hash function to generate consistent premium avatar colors based on username
const getAvatarColorClass = (username: string) => {
    const colors = [
        "bg-red-500/10 text-red-500 border-red-500/20",
        "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "bg-green-500/10 text-green-500 border-green-500/20",
        "bg-amber-500/10 text-amber-500 border-amber-500/20",
        "bg-purple-500/10 text-purple-500 border-purple-500/20",
        "bg-pink-500/10 text-pink-500 border-pink-500/20",
        "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        "bg-teal-500/10 text-teal-500 border-teal-500/20",
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
export default function CommentSection({ productId }: CommentSectionProps) {
    const dispatch = useAppDispatch();

    // Select comment state
    const {
        comments,
        isLoading,
        isSubmitting,
        error,
        successMessage,
        totalPages,
        currentPage,
        totalElements,
    } = useAppSelector((state) => state.comments);
    // Select auth state
    const { user } = useAppSelector((state) => state.auth);
    const isLoggedIn = !!user || !!localStorage.getItem("token");
    const currentUser = user || (localStorage.getItem("token") ? { username: "Người dùng" } : null);
    // Form states
    const [commentContent, setCommentContent] = useState("");
    const [commentRating, setCommentRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    // Fetch comments when product or page changes
    useEffect(() => {
        if (productId) {
            dispatch(resetComments());
            dispatch(fetchCommentsByProduct({ productId, page: 1, size: 5 }));
        }
        return () => {
            dispatch(clearCommentMessages());
        };
    }, [dispatch, productId]);
    // Alert message display timer
    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearCommentMessages());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, error, successMessage]);
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        const result = await dispatch(
            addComment({
                productId,
                payload: { content: commentContent.trim(), rating: commentRating },
            })
        );
        if (addComment.fulfilled.match(result)) {
            setCommentContent("");
            setCommentRating(5);
            // Cập nhật lại thông tin sản phẩm (như điểm rating trung bình) ở header
            dispatch(fetchProductById(productId));
        }
    };
    const handleDelete = async (commentId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            const result = await dispatch(deleteComment(commentId));
            if (deleteComment.fulfilled.match(result)) {
                // Cập nhật lại thông tin sản phẩm ở header
                dispatch(fetchProductById(productId));
            }
        }
    };
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            dispatch(fetchCommentsByProduct({ productId, page, size: 5 }));
        }
    };
    // Helper to format date nicely
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };
    // Calculate rating stats based on loaded comments (simulated summary)
    const averageRating = totalElements > 0
        ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length)
        : 5.0;
    // Rating stars count distribution
    const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 is 1 star, Index 4 is 5 star
    comments.forEach((c) => {
        if (c.rating >= 1 && c.rating <= 5) {
            ratingDistribution[c.rating - 1]++;
        }
    });
    return (
        <section className="py-16 border-t border-outline-variant">
            <div className="flex flex-col gap-12">
                {/* Header Title */}
                <div className="flex justify-between items-center border-b border-outline-variant pb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-on-background flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Đánh giá từ khách hàng
                        </h3>
                        <p className="text-secondary text-sm mt-1">
                            {totalElements > 0 ? `Có ${totalElements} bình luận cho sản phẩm này` : "Chưa có bình luận"}
                        </p>
                    </div>
                </div>
                {/* Info alerts */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                            <button onClick={() => dispatch(clearCommentMessages())} className="hover:opacity-75">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 rounded-xl flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span>{successMessage}</span>
                            </div>
                            <button onClick={() => dispatch(clearCommentMessages())} className="hover:opacity-75">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Main Grid: Statistics & Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Summary Ratings Column */}
                    <div className="lg:col-span-4 p-6 rounded-2xl border border-outline-variant bg-surface-container-low flex flex-col gap-6">
                        <h4 className="font-bold text-on-background text-lg">Tổng quan đánh giá</h4>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <span className="text-5xl font-extrabold text-on-background">
                                    {averageRating.toFixed(1)}
                                </span>
                                <span className="text-secondary text-sm block mt-1">trên 5</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.round(averageRating) ? "fill-current text-amber-500" : "text-outline-variant"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-secondary font-medium">
                                    Tất cả đánh giá đều được xác thực
                                </span>
                            </div>
                        </div>
                        {/* Distribution bars */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = ratingDistribution[stars - 1];
                                const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center gap-3 text-sm">
                                        <span className="w-3 text-secondary font-bold">{stars}</span>
                                        <Star className="w-4 h-4 fill-current text-amber-500 shrink-0" />
                                        <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-secondary text-xs">
                                            {Math.round(percentage)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Form Write Review Column */}
                    <div className="lg:col-span-8">
                        {isLoggedIn ? (
                            <form
                                onSubmit={handleSubmitComment}
                                className="p-8 border border-outline-variant bg-surface-container-low rounded-2xl flex flex-col gap-6"
                            >
                                <div>
                                    <h4 className="text-lg font-bold text-on-background mb-1">
                                        Viết nhận xét của bạn
                                    </h4>
                                    <p className="text-secondary text-sm">
                                        Chia sẻ trải nghiệm sử dụng sản phẩm này với những khách hàng khác.
                                    </p>
                                </div>
                                {/* Stars selection */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold text-on-background uppercase tracking-wider">
                                        Đánh giá của bạn:
                                    </span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isActive = hoverRating !== null ? star <= hoverRating : star <= commentRating;
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(null)}
                                                    onClick={() => setCommentRating(star)}
                                                    className="text-outline-variant hover:scale-110 transition-transform cursor-pointer"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${isActive ? "fill-current text-amber-500" : "text-outline-variant"
                                                            } transition-colors`}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Content input */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="comment-content"
                                        className="text-xs font-bold text-on-background uppercase tracking-wider"
                                    >
                                        Nội dung nhận xét:
                                    </label>
                                    <textarea
                                        id="comment-content"
                                        required
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        rows={4}
                                        placeholder="Sản phẩm này thế nào? Chất lượng, đóng gói, thái độ phục vụ ra sao..."
                                        className="p-4 border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-on-background text-sm transition-all resize-none outline-none"
                                    />
                                </div>
                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !commentContent.trim()}
                                    className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer self-start"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        "Gửi đánh giá"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="p-8 border border-dashed border-outline rounded-2xl bg-surface-container/30 text-center flex flex-col items-center gap-6 justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-on-background mb-1">
                                        Đăng nhập để đánh giá
                                    </h4>
                                    <p className="text-secondary text-sm max-w-sm mx-auto">
                                        Bạn cần đăng nhập tài khoản để thực hiện nhận xét và đánh giá sản phẩm này.
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all text-sm"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                {/* Comments List Section */}
                <div className="flex flex-col gap-6 pt-6 border-t border-outline-variant">
                    <h4 className="text-lg font-bold text-on-background">Đánh giá chi tiết</h4>
                    {/* Spinner while loading page */}
                    {isLoading && comments.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-secondary">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span>Đang tải các đánh giá...</span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="py-16 border border-outline-variant rounded-2xl text-center text-secondary flex flex-col items-center justify-center gap-3 bg-surface-container-lowest">
                            <MessageSquare className="w-10 h-10 opacity-40 text-primary" />
                            <p className="font-medium text-on-background">Chưa có bình luận nào</p>
                            <p className="text-sm text-secondary">Hãy là người đầu tiên nhận xét về sản phẩm này!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="space-y-6">
                                <AnimatePresence initial={false}>
                                    {comments.map((comment) => {
                                        const isOwner = currentUser?.username === comment.username;
                                        const isAdmin = currentUser?.username === "admin";
                                        const showDeleteBtn = isOwner || isAdmin;
                                        const avatarColorClass = getAvatarColorClass(comment.username || "U");
                                        const initialChar = (comment.username || "U").charAt(0).toUpperCase();
                                        return (
                                            <motion.div
                                                key={comment.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                className="p-6 border border-outline-variant rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 relative"
                                            >
                                                {/* Left avatar column */}
                                                <div className="flex sm:flex-col gap-4 items-center sm:items-start shrink-0">
                                                    <div
                                                        className={`w-12 h-12 rounded-full border-2 font-extrabold flex items-center justify-center text-lg shadow-inner ${avatarColorClass}`}
                                                    >
                                                        {initialChar}
                                                    </div>
                                                </div>
                                                {/* Right content column */}
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-on-background">
                                                                {comment.username}
                                                            </span>
                                                            {comment.isPurchased && (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/15">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    Đã mua hàng
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-secondary font-medium">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    {/* Review Stars */}
                                                    <div className="flex text-amber-500">
                                                        {[...Array(5)].map((_, idx) => (
                                                            <Star
                                                                key={idx}
                                                                className={`w-4 h-4 ${idx < comment.rating ? "fill-current text-amber-500" : "text-outline-variant"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    {/* Content */}
                                                    <p className="text-secondary text-sm leading-relaxed whitespace-pre-line">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                                {/* Action buttons */}
                                                {showDeleteBtn && (
                                                    <button
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="absolute top-6 right-6 p-2 rounded-lg text-outline hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
                                                        title="Xóa bình luận"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                            {/* Pagination controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        disabled={currentPage === 1 || isLoading}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="px-4 py-2 text-sm font-bold text-secondary border border-outline-variant rounded-xl hover:bg-surface-container hover:text-on-background disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all cursor-pointer"
                                    >
                                        Trước
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                disabled={isLoading}
                                                className={`w-10 h-10 text-sm font-bold rounded-xl transition-all cursor-pointer ${currentPage === pageNum
                                                    ? "bg-primary text-white shadow-md shadow-primary/25"
                                                    : "border border-outline-variant text-secondary hover:bg-surface-container hover:text-on-background"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        disabled={currentPage === totalPages || isLoading}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="px-4 py-2 text-sm font-bold text-secondary border border-outline-variant rounded-xl hover:bg-surface-container hover:text-on-background disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all cursor-pointer"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}