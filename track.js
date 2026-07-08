// Atom Foundry — lightweight AI-visit beacon (fires only for AI/bot user-agents).
(function () {
  try {
    var ua = navigator.userAgent || '';
    var AI = /(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|Claude-User|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|Applebot|Amazonbot|CCBot|Bytespider|meta-externalagent|cohere-ai|YouBot|Diffbot|Timpibot|DuckAssistBot|Googlebot|bingbot)/i;
    var m = ua.match(AI);
    if (!m) return;
    var bot = m[1];
    var RET = /^(OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|Claude-Web|Claude-User|DuckAssistBot|YouBot)$/i;
    var TRA = /^(GPTBot|ClaudeBot|anthropic-ai|CCBot|Google-Extended|Applebot-Extended|Bytespider|meta-externalagent|cohere-ai)$/i;
    var SEA = /^(Applebot|Amazonbot|Diffbot|Timpibot|Googlebot|bingbot)$/i;
    var bot_type = RET.test(bot) ? 'retrieval' : TRA.test(bot) ? 'training' : SEA.test(bot) ? 'search' : 'other';
    var path = location.pathname;
    var isStore = path.indexOf('/store/') === 0;
    var storeDomain = '';
    if (isStore) { try { storeDomain = decodeURIComponent(path.slice(7)).split('/')[0].toLowerCase(); } catch (e) {} }
    var payload = JSON.stringify({
      bot: bot, bot_type: bot_type, method: 'GET', path: path,
      is_store: isStore, store_domain: storeDomain,
      country: '', referer: document.referrer || '', ua: ua.slice(0, 300)
    });
    var url = 'https://n8n-production-1d7c.up.railway.app/webhook/ai-visit';
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
    }
  } catch (e) {}
})();
