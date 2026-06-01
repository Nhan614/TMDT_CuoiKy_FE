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
        path: "/artisan", // 
        element: <ArtisanPage />,
      },
      {
        path: "/artisans/:id", //
        element: <ArtisanDetail />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },

  // --- PRIVATE ROUTES ---
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },

  // --- ERROR/404 ---
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
