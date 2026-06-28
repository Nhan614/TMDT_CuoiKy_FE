import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type {
  CustomOrderDTO,
  CreateCustomOrderRequest,
  ArtisanAcceptRequest,
  ArtisanRejectRequest,
  CustomOrderStatus,
} from "./customOrderType";

// Helper
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return "Lỗi kết nối đến máy chủ!";
};

// Upload Reference Image
export const uploadReferenceImage = createAsyncThunk<
  { imageUrl: string; publicId: string },
  File,
  { rejectValue: string }
>("customOrders/uploadReferenceImage", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post<ApiResponse<{ imageUrl: string; publicId: string }>>(
      "/custom-orders/upload-reference",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return rejectWithValue(response.data.message || "Tải ảnh mẫu thất bại!");
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể tải ảnh mẫu lên!"));
  }
});

// Create Custom Order
export const createCustomOrder = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  CreateCustomOrderRequest,
  { rejectValue: string }
>("customOrders/createCustomOrder", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<CustomOrderDTO>>("/custom-orders", payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể gửi yêu cầu gia công riêng!"));
  }
});

// Fetch My Custom Orders (for User)
export const fetchMyCustomOrders = createAsyncThunk<
  ApiResponse<CustomOrderDTO[]>,
  { status?: CustomOrderStatus | "ALL"; page?: number; size?: number } | undefined,
  { rejectValue: string }
>("customOrders/fetchMyCustomOrders", async (params = {}, { rejectWithValue }) => {
  try {
    const { status, page = 0, size = 10 } = params;
    const requestParams: any = {
      page: page + 1, // backend is 1-indexed
      size,
    };
    if (status && status !== "ALL") {
      requestParams.status = status;
    }
    const response = await axiosClient.get<ApiResponse<CustomOrderDTO[]>>("/custom-orders/my", {
      params: requestParams,
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy danh sách yêu cầu gia công!"));
  }
});

// Fetch My Custom Order By Id
export const fetchMyCustomOrderById = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  number,
  { rejectValue: string }
>("customOrders/fetchMyCustomOrderById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<CustomOrderDTO>>(`/custom-orders/my/${id}`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy chi tiết yêu cầu gia công!"));
  }
});

// Cancel My Custom Order
export const cancelMyCustomOrder = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  number,
  { rejectValue: string }
>("customOrders/cancelMyCustomOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<CustomOrderDTO>>(`/custom-orders/my/${id}/cancel`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể hủy yêu cầu gia công!"));
  }
});

// Confirm and Pay (User xác nhận báo giá → lấy link VNPay)
export const confirmAndPay = createAsyncThunk<
  ApiResponse<{ paymentUrl: string }>,
  number,
  { rejectValue: string }
>("customOrders/confirmAndPay", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<{ paymentUrl: string }>>(
      `/custom-orders/my/${id}/confirm-payment`
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể tạo link thanh toán!"));
  }
});

// Fetch Artisan Custom Orders (for Artisan)
export const fetchArtisanCustomOrders = createAsyncThunk<
  ApiResponse<CustomOrderDTO[]>,
  { status?: CustomOrderStatus | "ALL"; page?: number; size?: number } | undefined,
  { rejectValue: string }
>("customOrders/fetchArtisanCustomOrders", async (params = {}, { rejectWithValue }) => {
  try {
    const { status, page = 0, size = 10 } = params;
    const requestParams: any = {
      page: page + 1, // backend is 1-indexed
      size,
    };
    if (status && status !== "ALL") {
      requestParams.status = status;
    }
    const response = await axiosClient.get<ApiResponse<CustomOrderDTO[]>>("/custom-orders/artisan", {
      params: requestParams,
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy danh sách yêu cầu gia công nhận được!"));
  }
});

// Fetch Artisan Custom Order By Id
export const fetchArtisanCustomOrderById = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  number,
  { rejectValue: string }
>("customOrders/fetchArtisanCustomOrderById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<CustomOrderDTO>>(`/custom-orders/artisan/${id}`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy chi tiết yêu cầu gia công nhận được!"));
  }
});

// Accept Custom Order
export const acceptCustomOrder = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  { id: number; payload: ArtisanAcceptRequest },
  { rejectValue: string }
>("customOrders/acceptCustomOrder", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<CustomOrderDTO>>(
      `/custom-orders/artisan/${id}/accept`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể chấp nhận yêu cầu gia công!"));
  }
});

// Reject Custom Order
export const rejectCustomOrder = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  { id: number; payload: ArtisanRejectRequest },
  { rejectValue: string }
>("customOrders/rejectCustomOrder", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<CustomOrderDTO>>(
      `/custom-orders/artisan/${id}/reject`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể từ chối yêu cầu gia công!"));
  }
});

// Complete Custom Order (Artisan đánh dấu hoàn thành)
export const completeCustomOrder = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  number,
  { rejectValue: string }
>("customOrders/completeCustomOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<CustomOrderDTO>>(
      `/custom-orders/artisan/${id}/complete`
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể đánh dấu hoàn thành đơn gia công!"));
  }
});

// Confirm Received (Khách hàng xác nhận đã nhận hàng)
export const confirmReceived = createAsyncThunk<
  ApiResponse<CustomOrderDTO>,
  number,
  { rejectValue: string }
>("customOrders/confirmReceived", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<CustomOrderDTO>>(
      `/custom-orders/my/${id}/confirm-received`
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể xác nhận đã nhận hàng!"));
  }
});
