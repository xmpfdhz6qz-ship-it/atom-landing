// Vercel Edge Middleware — logs AI crawler/agent visits (whole site).
// No dependencies, no build step. Only AI bots trigger a beacon; real users
// pass straight through. Fire-and-forget with a 2s timeout — never blocks a page.

export const config = {
  // Pages + text/xml (llms.txt, robots.txt, sitemaps); SKIP static assets.
  matcher: ['/((?!_next|assets|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|mjs|woff|woff2|ttf|eot|map)$).*)'],
};

// bot -> type. retrieval = answering a user right now; training = parametric memory.
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

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const m = ua.match(AI_BOTS);
  if (m) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const isStore = path.startsWith('/store/');
      let storeDomain = '';
      if (isStore) {
        try { storeDomain = decodeURIComponent(path.slice('/store/'.length)).split('/')[0]; } catch (e) {}
      }
      await fetch('https://n8n-production-1d7c.up.railway.app/webhook/ai-visit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          bot: m[1],
          bot_type: botType(m[1]),
          method: request.method,
          path: path,
          is_store: isStore,
          store_domain: storeDomain,
          country: request.headers.get('x-vercel-ip-country') || '',
          referer: request.headers.get('referer') || '',
          ua: ua.slice(0, 300),
        }),
        signal: AbortSignal.timeout(2000),
      });
    } catch (e) {
      // never block the page if logging fails
    }
  }
  // returning nothing = continue to the normal destination
}
