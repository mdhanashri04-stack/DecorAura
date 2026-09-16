import React, { useState } from 'react';
import ProductViewer from '../components/ProductViewer';
import { useCart } from '../context/CartContext';
import { Star, Truck, ShieldCheck, Plus, Minus, ShoppingBag } from 'lucide-react';
import { API } from '../services/api';
import ProductImage from '../components/ProductImage';

export default function Product({ product, onSelectProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });
  const { addToCart, showToast } = useCart();

  if (!product) return <div className="pt-32 text-center">Product loading...</div>;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRev = await API.addReview(product.id, {
        product_id: product.id,
        author_name: reviewForm.author,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      setReviews([newRev, ...reviews]);
      setReviewForm({ author: '', rating: 5, comment: '' });
      showToast('Thank you for your review!');
    } catch {
      setReviews([{ author_name: reviewForm.author, rating: Number(reviewForm.rating), comment: reviewForm.comment }, ...reviews]);
      setReviewForm({ author: '', rating: 5, comment: '' });
      showToast('Review submitted.');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-ivory-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Product Interactive View & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* Left: 3D Product Interactive Canvas */}
          <div>
            {product.is_3d_enabled ? (
              <ProductViewer product={product} />
            ) : (
              <div className="w-full aspect-square rounded-3xl overflow-hidden border border-ivory-300 shadow-sm bg-ivory-200">
                <ProductImage src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Right: Info Details */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-600 mb-2">
              {product.category ? product.category.name : 'Decor'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4 text-sm text-bronze-600">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span>{(Number(product?.rating) || 5.0).toFixed(1)} ({product?.reviews_count || 0} reviews)</span>
            </div>

            <div className="text-3xl font-serif font-semibold text-charcoal-900 mb-6">
              ${(Number(product?.price) || 0).toFixed(2)}
            </div>

            <p className="text-sm font-sans text-charcoal-500 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-ivory-300 mb-8">
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-charcoal-400 block mb-1">Dimensions</span>
                <span className="text-xs font-sans text-charcoal-900 font-medium">{product.dimensions || 'Base 22cm x H 54cm'}</span>
              </div>
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-charcoal-400 block mb-1">Material</span>
                <span className="text-xs font-sans text-charcoal-900 font-medium">{product.material || 'Bronze & Glass'}</span>
              </div>
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-charcoal-400 block mb-1">Availability</span>
                <span className="text-xs font-sans text-green-700 font-medium">{product.availability || 'In Stock'}</span>
              </div>
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-charcoal-400 block mb-1">Shipping</span>
                <span className="text-xs font-sans text-charcoal-900 font-medium">Complimentary Insured</span>
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-ivory-300 rounded-full bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-ivory-200 rounded-full text-charcoal-700"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-sans font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-ivory-200 rounded-full text-charcoal-700"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3.5 px-8 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag size={16} /> Add To Bag
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-ivory-300 pt-16">
          <h2 className="text-3xl font-serif text-charcoal-900 mb-8">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm font-sans text-charcoal-500">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-ivory-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-semibold text-charcoal-900">{r.author_name}</span>
                      <div className="flex text-bronze-500">
                        {[...Array(Math.max(0, Math.min(5, Math.floor(Number(r.rating) || 5))))].map((_, idx) => (
                          <Star key={idx} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-sans text-charcoal-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-8 bg-white rounded-2xl border border-ivory-300 space-y-4">
              <h3 className="text-xl font-serif text-charcoal-900">Write a Review</h3>

              <div>
                <label className="text-xs font-sans font-semibold text-charcoal-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full px-4 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs outline-none focus:border-bronze-500"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-semibold text-charcoal-700 block mb-1">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs outline-none"
                >
                  <option value="5">5 Stars - Exceptional</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Average</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-sans font-semibold text-charcoal-700 block mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs outline-none focus:border-bronze-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
