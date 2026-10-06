import React, { useState, useEffect } from 'react';
import { WEATHER_ADVISORY } from '../data/mockData';
import { weatherAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdOpacity, MdAir, MdWarning, MdRefresh, MdMyLocation, MdSearch, MdLocationOn, MdPushPin, MdDeleteOutline, MdCheck } from 'react-icons/md';

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

const DEFAULT_TRACKED_LOCATIONS = [
  { id: '1', name: 'Adilabad Forests', region: 'Telangana', lat: 19.08, lon: 78.27, temp: '29°C', icon: '🌦️' },
  { id: '2', name: 'Hyderabad HQ', region: 'Telangana', lat: 17.38, lon: 78.48, temp: '31°C', icon: '☀️' },
  { id: '3', name: 'Utnoor Tribal Belt', region: 'Adilabad', lat: 19.36, lon: 78.78, temp: '28°C', icon: '⛅' },
  { id: '4', name: 'Bhadrachalam Forest', region: 'Bhadradri', lat: 17.67, lon: 80.89, temp: '30°C', icon: '🌦️' }
];

const Weather = () => {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState(WEATHER_ADVISORY);
  const [locationName, setLocationName] = useState('Detecting current location...');
  const [locationStatus, setLocationStatus] = useState('idle');
  const [coords, setCoords] = useState({ lat: 19.08, lon: 78.27 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('live');

  // Tracked locations state (persisted in localStorage)
  const [trackedLocations, setTrackedLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_tracked_locations');
      return saved ? JSON.parse(saved) : DEFAULT_TRACKED_LOCATIONS;
    } catch {
      return DEFAULT_TRACKED_LOCATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fc_tracked_locations', JSON.stringify(trackedLocations));
    } catch {}
  }, [trackedLocations]);

  // Fetch real-time weather from Open-Meteo API
  const fetchRealWeather = async (latitude, longitude, customName = null) => {
    setLoading(true);
    try {
      // 1. Fetch live weather from Open-Meteo (Free, Global, No API Key needed)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      if (!res.ok) throw new Error('Open-Meteo request failed');
      const data = await res.json();

      const tempVal = Math.round(data.current.temperature_2m);
      const feelsLikeVal = Math.round(data.current.apparent_temperature);
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
            const locality = geoData.locality || geoData.city || geoData.principalSubdivision || 'Secunderabad';
            const country = geoData.countryName || 'India';
            nameToSet = `${locality}, ${geoData.principalSubdivision || country}`;
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
          te: conditionInfo.advisoryTe
        },
        forecast: forecastList
      });
      setSource('live');
    } catch (err) {
      console.warn('Live Open-Meteo fetch failed, using fallback:', err);
      try {
        const result = await weatherAPI.get(latitude, longitude);
        if (result && result.success && result.weather) {
          setWeatherData(result.weather);
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
    setLoading(true);
    setLocationStatus('detecting');

    if (!navigator.geolocation) {
      setLocationName('Secunderabad, Telangana');
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
        setLocationName('Secunderabad, Telangana');
        fetchRealWeather(17.4399, 78.4983, 'Secunderabad, Telangana');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-search dropdown suggestions as user types
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
          setSearchResults(data.results || []);
        }
      } catch {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Select a search result
  const handleSelectSearchResult = (item) => {
    const label = `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}, ${item.country || ''}`;
    setSearchQuery('');
    setSearchResults([]);
    fetchRealWeather(item.latitude, item.longitude, label);
  };

  // Toggle tracking for current location
  const isCurrentlyTracked = trackedLocations.some(
    loc => loc.name.toLowerCase() === locationName.toLowerCase() || (Math.abs(loc.lat - coords.lat) < 0.05 && Math.abs(loc.lon - coords.lon) < 0.05)
  );

  const toggleTrackLocation = (nameToTrack = locationName, targetLat = coords.lat, targetLon = coords.lon, tempVal = weatherData?.temp, iconVal = weatherData?.condition?.split(' ')[0] || '🌤️') => {
    if (isCurrentlyTracked) {
      setTrackedLocations(prev => prev.filter(l => l.name.toLowerCase() !== nameToTrack.toLowerCase() && Math.abs(l.lat - targetLat) >= 0.05));
    } else {
      const newLoc = {
        id: `loc_${Date.now()}`,
        name: nameToTrack,
        region: nameToTrack.includes(',') ? nameToTrack.split(',')[1].trim() : 'Tracked',
        lat: targetLat,
        lon: targetLon,
        temp: tempVal || '28°C',
        icon: iconVal
      };
      setTrackedLocations(prev => [newLoc, ...prev]);
    }
  };

  const removeTrackedLocation = (idToRemove) => {
    setTrackedLocations(prev => prev.filter(l => l.id !== idToRemove));
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
                <span>Live Location Weather Engine</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-gray-800 font-display">{locationName}</h2>
                <button
                  onClick={() => toggleTrackLocation()}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isCurrentlyTracked
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-emerald-50 text-forest-green hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title={isCurrentlyTracked ? 'Currently tracked' : 'Pin to tracked locations'}
                >
                  {isCurrentlyTracked ? <MdCheck className="h-4 w-4" /> : <MdPushPin className="h-4 w-4" />}
                  <span>{isCurrentlyTracked ? 'Tracked Location' : 'Track Location'}</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Check weather anywhere in the world and track live temperatures across your saved locations.
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

          {/* Global Search Bar with Live Suggestions */}
          <div className="relative">
            <form onSubmit={(e) => { e.preventDefault(); if (searchResults.length > 0) handleSelectSearchResult(searchResults[0]); }} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MdSearch className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Check temperature anywhere in the world (e.g. London, Tokyo, Adilabad, Hyderabad, Delhi)..."
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all shadow-sm"
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-30 overflow-hidden divide-y divide-gray-50 animate-fade-in">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-3.5 hover:bg-emerald-50/60 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MdLocationOn className="h-4 w-4 text-forest-green" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.admin1 ? `${item.admin1}, ` : ''}{item.country || ''}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-forest-green opacity-0 group-hover:opacity-100 transition-opacity">View Weather →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tracked Locations Live Monitoring Board */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdPushPin className="h-5 w-5 text-forest-green" />
                <h3 className="font-extrabold text-base text-gray-800 font-display">Tracked Locations Live Temperature Watch</h3>
              </div>
              <span className="text-xs font-bold text-gray-400">{trackedLocations.length} locations tracked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trackedLocations.map((loc) => {
                const isSelected = locationName.toLowerCase().includes(loc.name.toLowerCase()) || loc.name.toLowerCase().includes(locationName.toLowerCase());
                return (
                  <div
                    key={loc.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/80 border-forest-green shadow-md ring-2 ring-forest-green/20'
                        : 'bg-gray-50 hover:bg-white border-gray-100 hover:border-emerald-200 shadow-sm'
                    }`}
                    onClick={() => fetchRealWeather(loc.lat, loc.lon, loc.name)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{loc.region}</span>
                        <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors">{loc.name}</h4>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeTrackedLocation(loc.id); }}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove from tracked list"
                      >
                        <MdDeleteOutline className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{loc.icon}</span>
                        <span className="text-xl font-extrabold text-gray-900">{loc.temp}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-forest-green bg-white px-2 py-1 rounded-lg border border-emerald-100 shadow-2xs">
                        {isSelected ? 'Active' : 'Monitor →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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

