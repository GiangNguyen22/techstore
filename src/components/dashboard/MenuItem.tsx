import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, active = false, badge, onClick }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`}
  onClick={onClick}
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

export default MenuItem;
