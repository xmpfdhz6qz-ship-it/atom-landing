import Stripe from 'stripe';
import { Pool } from 'pg';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const pool = new Pool({
  connectionString: process.env.REPORTS_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function genToken() {
  return crypto.randomBytes(24).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug, token, pi } = req.query;
  if (!slug || (!token && !pi)) {
    return res.status(400).json({ error: 'Missing slug and token or pi' });
  }

  const client = await pool.connect();
  try {
    const reportRes = await client.query(
      "SELECT id, gated_findings FROM recommendation_reports WHERE slug = $1 AND status = 'published'",
      [slug]
    );
    const report = reportRes.rows[0];
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Path 1: returning visitor with an already-issued token.
    if (token) {
      const accessRes = await client.query(
        'SELECT id FROM recommendation_report_access WHERE token = $1 AND report_id = $2',
        [token, report.id]
      );
      if (!accessRes.rows[0]) return res.status(403).json({ unlocked: false });
      return res.status(200).json({ unlocked: true, gated: report.gated_findings });
    }

    // Path 2: fresh purchase, proven by a Stripe payment_intent id.
    const existing = await client.query(
      'SELECT token FROM recommendation_report_access WHERE stripe_payment_intent_id = $1',
      [pi]
    );
    if (existing.rows[0]) {
      return res.status(200).json({ unlocked: true, token: existing.rows[0].token, gated: report.gated_findings });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(pi);
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      return res.status(403).json({ unlocked: false, error: 'Payment not confirmed.' });
    }
    const md = paymentIntent.metadata || {};
    if (md.product !== 'report-unlock' || md.report_slug !== slug) {
      return res.status(403).json({ unlocked: false, error: 'Payment does not match this report.' });
    }

    const newToken = genToken();
    const insertRes = await client.query(
      `INSERT INTO recommendation_report_access
        (report_id, token, customer_email, stripe_payment_intent_id, amount_paid, currency)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (stripe_payment_intent_id) DO UPDATE SET stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id
       RETURNING token`,
      [
        report.id,
        newToken,
        md.customer_email || paymentIntent.receipt_email || '',
        pi,
        paymentIntent.amount,
        paymentIntent.currency,
      ]
    );

    return res.status(200).json({ unlocked: true, token: insertRes.rows[0].token, gated: report.gated_findings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not verify access.' });
  } finally {
    client.release();
  }
}
