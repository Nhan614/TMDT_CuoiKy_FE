import { ApiResponse } from "../auth/authType";

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productPrice: number;
  productThumbnailUrl: string;
  quantity: number;
  stockQuantity: number;
  isPreOrder: boolean;
  subTotal: number;
}

export interface CartData {
  id: number;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface CartState {
  cart: CartData | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: number;
  quantity: number;
}
