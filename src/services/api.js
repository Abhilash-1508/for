/**
 * ForestConnect AI — API Service Layer
 * Axios-based service for communicating with the Flask backend.
 * Includes offline queue support using localStorage.
 */

import axios from 'axios';
import { PRODUCTS } from '../data/mockData';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) 
  ? import.meta.env.VITE_API_BASE 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 3000, // Reduced from 10s to 3s for faster offline fallback
  headers: { 'Content-Type': 'application/json' }
});

// ─── Auth Token Management ────────────────────────────────

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('fc_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('fc_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Restore token on module load
const savedToken = localStorage.getItem('fc_token');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

// ─── Offline Queue ────────────────────────────────────────

const OFFLINE_QUEUE_KEY = 'fc_offline_queue';

const getOfflineQueue = () => {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  } catch { return []; }
};

const addToOfflineQueue = (request) => {
  const queue = getOfflineQueue();
  queue.push({ ...request, timestamp: Date.now() });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const syncOfflineQueue = async () => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  const failed = [];
  for (const req of queue) {
    try {
      await api({ method: req.method, url: req.url, data: req.data });
    } catch {
      failed.push(req);
    }
  }
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failed));
  return { synced: queue.length - failed.length, failed: failed.length };
};

// ─── Cached Responses for Offline Fallback ────────────────

const CACHE_PREFIX = 'fc_cache_';

const cacheResponse = (key, data) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* localStorage full */ }
};

const getCachedResponse = (key) => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_PREFIX + key));
    return cached ? cached.data : null;
  } catch { return null; }
};

// ─── API Wrapper with Offline Fallback ────────────────────

const apiCall = async (method, url, data = null, cacheKey = null) => {
  try {
    const response = await api({ method, url, data });
    if (cacheKey) cacheResponse(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Treat network error / connection refused / timeout (no response) as offline
    const isOffline = !navigator.onLine || !error.response;

    // If offline and we have cached data, return it
    if (isOffline && cacheKey) {
      const cached = getCachedResponse(cacheKey);
      if (cached) return { ...cached, _fromCache: true };
    }

    // If it's a POST/PUT/DELETE and we're offline, queue it
    if (isOffline && ['post', 'put', 'delete'].includes(method.toLowerCase())) {
      addToOfflineQueue({ method, url, data });
      return { success: true, _queued: true, message: 'Request queued for sync' };
    }

    throw error;
  }
};

// ═══════════════════════════════════════════════════════════
//  AUTH API
// ═══════════════════════════════════════════════════════════

export const authAPI = {
  login: async (identifier, password) => {
    const result = await apiCall('post', '/auth/login', { identifier, password });
    if (result.success && result.token) {
      setAuthToken(result.token);
    }
    return result;
  },

  register: async (formData) => {
    const result = await apiCall('post', '/auth/register', formData);
    if (result.success && result.token) {
      setAuthToken(result.token);
    }
    return result;
  },

  updateProfile: async (data) => {
    return await apiCall('put', '/auth/profile', data);
  },

  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('fc_user');
  }
};

// ═══════════════════════════════════════════════════════════
//  PRODUCTS API
// ═══════════════════════════════════════════════════════════

export const productsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await apiCall('get', `/products?${params}`, null, 'products');
  },

  getById: async (productId) => {
    try {
      const res = await apiCall('get', `/products/${productId}`, null, `product_${productId}`);
      if (res && res.success && res.product) return res;
    } catch (e) {
      console.warn(`Failed to fetch product ${productId} from backend, attempting offline fallback:`, e);
    }

    // Fallback: search cached products in localStorage or static mock data
    const cleanId = String(productId);
    const cached = getCachedResponse('products');
    const cachedList = (cached && Array.isArray(cached.products)) ? cached.products : [];
    
    const allProducts = [...cachedList, ...PRODUCTS];
    const found = allProducts.find(p => {
      if (!p) return false;
      const pid = String(p.id || p._id || '');
      return pid === cleanId || pid.replace('p', '') === cleanId.replace('p', '');
    });

    if (found) {
      return { success: true, product: found, _fromFallback: true };
    }

    return { success: false, message: 'Product not found' };
  },

  add: async (productData) => {
    const result = await apiCall('post', '/products', productData);
    
    // Update local cache of products so it is synchronized immediately
    if (result.success || result._queued) {
      let cached = getCachedResponse('products');
      if (!cached) {
        cached = { success: true, products: [] };
      }
      if (cached && Array.isArray(cached.products)) {
        let currentUser = null;
        try {
          currentUser = JSON.parse(localStorage.getItem('fc_user'));
        } catch {}
        
        const newProduct = {
          id: result.productId ? `p${result.productId}` : `p_temp_${Date.now()}`,
          name: productData.name,
          category: productData.category,
          sellerName: currentUser ? currentUser.name : 'Raju Mandavi',
          sellerPhone: currentUser ? currentUser.mobile : '',
          seller_id: currentUser ? currentUser.id : null,
          location: productData.location || (currentUser ? `${currentUser.village}, ${currentUser.district}` : ''),
          quantity: productData.quantity,
          marketPrice: productData.marketPrice,
          predictedPrice: productData.predictedPrice || Math.round(productData.marketPrice * 1.15),
          description: productData.description || '',
          gradient: productData.gradient || (
            productData.category === 'honey' ? 'from-amber-400 to-amber-600' :
            productData.category === 'bamboo' ? 'from-green-500 to-emerald-700' :
            productData.category === 'fruits' ? 'from-lime-400 to-lime-600' :
            productData.category === 'herbs' ? 'from-emerald-800 to-teal-950' : 'from-emerald-500 to-emerald-700'
          ),
          tag: result._queued ? 'Offline Pending' : 'New Listing',
          harvestMonth: productData.harvestMonth || 'July',
          expectedDemand: 'Medium',
          image: productData.image || null
        };
        cached.products = [newProduct, ...cached.products];
        try {
          cacheResponse('products', cached);
        } catch (e) {
          console.warn('LocalStorage full, skipping cache for large image product:', e);
        }
      }
    }
    return result;
  },

  update: async (productId, productData) => {
    return await apiCall('put', `/products/${productId}`, productData);
  },

  delete: async (productId) => {
    const cleanId = String(productId);
    const result = await apiCall('delete', `/products/${cleanId}`);
    
    // Update local products cache immediately
    let cached = getCachedResponse('products');
    if (cached && Array.isArray(cached.products)) {
      cached.products = cached.products.filter(p => String(p.id) !== cleanId);
      try {
        cacheResponse('products', cached);
      } catch {}
    }
    return result;
  }
};

// ═══════════════════════════════════════════════════════════
//  SCHEMES API
// ═══════════════════════════════════════════════════════════

export const schemesAPI = {
  getAll: async (occupation = 'all', state = 'all') => {
    return await apiCall('get', `/schemes?occupation=${occupation}&state=${state}`, null, 'schemes');
  }
};

// ═══════════════════════════════════════════════════════════
//  PREDICTION API
// ═══════════════════════════════════════════════════════════

export const predictionAPI = {
  predict: async (productType, quantity, month) => {
    return await apiCall('post', '/predict', { productType, quantity, month });
  }
};

// ═══════════════════════════════════════════════════════════
//  WEATHER API
// ═══════════════════════════════════════════════════════════

export const getWeatherCondition = (code) => {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️', advisoryEn: 'Great weather for forest gathering and sun-drying produce.', advisoryTe: 'అటవీ ఉత్పత్తుల సేకరణ మరియు ఎండబెట్టడానికి మంచి వాతావరణం.' };
  if (code === 1 || code === 2 || code === 3) return { text: 'Partly Cloudy', icon: '⛅', advisoryEn: 'Mild clouds. Good conditions for collection trip.', advisoryTe: 'తేలికపాటి మేఘాలు. సేకరణ ప్రయాణానికి మంచి వాతావరణం.' };
  if (code === 45 || code === 48) return { text: 'Foggy / Hazy', icon: '🌫️', advisoryEn: 'Reduced visibility. Exercise caution in dense forest areas.', advisoryTe: 'తక్కువ కాంతి. దట్టమైన అటవీ ప్రాంతాలలో జాగ్రత్తగా ఉండండి.' };
  if (code >= 51 && code <= 67) return { text: 'Rain & Drizzle', icon: '🌧️', advisoryEn: 'Rain expected. Keep gathered herbs and produce covered.', advisoryTe: 'వర్షం కురిసే అవకాశం ఉంది. సేకరించిన ఉత్పత్తులను కప్పి ఉంచండి.' };
  if (code >= 71 && code <= 77) return { text: 'Snow / Cold Snap', icon: '❄️', advisoryEn: 'Cold temperatures. Wear warm protective clothing.', advisoryTe: 'చల్లని ఉష్ణోగ్రతలు. వెచ్చని రక్షణ దుస్తులు ధరించండి.' };
  if (code >= 80 && code <= 82) return { text: 'Showers & Heavy Rain', icon: '🌧️', advisoryEn: 'Heavy rain. Avoid stream crossings and low-lying forest paths.', advisoryTe: 'భారీ వర్షం. వాగులు మరియు ల్యాండ్‌స్లైడ్ ప్రాంతాలకు దూరంగా ఉండండి.' };
  if (code >= 95) return { text: 'Thunderstorm Alert', icon: '⛈️', advisoryEn: 'Thunderstorm warning! Seek shelter away from tall trees.', advisoryTe: 'ఉరుములు మరియు మెరుపుల హెచ్చరిక! ఎత్తైన చెట్ల కింద నిలబడవద్దు.' };
  return { text: 'Scattered Showers', icon: '🌦️', advisoryEn: 'High humidity. Protect harvested goods from moisture.', advisoryTe: 'అధిక తేమ. ఉత్పత్తులను తేమ నుండి రక్షించండి.' };
};

export const weatherAPI = {
  getLiveOpenMeteo: async (lat = 17.4399, lon = 78.4983) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    );
    if (!res.ok) throw new Error('Open-Meteo request failed');
    const data = await res.json();
    
    const temperature = Math.round(data.current.temperature_2m);
    const feelsLike = Math.round(data.current.apparent_temperature);
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    const conditionObj = getWeatherCondition(data.current.weather_code);

    return {
      success: true,
      weather: {
        temperature,
        temp: `${temperature}°C`,
        feelsLike,
        feelsLikeText: `${feelsLike}°C`,
        humidity,
        humidityText: `${humidity}%`,
        windSpeed,
        wind: `${windSpeed} km/h`,
        condition: `${conditionObj.icon} ${conditionObj.text}`,
        conditionText: conditionObj.text,
        conditionIcon: conditionObj.icon,
        code: data.current.weather_code,
        advisory: {
          en: conditionObj.advisoryEn,
          te: conditionObj.advisoryTe
        }
      }
    };
  },

  get: async (lat = '17.4399', lon = '78.4983') => {
    try {
      const live = await weatherAPI.getLiveOpenMeteo(lat, lon);
      if (live && live.success) return live;
    } catch (e) {
      console.warn('Open-Meteo live fetch failed, using fallback:', e);
    }
    return await apiCall('get', `/weather?lat=${lat}&lon=${lon}`, null, 'weather');
  }
};

// ═══════════════════════════════════════════════════════════
//  HEALTH CHECK
// ═══════════════════════════════════════════════════════════

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 3000 });
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};

export default api;
