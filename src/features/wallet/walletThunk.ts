import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type { WalletTransactionDTO, WithdrawalRequestDTO } from "./walletType";

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return "Lỗi kết nối đến máy chủ!";
};

export const fetchWalletBalance = createAsyncThunk<
  ApiResponse<{ balance: number; currency: string }>,
  void,
  { rejectValue: string }
>("wallet/fetchWalletBalance", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<{ balance: number; currency: string }>>("/wallet/balance");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy số dư ví!"));
  }
});

export const fetchWalletTransactions = createAsyncThunk<
  ApiResponse<WalletTransactionDTO[]>,
  { page?: number; size?: number } | undefined,
  { rejectValue: string }
>("wallet/fetchWalletTransactions", async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 0, size = 10 } = params;
    const response = await axiosClient.get<ApiResponse<WalletTransactionDTO[]>>("/wallet/transactions", {
      params: { page: page + 1, size },
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy lịch sử giao dịch!"));
  }
});

export const requestWithdrawal = createAsyncThunk<
  ApiResponse<WithdrawalRequestDTO>,
  { amount: number; bankName: string; accountNumber: string; accountHolder: string },
  { rejectValue: string }
>("wallet/requestWithdrawal", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<WithdrawalRequestDTO>>("/wallet/withdraw", payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể thực hiện yêu cầu rút tiền!"));
  }
});

export const fetchWithdrawals = createAsyncThunk<
  ApiResponse<WithdrawalRequestDTO[]>,
  { page?: number; size?: number } | undefined,
  { rejectValue: string }
>("wallet/fetchWithdrawals", async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 0, size = 10 } = params;
    const response = await axiosClient.get<ApiResponse<WithdrawalRequestDTO[]>>("/wallet/withdrawals", {
      params: { page: page + 1, size },
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy danh sách yêu cầu rút tiền!"));
  }
});

// Admin Thunks
export const fetchAdminWithdrawals = createAsyncThunk<
  ApiResponse<WithdrawalRequestDTO[]>,
  { status?: string; page?: number; size?: number } | undefined,
  { rejectValue: string }
>("wallet/fetchAdminWithdrawals", async (params = {}, { rejectWithValue }) => {
  try {
    const { status, page = 0, size = 10 } = params;
    const requestParams: any = { page: page + 1, size };
    if (status && status !== "ALL") {
      requestParams.status = status;
    }
    const response = await axiosClient.get<ApiResponse<WithdrawalRequestDTO[]>>("/admin/withdrawals", {
      params: requestParams,
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy danh sách rút tiền cho Admin!"));
  }
});

export const reviewWithdrawal = createAsyncThunk<
  ApiResponse<WithdrawalRequestDTO>,
  { id: number; action: "APPROVE" | "REJECT"; note?: string },
  { rejectValue: string }
>("wallet/reviewWithdrawal", async ({ id, action, note }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<WithdrawalRequestDTO>>(`/admin/withdrawals/${id}/review`, {
      action,
      note,
    });
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể duyệt/từ chối yêu cầu rút tiền!"));
  }
});
