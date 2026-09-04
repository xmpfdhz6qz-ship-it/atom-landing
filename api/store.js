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

  const canonical = 'https://atomfoundry.dev/store/' + domain;
  const storeName = storeNameFromDomain(domain);

  let record = null;
  try {
    const r = await fetch(N8N_BASE + '/get-store?domain=' + encodeURIComponent(domain), {
      headers: { Accept: 'application/json' },
    });
    if (r.ok) {
      const data = await r.json();
      record = Array.isArray(data) ? data[0] : data && data.data ? data.data[0] : data;
      if (!record || !record.domain) record = null;
    }
  } catch (err) {
    console.error('store SSR fetch failed for ' + domain, err);
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
  } else {
    // Domain not scanned yet (or the lookup failed) — still give crawlers an
    // honest, specific title/description instead of the generic default,
    // without inventing a score that doesn't exist.
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
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  if (!record) {
    // No completed scan for this domain: the page still renders (it doubles
    // as a lead-gen CTA for outreach targets), but there is no real content
    // yet, so tell crawlers not to index it. Prevents soft-404 "not yet
    // scanned" shells (arbitrary strings, hosting/DNS domains that were
    // never real stores, etc.) from burning crawl budget or diluting the
    // site with thin/duplicate content.
    res.setHeader('X-Robots-Tag', 'noindex');
  }
  res.status(200).send(html);
}
