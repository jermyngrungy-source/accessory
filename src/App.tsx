/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { StorePage } from './components/StorePage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellerDashboard } from './components/SellerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AICopywriterStudio } from './components/AICopywriterStudio';
import { AboutUs } from './components/AboutUs';
import { Contacts } from './components/Contacts';
import { SitemapPage } from './components/SitemapPage';
import { DeploymentDocs } from './components/DeploymentDocs';
import { Footer } from './components/Footer';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AIChatbot } from './components/AIChatbot';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS, INITIAL_USERS } from './data/mockData';
import { Product, Review, Order, User } from './types';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Auth State (Default to logged-in artisan demo or buyer for seamless interaction)
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Interactive Product Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Fetch initial data from server if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.products && prodData.products.length > 0) {
            setProducts(prodData.products);
          }
        }

        const revRes = await fetch('/api/reviews');
        if (revRes.ok) {
          const revData = await revRes.json();
          if (revData.reviews && revData.reviews.length > 0) {
            setReviews(revData.reviews);
          }
        }

        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (ordData.orders && ordData.orders.length > 0) {
            setOrders(ordData.orders);
          }
        }
      } catch (err) {
        console.log('Running on client state with initial mock data');
      }
    };

    fetchData();
  }, []);

  // Add To Cart Handler
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Checkout Handler
  const handleCheckout = async (checkoutData: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      });
      const data = await res.json();
      if (data.order) {
        setOrders((prev) => [data.order, ...prev]);
      }
    } catch (err) {
      // Local fallback
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        buyerId: checkoutData.buyerId,
        buyerName: checkoutData.buyerName,
        buyerEmail: checkoutData.buyerEmail,
        totalAmount: checkoutData.totalAmount,
        paymentStatus: 'paid',
        paymentMethod: checkoutData.paymentMethod || 'gcash',
        fulfillmentStatus: 'processing',
        shippingAddress: checkoutData.shippingAddress,
        items: checkoutData.items,
        sellerPayouts: checkoutData.items.map((it: any) => ({
          sellerId: it.sellerId,
          sellerName: 'Artisan Workshop',
          amount: it.price * it.quantity,
          status: 'pending',
          gcashNumber: it.sellerGcash || '09171234567'
        })),
        createdAt: new Date().toISOString()
      };
      setOrders((prev) => [newOrder, ...prev]);
    }

    // Clear cart
    setCart([]);
  };

  // Add Product Review & Star Rating Handler
  const handleAddReview = async (productId: string, rating: number, title: string, comment: string) => {
    const payload = {
      productId,
      buyerId: currentUser?.id || 'guest-buyer',
      buyerName: currentUser?.name || 'Sofia Ramirez (Verified Buyer)',
      rating,
      title,
      comment,
      verifiedPurchase: true
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
      }
    } catch (err) {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        productId,
        buyerId: currentUser?.id || 'guest-buyer',
        buyerName: currentUser?.name || 'Sofia Ramirez (Verified Buyer)',
        rating,
        title,
        comment,
        createdAt: new Date().toISOString(),
        verifiedPurchase: true
      };
      setReviews((prev) => [newRev, ...prev]);
    }

    // Recalculate local product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentTotal = p.rating * p.reviewsCount;
          const newCount = p.reviewsCount + 1;
          const newRating = Number(((currentTotal + rating) / newCount).toFixed(1));
          return { ...p, rating: newRating, reviewsCount: newCount };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        const currentTotal = prev.rating * prev.reviewsCount;
        const newCount = prev.reviewsCount + 1;
        const newRating = Number(((currentTotal + rating) / newCount).toFixed(1));
        return { ...prev, rating: newRating, reviewsCount: newCount };
      });
    }
  };

  // Add Product from Seller Dashboard
  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.product) {
        setProducts((prev) => [data.product, ...prev]);
        return;
      }
    } catch (err) {
      console.log('Error adding product to backend, updating local state');
    }

    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Settle Seller Payout
  const handleSettlePayout = (orderId: string, sellerId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            sellerPayouts: ord.sellerPayouts.map((p) =>
              p.sellerId === sellerId ? { ...p, status: 'transferred' } : p
            )
          };
        }
        return ord;
      })
    );
  };

  const handleOpenProductById = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Dynamic View Controller */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onExploreCatalog={() => setCurrentView('store')}
              onOpenSellerDashboard={() => setCurrentView('seller-dashboard')}
            />
            <Features />
            <StorePage
              products={products}
              onOpenProduct={(prod) => setSelectedProduct(prod)}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
              onNavigateCopywriter={() => setCurrentView('copywriter')}
            />
          </>
        )}

        {currentView === 'store' && (
          <StorePage
            products={products}
            onOpenProduct={(prod) => setSelectedProduct(prod)}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onNavigateCopywriter={() => setCurrentView('copywriter')}
          />
        )}

        {currentView === 'seller-dashboard' && (
          <SellerDashboard
            currentUser={currentUser}
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onOpenCopywriterStudio={() => setCurrentView('copywriter')}
            onSettlePayout={handleSettlePayout}
          />
        )}

        {currentView === 'buyer-dashboard' && (
          <BuyerDashboard
            currentUser={currentUser}
            orders={orders}
            onOpenProductById={handleOpenProductById}
            onExploreStore={() => setCurrentView('store')}
          />
        )}

        {currentView === 'copywriter' && <AICopywriterStudio />}

        {currentView === 'about' && <AboutUs />}

        {currentView === 'contacts' && <Contacts />}

        {currentView === 'sitemap' && (
          <SitemapPage
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'docs' && <DeploymentDocs />}
      </main>

      {/* Product Detail & Review Modal */}
      <ProductDetailModal
        product={selectedProduct}
        reviews={reviews}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Slide-out Cart Drawer with PayMongo Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* User Login & GCash Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Persistent AI Chatbot (Gemini + Voiceflow Concierge) */}
      <AIChatbot onNavigate={(v) => setCurrentView(v)} />

      {/* Site Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
