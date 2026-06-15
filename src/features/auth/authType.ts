export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    version: string;
    page?: number;
    size?: number;
    totalPages?: number;
    totalElements?: number;
  };
}

export type UserRole = "ADMIN" | "USER" | "ARTISAN" | "GUEST";

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface GoogleAuthRequestDTO {
  idToken: string;
}

export interface LoginResponseDTO {
  username: string;
  token: string;
  role: UserRole;
}

export interface AuthState {
  user: LoginResponseDTO | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}