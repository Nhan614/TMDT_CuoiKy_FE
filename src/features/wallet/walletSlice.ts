import { createSlice } from "@reduxjs/toolkit";
import type { WalletState } from "./walletType";
import {
  fetchWalletBalance,
  fetchWalletTransactions,
  requestWithdrawal,
  fetchWithdrawals,
  fetchAdminWithdrawals,
  reviewWithdrawal,
} from "./walletThunk";

const initialState: WalletState = {
  balance: 0,
  currency: "VND",
  transactions: [],
  withdrawals: [],
  adminWithdrawals: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH WALLET BALANCE ---
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.balance = action.payload.data.balance;
          state.currency = action.payload.data.currency;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- FETCH WALLET TRANSACTIONS ---
      .addCase(fetchWalletTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.transactions = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ? action.payload.meta.page - 1 : 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- REQUEST WITHDRAWAL ---
      .addCase(requestWithdrawal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          state.withdrawals.unshift(action.payload.data);
          if (action.payload.data.status === "COMPLETED") {
            state.balance -= action.payload.data.amount;
          }
          state.successMessage = action.payload.message || "Tạo yêu cầu rút tiền thành công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // --- FETCH WITHDRAWALS ---
      .addCase(fetchWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.withdrawals = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ? action.payload.meta.page - 1 : 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- FETCH ADMIN WITHDRAWALS ---
      .addCase(fetchAdminWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.adminWithdrawals = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ? action.payload.meta.page - 1 : 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchAdminWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- REVIEW WITHDRAWAL ---
      .addCase(reviewWithdrawal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(reviewWithdrawal.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.success) {
          const updated = action.payload.data;
          const idx = state.adminWithdrawals.findIndex((w) => w.id === updated.id);
          if (idx !== -1) {
            state.adminWithdrawals[idx] = updated;
          }
          state.successMessage = action.payload.message || "Xử lý yêu cầu rút tiền thành công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(reviewWithdrawal.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWalletMessages } = walletSlice.actions;
export default walletSlice.reducer;
