import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type { ProductResponseDTO, SpringPage, ProductFilterParams, ProductStatus } from "./productType";

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

// --- FETCH MY PRODUCTS (ARTISAN) ---
export const fetchMyProducts = createAsyncThunk<
  ApiResponse<SpringPage<ProductResponseDTO>>,
  { page: number; size: number },
  { rejectValue: string }
>("products/fetchMyProducts", async ({ page, size }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<SpringPage<ProductResponseDTO>>>(
      "/artisan/products",
      { params: { page, size } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Lấy danh sách sản phẩm của bạn thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- CREATE PRODUCT (ARTISAN) ---
export const createProduct = createAsyncThunk<
  ApiResponse<ProductResponseDTO>,
  FormData,
  { rejectValue: string }
>("products/createProduct", async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<ProductResponseDTO>>(
      "/artisan/products",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Thêm sản phẩm mới thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- UPDATE PRODUCT (ARTISAN) ---
export const updateProduct = createAsyncThunk<
  ApiResponse<ProductResponseDTO>,
  { id: number; formData: FormData },
  { rejectValue: string }
>("products/updateProduct", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<ProductResponseDTO>>(
      `/artisan/products/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Cập nhật sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- TOGGLE PRODUCT STATUS (ARTISAN) ---
export const toggleProductStatus = createAsyncThunk<
  ApiResponse<void> & { id: number; status: ProductStatus },
  { id: number; status: ProductStatus },
  { rejectValue: string }
>("products/toggleProductStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<void>>(
      `/artisan/products/${id}/status`,
      null,
      { params: { status } }
    );
    return { ...response.data, id, status };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Cập nhật trạng thái sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- DELETE PRODUCT (ARTISAN) ---
export const deleteProduct = createAsyncThunk<
  ApiResponse<void> & { id: number },
  number,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.delete<ApiResponse<void>>(`/artisan/products/${id}`);
    return { ...response.data, id };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Xóa sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- FETCH PRODUCTS FOR ADMIN ---
export const fetchProductsAdmin = createAsyncThunk<
  ApiResponse<SpringPage<ProductResponseDTO>>,
  { page: number; size: number; keyword?: string; status?: ProductStatus },
  { rejectValue: string }
>("products/fetchProductsAdmin", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<SpringPage<ProductResponseDTO>>>(
      "/admin/products",
      { params }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Lấy danh sách quản trị sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- ADMIN TOGGLE PRODUCT STATUS ---
export const adminToggleProductStatus = createAsyncThunk<
  ApiResponse<void> & { id: number; status: ProductStatus },
  { id: number; status: ProductStatus },
  { rejectValue: string }
>("products/adminToggleProductStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch<ApiResponse<void>>(
      `/admin/products/${id}/status`,
      null,
      { params: { status } }
    );
    return { ...response.data, id, status };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Cập nhật trạng thái sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- ADMIN CREATE PRODUCT ---
export const adminCreateProduct = createAsyncThunk<
  ApiResponse<ProductResponseDTO>,
  { artisanId: number; formData: FormData },
  { rejectValue: string }
>("products/adminCreateProduct", async ({ artisanId, formData }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<ProductResponseDTO>>(
      `/admin/products?artisanId=${artisanId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Thêm sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});

// --- ADMIN UPDATE PRODUCT ---
export const adminUpdateProduct = createAsyncThunk<
  ApiResponse<ProductResponseDTO>,
  { id: number; formData: FormData },
  { rejectValue: string }
>("products/adminUpdateProduct", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<ProductResponseDTO>>(
      `/admin/products/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || "Cập nhật sản phẩm thất bại!"
      );
    }
    return rejectWithValue("Lỗi kết nối đến máy chủ!");
  }
});
