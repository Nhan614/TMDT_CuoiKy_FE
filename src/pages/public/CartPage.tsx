import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface CartItemData {
  id: number;
  name: string;
  color: string;
  sizeOrMaterial: string;
  price: number;
  quantity: number;
  image: string;
}

interface Recommendation {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
}

const INITIAL_CART: CartItemData[] = [
  {
    id: 1,
    name: "Áo Len Crochet",
    color: "Kem tự nhiên",
    sizeOrMaterial: "Size: M",
    price: 1250000,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPOOJ5MwxqnT8udqRpMvLG9T24mFIXPuc4BrCyij0aMT6K5zDAxGS-yck9XuppDjKSHmtx1UlqvUGTf-F_ZrTZdrZ62mL0NJE-iWPc6dKFsUiQ80Wg57AVDpraIclL9Dx0DZox3fMK9UXwZSZv3YwHL4C0sQ97PX1MvfxMbLBsnA6y1Snht_MZ6hLddDHH8lKmZGgw3WX8mXZ0WyTTVFRSMFsr-J7WU1mhLowsIgSUaRI9G63tkbfmbbPnL-yWG4Ez66r8phEqUGI",
  },
  {
    id: 2,
    name: "Túi Xách Thủ Công",
    color: "Cam Đất",
    sizeOrMaterial: "Chất liệu: Cotton hữu cơ",
    price: 450000,
    quantity: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFyWjO0Uv-Mz722ZNphEgHeWL9t0bXeSKLdNaefXEdloP9BaWtEI7MvF6OJZgsroIToTa51OOsxN0PVnwkzQo18VYseryjAFpEiGspn5hwL-oypl5VXX3DyAGO5UX7xVQBTTh6nChln1ZZk6_rzsPToSDir6gTb9Da_JZlT6rTIEVwAdRkiG6GzxJmPsU29n8293EqN20vlkuQchixMt3Oxl6p4Qpjw7hKilmlGGmQiv2GLhovApOI8J2U7c6sreFAzuPuWD--pl0",
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    name: "Nón Len Alpaca",
    price: 290000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-eYWwGsocCcrVEvPKYhALibPnVu5inyy0VrOZ8XvyL8fNm1NwYS6Cd2YSskmprL1X1s78iwsDdHTSJqKj83C4A8AnORLMHnPKgfraPRqoBL_NYH6ech4L__goCaCKUCrk_nSu9hwKPSatbpiTcgUp71zYqCtLpwpqgD60MPgUHVL6SAuP_FnXVlVtAO5iXuuRLPN6FgQsC_qln0QBInVzpW4lPgUredZdhHjm9B9oilH5ubsSl1BPuQInVCgLzLJ-xCqK_JdDLK4",
    isNew: true,
  },
  {
    id: 2,
    name: "Khăn Choàng Mỏng",
    price: 350000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAaZYhwKUEHVq_L2it8fplN__VenP_udwWg7qs9wljLv6vcTELGv2jLIcynH1F1eVUbLNQmLIfdlqLP0KaWO9PjsE29YNrUjUpzJvZJOkBPc0QHDWOGC8UsXNE8zM5v84C7-RWSzAu_7lUBpnl8TPqYPklzE-h4Ent3nupDKyhacfI-pUIn-NNIlKmmYzra_MunjfTP5mNhEuJiVSwyrKZdED6UPMixZzBB8he5pGbKoFQFHuJq3XlxO4j_iUniodS9zQ6fpMVo0lA",
  },
  {
    id: 3,
    name: "Tất Len Giữ Ấm",
    price: 120000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpknl4WaGx64JX1JQlxYBkBILRipgsSWafOM4oD9kSotBstAc6v58cYsqCwcebPCS-z7Aip-FneVEveAO2-RWXIwbv1XgxTKDnRQEImqY6ErkK4alEd5GsNLt2IGtUD_3727u8chPf1-hyNnTNMiYo8we1GrXbu-ZpSpMAmIJYv7C5I1x5E2OZHJShALpFH4S-FZSvyXQwk1PKjPndbc06ghGpxRmDfWwXRP9v81KZle9Tc73e-ydFN9LR0r8hL-wkqgRYBgwqfBM",
  },
  {
    id: 4,
    name: "Thú Bông Thủ Công",
    price: 480000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjfV6uR8oEQPXGDhhQe7V0z0yCLhfRWnVaNdITAfmVKdHHY6G2EolC__zyKDT0NC-tbJbE0VrALG2xu1pIGyy5YE777MeyDjzkqvgRFvvCNi6X1Dl8cU_1r_pZBTAFJPfO_Mp4krdL127TRNwA-9DvjvjEUItMNv3sMvVwSsqHGTLvGRvQAZ6byw0XM4F6no_Psmm_cGeaDzqvfnKTc3I3e76BvviXGMU6aMP-ciU9zhgmGneh88sYZ7xXMxMbKVUGRp5azLfsBfg",
  },
];
const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN") + "₫";
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItemData[]>(INITIAL_CART);
  const [coupon, setCoupon] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow max-w-(--spacing-container-max) mx-auto px-6 py-10 md:py-16 w-full">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-on-background">
            Giỏ hàng của bạn
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Product List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-outline-variant/50 uppercase text-[11px] font-bold tracking-widest text-secondary/70">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Tổng cộng</div>
            </div>

            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center flex flex-col items-center gap-4"
                >
                  <ShoppingBag size={48} className="text-secondary/20" />
                  <p className="text-secondary italic">
                    Giỏ hàng của bạn đang trống
                  </p>
                  <a
                    href="#"
                    className="text-primary font-bold hover:underline"
                  >
                    Quay lại cửa hàng
                  </a>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6 border-b border-outline-variant/30 group"
                  >
                    <div className="col-span-1 md:col-span-6 flex gap-6">
                      <div className="w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden bg-surface-container-high transition-transform group-hover:scale-[1.02]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <h3 className="text-xl md:text-2xl font-semibold text-on-surface leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-secondary">
                          Màu: {item.color}
                        </p>
                        <p className="text-sm text-secondary">
                          {item.sizeOrMaterial}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 mt-2 text-primary hover:opacity-70 transition-opacity md:hidden"
                        >
                          <Trash2 size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Xóa
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-center text-on-surface font-medium">
                      {formatCurrency(item.price)}
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-outline rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-2 hover:bg-surface-container-low transition-colors text-secondary"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-2 hover:bg-surface-container-low transition-colors text-secondary"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-right">
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center">
                        <span className="md:hidden text-[10px] font-bold text-secondary uppercase tracking-widest">
                          Tạm tính
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-xl md:text-base font-bold text-on-surface">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="hidden md:flex items-center gap-1 mt-2 text-secondary/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            <motion.div layout className="pt-8">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
              >
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span>Tiếp tục mua sắm</span>
              </a>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
              <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Tổng tiền hàng</span>
                  <span className="text-on-surface font-bold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Phí vận chuyển</span>
                  <span className="text-secondary italic">Tính toán sau</span>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nhập mã coupon"
                    className="flex-grow bg-white border border-outline-variant/50 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                  <button className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-secondary/20 transition-colors uppercase">
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-on-surface">
                    Tổng cộng
                  </span>
                  <span className="text-3xl text-primary font-bold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl text-lg hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
              >
                Tiến hành thanh toán
              </motion.button>

              <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                <Wallet size={20} />
                <CreditCard size={20} />
                <Banknote size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <section className="mt-20 md:mt-32 border-t border-outline-variant/30 pt-12 md:pt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-10">
            Có thể bạn sẽ thích
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {RECOMMENDATIONS.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative bg-surface-container-high shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {item.isNew && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-on-background">
                        New
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-secondary mt-1">
                  {formatCurrency(item.price)}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
