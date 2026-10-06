import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AI_PREDICTIONS, PRODUCTS } from '../data/mockData';
import { productsAPI, predictionAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BuyNowModal from '../components/BuyNowModal';
import { 
  MdAccountCircle, 
  MdPhone, 
  MdTrendingUp, 
  MdCalendarToday, 
  MdVerified, 
  MdLocationOn, 
  MdShoppingCart, 
  MdShield, 
  MdCheckCircle,
  MdInfoOutline
} from 'react-icons/md';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiTrend, setAiTrend] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let p = null;
        const result = await productsAPI.getById(id);
        if (result && result.success && result.product) {
          p = result.product;
        } else {
          // Fallback to searching mock PRODUCTS array
          const cleanId = String(id);
          p = PRODUCTS.find(item => {
            const itemId = String(item.id || item._id || '');
            return itemId === cleanId || itemId.replace('p', '') === cleanId.replace('p', '');
          });
        }

        if (p) {
          const normalizedProduct = {
            ...p,
            id: p.id || p._id || id,
            sellerName: p.sellerName || p.seller_name || 'Tribal Gatherer',
            sellerPhone: p.sellerPhone || p.seller_phone || '+91 98480 22310',
            location: p.location || 'Adilabad Forest Region',
            quantity: p.quantity || 'Available',
            marketPrice: parseFloat(p.marketPrice ?? p.market_price) || 0,
            predictedPrice: parseFloat(p.predictedPrice ?? p.predicted_price) || 0,
            harvestMonth: p.harvestMonth || p.harvest_month || 'July',
            expectedDemand: p.expectedDemand || p.expected_demand || 'High',
            description: p.description || 'Organic, ethically collected minor forest produce directly harvested by indigenous tribal communities.',
            tag: p.tag || 'Bulk Available'
          };

          setProduct(normalizedProduct);
          try {
            const predRes = await predictionAPI.predict(normalizedProduct.category || 'honey', 1, normalizedProduct.harvestMonth || 'July');
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
              setAiTrend(AI_PREDICTIONS[normalizedProduct.category] || AI_PREDICTIONS.honey);
            }
          } catch {
            setAiTrend(AI_PREDICTIONS[normalizedProduct.category] || AI_PREDICTIONS.honey);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error in fetchProduct:', err);
        const cleanId = String(id);
        const fallback = PRODUCTS.find(item => {
          const itemId = String(item.id || item._id || '');
          return itemId === cleanId || itemId.replace('p', '') === cleanId.replace('p', '');
        });
        if (fallback) {
          setProduct({
            ...fallback,
            sellerName: fallback.sellerName || fallback.seller_name || 'Tribal Gatherer',
            sellerPhone: fallback.sellerPhone || fallback.seller_phone || '+91 98480 22310',
            harvestMonth: fallback.harvestMonth || fallback.harvest_month || 'July',
            expectedDemand: fallback.expectedDemand || fallback.expected_demand || 'High',
            tag: fallback.tag || 'Bulk Available'
          });
          setAiTrend(AI_PREDICTIONS[fallback.category] || AI_PREDICTIONS.honey);
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-forest dark:bg-stone-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-forest dark:bg-stone-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 text-center max-w-sm shadow-sm">
            <span className="text-4xl block mb-4">🌿</span>
            <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 font-display">Product Listing Not Found</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">The product you are looking for is unavailable or has been archived.</p>
            <button 
              onClick={() => navigate('/marketplace')} 
              className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              ← Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeAiTrend = aiTrend || AI_PREDICTIONS[product.category] || AI_PREDICTIONS.honey;

  // Split name into English title and Telugu/Hindi localized title if enclosed in parentheses
  const rawName = product.name || 'Forest Product';
  let mainTitle = rawName;
  let localTitle = '';
  const parenIndex = rawName.indexOf('(');
  if (parenIndex !== -1) {
    mainTitle = rawName.substring(0, parenIndex).trim();
    localTitle = rawName.substring(parenIndex + 1, rawName.indexOf(')') !== -1 ? rawName.indexOf(')') : rawName.length).trim();
  }

  // Calculate MSP (Minimum Support Price baseline calculation)
  const mspPrice = Math.round(product.marketPrice * 0.82);
  const mspGain = Math.max(0, product.marketPrice - mspPrice);

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Product Details View */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          {/* Requirement explicit Back Button */}
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium mb-2 transition-colors cursor-pointer text-sm"
            >
              ← Back to Marketplace
            </button>
          </div>

          {/* 2-Column Balanced E-Commerce Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Visuals & Direct Action (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Product Visual Card */}
              <div 
                className={`relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 flex flex-col justify-between p-6 min-h-[320px] lg:min-h-[380px] group ${!product.image ? 'bg-gradient-to-br ' + (product.gradient || 'from-emerald-600 to-emerald-900') : ''}`}
                style={product.image ? { backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {/* Background Overlay */}
                <div className={`absolute inset-0 ${product.image ? 'bg-gradient-to-t from-black/85 via-black/40 to-black/20' : 'bg-black/15 group-hover:bg-black/25'} transition-opacity duration-300`}></div>
                
                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="bg-emerald-600/95 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.tag || 'Bulk Available'}
                  </span>
                  <span className="bg-black/40 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <MdLocationOn className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{product.location.split(',')[0]}</span>
                  </span>
                </div>

                {/* Visual Icon (for non-image products) */}
                {!product.image && (
                  <div className="relative z-10 text-6xl my-auto text-center filter drop-shadow-md py-4">
                    {product.category === 'honey' && '🍯'}
                    {product.category === 'bamboo' && '🎋'}
                    {product.category === 'fruits' && '🍒'}
                    {product.category === 'herbs' && '🌿'}
                    {product.category === 'handicrafts' && '🧺'}
                  </div>
                )}

                {/* Bottom Product Info Banner */}
                <div className="relative z-10 mt-auto pt-4 space-y-2">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow font-display">
                      {mainTitle}
                    </h1>
                    {localTitle && (
                      <p className="text-emerald-300 font-bold text-sm tracking-wide mt-0.5">
                        {localTitle}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-lg border border-white/20">
                      {t('quantity')}: {product.quantity}
                    </span>
                    <span className="bg-emerald-500/90 text-white text-xs font-black px-3 py-1 rounded-lg">
                      ₹{product.marketPrice} / unit
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Credentials Card */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
                
                {/* Header with Verified SHG Badge */}
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <MdAccountCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-800 dark:text-stone-100 font-display">Seller Credentials</h3>
                      <p className="text-[10px] text-stone-400 font-semibold">Direct Tribal Gatherer Listing</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                    <MdVerified className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Verified SHG
                  </span>
                </div>

                {/* Credentials Details List */}
                <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 font-semibold">
                  <div className="flex justify-between items-center py-1 border-b border-stone-50 dark:border-stone-800/50">
                    <span className="text-stone-400 font-medium">Gatherer / Representative:</span>
                    <span className="font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                      {product.sellerName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-stone-50 dark:border-stone-800/50">
                    <span className="text-stone-400 font-medium">Village & District:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{product.location}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-stone-50 dark:border-stone-800/50">
                    <span className="text-stone-400 font-medium">Cooperative Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Van Dhan Vikas Kendra (VDVK) Member</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-400 font-medium">Contact Phone:</span>
                    <a href={`tel:${product.sellerPhone}`} className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                      <MdPhone className="h-3.5 w-3.5" />
                      {product.sellerPhone}
                    </a>
                  </div>
                </div>

                {/* Full-width Buy Now Button triggering Fixed Modal */}
                <button
                  type="button"
                  onClick={() => setIsBuyModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm cursor-pointer mt-2"
                >
                  <MdShoppingCart className="h-5 w-5" />
                  <span>Buy Now (Direct Checkout)</span>
                </button>

              </div>

            </div>

            {/* RIGHT COLUMN: Intelligence & Depth (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Product Description & Harvest Timeline Card */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <MdInfoOutline className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-extrabold text-base text-stone-800 dark:text-stone-100 font-display">
                    Product Description & Harvest Timeline
                  </h3>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-semibold">
                  {product.description}
                </p>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700 space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide flex items-center gap-1">
                      <MdCalendarToday className="text-emerald-600 dark:text-emerald-400" /> Harvest Month
                    </p>
                    <p className="text-sm font-extrabold text-stone-800 dark:text-stone-100">{product.harvestMonth}</p>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700 space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide flex items-center gap-1">
                      <MdTrendingUp className="text-emerald-600 dark:text-emerald-400" /> Expected Demand
                    </p>
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{product.expectedDemand}</p>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700 space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide flex items-center gap-1">
                      <MdShield className="text-emerald-600 dark:text-emerald-400" /> Quality Grade
                    </p>
                    <p className="text-sm font-extrabold text-stone-800 dark:text-stone-100">Grade A Organic</p>
                  </div>
                </div>
              </div>

              {/* AI Price Trend & Seasonal Analytics */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <MdTrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-extrabold text-base text-stone-800 dark:text-stone-100 font-display">
                      AI Price Trend & Seasonal Analytics
                    </h3>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                    Peak Window: {activeAiTrend.bestTime}
                  </span>
                </div>

                {/* Styled AI Price Bar Chart */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-40 pt-8 border-b border-stone-100 dark:border-stone-800 px-3">
                    {activeAiTrend.historicalData.map((val, idx) => {
                      const maxVal = Math.max(...activeAiTrend.historicalData);
                      const heightPercent = (val / maxVal) * 100;
                      const isTarget = idx === activeAiTrend.historicalData.length - 1;

                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 space-y-2 group relative">
                          {/* Hover Tooltip */}
                          <span className={`text-[10px] font-black ${isTarget ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-stone-400 dark:text-stone-500'} group-hover:scale-110 transition-transform`}>
                            ₹{val}
                          </span>
                          
                          {/* Column Bar */}
                          <div
                            className={`w-7 sm:w-10 rounded-t-xl transition-all duration-300 ${
                              isTarget 
                                ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-md ring-2 ring-emerald-400/30' 
                                : 'bg-stone-100 dark:bg-stone-800 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40'
                            }`}
                            style={{ height: `${heightPercent * 0.9}px` }}
                          ></div>
                          
                          {/* Month Label */}
                          <span className={`text-[10px] font-bold ${isTarget ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-stone-500 dark:text-stone-400'}`}>
                            {activeAiTrend.labels[idx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Summary Callout Box */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wide">Forecasted Peak Price</p>
                      <p className="text-lg font-black text-stone-800 dark:text-stone-100">{activeAiTrend.expectedPrice}</p>
                    </div>
                    <div className="space-y-1 sm:border-l sm:border-emerald-200 dark:sm:border-emerald-800 sm:pl-4">
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wide">Optimal Selling Window</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{activeAiTrend.bestTime}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Expected Market Price vs Minimum Support Price (MSP) Breakdown */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <MdCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-extrabold text-base text-stone-800 dark:text-stone-100 font-display">
                      Expected Market Price vs Minimum Support Price (MSP)
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    TRIFED Fair Trade Benchmark
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  
                  {/* Current Market Price */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Direct Market Price</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{product.marketPrice}</p>
                    <p className="text-[10px] text-stone-400 font-medium">Per Unit</p>
                  </div>

                  {/* Government MSP Baseline */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Government MSP Baseline</p>
                    <p className="text-xl font-black text-stone-700 dark:text-stone-300">₹{mspPrice}</p>
                    <p className="text-[10px] text-stone-400 font-medium">Floor Rate Protection</p>
                  </div>

                  {/* Value Addition / Tribal Profit Margin */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Gatherer Premium Gain</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">+₹{mspGain}</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">Above Floor Rate (+22%)</p>
                  </div>

                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-2xl text-[11px] text-stone-500 dark:text-stone-400 font-semibold leading-relaxed border border-stone-100 dark:border-stone-800">
                  💡 <strong>Fair Trade Guarantee:</strong> Direct purchase via ForestConnect AI ensures gatherers receive top market value, exceeding official Minimum Support Price (MSP) benchmarks established under the PMVDY scheme.
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Buy Now Checkout Modal Overlay */}
      <BuyNowModal
        product={product}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;

