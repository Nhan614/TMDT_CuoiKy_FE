import { createSlice } from "@reduxjs/toolkit";
import type { CommentState } from "./commentType";
import {
    fetchCommentsByProduct,
    addComment,
    deleteComment,
    fetchMyComments,
} from "./commentThunk";
const initialState: CommentState = {
    comments: [],
    myComments: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
    totalPages: 1,
    totalElements: 0,
    currentPage: 1,
};
const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        clearCommentMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        resetComments: (state) => {
            state.comments = [];
            state.totalPages = 1;
            state.totalElements = 0;
            state.currentPage = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH BY PRODUCT
            .addCase(fetchCommentsByProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCommentsByProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.comments = action.payload.data;
                    state.totalPages = action.payload.meta?.totalPages ?? 1;
                    state.totalElements = action.payload.meta?.totalElements ?? 0;
                    state.currentPage = action.payload.meta?.page ?? 1;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(fetchCommentsByProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // ADD COMMENT
            .addCase(addComment.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.isSubmitting = false;
                if (action.payload.success) {
                    state.comments.unshift(action.payload.data);
                    state.totalElements += 1;
                    state.successMessage = "Đã gửi bình luận thành công!";
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload as string;
            })
            // DELETE COMMENT
            .addCase(deleteComment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.isLoading = false;
                const deletedId = action.meta.arg;
                state.comments = state.comments.filter((c) => c.id !== deletedId);
                state.myComments = state.myComments.filter((c) => c.id !== deletedId);
                state.totalElements = Math.max(0, state.totalElements - 1);
                state.successMessage = "Đã xóa bình luận!";
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // FETCH MY COMMENTS
            .addCase(fetchMyComments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyComments.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.myComments = action.payload.data;
                }
            })
            .addCase(fetchMyComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});
export const { clearCommentMessages, resetComments } = commentSlice.actions;
export default commentSlice.reducer;
