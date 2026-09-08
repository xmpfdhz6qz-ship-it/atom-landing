# Atom Foundry — výzkumný roadmap (interní, neveřejné)

Poznámka: tohle je pracovní poznámka pro Claude/Daniela mezi sessions, ne veřejná stránka.
Není routovaná ve vercel.json, není v sitemap, není v llms.txt — záměrně.

## Kde jsme (stav k 2026-08-27)

Dosavadní teze, ověřená osmkrát nezávisle napříč pěti kategoriemi (20 000 doporučení,
1 490 značek): **doporučení je vlastnost paměti modelu, ne kvality obchodu — ale jakmile
je souboj blízký, model umí použít reálná data, a ne stejně.**

Vyřazené proměnné (nekorelují s frekvencí doporučení):
- kvalita obchodu / AI Commerce Score — r≈0 (Candidacy vs Selection, 60 924 obchodů)
- sláva značky (Wikipedia proxy) — vysvětlí 1,2 % (The Fame Study, opraveno, 872 značek)
- širší veřejná stopa (Wikipedia + Wikidata + stáří domény + GDELT zmínky) — dohromady jen
  11,2 %, žádný ze 4 signálů samostatně statisticky významný (Zdroj paměti, 95 značek)
- znalost webu modelem — 75,9 % správných domén, ale nesouvisí se stabilitou

Potvrzené proměnné (skutečně něco dělají):
- web search zapnuto/vypnuto — mění 77 % výběrů brandů
- vlastní minulé chování modelu — R²=61,4 %, nejsilnější signál v celé sérii,
  potvrzeno lock-in studií (86 % stejná #1 značka po 58 dnech / 6 sweepech)
- **NOVÉ (Volba kandidáta, 2026-08-27):** jakmile jsou dva brandy reálně blízko sebe,
  vloženo jedno srovnávací fakt najednou. Hodnocení/recenze zvrátí verdikt 100 % (160/160
  běhů, nulová variance), specifikace 41,9 %, cena jen 26,9 % (na hraně významnosti,
  p=0,055). Rating vs cena je staticky odlišné, p=0,0012. Šum baseline (párové srovnání
  bez dat) jen 11,2 %, mnohem čistší než 46–47 % šum u otevřených recall promptů.

Otevřené mezery, které si sami pojmenováváme na /research/how-ai-decides:
Evaluation je teď částečně zodpovězená (viz výše). Zbývá: Winner vs. Loser, kauzalita
důvodů (post-hoc vs. skutečné), Cold start (nové značky bez paměti) a vztah
doporučení→nákup jsou pořád otevřené.

## Odsouhlasené pořadí dalšího výzkumu (2026-08-26, Daniel)

**1. Volba kandidáta (Evaluation) — HOTOVO (2026-08-27)**
Otázka: Co rozhodne mezi 2-3 reálnými kandidáty, když jsou blízko sebe?
Výsledek: hodnocení/recenze je zdaleka nejsilnější páka (100 % follow, p<0,0001),
specifikace střední (81,9 % follow, p=0,0004), cena nejslabší (60,6 % follow, p=0,055,
neprošla po korekci). 16 kontestovaných párů z 50 otevřených promptů, 1 140 volání
modelu celkem. Publikováno jako Study #19: /research/candidate-evaluation.
Data + skripty: `research-prep/volba-kandidata/` (výsledky v `results.json`).

**2. Cold start — HOTOVO (2026-08-27)**
Otázka: Jak se do doporučení dostane značka, která nemá žádnou paměť
(nová, mimo trénovací okno)?
Výsledek: bez jakéhokoli důkazu vyhrála vymyšlená značka 0 z 360 běhů proti
zavedenému lídrovi kategorie (36 dominantních intentů). Recenze/hodnocení
otevřou dveře — 53,1 % vyhraných srovnání. PR zmínky (1,9 %) a objem
prodejů (0,3 %) skoro nic nezmění. 1 940 volání modelu celkem. Publikováno
jako Study #20: /research/cold-start.
Data + skripty: `research-prep/cold-start/` (výsledky v `results.json`).

**3. Zdroj paměti — HOTOVO (2026-08-27)**
Otázka: Co přesně tu paměť vytváří (širší otisk než jen Wikipedia)?
Rozsah: jen OpenAI (gpt-4o), bez cross-model srovnání — to je teď
nejsilnější kandidát na navazující studii (viz níže).
Výsledek: žádný ze 4 volně dostupných signálů (Wikipedia pageviews,
Wikidata sitelinks, stáří domény, GDELT mediální zmínky) není statisticky
významný samostatně (p>0,05 u všech čtyř, 95 značek). Wikipedia samotná
v této studii 2,3 % (konzistentní s 1,2 % z The Fame Study). Kombinovaný
model ze všech čtyř signálů 11,2 % (95% CI 3,8–37,5 %, n=50), pořád
hluboko pod 61,4 % z The Model Predicts Itself. Robustness-check na
přísnějším prahu (MIN_WINS≥2, 75 značek) potvrdil stejný závěr menšími
čísly (kombinovaně 6,1 %). Null hypotéza se nezamítá — širší veřejná
stopa není mechanismus paměti. Publikováno jako Study #21:
/research/memory-source.
Data + skripty: `research-prep/zdroj-pameti/` (výsledky v `results.json`,
MIN_WINS=1 běh; MIN_WINS=2 čísla jen v poznámkách, results.json byl
přepsán druhým během).

## Pokrytí decision path (stav k 2026-08-27)

9 fází na /research/how-ai-decides, vážený odhad pokrytí (Measured=100 %,
Partially Measured/Emerging=50 %, Open=0 %): **~67 %**.

| # | Fáze | Status | Studie |
|---|---|---|---|
| 1 | Memory | Partially Measured | The Fame Study, Zdroj paměti |
| 2 | Retrieval | Measured | Web Search vs AI Recommendations, 5× Category Reports |
| 3 | Understanding | Measured | Search Changes the Vocabulary, AI Understanding™ |
| 4 | Candidacy | Measured | Cold start, Candidacy vs Selection |
| 5 | Evaluation | Measured | Volba kandidáta |
| 6 | Recommendation | Measured | The Model Predicts Itself, The Model Confabulates, flagship 2026 |
| 7 | Stability | Emerging | Two Months Later (lock-in), AI Knows Your Website |
| 8 | Confidence | Emerging | The Model Hedges Most When It's Most Sure |
| 9 | Purchase | Open | — |

Nejslabší místa: Purchase má nula studií, Memory a Stability jsou jen
částečné i po dvou/dvou studiích každá.

## Další kandidáti na výzkum (2026-08-27)

**A. Cross-model paměť (Memory, navazuje na Zdroj paměti)**
Otázka: Je "paměť" univerzální napříč modely (GPT/Claude/Gemini), nebo
idiosynkratická jedné laboratoři? Zaparkováno v designu Zdroje paměti jako
limitace #5, čeká na Anthropic/Google API klíče. Levné znovupoužití
stejného closed-book baseline, jen 3× místo 1×.

**B. Recommendation Confidence (Confidence, nula studií zatím)**
Otázka: Liší se jazyk doporučení podle jistoty (hedging: "jedna z možností"
vs asertivní: "nejlepší volba"), a koreluje ta jistota se stabilitou
(lock-in) nebo s tím, jestli agent doporučení skutečně použije? Levné —
NLP klasifikace jazyka na existujících Phase 1 datech, žádné nové volání.

**C. První Founder Lab RCT (Stability/Recommendation, posun z korelace na kauzalitu)**
Otázka: Když cíleně změníme jeden signál na reálném kontrolovaném obchodě
(např. přidáme recenze), pohne se doporučení skutečně, ne jen v párovém
promptu? První skutečný experiment v sérii, dražší a pomalejší, ale
odpovídá na otázku, kterou žádná observační studie nemůže: kauzalita, ne
korelace. Přímo navazuje na poznámku k predikci níže.

**D. Doporučení → nákup (Purchase, bonus track, dlouhý horizont)**
Otázka: Vede doporučení k reálnému nákupu?
Proč bonus/později: závisí na dostupnosti agentic commerce dat (ChatGPT
Shopping apod.), zatím nemáme snadný způsob měření. AI Agent Snapshot
(živý produkt) může časem dodat reálná data místo simulace.
Status: zaparkováno, sledovat vývoj agentic commerce.

## Reakce na AIVO / brand.context v2.0 (2026-09-08)

Daniel poslal dva dokumenty AIVO (Paul Sheals & Tim de Rosen): white paper "Beyond
Visibility" (Linkage Gap, 1 427 probes, 22-brand cohort) a spec "brand.context v2.0"
(navrhovaný JSON-LD standard). Shrnutí, kde jsou oni skutečně dál, kde jsme dál my,
a jak to promítnout do naší roadmapy.

**Kde jsou skutečně dál:** mají přímý mechanismus "possession → deployment" (75,7 %
faktů, o kterých model tvrdí že je zná, se nepoužije při doporučení), multi-turn
tracking přežití značky (95,7 % rozpoznání na T1 → jen 12,7 % na T4) a counterfactual
injection na otevřeném (nezúženém) doporučení, který jim umožňuje rozlišit Linkage Gap
(aktivační problém, opravitelný) od Reasoning Gap (strukturální nevhodnost, needěláme
publikováním faktů). To je jemnější rozlišení, než co máme explicitně pojmenované my.

**Kde jsme dál my:** větší a širší ecommerce dataset (66 090 obchodů, 40 000+
doporučení, 1 490 značek vs jejich 1 427 probes/22 brand-SKU), Candidacy vs Selection
na 60 924 obchodech (getting into the game vs winning the game), kauzální
single-factor test (Volba kandidáta: rating 100 % vs specs 81,9 % vs cena 60,6 %) a
dlouhodobá persistence (The Model Predicts Itself, R²=61,4 % — jejich paper naopak
tvrdí, že to řeší possession-side infrastruktura, což naše data nepodporují).
brand.context / Layer 3 berou sami jako nedokázanou hypotézu (žádná platforma to dnes
nečte) — netestovat jako fakt, ale jako příležitost pro replikaci/kritiku.

**Nové studie navržené k replikaci/rozšíření (interní pracovní číslování #22-#26,
viz oprava níže — na veřejném webu Study #22 mezitím obsadila
`recommendation-confidence.html`, takže skutečná publikovaná čísla jsou o jednu
posunutá: #23-#27):**

- **Study #23 (pracovně "#22") — Possession vs Deployment.** Otázka: kolik faktů,
  které model tvrdí že o značce zná (samostatná konverzace "řekni mi o značce X"),
  se skutečně objeví v reálném doporučení (samostatná konverzace, nákupní kontext bez
  zmínky značky)? Přímá replikace jejich nejsilnějšího čísla (75,7 %) na ecommerce
  datech místo beauty/finance/travel. Rozšiřuje fázi Memory, používá stejný
  closed-book/open-book postup jako Zdroj paměti a The Model Confabulates.

- **Study #24 (pracovně "#23") — Multi-turn displacement (T1→T4).** Otázka: když je
  značka explicitně zmíněná na začátku konverzace, přežije do finálního doporučení po
  3-4 dotazech, nebo je nahrazena? Posiluje fázi Stability (dosud jen mezi-session
  lock-in, ne uvnitř jedné konverzace). Replikuje jejich headline číslo (87,3 %
  displacement).

- **Study #25 (pracovně "#24") — Fact injection na otevřeném doporučení.** Rozšíření
  Volby kandidáta: místo dvou už blízkých kandidátů začneme otevřeným promptem, kde
  značka X prohrává/chybí, vložíme jeden fakt a měříme (a) použije-li ho model, (b)
  změní-li se doporučení. Dá nám vlastní verzi Linkage Gap vs Reasoning Gap rozlišení,
  propojenou s Candidacy → Selection rámcem.

- **Study #26 (pracovně "#25") — Cross-platform retrieval efekt.** Otázka: liší se
  possession/deployment gap mezi produkty s defaultním live web retrievalem
  (Perplexity) a bez něj (plain ChatGPT)? Rozšiřuje Retrieval fázi, sdílí sběr dat s
  kandidátem A (cross-model paměť) — obojí čeká na Anthropic/Google/Perplexity API
  klíče.

- **Study #27 (pracovně "#26") — Founder Lab: field test structurovaných dat.**
  Konkrétní verze kandidáta C (první RCT): publikovat na Founder Lab obchodě
  strukturovaný soubor typu brand.context / JSON-LD a měřit doporučení před/po, beze
  změny čehokoli jiného. AIVO sami přiznávají, že žádná platforma dnes takový soubor
  nečte — to je testovatelné tvrzení, které nikdo zatím empiricky neověřil. Silný PR
  úhel navíc (testujeme konkrétní veřejně navržený standard).

**Navržené pořadí (od nejlevnějšího/nejdůležitějšího, veřejná čísla):** #23 → #24 →
#25 → B (Recommendation Confidence, nulové nové volání, mezitím publikováno jako
Study #22, viz oprava níže) → #26 + A (cross-model, blokováno na API klíčích) → #27 /
C (Founder Lab RCT, nejdražší a nejpomalejší, ale nejvíc nové) → D (Purchase, pořád
zaparkováno).

## Rozhodnutý postup + Study #23 postavená (2026-09-08, odpoledne)

Daniel: "navrhni postup v nasich research tak, aby to bylo presne jak potrebujeme
vcetne toho mereni z aivo... udelej to presne tak jak ty uznas za vhodne." Rozhodnutí:
jdeme přesně v pořadí z předchozí sekce, začínáme Possession vs Deployment (pracovně
"#22" v poznámkách výše, publikováno jako Study #23, viz oprava číslování níže),
protože je nejlevnější a replikuje jejich nejsilnější číslo (75,7 %).

**Study #23 — Possession vs Deployment — postavená, čeká jen na spuštění.**
Klíčové rozhodnutí designu: deployment strana studie (co model řekne v reálném
nákupním doporučení) se **znovupoužívá** z už existujících `scripts/*_results.json`
souborů z Recommendation Reports (400 reálných gpt-4o pozorování na značku, `raw_response`
i `brand_mentioned` flag už uložené) — žádné nové volání na tuhle část, přesně tak,
jak `zdroj-pameti` znovupoužívala `phase1_raw.csv`. Nové je jen possession probe (27
volání: 9 značek × 3 běhy, "co víš o téhle značce, vrať 6 faktů jako JSON") a judge
scoring (~270 volání: pro každou vzorkovanou `brand_mentioned=true` buňku zkontrolovat,
kolik z možessed faktů se v tom reálném doporučení objevilo). Celkem pod 300 nových
volání — zlomek nákladů předchozích studií (Volba kandidáta ~1 300, Cold start ~1 940),
protože nejdražší část (deployment-side data) už máme zaplacenou a ověřenou z 10 živých
reportů.

Kohorta: 9 z 10 Wave-1 brandů (Topicals vyřazen — 0/400 mentioned cells, nemá se s čím
srovnávat, samo o sobě je to ale zajímavá poznámka o čistém Candidacy selhání, ne
Linkage Gap). Statistika: deployment/gap rate s cluster bootstrap CI přes značky,
přímé srovnání s AIVO 75,7 % (CI 72,1–79,0 %), H3 korelace gap rate vs
`recommend_rate_pct` (n=9, explicitně podpočtené, reportováno jako exploratory).

Celý pipeline (`research-prep/possession-vs-deployment/`: `STUDY-DESIGN.md`,
`run_study.py`, `analyze_results.py`, `README.md`) je odzkoušený nasucho end-to-end
(`--dry-run`, syntetická data) a běží bez chyby. Zbývá jen `export OPENAI_API_KEY=sk-...`
a spustit `python run_study.py possess && python run_study.py score && python
analyze_results.py` — stejný vzorec jako u všech předchozích studií v sérii.

**Zbytek pořadí, přesně jak bylo navrženo výše, beze změny (veřejná čísla):**
#24 (multi-turn T1→T4, rozšíří Stability) → #25 (fact injection na otevřeném
doporučení, rozšíří Evaluation→Recommendation) → B/Study #22 (Confidence, nulové nové
volání, hotovo, publikováno jako `research/recommendation-confidence.html`) → #26+A
(cross-platform + cross-model, blokováno na Anthropic/Google/Perplexity API klíčích) →
#27/C (Founder Lab field test, nejpomalejší kvůli reálnému čekání na re-crawl, ale
nejvíc nová — nikdo veřejně netestoval, jestli brand.context-styl soubor skutečně něco
změní) → D (Purchase, pořád zaparkováno).

Jakmile Daniel dodá `OPENAI_API_KEY`, spouštím Possession vs Deployment jako první a
jedeme dál po řadě bez dalšího čekání na schválení — přesně jak řekl.

## Oprava číslování (2026-09-08, večer)

Při psaní publikované stránky se zjistilo, že `recommendation-confidence.html` (kandidát
B výše) mezitím vyšla jako veřejná **Study #22** — moje pracovní poznámky výše ale
používaly "#22" pro Possession vs Deployment. Aby čísla na webu byla spojitá a bez
kolize, Possession vs Deployment jde na web jako **Study #23**, a všechny navazující
studie se posouvají o jednu: plánované "#23" (multi-turn T1→T4) je teď **#24**,
"#24" (fact injection) je **#25**, "#25" (cross-platform) je **#26**, "#26" (Founder
Lab field test) je **#27**. Interní pracovní čísla v sekcích výše (před touto opravou)
zůstávají beze změny jako historický záznam rozhodování, jen se nemají brát jako
finální publikovaná čísla.

## Study #23 — reálná čísla (2026-09-08, večer)

Po opravě dvou chyb (viz `research-prep/possession-vs-deployment/README.md`
Changelog — moc přísný string-matching filtr na stabilní fakty, a moc přísné
JSON parsování, které tiše ignorovalo markdown-obalené odpovědi) a jednom mém
vlastním zavinění (přepsal jsem Danielova reálná possession data testovacím
`--dry-run` během ověřování opravy — od teď se ke sdíleným datovým souborům
přes bash nepřibližuji, dokud nejsou finální) doběhla reálná data:

- **Cohort gap rate: 83,6 % (95% CI 78,3–88,6 %), n=9 značek, 308 skórovaných
  buněk, 1 392 possession-deployment párů.** Vs AIVO 75,7 % (CI 72,1–79,0 %)
  — rozsahy se překrývají, naše číslo o něco výš (delta +7,9pp). Kvalitativně
  potvrzuje jejich nález: většina faktů, o kterých model tvrdí že značku zná,
  se v reálném doporučení neobjeví.
- Rozpětí mezi značkami: Branch 5,4 % deployment (nejnižší) až Zigpoll 40 %
  (nejvyšší, ale jen n=5 buněk, hodně nejisté). Střed: Onyx 7,5 %, Rumpl
  8,5 %, Peak Design 13,5 %, Boll & Branch 14,4 %, Bellroy 19,5 %, Caraway
  29,4 %.
- **H3 (korelace gap rate vs recommend_rate_pct): r=-0,27, p=0,47, n=9 —
  žádná podpora, jak bylo předem avizováno jako pravděpodobné při tak malém
  vzorku.** Značky, které vyhrávají častěji, nenasazují spolehlivě víc svých
  vlastních faktů.
- Ruční spot-check 3 náhodných judge volání u Bellroy proti skutečnému textu
  v `bellroy_results.json` — všechna tři sedí (fakt o "slim minimalist
  design" a "eco-friendly materials" se v textu doopravdy objevuje tam, kde
  to judge označil, a chybí tam, kde ne).

**HOTOVO (2026-09-08, večer):** `/research/possession-vs-deployment.html` napsaná
jako veřejná Study #23 (viz Oprava číslování výše) a zapojená všude — vercel.json,
sitemap-pages.xml, llms.txt, `research/how-ai-decides.html` (related research link +
Research Library mini-card v Memory skupině + aktualizovaný "What we've found"
odstavec), `research/mechanism-studies.html` (nová karta), sitewide bump 22→23 Public
Studies (144 souborů) a sitewide footer ai-sitemap link (142 souborů). Další krok:
Study #24 (multi-turn T1→T4 displacement).

**HOTOVO (2026-09-08, noc): Study #24 (multi-turn T1→T4 displacement) doběhla
doopravdy a je publikovaná.** Reálná data (Daniel spustil `run`, `judge`,
`analyze_results.py` lokálně), ruční spot-check 17 judge verdiktů proti
syrovému T4 textu napříč celým spektrem (100%, 60%, 5%, 0% survival značky +
jediný AMBIGUOUS případ) — všech 17 sedí přesně.

- **T4 survival rate cohort-wide: 49,5 %** (95% CI 25,5–74,5 %, n=200), výrazně
  nad AIVO 12,7 %, ale rozdíl je nejspíš hlavně artefakt designu — náš T1 je
  uměle příznivý (limitace disclosnutá dopředu), takže absolutní čísla nejsou
  1:1 srovnatelná.
- **Decay curve má tvar pokles-pak-odraz:** T1 100 % → T2 32,5 % → T3 59 % → T4
  49,5 %. T3's užší otázka ("co vyčnívá") vrací část ztraceného mention rate
  oproti T2's širší otázce ("jaké jsou možnosti").
- **Per-brand rozptyl 100 %→0 %:** Bellroy/Peak Design/Rumpl 100 %, Caraway/Onyx
  Coffee Lab 60 %, Branch 45 %, Boll & Branch 25 %, Wild One 5 %, Topicals/
  Zigpoll 0 %.
- **H3 (korelace T4 survival vs baseline recommend_rate_pct): r=0,68, p=0,048,
  n=9** (Topicals vyloučen, 0% baseline) — na hraně signifikance, opačný směr
  než nulový výsledek Study #23, ale rozptyl je velký (Caraway 46% baseline→60%
  survival, Boll & Branch 48,5% baseline→jen 25% survival).
- **Wild One outlier je nejzajímavější finding:** 26 % baseline recommend rate,
  ale jen 5 % T4 survival (1 survived/18 displaced/1 ambiguous) — v konverzaci
  ho skoro pokaždé vytlačí Ruffwear, silný category-default konkurent, i přes
  uměle příznivý T1.

`/research/multi-turn-displacement.html` napsaná jako veřejná Study #24 s
plnou grafikou (animovaná decay-curve area chart T1→T4 + AIVO srovnávací
dashed linka, per-brand horizontal bar chart, H3 scatter plot s regresní
linkou a zvýrazněným Wild One bodem) a zapojená všude — vercel.json,
sitemap-pages.xml, llms.txt, `research/how-ai-decides.html` (Stability sekce
přepsaná na within-conversation finding + related research link + Research
Library mini-card), `research/mechanism-studies.html` (nová karta), sitewide
bump 23→24 Public Studies (144 souborů) a sitewide footer ai-sitemap link (140
souborů). Další krok: Study #25 (fact injection na otevřeném doporučení) —
skript hotový a dry-run ověřený, čeká na Danielovo skutečné spuštění.

## Poznámka k predikci (2026-08-26)

Až budou hotové 1-3, program pravděpodobně přejde z pozorovacích/korelačních
studií k příčinným experimentům na Founder Lab (vlastní kontrolovaný obchod) —
tj. přestaneme jen měřit, co koreluje, a začneme cíleně měnit jeden signál
najednou a měřit, jestli se doporučení skutečně pohne. To by byl první
skutečný RCT v celé sérii. Aktualizace 2026-08-27: se 3 hotovými studiemi
(Volba kandidáta, Cold start, Zdroj paměti) je tahle podmínka splněná —
kandidát C výše je přesně tenhle krok.

## Nová studie navržená Davidem: Hidden Context → Recommendation (2026-09-08, noc)

Daniel předal Davidovu analýzu: prošli jsme existující research index a hledali,
jestli už máme experiment typu "stejný prompt, stejné značky, stejná evidence,
stejný model, mění se jen skrytý upstream kontext (odkud/proč uživatel přišel)".
Davidův závěr: **ne, nemáme.** Máme čtyři blízké kusy, ale žádný z nich není
přesně tohle:

- **Web Search Rewrites 77 %** — mění dostupnost externího search kontextu,
  blízký princip, ale ne hidden campaign/exposure kontext.
- **Candidacy vs Selection** — odděluje "dostat se do consideration setu" od
  "vyhrát uvnitř něj" na 60 924 store datasetu, ale pozorovací, ne kontrolovaný
  experiment s manipulovaným kontextem.
- **Hand It a Rating...** — metodologický základ (jeden faktor mění, sleduje se
  winner), ale testovaný faktor je rating/cena, ne skrytý upstream kontext.
- **Search Changes the Vocabulary** — ukazuje, že změna dostupného kontextu mění
  i typ evidence, kterou model používá, ne jen samotné značky.
- **Founder Lab** — infrastruktura na kontrolované experimenty (měnit jednu věc,
  sledovat chování AI) už existuje, ale zatím se nepoužila přesně na tuhle
  otázku.

**Návrh (Davidova verze, širší než původní "does campaign context change
recommendation"):** *Does Hidden Context Change AI Recommendations?* Stejný
prompt (např. "What is the best sofa for a small apartment?"), stejné značky,
stejná evidence, stejný model — mění se jen skrytý kontext, který model dostane
v systémové zprávě, neviditelný pro samotný dotaz:

1. No context (control)
2. User intent context (obecný signál zájmu, bez jména značky)
3. Campaign origin ("uživatel právě viděl reklamu na značku X")
4. Brand exposure (pasivní povědomí, "uživatel značku X už zná")
5. Specific product/feature exposure (konkrétní expozice na úrovni featury)
6. Brand + feature context (kombinace jména a konkrétní featury)

Měří se **Context → Candidacy → Ranking → Winner** — tedy stejné dvoustupňové
rozlišení jako v Candidacy vs Selection, ale teď jako řízená manipulace, ne
pozorování. Otázka: dokáže skrytý upstream kontext změnit, kdo se vůbec dostane
do hry (Candidacy), kdo tu hru vyhraje (Selection), nebo obojí?

Tohle je podle Davida i podle mě silnější a čistší mechanism study než užší
verze "campaign context only" — je to řízený experiment přesně v duchu toho, co
téhle sérii funguje nejlíp (ne "AI visibility matters", ale konkrétní kauzální
mechanismus), a dá se postavit stejným levným vzorcem jako Study #23-#25 (gpt-4o
system-message manipulace, žádné nové API klíče, reuse existující kategorie/
značky z Recommendation Reports pro evidence a baseline).

**Přeřazení pořadí:** tahle studie jde na místo, kde byl dřív cross-platform
retrieval (ten zůstává blokovaný na Anthropic/Google/Perplexity klíčích, takže
dává smysl ho odsunout za něco, co jde postavit hned):

- **Study #26 (nová) — Does Hidden Context Change AI Recommendations?** Postavit
  hned po tom, co Daniel spustí Study #25 doopravdy. Levné (jen gpt-4o), žádné
  blokující závislosti.
- **Study #27 (dřív #26) — Cross-platform retrieval efekt.** Beze změny, pořád
  čeká na Anthropic/Google/Perplexity API klíče.
- **Study #28 (dřív #27) — Founder Lab field test.** Beze změny, pořád nejdražší
  a nejpomalejší, ale nejvíc nová.

**Co dál:** Study #25 (fact injection) je hotová a dry-run ověřená, čeká jen na
Danielovo skutečné spuštění (`run_study.py inject` → `judge` →
`analyze_results.py`). Jakmile ta data doběhnou a projdou spot-checkem, dalším
krokem v pořadí je navrhnout a postavit Study #26 (Hidden Context) přesně tímhle
vzorcem — STUDY-DESIGN.md, run_study.py, analyze_results.py, README.md,
dry-run ověřený, pak předaný Danielovi ke skutečnému spuštění.

## Study #25 — reálná čísla, postavená a publikovaná (2026-09-08, noc)

Daniel spustil `possess-topicals` → `inject` → `judge` → `analyze_results.py`
lokálně a nasdílel plný terminálový výstup. Ruční spot-check 15 judge volání
proti syrovému textu v `injected_raw.json` napříč všemi 4 značkami — 14 z 15
sedí přesně, jedna neshoda je pravděpodobně falešně negativní (odpověď
parafrázuje vloženou informaci, ale judge ji označil jako nepoužitou), což
znamená, že reportované fact-usage sazby jsou spíš mírně podhodnocené, ne
nadhodnocené.

- **Průměrný lift mention rate: 77,9pp** napříč 4 značkami vybranými cíleně
  jako reálně podprůměrné (baseline recommend rate 0-16,5 %).
- **Tři ze čtyř značek jdou z téměř neviditelné na téměř univerzální:** 1,25 %
  → 97,5 %, 5,75 % → 97 %, 16,5 % → 96 %. Čtvrtá (Topicals, jediná s pravým 0%
  baseline) jde jen na 44,5 % — nejmenší lift v kohortě, nejpravděpodobnější
  vysvětlení viditelné přímo v textu odpovědí: vložený fakt o Topicals je
  míň přímo relevantní ke konkrétním testovaným kupním otázkám než fakty
  ostatních tří značek.
- **Diagnostika lift-to-fact-usage ratio: všechny 4 značky mají ratio > 1**
  (Zigpoll 1,09 — nejtěsnější vazba, 88,3 % fact-usage; Branch 1,96; Onyx
  Coffee Lab 2,39 — nejširší mezera, jen 33,3 % fact-usage; Topicals 1,34).
  Napříč celou kohortou mention rate roste rychleji než doslovné citování
  vloženého faktu — konzistentní Linkage Gap signatura, ne Reasoning Gap:
  hlavně samotná přítomnost "retrieved" kontextu stačí ke zmínce, nezávisle
  na tom, jestli se konkrétní fakt doslovně použije.
- Přejmenování značek na Brand A-D podle velikosti liftu (anonymizace, stejná
  politika jako u Study #23/#24): Brand A=Zigpoll, Brand B=Branch, Brand
  C=Onyx Coffee Lab, Brand D=Topicals.

`/research/fact-injection.html` napsaná jako veřejná Study #25 s plnou
grafikou (animovaný dot-connector lift chart baseline→injected na 4 řádcích,
signal-chart bar graf fact-usage rate s ratio tagy) a zapojená všude —
vercel.json, sitemap-pages.xml, llms.txt, `research/how-ai-decides.html`
(Memory sekce rozšířená o kauzální follow-up + related research link +
Research Library mini-card + summary kt-card aktualizovaný), 
`research/mechanism-studies.html` (nová karta), sitewide bump 24→25 Public
Studies (145 souborů) a sitewide footer ai-sitemap link (141 souborů). Další
krok: Study #26 (Hidden Context) — balíček je hotový a dry-run ověřený v
`research-prep/hidden-context/`, čeká na Danielovo skutečné spuštění.

## Study #26 — reálná čísla, postavená a publikovaná (2026-09-08, noc)

Daniel spustil `run_study.py run` → `analyze_results.py` lokálně a nasdílel
plný JSON výstup. Spot-check: 20 náhodných záznamů přečtených celé napříč
všemi 6 podmínkami — všechny sedí. Navíc cílený sken všech 244 záznamů s
detekovaným `brand_position=1` (výherce) na konkrétní riziko metody (uzavřený
competitor list může minout skutečně první zmíněnou značku, pokud není na
seznamu) — **1 skutečná chyba nalezena**: `zigpoll/user_intent/run13`, model
doslova napsal že jiný, neznámý nástroj je jeho "top pick", ale Zigpoll
(zmíněný až druhý) byl přesto označen jako výherce, protože ten neznámý
nástroj nebyl v competitor listu. Oprava posune cohort-wide `user_intent`
winner rate z 36 % na 34,7 %, signifikance přežívá beze změny (p=0,0006 na
opraveném čísle by zůstalo řádově stejné).

- **Baseline (reused control) sedí přesně** s STUDY-DESIGN tabulkou: 43 %
  candidacy / 22 % winner napříč kohortou.
- **Všechny 4 brand-specific podmínky signifikantně zvedají winner rate**
  (p<0,0001, 10k permutací): brand_exposure 61,3 %, feature_exposure 64 %,
  brand_feature (kombinace) 76 %, campaign_origin 88 %.
- **Nesedí s předregistrovaným H3 pořadím — a to je hlavní finding:**
  `campaign_origin` (jen fiktivní "viděl jsi reklamu na X", žádný konkrétní
  fakt) má NEJVĚTŠÍ winner lift ze všech pěti podmínek, víc než kombinace
  brand+feature (76 %) i samotný feature_exposure s reálným faktem (64 %).
  Fiktivní expozice reklamě sama o sobě táhne víc než konkrétní pravdivá
  informace o produktu.
- **H4 (baseline interakce) sedí s předregistrovaným směrem:** r=-0,63
  (candidacy), r=-0,73 (winner), n=5 exploratory — slabší značky mají větší
  lift, stejný vzorec jako Study #24. Jedna near-ceiling značka (baseline
  73,2 %) nehne se pod žádnou podmínkou vůbec, čistá ilustrace floor/ceiling
  efektu.
- **Per-brand vzorec:** dvě značky (baseline 5,8 % a 26 %) se dostanou na
  97-100 % candidacy pod jakoukoli brand-specific podmínkou, ale pod
  brand_exposure/feature_exposure zůstávají pod 14 % winner rate — porazí je
  stejný silný category-default konkurent. Pod campaign_origin ale jejich
  winner rate skočí na 87 % a 53 %. Dvě jiné značky (baseline 1,2 % a 16,5 %)
  jakmile jsou candidate, vyhrávají skoro vždy pod všemi podmínkami.

`/research/hidden-context.html` napsaná jako veřejná Study #26 s anonymizací
Brand A-E, generickými popisy kategorie (bez category-hint leakage na
publikované Recommendation Reports), plnou grafikou (signal-chart winner
rate podle podmínky + dot-connector baseline-vs-campaign_origin per brand) a
zapojená všude — vercel.json, sitemap-pages.xml, llms.txt,
`research/how-ai-decides.html` (sekce 4 Candidacy rozšířená + related
research link + Research Library mini-card + summary kt-card),
`research/mechanism-studies.html` (nová karta), sitewide bump 25→26 Public
Studies (146 souborů) a sitewide footer ai-sitemap link (142 souborů).

## Finální sitewide audit (2026-09-08, noc) — konec dnešní session

Na Danielovu žádost proveden plný audit `atom-landing-main 4` (jediný scope,
`new-web` a `atom-landing-main 5` beze změny jako vždy), ověření že Study
#24, #25, #26 jsou zapojené doopravdy všude, ne jen v souborech, které jsem
sám editoval:

- **vercel.json**: 12 shod (4 řádky × 3 studie) — ověřeno platným JSON parsem.
- **llms.txt**: 3 shody, po jedné na studii.
- **sitemap-pages.xml**: 3 shody — ověřeno platným XML parsem.
- **`<b>N</b> Public Studies` počítadlo**: 147 souborů, všechny na 26, 0
  zastaralých. (2321 live HTML souborů celkem v main-4 scope, mimo vnořenou
  nepoužívanou `new-web/` složku uvnitř main-4 samotného — ta není routovaná
  ve vercel.json vůbec, je to mrtvý pozůstatek po dřívějším merge, nikdy
  jsem se jí nedotkl a nedotýkám.)
- **Footer `ai-sitemap` blok**: 146 souborů s blokem, všech 146 má teď
  odkazy na všechny 3 nové studie (0 chybějících párů po opravě).
  `scan.html` mělo zkrácenou verzi footeru bez jednotlivých research
  odkazů vůbec (i starší studie tam chyběly, ne jen dnešní tři) — přidal
  jsem tam aspoň dnešní 3 odkazy pro konzistenci, ale je to jediná stránka
  s touhle strukturální výjimkou, stojí za to vědět do budoucna.
- **Bonus nález**: samostatný, starší formát počítadla `"22 public studies"` /
  `"22 studies measuring..."` (mimo hlavní `<b>N</b> Public Studies` vzorec,
  proto ho žádný z předchozích bump-scriptů nikdy nechytil) byl zaseklý na
  22 už z dřívějška, napříč `index.html`, `atomfoundry-redesign.html` a 11
  `reports/*.html` stránkami. Opraveno na 26 všude (13 souborů).

**Stav k večeru 2026-09-08: Study #24, #25, #26 hotové, publikované, plně
zapojené a zvenku i uvnitř zkontrolované.** Další krok příště: Study #27
(cross-platform retrieval, blokovaná na Anthropic/Google/Perplexity API
klíčích) nebo navrhnout Study #28 (Founder Lab field test). Zbytek
roadmapy beze změny.

**Co dál:** Study #27 (cross-platform retrieval) zůstává blokovaná na
Anthropic/Google/Perplexity API klíčích. Study #28 (Founder Lab field test)
je další nová studie k navržení, jinak je roadmapa aktuálně vyčerpaná co do
levných gpt-4o-only studií bez blokujících závislostí.
