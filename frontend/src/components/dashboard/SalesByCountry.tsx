import React from 'react';
import { Eye } from 'lucide-react';

const SalesByCountry = () => {
  const countries = [
    { name: 'US', flag: '🇺🇸', sales: '30k', value: 194.5, change: 25.8, color: 'bg-red-500' },
    { name: 'Brazil', flag: '🇧🇷', sales: '30k', value: 0, change: -15.8, color: 'bg-blue-500' },
    { name: 'Australia', flag: '🇦🇺', sales: '25k', value: 0, change: 35.8, color: 'bg-blue-500' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Sales by Country</h3>
        <span className="text-sm font-medium">Sales</span>
      </div>
      <div className="space-y-4">
        {countries.map((country, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{country.flag}</span>
              <div>
                <div className="font-medium">{country.sales}</div>
                <div className="text-sm text-gray-500">{country.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {country.value > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {country.value}
                </span>
              )}
              <div className="w-16 h-2 bg-gray-200 rounded">
                <div className={`h-full ${country.color} rounded`} style={{ width: '60%' }}></div>
              </div>
              <span className={`text-sm ${country.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {country.change > 0 ? '↑' : '↓'} {Math.abs(country.change)}%
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
  );
};

export default SalesByCountry;
