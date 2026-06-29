import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, Loader2, PackageOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyProducts, toggleProductStatus, deleteProduct } from "../../features/products/productThunk";
import type { ProductResponseDTO, ProductStatus } from "../../features/products/productType";
import ProductTable from "../../components/products/ProductTable";
import ProductFormModal from "../../components/products/ProductFormModal";

export default function ArtisanProductManagePage() {
  const dispatch = useAppDispatch();
  const { products, totalPages, totalElements, isLoading, error } = useAppSelector(
    (state) => state.product
  );

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseDTO | null>(null);

  const loadProducts = useCallback(() => {
    dispatch(fetchMyProducts({ page, size: 10 }));
  }, [dispatch, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (product: ProductResponseDTO) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: number, currentStatus: "ACTIVE" | "HIDDEN") => {
    const newStatus: ProductStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    dispatch(toggleProductStatus({ id, status: newStatus }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này sẽ không thể hoàn tác!")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleModalSaved = () => {
    setIsModalOpen(false);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-stone-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Quản Lý Sản Phẩm</h1>
            <p className="text-sm text-stone-500 mt-1">
              Bạn có tổng cộng <span className="font-semibold text-primary">{totalElements}</span> sản phẩm trong cửa hàng.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadProducts}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Làm mới"
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-sm shadow-md shadow-primary/10 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} /> Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-2xl border border-red-100 font-medium">
            Có lỗi xảy ra: {error}
          </div>
        )}

        {/* Loading Spinner or Content */}
        {isLoading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
              <PackageOpen size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">Cửa hàng trống</h3>
              <p className="text-xs text-stone-400 mt-1">
                Hãy đăng bán sản phẩm handmade đầu tiên của bạn ngay hôm nay!
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 mt-2 cursor-pointer"
            >
              Thêm Sản Phẩm Ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      page === i + 1
                        ? "bg-primary text-white shadow-md shadow-primary/10"
                        : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Form Overlay */}
        {isModalOpen && (
          <ProductFormModal
            product={selectedProduct}
            onClose={() => setIsModalOpen(false)}
            onSaved={handleModalSaved}
          />
        )}
      </div>
    </div>
  );
}
