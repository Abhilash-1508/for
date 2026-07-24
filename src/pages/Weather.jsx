import React, { useState, useEffect } from 'react';
import { WEATHER_ADVISORY } from '../data/mockData';
import { weatherAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { MdOpacity, MdAir, MdWarning, MdRefresh } from 'react-icons/md';

const Weather = () => {
  const { t, language } = useLanguage();
  const [weatherData, setWeatherData] = useState(WEATHER_ADVISORY);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('offline');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const result = await weatherAPI.get();
      if (result.success) {
        setWeatherData(result.weather);
        setSource(result.source || 'live');
      }
    } catch {
      // Fallback to mock data
      setWeatherData({
        temp: WEATHER_ADVISORY.temp,
        condition: WEATHER_ADVISORY.condition,
        humidity: WEATHER_ADVISORY.humidity,
        wind: WEATHER_ADVISORY.wind,
        advisory: WEATHER_ADVISORY.advisory,
        forecast: WEATHER_ADVISORY.forecast
      });
      setSource('offline');
    } finally {
      setLoading(false);
    }
  };

  const data = weatherData || {
    temp: WEATHER_ADVISORY.temp,
    condition: WEATHER_ADVISORY.condition,
    humidity: WEATHER_ADVISORY.humidity,
    wind: WEATHER_ADVISORY.wind,
    advisory: WEATHER_ADVISORY.advisory,
    forecast: WEATHER_ADVISORY.forecast
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Weather Portal Content */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800 font-display">{t('weather')} Updates</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Village weather forecasts and agricultural forest gatherer advisories</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                source === 'live' 
                  ? 'bg-emerald-50 text-forest-green border-emerald-100/30' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {source === 'live' ? '🟢 Live Data' : '📶 Cached Data'}
              </span>
              <button
                onClick={fetchWeather}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors"
                title="Refresh weather"
              >
                <MdRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-semibold">Fetching weather data...</p>
            </div>
          ) : (
            /* Main Weather Card & Advisory grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Today's Detailed Weather (Left Side) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
                
                <div className="space-y-1">
                  <span className="bg-emerald-50 text-forest-green font-extrabold text-[9px] px-2.5 py-1 rounded-full border border-emerald-100/30 uppercase tracking-wider">
                    Live Station: Adilabad Forests
                  </span>
                  <h3 className="font-bold text-lg text-gray-800 font-display pt-2">Today's Conditions</h3>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-6xl">🌦️</span>
                  <div>
                    <p className="text-4xl font-black text-gray-800 leading-none">{data.temp}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-1">{data.condition}</p>
                  </div>
                </div>

                {/* Humidity / Wind matrix */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-forest-green rounded-xl">
                      <MdOpacity className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Humidity</p>
                      <p className="text-gray-800">{data.humidity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end text-right">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Wind Speed</p>
                      <p className="text-gray-800">{data.wind}</p>
                    </div>
                    <div className="p-2 bg-emerald-50 text-forest-green rounded-xl">
                      <MdAir className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Advisory Warning & 5-Day Forecast (Right Side) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Regional Advisory warning */}
                <div className="bg-amber-50 rounded-3xl border border-amber-200/50 p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <MdWarning className="h-5 w-5" />
                    <h4 className="font-extrabold text-sm font-display uppercase tracking-wider">Gatherer Advisory Alert</h4>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    {data.advisory?.[language] || data.advisory?.en || 'No advisory available.'}
                  </p>
                </div>

                {/* 5-day Forecast list */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 font-display border-b border-gray-50 pb-2">5-Day Regional Forecast</h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {(data.forecast || []).map((fc, idx) => (
                      <div key={idx} className="space-y-2 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <p className="text-gray-400 font-bold">{fc.day}</p>
                        <span className="text-2xl block">
                          {fc.icon === 'cloud-rain' && '🌧️'}
                          {fc.icon === 'cloud' && '☁️'}
                          {fc.icon === 'sun' && '☀️'}
                          {fc.icon === 'cloud-sun' && '⛅'}
                        </span>
                        <p className="font-extrabold text-gray-800">{fc.temp}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      <VoiceAssistantWidget />
    </div>
  );
};

export default Weather;
