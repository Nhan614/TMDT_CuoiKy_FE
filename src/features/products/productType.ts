export interface ProductResponseDTO {
  id: number;
  name?: string;
  title?: string;
  price: number | string;
  discountPrice?: number | null;
  rating?: number;
  image?: string;
  thumbnailUrl?: string;
  images?: string[];
  materials?: string[];
  averageRating?: number;
  stockQuantity?: number;
  isPreOrder?: boolean;
  makingDays?: number;
  artisanName?: string;
  categoryName?: string;
  categoryId?: number;
  isActive?: boolean;
  description?: string;
  shortDescription?: string;
}

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 0-indexed page in backend
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ProductFilterParams {
  page: number; // 1-based index
  size: number;
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  sortBy: string;
}

export interface ProductDetailState {
  product: ProductResponseDTO | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
  products: ProductResponseDTO[];
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilterParams;
  productDetail: ProductDetailState;
}
