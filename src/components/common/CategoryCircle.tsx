interface CategoryCircle {
  image: string;
  title: string;
}

function CategoryCircle({ image, title }: CategoryCircle) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-stone-100 p-2 group-hover:border-stone-300 transition-all">
        <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors" />
        </div>
      </div>
      <span className="text-sm font-medium text-stone-700 tracking-wide">
        {title}
      </span>
    </div>
  );
}

export default CategoryCircle;
