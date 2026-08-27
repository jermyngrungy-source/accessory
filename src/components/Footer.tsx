import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, Smartphone, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-12 border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#92400E] text-white flex items-center justify-center font-bold font-brand text-sm shadow-inner">
                AH
              </div>
              <span className="font-brand font-bold text-xl tracking-wider text-white">
                ARTISAN HAVEN
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Handcrafted minimalist leather goods, durable macrame accessories, and direct artisan-to-buyer empowerment in the Philippines.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>BGC, Taguig City, Metro Manila</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                <span>GCash Verified Merchant (+63 917 123 4567)</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="font-serif-display font-bold text-sm text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onNavigate('store')} className="hover:text-amber-400 transition-colors">Catalog & Store</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors">Our Story & Leather</button></li>
              <li><button onClick={() => onNavigate('contacts')} className="hover:text-amber-400 transition-colors">Atelier Contacts</button></li>
              <li><button onClick={() => onNavigate('sitemap')} className="hover:text-amber-400 transition-colors">Directory & Sitemap</button></li>
            </ul>
          </div>

          {/* Artisan & AI (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-serif-display font-bold text-sm text-white uppercase tracking-wider">
              Artisans & Technology
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onNavigate('seller-dashboard')} className="hover:text-amber-400 transition-colors">Seller Dashboard & Payouts</button></li>
              <li><button onClick={() => onNavigate('buyer-dashboard')} className="hover:text-amber-400 transition-colors">Buyer Orders & Receipts</button></li>
              <li><button onClick={() => onNavigate('copywriter')} className="hover:text-amber-400 transition-colors">AI Copywriting Studio</button></li>
              <li><button onClick={() => onNavigate('docs')} className="hover:text-amber-400 transition-colors">Vercel & PayMongo Setup</button></li>
            </ul>
          </div>

          {/* Security & PayMongo (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-serif-display font-bold text-sm text-white uppercase tracking-wider">
              Secure Checkout
            </h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Powered by PayMongo for real-time GCash, Maya, and Visa/Mastercard processing with instant automated webhooks.
            </p>
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center gap-2 text-[11px] text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bank-grade 256-Bit SSL Encryption</span>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Artisan Haven Philippines. All rights reserved. Hand saddle-stitched with honor.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('sitemap')} className="hover:text-stone-300 underline">
              Sitemap
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('docs')} className="hover:text-stone-300 underline">
              Deployment Docs
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
