import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Star, Award, Compass } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onExplore: () => void;
  onStartSelling: () => void;
  onOpenProduct: (product: Product) => void;
  featuredProduct: Product | null;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onStartSelling,
  onOpenProduct,
  featuredProduct
}) => {
  const displayProduct = featuredProduct || {
    id: 'prod-1',
    title: 'Minimalist Pueblo Bifold Wallet',
    price: 1850,
    category: 'Wallets & Cardholders',
    headline: 'Italian Badalassi Carlo vegetable leather wallet crafted for everyday perfection.',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80'],
    rating: 5.0,
    reviewCount: 28,
  };

  return (
    <section className="relative overflow-hidden bg-[#F9F7F2] border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Column (7 Columns) - Editorial Hero Text & CTAs */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-black/5">
            {/* Architectural Eyebrow with hairline */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[1px] w-8 bg-black/20"></span>
              <span className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                Handcrafted Minimalist Leather Goods
              </span>
            </div>

            {/* Editorial Display Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic leading-[1.05] tracking-tight text-[#2C2C2C] mb-8 pr-4">
              Timeless quality <br />
              for the <span className="text-[#5A3E2B]">everyday</span>.
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-base sm:text-lg leading-relaxed text-black/70 max-w-lg mb-10">
              Expertly crafted from full-grain Italian and local hides. Discover hand saddle-stitched wallets, waterproof macrame accessories, and open your own artisan atelier with instant PayMongo GCash settlements.
            </p>

            {/* Button Actions */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={onExplore}
                className="bg-[#5A3E2B] text-white px-8 py-4 text-xs uppercase tracking-widest font-bold shadow-xl shadow-[#5A3E2B]/20 hover:bg-[#473122] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onStartSelling}
                className="border border-black px-8 py-4 text-xs uppercase tracking-widest font-bold text-[#2C2C2C] hover:bg-black hover:text-white transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Become a Seller</span>
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metric Hairline Row */}
            <div className="pt-6 border-t border-black/5 grid grid-cols-3 gap-6">
              <div>
                <span className="block text-2xl font-serif italic font-bold text-[#2C2C2C]">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold">Full-Grain Leather</span>
              </div>
              <div>
                <span className="block text-2xl font-serif italic font-bold text-[#2C2C2C]">GCash</span>
                <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold">PayMongo Gateway</span>
              </div>
              <div>
                <span className="block text-2xl font-serif italic font-bold text-[#2C2C2C]">4.95 ★</span>
                <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold">Verified Artisans</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 Columns) - Featured Product & Live Ledger Spotlight */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white/40">
            {/* Top Showcase Area */}
            <div className="p-8 sm:p-10 flex-1">
              <div className="mb-4 flex justify-between items-end">
                <h2 className="text-[10px] uppercase tracking-widest font-black text-black/40">
                  Featured Artisan Spotlight
                </h2>
                <div className="flex text-[#5A3E2B] gap-0.5 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>

              {/* Product Frame */}
              <div
                onClick={() => featuredProduct && onOpenProduct(featuredProduct)}
                className="aspect-4/3 sm:aspect-5/4 bg-[#E8E4DF] relative overflow-hidden group cursor-pointer border border-black/5"
              >
                <img
                  src={displayProduct.images?.[0] || 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80'}
                  alt={displayProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">
                    {displayProduct.category || 'Premium Goods'}
                  </p>
                  <p className="text-xl font-serif italic leading-tight mt-0.5">
                    {displayProduct.title}
                  </p>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="border border-black/10 p-4 bg-white/60">
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">
                    Price
                  </p>
                  <p className="text-xl font-serif italic text-[#5A3E2B] font-bold">
                    ₱{displayProduct.price?.toLocaleString()}
                  </p>
                </div>

                <div
                  onClick={() => featuredProduct && onOpenProduct(featuredProduct)}
                  className="bg-black text-white p-4 flex flex-col justify-center items-center cursor-pointer hover:bg-[#5A3E2B] transition-colors"
                >
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5">
                    Instant Overview
                  </p>
                  <p className="text-[9px] opacity-70 uppercase tracking-wider">
                    GCash & PayMongo
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Live Seller Activity Bar */}
            <div className="border-t border-black/5 p-8 sm:p-10 bg-white/20 flex flex-col justify-end">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-black/40 mb-2">
                    Seller Activity
                  </h3>
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                    <span className="text-xs text-black/80 font-medium">
                      14 Active Small-Batch Orders Today
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-1">
                    Direct Payouts
                  </span>
                  <span className="text-xs font-serif italic text-[#5A3E2B] font-semibold">
                    100% Artisan Settlement
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

