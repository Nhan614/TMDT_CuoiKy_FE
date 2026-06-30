import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductState, ProductFilterParams, ProductResponseDTO, SpringPage } from "./productType";
import { fetchProducts, fetchProductById, fetchMyProducts, createProduct, updateProduct, toggleProductStatus, deleteProduct, fetchProductsAdmin, adminToggleProductStatus, adminCreateProduct, adminUpdateProduct } from "./productThunk";

const initialFilters: ProductFilterParams = {
  page: 1,
  size: 9, // Optimal for 3-column grid layouts
  sortBy: "newest",
  search: "",
  categoryId: undefined,
  isActive: true,
};

const initialState: ProductState = {
  products: [],
  totalPages: 1,
  totalElements: 0,
  isLoading: false,
  error: null,
  filters: initialFilters,
  productDetail: {
    product: null,
    isLoading: false,
    error: null,
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilterParams>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        // Reset page to 1 when filters other than page change
        page: action.payload.page !== undefined ? action.payload.page : 1,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        ...initialFilters,
        // Keep search or search-specific values if needed, otherwise reset all
      };
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Resilience check: support both standard Spring Page and raw lists
        const data = action.payload.data;
        if (data) {
          if (Array.isArray(data)) {
            // Raw list returned
            state.products = data;
            state.totalPages = 1;
            state.totalElements = data.length;
          } else if (typeof data === "object" && "content" in data) {
            // Standard Spring Page returned
            const pageData = data as SpringPage<ProductResponseDTO>;
            state.products = pageData.content || [];
            state.totalPages = pageData.totalPages ?? 1;
            state.totalElements = pageData.totalElements ?? 0;
          } else {
            // Unknown object structure, fallback to empty list
            state.products = [];
            state.totalPages = 1;
            state.totalElements = 0;
          }
        } else {
          state.products = [];
          state.totalPages = 1;
          state.totalElements = 0;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Đã xảy ra lỗi khi lấy danh sách sản phẩm.";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.productDetail.isLoading = true;
        state.productDetail.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetail.isLoading = false;
        state.productDetail.product = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetail.isLoading = false;
        state.productDetail.error = action.payload as string || "Đã xảy ra lỗi khi lấy thông tin chi tiết sản phẩm.";
      })
      // --- FETCH MY PRODUCTS ---
      .addCase(fetchMyProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const pageData = action.payload.data;
        if (pageData && "content" in pageData) {
          state.products = pageData.content || [];
          state.totalPages = pageData.totalPages ?? 1;
          state.totalElements = pageData.totalElements ?? 0;
        } else {
          state.products = [];
          state.totalPages = 1;
          state.totalElements = 0;
        }
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Lấy danh sách sản phẩm thất bại.";
      })
      // --- CREATE PRODUCT ---
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.products = [action.payload.data, ...state.products];
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Thêm sản phẩm mới thất bại.";
      })
      // --- UPDATE PRODUCT ---
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        if (updated) {
          state.products = state.products.map((p) => (p.id === updated.id ? updated : p));
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Cập nhật sản phẩm thất bại.";
      })
      // --- TOGGLE PRODUCT STATUS ---
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.products = state.products.map((p) =>
          p.id === id ? { ...p, status, isActive: status === "ACTIVE" } : p
        );
      })
      // --- DELETE PRODUCT ---
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { id } = action.payload;
        // Soft delete: filter out deleted products from UI list
        state.products = state.products.filter((p) => p.id !== id);
      })
      // --- FETCH PRODUCTS ADMIN ---
      .addCase(fetchProductsAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        const pageData = action.payload.data;
        if (pageData && "content" in pageData) {
          state.products = pageData.content || [];
          state.totalPages = pageData.totalPages ?? 1;
          state.totalElements = pageData.totalElements ?? 0;
        } else {
          state.products = [];
          state.totalPages = 1;
          state.totalElements = 0;
        }
      })
      .addCase(fetchProductsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Lấy danh sách quản trị thất bại.";
      })
      // --- ADMIN TOGGLE PRODUCT STATUS ---
      .addCase(adminToggleProductStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.products = state.products.map((p) =>
          p.id === id ? { ...p, status, isActive: status === "ACTIVE" } : p
        );
      })
      // --- ADMIN CREATE PRODUCT ---
      .addCase(adminCreateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.products = [action.payload.data, ...state.products];
        }
      })
      .addCase(adminCreateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Thêm sản phẩm thất bại.";
      })
      // --- ADMIN UPDATE PRODUCT ---
      .addCase(adminUpdateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        if (updated) {
          state.products = state.products.map((p) => (p.id === updated.id ? updated : p));
        }
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Cập nhật sản phẩm thất bại.";
      });
  },
});

export const { setFilters, setPage, clearFilters, clearProductError } = productSlice.actions;

export default productSlice.reducer;
