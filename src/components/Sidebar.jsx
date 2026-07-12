import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  MdDashboard, 
  MdStorefront, 
  MdAddBox, 
  MdLayers, 
  MdGavel, 
  MdQueryStats, 
  MdCloud, 
  MdAccountCircle, 
  MdLogout,
  MdMenu,
  MdClose,
  MdLocalHospital,
  MdSchool
} from 'react-icons/md';

const Sidebar = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: t('dashboardTitle'), icon: MdDashboard },
    { path: '/marketplace', label: t('marketplace'), icon: MdStorefront },
    { path: '/add-product', label: t('addProduct'), icon: MdAddBox },
    { path: '/my-products', label: t('myProducts'), icon: MdLayers },
    { path: '/schemes', label: t('schemes'), icon: MdGavel },
    { path: '/prediction', label: t('pricePrediction'), icon: MdQueryStats },
    { path: '/weather', label: t('weather'), icon: MdCloud },
    { path: '/healthcare', label: t('healthcare'), icon: MdLocalHospital },
    { path: '/education', label: t('education'), icon: MdSchool },
    { path: '/profile', label: t('profile'), icon: MdAccountCircle },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* User Mini Profile */}
        {user && (
          <div className="flex items-center gap-3 p-3 bg-sage-accent/50 border border-forest-green/10 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-forest-green text-white flex items-center justify-center font-bold text-lg font-display flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-gray-800 truncate font-display">{user.name}</h4>
              <p className="text-xs text-forest-green font-medium truncate">{user.village}, {user.district}</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-forest-green text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-forest-green'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <MdLogout className="h-5 w-5 flex-shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-20 left-4 z-40 bg-forest-green text-white p-3 rounded-2xl shadow-lg border-2 border-white"
        title="Open Menu"
      >
        <MdMenu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Drawer Panel */}
          <div
            className="relative w-72 bg-white h-full shadow-2xl border-r border-gray-200 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <MdClose className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Static Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex-shrink-0 self-start sticky top-24">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
