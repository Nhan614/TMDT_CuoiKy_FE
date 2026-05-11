const COLORS = [
  { name: "Orange", value: "#f0601a" },
  { name: "Beige", value: "#E5DFD7" },
  { name: "Slate", value: "#5A5C5C" },
  { name: "White", value: "#FFFFFF", border: true },
  { name: "Brown", value: "#370E00" },
];

function Sidebar() {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-8">
      {/* Category */}
      <div>
        <h3 className="text-xl font-bold mb-4">Danh mục</h3>
        <ul className="space-y-2">
          <li className="flex items-center justify-between group hover:text-primary transition-colors cursor-pointer">
            <span>Clothing</span>
            <span className="text-xs font-semibold bg-surface-container-low px-2 py-0.5 rounded-full">
              24
            </span>
          </li>
          <li className="flex items-center justify-between group text-primary font-bold cursor-pointer">
            <span>Accessories</span>
            <span className="text-xs font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
              18
            </span>
          </li>
          <li className="flex items-center justify-between group hover:text-primary transition-colors cursor-pointer">
            <span>Home Decor</span>
            <span className="text-xs font-semibold bg-surface-container-low px-2 py-0.5 rounded-full">
              12
            </span>
          </li>
          <li className="flex items-center justify-between group hover:text-primary transition-colors cursor-pointer">
            <span>Gifts</span>
            <span className="text-xs font-semibold bg-surface-container-low px-2 py-0.5 rounded-full">
              9
            </span>
          </li>
        </ul>
      </div>

      {/* Material */}
      <div className="pt-6 border-t border-neutral-border">
        <h3 className="text-xl font-bold mb-4">Chất liệu</h3>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold">
            Cotton
          </button>
          <button className="px-4 py-2 border border-neutral-border hover:border-primary rounded-lg text-xs font-bold transition-colors">
            Merino Wool
          </button>
          <button className="px-4 py-2 border border-neutral-border hover:border-primary rounded-lg text-xs font-bold transition-colors">
            Velvet
          </button>
          <button className="px-4 py-2 border border-neutral-border hover:border-primary rounded-lg text-xs font-bold transition-colors">
            Acrylic
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="pt-6 border-t border-neutral-border">
        <h3 className="text-xl font-bold mb-4">Giá (VND)</h3>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="2000000"
            step="50000"
            className="w-full h-1 bg-beige rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-2 text-xs text-secondary font-medium">
            <span>0đ</span>
            <span>2.000.000đ</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="pt-6 border-t border-neutral-border">
        <h3 className="text-xl font-bold mb-4">Màu sắc</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color, idx) => (
            <button
              key={color.name}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${idx === 0 ? "dot-shadow" : ""}`}
              style={{
                backgroundColor: color.value,
                border: color.border ? "1px solid #e5e5e5" : "none",
              }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
