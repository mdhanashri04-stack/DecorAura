import React, { useState } from 'react';
import { Plus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const HOTSPOT_CONFIGS = [
  {
    id: 'hotspot-aurelia-lamp',
    productId: 'aurelia-lamp',
    top: '42%',
    left: '62.5%'
  },
  {
    id: 'hotspot-luna-vase',
    productId: 'luna-vase',
    top: '64%',
    left: '46%'
  },
  {
    id: 'hotspot-forma-armchair',
    productId: 'forma-armchair',
    top: '76%',
    left: '78%'
  }
];

export default function ShopTheLook({ products = [], onSelectProduct }) {
  const { addToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  const resolvedHotspots = HOTSPOT_CONFIGS.map((config) => {
    const product = (products || []).find(
      (p) => p.slug === config.productId || p.id == config.productId
    );
    return {
      ...config,
      product
    };
  }).filter((spot) => Boolean(spot.product));

  const roomProducts = resolvedHotspots.map((spot) => spot.product);
  const roomProductNames = roomProducts.map((p) => p.name).join(', ');

  const handleAddAllToCart = () => {
    roomProducts.forEach((product) => {
      if (product) addToCart(product, 1);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 3000);
  };

  return (
    <section className="py-24 bg-ivory-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
            Editorial Scene
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-4">SHOP THE LOOK</h2>
          <p className="text-sm font-sans text-charcoal-500">
            Hover or click hotspots across this architectural living room arrangement to explore individual objects.
          </p>
        </div>

        {/* Room Image Container with Hotspots */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-ivory-300">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600"
            alt="Interior Room Hotspots Scene"
            className="w-full max-h-[720px] object-cover"
          />

          {/* Hotspots */}
          {resolvedHotspots.map((spot) => (
            <div
              key={spot.id}
              style={{ top: spot.top, left: spot.left }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-30"
            >
              <div className="w-9 h-9 rounded-full bg-ivory-50/90 border-2 border-bronze-500 flex items-center justify-center cursor-pointer shadow-lg hotspot-pulse transition-transform duration-300 group-hover:scale-110">
                <Plus size={16} className="text-charcoal-900" />
              </div>

              {/* Popover Card */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl glass-card shadow-2xl border border-ivory-300 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-40 text-center">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-bronze-600 block mb-1">
                  {spot.product.category ? spot.product.category.name : 'Decor'}
                </span>
                <h4 className="text-lg font-serif text-charcoal-900 mb-1">{spot.product.name}</h4>
                <div className="text-sm font-serif font-semibold text-charcoal-900 mb-3">
                  ${(Number(spot.product.price) || 0).toFixed(2)}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProduct && onSelectProduct(spot.product)}
                    className="flex-1 py-1.5 px-2 bg-ivory-200 hover:bg-ivory-300 text-charcoal-900 rounded-full text-[11px] font-sans uppercase tracking-wider transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => addToCart(spot.product, 1)}
                    className="flex-1 py-1.5 px-2 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-[11px] font-sans uppercase tracking-wider transition-colors"
                  >
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Bar: SHOP THIS ROOM */}
          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-pill flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <div>
              <h4 className="text-xl font-serif text-charcoal-900">Curated Penthouse Lounge</h4>
              <p className="text-xs font-sans text-charcoal-500">
                Includes {roomProductNames || 'Aurelia Lamp, Luna Terracotta Vase, and Forma Armchair'}.
              </p>
            </div>

            <button
              onClick={handleAddAllToCart}
              className="px-6 py-3 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              {addedAll ? <Check size={16} /> : <ShoppingBag size={16} />}
              {addedAll ? 'Added Room To Bag' : 'SHOP THIS ROOM →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
