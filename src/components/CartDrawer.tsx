import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2, ShieldCheck, Smartphone, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product, User } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (checkoutData: any) => Promise<void>;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currentUser,
  onOpenAuth,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'Sofia Ramirez');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || 'sofia.r@gmail.com');
  const [buyerGcash, setBuyerGcash] = useState(currentUser?.gcashNumber || '09289876543');
  const [shippingAddress, setShippingAddress] = useState('Unit 402, Acacia Terraces, BGC, Taguig City, Metro Manila');
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'paymongo' | 'card' | 'paymaya'>('gcash');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 150;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setProcessingOrder(true);
    try {
      const orderPayload = {
        buyerId: currentUser?.id || 'guest-buyer',
        buyerName,
        buyerEmail,
        buyerGcash,
        shippingAddress,
        paymentMethod,
        totalAmount: total,
        items: cart.map((c) => ({
          productId: c.product.id,
          title: c.product.title,
          price: c.product.price,
          quantity: c.quantity,
          imageUrl: c.product.imageUrl,
          sellerId: c.product.sellerId,
          sellerGcash: c.product.sellerGcash,
        })),
      };

      await onCheckout(orderPayload);
      setOrderSuccess({
        orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        total,
        paymentMethod,
        buyerGcash,
      });
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-[#F9F7F2] max-w-md w-full h-full shadow-2xl flex flex-col justify-between border-l border-black/10 text-left animate-slideLeft">
        
        {/* Top Drawer Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#5A3E2B]" />
            <h2 className="font-serif italic font-bold text-lg text-[#2C2C2C]">
              {isCheckingOut ? 'PayMongo Checkout' : 'Your Artisan Bag'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-black text-white hover:bg-[#5A3E2B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Middle Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif italic font-bold text-xl text-[#2C2C2C]">
                Payment Confirmed!
              </h3>
              <p className="text-xs text-black/70 leading-relaxed max-w-xs mx-auto">
                Thank you for supporting Philippine independent leathercraft! Your GCash payment of <strong>₱{orderSuccess.total.toLocaleString()}</strong> has been verified by PayMongo.
              </p>
              <div className="p-3 bg-white/60 border border-black/10 text-xs text-black/80 font-mono">
                Order ID: {orderSuccess.orderNumber}
              </div>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setIsCheckingOut(false);
                  onClose();
                }}
                className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="p-3.5 bg-white/60 border border-black/10 text-[#2C2C2C]">
                <span className="font-bold block text-[9px] uppercase tracking-widest mb-1 text-black/50">
                  PayMongo Instant Gateway
                </span>
                <p className="text-xs text-black/70">
                  Securely processed with 256-bit encryption. GCash, Maya, and Visa/Mastercard accepted.
                </p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Email for Receipt *</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">GCash Registered Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="09171234567"
                  value={buyerGcash}
                  onChange={(e) => setBuyerGcash(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">Philippine Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'gcash'
                        ? 'border-black bg-white shadow-sm'
                        : 'border-black/10 bg-white/40'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#5A3E2B]" />
                    <div>
                      <span className="font-bold text-[#2C2C2C] block text-xs">GCash</span>
                      <span className="text-[9px] uppercase tracking-wider text-black/50">Instant Verification</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-black bg-white shadow-sm'
                        : 'border-black/10 bg-white/40'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#5A3E2B]" />
                    <div>
                      <span className="font-bold text-[#2C2C2C] block text-xs">Credit / Debit</span>
                      <span className="text-[9px] uppercase tracking-wider text-black/50">Visa / Mastercard</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white/60 border border-black/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal:</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Courier Delivery (PH):</span>
                  <span>{shipping === 0 ? 'FREE' : `₱${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2C2C2C] text-sm pt-2 border-t border-black/5">
                  <span>Total Amount:</span>
                  <span className="font-serif italic font-bold text-base text-[#5A3E2B]">₱{total.toLocaleString()}</span>
                </div>
              </div>
            </form>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-black/20 mx-auto" />
              <h3 className="font-serif italic font-bold text-[#2C2C2C] text-base">Your Bag is Empty</h3>
              <p className="text-xs text-black/50">Discover our handcrafted minimalist leather goods collection.</p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-black/5">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-14 h-14 object-cover border border-black/10 bg-[#E8E4DF]"
                  />
                  <div className="flex-1 text-xs space-y-1">
                    <h4 className="font-serif italic font-bold text-[#2C2C2C] leading-tight">
                      {item.product.title}
                    </h4>
                    <span className="text-[#5A3E2B] font-serif italic font-bold block">
                      ₱{item.product.price.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-black/10 bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-black/70 hover:text-black font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-[#2C2C2C] font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-black/70 hover:text-black font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-black/40 hover:text-[#5A3E2B] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Drawer Footer */}
        {!orderSuccess && cart.length > 0 && (
          <div className="p-6 bg-white/80 border-t border-black/5 space-y-3">
            {!isCheckingOut ? (
              <>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-black/60">
                    <span className="text-[10px] uppercase tracking-wider font-bold">Subtotal</span>
                    <span className="font-semibold text-[#2C2C2C]">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-black/60">
                    <span className="text-[10px] uppercase tracking-wider font-bold">Shipping</span>
                    <span className="font-semibold text-emerald-800">{shipping === 0 ? 'FREE' : `₱${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold font-serif italic text-[#2C2C2C] pt-2 border-t border-black/5">
                    <span>Total</span>
                    <span className="text-[#5A3E2B]">₱{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 bg-black hover:bg-[#5A3E2B] text-white text-[10px] uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to PayMongo Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="px-4 py-3 border border-black/10 text-[10px] uppercase tracking-wider font-bold text-[#2C2C2C] hover:bg-black/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={processingOrder}
                  className="flex-1 py-3.5 bg-[#5A3E2B] hover:bg-[#473122] text-white text-[10px] uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{processingOrder ? 'Confirming with PayMongo...' : `Authorize GCash (₱${total.toLocaleString()})`}</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
