// Server-rendered /store/<domain> pages.
//
// Why this exists: store.html used to be served as-is (a static shell) for
// every single domain, with the real AI Commerce Score, store name, and
// meta/JSON-LD data filled in entirely by client-side JS after a fetch to
// n8n. That means any crawler, AI agent, or social-preview bot that doesn't
// execute JavaScript saw the exact same generic "Atom Foundry" title and a
// "--" placeholder score for all ~66k stores. This function fetches the
// real per-store data server-side and bakes the highest-value fields
// (title, description, canonical, og tags, JSON-LD score, the visible hero
// score, and the 8 factor rows) directly into the HTML before it's sent.
//
// Everything else on the page (Recommendation Journey, similar stores,
// what-if, reasoning) stays exactly as it was: client-rendered on top of
// this server-rendered shell. Real visitors with JS see zero difference
// except the correct number appearing slightly sooner; the client's own
// render()/updateSeo() functions overwrite these same elements the moment
// their fetch resolves, so there is no conflict or stale-data risk.

import fs from 'fs';
import path from 'path';

const N8N_BASE = 'https://n8n-production-1d7c.up.railway.app/webhook';

const FACTORS = [
  { key: 'visual_score', name: 'Semantic Visuals & Image Clarity', max: 15 },
  { key: 'schema_score', name: 'AI Structured Signals', max: 15 },
  { key: 'content_score', name: 'Core Technical & Interpretability', max: 15 },
  { key: 'trust_score', name: 'AI Trust & Transaction Confidence', max: 15 },
  { key: 'price_score', name: 'Commerce & Feed Accuracy', max: 15 },
  { key: 'intent_score', name: 'User Intent Match', max: 10 },
  { key: 'rec_score', name: 'Recommendation Confidence', max: 10 },
  { key: 'brand_score', name: 'External Authority Signals', max: 5 },
];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function storeNameFromDomain(domain) {
  const base = String(domain).split('.')[0].replace(/[-_]/g, ' ');
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function scoreColor(pct) {
  return pct >= 0.7 ? '#1D9E75' : pct >= 0.4 ? '#e0a233' : '#d93c3c';
}

function renderFactorRowsHtml(data) {
  return FACTORS.map((f) => {
    const raw = Number(data[f.key] ?? 0);
    const score = Math.min(Number.isFinite(raw) ? raw : 0, f.max);
    const pct = f.max > 0 ? score / f.max : 0;
    const pctRounded = Math.round(pct * 100);
    const color = scoreColor(pct);
    return (
      '<div class="factor-row"><div class="factor-left"><div class="factor-name">' +
      escapeHtml(f.name) +
      '</div><div class="factor-bar"><div class="factor-fill" style="width:' +
      pctRounded +
      '%;background:' +
      color +
      ';" data-target="' +
      pctRounded +
      '"></div></div></div><div class="factor-score" style="color:' +
      color +
      ';">' +
      score +
      '/' +
      f.max +
      '</div></div>'
    );
  }).join('');
}

function normalizeDomain(raw) {
  if (!raw) return '';
  return String(raw).toLowerCase().trim().replace(/^www\./, '');
}

// Hosting/DNS/registrar infrastructure that the discovery engine has picked
// up as false-positive "stores" (e.g. websitehostserver.net, dreamhost.com,
// ns1.inmotionhosting.com, hwclouds-dns.com). These were never candidates
// for a real store page. Keep this list in sync with the equivalent check
// in the "Normalize Discovered Stores" node (AI Readiness — Discovery
// Engine V2, n8n) so junk domains stop entering stores_queue at the source
// too; this is the render-time backstop for anything already queued or
// linked to from elsewhere.
const INFRA_PATTERNS = [/^ns\d*\./i, /^mx\d*\./i, /dns/i, /hosting/i];
const INFRA_DOMAINS = new Set([
  'websitehostserver.net',
  'dreamhost.com',
  'inmotionhosting.com',
  'hwclouds-dns.com',
  'godaddy.com',
  'bluehost.com',
  'hostgator.com',
  'namecheap.com',
  'domains.google',
  'cloudflare.com',
  'digitalocean.com',
  'akamai.com',
  'fastly.net',
]);

function isInfraDomain(domain) {
  if (INFRA_DOMAINS.has(domain)) return true;
  return INFRA_PATTERNS.some((p) => p.test(domain));
}

function buildJsonLd(domain, storeName, canonical, score) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': canonical + '#webpage',
        url: canonical,
        name: 'How AI sees ' + storeName,
        about: { '@id': canonical + '#store' },
        isPartOf: { '@id': 'https://atomfoundry.dev/#website' },
      },
      {
        '@type': 'Organization',
        '@id': canonical + '#store',
        name: storeName,
        url: 'https://' + domain,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'AI Commerce Score',
            value: score,
            maxValue: 100,
            description:
              'How ready this store is for AI shopping agents, measured by Atom Foundry.',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': canonical + '#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Atom Foundry', item: 'https://atomfoundry.dev/' },
          { '@type': 'ListItem', position: 2, name: 'Stores', item: 'https://atomfoundry.dev/stores' },
          { '@type': 'ListItem', position: 3, name: domain, item: canonical },
        ],
      },
    ],
  };
}

let templateCache = null;
function loadTemplate() {
  if (templateCache) return templateCache;
  const filePath = path.join(process.cwd(), 'store.html');
  templateCache = fs.readFileSync(filePath, 'utf-8');
  return templateCache;
}

export default async function handler(req, res) {
  const domain = normalizeDomain(req.query.domain);
  let html = loadTemplate();

  if (!domain) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex');
    res.status(200).send(html);
    return;
  }

  if (isInfraDomain(domain)) {
    // Hosting/DNS/registrar domain, never a real store candidate. Real
    // 404, not the 200+noindex "not yet scanned" shell, so this never
    // becomes a soft-404 crawlers keep re-checking.
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send('Not found.');
    return;
  }

  const canonical = 'https://atomfoundry.dev/store/' + domain;
  const storeName = storeNameFromDomain(domain);

  let record = null;
  // Tracks whether we actually got a clean answer from n8n ("no row for this
  // domain") vs. couldn't ask at all (network error, non-2xx, bad JSON). Only
  // the former is a confirmed "this isn't a real/scanned store" — the latter
  // is a transient failure and must never be treated as a 404, or a brief
  // n8n outage would deindex every already-scanned store page that happens
  // to be crawled during the blip.
  let fetchFailed = false;
  try {
    const r = await fetch(N8N_BASE + '/get-store?domain=' + encodeURIComponent(domain), {
      headers: { Accept: 'application/json' },
    });
    if (r.ok) {
      const data = await r.json();
      record = Array.isArray(data) ? data[0] : data && data.data ? data.data[0] : data;
      if (!record || !record.domain) record = null;
    } else {
      fetchFailed = true;
    }
  } catch (err) {
    console.error('store SSR fetch failed for ' + domain, err);
    fetchFailed = true;
    record = null;
  }

  if (record) {
    const score = Math.round(Number(record.total_score ?? 0));
    const title = 'How AI sees ' + storeName + ': Atom Foundry';
    const desc =
      'Watch how an AI shopping agent reads and understands ' +
      storeName +
      ' (' +
      domain +
      '), and see its AI Commerce Score.';
    const ogDesc =
      'Watch how an AI shopping agent reads and understands ' +
      storeName +
      ', and see its AI Commerce Score.';
    const factorRowsHtml = renderFactorRowsHtml(record);
    const jsonLd = JSON.stringify(buildJsonLd(domain, storeName, canonical, score));

    html = html
      .replace(
        '<title id="pageTitle">AI Commerce Score Report: Atom Foundry</title>',
        '<title id="pageTitle">' + escapeHtml(title) + '</title>'
      )
      .replace(
        '<meta name="description" id="pageDesc" content="Watch how an AI shopping agent reads and understands this store, measured across the AI Commerce Framework.">',
        '<meta name="description" id="pageDesc" content="' + escapeHtml(desc) + '">'
      )
      .replace(
        '<link rel="canonical" href="https://atomfoundry.dev/store" id="canonicalLink">',
        '<link rel="canonical" href="' + escapeHtml(canonical) + '" id="canonicalLink">'
      )
      .replace(
        '<meta property="og:title" id="ogTitle" content="AI Commerce Score Report: Atom Foundry">',
        '<meta property="og:title" id="ogTitle" content="' + escapeHtml('How AI sees ' + storeName) + '">'
      )
      .replace(
        '<meta property="og:description" id="ogDesc" content="Watch how an AI shopping agent reads and understands this store.">',
        '<meta property="og:description" id="ogDesc" content="' + escapeHtml(ogDesc) + '">'
      )
      .replace(
        '<div class="hero-meta-value" id="heroMetaScore">--</div>',
        '<div class="hero-meta-value" id="heroMetaScore">' + score + '</div>'
      )
      .replace(
        '<div id="factorRows"></div>',
        '<div id="factorRows">' + factorRowsHtml + '</div>'
      )
      .replace(
        '</head>',
        '<script type="application/ld+json" id="storeLd">' + jsonLd + '</script>\n</head>'
      );
  } else if (fetchFailed) {
    // Couldn't reach n8n / got a bad response — unknown state, not a
    // confirmed absence. Serve the honest "not yet scanned"-style shell as a
    // safe fallback rather than 404ing a domain that might actually be a
    // fully scanned, indexed store. Never cached at the edge (see headers
    // below) so this doesn't stick once n8n is back.
    const title = storeName + ': not yet scanned — Atom Foundry';
    const desc =
      'Atom Foundry has not scanned ' + domain + ' yet. Run a free scan to generate its AI Commerce Score report.';
    html = html
      .replace(
        '<title id="pageTitle">AI Commerce Score Report: Atom Foundry</title>',
        '<title id="pageTitle">' + escapeHtml(title) + '</title>'
      )
      .replace(
        '<meta name="description" id="pageDesc" content="Watch how an AI shopping agent reads and understands this store, measured across the AI Commerce Framework.">',
        '<meta name="description" id="pageDesc" content="' + escapeHtml(desc) + '">'
      )
      .replace(
        '<link rel="canonical" href="https://atomfoundry.dev/store" id="canonicalLink">',
        '<link rel="canonical" href="' + escapeHtml(canonical) + '" id="canonicalLink">'
      );
  } else {
    // n8n answered cleanly and confirmed: no record for this domain. This is
    // not a real store page and never will be unless someone runs a scan, so
    // it gets a real 404 instead of a 200+noindex shell. The old behavior
    // (200+noindex "not yet scanned" placeholder) is exactly what Search
    // Console was flagging as soft-404s across ~258 URLs: pages that return
    // success but have no real content, which Google crawls repeatedly
    // instead of just dropping. A real 404 tells it to stop.
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send('Not found. This store has not been scanned yet — run a free scan at https://atomfoundry.dev/scan.');
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  if (!record) {
    // Either genuinely unscanned-but-fetch-failed (handled above) — this
    // header only applies to that fallback path now, since the confirmed-
    // absent case already returned its own 404 response above.
    res.setHeader('X-Robots-Tag', 'noindex');
  }
  res.status(200).send(html);
}
