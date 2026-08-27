import React, { useState } from 'react';
import { X, Smartphone, Mail, Lock, User, Store, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister
      ? { email, password, name, role, gcashNumber, shopName, bio }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Fallback local login simulation if offline
      const mockUser: UserType = {
        id: role === 'seller' ? 'seller-artisan-01' : 'buyer-01',
        email: email || 'mateo.leathercraft@artisan-haven.ph',
        name: name || (role === 'seller' ? 'Mateo Dela Cruz' : 'Sofia Ramirez'),
        role,
        gcashNumber: gcashNumber || '09171234567',
        shopName: role === 'seller' ? shopName || 'Marikina Heirloom Leather' : undefined,
        bio: bio || 'Master leathercraft artisan specializing in vegetable-tanned accessories.',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name || 'Artisan'}`
      };
      onLoginSuccess(mockUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSeller = () => {
    onLoginSuccess({
      id: 'seller-artisan-01',
      name: 'Mateo Dela Cruz',
      email: 'mateo.leathercraft@artisan-haven.ph',
      role: 'seller',
      gcashNumber: '09171234567',
      shopName: 'Marikina Heirloom Leather',
      bio: 'Master leathercraft artisan from Marikina with 14 years of saddle-stitching mastery.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    });
    onClose();
  };

  const handleQuickDemoBuyer = () => {
    onLoginSuccess({
      id: 'buyer-01',
      name: 'Sofia Ramirez',
      email: 'sofia.r@gmail.com',
      role: 'buyer',
      gcashNumber: '09289876543',
      bio: 'Minimalist carry enthusiast and lover of full-grain leather goods.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F9F7F2] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-black/10 space-y-6 relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-black text-white hover:bg-[#5A3E2B] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="w-10 h-10 bg-[#5A3E2B] text-white flex items-center justify-center font-bold font-serif italic text-lg mb-2">
            AH
          </div>
          <h2 className="text-2xl font-serif italic font-bold text-[#2C2C2C]">
            {isRegister ? 'Join Artisan Haven' : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs text-black/60">
            {isRegister
              ? 'Create an artisan seller or buyer account with direct GCash payout support.'
              : 'Access your seller dashboard, sales history, or order tracking.'}
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="p-3.5 bg-white/60 border border-black/10 space-y-2">
          <span className="text-[9px] uppercase font-bold text-black/40 block tracking-widest">
            Quick 1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={handleQuickDemoSeller}
              className="px-2.5 py-2 bg-[#5A3E2B] hover:bg-[#473122] text-white text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Demo Seller</span>
            </button>
            <button
              onClick={handleQuickDemoBuyer}
              className="px-2.5 py-2 bg-black hover:bg-black/80 text-white text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Buyer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <>
              {/* Role Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Account Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-2.5 border text-[10px] uppercase tracking-wider font-bold text-center transition-all cursor-pointer ${
                      role === 'seller' ? 'bg-[#5A3E2B] text-white border-[#5A3E2B]' : 'bg-white text-black/70 border-black/10'
                    }`}
                  >
                    Artisan Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-2.5 border text-[10px] uppercase tracking-wider font-bold text-center transition-all cursor-pointer ${
                      role === 'buyer' ? 'bg-[#5A3E2B] text-white border-[#5A3E2B]' : 'bg-white text-black/70 border-black/10'
                    }`}
                  >
                    Buyer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mateo Dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              {role === 'seller' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Atelier / Shop Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Marikina Heirloom Leather"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-semibold focus:outline-none focus:border-black"
                  />
                </div>
              )}

              {/* GCash Number Input */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1 flex items-center justify-between">
                  <span>GCash Mobile Number *</span>
                  <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">For Direct Payouts</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="09171234567"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/10 text-[#2C2C2C] font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-[#5A3E2B] text-white text-[10px] uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="text-center pt-2 text-xs text-black/50">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegister(false)}
                className="text-[#5A3E2B] font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to Artisan Haven?{' '}
              <button
                onClick={() => setIsRegister(true)}
                className="text-[#5A3E2B] font-bold hover:underline"
              >
                Register as Seller / Buyer
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
