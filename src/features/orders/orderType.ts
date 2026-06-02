// ─── Order Status ──────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

// ─── Payment Method ─────────────────────────────────────────────────────────
export type PaymentMethod = 'VNPAY' | 'COD';

// ─── Payment Status ─────────────────────────────────────────────────────────
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED';

// ─── Order Item ─────────────────────────────────────────────────────────────
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subTotal: number;
}

// ─── Order DTO (from API) ───────────────────────────────────────────────────
export interface OrderDTO {
  id: number;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingAddress: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  // Optional user info (for admin view)
  username?: string;
  userFullName?: string;
}

// ─── Create Order Request ───────────────────────────────────────────────────
export interface CreateOrderRequest {
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
}

// ─── VNPay Request ──────────────────────────────────────────────────────────
export interface CreateVNPayRequest {
  orderId: number;
}

// ─── VNPay Response ─────────────────────────────────────────────────────────
export interface VNPayResponse {
  paymentUrl: string;
}

// ─── Update Order Status (admin) ────────────────────────────────────────────
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// ─── Redux State ────────────────────────────────────────────────────────────
export interface OrderState {
  orders: OrderDTO[];
  currentOrder: OrderDTO | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  successMessage: string | null;
  // Pagination
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
