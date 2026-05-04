import { Heart, Star } from "lucide-react";
import { motion } from "motion/react";

export interface ProductCardProps {
  image: string;
  title: string;
  category: string;
  rating: number;
  price: string;
}

function ProductCard({
  image,
  title,
  category,
  rating,
  price,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-50"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-600 hover:text-stone-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={18} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">
          {category}
        </p>
        <h3 className="text-sm font-medium text-stone-800 mb-2 truncate">
          {title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < rating ? "fill-amber-400 text-amber-400" : "text-stone-200"
              }
            />
          ))}
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-stone-900 font-serif font-bold">{price}</span>
          <button className="text-[10px] uppercase font-bold tracking-tighter text-stone-800 border-b border-stone-800 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors">
            {" "}
            Thêm Vào Giỏ{" "}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
