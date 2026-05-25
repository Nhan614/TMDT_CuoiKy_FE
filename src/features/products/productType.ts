export interface ProductResponseDTO {
  id: number;
  name?: string;
  title?: string;
  price: number | string;
  rating?: number;
  image?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  categoryId?: number;
  description?: string;
}

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 0-indexed page in backend (or 1 depending on API, backend controller has defaultValue = "1")
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ProductFilterParams {
  page: number; // 1-based index (matching controller's defaultValue = "1")
  size: number;
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  sortBy: string;
}

export interface ProductState {
  products: ProductResponseDTO[];
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilterParams;
}
