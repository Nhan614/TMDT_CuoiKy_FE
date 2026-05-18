import { useState, useEffect } from 'react';
import { Star, ArrowRight, Sparkles, PenTool, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from "motion/react";

// Định nghĩa base URL của API khớp với Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/artisans';

// Định nghĩa kiểu dữ liệu đồng bộ với ArtisanCardResponse từ Back-End
interface Artisan {
  id: number;
  name: string;
  tag: string;      
  image: string;
  rating: number;
  quote: string;
  experience: string;
  orders: string;      
  featured?: boolean;
}

const benefits = [
  { icon: <Sparkles className="w-6 h-6" />, title: 'Chất liệu tuyển chọn', description: 'Tùy chọn loại sợi và màu sắc theo sở thích cá nhân.' },
  { icon: <PenTool className="w-6 h-6" />, title: 'Bản vẽ riêng biệt', description: 'Nhận phác thảo thiết kế trước khi nghệ nhân bắt tay thực hiện.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Cập nhật tiến độ', description: 'Nghệ nhân gửi ảnh cập nhật quy trình hoàn thiện sản phẩm.' },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Cam kết chất lượng', description: 'Hoàn thiện đến khi bạn thực sự hài lòng với tác phẩm.' }
];

// Định nghĩa Interface Props cho Component Card để tránh lỗi "any"
interface ArtisanCardProps {
  artisan: Artisan;
  index: number;
  onSelect: (id: number) => Promise<void>;
}

function ArtisanCard({ artisan, index, onSelect }: ArtisanCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSelect = async () => {
    setLoading(true);
    await onSelect(artisan.id);
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group bg-surface rounded-card border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col ${artisan.featured ? 'border-primary/20 scale-[1.02]' : 'border-black/5'}`}
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
            <p className="font-bold text-[#1b1c1c] text-lg">{artisan.experience}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-semibold">Đã hoàn thành</p>
            <p className="font-bold text-[#1b1c1c] text-lg">{artisan.orders}</p>
          </div>
        </div>
        <button 
          onClick={handleSelect}
          disabled={loading}
          className="mt-auto w-full group/btn relative flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-button overflow-hidden transition-all hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span className="z-10">Chọn nghệ nhân này</span>
              <ArrowRight className="w-5 h-5 z-10 transition-transform group-hover/btn:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [artisansList, setArtisansList] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL'); 
  const [sortBy, setSortBy] = useState<string>('rating'); 

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedSkill !== 'ALL') {
        queryParams.append('skill', selectedSkill);
      }
      queryParams.append('sortBy', sortBy);

      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setArtisansList(data);
      } else {
        console.error("Lỗi khi tải dữ liệu từ server");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [selectedSkill, sortBy]);

  const handleCreateOrder = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const message = await response.text();
      
      if (response.ok) {
        alert(`🎉 Thành công: ${message}`);
      } else {
        alert(`⚠️ Thất bại: ${message}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối mạng, vui lòng thử lại sau!");
    }
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
                onClick={() => setSelectedSkill('ALL')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedSkill === 'ALL' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-black/5 text-[#594138] hover:bg-black/10'}`}
              >
                Tất cả
              </button>
              
              {/* Danh sách Kỹ năng đã chuẩn hóa khớp với Enum Back-End */}
              {[
                { label: 'Amigurumi', value: 'AMIGURUMI' },
                { label: 'Đan móc', value: 'DAN_MOC' },
                { label: 'Thêu tay', value: 'THEU_TAY' }
              ].map((skill: { label: string, value: string }) => (
                <button 
                  key={skill.value} 
                  onClick={() => setSelectedSkill(skill.value)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedSkill === skill.value ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-black/5 text-[#594138] hover:bg-black/10'}`}
                >
                  {skill.label}
                </button>
              ))}
            </div>
            
            {/* Bộ chọn Sắp Xếp */}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-bold text-secondary">Sắp xếp:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
        <section className="max-container mb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-secondary text-sm">Đang tải danh sách nghệ nhân...</p>
            </div>
          ) : artisansList.length === 0 ? (
            <div className="text-center py-20 text-secondary">
              Không tìm thấy nghệ nhân nào phù hợp với bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Định nghĩa kiểu dữ liệu tường minh (artisan: Artisan, index: number) loại bỏ hoàn toàn lỗi ngầm định any */}
              {artisansList.map((artisan: Artisan, index: number) => (
                <ArtisanCard 
                  key={artisan.id} 
                  artisan={artisan} 
                  index={index} 
                  onSelect={handleCreateOrder} 
                />
              ))}
            </div>
          )}
        </section>

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