import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductState, ProductFilterParams, ProductResponseDTO, SpringPage } from "./productType";
import { fetchProducts } from "./productThunk";

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
      });
  },
});

export const { setFilters, setPage, clearFilters, clearProductError } = productSlice.actions;

export default productSlice.reducer;
