import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { productsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { MdSearch, MdSort, MdLocationOn, MdRefresh } from 'react-icons/md';

const Marketplace = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await productsAPI.getAll();
      if (result && result.success && Array.isArray(result.products) && result.products.length > 0) {
        setProducts(result.products);
      } else {
        setProducts(PRODUCTS);
      }
    } catch (error) {
      console.error("Failed to fetch products, using mock data:", error);
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const productsArray = Array.isArray(products) ? products : [];

  // Filter unique locations from products list
  const uniqueLocations = ['all', ...new Set(productsArray.filter(p => p && p.location).map(p => {
    const loc = String(p.location).trim();
    if (!loc) return 'Unknown';
    const parts = loc.split(',').map(s => s.trim());
    return parts[parts.length - 1] || loc;
  }))];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSortOption('default');
  };

  // Filter and Sort Logic
  const filteredProducts = productsArray.filter(product => {
    if (!product) return false;
    const name = product.name || '';
    const desc = product.description || '';
    const seller = product.sellerName || product.seller_name || '';
    const searchTarget = `${name} ${desc} ${seller}`.toLowerCase();
    
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || (product.location && String(product.location).includes(selectedLocation));
    
    return matchesSearch && matchesCategory && matchesLocation;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    const priceA = parseFloat(a.marketPrice || a.market_price) || 0;
    const priceB = parseFloat(b.marketPrice || b.market_price) || 0;
    const predA = parseFloat(a.predictedPrice || a.predicted_price) || 0;
    const predB = parseFloat(b.predictedPrice || b.predicted_price) || 0;

    if (sortOption === 'price-low') {
      return priceA - priceB;
    }
    if (sortOption === 'price-high') {
      return priceB - priceA;
    }
    if (sortOption === 'predicted-high') {
      return predB - predA;
    }
    return 0;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen flex flex-col bg-bg-forest dark:bg-stone-950">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8 overflow-x-hidden">
        
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Marketplace Contents */}
        <main className="flex-1 min-w-0 max-w-full overflow-x-hidden space-y-6 animate-fade-in">
          
          {/* Header Description */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">{t('marketplace')}</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">Direct community trade portal for Minor Forest Produce (MFP)</p>
            </div>
            
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-forest-green dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
            >
              <MdRefresh className="h-4 w-4" />
              <span>Reset Filters</span>
            </button>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-5 shadow-sm space-y-4 w-full">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
              
              {/* Search Field */}
              <div className="relative flex-1 min-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MdSearch className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl pl-11 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder={t('searchPlaceholder')}
                />
              </div>

              {/* Location Select Filter */}
              <div className="relative w-full lg:w-auto min-w-[150px] shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MdLocationOn className="h-5 w-5" />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl pl-11 pr-8 py-3 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all appearance-none"
                >
                  <option value="all">Region: All</option>
                  {uniqueLocations.filter(loc => loc !== 'all').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Price Sort */}
              <div className="relative w-full lg:w-auto min-w-[150px] shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MdSort className="h-5 w-5" />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl pl-11 pr-8 py-3 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all appearance-none"
                >
                  <option value="default">{t('sortBy')}: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="predicted-high">AI Price: Highest</option>
                </select>
              </div>

            </div>

            {/* Category Filter Pills Row */}
            <div className="border-t border-gray-100 dark:border-stone-800 pt-4">
              <div className="flex flex-wrap items-center gap-2 w-full">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === category.id
                        ? 'bg-forest-green text-white shadow-sm'
                        : 'bg-gray-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-gray-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    {t(category.labelKey)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-stone-500 font-semibold">Loading marketplace...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
              {filteredProducts.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl space-y-4 p-6 shadow-sm">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 font-display">No Products Found</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">{t('noProducts')}</p>
              <button
                onClick={handleResetFilters}
                className="mt-2 bg-emerald-50 text-forest-green dark:bg-emerald-950 dark:text-emerald-300 hover:bg-forest-green hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-emerald-100/50 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Marketplace;
