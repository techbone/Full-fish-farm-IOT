import React, { useState } from 'react';
import { Menu, X, Home, BarChart3, Bell, Settings } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Mobile navigation component with hamburger menu
 * Shows as hamburger on small screens, full navigation on larger screens
 */
const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false); // Close menu after selection on mobile
  };

  return (
    <>
      {/* Desktop Navigation - Right Sidebar */}
      <div className="hidden md:flex fixed right-0 top-0 h-full w-20 bg-white shadow-2xl border-l border-gray-200 flex-col items-center py-6 z-50">
        {/* OAUSTECH Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 p-1 shadow-lg">
            <img 
              src="/OAUSTECH LOGO.png" 
              alt="OAUSTECH Logo" 
              className="w-full h-full object-contain rounded-full bg-white"
            />
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={item.label}
              >
                <Icon size={20} />
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="md:hidden">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <Menu size={24} className="text-gray-600" />
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
        )}

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 mb-8 mt-8">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 p-1 shadow-lg">
                <img 
                  src="/OAUSTECH LOGO.png" 
                  alt="OAUSTECH Logo" 
                  className="w-full h-full object-contain rounded-full bg-white"
                />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Fish Farm</h2>
                <p className="text-xs text-gray-500">OAUSTECH IoT</p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;