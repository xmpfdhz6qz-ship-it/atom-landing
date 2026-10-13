// Serves robots.txt, llms.txt and the sitemaps while logging AI-bot hits.
//
// Why this exists: these paths are routed in vercel.json straight to static
// files / n8n, and those routes bypass middleware.js, so AI bot requests to
// them were never written to ai_visits (verified 2026-10-06: a GPTBot curl to
// "/" was logged, to /robots.txt and /llms.txt was not). This function logs
// the hit with the same beacon payload as middleware.js, then returns the
// exact same content as before.

import fs from 'fs';
import path from 'path';

const N8N_BASE = 'https://n8n-production-1d7c.up.railway.app/webhook';

const FILES = {
  'robots.txt': 'text/plain; charset=utf-8',
  'llms.txt': 'text/plain; charset=utf-8',
  'sitemap-pages.xml': 'application/xml; charset=utf-8',
};

const RETRIEVAL = /^(OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|Claude-Web|Claude-User|DuckAssistBot|YouBot)$/i;
const TRAINING  = /^(GPTBot|ClaudeBot|anthropic-ai|CCBot|Google-Extended|Applebot-Extended|Bytespider|meta-externalagent|cohere-ai)$/i;
const SEARCH    = /^(Applebot|Amazonbot|Diffbot|Timpibot)$/i;
const AI_BOTS = /(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|Claude-User|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|Applebot|Amazonbot|CCBot|Bytespider|meta-externalagent|cohere-ai|YouBot|Diffbot|Timpibot|DuckAssistBot)/i;

function botType(bot) {
  if (RETRIEVAL.test(bot)) return 'retrieval';
  if (TRAINING.test(bot))  return 'training';
  if (SEARCH.test(bot))    return 'search';
  return 'other';
}

export default async function handler(req, res) {
  const f = String(req.query.f || '');
  const sitemapIndex = f === 'sitemap.xml';
  const storesPage = /^\d+$/.test(String(req.query.stores || '')) ? String(req.query.stores) : '';
  const isFile = Object.prototype.hasOwnProperty.call(FILES, f);
  if (!isFile && !sitemapIndex && !storesPage) {
    res.status(404).send('Not found');
    return;
  }

  const logicalPath = storesPage ? `/sitemap-stores-${storesPage}.xml` : `/${f}`;
  const ua = String(req.headers['user-agent'] || '');
  const m = ua.match(AI_BOTS);
  if (m) {
    try {
      await fetch(`${N8N_BASE}/ai-visit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          bot: m[1],
          bot_type: botType(m[1]),
          method: req.method,
          path: logicalPath,
          is_store: false,
          store_domain: '',
          country: String(req.headers['x-vercel-ip-country'] || ''),
          referer: String(req.headers['referer'] || ''),
          ua: ua.slice(0, 300),
        }),
        signal: AbortSignal.timeout(2000),
      });
    } catch (e) {
      // never block the response if logging fails
    }
  }

  try {
    if (isFile) {
      const body = fs.readFileSync(path.join(process.cwd(), f), 'utf-8');
      res.setHeader('Content-Type', FILES[f]);
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
      res.status(200).send(body);
      return;
    }
    const upstream = sitemapIndex
      ? `${N8N_BASE}/sitemap`
      : `${N8N_BASE}/sitemap-stores?page=${storesPage}`;
    const r = await fetch(upstream);
    const body = await r.text();
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).send('Upstream error');
  }
}
