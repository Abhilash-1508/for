import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { CATEGORIES } from '../data/mockData';
import { productsAPI } from '../services/api';
import { MdEdit, MdOutlinePhotoCamera, MdInfo, MdArrowBack } from 'react-icons/md';

const EditProduct = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'honey',
    quantity: '',
    marketPrice: '',
    description: '',
    location: '',
    image: null,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await productsAPI.getById(id);
        if (result.success) {
          const p = result.product;
          setFormData({
            name: p.name,
            category: p.category,
            quantity: p.quantity,
            marketPrice: p.marketPrice || p.market_price,
            description: p.description,
            location: p.location,
            image: p.image || null,
          });
        } else {
          alert('Failed to load product details.');
          navigate('/my-products');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        alert('Failed to load product details.');
        navigate('/my-products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await productsAPI.update(id, {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        marketPrice: parseFloat(formData.marketPrice) || 0,
        description: formData.description,
        location: formData.location,
        image: formData.image,
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate('/my-products');
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again or check connection.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-forest">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Form Content */}
        <main className="flex-1 space-y-6 animate-fade-in">
          <div>
            <button
              onClick={() => navigate('/my-products')}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-green transition-colors mb-4"
            >
              <MdArrowBack className="h-4 w-4" />
              <span>Back to My Products</span>
            </button>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">Edit Product</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">Update your Minor Forest Produce listing</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <span className="text-5xl block animate-bounce">🎉</span>
                <h3 className="font-bold text-lg text-forest-green font-display">Product Updated!</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Your listing has been successfully updated. Redirecting to My Products...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                      placeholder="e.g. Pure Wild Cliff Honey"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all cursor-pointer font-semibold text-gray-700"
                    >
                      {CATEGORIES.filter(cat => cat.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{t(cat.labelKey)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Quantity (in kg/pieces) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                      placeholder="e.g. 50 kg or 200 poles"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Price per unit (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.marketPrice}
                      onChange={(e) => setFormData({ ...formData, marketPrice: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                      placeholder="e.g. 350"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Origin Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                      placeholder="e.g. Gudipadu, Adilabad"
                    />
                  </div>

                  {/* Photo Upload with Preview */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Product Photo
                    </label>
                    <div className="flex items-center gap-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3 text-gray-500">
                      <label className="bg-emerald-50 text-forest-green hover:bg-emerald-100 p-3 rounded-lg text-sm transition-colors flex items-center justify-center cursor-pointer">
                        <MdOutlinePhotoCamera className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, image: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {formData.image ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: null })}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 text-[10px] leading-none"
                            title="Remove Photo"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold">Take a photo using camera or upload a file.</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Description / Processing Details
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                    placeholder="Describe how it was harvested, organic status, sorting, packaging details..."
                  ></textarea>
                </div>

                {/* AI Helper Callout */}
                <div className="p-4 bg-sage-accent/40 rounded-2xl border border-emerald-100/30 flex items-start gap-3">
                  <MdInfo className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-emerald-800 leading-relaxed font-semibold">
                    💡 <strong>Smart Price Helper</strong>: Once you select the product category and fill in the price, our AI module will crosscheck it with regional Minimum Support Price (MSP) regulations and historical trends to guide your negotiation.
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate('/my-products')}
                    className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-forest-green hover:bg-forest-dark text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
                  >
                    <MdEdit className="h-4.5 w-4.5" />
                    <span>Save Changes</span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </main>
      </div>

      <VoiceAssistantWidget />
    </div>
  );
};

export default EditProduct;
