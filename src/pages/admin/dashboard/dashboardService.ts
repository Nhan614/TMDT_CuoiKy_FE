import axiosClient from "../../../api/axiosClient"; 

export interface DashboardOverview {
  totalRevenue: number;
  totalRegularRevenue: number;
  totalCustomRevenue: number;
  totalOrders: number;
  totalRegularOrders: number;
  totalCustomOrders: number;
  totalProducts: number;
  totalArtisans: number;
  totalCustomers: number;
}

export interface TopProductData {
  productId: number;
  productName: string;
  thumbnailUrl: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface TopArtisanData {
  artisanName: string;
  revenue: number;
  orderCount: number;
}

export interface DashboardReportDTO {
  overview: DashboardOverview;
  topProducts: TopProductData[];
  topArtisans: TopArtisanData[];
}

export const dashboardService = {
  getReport: async (): Promise<DashboardReportDTO> => {
    const response = await axiosClient.get("/admin/dashboard");

    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Lấy dữ liệu báo cáo thất bại");
  }
};