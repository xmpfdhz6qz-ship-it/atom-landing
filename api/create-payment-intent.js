import Stripe from 'stripe';
import { ALLOWED_PRICES } from './_lib/stripePrices.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, customer } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }
    if (!customer || !customer.email) {
      return res.status(400).json({ error: 'Missing customer email' });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(customer.email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const seen = new Set();
    const lineItems = [];
    let product = null;

    for (const it of items) {
      const meta = ALLOWED_PRICES[it && it.priceId];
      if (!meta) return res.status(400).json({ error: 'Unknown price: ' + (it && it.priceId) });
      if (seen.has(it.priceId)) continue;
      seen.add(it.priceId);
      if (product && product !== meta.product) {
        return res.status(400).json({ error: 'Cannot mix products in one order' });
      }
      product = meta.product;
      lineItems.push({ priceId: it.priceId, name: meta.name });
    }

    // Store URL is required for store-audit style products, not for a report unlock.
    if (product !== 'report-unlock' && !customer.storeUrl) {
      return res.status(400).json({ error: 'Missing store URL' });
    }
    if (product === 'report-unlock' && !customer.reportSlug) {
      return res.status(400).json({ error: 'Missing report slug' });
    }

    let amountTotal = 0;
    const resolvedIds = [];
    for (const li of lineItems) {
      const price = await stripe.prices.retrieve(li.priceId);
      amountTotal += price.unit_amount;
      resolvedIds.push(li.priceId);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTotal,
      currency: 'usd',
      receipt_email: customer.email,
      metadata: {
        product,
        customer_email: customer.email,
        customer_name: (customer.name || '').slice(0, 200),
        store_url: (customer.storeUrl || '').slice(0, 300),
        report_slug: (customer.reportSlug || '').slice(0, 200),
        item_ids: resolvedIds.join(','),
      },
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret, amountTotal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not start checkout. Please try again.' });
  }
}
