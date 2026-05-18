import { motion } from "motion/react";
import { Heart, User, ArrowRight } from "lucide-react";
import Navbar from "../../components/common/Header";
import ProductCard from "../../components/common/ProductCard";
import CategoryCircle from "../../components/common/CategoryCircle";

function HomePage() {
  const categories = [
    {
      title: "Mũ Len",
      image:
        "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Áo Len",
      image:
        "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Thú Bông",
      image:
        "https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Phụ Kiện",
      image:
        "https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=400",
    },
  ];

  const products = [
    {
      image:
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=500",
      title: "Khăn Len Sọc Đa Sắc",
      category: "Phụ Kiện",
      rating: 5,
      price: "450.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=500",
      title: "Mũ Beanie Xanh Navy",
      category: "Mũ Len",
      rating: 4,
      price: "220.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1611604541091-62f928e4e976?auto=format&fit=crop&q=80&w=500",
      title: "Gấu Bông Len Handmade",
      category: "Thú Bông",
      rating: 5,
      price: "580.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1582260659610-863a3d5483ec?auto=format&fit=crop&q=80&w=500",
      title: "Cáo Nhỏ Amigurumi",
      category: "Thú Bông",
      rating: 5,
      price: "320.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=500",
      title: "Áo Khoác Cardigan Kem",
      category: "Trang Phục",
      rating: 5,
      price: "1.250.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1574015974293-817f0efebb1b?auto=format&fit=crop&q=80&w=500",
      title: "Túi Tote Len Crochet",
      category: "Túi Xách",
      rating: 4,
      price: "380.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?auto=format&fit=crop&q=80&w=500",
      title: "Mèo Bông Xám Nhỏ",
      category: "Thú Bông",
      rating: 5,
      price: "290.000đ",
    },
    {
      image:
        "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=500",
      title: "Áo Len Tay Dài Vintage",
      category: "Trang Phục",
      rating: 5,
      price: "950.000đ",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900">
      <Navbar />

      <main className="pt-16">
        {/* --- Hero Section --- */}
        <section className="px-4 py-8 max-w-7xl mx-auto">
          <div className="relative rounded-4xl overflow-hidden bg-stone-200 min-h-125 sm:min-h-150 flex items-center shadow-md">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=2000"
                alt="Len & Sợi Hero"
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-r from-stone-900/40 via-stone-900/10 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 px-8 sm:px-16 max-w-2xl"
            >
              <p className="text-white/90 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase mb-4 drop-shadow-sm">
                Thủ Công & Tỉ Mỉ
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] drop-shadow-md">
                Sản Phẩm Len Sợi Bền Vững
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-10 max-w-md drop-shadow-sm leading-relaxed">
                Khám phá bộ sưu tập đan móc thủ công, mang đến sự ấm áp và phong
                cách độc đáo cho bạn và tổ ấm.
              </p>
              <button className="bg-stone-800 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-700 transition-all flex items-center gap-2 group shadow-lg">
                Khám Phá Ngay
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="w-12 h-12 rounded-full bg-stone-800/10 flex items-center justify-center text-stone-800 mb-4">
                <div className="p-2 border-2 border-stone-800 rounded-full" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 uppercase tracking-wide">
                Sợi Tự Nhiên
              </h3>
              <p className="text-stone-500 text-sm">
                Chất liệu thân thiện môi trường
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="w-12 h-12 rounded-full bg-stone-800/10 flex items-center justify-center text-stone-800 mb-4">
                <Heart size={24} className="fill-stone-800" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 uppercase tracking-wide">
                Làm Bằng Tay 100%
              </h3>
              <p className="text-stone-500 text-sm">Chăm chút từng mũi đan</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="w-12 h-12 rounded-full bg-stone-800/10 flex items-center justify-center text-stone-800 mb-4">
                <User size={24} />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 uppercase tracking-wide">
                Thiết Kế Riêng
              </h3>
              <p className="text-stone-500 text-sm">
                Nhận đặt làm theo yêu cầu
              </p>
            </div>
          </div>
        </section>

        {/* --- Categories Section --- */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2 uppercase tracking-tight">
              Danh Mục Nổi Bật
            </h2>
            <p className="text-stone-400 text-sm tracking-widest uppercase">
              Khám phá các sản phẩm đan móc được yêu thích nhất
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 lg:gap-24">
            {categories.map((cat, idx) => (
              <CategoryCircle key={idx} {...cat} />
            ))}
          </div>
        </section>

        {/* --- New Arrivals Section --- */}
        <section className="py-20 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2 uppercase tracking-tight">
                Hàng Mới Về
              </h2>
              <p className="text-stone-400 text-sm tracking-widest uppercase italic">
                Những mẫu thiết kế mới nhất cho mùa này
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {products.map((prod, idx) => (
                <ProductCard key={idx} {...prod} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <button className="px-10 py-3 border border-stone-800 rounded-full text-stone-800 font-bold hover:bg-stone-800 hover:text-white transition-all uppercase text-sm tracking-widest">
                Xem Tất Cả Sản Phẩm
              </button>
            </div>
          </div>
        </section>

        {/* --- Custom Design Banner --- */}
        <section className="px-4 py-20 max-w-7xl mx-auto">
          <div className="relative rounded-4xl overflow-hidden bg-stone-200 min-h-75 flex items-center justify-center text-center p-8">
            <img
              src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=2000"
              alt="Custom order"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 mb-4">
                Sản Phẩm Độc Bản Theo Ý Bạn
              </h2>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Bạn có ý tưởng cho một món quà len sợi đặc biệt cho dành tặng
                cho chính bạn hay người thân và bạn bè? Liên hệ với chúng tôi để
                hiện thực hóa nó!
              </p>
              <button className="px-10 py-3 border-2 border-stone-800 rounded-full text-stone-800 font-bold hover:bg-stone-800 hover:text-white transition-all uppercase text-xs tracking-widest">
                Liên Hệ Ngay
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
