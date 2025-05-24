import { Navigate, Outlet, useRoutes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";

import { useSelector } from "react-redux";
import Cart from "../pages/Cart/Cart";
import DashBoard from "../pages/DashBoard/DashBoard";
import EditProduct from "../pages/DashBoard/pages/EditProduct/EditProduct";
import CategoryProductListPage from "../pages/Detail/CategoryProductListPage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyPage from "../pages/Register/VerifyPage";

// ProtectedRoute to check for authentication
function ProtectedRoute() {}

function useRouterElement() {
  const routeElement = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/dashboard",
      element: <DashBoard />,
    },
    {
      path: "/dashboard/editProduct",
      element: <EditProduct />,
    },
    {
      path: "/category/:id", // ✅ THÊM DÒNG NÀY
      element: <CategoryProductListPage />,
    },
    {
      path:"/login",
      element: <Login/>
    },
     {
      path:"/register",
      element: <Register/>
    },
    {
      path:"verify",
      element:<VerifyPage/>
    }
  ]);

  return routeElement;
}

export default useRouterElement;
