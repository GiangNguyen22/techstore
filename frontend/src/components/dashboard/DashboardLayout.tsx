// export default DashboardLayout;
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

import CategoriesContent from "./content/CategoriesContent";
import DashboardAdmin from "./content/DashboardAdmin";
import OrderManangement from "./content/OrderManagement";
import CustomerContent from "./content/CustomerContent";
import Transaction from "./content/Transaction";
import AddProduct from "./content/AddProduct";
import AdminRole from "./content/AdminRole";
import ControlAuthority from "./content/ControlAuthority";
import FooterComponent from "../commom/FooterComponent";
import EditProduct from "../../pages/DashBoard/pages/EditProduct/EditProduct";

const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard_Admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Menu dữ liệu giả lập (có thể thay bằng props sau này)
  const menuItems = [
    {
      icon: require("lucide-react").Home,
      label: "Dashboard_Admin",
      active: true,
    },
    { icon: require("lucide-react").ShoppingCart, label: "Order Management" },
    { icon: require("lucide-react").Users, label: "Customers" },
    { icon: require("lucide-react").Grid3X3, label: "Categories" },
    { icon: require("lucide-react").CreditCard, label: "Transaction" },
  ];

  const productMenuItems = [
    { icon: require("lucide-react").Plus, label: "Add Products" },
    {
      icon: require("lucide-react").Image,
      label: "Product Media",
      badge: "141.3",
    },
    { icon: require("lucide-react").List, label: "Product List" },
  ];

  const adminMenuItems = [
    { icon: require("lucide-react").Shield, label: "Admin role" },
    { icon: require("lucide-react").Settings, label: "Control Authority" },
  ];
  const action = [
    {
      icon: require("lucide-react").LogOut,
      label: "Logout",
      onClick: () => console.log("Logging out..."),
    },
    {
      icon: require("lucide-react").Store,
      label: "Your Shop",
      onClick: () => (window.location.href = "http://localhost:3000/"),
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard_Admin":
        return <DashboardAdmin />;
      case "Customers":
        return <CustomerContent />;
      case "Categories":
        return <CategoriesContent />;
      case "Order Management":
        return <OrderManangement />;
      case "Transaction":
        return <Transaction />;
      case "Add Products":
        return <AddProduct />;
      case "Product Media":
        return (
          <div className="text-gray-500">Product Media content goes here</div>
        );
      case "Product List":
        return <EditProduct />;
      case "Admin role":
        return <AdminRole />;
      case "Control Authority":
        return <ControlAuthority />;
      default:
        return (
          <div className="text-gray-500">
            No content found for "{activeMenu}"
          </div>
        );
    }
  };

  return (
    <div className="flex h-auto overflow-hidden bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        productMenuItems={productMenuItems}
        adminMenuItems={adminMenuItems}
        actionMenuItems={action}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 overflow-hidden">
        <Header />
        <div className="p-6 overflow-y-auto h-full">{renderContent()}</div>
        {/* Footer */}
        <FooterComponent />
      </div>
    </div>
  );
};

export default DashboardLayout;
