import Stripe from 'stripe';
import { ALLOWED_PRICES } from './_lib/stripePrices.js';

// Stripe requires the raw, unparsed request body to verify the signature.
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook Error: ' + err.message);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const md = pi.metadata || {};
    const itemIds = (md.item_ids || '').split(',').filter(Boolean);
    const items = itemIds.map((id) => {
      const meta = ALLOWED_PRICES[id];
      return { priceId: id, name: meta ? meta.name : id };
    });

    const payload = {
      stripe_payment_intent_id: pi.id,
      product: md.product || '',
      amount_total: pi.amount,
      currency: pi.currency,
      customer_email: md.customer_email || pi.receipt_email || '',
      customer_name: md.customer_name || '',
      store_url: md.store_url || '',
      items,
      created_at: new Date(pi.created * 1000).toISOString(),
    };

    try {
      await fetch('https://n8n-production-1d7c.up.railway.app/webhook/order-received', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.error('Failed to forward order to n8n:', err);
    }
  }

  return res.status(200).json({ received: true });
}
