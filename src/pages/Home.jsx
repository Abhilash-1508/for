import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GiOakLeaf } from 'react-icons/gi';
import { MdArrowForward, MdPhone, MdLocationOn, MdEmail } from 'react-icons/md';

const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-emerald-900 to-forest-dark text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Background decorative forest vector circle */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-emerald-800/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/10 tracking-wider uppercase">
            🌱 Smart Tribal Gatherers Platform
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-display font-bold">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-forest-green px-8 py-4 rounded-2xl text-base font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>{t('getStarted')}</span>
              <MdArrowForward className="h-5 w-5" />
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-base font-extrabold transition-all"
            >
              {t('learnMore')}
            </a>
          </div>
        </div>
      </header>

      {/* About Project Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-forest-green font-bold text-sm tracking-wider uppercase">
              <GiOakLeaf className="h-5 w-5" />
              <span>Platform Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 font-display">
              {t('aboutTitle')}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
              <p>{t('aboutText1')}</p>
              <p>{t('aboutText2')}</p>
            </div>
          </div>
          
          {/* Side Info Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-forest-green text-white p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="font-bold text-xl font-display">Impact at a Glance</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <h4 className="font-bold text-sm">Direct Trading</h4>
                  <p className="text-xs text-emerald-100">Bypasses middle-men ensuring up to 35% higher return margins for tribal collecters.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-bold text-sm">AI Price Forecasts</h4>
                  <p className="text-xs text-emerald-100">Analyzes seasonal markets to recommend the most profitable harvest sale months.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📶</span>
                <div>
                  <h4 className="font-bold text-sm">Offline Support</h4>
                  <p className="text-xs text-emerald-100">Runs locally in dense forest regions and automatically syncs when signal returns.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white border-y border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 font-display">{t('featuresTitle')}</h2>
            <p className="text-gray-500 text-sm">Comprehensive modules designed specifically for rural communities to enhance income and security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* feature 1 */}
            <div className="p-6 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-100 rounded-3xl transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 group-hover:bg-forest-green text-forest-green group-hover:text-white flex items-center justify-center text-2xl transition-colors mb-6">
                🛒
              </div>
              <h3 className="font-bold text-base text-gray-800 mb-2 font-display">{t('featureMarketplaceTitle')}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{t('featureMarketplaceDesc')}</p>
            </div>
            
            {/* feature 2 */}
            <div className="p-6 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-100 rounded-3xl transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 group-hover:bg-forest-green text-forest-green group-hover:text-white flex items-center justify-center text-2xl transition-colors mb-6">
                📈
              </div>
              <h3 className="font-bold text-base text-gray-800 mb-2 font-display">{t('featurePredictionTitle')}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{t('featurePredictionDesc')}</p>
            </div>

            {/* feature 3 */}
            <div className="p-6 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-100 rounded-3xl transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 group-hover:bg-forest-green text-forest-green group-hover:text-white flex items-center justify-center text-2xl transition-colors mb-6">
                📜
              </div>
              <h3 className="font-bold text-base text-gray-800 mb-2 font-display">{t('featureSchemesTitle')}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{t('featureSchemesDesc')}</p>
            </div>

            {/* feature 4 */}
            <div className="p-6 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-100 rounded-3xl transition-all duration-300 group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 group-hover:bg-forest-green text-forest-green group-hover:text-white flex items-center justify-center text-2xl transition-colors mb-6">
                🎙️
              </div>
              <h3 className="font-bold text-base text-gray-800 mb-2 font-display">{t('featureVoiceTitle')}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{t('featureVoiceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Info Side */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 sm:p-12 text-white flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold font-display">Contact Information</h3>
              <p className="text-sm text-emerald-200">Have questions about the platform or GCC enrollment? Reach out to our regional team.</p>
            </div>
            
            <div className="space-y-6 text-sm text-emerald-100">
              <div className="flex items-center gap-3">
                <MdLocationOn className="h-5 w-5 text-emerald-400" />
                <span>Adilabad GCC Nodal Branch, Mavala, Adilabad, TS, India</span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="h-5 w-5 text-emerald-400" />
                <span>+91 87322 24900</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="h-5 w-5 text-emerald-400" />
                <span>adilabad-gcc@telangana.gov.in</span>
              </div>
            </div>
            
            <div className="text-xs text-emerald-400">
              * Dedicated helpdesks are set up at Utnoor and Bhadrachalam forest cooperative centers.
            </div>
          </div>

          {/* Form Side */}
          <form onSubmit={handleContactSubmit} className="lg:col-span-7 p-8 sm:p-12 space-y-6">
            <h3 className="text-2xl font-extrabold text-gray-800 font-display">{t('contactTitle')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('contactName')}</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. Raju Mandavi"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('contactEmail')}</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. raju@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('contactMessage')}</label>
              <textarea
                required
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                placeholder="Write your query here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md"
            >
              {isSent ? "Message Sent Successfully! (సంరక్షించబడింది)" : t('contactSend')}
            </button>
          </form>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
