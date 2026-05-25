import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type {
  CartData,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "./cartType";

// Helpers to handle axios error
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || defaultMsg;
  }
  return "Lỗi kết nối đến máy chủ!";
};

// --- FETCH CART ---
export const fetchCart = createAsyncThunk<
  ApiResponse<CartData>,
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<CartData>>("/cart");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể lấy thông tin giỏ hàng!"));
  }
});

// --- ADD TO CART ---
export const addToCart = createAsyncThunk<
  ApiResponse<CartData>,
  AddToCartRequest,
  { rejectValue: string }
>("cart/addToCart", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<CartData>>(
      "/cart/items",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể thêm sản phẩm vào giỏ hàng!"));
  }
});

// --- UPDATE CART ITEM ---
export const updateCartItem = createAsyncThunk<
  ApiResponse<CartData>,
  UpdateCartItemRequest,
  { rejectValue: string }
>("cart/updateCartItem", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<CartData>>(
      `/cart/items/${productId}`,
      { quantity }
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể cập nhật số lượng sản phẩm!"));
  }
});

// --- DELETE CART ITEM ---
export const deleteCartItem = createAsyncThunk<
  ApiResponse<CartData>,
  number, // productId
  { rejectValue: string }
>("cart/deleteCartItem", async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosClient.delete<ApiResponse<CartData>>(
      `/cart/items/${productId}`
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể xóa sản phẩm khỏi giỏ hàng!"));
  }
});

// --- CLEAR CART ---
export const clearCart = createAsyncThunk<
  ApiResponse<CartData>,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.delete<ApiResponse<CartData>>("/cart");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Không thể làm trống giỏ hàng!"));
  }
});
