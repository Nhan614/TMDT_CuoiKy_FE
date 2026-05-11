import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {  
  Star, 
  Minus, 
  Plus, 
  Leaf, 
  Hand,
  Wind,
  Droplets,
  Layers,
  ThermometerSun,
  ChevronRight,
  Heart
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";


interface ProductCardProps {
  image: string;
  name: string;
  price: string;
}

function ProductCard({ image, name, price }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container mb-4 relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-5 h-5 text-primary" />
        </div>
      </div>
      <h4 className="font-bold text-on-background mb-1">{name}</h4>
      <p className="text-primary font-bold">{price}</p>
    </motion.div>
  );
}

interface ReviewCardProps {
  name: string;
  title: string;
  content: string;
  avatar: string;
}

function ReviewCard({ name, title, content, avatar }: ReviewCardProps) {
  return (
    <div className="p-8 bg-surface-container-low rounded-xl">
      <div className="flex text-primary mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="font-bold mb-2">{title}</p>
      <p className="text-body-md text-secondary italic leading-relaxed">"{content}"</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center font-bold text-sm text-primary">
          {avatar}
        </div>
        <span className="text-sm font-bold text-on-background">{name}</span>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuDm_vrbMEx5CgF1oUHuQuf5GDkhlQ8OBFOfflMn8TgrBy28gLuaMFnnOU4RClBB8jTMU2Npwu9vb5tiH73PTpj_dgH_kAyRDQ64reU_UuthozyXQjxuoxb6hz2QdpfQLyjDQTurzXVQyf8dWf6_nEgSNhYoH3uTosDe4GD08N4My2NqYN5tQcjctdWkL4igZ5lc9TxIjwTRq38ylpA7l-YlBwqvb6GOpxsXyhxaTWyyqcqMCxJp8GyXbxe90bxi0vIpMfXJfpyMW3o");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Kem");

  const productImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDm_vrbMEx5CgF1oUHuQuf5GDkhlQ8OBFOfflMn8TgrBy28gLuaMFnnOU4RClBB8jTMU2Npwu9vb5tiH73PTpj_dgH_kAyRDQ64reU_UuthozyXQjxuoxb6hz2QdpfQLyjDQTurzXVQyf8dWf6_nEgSNhYoH3uTosDe4GD08N4My2NqYN5tQcjctdWkL4igZ5lc9TxIjwTRq38ylpA7l-YlBwqvb6GOpxsXyhxaTWyyqcqMCxJp8GyXbxe90bxi0vIpMfXJfpyMW3o",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDgFKGwtNPPBnlPtjp1wZbggGgAoiYa4s19rNP9f9QpJtavKAv2wAoSLwxyxuLIsa5mxr9VcadxTavRPKAnWHGnRrny96hdfuDWd5V87uiyfzqXI2xd1suKxkIKsxYrCVoJSeXmOzPj30WQ0yrs2FANFtHD7vaBNrU7bKWqKFD4n8YUbIYm05KzT47-CSNSoEqiVi8grIbXdiWvwiD0sRgFElu_61HCN2MalP0a_UI6xm2xPCED9PPNRlpJGWWxZMy6l1dRMwtFDnU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKByqVPIcf4EbiCar9OHHh9bPjwaZoc05wTQ_zxJUZBuyTMxc5l7B2t_6TpDhvlll3KJmHBDbFmQkYUiCvg-_COgyPuFuVSGrChNToOaeleJuU3NU8gMV-urXxH6_EmwkTJdm42_sF5NnU4H6JFt_Nu19vqJmbX8wYgc3_WMw7OTfJOfzyJt12BP7mwm8CUjJpKDjft3y8T1_p15bLDcHPXOdK87jzez582Ns1ppYZOYkAcqzD0k0Ut34X5NXwS-oDxmn3FcRoir4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAR3WPG3Vct-inl41ztj9P5rvwMO0DOOgY8kMliso65IBOhGq0dCqRVxHem6hcD1fIthszIRq2uVCKHNo-IXrykttiCpCeSuQ9O8N5QPg-g1qaKqGraOMV6Y7_VVYAHxjzvjjCxZk4TnKWWVZjWhW8O-C-eSYCRdSfRPeuf5-CL6QPv0m_Lv_UNfeFLPM9exYBMwzJRvF6PfhtACO5aFlPMymIeQt25jJ9SzbWOYoQQIgNj-s0NxGI6QzbrfTRu2vFpn1Wn77mACgE"
  ];

  return (
    <div className="min-h-screen bg-background">
        <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs uppercase tracking-widest text-secondary gap-3 mb-12">
          <a href="#" className="hover:text-primary">Trang chủ</a>
          <ChevronRight className="w-3 h-3" />
          <a href="#" className="hover:text-primary">Cửa hàng</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-on-background font-bold">Áo Len Crochet Họa Tiết Hoa</span>
        </nav>

        {/* Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              layoutId="main-image"
              className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={selectedImage} 
                  alt="Product" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <header className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Handmade Selection</span>
              <h1 className="text-4xl font-bold text-on-background leading-tight">Áo Len Crochet Họa Tiết Hoa</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-secondary text-sm">(12 đánh giá)</span>
              </div>
              <div className="text-3xl font-bold text-primary">450.000đ</div>
            </header>

            <p className="text-secondary leading-relaxed text-body-lg">
              Sản phẩm được hoàn thiện thủ công tỉ mỉ với họa tiết hoa crochet độc đáo. Chất liệu 100% cotton tự nhiên mềm mại, thoáng mát và bền bỉ theo thời gian.
            </p>

            <div className="space-y-8">
              {/* Colors */}
              <div>
                <span className="text-xs font-bold text-on-background uppercase tracking-widest block mb-4">Màu sắc</span>
                <div className="flex gap-4">
                  {[
                    { name: "Kem", color: "#F5F5DC" },
                    { name: "Nâu", color: "#8B4513" }
                  ].map((c) => (
                    <button 
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-3 px-5 py-2.5 rounded-lg border-2 transition-all ${selectedColor === c.name ? "border-primary bg-primary/5" : "border-outline-variant hover:border-outline"}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c.color }} />
                      <span className="text-sm font-medium">{c.name === "Kem" ? "Kem tự nhiên" : "Nâu đất"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <span className="text-xs font-bold text-on-background uppercase tracking-widest block mb-4">Kích thước</span>
                <div className="flex gap-3">
                  {["S", "M", "L"].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${selectedSize === s ? "border-primary text-primary bg-primary/5" : "border-outline-variant text-secondary hover:border-outline"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-4">
                <div className="flex items-center bg-surface-container rounded-lg px-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-secondary hover:text-primary transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-secondary hover:text-primary transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex-1 bg-primary text-white py-4 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98]">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <footer className="pt-8 border-t border-outline-variant flex gap-8">
              <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-primary" />
                100% Organic Cotton
              </div>
              <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                <Hand className="w-4 h-4 text-primary" />
                Handmade Quality
              </div>
            </footer>
          </div>
        </section>

        {/* Info Tabs */}
        <section className="py-20 border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-2xl font-bold mb-8">Thông tin chi tiết</h3>
            <div className="space-y-6 text-secondary leading-relaxed">
              <p>Từng chiếc áo là kết quả của hàng giờ đồng hồ đan móc thủ công bởi các nghệ nhân lành nghề. Họa tiết hoa được lấy cảm hứng từ những vườn hoa nhiệt đới, mang lại vẻ đẹp tươi mới.</p>
              <ul className="space-y-4">
                {[
                  "Chất liệu: 100% Sợi Cotton tự nhiên không gây kích ứng da.",
                  "Kỹ thuật: Crochet (đan móc) thủ công hoàn toàn.",
                  "Độ bền: Sợi được xử lý chống co rút và xù lông.",
                  "Sản xuất tại: Việt Nam."
                ].map((li, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-8">Hướng dẫn bảo quản</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Wind />, label: "Giặt tay nhẹ nhàng" },
                { icon: <Droplets />, label: "Không dùng chất tẩy" },
                { icon: <Layers />, label: "Phơi trên mặt phẳng" },
                { icon: <ThermometerSun />, label: "Ủi ở nhiệt độ thấp" }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-surface-container rounded-xl flex flex-col items-center text-center gap-3 transition-colors hover:bg-surface-container-high">
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-20 border-t border-outline-variant">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-2xl font-bold">Đánh giá từ khách hàng</h3>
            <button className="text-primary font-bold border-b border-primary pb-px hover:border-transparent transition-all">Viết đánh giá</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReviewCard 
              name="Minh Hạnh" 
              title="Chất liệu tuyệt vời" 
              content="Áo mặc rất mát, len mềm không bị ngứa. Họa tiết hoa móc rất đều và đẹp, mình cực kỳ hài lòng." 
              avatar="M"
            />
            <ReviewCard 
              name="Anh Tuấn" 
              title="Quà tặng ý nghĩa" 
              content="Mình mua tặng mẹ, mẹ khen lắm. Đóng gói rất cẩn thận và thơm mùi thảo mộc. Cảm ơn Len & Sợi!" 
              avatar="A"
            />
            <ReviewCard 
              name="Lan Chi" 
              title="Đáng đồng tiền" 
              content="Đúng là hàng thủ công có khác, cầm cái áo nặng tay và sướng lắm. Màu Kem tự nhiên rất dễ phối đồ." 
              avatar="L"
            />
          </div>
        </section>

        {/* Related Products */}
        <section className="py-20 border-t border-outline-variant">
          <h3 className="text-2xl font-bold mb-12">Sản phẩm tương tự</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCVrlkwSX8k86l6czr4tmcfYTAuITAykoEyvDN2BbI_35DGhSPZy2G2n6HPOLaft28PaoCmS2JCE0Q4GghNaVtQRLmUpW9zg_0vHuL4tdJXfsrCn61-FPmR7yS55Mik48mvzBzbMDBqhcRsEUxtpd3UxyCy8roGe4R74Gr3PKGnI2XCajXan_bwQ1-wZgzyojxWs5XY-qFR8wxtbxVpAQKsovQrIrxgU1wmxFmo-xMCwSsYXrWoR0v7_eDIyC93agbb1dJKiAS3xFg"
              name="Túi Tote Crochet"
              price="220.000đ"
            />
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuC1PNg-zQ_Vo2FbfXaos6az2DGgkROtyG_tEB7V8Q-EOswjmhXUx7OQvq0sd7ssPDMAbmuSnGbpQIYjqG8nDdlxiyPj3tsyi0rhPftUBQhjZEeQ4420AhsGGQwYEfy2z9lgWNWZLqxn_eF5LnonI77DvP9l955g_oonhvIwalYdi7XmTgx8L1ZZjk-GhScK3ECh_ExlRmR4kUCNqZKLE2W1LA4RbcfBnC3TY3gpnqRgn-OeLJQjYgRgFPtgtpqUPfYheoJwH1vpD40"
              name="Khăn Choàng Bohemian"
              price="350.000đ"
            />
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuB2t9DfpKimrhHZJzszjLOEYXJtAwozR_MyGLpuZiTPhYXTC654nRQFNed7GGzqwRn_RgP4pS2ssle0n7ctPzspwyivKV8Wj0b5l62zW9kNTBwTOrJFnX9ap8aD867Xs-pkNl3reg5NHSIQH1ZkI51BnFHkqaNvNtO5t5nzI6WQzuqYseDwz32DIF9gdY4O5EQe1YaXux1wpMVvBSoW-dIiTfP6i0i9aUrgQvGV0hUu3_Fy0MMCDjX2ZKNb9jNkta3EzZPFAjTiEf4"
              name="Mũ Bucket Cotton"
              price="180.000đ"
            />
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAcAT6PqOauNlxu3O4hCWSAKrmwunLI4ExWrubwgT4VLS52QLQKtPhTnEttMc8HoEyWGC0bdYJuJnFq1vXA5cRxrvCOfrvAQnKUfjwjOj2RmDgZbiZYAslIZ3nb2OaNVK_NQnLrrzN0mkT8k8fjHBk-uNg1Zfd-wLqqsekVAxB64I9U09-inTZNlBK6SEiTkc2Cc__AP56bcVgQssta5xImi5qlx5V9zQbenDrS8SbkmvEDv4IimBe7qf2woUBJdOsLKeSNr4VKWYc"
              name="Áo Gilet Caro"
              price="380.000đ"
            />
          </div>
        </section>
      </main>
    <Footer />
      
    </div>
  );
}