import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GiOakLeaf } from 'react-icons/gi';
import { MdPhone, MdLock, MdError } from 'react-icons/md';

const Login = () => {
  const { t, setLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(identifier, password);
    if (result.success) {
      // If user language is registered as 'te', switch language context
      if (result.user.language) {
        setLanguage(result.user.language);
      }
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-forest-green p-8 text-center text-white space-y-3">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mx-auto">
              <GiOakLeaf className="h-8 w-8 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-extrabold font-display">{t('loginTitle')}</h2>
            <p className="text-emerald-100 text-xs">{t('loginSubtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <MdError className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Mobile / Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                {t('emailOrMobile')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MdPhone className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. 9876543210 or admin"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MdLock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-forest-green focus:ring-forest-green h-4 w-4"
                />
                <span>{t('rememberMe')}</span>
              </label>
              
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Verification code sent to registered mobile number."); }} className="text-forest-green hover:underline">
                {t('forgotPassword')}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {t('login')}
            </button>

            {/* Register Redirect */}
            <div className="text-center text-xs font-semibold text-gray-500 pt-2">
              <span>{t('noAccount')} </span>
              <Link to="/register" className="text-forest-green hover:underline font-bold">
                {t('register')}
              </Link>
            </div>

            {/* Demo Help */}
            <div className="p-3 bg-sage-accent/40 rounded-xl border border-emerald-100/50 text-[10px] text-emerald-800 leading-relaxed text-center">
              💡 <strong>Demo Accounts</strong>: Enter any mobile number (e.g. <code>9876543210</code>) or enter <code>admin</code> for administrator controls. Password is any string.
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
