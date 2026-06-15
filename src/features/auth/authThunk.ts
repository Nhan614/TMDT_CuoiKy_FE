import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type {
  ApiResponse,
  LoginRequestDTO,
  RegisterRequestDTO,
  GoogleAuthRequestDTO,
  LoginResponseDTO,
} from "./authType";

// --- LOGIN ---
export const loginUser = createAsyncThunk<
  ApiResponse<LoginResponseDTO>,
  LoginRequestDTO,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<LoginResponseDTO>>(
      `/auth/login`,
      credentials,
    );
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("role", response.data.data.role);
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Đăng nhập thất bại!",
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- REGISTER ---
export const registerUser = createAsyncThunk<
  ApiResponse<void>,
  RegisterRequestDTO,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<void>>(
      `/auth/register`,
      userData,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Đăng ký thất bại!",
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- LOGIN GOOGLE ---
export const loginWithGoogle = createAsyncThunk<
  ApiResponse<LoginResponseDTO>,
  GoogleAuthRequestDTO,
  { rejectValue: string }
>("auth/google", async (tokenData, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<LoginResponseDTO>>(
      `/auth/google`,
      tokenData,
    );
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("role", response.data.data.role);
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Đăng nhập thất bại!",
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});