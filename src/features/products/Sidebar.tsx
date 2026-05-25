import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setFilters } from "./productSlice";

const COLORS = [
  { name: "Orange", value: "#f0601a" },
  { name: "Beige", value: "#E5DFD7" },
  { name: "Slate", value: "#5A5C5C" },
  { name: "White", value: "#FFFFFF", border: true },
  { name: "Brown", value: "#370E00" },
];

const CATEGORIES = [
  { id: undefined, name: "Tất cả", count: 63 },
  { id: 1, name: "Clothing", count: 24 },
  { id: 2, name: "Accessories", count: 18 },
  { id: 3, name: "Home Decor", count: 12 },
  { id: 4, name: "Gifts", count: 9 },
];

function Sidebar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.product);
  const [searchVal, setSearchVal] = useState(filters.search || "");

  // Sync search input with Redux search filter (if changed externally)
  useEffect(() => {
    setSearchVal(filters.search || "");
  }, [filters.search]);

  const handleCategorySelect = (categoryId: number | undefined) => {
    dispatch(setFilters({ categoryId }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    dispatch(setFilters({ search: val, page: 1 }));
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-8">
      {/* Search Box */}
      <div>
        <h3 className="text-xl font-bold mb-4">Tìm kiếm</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-neutral-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xl font-bold mb-4">Danh mục</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((category) => {
            const isActive = filters.categoryId === category.id;
            return (
              <li
                key={category.name}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center justify-between group cursor-pointer transition-colors ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-on-surface hover:text-primary"
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-container-low text-secondary"
                  }`}
                >
                  {category.count}
                </span>
              </li>
            );
          })}
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
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                idx === 0 ? "dot-shadow" : ""
              }`}
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

