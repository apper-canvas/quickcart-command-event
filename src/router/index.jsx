import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import NotFound from "@/components/pages/NotFound";

// Lazy load page components
const HomePage = lazy(() => import("@/pages/HomePage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("@/pages/OrderConfirmationPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Wrap lazy components in Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<SuspenseFallback />}>
    <Component />
  </Suspense>
);

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(HomePage),
  },
  {
    path: "cart",
    element: withSuspense(CartPage),
  },
  {
    path: "checkout",
    element: withSuspense(CheckoutPage),
  },
  {
    path: "order-confirmation/:orderId",
    element: withSuspense(OrderConfirmationPage),
  },
  {
    path: "orders",
    element: withSuspense(OrdersPage),
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
];

// Router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);