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
import Profile from "../pages/Profile/Profile";
import OrderPage from "../pages/Order/OrderPage";
import UserOrdersPage from "../pages/Order/UserOrdersPage";
import SearchResultsPage from "../components/commom/SearchResultsPage";
import DetailProduct from "../pages/Detail/DetailProduct";
import PaymentSuccess from "../pages/Detail/PaymentSuccess";
import PaymentFail from "../pages/Detail/PaymentFail";
import FeaturedProductSection from "../pages/Store/FeaturedProductSection";
import HomeStore from "../pages/Store/HomeStore";
import AdminChat from "../components/Admin/AdminChat";
import AdminChatPage from "../components/Admin/AdminChatPage";
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
      path: "/category/:id", 
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
      path:"/verify",
      element:<VerifyPage/>
    },
    {
      path:"/profile",
      element:<Profile/>
    },
    {
      path: "/order",
      element:<OrderPage/>
    },
    {
      path: "/user/orders",
      element: <UserOrdersPage/>
    },
    {
      path:"/search",
      element: <SearchResultsPage/>
    },
    {
      path:"/product/:id",
      element: <DetailProduct/>
    },
    {
      path:"/payment-success",
      element:<PaymentSuccess/>
    },
    {
      path:"/payment-fail",
      element:<PaymentFail/>
    },
    {
      path:"/store",
      element:<HomeStore/>
    },
    {
      path: "/admin/chat",
      element: <AdminChat/>
    }

  ]);

  return routeElement;
}

export default useRouterElement;
