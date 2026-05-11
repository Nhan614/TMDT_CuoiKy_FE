import {  Star, ArrowRight, Sparkles, PenTool, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from "motion/react";

const artisans = [
  {
    id: 1,
    name: 'Nguyễn Minh Tú',
    tag: 'Bậc thầy Amigurumi',
    image: 'https://nld.mediacdn.vn/291774122806476800/2026/2/16/2-1771214379475956704951.jpg',
    rating: 4.9,
    quote: '"Thổi hồn vào từng sợi len để tạo nên những người bạn nhỏ mang theo hơi ấm."',
    experience: '8 năm',
    orders: '1,200+',
  },
  {
    id: 2,
    name: 'Trần Thanh Hà',
    tag: 'Chuyên gia Đan móc',
    image: 'https://lh6.googleusercontent.com/proxy/NhZMLsQYST9FcgKq3K2kbdyvZSg11iRuWnnYBrSukCwx-yYBgIpakaVHzpZo7Lj0tCafnqUwPMA7aW1DzEjdqSvxPginiPBj6qfX-XbRqyY',
    rating: 5.0,
    quote: '"Sự kiên nhẫn là chìa khóa của sự tinh xảo. Mỗi mũi đan là một lời chúc bình an."',
    experience: '25 năm',
    orders: '3,500+',
    featured: true,
  },
  {
    id: 3,
    name: 'Lê Thị Hồng',
    tag: 'Nhà thiết kế Họa tiết',
    image: 'https://hoilhpn.org.vn/documents/20182/1823217/small_8475.jpg/2f32361c-4e93-4339-9ad0-586394ad53fb',
    rating: 4.8,
    quote: '"Tôi kết nối truyền thống và hiện đại qua những đường nét len tối giản đầy chiều sâu."',
    experience: '5 năm',
    orders: '850+',
  }
];

const benefits = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Chất liệu tuyển chọn',
    description: 'Tùy chọn loại sợi và màu sắc theo sở thích cá nhân.'
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: 'Bản vẽ riêng biệt',
    description: 'Nhận phác thảo thiết kế trước khi nghệ nhân bắt tay thực hiện.'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Cập nhật tiến độ',
    description: 'Nghệ nhân gửi ảnh cập nhật quy trình hoàn thiện sản phẩm.'
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Cam kết chất lượng',
    description: 'Hoàn thiện đến khi bạn thực sự hài lòng với tác phẩm.'
  }
];


function ArtisanCard({ artisan, index }: { artisan: typeof artisans[0], index: number }) {
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
          {artisan.tag}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-[#1b1c1c]">{artisan.name}</h3>
          <div className="flex items-center text-primary font-bold">
            <Star className="w-4 h-4 fill-primary mr-1" />
            <span className="text-sm">{artisan.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-secondary italic mb-6 line-clamp-2 leading-relaxed">
          {artisan.quote}
        </p>
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5 mb-8">
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-semibold">Kinh nghiệm</p>
            <p className="font-bold text-[#1b1c1c] text-lg">{artisan.experience}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-semibold">Đã hoàn thành</p>
            <p className="font-bold text-[#1b1c1c] text-lg">{artisan.orders} đơn</p>
          </div>
        </div>
        <button className="mt-auto w-full group/btn relative flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-button overflow-hidden transition-all hover:bg-primary/90">
          <span className="z-10">Chọn nghệ nhân này</span>
          <ArrowRight className="w-5 h-5 z-10 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      
      <main className="pt-32 pb-20 px-6 md:px-12 lg:px-16">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
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
              <button className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md shadow-primary/20">Tất cả</button>
              {['Amigurumi', 'Đan móc', 'Thiết kế họa tiết'].map(skill => (
                <button key={skill} className="px-5 py-2 rounded-full bg-black/5 text-[#594138] text-xs font-bold hover:bg-black/10 transition-colors">
                  {skill}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-bold text-secondary">Sắp xếp:</span>
              <select className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 cursor-pointer appearance-none pr-8 relative">
                <option>Kinh nghiệm cao nhất</option>
                <option>Đơn hàng hoàn thiện</option>
                <option>Đánh giá tốt nhất</option>
              </select>
            </div>
          </div>
        </section>

        {/* Artisan Grid */}
        <section className="max-container mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map((artisan, index) => (
              <ArtisanCard key={artisan.id} artisan={artisan} index={index} />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-accent py-32 overflow-hidden -mx-6 md:-mx-12 lg:-mx-16">
          <div className="max-container">
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-[#1b1c1c] mb-4"
              >
                Tại sao chọn đặt hàng riêng?
              </motion.h2>
              <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 viewport={{ once: true }}
                className="text-secondary max-w-2xl mx-auto"
              >
                Chúng tôi mang đến sự cá nhân hóa tối đa cho từng sản phẩm của bạn.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
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
              <input 
                className="bg-white border-black/10 border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-6 py-4 w-full md:w-80 outline-none transition-all" 
                placeholder="Email của bạn" 
                type="email"
              />
              <button className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-primary/20">
                Đăng ký
              </button>
            </div>
            {/* Visual fluff */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 transition-transform group-hover:scale-110" />
          </div>
        </section>
      </main>
    </div>
  );
}

