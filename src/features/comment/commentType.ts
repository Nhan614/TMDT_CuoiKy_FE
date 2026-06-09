export interface CommentResponseDTO {
    id: number;
    content: string;
    rating: number;
    isPurchased: boolean;
    userId: number;
    username: string;
    createdAt: string;
}
export interface AddCommentRequest {
    content: string;
    rating: number;
}
export interface CommentState {
    comments: CommentResponseDTO[];
    myComments: CommentResponseDTO[];
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    successMessage: string | null;
    // Pagination
    totalPages: number;
    totalElements: number;
    currentPage: number;
}