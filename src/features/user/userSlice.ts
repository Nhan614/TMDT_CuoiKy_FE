import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./userType";
import { fetchMyProfile, updateMyProfile, submitArtisanApplication } from "./userThunk";

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  successMessage: null,
  
  // Artisan application status
  applicationLoading: false,
  applicationError: null,
  applicationSuccess: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.applicationError = null;
      state.applicationSuccess = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH PROFILE ---
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentUser = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- UPDATE PROFILE ---
      .addCase(updateMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentUser = action.payload.data;
          state.successMessage = action.payload.message || "Cập nhật thông tin thành công!";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- SUBMIT APPLICATION ---
      .addCase(submitArtisanApplication.pending, (state) => {
        state.applicationLoading = true;
        state.applicationError = null;
        state.applicationSuccess = null;
      })
      .addCase(submitArtisanApplication.fulfilled, (state, action) => {
        state.applicationLoading = false;
        if (action.payload.success) {
          state.applicationSuccess = action.payload.message || "Gửi đơn ứng tuyển thành công!";
        } else {
          state.applicationError = action.payload.message;
        }
      })
      .addCase(submitArtisanApplication.rejected, (state, action) => {
        state.applicationLoading = false;
        state.applicationError = action.payload as string;
      });
  },
});

export const { clearUserMessages, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
