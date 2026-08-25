// GET /api/ai/discovery
//
// Why this exists: this endpoint was previously proxied to an external n8n
// webhook (see vercel.json history), and that webhook's "discovery" branch
// was returning an empty response, even though /api/ai/status and
// /api/ai/capabilities (the same n8n service, different branches) worked
// fine. llms.txt and /api/ai/status both advertise this endpoint as "a map
// of the site's key URLs", so a broken response here is a real gap for any
// AI agent or crawler that reads /api/ai/status first and then follows this
// URL expecting JSON.
//
// Fix: serve this one directly from a local Vercel function instead of
// depending on the external n8n webhook. No external call, no failure mode
// beyond Vercel itself being up, and one less moving part in the machine-
// readable surface of the site.

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  res.status(200).json({
    service: 'Atom Foundry',
    url: 'https://atomfoundry.dev',
    description: 'Machine-readable map of the key entry points on atomfoundry.dev, for AI agents, crawlers, and answer engines.',
    entry_points: {
      homepage: 'https://atomfoundry.dev',
      free_ai_commerce_score: 'https://atomfoundry.dev/scan',
      full_audit: 'https://atomfoundry.dev/products/ai-commerce-audit',
      methodology: 'https://atomfoundry.dev/methodology',
      vocabulary: 'https://atomfoundry.dev/vocabulary',
      learn_guides: 'https://atomfoundry.dev/vocabulary/learn',
      framework: 'https://atomfoundry.dev/framework',
      framework_7_layers: 'https://atomfoundry.dev/framework/7-layers',
      research_hub: 'https://atomfoundry.dev/research',
      how_ai_decides: 'https://atomfoundry.dev/research/how-ai-decides',
      flagship_report: 'https://atomfoundry.dev/research/ai-recommendations-across-commerce-2026',
      store_database: 'https://atomfoundry.dev/stores',
      store_detail_pattern: 'https://atomfoundry.dev/store/{domain}',
      category_benchmarks: 'https://atomfoundry.dev/benchmarks',
      products: 'https://atomfoundry.dev/products',
      ai_traffic_live: 'https://atomfoundry.dev/ai-signal',
      about: 'https://atomfoundry.dev/about'
    },
    legal: {
      privacy_policy: 'https://atomfoundry.dev/privacy-policy',
      terms_of_service: 'https://atomfoundry.dev/terms-of-service'
    },
    machine_readable: {
      llms_txt: 'https://atomfoundry.dev/llms.txt',
      sitemap: 'https://atomfoundry.dev/sitemap.xml',
      status_endpoint: 'https://atomfoundry.dev/api/ai/status',
      capabilities_endpoint: 'https://atomfoundry.dev/api/ai/capabilities'
    },
    last_updated: '2026-08-25T00:00:00Z'
  });
}
