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

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/productDetail",
    element: <ProductDetail />,
  },

  // ── Payment result (public — receives VNPay redirect, no layout needed) ──
  {
    path: "/payment/result",
    element: <PaymentResultPage />,
  },

  // --- PUBLIC ROUTES (with layout) ---
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
    ],
  },

  // --- PRIVATE ROUTES (auth required, with layout) ---
  {
    element: <PublicLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/checkout",      element: <CheckoutPage /> },
          { path: "/orders",        element: <OrdersPage /> },
          { path: "/orders/:id",    element: <OrderDetailPage /> },
          { path: "/dashboard",     element: <DashboardPage /> },
          { path: "/admin/orders",  element: <AdminOrdersPage /> },
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
