import React, { useState } from 'react';
import { Store, PlusCircle, Sparkles, DollarSign, Package, TrendingUp, CheckCircle, Clock, Trash2, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product, Order, User } from '../types';

interface SellerDashboardProps {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: any) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenCopywriterStudio: () => void;
  onSettlePayout: (orderId: string, sellerId: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentUser,
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onOpenCopywriterStudio,
  onSettlePayout
}) => {
  // New Product Form State
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [vibe, setVibe] = useState('Cozy, minimal, everyday street style');
  const [stylingSuggestion, setStylingSuggestion] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('10');
  const [category, setCategory] = useState<'wallets' | 'bags' | 'bracelets' | 'accessories' | 'home-crafts'>('wallets');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'sales' | 'new-product'>('products');

  // Filter products and orders belonging to this seller
  const sellerId = currentUser?.id || 'seller-artisan-01';
  const myProducts = products.filter(p => p.sellerId === sellerId);
  
  // Calculate seller orders & revenue
  const mySalesOrders = orders.filter(o => o.items.some(item => item.sellerId === sellerId));
  
  const totalRevenue = mySalesOrders.reduce((sum, order) => {
    const myItems = order.items.filter(i => i.sellerId === sellerId);
    return sum + myItems.reduce((s, i) => s + (i.price * i.quantity), 0);
  }, 0);

  const pendingPayouts = mySalesOrders.filter(o => 
    o.sellerPayouts.some(p => p.sellerId === sellerId && p.status === 'pending')
  );

  // Instant AI Copywriting Generation using Server Route (/api/ai/copywrite)
  const handleGenerateAICopy = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/copywrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product_description',
          productName: title || 'Minimalist Pueblo Bifold Wallet',
          materials: materials || 'Italian Badalassi Carlo vegetable-tanned leather, Japanese bonded polycord thread',
          vibe: vibe || 'Cozy, minimal, everyday street style'
        })
      });
      const data = await res.json();
      
      if (data.result) {
        // Parse out headline and description
        setHeadline('Timeless Patina, Uncompromising Hand-Stitched Durability');
        setDescription(data.result);
        if (!materials) {
          setMaterials('Italian Vegetable-Tanned Pueblo Leather, Bonded Japanese Thread, Beeswax Edge Finish');
        }
        setStylingSuggestion('Pairs seamlessly with raw denim, linen button-downs, or tailored neutrals for an understated everyday carry accent.');
      }
    } catch (err) {
      console.error('AI Copy generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const materialsArray = materials
      ? materials.split(',').map(m => m.trim()).filter(Boolean)
      : ['Full-Grain Vegetable Leather', 'Bonded Polycord Thread'];

    onAddProduct({
      title,
      headline: headline || 'Handcrafted Minimalist Leather Piece',
      description: description || 'Meticulously hand-cut and saddle-stitched for a lifetime of dependable daily wear.',
      materials: materialsArray,
      vibe,
      stylingSuggestion: stylingSuggestion || 'Understated everyday carry for any modern minimalist wardrobe.',
      price: Number(price),
      inventory: Number(inventory) || 1,
      category,
      imageUrl,
      sellerId: currentUser?.id || 'seller-artisan-01',
      sellerName: currentUser?.shopName || currentUser?.name || 'Artisan Haven Atelier',
      sellerGcash: currentUser?.gcashNumber || '09171234567',
    });

    // Reset Form
    setTitle('');
    setHeadline('');
    setDescription('');
    setMaterials('');
    setPrice('');
    setActiveTab('products');
  };

  return (
    <div className="py-10 bg-[#F9F7F2] min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header & Artisan Profile Banner */}
        <div className="bg-white/60 p-6 sm:p-8 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name || 'Artisan'}`}
              alt={currentUser?.name}
              className="w-16 h-16 object-cover border border-black/10 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif italic font-bold text-[#2C2C2C]">
                  {currentUser?.shopName || `${currentUser?.name || 'Mateo Dela Cruz'}'s Atelier`}
                </h1>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#5A3E2B] text-white">
                  Verified Artisan
                </span>
              </div>
              <p className="text-xs text-black/60 mt-0.5">
                {currentUser?.bio || 'Handcrafted minimalist leather goods atelier in the Philippines.'}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#2C2C2C] font-medium mt-1">
                <span className="text-black/40 text-[10px] uppercase tracking-wider font-bold">GCash Settlement Account:</span>
                <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 border border-black/10 font-mono">
                  📱 {currentUser?.gcashNumber || '09171234567'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('new-product')}
              className="px-4 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Product</span>
            </button>

            <button
              onClick={onOpenCopywriterStudio}
              className="px-4 py-2.5 bg-white border border-black/10 text-[#2C2C2C] text-[10px] uppercase tracking-wider font-bold hover:border-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A3E2B]" />
              <span>AI Copywriter Studio</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/60 p-6 border border-black/10 space-y-1">
            <div className="flex items-center justify-between text-black/40 text-[9px] uppercase tracking-widest font-bold">
              <span>Total Sales Revenue</span>
              <DollarSign className="w-4 h-4 text-[#5A3E2B]" />
            </div>
            <span className="text-3xl font-serif italic font-bold text-[#2C2C2C] block">
              ₱{totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Direct GCash settlement enabled
            </span>
          </div>

          <div className="bg-white/60 p-6 border border-black/10 space-y-1">
            <div className="flex items-center justify-between text-black/40 text-[9px] uppercase tracking-widest font-bold">
              <span>Active Artifacts</span>
              <Package className="w-4 h-4 text-[#5A3E2B]" />
            </div>
            <span className="text-3xl font-serif italic font-bold text-[#2C2C2C] block">
              {myProducts.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold">
              Published in Artisan Haven Store
            </span>
          </div>

          <div className="bg-white/60 p-6 border border-black/10 space-y-1">
            <div className="flex items-center justify-between text-black/40 text-[9px] uppercase tracking-widest font-bold">
              <span>Orders Fulfilled</span>
              <TrendingUp className="w-4 h-4 text-[#5A3E2B]" />
            </div>
            <span className="text-3xl font-serif italic font-bold text-[#2C2C2C] block">
              {mySalesOrders.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#5A3E2B] font-bold">
              {pendingPayouts.length > 0 ? `${pendingPayouts.length} pending payout(s)` : 'All payouts transferred'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-black/10 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5'
            }`}
          >
            My Listed Products ({myProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer ${
              activeTab === 'sales' ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5'
            }`}
          >
            Sales History & GCash Payouts ({mySalesOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer ${
              activeTab === 'new-product' ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5'
            }`}
          >
            + Add New Product
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="bg-white/60 border border-black/10 overflow-hidden">
            <div className="p-5 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-base font-serif italic font-bold text-[#2C2C2C]">
                Your Atelier Catalog
              </h2>
              <button
                onClick={() => setActiveTab('new-product')}
                className="text-[10px] uppercase tracking-wider font-bold text-[#5A3E2B] hover:underline"
              >
                + Add Product
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="text-center py-12 text-black/50 text-xs">
                You haven't listed any handcrafted goods yet. Click "+ Add New Product" to start selling!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E8E4DF]/40 border-b border-black/10 text-black/50 uppercase tracking-widest font-bold text-[9px]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (PHP)</th>
                      <th className="p-4">Inventory</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-[#2C2C2C]">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-black/5 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-cover border border-black/10" />
                          <div>
                            <span className="font-bold text-[#2C2C2C] block font-serif italic">{p.title}</span>
                            <span className="text-[10px] text-black/50 truncate max-w-xs block">{p.materials.join(', ')}</span>
                          </div>
                        </td>
                        <td className="p-4 capitalize text-[11px]">{p.category}</td>
                        <td className="p-4 font-bold text-[#5A3E2B] font-mono">₱{p.price.toLocaleString()}</td>
                        <td className="p-4 font-medium">{p.inventory} in stock</td>
                        <td className="p-4">★ {p.rating.toFixed(1)} ({p.reviewsCount})</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            title="Delete Product"
                            className="p-1.5 text-black/40 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sales History & GCash Payouts */}
        {activeTab === 'sales' && (
          <div className="bg-white/60 border border-black/10 overflow-hidden">
            <div className="p-5 border-b border-black/5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-serif italic font-bold text-[#2C2C2C]">
                  Sales History & GCash Payout Ledger
                </h2>
                <p className="text-xs text-black/50">
                  Track buyer purchases, fulfillment status, and GCash transfers
                </p>
              </div>
            </div>

            {mySalesOrders.length === 0 ? (
              <div className="text-center py-12 text-black/50 text-xs">
                No orders yet. Once buyers check out via PayMongo, your sales history will populate here!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E8E4DF]/40 border-b border-black/10 text-black/50 uppercase tracking-widest font-bold text-[9px]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Buyer & Address</th>
                      <th className="p-4">Items Sold</th>
                      <th className="p-4">Total (₱)</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">GCash Payout</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-[#2C2C2C]">
                    {mySalesOrders.map((order) => {
                      const payout = order.sellerPayouts.find(p => p.sellerId === sellerId);
                      const myItems = order.items.filter(i => i.sellerId === sellerId);
                      const orderSubtotal = myItems.reduce((s, i) => s + (i.price * i.quantity), 0);

                      return (
                        <tr key={order.id} className="hover:bg-black/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#2C2C2C]">#{order.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-[#2C2C2C] block">{order.buyerName}</span>
                            <span className="text-[10px] text-black/50">{order.shippingAddress}</span>
                          </td>
                          <td className="p-4">
                            {myItems.map((item, idx) => (
                              <div key={idx} className="text-[#2C2C2C]">
                                {item.quantity}x {item.title}
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-[#5A3E2B] font-mono">₱{orderSubtotal.toLocaleString()}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              {order.paymentStatus} ({order.paymentMethod})
                            </span>
                          </td>
                          <td className="p-4">
                            {payout?.status === 'transferred' ? (
                              <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" /> Transferred to {payout.gcashNumber}
                              </span>
                            ) : (
                              <span className="text-[#5A3E2B] font-bold flex items-center gap-1 text-[11px]">
                                <Clock className="w-3.5 h-3.5" /> Pending ({currentUser?.gcashNumber || '09171234567'})
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {payout?.status !== 'transferred' && (
                              <button
                                onClick={() => onSettlePayout(order.id, sellerId)}
                                className="px-2.5 py-1 bg-black text-white text-[9px] uppercase tracking-wider font-bold hover:bg-[#5A3E2B] transition-colors cursor-pointer"
                              >
                                Mark Settled
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Add New Product Form (With AI Copywriting Integration) */}
        {activeTab === 'new-product' && (
          <div className="bg-white/60 p-6 sm:p-8 border border-black/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10">
              <div>
                <h2 className="text-xl font-serif italic font-bold text-[#2C2C2C]">
                  List a New Handcrafted Artifact
                </h2>
                <p className="text-xs text-black/60">
                  Fill in your product specifications or use our <strong>Gemini AI Copywriter</strong> to write headlines & descriptions automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAICopy}
                disabled={isGeneratingAI}
                className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{isGeneratingAI ? 'Generating Copy...' : 'AI Auto-Fill Description'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmitNewProduct} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist Pueblo Bifold Wallet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-medium focus:outline-none focus:border-black"
                  >
                    <option value="wallets">Wallets & Cardholders</option>
                    <option value="bracelets">Macrame & Bracelets</option>
                    <option value="bags">Leather Bags & Totes</option>
                    <option value="accessories">Keychains & Straps</option>
                    <option value="home-crafts">Home Crafts & Valet Trays</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Price in PHP (₱) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1850"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Initial Stock Inventory *
                  </label>
                  <input
                    type="number"
                    required
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Target Vibe / Aesthetic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cozy, minimal, everyday street style"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                  Key Materials & Highlights (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Italian Badalassi Carlo Leather, 316L Stainless Steel Clasp, Beeswax Edge"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                  Catchy Headline (Generated by AI Copywriter)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Timeless Patina, Uncompromising Hand-Stitched Durability"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-semibold focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                  Product Overview & Durability Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write a 2-sentence overview focusing on durability, materials, and daily wear..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                  Artisan Styling Suggestion
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pairs effortlessly with raw denim or tailored neutrals."
                  value={stylingSuggestion}
                  onChange={(e) => setStylingSuggestion(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                  Product Image URL (High-Res)
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-mono text-[11px] focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2.5 bg-white border border-black/10 text-[#2C2C2C] text-[10px] uppercase tracking-wider font-bold hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all shadow-sm cursor-pointer"
                >
                  Publish Handcrafted Product
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
