import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdAccountCircle, MdSave, MdLock } from 'react-icons/md';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t, setLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    mobile: user ? user.mobile : '',
    email: user ? user.email : '',
    village: user ? user.village : '',
    district: user ? user.district : '',
    state: user ? user.state : '',
    language: user ? user.language : 'en'
  });
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setLanguage(formData.language);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setPasswordSuccess(true);
    setPasswords({ old: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Profile Content */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">Manage {t('profile')}</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">Configure your personal settings and localized language preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Profile Settings form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-forest-green">
                <MdAccountCircle className="h-5 w-5" />
                <h3 className="font-bold text-sm text-gray-800 font-display">Personal Details</h3>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-forest-green text-xs font-bold rounded-xl text-center">
                  🎉 Profile updated successfully! (ప్రొఫైల్ సవరించబడింది)
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('fullName')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('mobileNumber')}</label>
                    <input
                      type="text"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('emailAddress')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    />
                  </div>

                  {/* Preferred Language */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('preferredLanguage')}</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    >
                      <option value="en">English (ఇంగ్లీష్)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                    </select>
                  </div>

                  {/* Village */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('village')}</label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    />
                  </div>

                  {/* District */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('district')}</label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-forest-green hover:bg-forest-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
                  >
                    <MdSave className="h-4.5 w-4.5" />
                    <span>Save Profile</span>
                  </button>
                </div>

              </form>

            </div>

            {/* Change Password form */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 self-start">
              
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-forest-green">
                <MdLock className="h-5 w-5" />
                <h3 className="font-bold text-sm text-gray-800 font-display">Change Password</h3>
              </div>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-forest-green text-xs font-bold rounded-xl text-center">
                  🎉 Password changed successfully!
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.old}
                    onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-sm"
                >
                  Update Password
                </button>

              </form>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Profile;
