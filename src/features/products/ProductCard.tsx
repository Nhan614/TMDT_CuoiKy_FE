import { Star, Heart } from "lucide-react";
import { motion } from "motion/react";

interface ProductProps {
  id: number;
  title: string;
  price: string;
  rating: number;
  image: string;
}

export default function ProductCard({
  title,
  price,
  rating,
  image,
}: ProductProps) {
  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-4/5 bg-beige rounded-lg overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors duration-300">
          <Heart size={20} strokeWidth={1.5} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all">
            Thêm vào giỏ
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-lg text-on-surface group-hover:text-primary transition-colors leading-tight">
            {title}
          </h4>
          <div className="flex items-center gap-1 text-yellow-500 shrink-0">
            <Star size={16} fill="currentColor" strokeWidth={0} />
            <span className="text-xs font-semibold text-secondary">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-primary font-bold text-xl">{price}đ</p>
      </div>
    </motion.div>
  );
}
