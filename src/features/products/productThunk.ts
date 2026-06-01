import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type { ProductResponseDTO, SpringPage, ProductFilterParams } from "./productType";

// --- FETCH ALL PRODUCTS WITH FILTERS ---
export const fetchProducts = createAsyncThunk<
  ApiResponse<SpringPage<ProductResponseDTO>>,
  ProductFilterParams,
  { rejectValue: string }
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const queryParams: Record<string, unknown> = {
      page: params.page,
      size: params.size,
      sortBy: params.sortBy,
    };

    if (params.search && params.search.trim() !== "") {
      queryParams.search = params.search;
    }
    if (params.categoryId !== undefined && params.categoryId !== null) {
      queryParams.categoryId = params.categoryId;
    }
    if (params.isActive !== undefined) {
      queryParams.isActive = params.isActive;
    }

    const response = await axiosClient.get<ApiResponse<SpringPage<ProductResponseDTO>>>(
      "/products",
      { params: queryParams }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Lấy danh sách sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- FETCH PRODUCT BY ID ---
export const fetchProductById = createAsyncThunk<
  ApiResponse<ProductResponseDTO>,
  number,
  { rejectValue: string }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<ProductResponseDTO>>(`/products/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Lấy chi tiết sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});
