import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MdClose, MdCheckCircle, MdShoppingCart, MdAccountCircle, MdPhone, MdLocationOn, MdAdd, MdRemove, MdReceipt } from 'react-icons/md';

const BuyNowModal = ({ product, isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.mobile || user.phone || '',
        address: user.village ? `${user.village}, ${user.district || ''}, ${user.state || ''}`.replace(/^,\s*|,\s*$/g, '') : ''
      });
    }
    setQuantity(1);
    setIsSubmitting(false);
    setOrderConfirmed(false);
    setOrderId('');
  }, [product, user, isOpen]);

  if (!isOpen || !product) return null;

  const name = product.name || 'Forest Product';
  const marketPrice = parseFloat(product.marketPrice ?? product.market_price) || 0;
  const sellerName = product.sellerName || product.seller_name || 'Tribal Gatherer';
  const location = product.location || 'Adilabad Forest Region';
  const image = product.image || null;
  const category = product.category || 'honey';
  const gradient = product.gradient || 'from-emerald-500 to-emerald-700';

  const totalPrice = Math.round(marketPrice * quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `FC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderConfirmed(true);
    }, 700);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-forest-green text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <MdShoppingCart className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg font-display">Direct Purchase & Checkout</h3>
              <p className="text-xs text-emerald-100 font-semibold">Buy direct from tribal gatherers with fair trade pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer text-lg font-bold"
            title="Close (✕)"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {orderConfirmed ? (
            <div className="py-8 text-center space-y-5 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-forest-green dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <MdCheckCircle className="w-12 h-12 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-2xl text-gray-800 dark:text-stone-100 font-display">Order Confirmed!</h4>
                <p className="text-xs text-gray-500 font-semibold flex items-center justify-center gap-1 mt-1">
                  <MdReceipt className="text-forest-green" />
                  <span>Order Reference: </span>
                  <span className="font-mono text-forest-green font-black text-sm px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-200">{orderId}</span>
                </p>
              </div>

              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-semibold leading-relaxed max-w-md mx-auto space-y-2 text-left">
                <p className="font-bold border-b border-emerald-200 dark:border-emerald-800 pb-2 flex justify-between">
                  <span>Product: {name}</span>
                  <span className="text-forest-green">₹{totalPrice}</span>
                </p>
                <p>📦 Quantity: <strong>{quantity} unit(s)</strong></p>
                <p>👤 Buyer Name: <strong>{formData.name}</strong> ({formData.phone})</p>
                <p>📍 Delivery Location: <strong>{formData.address}</strong></p>
                <p>🤝 Seller: <strong>{sellerName}</strong> ({location})</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 bg-forest-green hover:bg-forest-dark text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Summary Card */}
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-stone-800 p-4 rounded-2xl border border-gray-100 dark:border-stone-700">
                <div 
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white flex-shrink-0 relative overflow-hidden ${!image ? 'bg-gradient-to-br ' + gradient : ''}`}
                  style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!image && (
                    <span className="text-3xl filter drop-shadow">
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
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-base text-gray-800 dark:text-stone-100 truncate font-display">{name}</h4>
                  <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 mt-1">
                    <MdLocationOn className="h-4 w-4 text-forest-green flex-shrink-0" />
                    <span className="truncate">{sellerName} ({location})</span>
                  </p>
                  <p className="text-xs font-black text-forest-green mt-1">
                    ₹{marketPrice} / unit
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-sage-accent/30 dark:bg-stone-800/60 p-4 rounded-2xl border border-emerald-100/50 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-700 dark:text-stone-200">Select Quantity</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Live price calculation below</p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-1.5 rounded-xl border border-gray-200 dark:border-stone-700 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 text-gray-700 dark:text-stone-200 transition-colors cursor-pointer"
                    title="Decrease Quantity"
                  >
                    <MdRemove className="h-4 w-4" />
                  </button>
                  <span className="font-extrabold text-base text-gray-800 dark:text-stone-100 min-w-[28px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 text-gray-700 dark:text-stone-200 transition-colors cursor-pointer"
                    title="Increase Quantity"
                  >
                    <MdAdd className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="flex justify-between items-center px-5 py-4 bg-forest-green/10 border border-forest-green/20 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-gray-700 dark:text-stone-200 uppercase tracking-wider block">Total Payable</span>
                  <span className="text-[10px] text-gray-500 font-semibold">{quantity} unit(s) × ₹{marketPrice}</span>
                </div>
                <span className="text-2xl font-black text-forest-green">₹{totalPrice}</span>
              </div>

              {/* Customer Checkout Form */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold text-gray-700 dark:text-stone-300 uppercase tracking-wider">Buyer & Delivery Information</p>

                {/* Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MdAccountCircle className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Buyer Full Name *"
                    className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl pl-10 pr-3 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MdPhone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contact Phone Number *"
                    className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl pl-10 pr-3 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none text-gray-400">
                    <MdLocationOn className="h-4 w-4" />
                  </div>
                  <textarea
                    required
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Delivery Address (Village, District, State) *"
                    className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl pl-10 pr-3 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 border border-gray-200 dark:border-stone-700 text-gray-600 dark:text-stone-300 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-forest-green hover:bg-forest-dark disabled:bg-gray-300 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Confirm & Place Order</span>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default BuyNowModal;
