import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GiOakLeaf } from 'react-icons/gi';
import { MdError } from 'react-icons/md';

const Register = () => {
  const { t, setLanguage } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    village: '',
    district: '',
    state: 'Telangana', // Default state
    language: 'en',     // Default preferred language selection
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (formData.password !== formData.confirmPassword) {
      setError(formData.language === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు!' : 'Passwords do not match!');
      return;
    }

    if (formData.mobile.length < 10) {
      setError(formData.language === 'te' ? 'మొబైల్ సంఖ్య సరిగ్గా లేదు!' : 'Mobile number must be at least 10 digits!');
      return;
    }

    try {
      const result = await register(formData);
      if (result && result.success) {
        if (formData.language) {
          setLanguage(formData.language);
        }
        navigate('/dashboard');
      } else {
        setError(result?.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration submit error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-2xl w-full overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-forest-green p-8 text-center text-white space-y-3">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mx-auto">
              <GiOakLeaf className="h-8 w-8 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-extrabold font-display">{t('registerTitle')}</h2>
            <p className="text-emerald-100 text-xs">{t('registerSubtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <MdError className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. Raju Mandavi"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('mobileNumber')} *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="10-digit number"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="Optional"
                />
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('preferredLanguage')} *
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all cursor-pointer font-semibold text-gray-700"
                >
                  <option value="en">English (ఇంగ్లీష్)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>

              {/* Village */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('village')} *
                </label>
                <input
                  type="text"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. Gudipadu"
                />
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('district')} *
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. Adilabad"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('state')} *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. Telangana"
                />
              </div>

              {/* Dummy spacing */}
              <div></div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('password')} *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('confirmPassword')} *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="••••••••"
                />
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-6"
            >
              {t('registerBtn')}
            </button>

            {/* Login Redirect */}
            <div className="text-center text-xs font-semibold text-gray-500 pt-2">
              <span>{t('alreadyAccount')} </span>
              <Link to="/login" className="text-forest-green hover:underline font-bold">
                {t('login')}
              </Link>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
