import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomOrderState } from "./customOrderType";
import {
  uploadReferenceImage,
  createCustomOrder,
  fetchMyCustomOrders,
  fetchMyCustomOrderById,
  cancelMyCustomOrder,
  confirmAndPay,
  fetchArtisanCustomOrders,
  fetchArtisanCustomOrderById,
  acceptCustomOrder,
  rejectCustomOrder,
  completeCustomOrder,
  confirmReceived,
} from "./customOrderThunk";

const initialState: CustomOrderState = {
  myOrders: [],
  myCurrentOrder: null,
  artisanOrders: [],
  artisanCurrentOrder: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
  uploadedImageUrls: [],
  isUploading: false,
  paymentUrl: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
};

export const customOrderSlice = createSlice({
  name: "customOrders",
  initialState,
  reducers: {
    clearCustomOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearUploadedImageUrls: (state) => {
      state.uploadedImageUrls = [];
    },
    removeUploadedImageUrl: (state, action: PayloadAction<string>) => {
      state.uploadedImageUrls = state.uploadedImageUrls.filter((url) => url !== action.payload);
    },
    clearCurrentOrders: (state) => {
      state.myCurrentOrder = null;
      state.artisanCurrentOrder = null;
    },
    clearPaymentUrl: (state) => {
      state.paymentUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- UPLOAD REFERENCE IMAGE ---
      .addCase(uploadReferenceImage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadReferenceImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadedImageUrls.push(action.payload.imageUrl);
      })
      .addCase(uploadReferenceImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      })

      // --- CREATE CUSTOM ORDER ---
      .addCase(createCustomOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCustomOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          state.myCurrentOrder = action.payload.data;
          state.successMessage = action.payload.message || "Tạo yêu cầu gia công thành công!";
          state.uploadedImageUrls = []; // Clear uploaded references
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(createCustomOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // --- FETCH MY CUSTOM ORDERS ---
      .addCase(fetchMyCustomOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCustomOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.myOrders = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ? action.payload.meta.page - 1 : 0; // standard page
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchMyCustomOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- FETCH MY CUSTOM ORDER BY ID ---
      .addCase(fetchMyCustomOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.myCurrentOrder = null;
      })
      .addCase(fetchMyCustomOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.myCurrentOrder = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchMyCustomOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- CANCEL MY CUSTOM ORDER ---
      .addCase(cancelMyCustomOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelMyCustomOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.myCurrentOrder = action.payload.data;
          const idx = state.myOrders.findIndex((o) => o.id === action.payload.data.id);
          if (idx !== -1) {
            state.myOrders[idx] = action.payload.data;
          }
          state.successMessage = action.payload.message || "Hủy yêu cầu gia công thành công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(cancelMyCustomOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- CONFIRM AND PAY ---
      .addCase(confirmAndPay.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.paymentUrl = null;
      })
      .addCase(confirmAndPay.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success && action.payload.data?.paymentUrl) {
          state.paymentUrl = action.payload.data.paymentUrl;
        } else {
          state.error = action.payload.message || "Không thể tạo link thanh toán!";
        }
      })
      .addCase(confirmAndPay.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // --- FETCH ARTISAN CUSTOM ORDERS ---
      .addCase(fetchArtisanCustomOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtisanCustomOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.artisanOrders = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ? action.payload.meta.page - 1 : 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchArtisanCustomOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- FETCH ARTISAN CUSTOM ORDER BY ID ---
      .addCase(fetchArtisanCustomOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.artisanCurrentOrder = null;
      })
      .addCase(fetchArtisanCustomOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.artisanCurrentOrder = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchArtisanCustomOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- ACCEPT CUSTOM ORDER ---
      .addCase(acceptCustomOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(acceptCustomOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          state.artisanCurrentOrder = action.payload.data;
          const idx = state.artisanOrders.findIndex((o) => o.id === action.payload.data.id);
          if (idx !== -1) {
            state.artisanOrders[idx] = action.payload.data;
          }
          state.successMessage = action.payload.message || "Đã chấp nhận yêu cầu gia công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(acceptCustomOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // --- REJECT CUSTOM ORDER ---
      .addCase(rejectCustomOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(rejectCustomOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          state.artisanCurrentOrder = action.payload.data;
          const idx = state.artisanOrders.findIndex((o) => o.id === action.payload.data.id);
          if (idx !== -1) {
            state.artisanOrders[idx] = action.payload.data;
          }
          state.successMessage = action.payload.message || "Từ chối yêu cầu gia công thành công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(rejectCustomOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // --- COMPLETE CUSTOM ORDER ---
      .addCase(completeCustomOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(completeCustomOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          state.artisanCurrentOrder = action.payload.data;
          const idx = state.artisanOrders.findIndex((o) => o.id === action.payload.data.id);
          if (idx !== -1) {
            state.artisanOrders[idx] = action.payload.data;
          }
          state.successMessage = action.payload.message || "Đơn gia công đã được đánh dấu hoàn thành!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(completeCustomOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // --- CONFIRM RECEIVED ---
      .addCase(confirmReceived.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(confirmReceived.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          state.myCurrentOrder = action.payload.data;
          const idx = state.myOrders.findIndex((o) => o.id === action.payload.data.id);
          if (idx !== -1) {
            state.myOrders[idx] = action.payload.data;
          }
          state.successMessage = action.payload.message || "Xác nhận đã nhận hàng thành công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(confirmReceived.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCustomOrderMessages,
  clearUploadedImageUrls,
  removeUploadedImageUrl,
  clearCurrentOrders,
  clearPaymentUrl,
} = customOrderSlice.actions;

export default customOrderSlice.reducer;
