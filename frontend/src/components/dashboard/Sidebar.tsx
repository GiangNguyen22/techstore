import React from 'react';
import MenuItem from './MenuItem';
import { Menu, X } from 'lucide-react';

interface SidebarProps {
  menuItems: any[];
  productMenuItems: any[];
  adminMenuItems: any[];
  actionMenuItems: any[];
  activeMenu: string;
  setActiveMenu: (label: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  productMenuItems,
  adminMenuItems,
  actionMenuItems,
  activeMenu,
  setActiveMenu,
  isCollapsed = false,
  onToggleCollapse
}) => {
  return (
    <div className={`bg-white shadow-lg h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo / Brand */}
      <div className="p-6 shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl transition-opacity duration-200">DEALPORT</span>
            )}
          </div>
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <Menu size={16} /> : <X size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Menu Section */}
       <div className="flex-1 overflow-y-auto px-4 py-4">
        <Section
          title="Main menu"
          items={menuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={isCollapsed}
        />
        <Section
          title="Product"
          items={productMenuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={isCollapsed}
        />
        <Section
          title="Admin"
          items={adminMenuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={isCollapsed}
        />
        <Section
          title="Action"
          items={actionMenuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Bottom User Info */}

      <div className="px-4 py-4 border-t shrink-0">
        <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-all duration-200 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex-shrink-0"></div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">Dealport</div>
              <div className="text-xs text-gray-500 truncate">Mark@thedesigner...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  items: any[];
  activeMenu: string;
  setActiveMenu: (label: string) => void;
  isCollapsed?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, items, activeMenu, setActiveMenu , isCollapsed = false}) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 transition-opacity duration-200">
        {title}
      </h3>
    )}
    {isCollapsed && (
      <div className="h-8 flex items-center justify-center mb-3">
        <div className="w-6 h-px bg-gray-300"></div>
      </div>
    )}
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index} className="relative">
          <MenuItem
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={item.label === activeMenu}
            onClick={item.onClick || (() => setActiveMenu(item.label))}
            isCollapsed={isCollapsed}
          />
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
