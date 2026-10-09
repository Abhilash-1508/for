import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MdLocationOn, MdAccountCircle, MdTrendingUp, MdPhone, MdShoppingCart } from 'react-icons/md';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!product) return null;

  const productId = product.id || product._id || product.productId;
  const name = product.name || 'Forest Product';
  const category = product.category || 'honey';
  const sellerName = product.sellerName || product.seller_name || 'Tribal Gatherer';
  const sellerPhone = product.sellerPhone || product.seller_phone || '+91 98480 22310';
  const location = product.location || 'Adilabad Forest Region';
  const quantity = product.quantity || 'Available';
  const marketPrice = product.marketPrice ?? product.market_price ?? 0;
  const predictedPrice = product.predictedPrice ?? product.predicted_price ?? Math.round(marketPrice * 1.15);
  const harvestMonth = product.harvestMonth || product.harvest_month || 'July';
  const image = product.image || null;
  const gradient = product.gradient || 'from-emerald-500 to-emerald-700';

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${productId}?buy=true`);
  };

  const handleDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-full w-full max-w-full group">
      
      {/* Visual Product representation */}
      <div 
        onClick={handleDetailsClick}
        className={`h-48 relative flex items-center justify-center p-6 text-white overflow-hidden cursor-pointer shrink-0 ${!image ? 'bg-gradient-to-br ' + gradient : ''}`}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${image ? 'bg-black/35 group-hover:bg-black/45' : 'opacity-0 group-hover:opacity-100'}`}></div>
        <div className="text-center z-10 px-2">
          {!image && (
            <span className="text-4xl filter drop-shadow">
              {category === 'honey' && '🍯'}
              {category === 'bamboo' && '🎋'}
              {category === 'fruits' && '🍒'}
              {category === 'herbs' && '🌿'}
              {category === 'seeds_gums' && '🌳'}
              {category === 'leaves_fibers' && '🍃'}
              {category === 'handicrafts' && '🧺'}
              {category === 'spices' && '🌶️'}
            </span>
          )}
          <h4 className="font-bold text-base sm:text-lg mt-2 tracking-tight drop-shadow font-display line-clamp-2">{name}</h4>
        </div>
        
        {/* Floating Tag */}
        {product.tag && (
          <span className="absolute top-4 left-4 bg-white/95 text-forest-green font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-20">
            {product.tag}
          </span>
        )}

        {/* Floating Harvest Month Tag */}
        <span className="absolute top-4 right-4 bg-black/30 text-white backdrop-blur-sm text-[10px] font-semibold px-2.5 py-1 rounded-full z-20">
          {harvestMonth}
        </span>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Seller and Location */}
          <div className="flex items-center justify-between gap-1 text-xs text-stone-500 dark:text-stone-400 font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MdAccountCircle className="h-4 w-4 text-forest-green flex-shrink-0" />
              <span className="truncate">{sellerName}</span>
            </div>
            <a
              href={`tel:${sellerPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-forest-green dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 p-1 px-2 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold border border-emerald-100 dark:border-emerald-800 shrink-0"
              title={t('contactSeller')}
            >
              <MdPhone className="h-3.5 w-3.5" />
              <span>Call</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <MdLocationOn className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Quantity pill */}
          <div className="pt-1">
            <span className="bg-gray-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs px-2.5 py-1 rounded-lg inline-block">
              {t('quantity')}: {quantity}
            </span>
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="bg-sage-accent/40 dark:bg-stone-800/60 rounded-2xl p-3 border border-emerald-100/30 dark:border-stone-700 grid grid-cols-2 gap-2 text-center mt-auto">
          <div>
            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('marketPrice')}</p>
            <p className="text-sm font-extrabold text-stone-800 dark:text-stone-200">₹{marketPrice}</p>
          </div>
          <div className="border-l border-emerald-100/50 dark:border-stone-700 flex flex-col justify-center items-center">
            <div className="flex items-center gap-0.5 text-forest-green dark:text-emerald-400">
              <MdTrendingUp className="h-3.5 w-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-wide">{t('predictedPrice')}</p>
            </div>
            <p className="text-sm font-extrabold text-forest-green dark:text-emerald-400">₹{predictedPrice}</p>
          </div>
        </div>

        {/* Dual Action CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/product/${productId}`}
            className="border border-emerald-300 dark:border-emerald-700 text-forest-green dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-center py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center cursor-pointer"
          >
            {t('viewDetails')}
          </Link>
          <button
            type="button"
            onClick={handleBuyClick}
            className="bg-forest-green hover:bg-forest-dark text-white text-center py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1 cursor-pointer"
          >
            <MdShoppingCart className="h-4 w-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
