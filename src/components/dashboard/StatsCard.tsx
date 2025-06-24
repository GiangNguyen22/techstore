// import React from 'react';
// import { MoreHorizontal } from 'lucide-react';

// interface StatsCardProps {
//   title: string;
//   value: string;
//   subtitle?: string;
//   badge?: string;
//   subvalue?: string;
//   percentage?: string;
// }

// const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, badge, subvalue, percentage }) => (
//   <div className="bg-white p-6 rounded-lg shadow-sm">
//     <div className="flex justify-between items-start mb-4">
//       <div>
//         <h3 className="text-gray-600 text-sm">{title}</h3>
//         {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
//         {badge && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{badge}</span>}
//       </div>
//       <MoreHorizontal className="text-gray-400" size={20} />
//     </div>
//     <div className="mb-4">
//       <span className="text-3xl font-bold">{value}</span>
//       {subvalue && <span className="ml-2 text-sm text-gray-600">{subvalue}</span>}
//       {percentage && <span className="ml-2 text-green-500 text-sm">{percentage}</span>}
//     </div>
//     <p className="text-xs text-gray-400 mb-4">Previous 7days</p>
//     <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Details</button>
//   </div>
// );

// export default StatsCard;
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  subvalue?: string;
  percentage?: string;
  badge?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  subvalue,
  percentage,
  badge,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {badge && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-medium">
            {badge}
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        {subvalue && (
          <span className="ml-2 text-sm text-gray-500">{subvalue}</span>
        )}
        {percentage && (
          <span className="ml-2 text-sm font-semibold text-green-500">
            {percentage}
          </span>
        )}
      </div>

      {/* Footer line */}
      <p className="text-xs text-gray-400">Compared to last period</p>

      {/* Optional: CTA */}
      {/* <button className="mt-4 text-sm text-green-600 hover:underline">View details</button> */}
    </div>
  );
};

export default StatsCard;
