import { useEffect } from 'react';
import { Star, ArrowRight, Sparkles, PenTool, Clock, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from "motion/react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchArtisans, setSkill, setSortBy, setCurrentPage, type Artisan } from '../../features/artisans/artisansSlice';

const benefits = [
  { icon: <Sparkles className="w-6 h-6" />, title: 'Chất liệu tuyển chọn', description: 'Tùy chọn loại sợi và màu sắc theo sở thích cá nhân.' },
  { icon: <PenTool className="w-6 h-6" />, title: 'Bản vẽ riêng biệt', description: 'Nhận phác thảo thiết kế trước khi nghệ nhân bắt tay thực hiện.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Cập nhật tiến độ', description: 'Nghệ nhân gửi ảnh cập nhật quy trình hoàn thiện sản phẩm.' },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Cam kết chất lượng', description: 'Hoàn thiện đến khi bạn thực sự hài lòng với tác phẩm.' }
];

interface ArtisanCardProps {
  artisan: Artisan;
  index: number;
  onOrder: (id: number) => void;
}

function ArtisanCard({ artisan, index, onOrder }: ArtisanCardProps) {
  const navigate = useNavigate();

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOrder(artisan.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/artisans/${artisan.id}`)}
      className={`group bg-surface rounded-card border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer ${artisan.featured ? 'border-primary/20 scale-[1.02]' : 'border-black/5'}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={artisan.image} 
          alt={artisan.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
          {artisan.tag || 'Nghệ nhân'}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-[#1b1c1c]">{artisan.name}</h3>
          <div className="flex items-center text-primary font-bold">
            <Star className="w-4 h-4 fill-primary mr-1" />
            <span className="text-sm">{artisan.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        <p className="text-secondary italic mb-6 line-clamp-2 leading-relaxed">
          {artisan.quote || '"Tâm huyết đặt vào từng đường kim mũi chỉ"'}
        </p>
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5 mb-8">
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-semibold">Kinh nghiệm</p>
            <p className="font-bold text-[#1b1c1c] text-lg">{artisan.experience || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-semibold">Đã hoàn thành</p>
            <p className="font-bold text-[#1b1c1c] text-lg">{artisan.orders || 0}</p>
          </div>
        </div>
        <button 
          onClick={handleOrder}
          className="mt-auto w-full group/btn relative flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-button overflow-hidden transition-all hover:bg-primary/90"
        >
          <span className="z-10">Chọn nghệ nhân này</span>
          <ArrowRight className="w-5 h-5 z-10 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ArtisanPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { pageData, loading, selectedSkill, sortBy, currentPage } = useSelector(
    (state: RootState) => state.artisans
  );

  // 🛡️ TẦNG PHÒNG THỦ KHỚP DỮ LIỆU: Bóc tách mảng từ "data" bọc trong ApiResponse 
  const artisansList = (() => {
    if (!pageData) return [];
    // 1. Trường hợp Slice gán thẳng mảng từ action.payload.data vào pageData
    if (Array.isArray(pageData)) return pageData;
    // 2. Trường hợp Slice giữ nguyên cấu trúc phản hồi { data: [...] }
    if (Array.isArray((pageData as any).data)) return (pageData as any).data;
    // 3. Trường hợp cấu trúc chuẩn Spring Boot Page { content: [...] }
    if (pageData.content && Array.isArray(pageData.content)) return pageData.content;
    return [];
  })();

  // 🛡️ BÓC TÁCH SỐ TRANG: Quét từ thuộc tính "meta" của Back-End
  const totalPages = pageData?.totalPages || (pageData as any)?.meta?.totalPages || 0;

  useEffect(() => {
    dispatch(fetchArtisans());
  }, [dispatch, selectedSkill, sortBy, currentPage]);

  const handleCreateOrder = (id: number) => {
    navigate(`/custom-orders/create?artisanId=${id}`);
  };

  return (
    <div className="min-h-screen">
      <main className="pt-32 pb-20 px-6 md:px-12 lg:px-16">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Bước 1: Chọn nghệ nhân</span>
            <h1 className="text-5xl font-bold text-[#1b1c1c] leading-tight mb-6">Nghệ nhân cho đơn hàng của bạn</h1>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              Hãy chọn người nghệ nhân có phong cách phù hợp nhất để biến ý tưởng của bạn thành hiện thực.
            </p>
          </motion.div>
        </section>

        {/* Filter Section */}
        <section className="max-container mb-12">
          <div className="bg-[#f5f3f3] p-4 rounded-xl border border-black/5 flex flex-wrap items-center gap-6">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Lọc theo kỹ năng:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => dispatch(setSkill('ALL'))}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedSkill === 'ALL' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-black/5 text-[#594138] hover:bg-black/10'}`}
              >
                Tất cả
              </button>
              
              {[
                { label: 'Amigurumi', value: 'AMIGURUMI' },
                { label: 'Đan móc', value: 'DAN_MOC' },
                { label: 'Thêu tay', value: 'THEU_TAY' }
              ].map((skill) => (
                <button 
                  key={skill.value} 
                  onClick={() => dispatch(setSkill(skill.value))}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedSkill === skill.value ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-black/5 text-[#594138] hover:bg-black/10'}`}
                >
                  {skill.label}
                </button>
              ))}
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-bold text-secondary">Sắp xếp:</span>
              <select 
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 cursor-pointer appearance-none pr-8 relative outline-none"
              >
                <option value="rating">Đánh giá tốt nhất</option>
                <option value="orders">Đơn hàng hoàn thiện</option>
                <option value="experience">Kinh nghiệm cao nhất</option>
              </select>
            </div>
          </div>
        </section>

        {/* Artisan Grid */}
        <section className="max-container mb-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-secondary text-sm">Đang tải danh sách nghệ nhân...</p>
            </div>
          ) : artisansList.length === 0 ? ( 
            <div className="text-center py-20 text-secondary border border-dashed border-black/10 rounded-xl">
              Không tìm thấy nghệ nhân nào phù hợp với bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artisansList.map((artisan: Artisan, index: number) => (
                <ArtisanCard 
                  key={artisan.id} 
                  artisan={artisan} 
                  index={index} 
                  onOrder={handleCreateOrder} 
                />
              ))}
            </div>
          )}
        </section>

        {/* Pagination Section */}
        {totalPages > 1 && ( 
          <section className="flex items-center justify-center gap-2 mb-32">
            <button
              onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 0)))}
              disabled={currentPage === 0}
              className="p-3 rounded-xl border border-black/5 bg-[#f5f3f3] hover:bg-black/10 disabled:opacity-40 disabled:hover:bg-[#f5f3f3] transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#1b1c1c]" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => dispatch(setCurrentPage(idx))}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === idx ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border border-black/5 hover:bg-black/5 text-[#594138]'}`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages - 1)))}
              disabled={currentPage === totalPages - 1}
              className="p-3 rounded-xl border border-black/5 bg-[#f5f3f3] hover:bg-black/10 disabled:opacity-40 disabled:hover:bg-[#f5f3f3] transition-all"
            >
              <ChevronRight className="w-4 h-4 text-[#1b1c1c]" />
            </button>
          </section>
        )}

        {/* Benefits Section */}
        <section className="bg-accent py-32 overflow-hidden -mx-6 md:-mx-12 lg:-mx-16">
          <div className="max-container">
            <div className="text-center mb-20">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold text-[#1b1c1c] mb-4">
                Tại sao chọn đặt hàng riêng?
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="text-secondary max-w-2xl mx-auto">
                Chúng tôi mang đến sự cá nhân hóa tối đa cho từng sản phẩm của bạn.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {benefits.map((benefit, i) => (
                <motion.div key={benefit.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary mb-6 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h4 className="text-lg font-bold text-[#1b1c1c] mb-3">{benefit.title}</h4>
                  <p className="text-sm text-secondary leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-container mt-32">
          <div className="bg-[#f5f3f3] rounded-3xl p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group border border-black/5">
            <div className="max-w-xl relative z-10">
              <h2 className="text-3xl font-bold text-[#1b1c1c] mb-4">Bạn chưa tìm thấy phong cách phù hợp?</h2>
              <p className="text-secondary">Đăng ký để nhận thông báo khi có nghệ nhân mới gia nhập hoặc các bộ sưu tập giới hạn.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3 relative z-10">
              <input className="bg-white border-black/10 border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-6 py-4 w-full md:w-80 outline-none transition-all" placeholder="Email của bạn" type="email" />
              <button className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-primary/20">
                Đăng ký
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 transition-transform group-hover:scale-110" />
          </div>
        </section>
      </main>
    </div>
  );
}