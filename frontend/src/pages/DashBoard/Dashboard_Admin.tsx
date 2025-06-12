import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import Dialog from "./Dialog";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import {
  Home,
  ShoppingCart,
  Users,
  Tag,
  Grid3X3,
  CreditCard,
  Star,
  Plus,
  Image,
  List,
  MessageSquare,
  Shield,
  Settings,
  Store,
  Search,
  Bell,
  MoreHorizontal,
  Filter,
  Eye,
} from "lucide-react";


interface MenuItemProps {
  icon: LucideIcon; // Type for Lucide icon components
  label: string; // Must be a string
  active?: boolean; // Optional boolean (? means optional)
  badge?: string; // Optional string
}

const Dashboard_Admin = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard_Admin");

  const menuItems = [
    { icon: Home, label: "Dashboard_Admin", active: true },
    // { icon: MessageCircle, label: "Message" },
    { icon: ShoppingCart, label: "Order Management" },
    { icon: Users, label: "Customers" },
    { icon: Tag, label: "Coupon Code" },
    { icon: Grid3X3, label: "Categories" },
    { icon: CreditCard, label: "Transaction" },
    { icon: Star, label: "Brand" },
  ];

  const productMenuItems = [
    { icon: Plus, label: "Add Products" },
    { icon: Image, label: "Product Media", badge: "141.3" },
    { icon: List, label: "Product List" },
    { icon: MessageSquare, label: "Product Reviews" },
  ];

  const adminMenuItems = [
    { icon: Shield, label: "Admin role" },
    { icon: Settings, label: "Control Authority" },
  ];

  const weeklyData = [
    { day: "Sun", value: 15 },
    { day: "Mon", value: 25 },
    { day: "Tue", value: 30 },
    { day: "Wed", value: 45 },
    { day: "Thu", value: 35 },
    { day: "Fri", value: 25 },
    { day: "Sat", value: 30 },
  ];

  const countries = [
    {
      name: "US",
      flag: "🇺🇸",
      sales: "30k",
      value: 194.5,
      change: 25.8,
      color: "bg-red-500",
    },
    {
      name: "Brazil",
      flag: "🇧🇷",
      sales: "30k",
      value: 0,
      change: -15.8,
      color: "bg-blue-500",
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      sales: "25k",
      value: 0,
      change: 35.8,
      color: "bg-blue-500",
    },
  ];

  const transactions = [
    {
      id: "#6545",
      customerId: "#6545",
      date: "01 Oct 11:29 am",
      status: "Paid",
      amount: "$64",
      statusColor: "text-green-600",
    },
    {
      id: "#5412",
      customerId: "#5412",
      date: "01 Oct 11:29 am",
      status: "Pending",
      amount: "$557",
      statusColor: "text-yellow-600",
    },
  ];

  //   const isOpenDialog = useSelector(
  //     (state: RootState) => state.dialog.isOpenDialog
  //   );

  //   return (
  //     <div className="h-screen">
  //       <ToastContainer autoClose={2000} />
  //       {isOpenDialog && <Dialog />}
  //       <div className="flex bg-blue-50  gap-20 w-full h-full">
  //         <Sidebar />
  //         <Main />
  //       </div>
  //     </div>
  //   );
  // };
  const MenuItem: React.FC<MenuItemProps> = ({
    icon: Icon,
    label,
    active = false,
    badge,
  }) => (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-green-500 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
      {badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl">DEALPORT</span>
          </div>
        </div>

        <div className="px-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Main menu
            </h3>
            <div className="space-y-1">
             {menuItems.map((item, index) => (
                <MenuItem key={index} icon={item.icon} label={item.label} active={item.active} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Product
            </h3>
            <div className="space-y-1">
              {productMenuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Admin
            </h3>
            <div className="space-y-1">
              {adminMenuItems.map((item, index) => (
                <MenuItem key={index} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
            <div>
              <div className="text-sm font-medium">Dealport</div>
              <div className="text-xs text-gray-500">Mark@thedesigner...</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Store size={16} />
            <span>Your Shop</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search data, users, or reports"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Bell className="text-gray-600 cursor-pointer" size={20} />
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto h-full">
          {/* Top Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-gray-600 text-sm">Total Sales</h3>
                  <p className="text-xs text-gray-400">Last 7 days</p>
                </div>
                <MoreHorizontal className="text-gray-400" size={20} />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$350K</span>
                <span className="ml-2 text-sm text-gray-600">Sales</span>
                <span className="ml-2 text-green-500 text-sm">↑ 10.4%</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Previous 7days ($235)
              </p>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                Details
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-gray-600 text-sm">Total Orders</h3>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    187.23
                  </span>
                </div>
                <MoreHorizontal className="text-gray-400" size={20} />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">10.7K</span>
                <span className="ml-2 text-sm text-gray-600">order</span>
                <span className="ml-2 text-green-500 text-sm">↑ 14.4%</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Previous 7days (7.6k)
              </p>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                Details
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-gray-600 text-sm">Pending & Canceled</h3>
                  <p className="text-xs text-gray-400">Last 7 days</p>
                </div>
                <MoreHorizontal className="text-gray-400" size={20} />
              </div>
              <div className="flex gap-8 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <span className="text-2xl font-bold">509</span>
                  <span className="text-sm text-gray-400 ml-2">user 204</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Canceled</p>
                  <span className="text-2xl font-bold">94</span>
                  <span className="text-green-500 text-sm ml-2">↑ 14.4%</span>
                </div>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                Details
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Weekly Report Chart */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Report for this week</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded">
                    This week
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 rounded">
                    Last week
                  </button>
                  <MoreHorizontal className="text-gray-400 ml-2" size={20} />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-5 gap-6 mb-6">
                <div>
                  <div className="text-2xl font-bold">52k</div>
                  <div className="text-sm text-gray-500">Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">3.5k</div>
                  <div className="text-sm text-gray-500">Total Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">2.5k</div>
                  <div className="text-sm text-gray-500">Stock Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0.5k</div>
                  <div className="text-sm text-gray-500">Out of Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">250k</div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative h-48">
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#10B981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 160 Q 80 140 160 120 T 320 100 T 480 110 T 640 105 L 640 192 L 0 192 Z"
                    fill="url(#gradient)"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 160 Q 80 140 160 120 T 320 100 T 480 110 T 640 105"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute top-16 left-80 bg-green-100 px-3 py-2 rounded-lg text-sm">
                  <div className="text-green-700 font-medium">Thursday</div>
                  <div className="text-green-600">1.5k</div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-between text-xs text-gray-500">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Users Stats */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm text-gray-600">
                      Users in last 30 minutes
                    </h3>
                    <div className="text-3xl font-bold">21.5K</div>
                    <div className="text-sm text-gray-500">
                      Users per minute
                    </div>
                  </div>
                  <MoreHorizontal className="text-gray-400" size={20} />
                </div>
                <div className="flex items-end gap-1 h-16 mb-4">
                  {[
                    20, 35, 25, 40, 30, 45, 35, 50, 25, 40, 30, 55, 40, 35, 45,
                    30, 50, 35, 25, 40,
                  ].map((height, i) => (
                    <div
                      key={i}
                      className="bg-green-400 rounded-sm flex-1"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Sales by Country */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Sales by Country</h3>
                  <span className="text-sm font-medium">Sales</span>
                </div>
                <div className="space-y-4">
                  {countries.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{country.flag}</span>
                        <div>
                          <div className="font-medium">{country.sales}</div>
                          <div className="text-sm text-gray-500">
                            {country.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {country.value > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            {country.value}
                          </span>
                        )}
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div
                            className={`h-full ${country.color} rounded`}
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm ${
                            country.change > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {country.change > 0 ? "↑" : "↓"}{" "}
                          {Math.abs(country.change)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View Insight
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Transactions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Transaction</h3>
                <button className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-lg text-sm">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        No
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Id Customer
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Order Date
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 text-sm">{index + 1}.</td>
                        <td className="py-3 text-sm">
                          {transaction.customerId}
                        </td>
                        <td className="py-3 text-sm">{transaction.date}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-sm ${transaction.statusColor}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                transaction.status === "Paid"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm font-medium">
                          {transaction.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products</h3>
                <button className="text-sm text-blue-500">All product</button>
              </div>
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  </div>
                  <div>
                    <div className="font-medium">Apple iPhone 13</div>
                    <div className="text-sm text-gray-500">Item: #FX-4567</div>
                  </div>
                </div>
                <div className="text-lg font-bold">$999.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard_Admin;
