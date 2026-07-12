import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { PRODUCTS } from '../data/mockData';
import { MdEdit as EditIcon, MdDelete as DeleteIcon, MdAddCircle as AddIcon, MdTrendingUp as TrendIcon, MdLocationOn as LocationIcon } from 'react-icons/md';


const MyProducts = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyProducts();
  }, [user]);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const result = await productsAPI.getAll();
      if (result.success && result.products && result.products.length > 0) {
        // Filter products belonging to the current logged-in user
        const mine = result.products.filter(p =>
          (p.seller_name || p.sellerName) === user.name ||
          (p.seller_id && String(p.seller_id) === String(user.id))
        );
        setUserProducts(mine);
      } else {
        // Offline/backend unavailable: show mock data as demo
        setUserProducts(PRODUCTS.slice(0, 2));
      }
    } catch (err) {
      console.error(err);
      // Fallback to demo mock products
      setUserProducts(PRODUCTS.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await productsAPI.delete(id);
        const updated = userProducts.filter(p => p.id !== id);
        setUserProducts(updated);
        if (user) {
          updateProfile({ activeUploadsCount: Math.max(0, user.activeUploadsCount - 1) });
        }
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800 font-display">{t('myProducts')}</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Manage your active forest produce listings</p>
            </div>
            
            <button
              onClick={() => navigate('/add-product')}
              className="flex items-center justify-center gap-1.5 bg-forest-green hover:bg-forest-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              <AddIcon className="h-4.5 w-4.5" />
              <span>{t('addProduct')}</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-semibold">Loading your products...</p>
            </div>
          ) : userProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                  
                  {/* Category, Status & Edit Buttons */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">
                        {product.category === 'honey' && '🍯'}
                        {product.category === 'bamboo' && '🎋'}
                        {product.category === 'fruits' && '🍒'}
                        {product.category === 'herbs' && '🌿'}
                        {product.category === 'handicrafts' && '🧺'}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 font-display">{product.name}</h4>
                        <span className="inline-block bg-emerald-50 text-forest-green font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-emerald-100/30 uppercase mt-0.5">
                          Active Listing
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-forest-green border border-gray-100 hover:border-emerald-100 rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 hover:border-red-100 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <DeleteIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Location */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Qty:</span>
                      <span className="text-gray-700">{product.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <LocationIcon className="text-emerald-600 h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-gray-700">{product.location.split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="bg-sage-accent/40 rounded-2xl p-3 border border-emerald-100/30 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">My Price</p>
                      <p className="font-extrabold text-gray-700">₹{product.market_price || product.marketPrice}</p>
                    </div>
                    <div className="border-l border-emerald-100/50 flex flex-col justify-center items-center">
                      <div className="flex items-center gap-0.5 text-forest-green">
                        <TrendIcon className="h-3.5 w-3.5" />
                        <p className="text-[9px] font-bold uppercase tracking-wide">AI Forecast</p>
                      </div>
                      <p className="font-extrabold text-forest-green">₹{product.predicted_price || product.predictedPrice || '-'}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl space-y-4">
              <span className="text-4xl block">🧺</span>
              <h3 className="font-bold text-lg text-gray-700 font-display">No Active Listings</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">You haven't uploaded any forest produce for sale yet.</p>
              <button
                onClick={() => navigate('/add-product')}
                className="mt-2 bg-forest-green hover:bg-forest-dark text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Upload First Product
              </button>
            </div>
          )}

        </main>
      </div>

      <VoiceAssistantWidget />
    </div>
  );
};

export default MyProducts;
