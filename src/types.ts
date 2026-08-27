export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gcashNumber: string;
  shopName?: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  headline?: string;
  description: string;
  materials: string[];
  vibe: string;
  stylingSuggestion: string;
  price: number; // in PHP ₱
  inventory: number;
  category: 'wallets' | 'bags' | 'bracelets' | 'accessories' | 'home-crafts';
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerGcash: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  tags: string[];
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sellerId: string;
  sellerGcash?: string;
}

export interface SellerPayout {
  sellerId: string;
  sellerName: string;
  gcashNumber: string;
  amount: number;
  status: 'pending' | 'transferred';
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerGcash?: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'gcash' | 'card' | 'paymaya' | 'paymongo';
  paymentStatus: 'paid' | 'pending' | 'failed';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymongoPaymentId?: string;
  paymongoCheckoutUrl?: string;
  sellerPayouts: SellerPayout[];
  createdAt: string;
}

export type CopywritingPromptType = 
  | 'product_description'
  | 'social_captions'
  | 'visual_prompt'
  | 'brand_identity';

export interface AICopywriteRequest {
  type: CopywritingPromptType;
  productName?: string;
  materials?: string;
  vibe?: string;
  storeName?: string;
  tone?: string;
  accessory?: string;
  background?: string;
  focus?: string;
}

export interface AICopywriteResponse {
  type: CopywritingPromptType;
  result: string;
  structured?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'navigate_store' | 'view_product' | 'open_copywriter';
    payload?: string;
  };
}
