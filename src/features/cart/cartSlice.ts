import { createSlice } from "@reduxjs/toolkit";
import type { CartState } from "./cartType";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "./cartThunk";

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetCartState: (state) => {
      state.cart = null;
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH CART ---
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cart = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- ADD TO CART ---
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cart = action.payload.data;
          state.successMessage = action.payload.message || "Đã thêm sản phẩm vào giỏ hàng!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- UPDATE CART ITEM ---
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cart = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- DELETE CART ITEM ---
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cart = action.payload.data;
          state.successMessage = action.payload.message || "Đã xóa sản phẩm khỏi giỏ hàng!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- CLEAR CART ---
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cart = action.payload.data;
          state.successMessage = action.payload.message || "Đã làm trống giỏ hàng!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCartMessages, resetCartState } = cartSlice.actions;

export default cartSlice.reducer;
