import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ProductCard from "../../features/products/ProductCard";
import Sidebar from "../../features/products/Sidebar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "../../features/products/productThunk";
import { setFilters, setPage } from "../../features/products/productSlice";
import type { AddToCartRequest } from '../../features/cart/cartType';
import { addToCart } from "../../features/cart/cartThunk";

function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, totalPages, totalElements, isLoading, error, filters } =
    useAppSelector((state) => state.product);

  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sortBy: e.target.value, page: 1 }));
  };

  const handleAddToCart = (addToCartRequest: AddToCartRequest) => {
    dispatch(addToCart(addToCartRequest));
  }

  return (
    <main className="grow max-w-300 mx-auto mt-15 px-4 md:px-6 py-8 md:py-16 w-full">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <Sidebar />

        {/* Product Feed */}
        <section className="grow">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 pb-4 border-b border-neutral-border gap-4">
            <p className="text-secondary font-medium">
              {isLoading ? (
                <span>Đang tải sản phẩm...</span>
              ) : (
                <span>
                  Hiển thị {products.length} trên {totalElements} sản phẩm
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                Sắp xếp theo:
              </span>
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer outline-none text-sm"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp đến Cao</option>
                <option value="priceDesc">Giá: Cao đến Thấp</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>
          </div>

          {/* Loading / Error / Grid State */}
          {isLoading ? (
            <div className="min-h-80 flex flex-col items-center justify-center gap-4 text-secondary">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-medium text-sm">Đang tải danh sách sản phẩm từ máy chủ...</p>
            </div>
          ) : error ? (
            <div className="min-h-80 flex flex-col items-center justify-center p-8 border border-red-200/50 rounded-2xl bg-red-500/5 text-center">
              <p className="text-red-600 font-semibold mb-2">Đã xảy ra lỗi khi tải sản phẩm</p>
              <p className="text-sm text-secondary max-w-md mb-6">{error}</p>
              <button
                onClick={() => dispatch(fetchProducts(filters))}
                className="px-6 py-2.5 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
              >
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-80 flex flex-col items-center justify-center p-8 border border-neutral-border rounded-2xl text-center">
              <p className="font-semibold text-lg text-on-surface mb-2">Không tìm thấy sản phẩm nào</p>
              <p className="text-sm text-secondary max-w-sm">
                Vui lòng thử lại với từ khóa tìm kiếm hoặc danh mục bộ lọc khác.
              </p>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => {
                // Map database ProductResponseDTO properties to ProductCard properties
                const mappedProduct = {
                  id: product.id,
                  title: product.name || product.title || "Sản phẩm không tên",
                  price:
                    typeof product.price === "number"
                      ? product.price.toLocaleString("vi-VN")
                      : String(product.price),
                  rating: product.rating ?? 5.0,
                  image:
                    product.thumbnailUrl ?? ""
                };

                return <ProductCard key={product.id} {...mappedProduct} onAddToCart={handleAddToCart} />;
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${filters.page === pageNum
                      ? "bg-primary text-white"
                      : "border border-neutral-border hover:border-primary hover:text-primary"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={filters.page === totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProductsPage;

