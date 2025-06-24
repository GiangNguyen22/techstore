import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => (
  <div className="bg-white shadow-sm border-b px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
);

export default Header;
