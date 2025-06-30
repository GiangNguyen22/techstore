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
import Dashboard_Admin from "../pages/DashBoard/Dashboard_Admin";
import DashboardLayout from "../components/dashboard/DashboardLayout";

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
import ProtectedRoute from "../pages/Detail/ProtectedRouteProps";
import AboutUs from "../components/commom/AboutUs";
import ContactPage from "../components/commom/ContactPage";
function useRouterElement() {
  const routeElement = useRoutes([
    {
      path: "/store",
      element: <HomePage />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path:"/aboutUs",
      element:<AboutUs/>
    },
     {
      path:"/lienhe",
      element:<ContactPage/>
    },
    // {
    //   path: "/dashboard",
    //   element: (
    //   <ProtectedRoute adminOnly>
    //     <DashBoard />
    //   </ProtectedRoute>
    // ),
    // },
    {
      path: "/dashboard_layout",

      element:(
         <ProtectedRoute adminOnly>
         <DashboardLayout />
         </ProtectedRoute>
      )
    },


    // {
    //   path: "/dashboard_admin",
    //   element: <Dashboard_Admin />,
    // },
    // {
    //   path: "/dashboard/editProduct",
    //    element: (
    //   <ProtectedRoute adminOnly>
    //     <EditProduct />
    //   </ProtectedRoute>
    // ),
    // },
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
      path:"/",
      element:<HomeStore/>
    },
    {
      path: "/admin/chat",
      element:(
         <ProtectedRoute adminOnly>
            <AdminChat/>
         </ProtectedRoute>
      ) 
    }

  ]);

  return routeElement;
}

export default useRouterElement;
