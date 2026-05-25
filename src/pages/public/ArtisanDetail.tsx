import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Loader2, ChevronLeft, Calendar, PackageCheck, Briefcase } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchArtisanProfile, createArtisanOrder } from '../../features/artisans/artisansSlice';

export default function ArtisanDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [orderLoading, setOrderLoading] = useState(false);

  const { currentProfile, profileLoading } = useSelector(
    (state: RootState) => state.artisans
  );

  useEffect(() => {
    if (id) dispatch(fetchArtisanProfile(Number(id)));
  }, [dispatch, id]);

  const handleCreateOrder = async (id: number) => {
    setOrderLoading(true);
    const result = await dispatch(createArtisanOrder(id));
    setOrderLoading(false);
    
    if (createArtisanOrder.fulfilled.match(result)) {
      alert(`🎉 Thành công: ${result.payload}`);
    } else {
      alert(`⚠️ Thất bại: ${result.payload}`);
    }
  };

  // Hàm định dạng ngày tháng an toàn, không lo crash giao diện
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Chưa cập nhật' : date.toLocaleDateString('vi-VN');
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center py-40 flex-col gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-sm text-secondary">Đang tải hồ sơ nghệ nhân...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="text-center py-40">
        <p className="text-secondary mb-4">Không tìm thấy thông tin nghệ nhân hoặc lỗi kết nối.</p>
        <Link to="/artisans" className="text-primary font-bold underline">Quay lại danh sách</Link>
      </div>
    );
  }

  // Bọc phòng thủ để chắc chắn các danh sách luôn là mảng, tránh lỗi .map() từ dữ liệu null
  const productsList = currentProfile.portfolioProducts || [];
  const reviewsList = currentProfile.reviews || [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link to="/artisans" className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* CỘT TRÁI: Thẻ thông tin nghệ nhân */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-surface rounded-3xl border border-black/5 overflow-hidden shadow-sm">
            <img 
              src={currentProfile.image} 
              alt={currentProfile.name} 
              className="w-full aspect-square object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="p-8">
              <div className="flex justify-between items-center mb-4 gap-2">
                <h1 className="text-3xl font-bold text-[#1b1c1c] truncate">{currentProfile.name}</h1>
                <div className="flex items-center text-primary font-bold shrink-0">
                  <Star className="w-5 h-5 fill-primary mr-1" />
                  <span>{currentProfile.rating ? currentProfile.rating.toFixed(1) : '0.0'}</span>
                </div>
              </div>
              <p className="text-secondary italic mb-8">"{currentProfile.quote || 'Tâm huyết đặt vào từng đường kim mũi chỉ'}"</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="font-medium text-[#1b1c1c]">Kinh nghiệm: {currentProfile.experience || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <PackageCheck className="w-5 h-5 text-primary" />
                  <span className="font-medium text-[#1b1c1c]">Đã hoàn thành: {currentProfile.totalOrders || 0} đơn hàng</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium text-[#1b1c1c]">Tham gia từ: {formatDate(currentProfile.startedCraftingDate)}</span>
                </div>
              </div>

              <button 
                onClick={() => handleCreateOrder(currentProfile.id)}
                disabled={orderLoading}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
              >
                {orderLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Đặt hàng riêng ngay"}
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Nội dung chi tiết */}
        <div className="lg:col-span-8 space-y-12">
          {/* Section: Sản phẩm tiêu biểu */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#1b1c1c]">Sản phẩm tiêu biểu</h2>
            {productsList.length === 0 ? (
              <p className="text-sm text-secondary italic">Nghệ nhân chưa tải lên sản phẩm nào.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {productsList.map(product => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-sm font-bold truncate text-[#1b1c1c]">{product.name}</p>
                    <p className="text-xs text-primary font-bold">{product.price ? product.price.toLocaleString('vi-VN') : 0}đ</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section: Giới thiệu chung */}
          <section className="bg-[#f5f3f3] p-8 rounded-3xl border border-black/5">
            <h2 className="text-2xl font-bold mb-4 text-[#1b1c1c]">Về nghệ nhân</h2>
            <p className="text-secondary leading-relaxed">
              Kỹ năng chính: <span className="text-primary font-bold uppercase tracking-wider">{currentProfile.skillValue || 'Đang cập nhật'}</span>
            </p>
            <p className="text-secondary mt-4 leading-relaxed">
              Nghệ nhân {currentProfile.name} nổi tiếng với phong cách {currentProfile.tag ? currentProfile.tag.toLowerCase() : 'nghệ nhân'} tinh tế. 
              Each product reflects personal dedication and meticulous attention to every single detail.
            </p>
          </section>

          {/* Section: Đánh giá từ khách hàng */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[#1b1c1c]">Đánh giá từ khách hàng ({reviewsList.length})</h2>
            {reviewsList.length === 0 ? (
              <p className="text-sm text-secondary italic">Chưa có đánh giá nào dành cho nghệ nhân này.</p>
            ) : (
              <div className="space-y-6">
                {reviewsList.map(review => (
                  <div key={review.id} className="border-b border-black/5 pb-6">
                    <div className="flex items-center gap-4 mb-3">
                      {review.customerAvatar ? (
                        <img 
                          src={review.customerAvatar} 
                          alt={review.customerName} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-secondary">
                          {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-[#1b1c1c]">{review.customerName || 'Khách hàng ẩn danh'}</p>
                        <div className="flex text-primary">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < (review.rating || 5) ? 'fill-primary text-primary' : 'text-stone-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-[10px] text-secondary uppercase font-bold">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary italic">"{review.comment || 'Không có bình luận nào.'}"</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}