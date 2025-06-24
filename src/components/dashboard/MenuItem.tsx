import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, active = false, badge, onClick,isCollapsed = false  }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
  }  ${isCollapsed ? 'justify-center px-2' : ''}`}
  onClick={onClick}
  title={isCollapsed ? label : undefined}
  >
    <Icon size={18} className="flex-shrink-0" />
    {!isCollapsed && (
      <>
        <span className="text-sm font-medium truncate">{label}</span>
        {badge && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
            {badge}
          </span>
        )}
      </>
    )}
    {isCollapsed && badge && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
        {badge.length > 2 ? '•' : badge}
      </span>
    )}
  </div>
);

export default MenuItem;
