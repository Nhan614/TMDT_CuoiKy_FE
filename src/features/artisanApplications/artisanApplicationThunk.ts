import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../auth/authType';
import type { ArtisanApplicationDTO } from './artisanApplicationType';

// --- Helper ---
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return 'Lỗi kết nối đến máy chủ!';
};

// --- USER: Fetch My Application ---
export const fetchMyApplication = createAsyncThunk<
  ApiResponse<ArtisanApplicationDTO>,
  void,
  { rejectValue: string }
>('artisanApplications/fetchMyApplication', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<ArtisanApplicationDTO>>(
      '/artisan-applications/my'
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể lấy thông tin đơn đăng ký!'));
  }
});

// --- ADMIN: Fetch All Applications ---
export const fetchAdminApplications = createAsyncThunk<
  ApiResponse<ArtisanApplicationDTO[]>,
  { status?: string; page?: number; size?: number } | undefined,
  { rejectValue: string }
>('artisanApplications/fetchAdminApplications', async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 0, size = 10, status } = params;
    const response = await axiosClient.get<ApiResponse<ArtisanApplicationDTO[]>>(
      '/artisan-applications/admin',
      {
        params: {
          page,
          size,
          ...(status && status !== 'ALL' ? { status } : {}),
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể lấy danh sách đơn đăng ký!'));
  }
});

// --- ADMIN: Approve Application ---
export const approveApplication = createAsyncThunk<
  ApiResponse<ArtisanApplicationDTO>,
  number,
  { rejectValue: string }
>('artisanApplications/approveApplication', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<ArtisanApplicationDTO>>(
      `/artisan-applications/admin/${id}/approve`
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Không thể duyệt đơn đăng ký!'));
  }
});

// --- ADMIN: Reject Application ---
export const rejectApplication = createAsyncThunk<
  ApiResponse<ArtisanApplicationDTO>,
  { id: number; reason: string },
  { rejectValue: string }
>(
  'artisanApplications/rejectApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch<ApiResponse<ArtisanApplicationDTO>>(
        `/artisan-applications/admin/${id}/reject`,
        { reason }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Không thể từ chối đơn đăng ký!'));
    }
  }
);
