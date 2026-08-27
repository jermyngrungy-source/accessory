import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, ShoppingBag, Eye, Sparkles, Check, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';

interface StorePageProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateCopywriter: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  products,
  onOpenProduct,
  onAddToCart,
  onNavigateCopywriter
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'wallets', label: 'Wallets & Cardholders' },
    { id: 'bracelets', label: 'Macrame & Bracelets' },
    { id: 'bags', label: 'Leather Bags & Totes' },
    { id: 'accessories', label: 'Keychains & Straps' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q)) ||
        p.sellerName.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="py-12 bg-[#F9F7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-black/5 gap-4">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-black/20"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/40">
                Curated Catalog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif italic font-bold text-[#2C2C2C]">
              Handcrafted Goods Collection
            </h1>
            <p className="text-xs sm:text-sm text-black/60 max-w-xl">
              Authentic full-grain leather, surgical-grade hardware, and artisanal macrame woven to last a lifetime.
            </p>
          </div>

          <button
            onClick={onNavigateCopywriter}
            className="self-start md:self-auto px-5 py-2.5 bg-[#5A3E2B] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#473122] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Copywriter & Brand Studio</span>
          </button>
        </div>

        {/* Filter, Search & Sorting Bar */}
        <div className="bg-white/60 p-4 sm:p-5 border border-black/10 mb-8 space-y-4">
          
          {/* Top Bar: Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leather, macrame, cardholders, straps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-black/10 focus:outline-none focus:border-black text-[#2C2C2C] placeholder:text-black/30"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ArrowUpDown className="w-4 h-4 text-black/50" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-white border border-black/10 px-3 py-2 text-[#2C2C2C] focus:outline-none focus:border-black"
              >
                <option value="featured">Featured Artisans</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#5A3E2B] text-white shadow-sm'
                    : 'bg-black/5 text-black/70 hover:bg-black/10 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/40 border border-dashed border-black/20 p-8">
            <ShoppingBag className="w-10 h-10 text-black/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold font-serif italic text-[#2C2C2C] mb-1">No Artifacts Found</h3>
            <p className="text-xs text-black/50 mb-4">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-black text-white text-[10px] uppercase tracking-widest font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onOpenProduct(product)}
                className="bg-white/60 border border-black/10 overflow-hidden hover:border-black/40 transition-all duration-300 flex flex-col group cursor-pointer text-left"
              >
                {/* Image Container with Hover zoom */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#E8E4DF]">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">
                    {product.category}
                  </span>

                  {/* Stock Indicator */}
                  {product.inventory < 5 && (
                    <span className="absolute top-3 right-3 bg-[#5A3E2B] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                      Only {product.inventory} left
                    </span>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProduct(product);
                      }}
                      className="px-4 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#F9F7F2] flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details & Reviews</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Rating & Artisan */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-black/50 font-medium truncate max-w-[150px]">
                        By {product.sellerName}
                      </span>
                      <div className="flex items-center gap-1 text-[#5A3E2B] font-bold bg-[#E8E4DF]/60 px-2 py-0.5">
                        <Star className="w-3 h-3 fill-[#5A3E2B] text-[#5A3E2B]" />
                        <span>{product.rating.toFixed(1)} ({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif italic font-bold text-lg text-[#2C2C2C] leading-snug group-hover:text-[#5A3E2B] transition-colors">
                      {product.title}
                    </h3>

                    {/* Catchy headline or short subtext */}
                    {product.headline && (
                      <p className="text-xs text-black/70 italic line-clamp-1">
                        "{product.headline}"
                      </p>
                    )}

                    {/* Materials pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.materials.slice(0, 2).map((mat, i) => (
                        <span key={i} className="text-[9px] uppercase tracking-wider bg-black/5 text-black/70 px-2 py-0.5 font-semibold">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart Footer */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-black/40 block font-bold">Price</span>
                      <span className="text-xl font-bold font-serif italic text-[#5A3E2B]">
                        ₱{product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                        addedId === product.id
                          ? 'bg-emerald-800 text-white'
                          : 'bg-black text-white hover:bg-[#5A3E2B]'
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
