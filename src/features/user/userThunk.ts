import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type { UserResponseDTO, UserUpdateRequestDTO } from "./userType";

// Helper helper
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return "Lỗi kết nối đến máy chủ!";
};

// Fetch My Profile
export const fetchMyProfile = createAsyncThunk<
  ApiResponse<UserResponseDTO>,
  void,
  { rejectValue: string }
>("user/fetchMyProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<UserResponseDTO>>("/users/me");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể tải thông tin cá nhân!"));
  }
});

// Update My Profile
export const updateMyProfile = createAsyncThunk<
  ApiResponse<UserResponseDTO>,
  UserUpdateRequestDTO,
  { rejectValue: string }
>("user/updateMyProfile", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<UserResponseDTO>>("/users/me", payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể cập nhật thông tin cá nhân!"));
  }
});

// Submit Artisan Application
export interface SubmitApplicationRequest {
  fullName: string;
  skill: "AMIGURUMI" | "DAN_MOC" | "THIET_KE_HOA_TIET" | "THEU_TAY" | "GOM_SU";
  bio?: string;
  quote?: string;
  startedCraftingDate: string; // "YYYY-MM-DD"
  portfolioUrl?: string;
  avatarUrl: string;
  proofImageUrls: string[];
}

export const submitArtisanApplication = createAsyncThunk<
  ApiResponse<any>,
  SubmitApplicationRequest,
  { rejectValue: string }
>("user/submitArtisanApplication", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<any>>("/artisan-applications", payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể gửi đơn ứng tuyển làm nghệ nhân!"));
  }
});

// Upload Proof Image (Artisan application)
export const uploadProofImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosClient.post<ApiResponse<{ imageUrl: string }>>(
    "/artisan-applications/upload-proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.data.success && response.data.data) {
    return response.data.data.imageUrl;
  }
  throw new Error(response.data.message || "Tải ảnh lên thất bại!");
};
