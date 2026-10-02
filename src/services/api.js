/**
 * ForestConnect AI — API Service Layer
 * Axios-based service for communicating with the Flask backend.
 * Includes offline queue support using localStorage.
 */

import axios from 'axios';

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
    return await apiCall('get', `/products/${productId}`, null, `product_${productId}`);
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

export const weatherAPI = {
  get: async (lat = '19.08', lon = '78.27') => {
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
