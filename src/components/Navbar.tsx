import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu, X, Sparkles, Store, ShieldCheck, Heart, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  onOpenDocs
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'store', label: 'Store Page' },
    { id: 'about', label: 'About Us' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'copywriter', label: 'AI Studio', badge: 'Gemini' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-black/5 transition-all">
      {/* Top Banner */}
      <div className="bg-[#2C2C2C] text-[#F9F7F2] text-[11px] uppercase tracking-[0.12em] py-2 px-4 text-center font-medium flex items-center justify-between border-b border-black/10">
        <div className="hidden sm:block opacity-60 text-[10px] tracking-widest">
          Handcrafted Small-Batch Atelier • Philippines
        </div>
        <div className="flex-1 text-center">
          <span>✨ Nationwide Delivery • Instant <strong>GCash</strong> Checkout via PayMongo</span>
        </div>
        <button
          onClick={onOpenDocs}
          className="text-[#E8E4DF] hover:text-white transition-colors text-[10px] tracking-wider uppercase flex items-center gap-1 font-semibold ml-2 underline underline-offset-2"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vercel & Supabase</span>
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 bg-[#5A3E2B] text-white flex items-center justify-center font-serif italic font-bold text-lg shadow-sm border border-black/10 group-hover:bg-[#473122] transition-colors">
              AH
            </div>
            <div>
              <span className="font-serif italic text-2xl tracking-tight font-bold text-[#2C2C2C] block leading-none">
                Artisan Haven
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-bold block mt-1">
                Handcrafted Minimalist Goods
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[11px] uppercase tracking-[0.15em] font-semibold">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`py-1 transition-all relative whitespace-nowrap cursor-pointer ${
                  currentView === link.id
                    ? 'text-[#2C2C2C] border-b border-black font-bold opacity-100'
                    : 'text-[#2C2C2C] opacity-70 hover:opacity-100 hover:text-[#5A3E2B]'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-[#5A3E2B]/10 text-[#5A3E2B] border border-[#5A3E2B]/20">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Seller Dashboard Link (Accessible or Login Trigger) */}
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView('seller');
                } else {
                  onOpenAuth();
                }
              }}
              className={`py-1 transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'seller'
                  ? 'text-[#2C2C2C] border-b border-black font-bold opacity-100'
                  : 'text-[#2C2C2C] opacity-70 hover:opacity-100 hover:text-[#5A3E2B]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#5A3E2B]" />
              <span>Seller Dashboard</span>
            </button>

            {/* Buyer Orders (Bought History) */}
            {currentUser && (
              <button
                onClick={() => setCurrentView('orders')}
                className={`py-1 transition-all cursor-pointer ${
                  currentView === 'orders'
                    ? 'text-[#2C2C2C] border-b border-black font-bold opacity-100'
                    : 'text-[#2C2C2C] opacity-70 hover:opacity-100 hover:text-[#5A3E2B]'
                }`}
              >
                Bought History
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* User Account / Auth */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView(currentUser.role === 'seller' ? 'seller' : 'orders')}
                  className="flex items-center gap-2 py-1 px-3 border border-black/10 bg-white/60 hover:bg-white transition-all text-[11px] uppercase tracking-wider font-semibold text-[#2C2C2C]"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-black/20"
                  />
                  <span className="hidden lg:inline max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase bg-[#5A3E2B] text-white">
                    {currentUser.role}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="p-2 text-black/50 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-black text-white px-5 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-colors cursor-pointer"
              >
                Login
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-black text-white hover:bg-[#5A3E2B] transition-all shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#5A3E2B] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black/80 hover:text-black"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E7E2D9] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                currentView === link.id ? 'bg-amber-50 text-[#92400E] font-semibold' : 'text-stone-700'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentView('seller');
              } else {
                onOpenAuth();
              }
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-stone-700 flex items-center gap-2"
          >
            <Store className="w-4 h-4 text-amber-700" />
            <span>Seller Dashboard</span>
          </button>
          {currentUser && (
            <button
              onClick={() => {
                setCurrentView('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-stone-700"
            >
              Bought History & Orders
            </button>
          )}
          <button
            onClick={() => {
              onOpenDocs();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-amber-800 bg-amber-50 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Vercel, Supabase & PayMongo Guide</span>
          </button>
        </div>
      )}
    </header>
  );
};
