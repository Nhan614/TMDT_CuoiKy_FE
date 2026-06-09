import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, Link } from "react-router-dom";
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
  Heart,
  Loader2,
  ShoppingCart,
  Check,
} from "lucide-react";
import Navbar from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addToCart } from "../../features/cart/cartThunk";
import { fetchProductById, fetchProducts } from "../../features/products/productThunk";
import CommentSection from "../../features/comment/CommentSection";
interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: string;
}

function ProductCard({ id, image, name, price }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <Link to={`/products/${id}`}>
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
        <h4 className="font-bold text-on-background mb-1 group-hover:text-primary transition-colors leading-tight truncate">{name}</h4>
        <p className="text-primary font-bold">{price}</p>
      </Link>
    </motion.div>
  );
}


function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="h-4 bg-surface-container-high rounded w-1/4 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-[4/5] rounded-xl bg-surface-container-high" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-surface-container-high" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="space-y-4">
                <div className="h-4 bg-surface-container-high rounded w-1/4" />
                <div className="h-10 bg-surface-container-high rounded w-3/4" />
                <div className="h-5 bg-surface-container-high rounded w-1/3" />
                <div className="h-8 bg-surface-container-high rounded w-1/4" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-container-high rounded w-full" />
                <div className="h-4 bg-surface-container-high rounded w-full" />
                <div className="h-4 bg-surface-container-high rounded w-5/6" />
              </div>
              <div className="h-12 bg-surface-container-high rounded w-full mt-6" />
              <div className="h-12 bg-surface-container-high rounded w-full" />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function ProductNotFound({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="max-w-md p-8 border border-outline-variant rounded-2xl bg-surface-container-low shadow-sm">
            <h2 className="text-2xl font-bold text-on-background mb-4">Lỗi tải sản phẩm</h2>
            <p className="text-secondary mb-8">{error || "Sản phẩm không tồn tại hoặc có lỗi xảy ra."}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all cursor-pointer"
              >
                Thử lại
              </button>
              <Link
                to="/products"
                className="px-6 py-3 border border-outline text-on-background rounded-lg font-bold hover:bg-surface-container-high transition-all"
              >
                Về danh mục
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { product, isLoading, error } = useAppSelector((state) => state.product.productDetail);
  const relatedProducts = useAppSelector((state) => state.product.products);
  const { isLoading: cartLoading } = useAppSelector((state) => state.cart);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Kem");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.categoryId) {
      dispatch(fetchProducts({ categoryId: product.categoryId, page: 1, size: 5, sortBy: "newest", isActive: true }));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (product) {
      const imgs = product.images && product.images.length > 0
        ? product.images
        : (product.thumbnailUrl ? [product.thumbnailUrl] : []);
      setSelectedImage(imgs[0] || "");
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    const result = await dispatch(addToCart({ productId: product.id, quantity }));
    if (addToCart.fulfilled.match(result)) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleRetry = () => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound error={error || "Không tìm thấy sản phẩm."} onRetry={handleRetry} />;
  }

  const productImages = product.images && product.images.length > 0
    ? product.images
    : (product.thumbnailUrl ? [product.thumbnailUrl] : []);

  const priceNum = typeof product.price === "number" ? product.price : parseFloat(String(product.price)) || 0;
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice !== null;
  const discountPriceNum = hasDiscount ? (typeof product.discountPrice === "number" ? product.discountPrice : parseFloat(String(product.discountPrice)) || 0) : 0;

  const filteredRelated = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs uppercase tracking-widest text-secondary gap-3 mb-12">
          <Link to="/home" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-primary">
            Cửa hàng
          </Link>
          {product.categoryName && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-secondary">{product.categoryName}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-on-background font-bold truncate max-w-[200px] md:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              layoutId="main-image"
              className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </motion.div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <header className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                {product.artisanName ? `Nghệ nhân: ${product.artisanName}` : "Handmade Selection"}
              </span>
              <h1 className="text-4xl font-bold text-on-background leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => {
                    const stars = Math.round(product.averageRating ?? 5);
                    return <Star key={i} className={`w-4 h-4 ${i < stars ? "fill-current" : "text-outline-variant"}`} />;
                  })}
                </div>
                <span className="text-secondary text-sm">
                  ({product.averageRating ? product.averageRating.toFixed(1) : "Chưa có"} đánh giá)
                </span>
              </div>
              <div>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-primary">
                      {discountPriceNum.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-lg text-secondary line-through">
                      {priceNum.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {priceNum.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
            </header>

            <p className="text-secondary leading-relaxed text-body-lg">
              {product.shortDescription || "Sản phẩm được hoàn thiện hoàn toàn thủ công từ nguyên vật liệu thân thiện với môi trường."}
            </p>

            <div className="space-y-8">
              {/* Sizing & PreOrder Information Badges if applicable */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-secondary">
                {product.stockQuantity !== undefined && (
                  <div className="px-3 py-1.5 bg-surface-container rounded-full">
                    Còn lại: <span className="text-on-background font-bold">{product.stockQuantity}</span>
                  </div>
                )}
                {product.isPreOrder && (
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                    Đặt trước (Sản xuất trong khoảng: {product.makingDays || 7} ngày)
                  </div>
                )}
              </div>

              {/* Colors */}
              <div>
                <span className="text-xs font-bold text-on-background uppercase tracking-widest block mb-4">
                  Màu sắc
                </span>
                <div className="flex gap-4">
                  {[
                    { name: "Kem", color: "#F5F5DC" },
                    { name: "Nâu", color: "#8B4513" },
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-3 px-5 py-2.5 rounded-lg border-2 transition-all ${selectedColor === c.name ? "border-primary bg-primary/5" : "border-outline-variant hover:border-outline"}`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-sm font-medium">
                        {c.name === "Kem" ? "Kem tự nhiên" : "Nâu đất"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <span className="text-xs font-bold text-on-background uppercase tracking-widest block mb-4">
                  Kích thước
                </span>
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
                <motion.button
                  onClick={handleAddToCart}
                  disabled={cartLoading || (product.stockQuantity !== undefined && product.stockQuantity <= 0 && !product.isPreOrder)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-bold shadow-lg transition-all active:scale-[0.98] ${addedToCart
                    ? "bg-green-600 text-white shadow-green-600/20"
                    : (product.stockQuantity !== undefined && product.stockQuantity <= 0 && !product.isPreOrder)
                      ? "bg-outline-variant text-secondary cursor-not-allowed shadow-none"
                      : "bg-primary text-white shadow-primary/20 hover:brightness-110"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {cartLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Đang thêm...</>
                  ) : addedToCart ? (
                    <><Check className="w-5 h-5" /> Đã thêm vào giỏ!</>
                  ) : (product.stockQuantity !== undefined && product.stockQuantity <= 0 && !product.isPreOrder) ? (
                    <>Hết hàng</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng</>
                  )}
                </motion.button>
              </div>
            </div>

            <footer className="pt-8 border-t border-outline-variant flex gap-8">
              <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-primary" />
                100% Organic
              </div>
              <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                <Hand className="w-4 h-4 text-primary" />
                Thủ công Việt Nam
              </div>
            </footer>
          </div>
        </section>

        {/* Info Tabs */}
        <section className="py-20 border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-2xl font-bold mb-8">Thông tin chi tiết</h3>
            <div className="space-y-6 text-secondary leading-relaxed">
              <p>
                {product.description || "Từng chi tiết sản phẩm được gia công thủ công một cách tỉ mỉ bởi nghệ nhân lành nghề của chúng tôi."}
              </p>
              <ul className="space-y-4">
                {product.materials && product.materials.length > 0 ? (
                  product.materials.map((mat, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Chất liệu: {mat}
                    </li>
                  ))
                ) : (
                  <li className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Chất liệu: Nguyên liệu hữu cơ tự nhiên cao cấp
                  </li>
                )}
                {product.categoryName && (
                  <li className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Danh mục: {product.categoryName}
                  </li>
                )}
                {product.artisanName && (
                  <li className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Được làm bởi nghệ nhân: {product.artisanName}
                  </li>
                )}
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Sản xuất hoàn toàn thủ công tại Việt Nam.
                </li>
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
                { icon: <ThermometerSun />, label: "Ủi ở nhiệt độ thấp" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-surface-container rounded-xl flex flex-col items-center text-center gap-3 transition-colors hover:bg-surface-container-high"
                >
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <CommentSection productId={Number(id)} />

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <section className="py-20 border-t border-outline-variant">
            <h3 className="text-2xl font-bold mb-12">Sản phẩm tương tự</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {filteredRelated.map((p) => {
                const pPrice = typeof p.price === "number" ? p.price : parseFloat(String(p.price)) || 0;
                const pHasDiscount = p.discountPrice !== undefined && p.discountPrice !== null;
                const pDiscountPriceNum = pHasDiscount ? (typeof p.discountPrice === "number" ? p.discountPrice : parseFloat(String(p.discountPrice)) || 0) : 0;
                const displayPrice = pHasDiscount
                  ? `${pDiscountPriceNum.toLocaleString("vi-VN")}đ`
                  : `${pPrice.toLocaleString("vi-VN")}đ`;

                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    image={p.thumbnailUrl || ""}
                    name={p.name || p.title || ""}
                    price={displayPrice}
                  />
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
