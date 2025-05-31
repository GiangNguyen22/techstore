import React from 'react';
import MenuItem from './MenuItem';

interface SidebarProps {
  menuItems: any[];
  productMenuItems: any[];
  adminMenuItems: any[];
  actionMenuItems: any[];
  activeMenu: string;
  setActiveMenu: (label: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  productMenuItems,
  adminMenuItems,
  actionMenuItems,
  activeMenu,
  setActiveMenu
}) => {
  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-bold text-xl">DEALPORT</span>
        </div>
      </div>

      {/* Scrollable Menu Section */}
      <div className="flex-1 overflow-y-auto px-4">
        <Section
          title="Main menu"
          items={menuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <Section
          title="Product"
          items={productMenuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <Section
          title="Admin"
          items={adminMenuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <Section
          title="Action"
          items={actionMenuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </div>

      {/* Bottom User Info */}
      <div className="px-4 py-4 border-t shrink-0">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          <div>
            <div className="text-sm font-medium">Dealport</div>
            <div className="text-xs text-gray-500">Mark@thedesigner...</div>
          </div>
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
}

const Section: React.FC<SectionProps> = ({ title, items, activeMenu, setActiveMenu }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          active={item.label === activeMenu}
          onClick={item.onClick || (() => setActiveMenu(item.label))}
        />
      ))}
    </div>
  </div>
);

export default Sidebar;
