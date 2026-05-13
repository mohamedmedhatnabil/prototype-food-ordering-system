import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import AdminRoute from "./AdminRoutes";

// Lazy-load the heavy admin bundle — only fetched when an admin visits /admin
const AdminDashboard = lazy(() => import("../pages/admin/adminDashboard"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"      element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart"  element={<Cart />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Suspense fallback={null}>
              <AdminDashboard />
            </Suspense>
          </AdminRoute>
        }
      />
    </Routes>
  );
}