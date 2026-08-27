import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Sparkles, CheckCircle2, User, MessageSquare, Send, Tag, Share2 } from 'lucide-react';
import { Product, Review, User as UserType } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddReview: (productId: string, rating: number, title: string, comment: string) => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  reviews,
  onClose,
  onAddToCart,
  onAddReview,
  currentUser,
  onOpenAuth,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  if (!product) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setTimeout(() => {
      onAddReview(product.id, newRating, reviewTitle || 'Handcrafted Excellence', reviewComment);
      setReviewTitle('');
      setReviewComment('');
      setSubmittingReview(false);
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#F9F7F2] max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-black/10 relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black text-white hover:bg-[#5A3E2B] transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 md:p-10 space-y-10">
          
          {/* Top Section: Visuals & Core Specs (Rule of Thirds 2-Column) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Image (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-square overflow-hidden bg-[#E8E4DF] border border-black/10 shadow-sm relative group">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                  {product.category}
                </span>
              </div>

              {/* Artisan Badge */}
              <div className="p-4 bg-white/60 border border-black/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5A3E2B] text-white flex items-center justify-center font-bold font-serif italic text-sm">
                  AH
                </div>
                <div className="text-xs">
                  <span className="text-black/40 block font-bold text-[9px] uppercase tracking-widest">Crafted By Master Artisan</span>
                  <span className="font-bold text-[#2C2C2C] text-sm font-serif italic">{product.sellerName}</span>
                </div>
              </div>
            </div>

            {/* Right Details (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center text-[#5A3E2B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(product.rating)
                            ? 'fill-[#5A3E2B] text-[#5A3E2B]'
                            : 'text-black/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-black/60 uppercase tracking-wider">
                    {product.rating.toFixed(1)} ({productReviews.length} verified reviews)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2C2C2C] leading-tight">
                  {product.title}
                </h1>

                {product.headline && (
                  <p className="text-xs font-semibold text-[#5A3E2B] italic mt-1">
                    "{product.headline}"
                  </p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-4 py-2 border-y border-black/5">
                <span className="text-3xl font-serif italic font-bold text-[#5A3E2B]">
                  ₱{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-black/50 font-medium">
                  {product.inventory > 0 ? (
                    <span className="text-emerald-800 font-semibold text-[11px] uppercase tracking-wider">● In Stock ({product.inventory} pieces ready)</span>
                  ) : (
                    <span className="text-[#5A3E2B] font-semibold text-[11px] uppercase tracking-wider">● Made to Order</span>
                  )}
                </span>
              </div>

              {/* 2-Sentence Product Overview (Durability & Daily Wear Focus) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">
                  Overview & Durability
                </span>
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* 3 Bulleted Feature Highlights */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">
                  Craftsmanship Highlights
                </span>
                <ul className="space-y-1.5 text-xs text-black/80">
                  {product.materials.map((mat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5A3E2B] shrink-0 mt-0.5" />
                      <span><strong>{mat}</strong> — Hand-selected for patina and resilience.</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A3E2B] shrink-0 mt-0.5" />
                    <span><strong>Vibe & Aesthetic:</strong> {product.vibe}</span>
                  </li>
                </ul>
              </div>

              {/* Brief Styling Suggestion */}
              {product.stylingSuggestion && (
                <div className="p-3.5 bg-white/60 border border-black/10 text-xs text-[#2C2C2C] space-y-1">
                  <span className="font-bold block uppercase tracking-widest text-[9px] text-black/40">
                    Artisan Styling Suggestion
                  </span>
                  <p className="text-black/70">{product.stylingSuggestion}</p>
                </div>
              )}

              {/* Quantity & Add to Cart Controls */}
              <div className="pt-3 flex items-center gap-4">
                <div className="flex items-center border border-black/10 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-black/70 hover:text-black font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-[#2C2C2C]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-black/70 hover:text-black font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-6 bg-[#5A3E2B] hover:bg-[#473122] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart (₱{(product.price * quantity).toLocaleString()})</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-black/50 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> PayMongo GCash Protected
                </span>
                <span>•</span>
                <span>30-Day Handcrafted Guarantee</span>
              </div>

            </div>

          </div>

          {/* Bottom Section: Customer Reviews & Rating Form */}
          <div className="pt-8 border-t border-black/5 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif italic font-bold text-[#2C2C2C]">
                  Customer Reviews & Star Ratings
                </h3>
                <p className="text-xs text-black/50">
                  Real feedback from verified handcrafted buyers
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/60 px-4 py-2 border border-black/10">
                <div className="text-2xl font-serif italic font-bold text-[#5A3E2B]">
                  {product.rating.toFixed(1)}
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center text-[#5A3E2B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(product.rating) ? 'fill-[#5A3E2B] text-[#5A3E2B]' : 'text-black/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold">Based on {productReviews.length} reviews</span>
                </div>
              </div>
            </div>

            {/* Write a Review Form */}
            <div className="bg-white/60 p-6 border border-black/10 space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#2C2C2C] flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#5A3E2B]" />
                <span>Write a Product Review</span>
              </h4>

              {showReviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your verified review and star rating have been published.</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Interactive Star Rating Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1.5">
                    Your Rating (Click to set stars):
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-[#5A3E2B] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating || newRating)
                              ? 'fill-[#5A3E2B] text-[#5A3E2B]'
                              : 'text-black/20'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-serif italic font-bold text-[#5A3E2B]">
                      {hoverRating || newRating} Star{hoverRating || newRating > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Exceptional leather feel & patina"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-black/10 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                      Reviewer Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser ? currentUser.name : 'Sofia Ramirez (Verified Buyer)'}
                      className="w-full text-xs p-2.5 bg-black/5 border border-black/10 text-black/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Your Honest Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the craftsmanship, stitching, materials, and how it holds up in daily wear..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 focus:outline-none focus:border-black text-[#2C2C2C]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {!currentUser && (
                    <span className="text-[10px] uppercase tracking-wider text-black/50">
                      Posting as guest • <button type="button" onClick={onOpenAuth} className="text-[#5A3E2B] font-bold underline">Sign in with GCash</button>
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Publishing...' : 'Submit Star Review'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Existing Reviews */}
            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <p className="text-xs text-black/50 italic text-center py-6">
                  Be the first to review this handcrafted piece!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white/60 border border-black/10 space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-xs font-serif italic">
                          {rev.buyerName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#2C2C2C] block font-serif italic">{rev.buyerName}</span>
                          <span className="text-[9px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Verified Handcrafted Purchase
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-[#5A3E2B]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating ? 'fill-[#5A3E2B] text-[#5A3E2B]' : 'text-black/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-[#2C2C2C] pt-1">{rev.title}</h5>
                    <p className="text-xs text-black/70 leading-relaxed">{rev.comment}</p>
                    <span className="text-[9px] uppercase tracking-wider text-black/40 block pt-1 font-bold">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
