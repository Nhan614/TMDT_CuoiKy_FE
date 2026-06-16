export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ArtisanApplicationDTO {
  id: number;
  userId: number;
  fullName: string;
  skill: string;
  skillDisplayName: string;
  bio: string;
  quote: string;
  startedCraftingDate: string;
  portfolioUrl: string;
  avatarUrl: string;
  proofImageUrls: string[];
  status: ApplicationStatus;
  rejectionReason: string | null;
  reviewedBy: number | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface ArtisanApplicationState {
  // User side
  myApplication: ArtisanApplicationDTO | null;
  myApplicationLoading: boolean;
  // Admin side
  applications: ArtisanApplicationDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  adminLoading: boolean;
  // Shared
  error: string | null;
  successMessage: string | null;
}
