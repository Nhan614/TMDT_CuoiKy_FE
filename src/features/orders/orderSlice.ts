import { createSlice } from '@reduxjs/toolkit';
import type { OrderState } from './orderType';
import {
  fetchMyOrders,
  fetchOrderById,
  createOrder,
  cancelOrder,
  fetchAdminOrders,
  updateOrderStatus,
} from './orderThunk';
import { createVNPayPayment } from './paymentThunk';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  isCreating: false,
  error: null,
  successMessage: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ─── FETCH MY ORDERS ──────────────────────────────────────────────
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.orders = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ?? 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ─── FETCH ORDER BY ID ────────────────────────────────────────────
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentOrder = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ─── CREATE ORDER ─────────────────────────────────────────────────
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload.success) {
          state.currentOrder = action.payload.data;
          state.successMessage = action.payload.message || 'Đặt hàng thành công!';
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // ─── CANCEL ORDER ─────────────────────────────────────────────────
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentOrder = action.payload.data;
          // Also update in the list if present
          const idx = state.orders.findIndex((o) => o.id === action.payload.data.id);
          if (idx !== -1) state.orders[idx] = action.payload.data;
          state.successMessage = action.payload.message || 'Đã hủy đơn hàng!';
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ─── FETCH ADMIN ORDERS ───────────────────────────────────────────
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.orders = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ?? 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ─── UPDATE ORDER STATUS (admin) ──────────────────────────────────
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          const updated = action.payload.data;
          const idx = state.orders.findIndex((o) => o.id === updated.id);
          if (idx !== -1) state.orders[idx] = updated;
          if (state.currentOrder?.id === updated.id) state.currentOrder = updated;
          state.successMessage = action.payload.message || 'Cập nhật trạng thái thành công!';
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ─── CREATE VNPAY PAYMENT ─────────────────────────────────────────
      .addCase(createVNPayPayment.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createVNPayPayment.fulfilled, (state, action) => {
        state.isCreating = false;
        if (!action.payload.success) {
          state.error = action.payload.message;
        }
        // Redirect is handled in the component
      })
      .addCase(createVNPayPayment.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderMessages, clearCurrentOrder, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
