import React from 'react';
import { Search } from 'lucide-react';

const TopProducts = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Products</h3>
        <button className="text-sm text-blue-500">All product</button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
  );
};

export default TopProducts;
