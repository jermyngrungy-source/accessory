import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body.data;
    const eventType = event.attributes.type;

    if (eventType === 'checkout_session.payment.paid') {
      const checkoutSession = event.attributes.data;
      const orderId = checkoutSession.attributes.metadata?.order_id;

      if (orderId) {
        // Update order status to paid
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
