import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../auth/authType';
import type { CreateVNPayRequest, VNPayResponse } from './orderType';

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return 'Lỗi kết nối đến máy chủ!';
};

// ─── CREATE VNPAY PAYMENT URL ────────────────────────────────────────────────
export const createVNPayPayment = createAsyncThunk<
  ApiResponse<VNPayResponse>,
  CreateVNPayRequest,
  { rejectValue: string }
>('orders/createVNPayPayment', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<VNPayResponse>>(
      '/payment/vnpay/create',
      payload
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể tạo link thanh toán VNPay!'));
  }
});
