import React from 'react';
import { Home, BarChart3, Settings, Bell, Fish } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-20 bg-white shadow-2xl border-l border-gray-200 flex flex-col items-center py-6 z-50">
      <div className="mb-8">
        <div className="p-3 bg-gradient-to-br from-ocean-500 to-aqua-500 rounded-xl">
          <Fish size={24} className="text-white" />
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-br from-ocean-500 to-aqua-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-ocean-600 hover:bg-ocean-50'
              }`}
            >
              <Icon size={20} />
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;