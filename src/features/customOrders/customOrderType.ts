export type CustomOrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface CustomOrderDTO {
  id: number;
  userId: number;
  username: string;
  artisanId: number;
  artisanName: string;
  artisanImage: string;
  title: string;
  description: string;
  budget: number;
  quantity: number;
  deadline: string;
  status: CustomOrderStatus;
  artisanNote: string | null;
  quotedPrice: number | null;
  referenceImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomOrderRequest {
  artisanId: number;
  title: string;
  description: string;
  budget: number;
  quantity: number;
  deadline: string;
  referenceImageUrls: string[];
}

export interface ArtisanAcceptRequest {
  quotedPrice: number;
  artisanNote: string;
}

export interface ArtisanRejectRequest {
  artisanNote: string;
}

export interface CustomOrderState {
  // Dành cho user thường
  myOrders: CustomOrderDTO[];
  myCurrentOrder: CustomOrderDTO | null;
  // Dành cho nghệ nhân
  artisanOrders: CustomOrderDTO[];
  artisanCurrentOrder: CustomOrderDTO | null;
  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  uploadedImageUrls: string[];
  isUploading: boolean;
  // Pagination
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
