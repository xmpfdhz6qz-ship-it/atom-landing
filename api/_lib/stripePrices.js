// Whitelisted Stripe Price IDs. Server-side source of truth -- the client
// only ever sends a priceId string, real amounts always come from Stripe
// itself (never trust a client-supplied amount).
export const ALLOWED_PRICES = {
  'price_1U68h32WiU5desc4eV2glsVb': { name: 'AI Readiness Report — Core', product: 'readiness-report' },
  'price_1U68hV2WiU5desc4KLxeNLaz': { name: 'AI Execution Blueprint', product: 'readiness-report' },
  'price_1U68hv2WiU5desc4YKPwAl5u': { name: 'AI Implementation Pack', product: 'readiness-report' },
  'price_1U68iL2WiU5desc4EfjWcewD': { name: 'AI Agentic Readiness Pack', product: 'readiness-report' },
  'price_1U68ij2WiU5desc4hy3PFywX': { name: 'AI Content Optimization', product: 'readiness-report' },
  'price_1U68j82WiU5desc4GVmkpKAW': { name: 'AI Structured Data Pack', product: 'readiness-report' },
  'price_1U68jP2WiU5desc46mAF6RKr': { name: 'AI Trust & Brand Pack', product: 'readiness-report' },
  'price_1U68ji2WiU5desc4gjejKqiR': { name: 'AI Visibility Re-Scan', product: 'readiness-report' },
  'price_1U68kL2WiU5desc4AwnHmtay': { name: 'Recommendation Intelligence', product: 'recommendation-intelligence' },
  'price_1UBAQk2WiU5desc4xmCCCWgl': { name: 'Recommendation Snapshot — Unlock', product: 'report-unlock' },
};
