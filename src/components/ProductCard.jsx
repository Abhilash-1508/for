import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MdLocationOn, MdAccountCircle, MdTrendingUp, MdPhone, MdShoppingCart } from 'react-icons/md';
import BuyNowModal from './BuyNowModal';

const ProductCard = ({ product, onBuyNow }) => {
  const { t } = useLanguage();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  if (!product) return null;

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

  const handleBuyClick = () => {
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      setIsBuyModalOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group">
      
      {/* Visual Product representation (SVG gradient or custom user-uploaded image) */}
      <div 
        className={`h-48 relative flex items-center justify-center p-6 text-white overflow-hidden ${!image ? 'bg-gradient-to-br ' + gradient : ''}`}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${image ? 'bg-black/35 group-hover:bg-black/45' : 'opacity-0 group-hover:opacity-100'}`}></div>
        <div className="text-center z-10">
          {!image && (
            <span className="text-4xl filter drop-shadow">
              {category === 'honey' && '🍯'}
              {category === 'bamboo' && '🎋'}
              {category === 'fruits' && '🍒'}
              {category === 'herbs' && '🌿'}
              {category === 'handicrafts' && '🧺'}
            </span>
          )}
          <h4 className="font-bold text-lg mt-2 tracking-tight drop-shadow font-display">{name}</h4>
        </div>
        
        {/* Floating Tag */}
        {product.tag && (
          <span className="absolute top-4 left-4 bg-white/95 text-forest-green font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {product.tag}
          </span>
        )}

        {/* Floating Harvest Month Tag */}
        <span className="absolute top-4 right-4 bg-black/25 text-white backdrop-blur-sm text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {harvestMonth}
        </span>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Seller and Location */}
          <div className="flex items-center justify-between gap-1 text-xs text-gray-500 font-semibold">
            <div className="flex items-center gap-1.5 truncate">
              <MdAccountCircle className="h-4 w-4 text-forest-green flex-shrink-0" />
              <span className="truncate">{sellerName}</span>
            </div>
            <a
              href={`tel:${sellerPhone}`}
              className="text-forest-green hover:bg-emerald-50 p-1 rounded-lg transition-colors flex items-center gap-0.5 text-[10px] font-bold border border-emerald-100/50"
              title={t('contactSeller')}
            >
              <MdPhone className="h-3.5 w-3.5" />
              <span>Call</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <MdLocationOn className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Quantity pill */}
          <div className="pt-1">
            <span className="bg-gray-100 text-gray-700 font-bold text-xs px-2.5 py-1 rounded-lg">
              {t('quantity')}: {quantity}
            </span>
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="bg-sage-accent/40 rounded-2xl p-3 border border-emerald-100/30 grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{t('marketPrice')}</p>
            <p className="text-sm font-extrabold text-gray-700">₹{marketPrice}</p>
          </div>
          <div className="border-l border-emerald-100/50 flex flex-col justify-center items-center">
            <div className="flex items-center gap-0.5 text-forest-green">
              <MdTrendingUp className="h-3.5 w-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-wide">{t('predictedPrice')}</p>
            </div>
            <p className="text-sm font-extrabold text-forest-green">₹{predictedPrice}</p>
          </div>
        </div>

        {/* Dual Action CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/product/${product.id || product._id || product.productId}`}
            className="border border-emerald-300 text-forest-green hover:bg-emerald-50 text-center py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center"
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

      {/* Buy Now Modal */}
      <BuyNowModal
        product={product}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

    </div>
  );
};

export default ProductCard;
