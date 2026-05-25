import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080/api/artisans';

// ==================== INTERFACES & TYPES ====================

export interface Artisan {
  id: number;
  name: string;
  tag: string;      
  image: string;
  rating: number;
  quote: string;
  experience: string;
  orders: string;      
  featured?: boolean;
}

export interface PageResponse {
  content: Artisan[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface ArtisanProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  totalSales: number;
}

export interface ArtisanReview {
  id: number;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string; 
}

export interface ArtisanProfile {
  id: number;
  name: string;
  tag: string;
  image: string;
  rating: number;
  quote: string;
  totalOrders: number;
  activeOrdersCount: number;
  skillValue: string;
  status: string;
  startedCraftingDate: string;
  experience: string;
  portfolioProducts: ArtisanProduct[];
  reviews: ArtisanReview[];
}

// 🌟 Điều chỉnh lại Interface nhận dữ liệu từ Back-End của bạn
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    timestamp?: string;
    version?: string;
  };
}

interface ArtisanState {
  pageData: PageResponse;
  loading: boolean;
  selectedSkill: string;
  sortBy: string;
  currentPage: number; // Lưu ý: React chạy từ trang 0
  error: string | null;
  currentProfile: ArtisanProfile | null;
  profileLoading: boolean;               
}

// ==================== INITIAL STATE ====================

const initialState: ArtisanState = {
  pageData: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
    size: 6, // Hiển thị 6 người trên 1 trang
  },
  loading: true,
  selectedSkill: 'ALL',
  sortBy: 'rating',
  currentPage: 0,
  error: null,
  currentProfile: null,
  profileLoading: false,
};

// ==================== ASYNC THUNKS ====================

// 1. Thunk lấy danh sách phân trang ngoài chợ
export const fetchArtisans = createAsyncThunk(
  'artisans/fetchArtisans',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { artisans } = getState() as { artisans: ArtisanState };
      const queryParams = new URLSearchParams();
      
      if (artisans.selectedSkill !== 'ALL') {
        queryParams.append('skill', artisans.selectedSkill);
      }
      queryParams.append('sortBy', artisans.sortBy);
      
      // 🌟 LƯU Ý CHÍNH: Spring Boot nhận trang từ 0, nếu meta cũ trả về từ 1 thì ta giữ nguyên gửi số trang hiện tại
      queryParams.append('page', artisans.currentPage.toString());
      queryParams.append('size', artisans.pageData.size.toString());

      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu từ server');
      }

      const result = (await response.json()) as ApiResponse<Artisan[]>;
      
      // 🌟 TÁI CẤU TRÚC: Chuyển đổi dữ liệu tự chế từ BE thành PageResponse chuẩn cho FE
      const formattedPageData: PageResponse = {
        content: Array.isArray(result.data) ? result.data : [],
        totalPages: result.meta?.totalPages || 1,
        totalElements: result.meta?.totalElements || 0,
        number: artisans.currentPage,
        size: result.meta?.size || artisans.pageData.size
      };

      return formattedPageData; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi kết nối API');
    }
  }
);

// 2. Thunk lấy chi tiết hồ sơ một nghệ nhân
export const fetchArtisanProfile = createAsyncThunk(
  'artisans/fetchArtisanProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Không thể tải thông tin nghệ nhân');
      }
      const result = (await response.json()) as ApiResponse<ArtisanProfile>;
      return result.data; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi kết nối API');
    }
  }
);

// 3. Thunk tạo đơn hàng mới với nghệ nhân
export const createArtisanOrder = createAsyncThunk(
  'artisans/createOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const message = await response.text();
      if (!response.ok) {
        throw new Error(message || 'Không thể tạo đơn hàng');
      }
      return message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi kết nối API');
    }
  }
);

// ==================== SLICE ====================

const artisanSlice = createSlice({
  name: 'artisans',
  initialState,
  reducers: {
    setSkill: (state, action: PayloadAction<string>) => {
      state.selectedSkill = action.payload;
      state.currentPage = 0; 
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.currentPage = 0; 
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý Thunk fetchArtisans (Danh sách)
      .addCase(fetchArtisans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtisans.fulfilled, (state, action: PayloadAction<PageResponse>) => {
        state.loading = false;
        if (action.payload) {
          state.pageData = action.payload; // Bây giờ ăn khớp hoàn hảo cấu trúc PageResponse
        } else {
          state.pageData = initialState.pageData;
        }
      })
      .addCase(fetchArtisans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pageData = initialState.pageData;
      })
      
      // Xử lý Thunk fetchArtisanProfile (Chi tiết Hồ sơ)
      .addCase(fetchArtisanProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchArtisanProfile.fulfilled, (state, action: PayloadAction<ArtisanProfile>) => {
        state.profileLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchArtisanProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSkill, setSortBy, setCurrentPage } = artisanSlice.actions;
export default artisanSlice.reducer;