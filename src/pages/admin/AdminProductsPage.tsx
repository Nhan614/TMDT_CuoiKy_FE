import React, { useEffect, useState } from "react";
import { Search, Loader2, RefreshCw, Eye, EyeOff, ShieldAlert, Package, Plus, Edit2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProductsAdmin, adminToggleProductStatus } from "../../features/products/productThunk";
import type { ProductResponseDTO, ProductStatus } from "../../features/products/productType";
import ProductFormModal from "../../components/products/ProductFormModal";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { products, totalPages, isLoading, error } = useAppSelector(
    (state) => state.product
  );

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseDTO | null>(null);

  const loadProducts = () => {
    dispatch(
      fetchProductsAdmin({
        page,
        size: 10,
        keyword: keyword.trim() || undefined,
        status: status || undefined,
      })
    );
  };

  useEffect(() => {
    loadProducts();
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleToggleStatus = (id: number, currentStatus?: string) => {
    const newStatus: ProductStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    dispatch(adminToggleProductStatus({ id, status: newStatus }));
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductResponseDTO) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSaved = () => {
    setIsModalOpen(false);
    loadProducts();
  };

  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const getStatusBadge = (prodStatus?: string, isActive?: boolean) => {
    const statusVal = prodStatus || (isActive ? "ACTIVE" : "HIDDEN");
    switch (statusVal) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Đang Hoạt Động
          </span>
        );
      case "HIDDEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Tạm Khóa/Ẩn
          </span>
        );
      case "DELETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Đã Xóa (Lưu trữ)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-50 text-stone-700 border border-stone-200">
            Không rõ
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Quản Trị Sản Phẩm Toàn Hệ Thống</h1>
          <p className="text-xs text-stone-500 mt-1">
            Danh sách tất cả sản phẩm của các nghệ nhân đăng ký trên hệ thống ArtisanMarket.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="text-xs font-bold">Làm mới</span>
          </button>
          <button
            id="admin-add-product-btn"
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md shadow-primary/10 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên, mô tả..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
          />
        </form>

        <div className="flex w-full md:w-auto items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ProductStatus | "");
              setPage(1);
            }}
            className="px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang Hoạt Động</option>
            <option value="HIDDEN">Tạm Khóa/Ẩn</option>
            <option value="DELETED">Đã Bị Xóa</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-2xl border border-red-100 font-medium">
          Lỗi: {error}
        </div>
      )}

      {/* Table Section */}
      {isLoading && products.length === 0 ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800">Không tìm thấy sản phẩm</h3>
            <p className="text-xs text-stone-400 mt-1">Không có sản phẩm nào khớp với bộ lọc tìm kiếm hiện tại.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-6 py-4">Nghệ nhân</th>
                    <th className="px-6 py-4">Danh mục</th>
                    <th className="px-6 py-4">Giá bán</th>
                    <th className="px-6 py-4 text-center">Tồn kho</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 text-sm">
                  {products.map((product) => {
                    const displayStatus = product.status || (product.isActive ? "ACTIVE" : "HIDDEN");

                    return (
                      <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                        {/* Title and image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                              {product.thumbnailUrl ? (
                                <img
                                  src={product.thumbnailUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                  <Package size={18} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-stone-900 block truncate max-w-[200px]" title={product.name}>
                                {product.name}
                              </span>
                              <span className="text-[10px] text-stone-400 block mt-0.5">ID: {product.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Artisan */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-stone-900">{product.artisanName || "Ẩn danh"}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">Artisan ID: {product.artisanId || "N/A"}</span>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-stone-500 font-medium">{product.categoryName || "Chưa phân loại"}</td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          {product.discountPrice ? (
                            <div className="space-y-0.5">
                              <p className="font-bold text-stone-900">{formatPrice(product.discountPrice)}</p>
                              <p className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</p>
                            </div>
                          ) : (
                            <span className="font-bold text-stone-900">{formatPrice(product.price)}</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4 text-center font-semibold text-stone-800">{product.stockQuantity ?? 0}</td>

                        {/* Status */}
                        <td className="px-6 py-4">{getStatusBadge(product.status, product.isActive)}</td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {displayStatus !== "DELETED" && (
                              <>
                                {/* Nút Chỉnh sửa */}
                                <button
                                  id={`edit-product-${product.id}`}
                                  onClick={() => handleEdit(product)}
                                  className="p-2 rounded-xl text-stone-400 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                                  title="Chỉnh sửa sản phẩm"
                                >
                                  <Edit2 size={14} />
                                </button>

                                {/* Nút Khóa / Mở bán */}
                                <button
                                  id={`toggle-status-${product.id}`}
                                  onClick={() => handleToggleStatus(product.id, displayStatus)}
                                  className={`p-2 rounded-xl transition-all inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                                    displayStatus === "ACTIVE"
                                      ? "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                      : "text-green-600 hover:bg-green-50 hover:text-green-700"
                                  }`}
                                  title={displayStatus === "ACTIVE" ? "Khóa/Ẩn sản phẩm" : "Mở bán lại"}
                                >
                                  {displayStatus === "ACTIVE" ? (
                                    <>
                                      <EyeOff size={14} /> Khóa/Ẩn
                                    </>
                                  ) : (
                                    <>
                                      <Eye size={14} /> Mở Bán
                                    </>
                                  )}
                                </button>
                              </>
                            )}

                            {displayStatus === "DELETED" && (
                              <span className="inline-flex items-center gap-1 text-stone-400 text-xs font-semibold py-1">
                                <ShieldAlert size={14} /> Không chỉnh sửa
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
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

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleModalSaved}
          mode="admin"
        />
      )}
    </div>
  );
}
