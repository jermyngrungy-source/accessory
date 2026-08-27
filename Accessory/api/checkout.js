import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productId, buyerId } = req.body;

  try {
    // 1. Fetch product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 2. Create pending order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: buyerId,
        product_id: product.id,
        seller_id: product.seller_id,
        amount: product.price,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Request PayMongo Checkout Session
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            payment_method_types: ['gcash', 'card', 'paymaya'],
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(product.price * 100), // convert to centavos
                description: product.description || 'Office supply item',
                name: product.title,
                quantity: 1
              }
            ],
            success_url: `${req.headers.origin || 'https://' + req.headers.host}?status=success`,
            cancel_url: `${req.headers.origin || 'https://' + req.headers.host}?status=cancelled`,
            metadata: {
              order_id: order.id
            }
          }
        }
      })
    };

    const paymongoRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
    const paymongoData = await paymongoRes.json();

    if (!paymongoRes.ok) {
      throw new Error(paymongoData.errors?.[0]?.detail || 'PayMongo session creation failed');
    }

    // Save Checkout ID to order
    await supabase
      .from('orders')
      .update({ paymongo_checkout_id: paymongoData.data.id })
      .eq('id', order.id);

    return res.status(200).json({ checkoutUrl: paymongoData.data.attributes.checkout_url });
  } catch (err) {
    console.error('Checkout API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
