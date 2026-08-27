import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 1. Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productId, buyerId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Missing productId parameter' });
  }

  try {
    // 2. Fetch product details from Supabase
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 3. Create pending order entry in Supabase database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: buyerId || null,
        seller_id: product.seller_id,
        product_id: product.id,
        amount: product.price,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      return res.status(500).json({ error: 'Failed to record order', details: orderError.message });
    }

    // 4. Encode PayMongo Secret Key in Base64 for Basic Authorization
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: 'sk_live_1Sep9t17sMFPxoSFp7q3jWCA' });
    }
    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;

    // PayMongo requires price in centavos (PHP 100.00 = 10000)
    const amountInCentavos = Math.round(parseFloat(product.price) * 100);

    // 5. Call PayMongo Checkout API
    const paymongoResponse = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: 'PHP',
                amount: amountInCentavos,
                description: product.description || 'Handcrafted minimalist good',
                name: product.title,
                quantity: 1,
                images: product.image_url ? [product.image_url] : []
              }
            ],
            payment_method_types: ['gcash', 'card', 'paymaya', 'grab_pay'],
            reference_number: order.id, // Store order ID for webhooks tracking
            success_url: `${req.headers.origin || 'http://localhost:3000'}?payment=success&orderId=${order.id}`,
            cancel_url: `${req.headers.origin || 'http://localhost:3000'}?payment=cancelled`
          }
        }
      })
    });

    const paymongoData = await paymongoResponse.json();

    if (!paymongoResponse.ok) {
      return res.status(paymongoResponse.status).json({
        error: 'PayMongo API Error',
        details: paymongoData.errors
      });
    }

    // 6. Return the Checkout URL to frontend
    const checkoutUrl = paymongoData.data.attributes.checkout_url;
    return res.status(200).json({ checkoutUrl, orderId: order.id });

  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
