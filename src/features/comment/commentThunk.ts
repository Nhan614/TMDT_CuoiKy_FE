import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type { CommentResponseDTO, AddCommentRequest } from "./commentType";
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
    if (axios.isAxiosError(error) && error.response) {
        return error.response.data?.message || defaultMsg;
    }
    return "Lỗi kết nối đến máy chủ!";
};
// GET /api/products/{productId}/comments
export const fetchCommentsByProduct = createAsyncThunk<
    ApiResponse<CommentResponseDTO[]>,
    { productId: number; page?: number; size?: number },
    { rejectValue: string }
>("comments/fetchByProduct", async ({ productId, page = 1, size = 10 }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get<ApiResponse<CommentResponseDTO[]>>(
            `/products/${productId}/comments`,
            { params: { page, size } }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Không thể tải bình luận!"));
    }
});
// POST /api/products/{productId}/comments
export const addComment = createAsyncThunk<
    ApiResponse<CommentResponseDTO>,
    { productId: number; payload: AddCommentRequest },
    { rejectValue: string }
>("comments/add", async ({ productId, payload }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post<ApiResponse<CommentResponseDTO>>(
            `/products/${productId}/comments`,
            payload
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Không thể gửi bình luận!"));
    }
});
// DELETE /api/comments/{id}
export const deleteComment = createAsyncThunk<
    ApiResponse<void>,
    number, // commentId
    { rejectValue: string }
>("comments/delete", async (commentId, { rejectWithValue }) => {
    try {
        const response = await axiosClient.delete<ApiResponse<void>>(
            `/comments/${commentId}`
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Không thể xóa bình luận!"));
    }
});
// GET /api/comments/my
export const fetchMyComments = createAsyncThunk<
    ApiResponse<CommentResponseDTO[]>,
    void,
    { rejectValue: string }
>("comments/fetchMy", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get<ApiResponse<CommentResponseDTO[]>>(
            "/comments/my"
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Không thể tải bình luận của bạn!"));
    }
});
