import React from "react";
import { Edit2, Trash2, Eye, EyeOff, Package } from "lucide-react";
import type { ProductResponseDTO } from "../../features/products/productType";

interface ProductTableProps {
  products: ProductResponseDTO[];
  onEdit: (product: ProductResponseDTO) => void;
  onToggleStatus: (id: number, currentStatus: "ACTIVE" | "HIDDEN") => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onToggleStatus,
  onDelete,
}: ProductTableProps) {
  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Đang Bán
          </span>
        );
      case "HIDDEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Đang Ẩn
          </span>
        );
      case "DELETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Đã Xóa
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

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
          <Package size={24} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-800">Không có sản phẩm nào</h3>
          <p className="text-xs text-stone-400 mt-1">
            Bắt đầu thêm sản phẩm handmade đầu tiên của bạn để bán trên thị trường.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] uppercase font-bold tracking-wider">
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4 text-center">Kho</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700 text-sm">
            {products.map((product) => {
              const isPreOrder = product.isPreOrder;
              const hasDiscount = product.discountPrice !== undefined && product.discountPrice !== null;
              const displayStatus = product.status || (product.isActive ? "ACTIVE" : "HIDDEN");

              return (
                <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Product Thumbnail and Title */}
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
                        <span className="font-semibold text-stone-900 block truncate max-w-[200px]">
                          {product.name}
                        </span>
                        {isPreOrder && (
                          <span className="inline-flex text-[9px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                            Chuẩn bị {product.makingDays || 0} ngày
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-stone-500 font-medium">
                    {product.categoryName || "Chưa phân loại"}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    {hasDiscount ? (
                      <div className="space-y-0.5">
                        <p className="font-bold text-stone-900">
                          {formatPrice(product.discountPrice!)}
                        </p>
                        <p className="text-xs text-stone-400 line-through">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    ) : (
                      <span className="font-bold text-stone-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </td>

                  {/* Stock Quantity */}
                  <td className="px-6 py-4 text-center font-semibold text-stone-800">
                    {product.stockQuantity ?? 0}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">{getStatusBadge(displayStatus)}</td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Hide/Show Toggle */}
                      {displayStatus !== "DELETED" && (
                        <button
                          onClick={() =>
                            onToggleStatus(
                              product.id,
                              displayStatus === "ACTIVE" ? "ACTIVE" : "HIDDEN"
                            )
                          }
                          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                          title={displayStatus === "ACTIVE" ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                        >
                          {displayStatus === "ACTIVE" ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}

                      {/* Edit Button */}
                      {displayStatus !== "DELETED" && (
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-xl text-stone-400 hover:text-primary hover:bg-primary/5 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}

                      {/* Delete Button */}
                      {displayStatus !== "DELETED" && (
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={16} />
                        </button>
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
  );
}
