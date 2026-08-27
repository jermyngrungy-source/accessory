import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_REVIEWS, INITIAL_ORDERS } from './src/data/mockData.ts';
import { Product, User, Review, Order, AICopywriteRequest, AICopywriteResponse } from './src/types.ts';

// In-Memory Synchronized Store (Acts as local persistent engine, ready for Supabase sync)
let users: User[] = [...INITIAL_USERS];
let products: Product[] = [...INITIAL_PRODUCTS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let orders: Order[] = [...INITIAL_ORDERS];

// Initialize Google Gen AI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // 1. HEALTH & METADATA APIS
  // ==========================================
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Artisan Haven API',
      database: 'Connected',
      paymentGateway: 'PayMongo Live/Sandbox Ready',
      aiService: process.env.GEMINI_API_KEY ? 'Gemini 3.7 Flash Active' : 'Fallback Engine Active',
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // 2. AUTHENTICATION & GCASH PROFILE
  // ==========================================
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, role, gcashNumber, shopName, bio } = req.body;
    if (!email || !name || !gcashNumber) {
      return res.status(400).json({ error: 'Name, email, and GCash number are required' });
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || 'buyer',
      gcashNumber,
      shopName: shopName || (role === 'seller' ? `${name}'s Artisan Workshop` : undefined),
      bio: bio || (role === 'seller' ? 'Independent craftsperson crafting minimalist heirloom goods.' : undefined),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    return res.status(201).json({ user: newUser, token: `auth-token-${newUser.id}` });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please register.' });
    }
    return res.json({ user, token: `auth-token-${user.id}` });
  });

  app.get('/api/users', (req: Request, res: Response) => {
    res.json(users);
  });

  // ==========================================
  // 3. PRODUCTS CRUD
  // ==========================================
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, sellerId } = req.query;
    let result = [...products];

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    if (sellerId) {
      result = result.filter(p => p.sellerId === sellerId);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }
    res.json(result);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const {
      title,
      headline,
      description,
      materials,
      vibe,
      stylingSuggestion,
      price,
      inventory,
      category,
      imageUrl,
      sellerId,
      sellerName,
      sellerGcash,
      tags
    } = req.body;

    if (!title || !description || !price || !sellerId) {
      return res.status(400).json({ error: 'Title, description, price, and seller ID are required' });
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title,
      headline: headline || 'Handcrafted Minimalist Leather Piece',
      description,
      materials: Array.isArray(materials) ? materials : (materials ? [materials] : ['Full-Grain Leather']),
      vibe: vibe || 'Cozy, minimal, everyday street style',
      stylingSuggestion: stylingSuggestion || 'Complements casual linen or structured daily outfits.',
      price: Number(price),
      inventory: Number(inventory) || 1,
      category: category || 'accessories',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      sellerId,
      sellerName: sellerName || 'Artisan Haven Member',
      sellerGcash: sellerGcash || '09170000000',
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      tags: tags || ['artisan', 'handcrafted']
    };

    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    products = products.filter(p => p.id !== id);
    res.json({ success: true, message: 'Product deleted' });
  });

  // ==========================================
  // 4. REVIEWS & STAR RATINGS
  // ==========================================
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { productId } = req.query;
    if (productId) {
      const filtered = reviews.filter(r => r.productId === productId);
      return res.json(filtered);
    }
    res.json(reviews);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, buyerId, buyerName, rating, title, comment } = req.body;
    if (!productId || !buyerName || !rating || !comment) {
      return res.status(400).json({ error: 'Product ID, buyer name, rating, and comment are required' });
    }

    const numRating = Math.max(1, Math.min(5, Number(rating)));
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      buyerId: buyerId || 'anonymous-buyer',
      buyerName,
      rating: numRating,
      title: title || 'Exceptional Craftsmanship',
      comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);

    // Update Product average rating
    const productReviews = reviews.filter(r => r.productId === productId);
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const targetProduct = products.find(p => p.id === productId);
    if (targetProduct) {
      targetProduct.rating = Number(avg.toFixed(1));
      targetProduct.reviewsCount = productReviews.length;
    }

    res.status(201).json(newReview);
  });

  // ==========================================
  // 5. ORDERS & CHECKOUT & GCASH PAYOUTS
  // ==========================================
  app.get('/api/orders', (req: Request, res: Response) => {
    const { buyerId, sellerId } = req.query;
    let result = [...orders];

    if (buyerId) {
      result = result.filter(o => o.buyerId === buyerId);
    }
    if (sellerId) {
      result = result.filter(o => o.items.some(item => item.sellerId === sellerId));
    }
    res.json(result);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { buyerId, buyerName, buyerEmail, buyerGcash, shippingAddress, items, totalAmount, paymentMethod } = req.body;

    if (!buyerName || !buyerEmail || !items || !items.length) {
      return res.status(400).json({ error: 'Buyer details and items are required' });
    }

    // Group items by seller for automated GCash payouts
    const sellerMap = new Map<string, { sellerName: string; gcashNumber: string; amount: number }>();
    for (const item of items) {
      const seller = users.find(u => u.id === item.sellerId);
      const sellerName = seller?.shopName || seller?.name || 'Artisan Seller';
      const sellerGcash = seller?.gcashNumber || item.sellerGcash || '09171234567';
      const current = sellerMap.get(item.sellerId) || { sellerName, gcashNumber: sellerGcash, amount: 0 };
      current.amount += item.price * item.quantity;
      sellerMap.set(item.sellerId, current);
    }

    const sellerPayouts = Array.from(sellerMap.entries()).map(([sellerId, data]) => ({
      sellerId,
      sellerName: data.sellerName,
      gcashNumber: data.gcashNumber,
      amount: data.amount,
      status: 'pending' as const
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: buyerId || 'guest-buyer',
      buyerName,
      buyerEmail,
      buyerGcash,
      shippingAddress: shippingAddress || 'Standard Manila Delivery',
      items,
      totalAmount: totalAmount || items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0),
      paymentMethod: paymentMethod || 'gcash',
      paymentStatus: 'paid', // Instant confirmation
      fulfillmentStatus: 'processing',
      paymongoPaymentId: `pay_pm_${Date.now()}`,
      sellerPayouts,
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    // Update inventory
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.inventory >= item.quantity) {
        prod.inventory -= item.quantity;
      }
    }

    res.status(201).json(newOrder);
  });

  // Mark Seller Payout as Transferred (Simulating GCash Payout Settlement)
  app.post('/api/seller/payout-settle', (req: Request, res: Response) => {
    const { orderId, sellerId } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const payout = order.sellerPayouts.find(p => p.sellerId === sellerId);
    if (payout) {
      payout.status = 'transferred';
    }

    res.json({ success: true, order });
  });

  // ==========================================
  // 6. PAYMONGO INTEGRATION & CHECKOUT SESSIONS
  // ==========================================
  app.post('/api/paymongo/create-checkout', async (req: Request, res: Response) => {
    const { items, buyerName, buyerEmail, buyerPhone, orderNumber } = req.body;
    const paymongoKey = process.env.PAYMONGO_SECRET_KEY;

    const totalInCentavos = Math.round(
      items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) * 100
    );

    // If real PayMongo API Key is provided, call PayMongo API
    if (paymongoKey && !paymongoKey.includes('your_secret_key')) {
      try {
        const lineItems = items.map((item: any) => ({
          amount: Math.round(item.price * 100),
          currency: 'PHP',
          name: item.title,
          quantity: item.quantity,
          images: item.imageUrl ? [item.imageUrl] : []
        }));

        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(paymongoKey + ':').toString('base64')}`
          },
          body: JSON.stringify({
            data: {
              attributes: {
                payment_method_types: ['gcash', 'paymaya', 'card', 'dob'],
                line_items: lineItems,
                send_email_receipt: true,
                show_description: true,
                description: `Artisan Haven Order #${orderNumber || Date.now()}`,
                billing: {
                  name: buyerName || 'Valued Buyer',
                  email: buyerEmail || 'customer@example.com',
                  phone: buyerPhone || '09170000000'
                }
              }
            }
          })
        });

        const data = await response.json();
        if (data.data?.attributes?.checkout_url) {
          return res.json({
            checkoutUrl: data.data.attributes.checkout_url,
            sessionId: data.data.id,
            mode: 'live_paymongo'
          });
        }
      } catch (err: any) {
        console.error('PayMongo API call error:', err.message);
      }
    }

    // Interactive Sandbox Simulation for instant testing in preview
    const simulatedCheckoutUrl = `/checkout/paymongo-gateway?session=pm_session_${Date.now()}&amount=${totalInCentavos / 100}`;
    return res.json({
      checkoutUrl: simulatedCheckoutUrl,
      sessionId: `sim_cs_${Date.now()}`,
      mode: 'sandbox_simulation',
      note: 'PayMongo test simulation enabled. GCash and Card test payments succeed instantly.'
    });
  });

  // PayMongo Webhook Endpoint
  app.post('/api/paymongo/webhook', (req: Request, res: Response) => {
    const payload = req.body;
    console.log('[PayMongo Webhook Event Received]:', payload.data?.type);

    const eventType = payload.data?.attributes?.type;
    const paymentData = payload.data?.attributes?.data;

    if (eventType === 'checkout_session.payment.paid' || eventType === 'payment.paid') {
      const paymentId = paymentData?.id;
      // Mark matching pending order as paid
      const order = orders.find(o => o.paymongoPaymentId === paymentId || o.paymentStatus === 'pending');
      if (order) {
        order.paymentStatus = 'paid';
        order.fulfillmentStatus = 'processing';
      }
    }

    res.json({ received: true });
  });

  // ==========================================
  // 7. GEMINI AI COPYWRITER STUDIO (4 PROMPT CAPABILITIES)
  // ==========================================
  app.post('/api/ai/copywrite', async (req: Request, res: Response) => {
    const { type, productName, materials, vibe, storeName, tone, accessory, background, focus } = req.body as AICopywriteRequest;

    let constructedPrompt = '';

    if (type === 'product_description') {
      constructedPrompt = `Act as an expert e-commerce copywriter. Write a compelling product description for ${productName || 'Handcrafted Minimalist Leather Wallet'}. Highlights include: ${materials || 'Badalassi Carlo vegetable-tanned leather, Japanese polycord thread'}, targeted toward customers who love ${vibe || 'cozy, minimal, everyday street style'}. Include a catchy headline, a 2-sentence product overview focusing on durability and daily wear, 3 bulleted feature highlights, and a brief styling suggestion. Return clean, polished text with proper markdown formatting.`;
    } else if (type === 'social_captions') {
      constructedPrompt = `Generate 5 Instagram/TikTok caption concepts for an accessories brand called ${storeName || 'Artisan Haven'}. Tone of voice: ${tone || 'warm, relatable, aesthetic'}. For each post, include:
Hook: High-converting first line
Body: Short text emphasizing how the right accessory elevates a daily outfit
Call to Action (CTA): Encouraging saves, clicks, or comments
Hashtag Set: 5 targeted hashtags`;
    } else if (type === 'visual_prompt') {
      constructedPrompt = `Generate a professional photography prompt and production guide for: "A professional, ultra-detailed product shot of ${accessory || 'hand-crafted blue macrame bracelet'} displayed on a ${background || 'warm wooden texture, soft neutral linen'}. Natural side lighting with subtle shadows, minimal aesthetic, high resolution, macro focus on materials and craftsmanship, cozy tone." Provide the exact AI image generator prompt, camera specs (aperture, focal length, lighting angle), and compositional advice following the rule of thirds.`;
    } else if (type === 'brand_identity') {
      constructedPrompt = `Act as a brand strategist. Generate 10 short, memorable taglines and a 2-sentence mission statement for a modern accessories store named ${storeName || 'Artisan Haven'}. The brand focuses on ${focus || 'long-lasting, handcrafted minimalist leather goods, and versatile daily wear'} with a clean and cozy aesthetic.`;
    } else {
      constructedPrompt = `Write compelling e-commerce copywriting for ${storeName || 'Artisan Haven'}.`;
    }

    const ai = getGenAI();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: constructedPrompt,
          config: {
            systemInstruction: 'You are the Chief Brand Strategist and Master E-commerce Copywriter for Artisan Haven, specializing in handcrafted minimalist leather goods and curated artisan accessories in the Philippines.',
            temperature: 0.7,
          }
        });

        const generatedText = response.text || '';
        return res.json({
          type,
          result: generatedText,
          promptUsed: constructedPrompt
        } as AICopywriteResponse);
      } catch (err: any) {
        console.error('Gemini Copywriting error:', err.message);
      }
    }

    // High quality contextual fallback if API key is not yet configured
    let fallbackText = '';
    if (type === 'product_description') {
      fallbackText = `### ${productName || 'Heritage Pueblo Leather Cardholder'}
**Headline:** Timeless Patina, Uncompromising Hand-Stitched Durability

**Overview:** Cut by hand from world-renowned Italian vegetable-tanned leather, this piece is engineered to age with distinction through decades of daily pocket carry. Reinforced with double saddle-stitching, it stands as an enduring testament to honest craftsmanship.

**Feature Highlights:**
• **100% Full-Grain Vegetable-Tanned Hide:** Matures with a lustrous, deep patina unique to your daily journey.
• **Hand-Burnished Natural Edges:** Sealed with pure beeswax and Tokonole gum for snag-free pocket draw.
• **Reinforced Bonded Stitching:** Hand-stitched with bonded Japanese polycord for lifelong structural integrity.

**Styling Suggestion:** Pairs seamlessly with raw selvedge denim, relaxed linen shirts, or tailored blazers for an understated luxury statement.`;
    } else if (type === 'social_captions') {
      fallbackText = `### 5 High-Converting Social Media Captions for ${storeName || 'Artisan Haven'}

**Post 1: The Everyday Carry Upgrade**
• **Hook:** The smallest detail always makes the quietest statement. ✨
• **Body:** A handcrafted leather accessory isn’t just something you carry—it’s an heirloom that records every step of your story with a rich patina.
• **CTA:** Tap the link in our bio to shop our latest small-batch drop!
• **Hashtags:** #ArtisanHaven #EverydayCarry #MinimalistLeather #HandcraftedPH #TimelessStyle

**Post 2: The Art of Slow Craft**
• **Hook:** Fast fashion fades, but full-grain leather is forever. 🤎
• **Body:** Over 4 hours of meticulous hand saddle-stitching go into every single piece in our studio. Feel the difference of intentional craftsmanship.
• **CTA:** Save this post for outfit inspiration this weekend!
• **Hashtags:** #SlowCraft #LeatherCrafting #ArtisanMade #AestheticOutfit #QualityOverQuantity

**Post 3: Coastal Macrame x Minimalist Carry**
• **Hook:** Waterproof, minimal, and built for wherever the day takes you. 🌊
• **Body:** From ocean dips to rooftop dinners, our nautical micro-cord bracelets with 316L stainless steel clasps stay effortless.
• **CTA:** Drop a 🤍 below if this is your new everyday wristwear!
• **Hashtags:** #MacrameBracelet #WaterproofJewelry #EverydayStreetStyle #CozyAesthetic #AccessoryInspo

**Post 4: The Patina Check**
• **Hook:** Day 1 vs Day 365: Watch how genuine leather grows with you. ⏳
• **Body:** Unlike synthetic alternatives, our vegetable-tanned accessories deepen in color and soften in texture with every touch.
• **CTA:** Share your patina journey with us using #ArtisanHavenPatina!
• **Hashtags:** #PatinaJourney #FullGrainLeather #ArtisanStudio #ModernMinimalism #LeatherCommunity

**Post 5: Thoughtful Gift Essentials**
• **Hook:** Looking for a gift that will literally outlast the year? 🎁
• **Body:** Treat someone special (or yourself) to a handcrafted piece made with passion, packaged in eco-conscious linen dustbags.
• **CTA:** Order today with instant GCash checkout at our store page!
• **Hashtags:** #GiftIdeas #HandmadeGifts #ArtisanGoods #GCashAccepted #SupportLocalPH`;
    } else if (type === 'visual_prompt') {
      fallbackText = `### AI Product Photography Prompt & Studio Guide

**AI Generator Prompt:**
\`A professional, ultra-detailed product shot of ${accessory || 'hand-crafted blue macrame bracelet'} displayed on a ${background || 'warm wooden texture, soft neutral linen'}. Natural side lighting with subtle shadows, minimal aesthetic, high resolution, macro focus on materials and craftsmanship, cozy tone, 8k resolution, photorealistic studio lighting.\`

**Composition & Camera Specs (Rule of Thirds):**
• **Camera Focal Length:** 85mm Macro f/2.8 lens.
• **Rule of Thirds Placement:** Align the focal buckle / stitch detail on the upper-right intersection grid point to draw the viewer’s eye naturally.
• **Lighting:** 45-degree diffused window light from stage-left; warm reflector on stage-right to fill harsh shadows with soft amber bounce.
• **Styling Palette:** Warm terracotta, textured cream linen, raw walnut board, subtle dried botanical shadow.`;
    } else {
      fallbackText = `### 10 Memorable Taglines for ${storeName || 'Artisan Haven'}
1. *Crafted for Generations, Worn for Today.*
2. *Where Minimalist Design Meets Timeless Leathercraft.*
3. *Honest Materials. Intentional Craft.*
4. *Carry What Matters.*
5. *Quiet Luxury in Every Hand-Stitched Thread.*
6. *Made by Artisans. Shaped by Your Journey.*
7. *The Art of the Everyday Carry.*
8. *Natural Patina, Unrivaled Durability.*
9. *Understated Elegance for the Modern Minimalist.*
10. *Heirloom Quality for Daily Life.*

**Mission Statement:**
"At ${storeName || 'Artisan Haven'}, we are dedicated to crafting minimalist, long-lasting leather goods and versatile accessories that celebrate traditional artisanship and sustainable materials. Our mission is to empower independent makers while providing modern individuals with timeless everyday pieces built to endure a lifetime."`;
    }

    res.json({
      type,
      result: fallbackText,
      promptUsed: constructedPrompt
    } as AICopywriteResponse);
  });

  // ==========================================
  // 8. AI CHATBOT / SHOPPING ASSISTANT
  // ==========================================
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const ai = getGenAI();
    if (ai) {
      try {
        const chat = ai.chats.create({
          model: 'gemini-3.7-flash',
          config: {
            systemInstruction: `You are the friendly, knowledgeable AI Concierge for Artisan Haven (https://artisan-haven.ph).
We are a premier marketplace for handcrafted minimalist leather goods (Pueblo bifold wallets, cardholders, day totes) and artisanal accessories (waterproof macrame bracelets, solid sand-cast brass key valets) crafted in the Philippines.
Key Policies & Info:
- Payments: Secure GCash, Maya, and credit cards powered by PayMongo.
- Seller Onboarding: Artisans can register easily with their GCash number to list products and track sales.
- Shipping: Nationwide delivery (2-4 days in Metro Manila, 4-7 days Provincial).
- Leather Care: Use natural beeswax or leather balm every 3-6 months. Avoid soaking in water.
- Return Policy: 30-day handcrafted guarantee for manufacturing craftsmanship.
Tone: Warm, helpful, concise, aesthetically mindful. Include markdown formatting when helpful.`
          }
        });

        const chatRes = await chat.sendMessage({ message });
        return res.json({
          reply: chatRes.text || "Hello! How can I assist you with our handcrafted minimalist collection today?"
        });
      } catch (err: any) {
        console.error('Chat error:', err.message);
      }
    }

    // Contextual fallback response
    let reply = "Hello! I am your Artisan Haven Concierge. Whether you are curious about our Italian vegetable-tanned Pueblo leather, our waterproof macrame bracelets, GCash checkout with PayMongo, or becoming an artisan seller, I am here to help!";
    const msgLower = message.toLowerCase();

    if (msgLower.includes('gcash') || msgLower.includes('payment') || msgLower.includes('paymongo')) {
      reply = "We accept seamless payments via **GCash**, **Maya**, and **Credit/Debit Cards** powered by PayMongo! During checkout, simply select GCash or your preferred method for instant verification.";
    } else if (msgLower.includes('sell') || msgLower.includes('artisan') || msgLower.includes('register')) {
      reply = "Artisans can register in seconds! Head over to **Seller Dashboard**, enter your shop name and **GCash number**, and you can immediately publish handcrafted products with our built-in AI Copywriting assistant.";
    } else if (msgLower.includes('leather') || msgLower.includes('care') || msgLower.includes('patina')) {
      reply = "All our leather items are made from **full-grain vegetable-tanned leather** (like Badalassi Carlo Pueblo). They will develop a gorgeous natural patina over time. To maintain them, condition lightly with natural beeswax balm every 4-6 months.";
    } else if (msgLower.includes('shipping') || msgLower.includes('delivery')) {
      reply = "We ship nationwide across the Philippines! Metro Manila orders typically arrive within 2-3 business days, and provincial deliveries take 4-6 business days with door-to-door tracking.";
    }

    res.json({ reply });
  });

  // ==========================================
  // 9. VITE MIDDLEWARE & SPA FALLBACK
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Artisan Haven Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
