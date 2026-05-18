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
}

export interface AuthState {
  user: LoginResponseDTO | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}