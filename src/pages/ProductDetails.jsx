import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AI_PREDICTIONS } from '../data/mockData';
import { productsAPI, predictionAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  MdArrowBack, 
  MdAccountCircle, 
  MdPhone, 
  MdTrendingUp, 
  MdCalendarToday, 
  MdVerified 
} from 'react-icons/md';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiTrend, setAiTrend] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const result = await productsAPI.getById(id);
        if (result.success && result.product) {
          const p = result.product;
          setProduct(p);
          try {
            const predRes = await predictionAPI.predict(p.category || 'honey', 1, p.harvestMonth || 'July');
            if (predRes && predRes.success && predRes.prediction) {
              const pred = predRes.prediction;
              setAiTrend({
                expectedPrice: pred.predicted_price_display || `₹${pred.predicted_price}`,
                bestTime: pred.best_selling_month,
                demandLevel: pred.demand_level,
                historicalData: pred.historical_trend,
                labels: pred.historical_labels
              });
            } else {
              setAiTrend(AI_PREDICTIONS[p.category] || AI_PREDICTIONS.honey);
            }
          } catch {
            setAiTrend(AI_PREDICTIONS[p.category] || AI_PREDICTIONS.honey);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-forest">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center max-w-sm">
            <span className="text-4xl block mb-4">⚠️</span>
            <h3 className="font-bold text-lg text-gray-800 font-display">Product Not Found</h3>
            <p className="text-xs text-gray-500 mt-2">The selected product listing could not be found or has been archived.</p>
            <Link to="/marketplace" className="mt-6 inline-block bg-forest-green hover:bg-forest-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Load the AI price projection configuration for the product category
  const activeAiTrend = aiTrend || AI_PREDICTIONS[product.category] || AI_PREDICTIONS.honey;

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Product Details Content */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          {/* Back Trigger */}
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-green transition-colors"
            >
              <MdArrowBack className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visual Header Image Card (Left side on desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                            {/* Product Visual Card (SVG gradient or custom user-uploaded image) */}
              <div 
                className={`p-8 rounded-3xl text-white relative flex flex-col justify-between min-h-[300px] shadow-md overflow-hidden group ${!product.image ? 'bg-gradient-to-br ' + (product.gradient || 'from-emerald-500 to-emerald-700') : ''}`}
                style={product.image ? { backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                <div className={`absolute inset-0 ${product.image ? 'bg-black/35 group-hover:bg-black/45' : 'bg-white/5'} transition-opacity duration-300`}></div>
                
                {!product.image && (
                  <span className="text-6xl self-start filter drop-shadow z-10">
                    {product.category === 'honey' && '🍯'}
                    {product.category === 'bamboo' && '🎋'}
                    {product.category === 'fruits' && '🍒'}
                    {product.category === 'herbs' && '🌿'}
                    {product.category === 'handicrafts' && '🧺'}
                  </span>
                )}

                <div className="space-y-2 z-10 mt-auto">
                  <span className="bg-white/95 text-forest-green font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm inline-block">
                    {product.tag || 'Active Listing'}
                  </span>
                  <h2 className="text-2xl font-black tracking-tight drop-shadow font-display">{product.name}</h2>
                  <p className="text-emerald-100 text-xs font-bold">{t('quantity')}: {product.quantity}</p>
                </div>
              </div>

              {/* Contact Seller Panel */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MdAccountCircle className="h-5 w-5 text-forest-green" />
                  <h3 className="font-bold text-sm text-gray-800 font-display">Seller Credentials</h3>
                </div>

                <div className="space-y-3 text-xs text-gray-600 font-medium">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      {product.sellerName}
                      <MdVerified className="text-forest-green h-4 w-4" title="Verified Tribal Gatherer" />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Harvest Origin:</span>
                    <span className="font-bold text-gray-800">{product.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contact Number:</span>
                    <span className="font-bold text-forest-green">{product.sellerPhone}</span>
                  </div>
                </div>

                <a
                  href={`tel:${product.sellerPhone}`}
                  className="w-full flex items-center justify-center gap-2 bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3.5 rounded-xl transition-all shadow-sm hover:shadow text-sm"
                >
                  <MdPhone className="h-5 w-5" />
                  <span>{t('buyNow')}</span>
                </a>
              </div>

            </div>

            {/* Description & AI Forecast Charts (Right side on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product Info Description */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-800 font-display">{t('description')}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  {product.description}
                </p>
                <div className="pt-2 border-t border-gray-50 flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1">
                    <MdCalendarToday className="text-forest-green" />
                    <span>Harvest Month: {product.harvestMonth}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdTrendingUp className="text-forest-green" />
                    <span>Expected Demand: {product.expectedDemand}</span>
                  </div>
                </div>
              </div>

              {/* AI Forecast Visual Widget */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-forest-green">
                    <MdTrendingUp className="h-5 w-5" />
                    <h3 className="font-bold text-sm text-gray-800 font-display">AI Price Trend Analytics</h3>
                  </div>
                  <span className="bg-emerald-50 text-forest-green font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100/30">
                    Target: {activeAiTrend.bestTime}
                  </span>
                </div>

                {/* Simulated Pricing Graph using styled Tailwind Div Heights */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-36 pt-6 border-b border-gray-100 px-2">
                    {activeAiTrend.historicalData.map((val, idx) => {
                      // Calculate height percentage based on max value in list
                      const maxVal = Math.max(...activeAiTrend.historicalData);
                      const heightPercent = (val / maxVal) * 100;
                      const isTarget = idx === activeAiTrend.historicalData.length - 1;

                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 space-y-2 group">
                          {/* Value tooltip */}
                          <span className={`text-[10px] font-extrabold ${isTarget ? 'text-forest-green font-black scale-110' : 'text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                            ₹{val}
                          </span>
                          
                          {/* Column Bar */}
                          <div
                            className={`w-8 rounded-t-lg transition-all duration-500 ${
                              isTarget 
                                ? 'bg-gradient-to-t from-emerald-600 to-forest-green shadow' 
                                : 'bg-gray-100 group-hover:bg-emerald-100'
                            }`}
                            style={{ height: `${heightPercent * 0.8}px` }}
                          ></div>
                          
                          {/* Label */}
                          <span className={`text-[10px] font-bold ${isTarget ? 'text-forest-green font-black' : 'text-gray-500'}`}>
                            {activeAiTrend.labels[idx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Summary Callout Box */}
                  <div className="bg-sage-accent/40 rounded-2xl p-4 border border-emerald-100/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{t('resultExpectedPrice')}</p>
                      <p className="text-base font-black text-gray-800">{activeAiTrend.expectedPrice}</p>
                    </div>
                    <div className="space-y-1 sm:border-l sm:border-emerald-100/50 sm:pl-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{t('resultBestTime')}</p>
                      <p className="text-base font-black text-forest-green">{activeAiTrend.bestTime}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default ProductDetails;
