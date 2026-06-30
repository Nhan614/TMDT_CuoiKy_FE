import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, User } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import type { ProductResponseDTO } from "../../features/products/productType";
import { useAppDispatch } from "../../app/hooks";
import {
  createProduct,
  updateProduct,
  adminCreateProduct,
  adminUpdateProduct,
} from "../../features/products/productThunk";

interface ProductFormModalProps {
  product: ProductResponseDTO | null; // null nếu đang tạo mới
  onClose: () => void;
  onSaved: () => void;
  mode?: "artisan" | "admin"; // mặc định "artisan" để không phá code cũ
  artisanId?: number;          // bắt buộc khi mode="admin" và tạo mới
}

interface Category {
  id: number;
  name: string;
}

interface ArtisanOption {
  id: number;
  name: string;
}

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
  mode = "artisan",
  artisanId: propArtisanId,
}: ProductFormModalProps) {
  const dispatch = useAppDispatch();

  // Form fields
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice?.toString() || "");
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || "0");
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [description, setDescription] = useState(product?.description || "");
  const [isPreOrder, setIsPreOrder] = useState(product?.isPreOrder || false);
  const [makingDays, setMakingDays] = useState(product?.makingDays?.toString() || "0");
  const [materials, setMaterials] = useState(product?.materials?.join(", ") || "");

  // Admin: chọn nghệ nhân khi tạo mới
  const [selectedArtisanId, setSelectedArtisanId] = useState<number | "">(
    propArtisanId ?? (product?.artisanId ?? "")
  );
  const [artisans, setArtisans] = useState<ArtisanOption[]>([]);
  const [artisansLoading, setArtisansLoading] = useState(false);

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product?.thumbnailUrl || "");

  // Categories list
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load categories
  useEffect(() => {
    axiosClient
      .get("/categories?page=1&size=100")
      .then((res) => {
        const pageData = res.data?.data;
        if (pageData && pageData.content) {
          setCategories(pageData.content);
        }
      })
      .catch((err) => {
        console.error("Lấy danh mục thất bại:", err);
      });
  }, []);

  // Load artisans nếu mode=admin và đang tạo mới
  useEffect(() => {
    if (mode === "admin" && !product) {
      setArtisansLoading(true);
      axiosClient
        .get("/artisans?page=0&size=200")
        .then((res) => {
          const data = res.data?.data;
          // API trả về Page<ArtisanCardResponse> hoặc List
          if (Array.isArray(data)) {
            setArtisans(data.map((a: any) => ({ id: a.id, name: a.name || a.shopName || a.username })));
          } else if (data?.content) {
            setArtisans(data.content.map((a: any) => ({ id: a.id, name: a.name || a.shopName || a.username })));
          }
        })
        .catch((err) => {
          console.error("Lấy danh sách nghệ nhân thất bại:", err);
        })
        .finally(() => setArtisansLoading(false));
    }
  }, [mode, product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      if (!isValid) {
        alert("Định dạng ảnh không hợp lệ (Chỉ hỗ trợ JPG, PNG, WEBP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file ảnh tối đa là 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMsg("Vui lòng nhập tên sản phẩm");
    if (!price || parseFloat(price) < 0) return setErrorMsg("Giá sản phẩm phải >= 0");
    if (!stockQuantity || parseInt(stockQuantity) < 0) return setErrorMsg("Số lượng trong kho phải >= 0");
    if (!categoryId) return setErrorMsg("Vui lòng chọn danh mục sản phẩm");

    // Validate artisan khi admin tạo mới
    if (mode === "admin" && !product && !selectedArtisanId) {
      return setErrorMsg("Vui lòng chọn nghệ nhân cho sản phẩm");
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price);
      if (discountPrice) formData.append("discountPrice", discountPrice);
      formData.append("stockQuantity", stockQuantity);
      formData.append("categoryId", categoryId);
      formData.append("shortDescription", shortDescription.trim());
      formData.append("description", description.trim());
      formData.append("isPreOrder", String(isPreOrder));
      formData.append("makingDays", makingDays);

      if (materials) {
        materials
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m.length > 0)
          .forEach((m) => formData.append("materials", m));
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let actionResult;

      if (mode === "admin") {
        if (product) {
          // Admin cập nhật sản phẩm — endpoint PUT /admin/products/{id}
          actionResult = await dispatch(adminUpdateProduct({ id: product.id, formData }));
          if (adminUpdateProduct.rejected.match(actionResult)) {
            return setErrorMsg((actionResult.payload as string) || "Đã xảy ra lỗi khi lưu sản phẩm");
          }
        } else {
          // Admin tạo sản phẩm mới — endpoint POST /admin/products?artisanId=
          actionResult = await dispatch(
            adminCreateProduct({ artisanId: selectedArtisanId as number, formData })
          );
          if (adminCreateProduct.rejected.match(actionResult)) {
            return setErrorMsg((actionResult.payload as string) || "Đã xảy ra lỗi khi lưu sản phẩm");
          }
        }
      } else {
        // Luồng Artisan giữ nguyên
        if (product) {
          actionResult = await dispatch(updateProduct({ id: product.id, formData }));
          if (updateProduct.rejected.match(actionResult)) {
            return setErrorMsg((actionResult.payload as string) || "Đã xảy ra lỗi khi lưu sản phẩm");
          }
        } else {
          actionResult = await dispatch(createProduct(formData));
          if (createProduct.rejected.match(actionResult)) {
            return setErrorMsg((actionResult.payload as string) || "Đã xảy ra lỗi khi lưu sản phẩm");
          }
        }
      }

      onSaved();
    } catch (err: any) {
      setErrorMsg("Không thể lưu sản phẩm. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {mode === "admin"
                ? "Quản trị viên: cung cấp chi tiết thông tin và hình ảnh sản phẩm."
                : "Cung cấp chi tiết thông tin và hình ảnh cho sản phẩm handmade của bạn."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-xl border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Admin: chọn Nghệ nhân khi tạo mới */}
          {mode === "admin" && !product && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                Nghệ nhân <span className="text-red-500">*</span>
              </label>
              {artisansLoading ? (
                <div className="flex items-center gap-2 text-stone-400 text-sm py-2.5">
                  <Loader2 size={14} className="animate-spin" />
                  Đang tải danh sách nghệ nhân...
                </div>
              ) : (
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <select
                    value={selectedArtisanId}
                    onChange={(e) => setSelectedArtisanId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">-- Chọn nghệ nhân --</option>
                    {artisans.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (ID: {a.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Image and Status Details */}
            <div className="space-y-5">
              <label className="block text-sm font-bold text-stone-800">
                Ảnh đại diện sản phẩm <span className="text-red-500">*</span>
              </label>

              {/* Photo Preview & Drop Area */}
              <div className="relative border-2 border-dashed border-stone-200 hover:border-primary/50 rounded-2xl aspect-video overflow-hidden group flex items-center justify-center bg-stone-50 transition-colors">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label className="cursor-pointer bg-white px-4 py-2 rounded-xl text-xs font-bold text-stone-800 shadow-md hover:bg-stone-50 transition-colors flex items-center gap-1.5">
                        <Upload size={14} /> Thay đổi ảnh
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center w-full h-full">
                    <Upload className="w-8 h-8 text-stone-400 mb-2 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-stone-600">Chọn ảnh (JPEG, PNG, WEBP)</span>
                    <span className="text-[10px] text-stone-400 mt-1">Dung lượng tối đa 5MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                      required={!product}
                    />
                  </label>
                )}
              </div>

              {/* Pre-order configurations */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPreOrder}
                    onChange={(e) => setIsPreOrder(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-stone-300 cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-bold text-stone-800 block">Sản phẩm Pre-Order</span>
                    <span className="text-xs text-stone-400">Cho phép đặt hàng trước khi chưa làm xong hoặc hết hàng sẵn.</span>
                  </div>
                </label>

                {isPreOrder && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Số ngày chuẩn bị hàng (ước tính)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={makingDays}
                      onChange={(e) => setMakingDays(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Name, Category, Prices, Quantity */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mũ Len Handmade Tai Gấu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Giá gốc (đ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="250000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Giá sau giảm (nếu có)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Để trống nếu không giảm"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Số lượng trong kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Chất liệu (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Len Milk Cotton, Sợi cói tự nhiên"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                Mô tả ngắn (hiển thị trên thẻ sản phẩm)
              </label>
              <textarea
                placeholder="Mô tả tóm tắt tính năng hoặc phong cách của sản phẩm handmade (tối đa 2-3 câu)..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none h-16 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                Mô tả chi tiết sản phẩm hoặc câu chuyện làm nghề
              </label>
              <textarea
                placeholder="Chia sẻ câu chuyện chế tác, nguồn gốc nguyên liệu hay hướng dẫn bảo quản sản phẩm handmade..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-3 border border-stone-200 rounded-xl text-sm focus:border-primary focus:outline-none h-28 resize-y"
              />
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            form="product-form"
            className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/95 transition-colors flex items-center gap-2 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu sản phẩm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
