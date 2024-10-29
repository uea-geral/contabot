import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SalesPage } from "./pages/SalesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/home/products",
    element: <ProductsPage />,
  },
  {
    path: "/home/sales",
    element: <SalesPage />,
  },
]);
