import { Product, User, Review, Order } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'seller-artisan-01',
    name: 'Mateo Dela Cruz',
    email: 'mateo@artisan-haven.ph',
    role: 'seller',
    gcashNumber: '09171234567',
    shopName: 'Artisan Haven Atelier',
    bio: 'Master leathercrafter specializing in traditional hand saddle-stitching and vegetable-tanned full-grain minimalist goods.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'buyer-user-01',
    name: 'Sofia Ramirez',
    email: 'sofia.r@gmail.com',
    role: 'buyer',
    gcashNumber: '09289876543',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-10T10:30:00.000Z',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    title: 'Minimalist Pueblo Bifold Wallet',
    headline: 'Timeless Patina, Uncompromising Hand-Stitched Durability',
    description: 'Crafted from world-renowned Italian Badalassi Carlo Pueblo vegetable-tanned leather. Cut and hand-stitched with bonded Japanese poly-braid thread for generations of daily heirloom use.',
    materials: ['Italian Badalassi Carlo Pueblo Leather', 'Japanese Bonded Polycord Thread', 'Natural Beeswax Edge Finish'],
    vibe: 'Warm, minimal, everyday heritage carry',
    stylingSuggestion: 'Pairs effortlessly with raw denim, linen button-downs, or tailored neutrals for an understated everyday carry accent.',
    price: 1850,
    inventory: 14,
    category: 'wallets',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    sellerId: 'seller-artisan-01',
    sellerName: 'Artisan Haven Atelier',
    sellerGcash: '09171234567',
    rating: 4.9,
    reviewsCount: 18,
    createdAt: '2026-02-01T10:00:00.000Z',
    tags: ['leather', 'wallet', 'minimalist', 'bifold', 'artisan']
  },
  {
    id: 'prod-02',
    title: 'Hand-Crafted Deep Indigo Macrame Bracelet',
    headline: 'Waterproof Resilience Meets Coastal Artisan Minimalism',
    description: 'Braided by hand using ultra-durable nautical micro-cord anchored with a surgical-grade 316L stainless steel brushed magnetic clasp. Designed to withstand ocean salt, shower steam, and daily adventures.',
    materials: ['Waterproof Nautical Cord', '316L Stainless Steel Clasp', 'Hand-Knotted Core'],
    vibe: 'Cozy, coastal minimal, everyday street style',
    stylingSuggestion: 'Stack alongside an automatic field watch or wear standalone with a crisp white t-shirt and rolled cuffs.',
    price: 650,
    inventory: 28,
    category: 'bracelets',
    imageUrl: 'https://images.unsplash.com/photo-1611591477759-4d87455d3159?auto=format&fit=crop&w=800&q=80',
    sellerId: 'seller-artisan-01',
    sellerName: 'Artisan Haven Atelier',
    sellerGcash: '09171234567',
    rating: 5.0,
    reviewsCount: 24,
    createdAt: '2026-02-05T12:00:00.000Z',
    tags: ['bracelet', 'macrame', 'waterproof', 'accessories', 'handmade']
  },
  {
    id: 'prod-03',
    title: 'Heritage Full-Grain Leather Day Tote',
    headline: 'Architectural Structure in Rich Tuscan Vachetta',
    description: 'A seamless fusion of form and function. Cut from single-piece 5oz full-grain bridle leather with hand-hammered solid copper rivets at every stress point. Sized to fit 16-inch laptops with ease.',
    materials: ['5oz Full-Grain Vachetta Leather', 'Solid Hand-Hammered Copper Rivets', 'Solid Brass Key D-Ring'],
    vibe: 'Refined, structured, timeless metropolitan chic',
    stylingSuggestion: 'Complements structured blazers, trench coats, or relaxed weekend earth-tone palettes.',
    price: 4950,
    inventory: 6,
    category: 'bags',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    sellerId: 'seller-artisan-01',
    sellerName: 'Artisan Haven Atelier',
    sellerGcash: '09171234567',
    rating: 4.8,
    reviewsCount: 12,
    createdAt: '2026-02-12T09:00:00.000Z',
    tags: ['tote', 'bag', 'full grain', 'luxury', 'handcrafted']
  },
  {
    id: 'prod-04',
    title: 'Slimline Saddle-Stitch Cardholder',
    headline: 'Ultra-Thin Front Pocket Carry for 6 Cards & Folded Bills',
    description: 'Engineered for absolute pocket minimalism. Features three beveled card slots and a central bill pocket, hand-burnished with natural Tokonole gum for smooth draw action.',
    materials: ['Full-Grain Buttero Italian Leather', 'Waxed Linen Thread', 'Tokonole Burnish'],
    vibe: 'Ultra-minimal, modern functionalist',
    stylingSuggestion: 'Slides invisibly into tailored trousers or shirt pockets without disrupting silhouette lines.',
    price: 980,
    inventory: 20,
    category: 'wallets',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    sellerId: 'seller-artisan-01',
    sellerName: 'Artisan Haven Atelier',
    sellerGcash: '09171234567',
    rating: 4.9,
    reviewsCount: 31,
    createdAt: '2026-02-14T14:30:00.000Z',
    tags: ['cardholder', 'wallet', 'slim', 'leather']
  },
  {
    id: 'prod-05',
    title: 'Solid Sand-Cast Brass & Leather Key Valet',
    headline: 'Heavyweight Brass Hardware Anchored in Saddle Hide',
    description: 'Forged from solid sand-cast unlacquered brass that matures into an antique gold luster alongside durable 8oz vegetable-tanned bridle leather.',
    materials: ['Solid Sand-Cast Brass', '8oz Bridle Leather', 'Custom Chicago Screws'],
    vibe: 'Rugged elegance, industrial artisan',
    stylingSuggestion: 'Clip to belt loops or tote straps to keep essentials secure and within fingertip reach.',
    price: 750,
    inventory: 35,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    sellerId: 'seller-artisan-01',
    sellerName: 'Artisan Haven Atelier',
    sellerGcash: '09171234567',
    rating: 5.0,
    reviewsCount: 15,
    createdAt: '2026-02-18T11:20:00.000Z',
    tags: ['keychain', 'brass', 'accessories', 'leather']
  },
  {
    id: 'prod-06',
    title: 'Artisan Vegetable-Tanned Watch Strap',
    headline: 'Hand-Finished Tapered Strap with Cream Saddle Stitching',
    description: 'Custom-fitted 20mm/22mm watch strap hand-tapered and lined with hypoallergenic French Zermatt calfskin for total wrist comfort all day long.',
    materials: ['Italian Vegetable-Tanned Bovine Hide', 'Hypoallergenic French Zermatt Lining', 'Brushed 316L Buckle'],
    vibe: 'Classic horology, quiet luxury',
    stylingSuggestion: 'Transforms modern smartwatches and vintage mechanical timepieces into heirloom conversation pieces.',
    price: 1450,
    inventory: 12,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    sellerId: 'seller-artisan-01',
    sellerName: 'Artisan Haven Atelier',
    sellerGcash: '09171234567',
    rating: 4.7,
    reviewsCount: 9,
    createdAt: '2026-02-20T16:00:00.000Z',
    tags: ['watch strap', 'leather', 'accessories', 'luxury']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    buyerId: 'buyer-user-01',
    buyerName: 'Sofia Ramirez',
    rating: 5,
    title: 'Incredible leather smell and immaculate stitching!',
    comment: 'The Badalassi Carlo Pueblo leather has already started developing a gorgeous soft glow after just two weeks. The hand stitching is flawless.',
    verifiedPurchase: true,
    createdAt: '2026-02-15T09:30:00.000Z'
  },
  {
    id: 'rev-02',
    productId: 'prod-02',
    buyerId: 'buyer-user-01',
    buyerName: 'Sofia Ramirez',
    rating: 5,
    title: 'Never takes off in the shower or beach!',
    comment: 'The magnetic stainless steel clasp snaps with a satisfying click. Waterproof as promised and looks so minimal on wrist.',
    verifiedPurchase: true,
    createdAt: '2026-02-18T14:15:00.000Z'
  },
  {
    id: 'rev-03',
    productId: 'prod-04',
    buyerId: 'buyer-user-02',
    buyerName: 'Carlos Mendoza',
    rating: 5,
    title: 'Fits 6 cards without bulging my suit pocket',
    comment: 'Exceptional craftsmanship. Edge finishing is silky smooth. Worth every peso.',
    verifiedPurchase: true,
    createdAt: '2026-02-22T11:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-78219',
    buyerId: 'buyer-user-01',
    buyerName: 'Sofia Ramirez',
    buyerEmail: 'sofia.r@gmail.com',
    buyerGcash: '09289876543',
    shippingAddress: 'Unit 402, Acacia Terraces, BGC, Taguig City, Metro Manila',
    items: [
      {
        productId: 'prod-01',
        title: 'Minimalist Pueblo Bifold Wallet',
        price: 1850,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        sellerId: 'seller-artisan-01',
        sellerGcash: '09171234567'
      },
      {
        productId: 'prod-02',
        title: 'Hand-Crafted Deep Indigo Macrame Bracelet',
        price: 650,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1611591477759-4d87455d3159?auto=format&fit=crop&w=800&q=80',
        sellerId: 'seller-artisan-01',
        sellerGcash: '09171234567'
      }
    ],
    totalAmount: 2500,
    paymentMethod: 'paymongo',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    paymongoPaymentId: 'pay_m_tok_9918231',
    sellerPayouts: [
      {
        sellerId: 'seller-artisan-01',
        sellerName: 'Artisan Haven Atelier',
        gcashNumber: '09171234567',
        amount: 2500,
        status: 'transferred'
      }
    ],
    createdAt: '2026-02-14T08:30:00.000Z'
  }
];
