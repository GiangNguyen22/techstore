import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';

const weeklyData = [
  { day: 'Sun', value: 15 },
  { day: 'Mon', value: 25 },
  { day: 'Tue', value: 30 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 35 },
  { day: 'Fri', value: 25 },
  { day: 'Sat', value: 30 },
];

const WeeklyReport = () => {
  return (
    <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Report for this week</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded">This week</button>
          <button className="px-3 py-1 text-sm text-gray-500 rounded">Last week</button>
          <MoreHorizontal className="text-gray-400 ml-2" size={20} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        <div><div className="text-2xl font-bold">52k</div><div className="text-sm text-gray-500">Customers</div></div>
        <div><div className="text-2xl font-bold">3.5k</div><div className="text-sm text-gray-500">Total Products</div></div>
        <div><div className="text-2xl font-bold">2.5k</div><div className="text-sm text-gray-500">Stock Products</div></div>
        <div><div className="text-2xl font-bold">0.5k</div><div className="text-sm text-gray-500">Out of Stock</div></div>
        <div><div className="text-2xl font-bold">250k</div><div className="text-sm text-gray-500">Revenue</div></div>
      </div>

      {/* Line Chart with filled area */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* Định nghĩa gradient cho phần nền */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Không hiển thị grid line */}
            {/* <CartesianGrid strokeDasharray="3 3" /> */}

            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyReport;
