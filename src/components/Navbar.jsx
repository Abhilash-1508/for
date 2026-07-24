import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GiOakLeaf } from 'react-icons/gi';
import { MdDashboard, MdLogout } from 'react-icons/md';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-forest-green border-b-2 border-forest-green font-semibold' : 'text-gray-600 hover:text-forest-green';
  };

  // Determine if we are in the dashboard area (any route starting with /dashboard, /marketplace, /profile, etc.)
  const isDashboardArea = ['/dashboard', '/marketplace', '/add-product', '/my-products', '/prediction', '/schemes', '/weather', '/profile', '/healthcare', '/education'].some(
    path => location.pathname === path || location.pathname.startsWith('/product/')
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-sage-accent rounded-xl text-forest-green transition-transform duration-300 group-hover:scale-110">
                <GiOakLeaf className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-800 font-display">
                Forest<span className="text-forest-green">Connect</span> <span className="text-xs font-semibold bg-forest-green/10 text-forest-green px-1.5 py-0.5 rounded-full ml-1">AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Hidden on dashboard area because dashboard has its sidebar */}
          <div className="hidden md:flex items-center space-x-8">
            {!isDashboardArea ? (
              <>
                <Link to="/" className={`px-1 py-2 text-sm transition-colors duration-200 ${isActive('/')}`}>
                  {t('home')}
                </Link>
                <a href="#about" className="px-1 py-2 text-sm text-gray-600 hover:text-forest-green transition-colors">
                  {t('aboutTitle')}
                </a>
                <a href="#features" className="px-1 py-2 text-sm text-gray-600 hover:text-forest-green transition-colors">
                  {t('featuresTitle')}
                </a>
                <a href="#contact" className="px-1 py-2 text-sm text-gray-600 hover:text-forest-green transition-colors">
                  {t('contactTitle')}
                </a>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                {user ? `${t('welcome')}, ${user.name} (${user.village})` : ""}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher Button (Large pill for accessibility) */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-full border border-gray-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-forest-green text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  language === 'te'
                    ? 'bg-forest-green text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="తెలుగులో చదవండి"
              >
                తెలుగు
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {!isDashboardArea ? (
                    <Link
                      to="/profile"
                      className="flex items-center gap-1 bg-forest-green hover:bg-forest-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                      <MdDashboard className="h-4 w-4" />
                      <span>{t('profile')}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      <MdLogout className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('logout')}</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-forest-green px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-forest-green hover:bg-forest-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
