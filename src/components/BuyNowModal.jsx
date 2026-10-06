import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MdClose, MdCheckCircle, MdShoppingCart, MdAccountCircle, MdPhone, MdLocationOn, MdAdd, MdRemove } from 'react-icons/md';

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
        phone: user.mobile || '',
        address: user.village ? `${user.village}, ${user.district || ''}` : ''
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
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-forest-green text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <MdShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-display">Direct Purchase</h3>
              <p className="text-[10px] text-emerald-100 font-semibold">Buy direct from tribal gatherers with fair pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {orderConfirmed ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-forest-green rounded-full flex items-center justify-center mx-auto shadow-inner">
                <MdCheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xl text-gray-800 font-display">Order Placed Successfully!</h4>
                <p className="text-xs text-gray-500 font-semibold">Order ID: <span className="font-mono text-forest-green font-bold">{orderId}</span></p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 font-semibold leading-relaxed max-w-xs mx-auto">
                🎉 Your order for <strong>{quantity} unit(s)</strong> of <strong>{name}</strong> (₹{totalPrice}) has been registered with {sellerName}.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Summary Card */}
              <div className="flex items-center gap-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div 
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0 relative overflow-hidden ${!image ? 'bg-gradient-to-br ' + gradient : ''}`}
                  style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!image && (
                    <span className="text-2xl filter drop-shadow">
                      {category === 'honey' && '🍯'}
                      {category === 'bamboo' && '🎋'}
                      {category === 'fruits' && '🍒'}
                      {category === 'herbs' && '🌿'}
                      {category === 'handicrafts' && '🧺'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-800 truncate font-display">{name}</h4>
                  <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 mt-0.5">
                    <MdLocationOn className="h-3.5 w-3.5 text-forest-green flex-shrink-0" />
                    <span className="truncate">{sellerName} ({location})</span>
                  </p>
                  <p className="text-xs font-black text-forest-green mt-1">
                    ₹{marketPrice} / unit
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-sage-accent/30 p-4 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-700">Quantity</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Select number of units</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="Decrease Quantity"
                  >
                    <MdRemove className="h-4 w-4" />
                  </button>
                  <span className="font-extrabold text-sm text-gray-800 min-w-[20px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="Increase Quantity"
                  >
                    <MdAdd className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="flex justify-between items-center px-4 py-3 bg-forest-green/5 border border-forest-green/10 rounded-2xl">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Amount</span>
                <span className="text-lg font-black text-forest-green">₹{totalPrice}</span>
              </div>

              {/* Customer Checkout Form */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Delivery Info</p>

                {/* Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MdAccountCircle className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MdPhone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-gray-400">
                    <MdLocationOn className="h-4 w-4" />
                  </div>
                  <textarea
                    required
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Delivery Address (Village, District, State)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-forest-green hover:bg-forest-dark disabled:bg-gray-300 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
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
};

export default BuyNowModal;
