// import React from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import StatsCard from './StatsCard';
// import WeeklyReport from './WeeklyReport';


// const DashboardLayout = () => {
//   // Hardcoded data tạm (có thể đưa vào props sau)
// //   const menuItems = [ ... ];
// //   const productMenuItems = [ ... ];
// //   const adminMenuItems = [ ... ];
//     const menuItems = [
//         { title: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
//         { title: 'Categories', icon: 'categories', link: '/dashboard/categories' },
//         { title: 'Products', icon: 'products', link: '/dashboard/products' },
//         { title: 'Orders', icon: 'orders', link: '/dashboard/orders' },
//     ];
//     const productMenuItems = [
//         { title: 'Add Product', icon: 'add_product', link: '/dashboard/add-product' },
//         { title: 'Manage Products', icon: 'manage_products', link: '/dashboard/manage-products' },
//     ];
//     const adminMenuItems = [
//         { title: 'Users', icon: 'users', link: '/dashboard/users' },
//         { title: 'Settings', icon: 'settings', link: '/dashboard/settings' },
//     ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar 
//         menuItems={menuItems} 
//         productMenuItems={productMenuItems} 
//         adminMenuItems={adminMenuItems} 
//       />
//       <div className="flex-1 overflow-hidden">
//         <Header />
//         <div className="p-6 overflow-y-auto h-full">
//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-6 mb-6">
//             <StatsCard title="Total Sales" value="$350K" subvalue="Sales" percentage="↑ 10.4%" />
//             <StatsCard title="Total Orders" value="10.7K" badge="187.23" subvalue="order" percentage="↑ 14.4%" />
//             <StatsCard title="Pending & Canceled" value="509" subvalue="user 204" />
//           </div>
//           <div className="grid grid-cols-3 gap-6">
//             <WeeklyReport />
//             {/* ... */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCard from './StatsCard';
import WeeklyReport from './WeeklyReport';
import UsersBarChart from './UsersBarChart';
import SalesByCountry from './SalesByCountry';
import TransactionsTable from './TransactionsTable';
import TopProducts from './TopProducts';
import CategoriesContent from './content/CategoriesContent';
import DashboardAdmin from './content/DashboardAdmin';
import OrderManangement from './content/OrderManagement';
import CustomerContent from './content/CustomerContent';
import Transaction from './content/Transaction';
import AddProduct from './content/AddProduct';
import ProductList from './content/ProductList';
import AdminRole from './content/AdminRole';
import ControlAuthority from './content/ControlAuthority';


const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard_Admin');
  // Menu dữ liệu giả lập (có thể thay bằng props sau này)
  const menuItems = [
    { icon: require('lucide-react').Home, label: 'Dashboard_Admin', active: true },
    { icon: require('lucide-react').ShoppingCart, label: 'Order Management' },
    { icon: require('lucide-react').Users, label: 'Customers' },
    { icon: require('lucide-react').Tag, label: 'Coupon Code' },
    { icon: require('lucide-react').Grid3X3, label: 'Categories' },
    { icon: require('lucide-react').CreditCard, label: 'Transaction' },
    { icon: require('lucide-react').Star, label: 'Brand' },
  ];

  const productMenuItems = [
    { icon: require('lucide-react').Plus, label: 'Add Products' },
    { icon: require('lucide-react').Image, label: 'Product Media', badge: '141.3' },
    { icon: require('lucide-react').List, label: 'Product List' },
    { icon: require('lucide-react').MessageSquare, label: 'Product Reviews' },
  ];

  const adminMenuItems = [
    { icon: require('lucide-react').Shield, label: 'Admin role' },
    { icon: require('lucide-react').Settings, label: 'Control Authority' },
  ];
  const action = [
  { icon: require('lucide-react').LogOut, label: 'Logout',onClick: () => console.log('Logging out...') },
  { icon: require('lucide-react').Store, label: 'Your Shop', onClick: () => window.location.href = 'http://localhost:3000/'},
];

// const allMenus = [...menuItems, ...productMenuItems, ...adminMenuItems, ...action];
  // Render content theo activeMenu
    const renderContent = () => {
        switch (activeMenu) {
            case 'Dashboard_Admin':
                return <DashboardAdmin />;
            case 'Customers':
                return <CustomerContent />
            case 'Categories':
                return <CategoriesContent />;
            case "Order Management":
                return <OrderManangement />
                case 'Transaction':
                    return <Transaction />
            case 'Add Products':
                return <AddProduct />;
            case 'Product Media':
                return <div className="text-gray-500">Product Media content goes here</div>;
            case 'Product List':
                return <ProductList />;
            case 'Admin role':
                return <AdminRole />
            case 'Control Authority':
                return <ControlAuthority />
            default:
                return <div className="text-gray-500">No content found for "{activeMenu}"</div>;
        }
    };
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar 
//         menuItems={menuItems}
//         productMenuItems={productMenuItems}
//         adminMenuItems={adminMenuItems}
//         actionMenuItems={action}
//         activeMenu={activeMenu}
//         setActiveMenu={setActiveMenu}
//       />

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         <Header />
//         <div className="p-6 overflow-y-auto h-full">
//             {activeMenu === 'Categories' && <CategoriesContent />}
//           {/* Top Stats */}
//           <div className="grid grid-cols-3 gap-6 mb-6">
//             <StatsCard
//               title="Total Sales"
//               value="$350K"
//               subtitle="Last 7 days"
//               subvalue="Sales"
//               percentage="↑ 10.4%"
//             />
//             <StatsCard
//               title="Total Orders"
//               value="10.7K"
//               badge="187.23"
//               subvalue="order"
//               percentage="↑ 14.4%"
//             />
//             <StatsCard
//               title="Pending & Canceled"
//               value="509"
//               subtitle="Last 7 days"
//               subvalue="user 204"
//               percentage=""
//             />
//           </div>

//           {/* Middle Section: Weekly chart & right column */}
//           <div className="grid grid-cols-3 gap-6">
//             <WeeklyReport />
//             <div className="space-y-6">
//               <UsersBarChart />
//               <SalesByCountry />
//             </div>
//           </div>

//           {/* Bottom Section: Transactions & Top Products */}
//           <div className="grid grid-cols-2 gap-6 mt-6">
//             <TransactionsTable />
//             <TopProducts />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        productMenuItems={productMenuItems}
        adminMenuItems={adminMenuItems}
        actionMenuItems={action}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1 overflow-hidden">
        <Header />
        <div className="p-6 overflow-y-auto h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
