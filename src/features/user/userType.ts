export type UserRole = "USER" | "ARTISAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export interface UserResponseDTO {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserUpdateRequestDTO {
  fullName?: string;
  email?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserState {
  currentUser: UserResponseDTO | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Trạng thái ứng tuyển nghệ nhân
  applicationLoading: boolean;
  applicationError: string | null;
  applicationSuccess: string | null;
}
