import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const UsersBarChart = () => {
  const data = [20, 35, 25, 40, 30, 45, 35, 50, 25, 40, 30, 55, 40, 35, 45, 30, 50, 35, 25, 40];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-600">Users in last 30 minutes</h3>
          <div className="text-3xl font-bold">21.5K</div>
          <div className="text-sm text-gray-500">Users per minute</div>
        </div>
        <MoreHorizontal className="text-gray-400" size={20} />
      </div>
      <div className="flex items-end gap-1 h-16 mb-4">
        {data.map((height, i) => (
          <div key={i} className="bg-green-400 rounded-sm flex-1" style={{ height: `${height}%` }}></div>
        ))}
      </div>
    </div>
  );
};

export default UsersBarChart;
