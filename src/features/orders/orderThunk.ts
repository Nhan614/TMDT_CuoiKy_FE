import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../auth/authType';
import type {
  OrderDTO,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from './orderType';

// Helper
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return 'Lỗi kết nối đến máy chủ!';
};

// ─── FETCH MY ORDERS ────────────────────────────────────────────────────────
export const fetchMyOrders = createAsyncThunk<
  ApiResponse<OrderDTO[]>,
  { page?: number; size?: number } | undefined,
  { rejectValue: string }
>('orders/fetchMyOrders', async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 0, size = 10 } = params;
    const response = await axiosClient.get<ApiResponse<OrderDTO[]>>('/orders', {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể lấy danh sách đơn hàng!'));
  }
});

// ─── FETCH ORDER BY ID ──────────────────────────────────────────────────────
export const fetchOrderById = createAsyncThunk<
  ApiResponse<OrderDTO>,
  number,
  { rejectValue: string }
>('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<OrderDTO>>(`/orders/${id}`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể lấy thông tin đơn hàng!'));
  }
});

// ─── CREATE ORDER ───────────────────────────────────────────────────────────
export const createOrder = createAsyncThunk<
  ApiResponse<OrderDTO>,
  CreateOrderRequest,
  { rejectValue: string }
>('orders/createOrder', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<OrderDTO>>('/orders', payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể tạo đơn hàng!'));
  }
});

// ─── CANCEL ORDER ───────────────────────────────────────────────────────────
export const cancelOrder = createAsyncThunk<
  ApiResponse<OrderDTO>,
  number,
  { rejectValue: string }
>('orders/cancelOrder', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<OrderDTO>>(`/orders/${id}/cancel`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể hủy đơn hàng!'));
  }
});

// ─── ADMIN: FETCH ALL ORDERS ────────────────────────────────────────────────
export const fetchAdminOrders = createAsyncThunk<
  ApiResponse<OrderDTO[]>,
  { page?: number; size?: number; status?: string } | undefined,
  { rejectValue: string }
>('orders/fetchAdminOrders', async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 0, size = 10, status } = params;
    const response = await axiosClient.get<ApiResponse<OrderDTO[]>>('/admin/orders', {
      params: { page, size, ...(status && status !== 'ALL' ? { status } : {}) },
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể lấy danh sách đơn hàng!'));
  }
});

// ─── ADMIN: UPDATE ORDER STATUS ─────────────────────────────────────────────
export const updateOrderStatus = createAsyncThunk<
  ApiResponse<OrderDTO>,
  { id: number; payload: UpdateOrderStatusRequest },
  { rejectValue: string }
>('orders/updateOrderStatus', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<OrderDTO>>(
      `/admin/orders/${id}/status`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể cập nhật trạng thái đơn hàng!'));
  }
});
