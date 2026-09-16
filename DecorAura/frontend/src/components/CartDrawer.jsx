import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API } from '../services/api';
import ProductImage from './ProductImage';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });

  if (!isCartOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await API.createOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: formData.address,
        items: cartItems.map(i => ({ product_id: i.id, quantity: i.quantity }))
      });
      setOrderComplete(res);
      clearCart();
    } catch {
      alert('Checkout error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-50 shadow-2xl flex flex-col justify-between p-6 md:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ivory-300 pb-4">
            <h3 className="text-2xl font-serif text-charcoal-900">Your Selection</h3>
            <button
              onClick={() => { setIsCartOpen(false); setOrderComplete(null); }}
              className="p-2 rounded-full hover:bg-ivory-200 text-charcoal-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Order Completed View */}
          {orderComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <CheckCircle2 size={56} className="text-bronze-500 mb-4" />
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 mb-1">Order Confirmed</span>
              <h4 className="text-2xl font-serif text-charcoal-900 mb-2">Thank You!</h4>
              <p className="text-xs font-sans text-charcoal-500 mb-6">
                Your order <strong className="text-charcoal-900">{orderComplete.order_number}</strong> has been received and processed into our system.
              </p>
              <button
                onClick={() => { setIsCartOpen(false); setOrderComplete(null); }}
                className="w-full py-3 bg-charcoal-900 text-white rounded-full text-xs font-sans uppercase tracking-widest"
              >
                Back to Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart List */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center text-charcoal-500 text-sm py-12">
                    Your bag is currently empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b border-ivory-200 pb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-ivory-300">
                        <ProductImage src={item.primary_image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-base text-charcoal-900">{item.name}</h4>
                        <div className="text-xs font-serif font-semibold text-charcoal-800">${(Number(item?.price) || 0).toFixed(2)}</div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded bg-ivory-200 text-charcoal-700 hover:bg-ivory-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-sans font-semibold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded bg-ivory-200 text-charcoal-700 hover:bg-ivory-300"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-charcoal-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Summary & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t border-ivory-300 pt-6 space-y-4">
                  <div className="flex justify-between text-sm font-sans text-charcoal-600">
                    <span>Subtotal</span>
                    <span className="font-serif font-semibold text-charcoal-900 text-lg">${(Number(subtotal) || 0).toFixed(2)}</span>
                  </div>

                  {isCheckingOut ? (
                    <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-ivory-300 rounded-xl text-xs"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-ivory-300 rounded-xl text-xs"
                      />
                      <textarea
                        placeholder="Shipping Address"
                        required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white border border-ivory-300 rounded-xl text-xs"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold"
                      >
                        Confirm Order
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full py-3.5 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all"
                    >
                      Proceed to Checkout
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
