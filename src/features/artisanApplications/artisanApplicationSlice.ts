import { createSlice } from '@reduxjs/toolkit';
import type { ArtisanApplicationState } from './artisanApplicationType';
import {
  fetchMyApplication,
  fetchAdminApplications,
  approveApplication,
  rejectApplication,
} from './artisanApplicationThunk';

const initialState: ArtisanApplicationState = {
  myApplication: null,
  myApplicationLoading: false,
  applications: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  adminLoading: false,
  error: null,
  successMessage: null,
};

export const artisanApplicationSlice = createSlice({
  name: 'artisanApplications',
  initialState,
  reducers: {
    clearApplicationMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetApplicationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH MY APPLICATION ---
      .addCase(fetchMyApplication.pending, (state) => {
        state.myApplicationLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplication.fulfilled, (state, action) => {
        state.myApplicationLoading = false;
        if (action.payload.success) {
          state.myApplication = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchMyApplication.rejected, (state, action) => {
        state.myApplicationLoading = false;
        // 404 means no application yet — treat as null, not error
        state.myApplication = null;
        state.error = action.payload as string;
      })

      // --- FETCH ADMIN APPLICATIONS ---
      .addCase(fetchAdminApplications.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminApplications.fulfilled, (state, action) => {
        state.adminLoading = false;
        if (action.payload.success) {
          state.applications = action.payload.data;
          state.totalPages = action.payload.meta?.totalPages ?? 0;
          state.totalElements = action.payload.meta?.totalElements ?? 0;
          state.currentPage = action.payload.meta?.page ?? 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchAdminApplications.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload as string;
      })

      // --- APPROVE APPLICATION ---
      .addCase(approveApplication.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(approveApplication.fulfilled, (state, action) => {
        state.adminLoading = false;
        if (action.payload.success) {
          const updated = action.payload.data;
          const idx = state.applications.findIndex((a) => a.id === updated.id);
          if (idx !== -1) state.applications[idx] = updated;
          state.successMessage = action.payload.message || 'Đã duyệt đơn đăng ký thành công!';
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(approveApplication.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload as string;
      })

      // --- REJECT APPLICATION ---
      .addCase(rejectApplication.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        state.adminLoading = false;
        if (action.payload.success) {
          const updated = action.payload.data;
          const idx = state.applications.findIndex((a) => a.id === updated.id);
          if (idx !== -1) state.applications[idx] = updated;
          state.successMessage = action.payload.message || 'Đã từ chối đơn đăng ký!';
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(rejectApplication.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearApplicationMessages, resetApplicationState } =
  artisanApplicationSlice.actions;
export default artisanApplicationSlice.reducer;
