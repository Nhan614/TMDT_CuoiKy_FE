import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { HomePage } from "../pages/public";
import Register from "../pages/public/Register";
import { DashboardPage } from "../pages/admin";
import PublicLayout from "../components/layouts/publicLayout";
import LoginPage from "../pages/public/LoginPage";
import AboutPage from "../pages/public/AboutPage";
import ProductsPage from "../pages/public/ProductsPage";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
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
        path: "/about",
        element: <AboutPage />,
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
