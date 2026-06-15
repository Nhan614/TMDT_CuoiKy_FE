import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { HomePage, LoginPage, RegisterPage } from "../pages/public";
import { DashboardPage } from "../pages/admin";
import PublicLayout from "../components/layouts/publicLayout";
import AboutPage from "../pages/public/AboutPage";
import ArtisanPage from "../pages/public/ArtisanPage";
import ProductsPage from "../pages/public/ProductsPage";
import CartPage from "../pages/public/CartPage";
import ProductDetail from "../pages/public/ProductDetailPage";
import ArtisanDetail from "../pages/public/ArtisanDetail";
import CheckoutPage from "../pages/public/CheckoutPage";
import PaymentResultPage from "../pages/public/PaymentResultPage";
import OrdersPage from "../pages/public/OrdersPage";
import OrderDetailPage from "../pages/public/OrderDetailPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import ProfilePage from "../pages/public/ProfilePage";
import CustomOrderFormPage from "../pages/public/CustomOrderFormPage";
import MyCustomOrdersPage from "../pages/public/MyCustomOrdersPage";
import MyCustomOrderDetailPage from "../pages/public/MyCustomOrderDetailPage";
import ArtisanCustomOrdersPage from "../pages/public/ArtisanCustomOrdersPage";
import ArtisanCustomOrderDetailPage from "../pages/public/ArtisanCustomOrderDetailPage";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  // --- PUBLIC ROUTES ---
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/artisan",
        element: <ArtisanPage />,
      },
      {
        path: "/artisans/:id",
        element: <ArtisanDetail />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/payment/result",
        element: <PaymentResultPage />,
      },
    ],
  },

  // --- PRIVATE ROUTES (auth required, with layout) ---
  {
    element: <PublicLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
          // Profile
          { path: "/profile", element: <ProfilePage /> },
          // Custom Orders (User)
          { path: "/custom-orders/create", element: <CustomOrderFormPage /> },
          { path: "/custom-orders/my", element: <MyCustomOrdersPage /> },
          { path: "/custom-orders/my/:id", element: <MyCustomOrderDetailPage /> },
          // Custom Orders (Artisan)
          { path: "/custom-orders/artisan", element: <ArtisanCustomOrdersPage /> },
          { path: "/custom-orders/artisan/:id", element: <ArtisanCustomOrderDetailPage /> },
        ],
      },
    ],
  },

  // --- ERROR/404 ---
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
