import React, { useState } from 'react';
import { ShoppingBag, Package, CheckCircle2, Clock, Truck, Star, ArrowRight, Download, Receipt, Sparkles } from 'lucide-react';
import { Order, User, Product } from '../types';

interface BuyerDashboardProps {
  currentUser: User | null;
  orders: Order[];
  onOpenProductById: (productId: string) => void;
  onExploreStore: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  currentUser,
  orders,
  onOpenProductById,
  onExploreStore
}) => {
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const buyerEmail = currentUser?.email || 'sofia.r@gmail.com';
  const myOrders = orders.filter(
    (o) => o.buyerEmail.toLowerCase() === buyerEmail.toLowerCase() || o.buyerId === currentUser?.id
  );

  return (
    <div className="py-10 bg-[#F9F7F2] min-h-screen text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white/60 p-6 sm:p-8 border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#5A3E2B] text-white flex items-center justify-center font-bold font-serif italic text-lg">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-2xl font-serif italic font-bold text-[#2C2C2C]">
                Buyer Order History
              </h1>
              <p className="text-xs text-black/60">
                Logged in as <strong className="text-[#2C2C2C]">{currentUser?.name || 'Sofia Ramirez'}</strong> ({currentUser?.email || 'sofia.r@gmail.com'})
              </p>
            </div>
          </div>

          <button
            onClick={onExploreStore}
            className="px-4 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {myOrders.length === 0 ? (
            <div className="text-center py-16 bg-white/60 border border-dashed border-black/20 p-8 space-y-3">
              <Package className="w-12 h-12 text-black/30 mx-auto" />
              <h3 className="text-lg font-serif italic font-bold text-[#2C2C2C]">No Purchase History Yet</h3>
              <p className="text-xs text-black/60 max-w-sm mx-auto">
                Once you complete your handcrafted order via GCash or Card, track its shipment and leave verified reviews here.
              </p>
              <button
                onClick={onExploreStore}
                className="mt-2 px-5 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all"
              >
                Browse Heirloom Goods
              </button>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/60 border border-black/10 overflow-hidden text-left"
              >
                {/* Order Top Bar */}
                <div className="bg-[#E8E4DF]/40 px-6 py-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-black/40 block text-[9px] uppercase font-bold tracking-widest">
                        Order Placed
                      </span>
                      <span className="font-semibold text-[#2C2C2C]">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="hidden sm:block">
                      <span className="text-black/40 block text-[9px] uppercase font-bold tracking-widest">
                        Total Amount
                      </span>
                      <span className="font-bold text-[#5A3E2B]">
                        ₱{order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="hidden md:block">
                      <span className="text-black/40 block text-[9px] uppercase font-bold tracking-widest">
                        Ship To
                      </span>
                      <span className="font-medium text-[#2C2C2C] truncate max-w-xs block">
                        {order.shippingAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-black/60 font-bold text-xs">#{order.id}</span>
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="px-3 py-1 bg-white border border-black/10 hover:border-black text-[10px] uppercase tracking-wider font-bold text-[#2C2C2C] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5 text-black/60" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="px-6 py-3 bg-[#E8E4DF]/20 border-b border-black/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {order.fulfillmentStatus === 'delivered' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Truck className="w-4 h-4 text-[#5A3E2B]" />
                    )}
                    <span className="font-bold text-[#2C2C2C] capitalize text-xs">
                      Status: {order.fulfillmentStatus}
                    </span>
                    <span className="text-black/20">•</span>
                    <span className="text-emerald-800 font-bold uppercase text-[9px] tracking-wider">
                      Payment: {order.paymentStatus} via {order.paymentMethod}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-black/50 hidden sm:inline font-semibold">
                    Protected by PayMongo GCash Buyer Shield
                  </span>
                </div>

                {/* Order Items List */}
                <div className="p-6 divide-y divide-black/5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 object-cover border border-black/10"
                        />
                        <div className="space-y-1">
                          <h4 className="font-serif italic font-bold text-sm text-[#2C2C2C] leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-xs text-black/60 block font-mono">
                            Qty: {item.quantity} × ₱{item.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#5A3E2B] font-bold bg-[#E8E4DF]/50 px-2 py-0.5 inline-block">
                            Handcrafted in Philippines
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => onOpenProductById(item.productId)}
                          className="px-3.5 py-1.5 bg-black hover:bg-[#5A3E2B] text-white text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-200" />
                          <span>Leave Review</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Printable/Viewable Receipt Modal */}
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#F9F7F2] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-black/10 space-y-6 relative text-left">
              <div className="text-center space-y-1 border-b border-black/10 pb-4">
                <div className="w-10 h-10 bg-[#5A3E2B] text-white flex items-center justify-center font-serif italic font-bold text-lg mx-auto mb-2">
                  AH
                </div>
                <h3 className="font-serif italic font-bold text-xl text-[#2C2C2C]">ARTISAN HAVEN</h3>
                <p className="text-[10px] uppercase tracking-widest text-black/50 font-bold">Official Electronic Receipt • Handcrafted Goods</p>
                <p className="font-mono text-xs font-bold text-black/70">Order ID: {selectedReceiptOrder.id}</p>
              </div>

              <div className="space-y-2 text-xs text-[#2C2C2C]">
                <div className="flex justify-between">
                  <span className="text-black/50">Date:</span>
                  <span>{new Date(selectedReceiptOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Buyer:</span>
                  <span className="font-semibold">{selectedReceiptOrder.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">GCash / Payment:</span>
                  <span className="font-semibold text-emerald-800 uppercase">
                    {selectedReceiptOrder.paymentMethod} (PAID)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Delivery Address:</span>
                  <span className="text-right max-w-[200px] truncate">{selectedReceiptOrder.shippingAddress}</span>
                </div>
              </div>

              <div className="border-t border-b border-black/10 py-3 space-y-2 text-xs">
                {selectedReceiptOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.quantity}x {item.title}</span>
                    <span className="font-mono font-semibold">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-base font-bold font-serif italic text-[#2C2C2C]">
                <span>Total Amount Paid</span>
                <span className="text-[#5A3E2B]">₱{selectedReceiptOrder.totalAmount.toLocaleString()}</span>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="w-full py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-colors cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
