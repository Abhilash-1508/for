import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { weatherAPI, schemesAPI, productsAPI } from '../services/api';
import { WEATHER_ADVISORY, SCHEMES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  MdWavingHand, 
  MdCloud, 
  MdTrendingUp, 
  MdGavel, 
  MdStorefront, 
  MdArrowForward,
  MdLocalHospital,
  MdSchool
} from 'react-icons/md';

const Dashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(WEATHER_ADVISORY);
  const [schemes, setSchemes] = useState([]);
  const [activeListingsCount, setActiveListingsCount] = useState(user ? user.activeUploadsCount : 0);

  useEffect(() => {
    if (!user) return;

    const fetchWeather = async () => {
      try {
        const res = await weatherAPI.get();
        if (res.success && res.weather) {
          setWeather(res.weather);
        } else {
          setWeather(WEATHER_ADVISORY);
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setWeather(WEATHER_ADVISORY);
      }
    };

    const fetchSchemes = async () => {
      try {
        const res = await schemesAPI.getAll();
        if (res.success && res.schemes) {
          setSchemes(res.schemes);
        } else {
          setSchemes(SCHEMES);
        }
      } catch (err) {
        console.error('Error fetching schemes:', err);
        setSchemes(SCHEMES);
      }
    };

    const fetchListingsCount = async () => {
      try {
        const res = await productsAPI.getAll();
        if (res.success && res.products) {
          const mine = res.products.filter(p =>
            (p.seller_name || p.sellerName) === user.name ||
            (p.seller_id && String(p.seller_id) === String(user.id))
          );
          setActiveListingsCount(mine.length);
        }
      } catch (err) {
        console.error('Error fetching listings count:', err);
      }
    };

    fetchWeather();
    fetchSchemes();
    fetchListingsCount();
  }, [user]);

  // Redirect if not logged in (hooks must be at top level)
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Dashboard Content */}
        <main className="flex-1 space-y-8 animate-fade-in">
          
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-forest-green text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mt-8 -mr-8"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MdWavingHand className="h-6 w-6 text-amber-300 animate-pulse-soft" />
                  <h2 className="text-xl sm:text-2xl font-extrabold font-display">
                    {t('welcome')}, {user.name}!
                  </h2>
                </div>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium">
                  {t('dashboardTitle')} • {new Date().toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-semibold">
                <span className="text-emerald-200">Active Listings:</span>
                <span className="text-base font-extrabold">{activeListingsCount}</span>
              </div>
            </div>
          </div>

          {/* Grid Layout for Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Widget 1: Today's Weather */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest-green">
                  <MdCloud className="h-5 w-5" />
                  <h3 className="font-bold text-sm font-display uppercase tracking-wider">{t('weatherSummary')}</h3>
                </div>
                <Link to="/weather" className="text-xs text-forest-green hover:underline font-bold flex items-center gap-0.5">
                  <span>Details</span>
                  <MdArrowForward />
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl">🌦️</span>
                <div>
                  <p className="text-2xl font-black text-gray-800">{weather?.temp || '--'}</p>
                  <p className="text-xs font-semibold text-gray-500">{weather?.condition || 'Loading...'}</p>
                </div>
              </div>
              
              <div className="p-3 bg-emerald-50 rounded-2xl text-[10px] text-emerald-950 font-semibold leading-relaxed border border-emerald-100/50">
                ⚠️ {weather?.advisory?.[language] || weather?.advisory?.en || 'Check detailed forecast for advisories.'}
              </div>
            </div>

            {/* Widget 2: AI Price Predictions */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest-green">
                  <MdTrendingUp className="h-5 w-5" />
                  <h3 className="font-bold text-sm font-display uppercase tracking-wider">{t('priceTrend')}</h3>
                </div>
                <Link to="/prediction" className="text-xs text-forest-green hover:underline font-bold flex items-center gap-0.5">
                  <span>Analyze</span>
                  <MdArrowForward />
                </Link>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Wild Honey Price Forecast</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-extrabold text-gray-800">₹380 / kg</p>
                  <span className="text-xs font-extrabold text-forest-green bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/30">+18% expected</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                {t('predictedTrendText')}
              </p>
            </div>

            {/* Widget 3: Eligible Government Schemes */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest-green">
                  <MdGavel className="h-5 w-5" />
                  <h3 className="font-bold text-sm font-display uppercase tracking-wider">{t('schemesSummary')}</h3>
                </div>
                <Link to="/schemes" className="text-xs text-forest-green hover:underline font-bold flex items-center gap-0.5">
                  <span>View All</span>
                  <MdArrowForward />
                </Link>
              </div>

              <div className="space-y-3">
                {schemes.length > 0 ? schemes.slice(0, 2).map((scheme) => (
                  <div key={scheme.id} className="text-xs border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h4 className="font-bold text-gray-800">{language === 'te' ? (scheme.name_local || scheme.nameLocal) : scheme.name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{scheme.eligibility}</p>
                  </div>
                )) : (
                  <div className="text-xs text-gray-500 py-4 text-center">Loading schemes...</div>
                )}
              </div>
            </div>

          </div>

          {/* Quick Access Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-800 font-display">Quick Livelihood Modules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Marketplace */}
              <Link
                to="/marketplace"
                className="bg-white hover:bg-emerald-50/40 p-6 rounded-3xl border border-gray-100 hover:border-emerald-100 shadow-sm flex items-center gap-4 transition-all group"
              >
                <div className="p-3 bg-emerald-100 text-forest-green group-hover:bg-forest-green group-hover:text-white rounded-2xl transition-colors">
                  <MdStorefront className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{t('marketplace')}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Browse & buy minor forest produce</p>
                </div>
              </Link>

              {/* Card 2: AI Price Forecast */}
              <Link
                to="/prediction"
                className="bg-white hover:bg-emerald-50/40 p-6 rounded-3xl border border-gray-100 hover:border-emerald-100 shadow-sm flex items-center gap-4 transition-all group"
              >
                <div className="p-3 bg-emerald-100 text-forest-green group-hover:bg-forest-green group-hover:text-white rounded-2xl transition-colors">
                  <MdTrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{t('pricePrediction')}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">ML price trends & market timing</p>
                </div>
              </Link>

              {/* Card 3: Government Schemes */}
              <Link
                to="/schemes"
                className="bg-white hover:bg-emerald-50/40 p-6 rounded-3xl border border-gray-100 hover:border-emerald-100 shadow-sm flex items-center gap-4 transition-all group"
              >
                <div className="p-3 bg-emerald-100 text-forest-green group-hover:bg-forest-green group-hover:text-white rounded-2xl transition-colors">
                  <MdGavel className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{t('schemes')}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Welfare programs & subsidies</p>
                </div>
              </Link>
              
              {/* Card 4: Weather Updates */}
              <Link
                to="/weather"
                className="bg-white hover:bg-emerald-50/40 p-6 rounded-3xl border border-gray-100 hover:border-emerald-100 shadow-sm flex items-center gap-4 transition-all group"
              >
                <div className="p-3 bg-emerald-100 text-forest-green group-hover:bg-forest-green group-hover:text-white rounded-2xl transition-colors">
                  <MdCloud className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{t('weather')} Updates</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Forecasts & gatherer advisories</p>
                </div>
              </Link>

              {/* Card 5: Healthcare Guidance */}
              <Link
                to="/healthcare"
                className="bg-white hover:bg-emerald-50/40 p-6 rounded-3xl border border-gray-100 hover:border-emerald-100 shadow-sm flex items-center gap-4 transition-all group"
              >
                <div className="p-3 bg-emerald-100 text-forest-green group-hover:bg-forest-green group-hover:text-white rounded-2xl transition-colors">
                  <MdLocalHospital className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{t('healthcare')} Guidance</h4>
                  <p className="text-[10px] text-gray-400 font-medium">First aid & emergency health centers</p>
                </div>
              </Link>

              {/* Card 6: Education & Training */}
              <Link
                to="/education"
                className="bg-white hover:bg-emerald-50/40 p-6 rounded-3xl border border-gray-100 hover:border-emerald-100 shadow-sm flex items-center gap-4 transition-all group"
              >
                <div className="p-3 bg-emerald-100 text-forest-green group-hover:bg-forest-green group-hover:text-white rounded-2xl transition-colors">
                  <MdSchool className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{t('education')} & Training</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Digital literacy & harvest training</p>
                </div>
              </Link>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
