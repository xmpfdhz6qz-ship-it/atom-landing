# AI Agent Snapshot (Shopify app) — roadmap: detekce agentních plateb

Poznámka: pracovní poznámka pro Claude/Daniela mezi sessions, stejný účel jako
research-roadmap.md a content-pipeline-roadmap.md, jen pro AI Agent Snapshot
jako Shopify aplikaci. Není routovaná, není veřejná. Odloženo — vrátit se, až
bude čas.

## Podnět (2026-09-22)

Heather Hershey (Senior Research Director, IDC) publikovala na LinkedIn
dvoudílný post "Commerce Without Consent: Exploring the seller-side issues
with the Meta Muse model of B2C agentic commerce".

**Část 1:** Meta spustila Muse, osobního AI agenta (US, iOS/Android/muse.ai,
free tier, launch září 2026). Muse přes Stripe Link umí nakupovat na B2C
e-shopech autonomně — buď rovnou uloženým způsobem platby v Link peněžence
(1M+ obchodů), nebo přes jednorázovou virtuální kartu u ostatních obchodů.
Hersheyin bod: obchodníci nemají žádný spolehlivý způsob, jak takový nákup od
agenta odlišit od běžného lidského nákupu.

**Část 2:** Amazon omezil přístup Muse agentům — předvídatelné, protože Amazon
dělá strukturálně totéž přes vlastní "Buy for Me". Klíčový rozdíl oproti
Grok Botu: Muse platí autonomně (jednorázové virtuální karty bez potvrzení
člověkem), Grok Bot vrací platbu a 2FA vždy zpátky na uživatele. Hershey
považuje Muse za momentálně největší hrozbu pro provozovatele e-shopů na trhu.

## Proč se nás to týká

AI Agent Snapshot (dnes: `products/ai-agent-snapshot.html` + middleware
architektura z `middleware.js`/`track.js` pro atomfoundry.dev, analogicky
`shop_ai_visits` pro zákaznické Shopify obchody) dnes detekuje agenty čistě
přes **User-Agent regex matching** (GPTBot, ChatGPT-User, PerplexityBot,
Claude-Web, meta-externalagent, …). To je allowlist přístup: zachytí jen
agenty, kteří se sami identifikují známým stringem.

Muse (spotřebitelská appka, ne crawler) nemá důvod se prozrazovat — naopak,
po Amazonově blokaci má motivaci vypadat jako běžný browser provoz. A pokud
platba proběhne přes Stripe Link na úrovni API/protokolu bez načtení
vykreslené checkout stránky, middleware ani tracking snippet nemají vůbec
žádný HTTP request k zachycení.

Ověřeno (2026-09-22, web search): Stripe u Shared Payment Tokens (mechanismus
za Link agent wallet) explicitně zmiňuje, že "risk signals" jsou ukládané a
sdílené, a že obchodníci mohou přes Stripe Radar odlišit legitimní
agent-initiated transakci od podvodné. Tzn. Stripe u konkrétní transakce ví,
že šla přes agenta, a nějakou formou to dává k dispozici. Přesné pole/název
webhooku nutno ověřit v `docs.stripe.com/agentic-commerce/acp`, než se začne
stavět — zatím jen potvrzeno, že existuje, ne jak přesně vypadá.

## Navržené řešení, v pořadí priority

**1. Stripe webhook jako primární zdroj pravdy (ne page-level detekce).**
Pro obchody s přímo napojeným Stripe: listener na `charge.succeeded` /
`payment_intent.succeeded`, číst `payment_method_details` + risk/metadata
pole u SPT transakcí. Nejsilnější signál, protože nezávisí na tom, jestli se
agent na úrovni webu prozradí.

**2. Shopify order webhook jako fallback / doplněk.**
`orders/create`, `checkouts/create` — funguje bez ohledu na PSP. Párovat
objednávku s existující session v `shop_ai_visits` (cart token, IP, timing).
Objednávka bez odpovídající browsing historie = signál "agentic checkout,
obešel detekci na úrovni stránek". Nepotvrdí konkrétně Muse, ale potvrdí
obcházení.

**3. Page-level heuristiky jako podpůrná vrstva (nižší confidence, samostatně
nespolehlivé).**
- Rozšířit/průběžně sledovat UA seznam — nejdřív ale zkontrolovat reálné logy
  (atomfoundry.dev i zákaznické `shop_ai_visits`), jestli se od září
  neobjevil nový, dosud nerozpoznaný UA string z Meta ASN rozsahu. Empirický
  krok bez vývoje, udělat jako první.
- Heuristika "HTML request bez navazujících asset requestů" (CSS/JS/obrázky)
  ze stejné IP v krátkém okně — silnější signál než čistá rychlost.
- Časování (delta mezi po sobě jdoucími page-loady pod lidsky reálnou
  hranicí) — ale pozor: vyžaduje logovat *všechny* requesty, ne jen
  UA-matchnuté (dnešní middleware loguje až po matchi, takže žádná baseline
  data na porovnání zatím nejsou). A je to arms race — sofistikovaný agent se
  může sám zpomalit, aby splynul s lidským chováním.

**4. Plnohodnotný behaviorální fingerprinting (TLS/JA3, pořadí hlaviček) —
největší investice.**
Doporučení: neřešit vlastním vývojem, integrovat s existujícím
bot-management vendorem (Cloudflare Bot Management, DataDome, HUMAN) a číst
jejich bot score, spíš než stavět vlastní klasifikátor od nuly. Relevantní až
poté, co jsou hotové body 1-3.

## Kontext balíčku

Tohle je explicitně pro **Shopify app verzi AI Agent Snapshot** (Daniel chce
balík jako Shopify aplikaci, ne jen web dashboard). Až se na to půjde, zvážit
zapojení do "Act" a "Outcome" roadmap sekcí, které už na
`products/ai-agent-snapshot.html` existují (aktuálně označené jako Roadmap,
ne live) — tohle je jejich konkrétní technický plán.

## Status

Odloženo. Daniel: "chci aby si toto reseni dal kompletne do road mapy a pak
az bude cas tak se na to vrhneme." Nic z tohoto zatím není implementované.

## Potvrzení scope: problém není jen Meta Muse, je to celá kategorie agentic commerce protokolů (2026-10-01)

Podnět: Daniel sdílel Semrush blog článek "Universal Commerce Protocol
(UCP): What You Need to Know" (Tushar Pol, 26.3.2026) o Google UCP —
otevřený, vendor-agnostický standard spoluvyvinutý s Shopify, Etsy,
Wayfair, Target, Walmart a podpořený Visa/Mastercard/Stripe/Adyen,
umožňující agentům (Gemini, AI Mode) dokončit nákup jménem uživatele.
Březnová 2026 aktualizace přidala cart support a product catalog
access.

**Přímé potvrzení naší hypotézy z podnětu Heather Hershey výše:**
článek explicitně píše: "UCP-enabled transactions generate no
pageviews, no sessions, and no events on your website... Google
Analytics sees nothing." To je přesně ten samý mechanismus, který jsme
identifikovali u Meta Muse (Stripe Link checkout bez vykreslení
stránky = nulová HTTP stopa) — jen teď máme potvrzení, že to **není
specifikum jednoho hráče**, je to systémová vlastnost celé kategorie
agentic checkout protokolů, včetně Googlu vlastního UCP. Posiluje to
závěr výše: page-level detekce (user-agent, heuristiky) principiálně
nemůže tenhle typ transakce zachytit, je nutná detekce na úrovni
objednávky/platby (bod 1-2 v "Navržené řešení" výše).

**Nový konkrétní detekční signál: `/.well-known/ucp` manifest.** UCP
vyžaduje, aby obchod publikoval JSON manifest na téhle cestě, který
vyjmenovává, jaké capabilities obchod podporuje (checkout, identity
linking, order management, cart, product discovery/catalog). Agent
manifest načte při prvním kontaktu se storem — pokud chybí, je
neúplný nebo nejednoznačný, agent obchod z agentic checkoutu úplně
vynechá. To je:
1. Konkrétní, snadno strojově kontrolovatelný signál, analogický
   tomu, jak už kontrolujeme přítomnost `llms.txt` — dalo by se
   přidat jako nový faktor do AI Commerce Score nebo jako
   samostatná kontrola v AI Agent Snapshot.
2. Dobrý kandidát na rychlou kontrolu přímo na Founder Labu — zjistit,
   jestli je/není agentic-checkout-ready podle tohohle konkrétního,
   ověřitelného kritéria, nezávisle na zbytku detekční práce
   (Stripe webhook, order-level fallback), která zůstává hlavní
   prioritou podle pořadí výše.

**Další relevantní detaily z článku pro budoucí referenci:**
- UCP checkout aktuálně jede přes Google Pay/Google Wallet,
  PayPal podpora "forthcoming" (potvrzeno Googlem, datum neuvedeno).
- Merchant Center eligibility vyžaduje: definované return policies,
  customer support info, `native_commerce` atribut na úrovni
  produktu ve feedu, product identifiers mapované na checkout API.
- Data consistency napříč web/feed/třetí strany (Amazon apod.) je
  "hard requirement" — AI agent na rozdíl od člověka nepřehlédne
  nesrovnalost v ceně nebo chybějící return policy.
- Status k datu článku: UCP checkout dostupný jen vybraným US
  merchantům přes early access program, globální expanze plánovaná
  průběžně přes 2026.

Status: zapsáno jako potvrzení a rozšíření existujícího plánu výše,
nic implementováno. `/.well-known/ucp` manifest check zapsán jako
nový, samostatně rychle realizovatelný kandidát signálu — nezávislý
na hlavním Stripe/Shopify webhook plánu, může se udělat dřív/souběžně.
