import React, { useState, useEffect } from 'react';
import { WEATHER_ADVISORY } from '../data/mockData';
import { weatherAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  MdOpacity, 
  MdAir, 
  MdWarning, 
  MdRefresh, 
  MdMyLocation, 
  MdSearch, 
  MdLocationOn, 
  MdPushPin, 
  MdDeleteOutline, 
  MdCheck 
} from 'react-icons/md';

// Helper to map Open-Meteo weather codes to condition labels, emojis, and local advisories
const getWeatherCondition = (code) => {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️', advisoryEn: 'Great weather for forest gathering and sun-drying produce.', advisoryTe: 'అటవీ ఉత్పత్తుల సేకరణ మరియు ఎండబెట్టడానికి మంచి వాతావరణం.', advisoryHi: 'वन उपज संग्रह और धूप में सुखाने के लिए बेहतरीन मौसम।' };
  if (code === 1 || code === 2 || code === 3) return { text: 'Partly Cloudy', icon: '⛅', advisoryEn: 'Mild clouds. Good conditions for collection trips.', advisoryTe: 'తేలికపాటి మేఘాలు. సేకరణ ప్రయాణానికి మంచి వాతావరణం.', advisoryHi: 'हल्के बादल। संग्रह यात्रा के लिए अच्छी स्थितियाँ।' };
  if (code === 45 || code === 48) return { text: 'Foggy / Hazy', icon: '🌫️', advisoryEn: 'Reduced visibility. Exercise caution in dense forest areas.', advisoryTe: 'తక్కువ కాంతి. దట్టమైన అటవీ ప్రాంతాలలో జాగ్రత్తగా ఉండండి.', advisoryHi: 'कम दृश्यता। घने वन क्षेत्रों में सावधानी बरतें।' };
  if (code >= 51 && code <= 67) return { text: 'Rain & Drizzle', icon: '🌧️', advisoryEn: 'Rain expected. Keep gathered herbs and MFP covered under tarps.', advisoryTe: 'వర్షం కురిసే అవకాశం ఉంది. సేకరించిన ఉత్పత్తులను బూజు పట్టకుండా కప్పి ఉంచండి.', advisoryHi: 'बारिश की संभावना। एकत्रित जड़ी-बूटियों और वन उपज को तिरपाल से ढककर रखें।' };
  if (code >= 71 && code <= 77) return { text: 'Snow / Cold Snap', icon: '❄️', advisoryEn: 'Cold temperatures. Wear warm protective clothing.', advisoryTe: 'చల్లని ఉష్ణోగ్రతలు. వెచ్చని రక్షణ దుస్తులు ధరించండి.', advisoryHi: 'ठंड का तापमान। गर्म सुरक्षात्मक कपड़े पहनें।' };
  if (code >= 80 && code <= 82) return { text: 'Showers & Heavy Rain', icon: '🌧️', advisoryEn: 'Heavy rain. Avoid stream crossings and low-lying forest paths.', advisoryTe: 'భారీ వర్షం. వాగులు మరియు ల్యాండ్‌స్లైడ్ ప్రాంతాలకు దూరంగా ఉండండి.', advisoryHi: 'भारी बारिश। नदी-नालों और निचले वन मार्गों से बचें।' };
  if (code >= 95) return { text: 'Thunderstorm Alert', icon: '⛈️', advisoryEn: 'Thunderstorm warning! Seek shelter away from tall trees.', advisoryTe: 'ఉరుములు మరియు మెరుపుల హెచ్చరిక! ఎత్తైన చెట్ల కింద నిలబడవద్దు.', advisoryHi: 'गरज के साथ तूफ़ान की चेतावनी! ऊंचे पेड़ों से दूर आश्रय लें।' };
  return { text: 'Scattered Showers', icon: '🌦️', advisoryEn: 'High humidity. Protect harvested goods from moisture.', advisoryTe: 'అధిక తేమ. ఉత్పత్తులను తేమ నుండి రక్షించండి.', advisoryHi: 'उच्च आर्द्रता। कटाई किए गए सामानों को नमी से बचाएं।' };
};

const DEFAULT_TRACKED_LOCATIONS = [
  { id: '1', name: 'Adilabad Forests', region: 'Telangana', lat: 19.08, lon: 78.27, temp: '29°C', icon: '🌦️' },
  { id: '2', name: 'Hyderabad HQ', region: 'Telangana', lat: 17.38, lon: 78.48, temp: '31°C', icon: '☀️' },
  { id: '3', name: 'Utnoor Tribal Belt', region: 'Adilabad', lat: 19.36, lon: 78.78, temp: '28°C', icon: '⛅' },
  { id: '4', name: 'Bhadrachalam Forest', region: 'Bhadradri', lat: 17.67, lon: 80.89, temp: '30°C', icon: '🌦️' }
];

const Weather = () => {
  const { language } = useLanguage();
  
  // Safe initial weather data
  const [weatherData, setWeatherData] = useState(WEATHER_ADVISORY);
  const [locationName, setLocationName] = useState('Secunderabad, Telangana');
  const [coords, setCoords] = useState({ lat: 17.4399, lon: 78.4983 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('live');

  // Tracked locations state (safely initialized from localStorage)
  const [trackedLocations, setTrackedLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_tracked_locations');
      if (!saved) return DEFAULT_TRACKED_LOCATIONS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TRACKED_LOCATIONS;
    } catch {
      return DEFAULT_TRACKED_LOCATIONS;
    }
  });

  // Persist tracked locations
  useEffect(() => {
    try {
      localStorage.setItem('fc_tracked_locations', JSON.stringify(trackedLocations));
    } catch (e) {
      console.warn("Failed to persist tracked locations:", e);
    }
  }, [trackedLocations]);

  // Fetch real-time weather from Open-Meteo API with full fallback
  const fetchRealWeather = async (latitude, longitude, customName = null) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      if (!res.ok) throw new Error('Open-Meteo request failed');
      const data = await res.json();

      if (!data || !data.current) throw new Error('Invalid weather payload');

      const tempVal = Math.round(data.current.temperature_2m ?? 29);
      const feelsLikeVal = Math.round(data.current.apparent_temperature ?? 31);
      const currentHumidity = `${data.current.relative_humidity_2m ?? 80}%`;
      const currentWind = `${Math.round(data.current.wind_speed_10m ?? 12)} km/h`;
      const conditionInfo = getWeatherCondition(data.current.weather_code ?? 0);

      // Build 5-day daily forecast
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecastTimes = data.daily?.time || [];
      const forecastList = forecastTimes.slice(0, 5).map((timeStr, idx) => {
        const dateObj = new Date(timeStr);
        const isValidDate = !isNaN(dateObj.getTime());
        const dayName = idx === 0 ? 'Today' : (isValidDate ? daysOfWeek[dateObj.getDay()] : `Day ${idx + 1}`);
        const maxT = Math.round(data.daily?.temperature_2m_max?.[idx] ?? 30);
        const minT = Math.round(data.daily?.temperature_2m_min?.[idx] ?? 22);
        const code = data.daily?.weather_code?.[idx] ?? 0;
        const cond = getWeatherCondition(code);

        return {
          day: dayName,
          temp: `${maxT}° / ${minT}°`,
          icon: cond.icon === '☀️' ? 'sun' : cond.icon === '⛅' ? 'cloud-sun' : cond.icon === '🌧️' ? 'cloud-rain' : 'cloud'
        };
      });

      // Reverse Geocode Location Name if customName not provided
      let nameToSet = customName;
      if (!nameToSet) {
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const locality = geoData.locality || geoData.city || geoData.principalSubdivision || 'Secunderabad';
            nameToSet = `${locality}, ${geoData.principalSubdivision || 'Telangana'}`;
          }
        } catch {
          nameToSet = `Lat: ${latitude.toFixed(2)}°, Lon: ${longitude.toFixed(2)}°`;
        }
      }

      setLocationName(nameToSet || 'Secunderabad, Telangana');
      setCoords({ lat: latitude, lon: longitude });
      setWeatherData({
        temp: `${tempVal}°C`,
        feelsLike: `${feelsLikeVal}°C`,
        condition: `${conditionInfo.icon} ${conditionInfo.text}`,
        humidity: currentHumidity,
        wind: currentWind,
        advisory: {
          en: conditionInfo.advisoryEn,
          te: conditionInfo.advisoryTe,
          hi: conditionInfo.advisoryHi
        },
        forecast: forecastList.length > 0 ? forecastList : WEATHER_ADVISORY.forecast
      });
      setSource('live');
    } catch (err) {
      console.warn('Live Open-Meteo fetch failed, using fallback:', err);
      try {
        const result = await weatherAPI.get(latitude, longitude);
        if (result && result.success && result.weather) {
          setWeatherData({
            ...WEATHER_ADVISORY,
            ...result.weather
          });
          setSource('live');
        } else {
          setWeatherData(WEATHER_ADVISORY);
          setSource('offline');
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
    if (!navigator.geolocation) {
      fetchRealWeather(17.4399, 78.4983, 'Secunderabad, Telangana');
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
        fetchRealWeather(17.4399, 78.4983, 'Secunderabad, Telangana');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Auto-search dropdown suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data.results) ? data.results : []);
        }
      } catch {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (item) => {
    if (!item) return;
    const label = `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}, ${item.country || ''}`;
    setSearchQuery('');
    setSearchResults([]);
    fetchRealWeather(item.latitude, item.longitude, label);
  };

  const safeLocations = Array.isArray(trackedLocations) ? trackedLocations : DEFAULT_TRACKED_LOCATIONS;
  const currentLocStr = String(locationName || '').toLowerCase();

  const isCurrentlyTracked = safeLocations.some(
    loc => loc.name && (loc.name.toLowerCase().includes(currentLocStr) || currentLocStr.includes(loc.name.toLowerCase()))
  );

  const toggleTrackLocation = () => {
    const nameToTrack = locationName || 'Secunderabad, Telangana';
    if (isCurrentlyTracked) {
      setTrackedLocations(prev => (Array.isArray(prev) ? prev : DEFAULT_TRACKED_LOCATIONS).filter(l => l.name && l.name.toLowerCase() !== nameToTrack.toLowerCase()));
    } else {
      const newLoc = {
        id: `loc_${Date.now()}`,
        name: nameToTrack,
        region: nameToTrack.includes(',') ? nameToTrack.split(',')[1].trim() : 'Tracked',
        lat: coords.lat,
        lon: coords.lon,
        temp: weatherData?.temp || '28°C',
        icon: typeof weatherData?.condition === 'string' ? (weatherData.condition.split(' ')[0] || '🌤️') : '🌤️'
      };
      setTrackedLocations(prev => [newLoc, ...(Array.isArray(prev) ? prev : DEFAULT_TRACKED_LOCATIONS)]);
    }
  };

  const removeTrackedLocation = (idToRemove) => {
    setTrackedLocations(prev => (Array.isArray(prev) ? prev : DEFAULT_TRACKED_LOCATIONS).filter(l => l.id !== idToRemove));
  };

  useEffect(() => {
    fetchRealWeather(17.4399, 78.4983, 'Secunderabad, Telangana');
  }, []);

  const data = weatherData || WEATHER_ADVISORY;
  const currentConditionText = typeof data.condition === 'string' ? data.condition : 'Scattered Showers';
  const conditionEmoji = currentConditionText.includes(' ') && currentConditionText.split(' ')[0].length <= 4
    ? currentConditionText.split(' ')[0]
    : '🌦️';

  const advisoryContent = typeof data.advisory === 'object' && data.advisory !== null
    ? (data.advisory[language] || data.advisory.en || data.advisory.hi || 'Fair weather for forest activity.')
    : (typeof data.advisory === 'string' ? data.advisory : 'Fair weather for forest activity.');

  const forecastItems = Array.isArray(data.forecast) && data.forecast.length > 0
    ? data.forecast
    : WEATHER_ADVISORY.forecast;

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest dark:bg-stone-950">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">

        {/* Sidebar */}
        <Sidebar />

        {/* Weather Portal Content */}
        <main className="flex-1 space-y-6 animate-fade-in">

          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-forest-green dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <MdLocationOn className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>Live Location Weather Engine</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">{locationName}</h2>
                <button
                  onClick={toggleTrackLocation}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isCurrentlyTracked
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-forest-green dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                  }`}
                  title={isCurrentlyTracked ? 'Currently tracked' : 'Pin to tracked locations'}
                >
                  {isCurrentlyTracked ? <MdCheck className="h-4 w-4" /> : <MdPushPin className="h-4 w-4" />}
                  <span>{isCurrentlyTracked ? 'Tracked Location' : 'Track Location'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">
                Check weather anywhere in the world and track live temperatures across your saved locations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={detectUserLocation}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-forest-green dark:text-emerald-300 text-xs font-bold rounded-xl transition-all border border-emerald-100/50 dark:border-emerald-900/50 cursor-pointer"
                title="Detect current GPS location"
              >
                <MdMyLocation className="h-4 w-4" />
                <span>GPS Location</span>
              </button>

              <button
                onClick={() => fetchRealWeather(coords.lat, coords.lon, locationName)}
                className="p-2.5 bg-gray-50 dark:bg-stone-800 hover:bg-gray-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl transition-colors cursor-pointer"
                title="Refresh weather"
              >
                <MdRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <span className={`text-[9px] font-extrabold px-2.5 py-1.5 rounded-full uppercase tracking-wider border ${
                source === 'live'
                  ? 'bg-emerald-50 text-forest-green border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {source === 'live' ? '🟢 Live API' : '📶 Offline Data'}
              </span>
            </div>
          </div>

          {/* Global Search Bar with Live Suggestions */}
          <div className="relative">
            <form onSubmit={(e) => { e.preventDefault(); if (searchResults.length > 0) handleSelectSearchResult(searchResults[0]); }} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MdSearch className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Check temperature anywhere in the world (e.g. London, Tokyo, Adilabad, Hyderabad, Delhi)..."
                  className="w-full bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-forest-green hover:bg-forest-dark text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-sm cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Auto-suggestions dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-xl z-30 overflow-hidden divide-y divide-gray-50 dark:divide-stone-800 animate-fade-in">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-3.5 hover:bg-emerald-50/60 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MdLocationOn className="h-4 w-4 text-forest-green dark:text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{item.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{item.admin1 ? `${item.admin1}, ` : ''}{item.country || ''}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-forest-green dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">View Weather →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tracked Locations Live Monitoring Board */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdPushPin className="h-5 w-5 text-forest-green dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">Tracked Locations Live Temperature Watch</h3>
              </div>
              <span className="text-xs font-bold text-stone-400">{safeLocations.length} locations tracked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {safeLocations.map((loc) => {
                const isSelected = loc.name && (locationName.toLowerCase().includes(loc.name.toLowerCase()) || loc.name.toLowerCase().includes(locationName.toLowerCase()));
                return (
                  <div
                    key={loc.id || loc.name}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-forest-green dark:border-emerald-500 shadow-md ring-2 ring-forest-green/20'
                        : 'bg-gray-50 dark:bg-stone-800/60 hover:bg-white dark:hover:bg-stone-800 border-gray-100 dark:border-stone-800 shadow-sm'
                    }`}
                    onClick={() => fetchRealWeather(loc.lat, loc.lon, loc.name)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">{loc.region || 'Tracked'}</span>
                        <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100 font-display group-hover:text-forest-green dark:group-hover:text-emerald-400 transition-colors">{loc.name}</h4>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeTrackedLocation(loc.id); }}
                        className="text-stone-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove from tracked list"
                      >
                        <MdDeleteOutline className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{loc.icon || '🌤️'}</span>
                        <span className="text-xl font-extrabold text-stone-900 dark:text-white">{loc.temp || '28°C'}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-forest-green dark:text-emerald-400 bg-white dark:bg-stone-900 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900 shadow-2xs">
                        {isSelected ? 'Active' : 'Monitor →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Weather Card & Advisory grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Today's Detailed Weather (Left Side) */}
            <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-sm flex flex-col justify-between space-y-6">

              <div className="space-y-1">
                <span className="bg-emerald-50 dark:bg-emerald-950 text-forest-green dark:text-emerald-300 font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800 uppercase tracking-wider inline-flex items-center gap-1">
                  <MdLocationOn className="h-3.5 w-3.5" />
                  <span>{locationName}</span>
                </span>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white font-display pt-2">Current Temperature & Sky</h3>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-6xl">{conditionEmoji}</span>
                <div>
                  <p className="text-4xl font-black text-stone-900 dark:text-white leading-none">{data.temp || '29°C'}</p>
                  <p className="text-sm font-bold text-stone-600 dark:text-stone-300 mt-1.5">{currentConditionText}</p>
                </div>
              </div>

              {/* Humidity / Wind matrix */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-stone-800 pt-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-forest-green dark:text-emerald-400 rounded-xl">
                    <MdOpacity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 dark:text-stone-400 font-bold uppercase tracking-wider">Relative Humidity</p>
                    <p className="text-stone-900 dark:text-white font-extrabold text-sm">{data.humidity || '80%'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end text-right">
                  <div>
                    <p className="text-[10px] text-stone-400 dark:text-stone-400 font-bold uppercase tracking-wider">Wind Velocity</p>
                    <p className="text-stone-900 dark:text-white font-extrabold text-sm">{data.wind || '14 km/h'}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-forest-green dark:text-emerald-400 rounded-xl">
                    <MdAir className="h-5 w-5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Advisory Warning & 5-Day Forecast (Right Side) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Regional Advisory warning */}
              <div className="bg-amber-50/80 dark:bg-amber-950/40 rounded-3xl border border-amber-200/70 dark:border-amber-900/50 p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <MdWarning className="h-5 w-5" />
                  <h4 className="font-extrabold text-sm font-display uppercase tracking-wider">Live Forest Gatherer Advisory</h4>
                </div>
                <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-semibold">
                  {advisoryContent}
                </p>
              </div>

              {/* 5-day Forecast list */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-stone-900 dark:text-white font-display border-b border-gray-50 dark:border-stone-800 pb-2">5-Day Live Local Forecast</h4>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {forecastItems.map((fc, idx) => (
                    <div key={idx} className="space-y-2 p-2 hover:bg-emerald-50/40 dark:hover:bg-stone-800 rounded-xl transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-stone-700">
                      <p className="text-stone-400 dark:text-stone-400 font-bold">{fc.day || `Day ${idx + 1}`}</p>
                      <span className="text-2xl block">
                        {fc.icon === 'cloud-rain' || fc.icon?.includes('rain') ? '🌧️' :
                         fc.icon === 'sun' || fc.icon?.includes('sun') ? '☀️' :
                         fc.icon === 'cloud-sun' ? '⛅' : '☁️'}
                      </span>
                      <p className="font-extrabold text-stone-800 dark:text-stone-100">{fc.temp || '--'}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Weather;
