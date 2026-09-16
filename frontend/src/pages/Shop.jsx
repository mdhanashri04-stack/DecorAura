import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Star } from 'lucide-react';
import { API } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';

export default function Shop({ onSelectProduct, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'Shop | DecorAura';
    async function loadShopData() {
      const cats = await API.getCategories();
      setCategories(cats);
    }
    loadShopData();
  }, []);

  useEffect(() => {
    async function filterProducts() {
      const params = {};
      if (selectedCategory) params.category_slug = selectedCategory;
      if (selectedMaterial) params.material = selectedMaterial;
      if (selectedAvailability) params.availability = selectedAvailability;
      if (maxPrice) params.max_price = maxPrice;
      if (searchQuery) params.search = searchQuery;
      if (sortBy) params.sort_by = sortBy;

      const res = await API.getProducts(params);
      setProducts(res);
    }
    filterProducts();
  }, [selectedCategory, selectedMaterial, selectedAvailability, maxPrice, searchQuery, sortBy]);

  return (
    <div className="pt-28 pb-24 bg-ivory-50 min-h-screen">
      {/* Banner */}
      <div className="bg-ivory-200/60 py-16 text-center border-b border-ivory-300 mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors mb-6"
          >
            ← Back to Home
          </button>
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
            Complete Product Catalogue
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-3">Shop All</h1>
          <p className="text-sm font-sans text-charcoal-500 max-w-md mx-auto">
            Sculptural lighting, elevated accent furniture, tactile stoneware, and architectural mirrors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar Filters */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-300 h-fit sticky top-28 space-y-6">
            <h3 className="text-xl font-serif text-charcoal-900 pb-2 border-b border-ivory-200">Filters</h3>

            {/* Categories */}
            <div>
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-bronze-600 block mb-3">
                Category
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-sans text-charcoal-700 cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="accent-bronze-500"
                  />
                  All Categories
                </label>
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-xs font-sans text-charcoal-700 cursor-pointer">
                    <input
                      type="radio"
                      name="cat"
                      checked={selectedCategory === c.slug}
                      onChange={() => setSelectedCategory(c.slug)}
                      className="accent-bronze-500"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-bronze-600 block mb-3">
                Max Price: ${maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-bronze-500 cursor-pointer"
              />
            </div>

            {/* Material Filter */}
            <div>
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-bronze-600 block mb-3">
                Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full p-2 bg-ivory-100 border border-ivory-300 rounded-xl text-xs text-charcoal-800 outline-none cursor-pointer"
              >
                <option value="">All Materials</option>
                <option value="Bronze">Brushed Bronze</option>
                <option value="Velvet">Italian Velvet</option>
                <option value="Stoneware">Hand-thrown Stoneware</option>
                <option value="Brass">Brushed Brass</option>
                <option value="Clay">High-fired Clay</option>
                <option value="Glass">HD Glass</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-bronze-600 block mb-3">
                Availability
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-sans text-charcoal-700 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === ''}
                    onChange={() => setSelectedAvailability('')}
                    className="accent-bronze-500"
                  />
                  All
                </label>
                <label className="flex items-center gap-2 text-xs font-sans text-charcoal-700 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'In Stock'}
                    onChange={() => setSelectedAvailability('In Stock')}
                    className="accent-bronze-500"
                  />
                  In Stock Only
                </label>
              </div>
            </div>
          </div>

          {/* Main Grid & Toolbar */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-ivory-300">
              <span className="text-xs font-sans text-charcoal-500">
                Showing <strong className="text-charcoal-900">{products.length}</strong> objects
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="text"
                    placeholder="Search objects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-ivory-300 rounded-full text-xs text-charcoal-900 outline-none focus:border-bronze-500"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-ivory-300 rounded-full text-xs text-charcoal-900 outline-none cursor-pointer"
                >
                  <option value="">Sort: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-ivory-300 text-center">
                <p className="text-sm font-sans text-charcoal-500">No objects match your filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-ivory-300 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative aspect-[4/5] bg-ivory-200 overflow-hidden cursor-pointer"
                    >
                      {product.is_3d_enabled && (
                        <span className="absolute top-3 left-3 bg-bronze-500 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                          3D View
                        </span>
                      )}
                      <ProductImage
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-[10px] font-sans uppercase tracking-widest text-charcoal-500 mb-1">
                        {product.category ? product.category.name : 'Decor'}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-lg font-serif text-charcoal-900 hover:text-bronze-600 transition-colors cursor-pointer mb-1"
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-xs text-bronze-600 mb-3">
                        <Star size={12} fill="currentColor" />
                        <span>{(Number(product?.rating) || 5.0).toFixed(1)} ({product?.reviews_count || 12})</span>
                      </div>

                      <div className="mt-auto pt-3 border-t border-ivory-200 flex items-center justify-between">
                        <span className="text-lg font-serif font-semibold text-charcoal-900">
                          ${(Number(product?.price) || 0).toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-2 rounded-full bg-ivory-200 hover:bg-charcoal-900 hover:text-white transition-colors"
                          title="Add to Bag"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
