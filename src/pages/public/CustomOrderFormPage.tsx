import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Star, Loader2, ArrowLeft, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchArtisanProfile } from "../../features/artisans/artisansSlice";
import { createCustomOrder } from "../../features/customOrders/customOrderThunk";
import { clearCustomOrderMessages, clearUploadedImageUrls } from "../../features/customOrders/customOrderSlice";
import ImageUploader from "../../features/customOrders/ImageUploader";

export default function CustomOrderFormPage() {
  const [searchParams] = useSearchParams();
  const artisanId = Number(searchParams.get("artisanId"));

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Load artisan detail
  const { currentProfile, profileLoading } = useAppSelector((state) => state.artisans);
  const { isSubmitting, error, uploadedImageUrls } = useAppSelector(
    (state) => state.customOrders
  );

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (artisanId) {
      dispatch(fetchArtisanProfile(artisanId));
    }
    dispatch(clearUploadedImageUrls());
    return () => {
      dispatch(clearCustomOrderMessages());
    };
  }, [dispatch, artisanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!artisanId) {
      alert("Không tìm thấy thông tin nghệ nhân!");
      return;
    }
    if (uploadedImageUrls.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 ảnh mẫu tham khảo!");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDeadline = new Date(deadline);
    selectedDeadline.setHours(0, 0, 0, 0);
    if (selectedDeadline <= today) {
      alert("Hạn hoàn thành phải là một ngày trong tương lai (sau hôm nay)!");
      return;
    }

    const payload = {
      artisanId,
      title,
      description,
      budget: Number(budget),
      quantity: Number(quantity),
      deadline,
      referenceImageUrls: uploadedImageUrls,
    };

    const result = await dispatch(createCustomOrder(payload));
    if (createCustomOrder.fulfilled.match(result)) {
      alert("Tạo yêu cầu gia công riêng thành công!");
      navigate("/custom-orders/my");
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center py-40 flex-col gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-sm text-secondary">Đang tải thông tin nghệ nhân...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="text-center py-40">
        <p className="text-secondary mb-4">Không tìm thấy thông tin nghệ nhân hoặc lỗi kết nối.</p>
        <Link to="/artisan" className="text-primary font-bold underline">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-50/55">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to={`/artisans/${artisanId}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại hồ sơ nghệ nhân
        </Link>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          {/* Header & Artisan Summary */}
          <div className="p-6 sm:p-8 border-b border-stone-100 bg-stone-50/60 flex flex-col sm:flex-row items-center gap-5">
            <img
              src={currentProfile.image}
              alt={currentProfile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left flex-grow">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
                Yêu cầu gia công riêng đến
              </span>
              <h1 className="text-2xl font-bold text-[#1b1c1c]">{currentProfile.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                <span className="text-xs px-2 py-0.5 bg-beige text-primary rounded-full font-bold uppercase">
                  {currentProfile.skillValue || "Nghệ nhân"}
                </span>
                <span className="flex items-center text-xs text-primary font-bold">
                  <Star className="w-3.5 h-3.5 fill-primary mr-1" />
                  {currentProfile.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-bold text-stone-700">
                Tiêu đề yêu cầu <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Móc búp bê len hình thỏ mặc váy cưới"
                className="w-full bg-white border border-stone-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-bold text-stone-700">
                Mô tả chi tiết yêu cầu <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả kỹ yêu cầu của bạn (kích thước, màu sắc, loại len, kiểu dáng, những điểm cần lưu ý đặc biệt...)"
                className="w-full bg-white border border-stone-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c] resize-y"
              />
            </div>

            {/* Budget & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="budget" className="block text-sm font-bold text-stone-700">
                  Ngân sách dự kiến (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  id="budget"
                  type="number"
                  required
                  min="1000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="VD: 500000"
                  className="w-full bg-white border border-stone-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-bold text-stone-700">
                  Số lượng sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="VD: 1"
                  className="w-full bg-white border border-stone-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label htmlFor="deadline" className="block text-sm font-bold text-stone-700">
                Hạn hoàn thành mong muốn <span className="text-red-500">*</span>
              </label>
              <input
                id="deadline"
                type="date"
                required
                min={getMinDate()}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white border border-stone-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
              />
            </div>

            {/* Image Uploader */}
            <ImageUploader maxImages={5} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 cursor-pointer mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Đang gửi yêu cầu...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Gửi yêu cầu gia công riêng
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
