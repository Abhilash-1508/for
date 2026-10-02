import React, { useState, useEffect } from 'react';
import { WEATHER_ADVISORY } from '../data/mockData';
import { weatherAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdOpacity, MdAir, MdWarning, MdRefresh, MdMyLocation, MdSearch, MdLocationOn } from 'react-icons/md';

// Helper to map Open-Meteo weather codes to condition labels and emojis
const getWeatherCondition = (code) => {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️', advisoryEn: 'Great weather for forest gathering and sun-drying produce.', advisoryTe: 'అటవీ ఉత్పత్తుల సేకరణ మరియు ఎండబెట్టడానికి మంచి వాతావరణం.' };
  if (code === 1 || code === 2 || code === 3) return { text: 'Partly Cloudy', icon: '⛅', advisoryEn: 'Mild clouds. Good conditions for collection trip.', advisoryTe: 'తేలికపాటి మేఘాలు. సేకరణ ప్రయాణానికి మంచి వాతావరణం.' };
  if (code === 45 || code === 48) return { text: 'Foggy / Hazy', icon: '🌫️', advisoryEn: 'Reduced visibility. Exercise caution in dense forest areas.', advisoryTe: 'తక్కువ కాంతి. దట్టమైన అటవీ ప్రాంతాలలో జాగ్రత్తగా ఉండండి.' };
  if (code >= 51 && code <= 67) return { text: 'Rain & Drizzle', icon: '🌧️', advisoryEn: 'Rain expected. Keep gathered herbs and MFP covered under tarp.', advisoryTe: 'వర్షం కురిసే అవకాశం ఉంది. సేకరించిన ఉత్పత్తులను బూజు పట్టకుండా కప్పి ఉంచండి.' };
  if (code >= 71 && code <= 77) return { text: 'Snow / Cold Snap', icon: '❄️', advisoryEn: 'Cold temperatures. Wear warm protective clothing.', advisoryTe: 'చల్లని ఉష్ణోగ్రతలు. వెచ్చని రక్షణ దుస్తులు ధరించండి.' };
  if (code >= 80 && code <= 82) return { text: 'Showers & Heavy Rain', icon: '🌧️', advisoryEn: 'Heavy rain. Avoid stream crossings and low-lying forest paths.', advisoryTe: 'భారీ వర్షం. వాగులు మరియు ల్యాండ్‌స్లైడ్ ప్రాంతాలకు దూరంగా ఉండండి.' };
  if (code >= 95) return { text: 'Thunderstorm Alert', icon: '⛈️', advisoryEn: 'Thunderstorm warning! Seek shelter away from tall trees.', advisoryTe: 'ఉరుములు మరియు మెరుపుల హెచ్చరిక! ఎత్తైన చెట్ల కింద నిలబడవద్దు.' };
  return { text: 'Scattered Showers', icon: '🌦️', advisoryEn: 'High humidity. Protect harvested goods from moisture.', advisoryTe: 'అధిక తేమ. ఉత్పత్తులను తేమ నుండి రక్షించండి.' };
};

const Weather = () => {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState(WEATHER_ADVISORY);
  const [locationName, setLocationName] = useState('Detecting current location...');
  const [coords, setCoords] = useState({ lat: 19.08, lon: 78.27 }); // Default Adilabad fallback
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('live');

  // Fetch real-time weather from Open-Meteo API
  const fetchRealWeather = async (latitude, longitude, customName = null) => {
    setLoading(true);
    try {
      // 1. Fetch live weather from Open-Meteo (Free, Global, No API Key needed)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      if (!res.ok) throw new Error('Open-Meteo request failed');
      const data = await res.json();

      const currentTemp = `${Math.round(data.current.temperature_2m)}°C`;
      const currentHumidity = `${data.current.relative_humidity_2m}%`;
      const currentWind = `${Math.round(data.current.wind_speed_10m)} km/h`;
      const conditionInfo = getWeatherCondition(data.current.weather_code);

      // Build 5-day daily forecast
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecastList = (data.daily?.time || []).slice(0, 5).map((timeStr, idx) => {
        const dateObj = new Date(timeStr);
        const dayName = idx === 0 ? 'Today' : daysOfWeek[dateObj.getDay()];
        const maxT = Math.round(data.daily.temperature_2m_max[idx]);
        const minT = Math.round(data.daily.temperature_2m_min[idx]);
        const code = data.daily.weather_code[idx];
        const cond = getWeatherCondition(code);

        return {
          day: dayName,
          temp: `${maxT}° / ${minT}°`,
          icon: cond.icon === '☀️' ? 'sun' : cond.icon === '⛅' ? 'cloud-sun' : cond.icon === '🌧️' ? 'cloud-rain' : 'cloud'
        };
      });

      // 2. Reverse Geocode Location Name if customName not provided
      let nameToSet = customName;
      if (!nameToSet) {
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const locality = geoData.locality || geoData.city || geoData.principalSubdivision || 'Your Location';
            const country = geoData.countryName || 'India';
            nameToSet = `${locality}, ${geoData.principalSubdivision || country}`;
          }
        } catch {
          nameToSet = `Lat: ${latitude.toFixed(2)}°, Lon: ${longitude.toFixed(2)}°`;
        }
      }

      setLocationName(nameToSet || 'Your Current Location');
      setWeatherData({
        temp: currentTemp,
        condition: `${conditionInfo.icon} ${conditionInfo.text}`,
        humidity: currentHumidity,
        wind: currentWind,
        advisory: {
          en: conditionInfo.advisoryEn,
          te: conditionInfo.advisoryTe
        },
        forecast: forecastList
      });
      setSource('live');
    } catch (err) {
      console.warn('Live Open-Meteo fetch failed, using backend/fallback API:', err);
      try {
        const result = await weatherAPI.get(latitude, longitude);
        if (result.success) {
          setWeatherData(result.weather);
          setSource(result.source || 'live');
        }
      } catch {
        setWeatherData(WEATHER_ADVISORY);
        setSource('offline');
      }
    } finally {
      setLoading(false);
    }
  };

  // Detect browser current location via Geolocation API
  const detectUserLocation = () => {
    setLoading(true);
    setLocationStatus('detecting');

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Using Adilabad, Telangana fallback.');
      setLocationName('Adilabad Forests, Telangana');
      fetchRealWeather(19.08, 78.27, 'Adilabad Forests, Telangana');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchRealWeather(latitude, longitude);
      },
      (error) => {
        console.warn('Geolocation permission denied or failed:', error);
        alert('Location access denied or unavailable. Showing weather for Adilabad, Telangana. You can search any city in the search bar!');
        setLocationName('Adilabad Forests, Telangana');
        fetchRealWeather(19.08, 78.27, 'Adilabad Forests, Telangana');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // City Search Handler (Geocode city name via Open-Meteo Geocoding)
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
      if (!res.ok) throw new Error('City geocode failed');
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const city = data.results[0];
        const label = `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}, ${city.country || ''}`;
        setCoords({ lat: city.latitude, lon: city.longitude });
        fetchRealWeather(city.latitude, city.longitude, label);
      } else {
        alert(`City "${searchQuery}" not found. Please try another location name.`);
        setLoading(false);
      }
    } catch {
      alert('Error searching location. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    detectUserLocation();
  }, []);

  const data = weatherData || WEATHER_ADVISORY;

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">

        {/* Sidebar */}
        <Sidebar />

        {/* Weather Portal Content */}
        <main className="flex-1 space-y-6 animate-fade-in">

          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-forest-green font-bold text-xs uppercase tracking-wider mb-1">
                <MdLocationOn className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>Live Location Weather</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 font-display">{locationName}</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Real-time weather forecasts and forest gatherer advisories for your area.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={detectUserLocation}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-forest-green text-xs font-bold rounded-xl transition-all border border-emerald-100/50"
                title="Detect current GPS location"
              >
                <MdMyLocation className="h-4 w-4" />
                <span>GPS Location</span>
              </button>

              <button
                onClick={() => fetchRealWeather(coords.lat, coords.lon, locationName)}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors"
                title="Refresh weather"
              >
                <MdRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <span className={`text-[9px] font-extrabold px-2.5 py-1.5 rounded-full uppercase tracking-wider border ${
                source === 'live'
                  ? 'bg-emerald-50 text-forest-green border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {source === 'live' ? '🟢 Live API' : '📶 Offline Data'}
              </span>
            </div>
          </div>

          {/* City Search Bar */}
          <form onSubmit={handleCitySearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MdSearch className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any city or village (e.g. Hyderabad, Adilabad, Mumbai, Delhi)..."
                className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-forest-green hover:bg-forest-dark text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </form>

          {loading ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 font-semibold">Fetching live local weather data...</p>
            </div>
          ) : (
            /* Main Weather Card & Advisory grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Today's Detailed Weather (Left Side) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">

                <div className="space-y-1">
                  <span className="bg-emerald-50 text-forest-green font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider inline-flex items-center gap-1">
                    <MdLocationOn className="h-3.5 w-3.5" />
                    <span>{locationName}</span>
                  </span>
                  <h3 className="font-bold text-lg text-gray-800 font-display pt-2">Current Temperature & Sky</h3>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-6xl">{data.condition.split(' ')[0] || '🌤️'}</span>
                  <div>
                    <p className="text-4xl font-black text-gray-800 leading-none">{data.temp}</p>
                    <p className="text-sm font-bold text-gray-600 mt-1.5">{data.condition}</p>
                  </div>
                </div>

                {/* Humidity / Wind matrix */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-forest-green rounded-xl">
                      <MdOpacity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Relative Humidity</p>
                      <p className="text-gray-900 font-extrabold text-sm">{data.humidity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end text-right">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Wind Velocity</p>
                      <p className="text-gray-900 font-extrabold text-sm">{data.wind}</p>
                    </div>
                    <div className="p-2 bg-emerald-50 text-forest-green rounded-xl">
                      <MdAir className="h-5 w-5" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Advisory Warning & 5-Day Forecast (Right Side) */}
              <div className="lg:col-span-7 space-y-6">

                {/* Regional Advisory warning */}
                <div className="bg-amber-50/80 rounded-3xl border border-amber-200/70 p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <MdWarning className="h-5 w-5" />
                    <h4 className="font-extrabold text-sm font-display uppercase tracking-wider">Live Forest Gatherer Advisory</h4>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-semibold">
                    {data.advisory?.[language] || data.advisory?.en || 'Fair weather for forest activity.'}
                  </p>
                </div>

                {/* 5-day Forecast list */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 font-display border-b border-gray-50 pb-2">5-Day Live Local Forecast</h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {(data.forecast || []).map((fc, idx) => (
                      <div key={idx} className="space-y-2 p-2 hover:bg-emerald-50/40 rounded-xl transition-colors border border-transparent hover:border-emerald-100">
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
    </div>
  );
};

export default Weather;

