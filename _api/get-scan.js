import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.CRAWLER_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    const { domain } = req.query;

  if (!domain) {
        return res.status(400).json({ error: 'Missing domain' });
  }

  try {
        const client = await pool.connect();

      const result = await client.query(
              `SELECT * FROM ai_readiness_scans WHERE domain = $1 ORDER BY scanned_at DESC LIMIT 1`,
              [domain]
            );

      client.release();

      if (result.rows.length === 0) {
              return res.status(404).json({ error: 'not_found' });
      }

      const scan = result.rows[0];

      return res.status(200).json({
              domain: scan.domain,
              url: scan.url,
              scanned_at: scan.scanned_at,
              total_score: scan.total_score,
              readiness_level: scan.readiness_level,
              biggest_gap: scan.biggest_gap,
              schema_score: scan.schema_score,
              content_score: scan.content_score,
              trust_score: scan.trust_score,
              technical_score: scan.technical_score,
              price_score: scan.price_score,
              brand_score: scan.brand_score,
              all_signals: scan.all_signals,
              all_missing: scan.all_missing,
              main_leak: scan.report_json?.main_leak || null,
              quick_fix: scan.report_json?.quick_fix || null,
      });

  } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
  }
}
