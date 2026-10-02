import React, { useState } from 'react';
import { AI_PREDICTIONS } from '../data/mockData';
import { predictionAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdTrendingUp, MdQueryStats, MdInfo, MdAutoGraph } from 'react-icons/md';

const Prediction = () => {
  const { t } = useLanguage();
  
  // Selection states
  const [productType, setProductType] = useState('honey');
  const [quantity, setQuantity] = useState('');
  const [month, setMonth] = useState('July');
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('mock');

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Try real ML API first
      const result = await predictionAPI.predict(productType, parseInt(quantity) || 1, month);
      if (result && result.success && result.prediction) {
        const pred = result.prediction;
        setPredictionResult({
          price: pred.predicted_price_display || `₹${pred.predicted_price}`,
          demand: pred.demand_level,
          bestTime: pred.best_selling_month,
          confidence: pred.confidence_score,
          totalValue: pred.total_estimated_value,
          chartData: pred.historical_trend,
          chartLabels: pred.historical_labels
        });
        setSource('ml');
        setLoading(false);
        return;
      } else {
        throw new Error("Prediction API failed or returned empty data");
      }
    } catch (err) {
      console.warn("Prediction API failed, using local mock fallback:", err);
      // Fall through to mock
    }

    // Fallback: mock prediction
    setTimeout(() => {
      const pred = AI_PREDICTIONS[productType] || AI_PREDICTIONS.honey;
      setPredictionResult({
        price: pred.expectedPrice,
        demand: pred.demandLevel,
        bestTime: pred.bestTime,
        confidence: null,
        totalValue: null,
        chartData: pred.historicalData,
        chartLabels: pred.chartLabels || pred.labels
      });
      setSource('mock');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Prediction Portal Content */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800 font-display">{t('predictTitle')}</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">{t('predictSubtitle')}</p>
            </div>
            {predictionResult && (
              <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                source === 'ml' 
                  ? 'bg-emerald-50 text-forest-green border-emerald-100/30' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {source === 'ml' ? '🤖 ML Model' : '📊 Estimated'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Selection Form (Left/Top) */}
            <form onSubmit={handlePredict} className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 self-start">
              
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <MdQueryStats className="h-5 w-5 text-forest-green" />
                <h3 className="font-bold text-sm text-gray-800 font-display">Predictor Setup</h3>
              </div>

              {/* Product Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('selectProduct')}
                </label>
                <select
                  value={productType}
                  onChange={(e) => {
                    setProductType(e.target.value);
                    setPredictionResult(null);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                >
                  <option value="honey">Wild Forest Honey (అడవి తేనె)</option>
                  <option value="bamboo">Premium Bamboo Poles (వెదురు కర్రలు)</option>
                  <option value="fruits">Amla / Wild Fruits (ఉసిరి)</option>
                  <option value="herbs">Haritaki / Herbs (కరక్కాయ)</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('enterQuantity')}
                </label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. 100"
                />
              </div>

              {/* Month */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {t('selectMonth')}
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              {/* Predict Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-green hover:bg-forest-dark disabled:bg-gray-300 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-sm hover:shadow"
              >
                {loading ? "Running ML Model..." : t('predictBtn')}
              </button>

            </form>

            {/* Results Graph Card (Right/Bottom) */}
            <div className="lg:col-span-7">
              {loading ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                  <h3 className="font-bold text-sm text-gray-600 font-display">Running AI Forecasting Model...</h3>
                  <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">Processing historical GCC pricing matrix, seasonal harvest outputs, and rainfall indices.</p>
                </div>
              ) : predictionResult ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                  
                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-forest-green">
                    <MdTrendingUp className="h-5 w-5" />
                    <h3 className="font-bold text-sm text-gray-800 font-display">Forecasting Model Output</h3>
                  </div>

                  {/* Pricing and demand cards */}
                  <div className={`grid grid-cols-1 ${predictionResult.confidence ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4 text-center`}>
                    
                    <div className="bg-sage-accent/40 rounded-2xl p-4 border border-emerald-100/30 space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('resultExpectedPrice')}</p>
                      <p className="text-base font-black text-gray-800">{predictionResult.price}</p>
                    </div>

                    <div className="bg-sage-accent/40 rounded-2xl p-4 border border-emerald-100/30 space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('resultDemand')}</p>
                      <p className="text-base font-black text-forest-green">{predictionResult.demand}</p>
                    </div>

                    <div className="bg-sage-accent/40 rounded-2xl p-4 border border-emerald-100/30 space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('resultBestTime')}</p>
                      <p className="text-base font-black text-forest-green">{predictionResult.bestTime}</p>
                    </div>

                    {predictionResult.confidence && (
                      <div className="bg-sage-accent/40 rounded-2xl p-4 border border-emerald-100/30 space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Confidence</p>
                        <p className="text-base font-black text-forest-green">{predictionResult.confidence}%</p>
                      </div>
                    )}

                  </div>

                  {/* Total Estimated Value */}
                  {predictionResult.totalValue && (
                    <div className="bg-gradient-to-r from-emerald-800 to-forest-green text-white p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MdAutoGraph className="h-5 w-5 text-emerald-200" />
                        <span className="text-xs font-bold text-emerald-100">Total Estimated Value ({quantity} units)</span>
                      </div>
                      <span className="text-lg font-black">{predictionResult.totalValue}</span>
                    </div>
                  )}

                  {/* Detailed Visual Bar Chart */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-gray-700">
                      {source === 'ml' ? 'Historical Price Trend (ML Training Data)' : '6-Month Price Trajectory Trend'}
                    </h4>
                    <div className="flex items-end justify-between h-36 pt-6 border-b border-gray-100 px-2">
                      {predictionResult.chartData.map((val, idx) => {
                        const maxVal = Math.max(...predictionResult.chartData);
                        const heightPercent = (val / maxVal) * 100;
                        const isTarget = idx === predictionResult.chartData.length - 1;

                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 space-y-2 group">
                            <span className={`text-[9px] font-extrabold ${isTarget ? 'text-forest-green scale-110' : 'text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                              ₹{val}
                            </span>
                            <div
                              className={`w-8 rounded-t-lg transition-all duration-300 ${
                                isTarget 
                                  ? 'bg-gradient-to-t from-emerald-600 to-forest-green' 
                                  : 'bg-gray-100 group-hover:bg-emerald-100'
                              }`}
                              style={{ height: `${heightPercent * 0.8}px` }}
                            ></div>
                            <span className={`text-[9px] font-bold ${isTarget ? 'text-forest-green font-black' : 'text-gray-500'}`}>
                              {predictionResult.chartLabels[idx]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alert disclaimer info */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed font-semibold">
                    <MdInfo className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                    <p>
                      {source === 'ml'
                        ? '* Predictions generated by Random Forest ML model trained on 2+ years of regional GCC data. Confidence score reflects inter-tree variance.'
                        : '* Predictions are indicative estimates based on regional GCC data from Mavala / Adilabad centers. Actual returns depend on quality grading.'}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center space-y-4">
                  <span className="text-5xl block animate-pulse">🤖</span>
                  <h3 className="font-bold text-sm text-gray-700 font-display">Model Ready</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Select the forest product category, volume, and target selling month to run machine learning predictions.
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Prediction;
