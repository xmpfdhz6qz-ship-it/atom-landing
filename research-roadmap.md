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

## Nápad k zvážení (zatím neděláme) — Veřejný leaderboard, 2026-09-08

Přišel cold-outreach email (growth-audit spam vedoucí na viberank.dev, ne
relevantní důvěryhodný zdroj) s pár body. Většina byla buď nepřesná (nav
už má dropdowny, pricing sekce už existuje, positioning kolem 55/100 stat
už je hotový) nebo nízká priorita (PWA manifest — nedává smysl pro
lead-gen marketingový web). Dva body byly reálné a stojí za zápis:

1. **Product + FAQPage JSON-LD schema chybí** — ověřeno, homepage i
   produktové stránky mají Organization/WebSite/OnlineStore schema, ale
   žádnou Product ani FAQPage. Levný technický zásah, žádné riziko.

2. **Veřejný, negovaný "live leaderboard"** — jediný genuinely nový nápad.
   Aktuálně máme `benchmarks.html` (agregátní/anonymní srovnání podle
   kategorie, žádná jména brandů) a `/reports/*` (jednotlivé stránky
   s reálnými jmény brandů, ale hlavní zjištění gated za $129). Chybí
   prostřední krok: jedna veřejná stránka typu `/rankings/kitchen-cookware`
   se seřazenou tabulkou reálných jmen brandů vedle sebe (AI Commerce
   Score / recommend rate), volně přístupná, bez emailu. Přesně tohle
   dělá AIVO Meridian na `/ai-rankings/` — měsíčně přidávají kategorii,
   čtvrtletně refreshují, každý řádek má gated "Get full report →" CTA.
   Funguje jim to jako lead-gen i backlink magnet (brandy odkazují na
   vlastní dobré umístění). Dala by se postavit nad daty, co už částečně
   máme z `/reports/` (Caraway, Rumpl, Onyx Coffee Lab, Wild One, Topicals,
   Branch, Boll & Branch, Bellroy, Peak Design, Founder Lab).

   Daniel řekl 2026-09-08: zatím neděláme, jen si to ukládáme na později.

## Finální odsouhlasené pořadí dalšího výzkumu (2026-09-16)

Po plném auditu všech 22 studií (viz `research-audit-2026-09-16.md`) a
diskuzi o tom, na kolika procentech jsme s pochopením celé věci (~65-70 %
pokrytí decision path, ~40-50 % skutečné jistoty po započtení cross-model a
real-world kauzality), Daniel odsouhlasil tohle pořadí. Founder Lab
schválně na konci (Daniel: "founder lab nechame az na konec"), Purchase
logicky hned za/s ním, protože potřebuje jeho reálná konverzní data.

1. **Wave-1 cross-study korelační matice** — nulová cena, žádná nová API
   volání, jen přeskládat existující čísla (Possession-Deployment,
   Multi-turn Displacement, Fact Injection, Hidden Context, stejná kohorta
   ~10 značek). Prošetřit anomálie Wild One a Zigpoll.
2. **Nezávislý soudce (Claude) na studiích #23-26** — re-scoring existujících
   dat, žádné nové generování. Kvantifikuje self-grading bias.
3. **Rozbor kategorie Pets** — jediná kategorie se signifikantní (a
   negativní, r=-0,366) korelací skóre vs frekvence. Marketplace-share
   hypotéza čísla nepodporuje čistě, potřeba dedikovaný rozbor.
4. **Cross-model paměť** — čeká na Anthropic + Google API klíč od Daniela.
5. **Study #30 (cross-platform retrieval)** — sdílí sběr dat s bodem 4,
   navíc Perplexity klíč, stejná vlna. (Přečíslováno z #28 na #29 po
   publikaci Study #28 = Živý retrieval vs simulovaná injekce, 2026-09-11,
   a znovu z #29 na #30 po publikaci Study #29 = Brand Legibility,
   2026-09-11, viz sekce "Study #29" níže — obě tyhle studie
   nepotřebovaly nové klíče a publikovaly se dřív, takže si vzaly volná
   čísla v pořadí, jak vycházela.)
6. **Skutečná míra vytažení faktu živým retrievalem — Study #28, hotovo a
   publikováno (2026-09-11).** Most mezi Fact Injection (simulované) a
   realitou, nepotřeboval nové klíče, viz sekce "Study #28" níže pro plné
   výsledky.
6b. **Brand Legibility → Candidacy → Selection — Study #29, hotovo a
   publikováno (2026-09-11).** Testuje, jestli jasnější rámování reálných
   faktů značky mění šanci na kandidaturu/výběr, viz sekce "Study #29"
   níže pro plné výsledky.
7. **Founder Lab field test (Study #31)** — na konci, jak Daniel odsouhlasil.
   (Přečíslováno z #29 na #30 po Study #28, a znovu z #30 na #31 po
   Study #29, stejný důvod jako bod 5.)
8. **Purchase** — hned za/s Founder Labem, měřitelné až s jeho reálnými daty
   v čase.

## Nový projekt: SEO Ranking Factors vs AI Recommendation Factors (2026-09-09)

Podnět: report 131 SEO specialistů (Aleyda Solis okruh) o tom, co podle nich
v roce 2026 nejvíc ovlivňuje Google ranking. Top 3: Relevance/search intent
57,1 %, Backlinks 54,8 %, Content quality 47,6 %. Uvnitř kategorií nejsilnější
dílčí faktory: Search Intent Match +2,60, Trusted domains +2,47, Topical
relevance +2,22, Original research/first-party data +2,19, naopak scaled
AI-generated content -1,82.

Důležité: je to expert survey, ne měření. Ukazuje co SEO experti věří že
funguje pro Google, ne co skutečně mění výsledek. Přesně tenhle rozdíl
(assumed vs measured) je jádro Atom pozice — Atom se ptá "co skutečně mění
rozhodnutí AI", ne co si lidé myslí že funguje.

**Nápad (Daniel odsouhlasil, chce uložit kvůli návaznosti na Founder Lab):**
vzít top SEO předpoklady z reportu jako hotový seznam hypotéz a položit AI tu
samou otázku — udělat řízené experimenty (jedna proměnná najednou), ne další
observační/korelační studii. Přesně tenhle typ "změň jednu věc, přeměř, sleduj
změnu" je metodologicky Founder Lab, takže tenhle projekt navazuje přímo na
bod 7 výše (Founder Lab field test, Study #31) — dává smysl ho spustit až
Founder Lab poběží, ne dřív, protože potřebuje stejnou živou/kontrolovanou
infrastrukturu.

Navržené páry hypotéz (SEO assumption → Atom experiment):
- Search intent → mění intent-match recommendaci?
- Trusted/topical backlinks → mění důvěryhodné/tematické zpětné odkazy
  recommendaci?
- Original research / first-party data → vybírá AI značku častěji, když má
  vlastní research?
- Content freshness → mění čerstvost obsahu recommendaci?
- Topical authority → mění silnější tematická autorita výběr?
- Brand signals → mění silnější brand recognition výběr?
- Technical SEO → mění lepší technická dostupnost výběr?
- Scaled AI-generated content → škodí recommendaci stejně jako údajně škodí
  Google rankingu?

Výstup by byla mapa: 🟢 platí pro Google i AI / 🟡 platí pro Google, u AI
nejasné / 🔵 platí pro AI, ne zjevně pro Google / 🔴 na AI rozhodnutí nemá vliv.

Marketingový úhel (ne kritika Aleydy/SEO, jen přidání vrstvy): "SEO experts
have spent years identifying what they believe influences search rankings.
We decided to test how many of those assumptions survive when the decision
maker is AI."

Status: uloženo, čeká na Founder Lab infrastrukturu (bod 7 výše). Zatím
nezařazeno do číslovaného pořadí — navázat na něj až po Study #31.

Daniel řekl 2026-09-16: "ano, souhlasim. zapis to a zacneme zitra."

## Nový nápad: Accuracy + Depth beyond presence (2026-09-10)

Podnět: LinkedIn komentář Marcose Viladomiu na Danielův příspěvek o 60 924
obchodech / 599 v recommendation setu a chování AI botů. Marcos navrhuje dvě
metriky nad rámec pouhé přítomnosti/viditelnosti: accuracy ("BAS" — Brand
Accuracy Score) a depth ("CDI" — Content Depth Index). Jeho tvrzení: být
zmíněný nestačí, záleží na tom, jestli AI o značce říká pravdivé věci
(accuracy) a jak hluboko/kompletně ji popisuje (depth).

Liší se od toho, co už máme (Possession-Deployment gap, Fact Injection) —
tamto měří "použije AI fakt, když ho má k dispozici v promptu". Tohle měří
"jak přesně a jak podrobně popíše značku sama od sebe, bez nápovědy/vloženého
faktu".

Navržený design (Daniel odsouhlasil 2026-09-10: "urcite to zapis a udelame
to"):
- **Accuracy měření:** nechat model popsat značku volně, closed-book (bez
  search/retrievalu), porovnat tvrzení s reálnými fakty o značce — podíl
  správných / smyšlených (confabulace) / zastaralých tvrzení.
- **Depth měření:** počet a rozmanitost konkrétních atributů, které model o
  značce zmíní bez vyzvání (cena, materiály, use case, srovnání s
  konkurencí), poměřeno vůči tomu, kolik reálně existuje.

Nevyžaduje nové API klíče, jde spustit na existující kohortě značek
(Wave-1: Bellroy, Peak Design, Rumpl, Caraway, Onyx Coffee Lab, Branch,
Boll & Branch, Wild One, Topicals, Zigpoll), stejně levné jako body 1-3 v
odsouhlaseném pořadí výše. Zapadá do fáze Memory / Evaluation decision path.

Status: uloženo, čeká na zařazení do pořadí. Vzhledem k nulové ceně a shodě s
existující kohortou dává smysl zařadit brzy, podobně jako body 1-3.

## Study #27 — Accuracy + Depth, postavená a publikovaná (2026-09-11)

Znovupoužity closed-book claims z possession strany Study #23 (Possession vs
Deployment), 9 Wave-1 brandů, 3 gpt-4o běhy sloučené do stabilních tvrzení,
nulové nové API volání. Nové bylo jen ověření: každé z 40 tvrzení nezávisle
zkontrolováno přes živé webové vyhledávání (vlastní stránka brandu, nezávislý
tisk, retaileři), ne self-graded stejným modelem, který tvrzení vyprodukoval.

Před publikací proběhla kontrola sitewide počítadla "26 Public Studies" na
Danielovu žádost ("nam to vsude ukazuje 26 studii ale tohle je 25"). Ověřeno
proti research-roadmap.md interní řadě Study #1-#26 (poslední Study #26 =
Hidden Context, zdokumentováno v sekci "Oprava číslování" výše) a proti
`llms.txt`/`mechanism-studies.html` obsahu — číslo 26 sedí přesně, žádná
duplicita ani chyba nenalezena. Daniel po zeptání potvrdil: nová studie je
#27, počítadlo jde na 27, ne na 25.

**BAS (Brand Accuracy Score):** 34 ověřitelných tvrzení (6 čistě popisných
tvrzení bez faktické podstaty vyřazeno z BAS, ponecháno jen pro CDI). 33 z 34
potvrzeno (97,1 %). Jediné vyvrácené tvrzení: Bellroy cenové srovnání ("lower
than Peak Design and Nomatic") — Bellroy Slim Sleeve $85-135 vs Nomatic
vlajkové peněženky $19.99, tedy opak tvrzení. Důležitá oprava za pochodu:
dřívější, méně důkladný průchod označil jako pravděpodobně smyšlené tvrzení
Onyx Coffee Lab o solárních zařízeních a uhlíkově neutrální dopravě. Druhé,
zdroj-po-zdroji ověření (vlastní stránka Onyx "In 2019, we invested in a
solar energy system for our roastery", Arkansas Business citace zakladatelů
"We operate our entire facility off of solar", vícleté uhlíkově-neutrální
messaging) tenhle claim potvrdilo jako pravdivý. Oprava je zdokumentovaná na
veřejné stránce, ne tiše přepsaná.

**CDI (Content Depth Index):** vlastní 8-kategoriová taxonomie atributů
(materiály, cena/pozicionování, udržitelnost, design/funkce, záruka,
certifikace, business model, srovnání s konkurencí). Průměrně 61,1 % pokrytí
(44 z 72 kategorie-brand párů), rozsah 25 % (Zigpoll) až 87,5 % (Bellroy).
Udržitelnost se objevuje nevyžádaně u 8 z 9 brandů, záruka a certifikace jen
u 3 z 9, i když jsou reálné a ověřitelné (Peak Design lifetime warranty,
Caraway PTFE/PFOA-free certifikace).

Publikováno jako `/research/accuracy-depth.html`, zapojeno všude — vercel.json,
sitemap-pages.xml, llms.txt, `mechanism-studies.html` (nová karta), sitewide
bump 26→27 Public Studies (148 souborů) a sitewide footer ai-sitemap link
(147 souborů, ověřeno skriptem že vklad je uvnitř `<nav class="ai-sitemap">`
bloku, ne do prvního náhodného výskytu odkazu na hidden-context v textu
stránky — první verze skriptu tuhle chybu udělala na 2 místech, opraveno
před publikací).

Data + verifikace: `research-prep/accuracy-depth/verification.json`
(strukturovaný výsledek, každé tvrzení se zdrojem a kategorií).

**Přečíslování budoucích studií:** Study #27 (cross-platform retrieval) a
Study #28 (Founder Lab field test) zmíněné výše v sekcích "Oprava číslování"
a "Reakce na AIVO" posouvají o jednu: cross-platform retrieval je teď
**Study #28**, Founder Lab field test je **Study #29**.

## Nový nápad: Brand Legibility → Candidacy → Selection (2026-09-11)

Podnět: hypotéza od Silvie (LinkedIn), navazuje na existující externí koncept
"Brand Legibility" (jak dobře je značka pro AI rozpoznatelná, parsovatelná a
přiřaditelná) a novější výzkum o tom, že category framing mění, které značky
AI doporučuje. Daniel navrhuje mnohem konkrétnější, experimentální verzi,
která to skutečně testuje místo jen popisuje.

**Hypotéza:** Pokud AI rozumí značce jasněji a konzistentněji, je
pravděpodobnější, že ji zařadí do správného consideration setu a nakonec ji
doporučí. Klíčové je oddělit tři fáze, které přesně sedí na existující
decision-path rámec: **Understanding → Candidacy → Selection.**

**Navržený design (Daniel, 2026-09-11):**
Vzít 30-50 reálných ecommerce brandů. Pro každou vytvořit tři kontrolované
verze stejné evidence, beze změny faktů, jen hierarchie a framing:

- **A. Clear / Legible** — jasně formulovaná identita a kategorie (např.
  "Brand X is a premium running shoe brand focused on marathon runners and
  long-distance road running").
- **B. Ambiguous** — stejná fakta, ale rozvětvená do více směrů najednou
  (běžecká obuv + lifestyle obuv + outdoor produkty, pro běžce, cestovatele
  i běžné spotřebitele).
- **C. Misaligned hierarchy** — fakticky správně, ale důraz/pořadí obrácené
  (lifestyle footwear company, která mimochodem dělá i performance running
  shoes).

Důležité omezení, které si Daniel sám stanovil: nevymýšlet žádná nová fakta,
pouze měnit framing a hierarchii existujících.

**Test:** stejný model, stejný prompt (např. "I'm training for my first
marathon. Which running shoe brands should I consider?"), stejné produkty,
stejné podkladové informace. Jediná proměnná je, jak je identita značky
strukturovaná.

**Měřené vrstvy:**
1. **Understanding** — umí AI správně říct, co značka je, pro koho je, v
   jaké kategorii soutěží, jaký je hlavní use case.
2. **Candidacy** — dostane se vůbec do consideration setu.
3. **Correct consideration set** — je-li v setu, je proti správným
   konkurentům, nebo proti špatné konkurenční skupině (značka může být
   pochopena správně, ale zařazena do špatného konkurenčního rámce).
4. **Selection** — vyhraje nakonec doporučení.

**Counterfactual correction (silnější navazující krok):** Vzít značku, která
prohrává kvůli špatnému consideration setu, změnit pouze framing identity na
"Clear", a sledovat, jestli se změní vítěz. To by bylo silnější zjištění než
prostá korelace legibility se skóre.

**Propojení s existujícím výzkumem:** Přímo navazuje na Candidacy vs
Selection (60 924 obchodů, 599 v recommendation setu, intent odděluje
candidacy od non-candidacy, ale mezi 599 už skoro nevysvětluje vítěze) a na
Volbu kandidáta (160 kontrolovaných head-to-head testů, rating 160/160,
specs 81,9 %, cena 60,6 %) — spojuje jejich zjištění o tom, že konkrétní
evidence mění vítěze, s novou otázkou, jestli samotná srozumitelnost/framing
identity určuje, se kterými konkurenty je značka vůbec porovnávána.

Postaví celý mechanismus: **Legibility → Candidacy → Evaluation →
Selection.**

Status: uloženo, čeká na zařazení do číslovaného pořadí. Až budou reálné
výsledky, Daniel chce dát Silvii follow-up ve stylu "You gave us the
hypothesis. We decided to test it."

## Wave-1 cross-study korelační matice, hotovo (2026-09-11)

Bod 1 z odsouhlaseného pořadí výše. Zero nových API volání, reuse dat ze 4
už publikovaných studií (Possession vs Deployment, Multi-turn Displacement,
Fact Injection, Hidden Context, stejná Wave-1 kohorta). Data + korelační
matice v `research-prep/cross-study-matrix/matrix.json`.

Korelační matice sama o sobě nedala nic nového publikovatelného: n=9 je
málo, BAS má skoro nulovou varianci v týhle kohortě (8 z 9 brandů 100 %),
takže korelace s BAS jsou tažené jedním bodem. Jediná smysluplná korelace
(baseline recommend rate vs T4 survival, r=0,68) jen reprodukuje už
publikované číslo z multi-turn-displacement.html (r=0,6817, p=0,048).

Skutečný nález: Wild One a Zigpoll (v datech "Brand H" a "Brand J") jsou
zrcadlové anomálie. Zigpoll se skoro nikdy nedostane do candidacy samo
(1,2 % baseline, 25 % candidacy bez kontextu), ale jakmile se tam dostane
jakoukoli podmínkou, vyhrává 100 %. Wild One se do candidacy dostane stejně
snadno jako Zigpoll, ale i s plnou candidacy vyhrává jen 0-53 % podle
podmínky, a ve vícetahové konverzaci přežije jen 5 % (vytlačen stejným
konkurentem v 18 z 20 běhů). Zigpollův problém je čistě Candidacy, Wild
Onein je čistě Selection.

Na Danielovu žádost publikováno anonymně (Brand H / Brand J, stejná
konvence jako multi-turn-displacement.html) jako nová sekce na
`candidacy-vs-selection.html` ("Two brands, opposite anomalies"), ne jako
nová Study # — je to syntéza starých dat, ne nová primární studie, takže se
nepočítá do Public Studies počítadla.

## Oprava chyby v soudci u Study #23, Possession vs Deployment (2026-09-11)

Vzniklo jako vedlejší nález úkolu 344 (independent-judge re-score na
studiích #23-26). Zjištěno: Hidden Context (#26) žádného LLM soudce nemá,
detekce je čistě deterministický string-match (`brand_mentioned = name in
mentioned_order`), takže self-grading bias se na ni netýká vůbec.
Multi-turn Displacement (#24) a Fact Injection (#25) prošly nezávislou
kontrolou 16 náhodných vzorků každá, 16 z 16 shoda, žádný problém.

Possession vs Deployment (#23) měla skutečnou chybu. Na 16 náhodných
vzorcích shoda jen 56 %, koncentrovaná u Boll & Branch. Protože je re-score
zdarma (žádná nová generace odpovědí, jen nové soudcovské volání nad
existujícím textem), prošla se celá populace pro tři značky: Boll & Branch
(40 volání), soudce řekl "0 faktů použito" ve 27 případech, z toho 26 mělo
v odpovědi jasný textový doklad faktu, který soudce nezapočítal (např. text
doslova říká "GOTS certified organic cotton" a soudce vrátí prázdné pole).
Bellroy 8 z 10, Caraway 9 z 14. Původní soudcovský prompt byl příliš
striktní na parafráze, přestože instrukce k parafrázím výslovně obsahoval.

Oprava: nový skript `research-prep/possession-vs-deployment/rescore_study.py`,
per-fact yes/no formát místo jednoho volného seznamu, s konkrétními
příklady toho, co se počítá jako shoda. Spuštěno Danielem lokálně (sandbox
nemá vychozí přístup k api.openai.com), 360 nových volání, 0 nových
generovaných odpovědí. Původní `judge_raw.json` zálohován jako
`judge_raw_v1_backup.json`, každý řádek nového `judge_raw.json` má navíc
pole `facts_used_v1` pro dohledatelnost.

Dopad na publikovaná čísla, deployment rate z 16,4 % na 24,2 %, gap rate
z 83,6 % na 75,8 % (95% CI 69,9-81,6 %). Korelace s recommend rate
prakticky zmizela, z r=-0,27 (p=0,47) na r=-0,04 (p=0,91), pořád žádný
vztah, jen silněji. Nejvýraznější posun po značkách: Boll & Branch
14,4 % → 35,6 % (z podprůměru na nadprůměr), Branch 5,4 % → 20,7 % (přestal
být extrémem), Rumpl 8,5 % → 23,0 %. Nová čísla teď skoro přesně sedí na
nezávislé AIVO referenci (75,7 %), rozdíl 0,09 p.b. místo původních 7,9 p.b.

Stránka `research/possession-vs-deployment.html` ještě nebyla nikde
sdílená, takže opraveno přímo, žádné veřejné "correction" oznámení není
potřeba. Sekce limitací a jedna z podpůrných flip-cards přepsané tak, aby
popisovaly skutečně to, co se stalo (nalezená a opravená chyba v soudci),
místo původního tvrzení o "3 of 3 manual spot-check, zero disagreements",
které už neodpovídalo realitě. Dopočítáno i navazující: matice
`research-prep/cross-study-matrix/matrix.json` používala staré
deployment_rate_pct, přepočítány 4 korelace, které na deployment rate
závisí (baseline_x_deploy, deploy_x_t4, deploy_x_bas, deploy_x_cdi).
Sekce Wild One/Zigpoll na candidacy-vs-selection.html čísla z possession-
deployment vůbec necituje, takže ta zůstala beze změny.

Propsáno i do `research/mechanism-studies.html`, `research/index.html`,
`research/how-ai-decides.html` a `llms.txt`, všude kde se citovalo staré
83,6 % / 16,4 % / r=-0,27.

## Návrh studie: Živý retrieval vs simulovaná injekce, hotovo (2026-09-12)

Bod 6 z "Navržené pořadí" (body 4 a 5 zůstávají blokované na API klíčích od
Daniela, tenhle nepotřebuje žádný nový). Design v
`research-prep/live-retrieval/STUDY-DESIGN.md`, skript
`research-prep/live-retrieval/run_study.py`, odzkoušený nasucho end-to-end
(`--dry-run`, 800 search řádků, judge správně filtroval jen na zmíněné buňky,
213 z toho pod cap 240).

Otázka: Fact Injection (#25) simulovala úspěšný retrieval ruční injekcí faktu
a ukázala průměrný lift 77,9 p.b. Tahle studie zjišťuje, kolik z toho stropu
reálně naplní skutečně zapnutý web search, bez ruční injekce, se stejnými 4
značkami, stejnými 20 prompty a stejnými fakty jako Fact Injection. Tři body
na jedné ose: baseline (hotovo) → živý search (nové) → injected ceiling
(hotovo).

Technicky nové proti zbytku série: místo Chat Completions potřebuje OpenAI
Responses API s `web_search_preview` toolem, aby šlo měřit i Discovery
(najde search vůbec stránku s faktem, přes citace) zvlášť od Usage (použije
ho v odpovědi, stejný judge přístup jako oprava possession-vs-deployment
včera, per-fact yes/no s příklady parafráze, ne volný seznam).

Odhad ~800-1050 nových volání, search-enabled volání dráž na token než plain
chat completions. Čeká na Danielovo rozhodnutí, jestli spustit teď (lokálně,
stejně jako possession-vs-deployment oprava, protože sandbox nemá přístup k
api.openai.com).

## Study #28 — Živý retrieval, reálná čísla a publikace (2026-09-11)

Daniel spustil oba běhy lokálně (`research-prep/live-retrieval/`), stejný
postup jako oprava possession-vs-deployment, protože sandbox nemá přístup k
api.openai.com. `search` (800 volání), `judge` (33 řádků, jen zmíněné buňky),
pak samostatný potvrzovací re-run `search --repeats 2 --out search_check.json`
(160 dalších volání).

**Hlavní zjištění, nečekané.** Napříč všemi 800 živými search voláními (4
značky × 20 promptů × 10 opakování), pak znovu napříč samostatným 160voláním
potvrzovacím re-runem (2 opakování/prompt, jiné seedy), model nikdy ani
jednou nezavolal search nástroj (`web_search_preview`). **0 z 960 volání.**
Nulové citace ve všech 960 odpovědích.

Tak čistá nula vyžadovala aktivní podezření, ne rovnou psaní závěru — mohla
stejně dobře znamenat "model se rozhodl nehledat" jako "bug v extrakci
citací". Diagnostický skript (`diagnose_search.py`, 3 testovací prompty),
spuštěný před tím, než šlo hlavnímu výsledku věřit, rozlišil obě možnosti:
stejný model, stejný tool, stejná struktura volání, ale 2 ze 3 promptů
přeformulované jako explicitně časově citlivé ("...right now in 2026") místo
otevřené nákupní otázky. Dva z těch tří search reálně spustily, pokaždé s 10
skutečnými citacemi. Tool funguje. Pro přesně tenhle styl otevřené nákupní
otázky, použitý napříč celou touhle sérií, ho model prostě nikdy nepoužil.

**Mention rate.** Se search prakticky nikdy nespuštěným je živá podmínka
funkčně identická s baseline (obojí = odpověď z paměti). Brand D (pravé 0%
baseline, Topicals) zůstal na 0 %. Ostatní tři šly mírně dolů, ne nahoru:
Brand A/Zigpoll 1,25%→0,5%, Brand B/Branch 5,75%→2,5%, Brand C/Onyx Coffee
Lab 16,5%→13,5% — v rámci běžného šumu mezi dvěma sběry, ne signál. "Realizovaný
podíl stropu" ((live−baseline)/(injected−baseline)) vyšel u 3 ze 4 značek
záporný (-0,8 %, -3,6 %, -3,8 %), u čtvrté přesně 0 %. Nikde blízko 96-97,5%
stropu, který našla Fact Injection. Ze 33 buněk, kde model značku vůbec
zmínil, použilo fakt 12 (36,4 %) — číslo reportované pro úplnost, ale příliš
řídký vzorek a příliš odpojené od reálného search (žádná citace v žádné z
těch 33 buněk) na to, aby to bylo bráno jako signál samo o sobě.

Publikováno jako `/research/live-retrieval.html`, zapojeno všude — vercel.json,
sitemap-pages.xml, llms.txt, `mechanism-studies.html` (nová karta),
`research/index.html` (rotating window karta i finding-card flip karta;
obojí chybělo u Study #27 při jeho dřívějším zapojení, při týhle příležitosti
doplněno zpětně i pro Study #27), sitewide bump 27→28 Public Studies (149
souborů) a sitewide footer ai-sitemap link (147 souborů). Značky
anonymizované jako Brand A-D, stejné přiřazení jako na Fact Injection
(A=Zigpoll, B=Branch, C=Onyx Coffee Lab, D=Topicals), žádná nová volba.

**Přečíslování (druhé kolo).** Tahle studie publikuje dřív než cross-platform
retrieval (pořád blokovaná na Perplexity klíči), takže si bere číslo **#28**
jako první volná studie v pořadí, ne #29, jak by čekal seznam v sekci
"Finální odsouhlasené pořadí" výše. Cross-platform retrieval se posouvá z
#28 na **#29**, Founder Lab field test z #29 na **#30**. Opraveno v sekci
"Finální odsouhlasené pořadí" výše a na všech místech v dokumentu, kde se
dřívější čísla objevovala (řádek s "Founder Lab field test, Study #28" byl
navíc už zastaralý z předchozího kola přečíslování, opraveno taky).

## Study #29 — Brand Legibility → Candidacy → Selection, hotovo a publikováno (2026-09-11)

Otázka: pomůže jasnější rámování vlastních reálných faktů značky jejím
šancím na kandidaturu (model ji vůbec zmíní) a výběr (model ji dá na první
místo)? Tři podmínky framing textu se stejnými reálnými fakty pro každou
značku: clear (organizovaně, kategorie po kategorii), ambiguous (stejná
fakta, náhodně proházená), misaligned (stejná fakta, matoucí přechody mezi
tématy).

**Kolo 1 (v1, flagship prompty).** 9 reálných, dobře známých značek,
původní nákupní prompty. Candidacy 93,33 / 98,89 / 98,89 % napříč clear /
ambiguous / misaligned, selection 86,67 / 92,22 / 94,44 %. 8 z 9 značek se
posadily na strop ~100 % kandidatury bez ohledu na framing. Jedna výjimka
(v kódu interně "caraway") na 40/90/90 % — jediná značka, kde framing
skutečně něco měnil.

**Kolo 2 (v2, těžší prompty).** Hypotéza: strop je tím, že původní prompty
byly moc snadné. Nahrazeny za těžší, konkurenčnější nákupní otázky, stejné
značky. Candidacy 92,22 / 100 / 100 %, selection 80 / 88,89 / 90 %. Stejný
vzor, 8 z 9 na stropu, stejná výjimka na 30/100/100 %. Těžší prompty strop
nerozbily.

**Kolo 3 (v3, jmenovaní reální konkurenti).** Hypotéza: model nemá ve všech
třech podmínkách skutečnou konkurenční volbu, protože nejsou v promptu
jmenovaní konkrétní soupeři. Nový mechanismus: system message jmenuje
skutečné reálné konkurenty značky vedle jejího framing textu, stejná řada
konkurentů ve všech třech podmínkách, mění se jen framing. Candidacy 93,33 /
94,44 / 98,89 %, selection 88,89 / 92,22 / 92,22 %. Stejná výjimková značka
tady dala nejčistší, nejdramatičtější výsledek: candidacy 40/50/90 %,
selection 10/50/80 % — čím jasnější framing, tím HŮŘ, přesně opačně než
původní hypotéza čekala. 70procentní swing (10 % → 80 % selection),
opačným směrem.

**Otázka od Daniela: "co takhle to zkusit u jiných značek, ne u těch co
máme, protože to jsou dost známé značky?"** Vlastní Danielův nápad, přímo
otestovaný. Vyhledány 3 reálné, ale málo známé malé značky (ověřeno, že se
neobjevují v žádném "nejlepší značka" žebříčku, na rozdíl od všech 9
původních), reálná fakta, reální konkurenti. Stejný v3 mechanismus. Výsledek:
100 % candidacy, 100 % selection, ve všech třech podmínkách, u všech 3
značek. Sláva/známost značky odmítnuta jako vysvětlení stropu.

**Rozhodující diagnostický test.** Pokud sláva/známost není důvod, co když
je to existence značky v tréninkových datech vůbec? Vymyšlená, plně
fiktivní značka (keramické nádobí), vymyšlená fakta, vymyšlení konkurenti —
značka nemá a nemůže mít žádnou historii, kterou by model znal. Stejný
mechanismus. Výsledek: 100 % candidacy, 100 % selection, ve všech třech
podmínkách. I neexistující značka narazila na stejný strop. Rozhodující
potvrzení: strop je vlastnost struktury promptu (značka popsaná v kontextu
těsně před odpovídající kategorickou otázkou skoro automaticky vede k
doporučení), ne vlastnost slávy značky nebo její přítomnosti v trénovacích
datech.

**Celkově napříč pěti koly.** 1 997 reálných API volání. 12 ze 13 značek
(9 originál + 3 obskurní + 1 fiktivní) zůstalo na nebo blízko 100% stropu
kandidatury bez ohledu na framing. Jediná výjimka je reálná, ale její
pozice na trhu je v přímém napětí s testovacím nákupním promptem
(středně-prémiový produkt vs. rozpočtově omezená otázka) — a u ní jasnější
framing snižoval, ne zvyšoval, šanci na doporučení.

Publikováno jako `/research/brand-legibility.html`, anonymizováno (žádná
konkrétní jména značek ani konkurentů, jen kategorie), text zjednodušen do
prosté angličtiny na Danielovu žádost. Zapojeno všude — vercel.json,
sitemap-pages.xml, llms.txt, `mechanism-studies.html` (nová karta),
`research/index.html` (rotating window karta i finding-card flip karta),
sitewide bump 28→29 Public Studies (149 souborů) a sitewide footer
ai-sitemap link (148 souborů).

**Přečíslování (třetí kolo).** Tahle studie publikuje dřív než cross-platform
retrieval (pořád blokovaná na Perplexity klíči), takže si bere číslo **#29**
jako první volná studie v pořadí. Cross-platform retrieval se posouvá z #29
na **#30**, Founder Lab field test z #30 na **#31**. Opraveno v sekci
"Finální odsouhlasené pořadí" výše a na všech místech v dokumentu, kde se
dřívější čísla objevovala.

## Nový nápad: Tvar promptu — délka, typ věty, úvodní slovo (2026-09-11)

Podnět: Danielova otázka, jestli by šlo systematicky otestovat, jak moc
tvar dotazu kupujícího (ne fakta o značce, ale forma otázky samotné) mění
doporučení. Zásadně jiná osa než cokoliv dosud testované — všechny
dosavadní studie měnily informace o ZNAČCE (framing, skrytý kontext,
recenze, reklama, jmenovaní konkurenti). Tahle by měnila DOTAZ, se stejnými
značkami a stejnou kategorií.

**Otázka:** Mění se to, kterou značku model doporučí (nebo jestli ji vůbec
zmíní), jen podle toho, JAK se kupující zeptá — délka, typ věty, úvodní
slovo — i když se ptá na úplně to samé?

**Rozměry (faktory):**
1. **Délka** (5 úrovní): 1 slovo ("sneakers") → 2 slova ("running shoes")
   → 3-4 slova ("best running shoes") → celá otázka (~8-12 slov) → detailní
   odstavec s kontextem (~30+ slov, rozpočet, use case).
2. **Typ věty** (4 úrovně): otázka ("What's the best running shoe?"),
   příkaz ("Recommend a running shoe."), potřeba/tvrzení ("I need running
   shoes."), holé klíčové slovo ("running shoes").
3. **Úvodní slovo/fráze** (5-6 úrovní): "What/Which...", "Best...",
   "I need...", "Looking for...", "Can you recommend...", "Show me...".
4. Kategorie/značka jako replikace (3-5 značek), ne jako další faktor —
   drží se konstantní fakta o značce, mění se jen dotaz.

**Jak na to prakticky, ne hrubou silou.** Doslova 10 000 ručně psaných
unikátních vět není potřeba ani praktické — většina by byla jen kosmetická
obměna, ne skutečně nová informace. Místo toho šablonový generátor:
{délka} × {typ věty} × {opener} = 5 × 4 × 6 = 120 unikátních kombinací.
Kříženo s 3-5 značkami/kategoriemi pro replikaci = 360-600 unikátních
promptů. Každý puštěný vícekrát (5-10 opakování) kvůli šumu = 1 800-6 000
reálných API volání. To je srovnatelný řád jako předchozí studie v týhle
sérii (800-2 000 volání), jen o dost víc, a klidně jde škálovat blíž
Danielově představě 10 000, pokud bude chtít.

**Co by se měřilo:** candidacy rate (zmíní značku vůbec) a selection rate
(dá ji na první místo) podle délky/typu věty/openeru. Buď se ukáže, že je
model vůči tvaru dotazu stabilní (užitečné zjištění samo o sobě — "nezáleží
jak se zeptáš"), nebo že se odpověď mění jen podle formy otázky, což by byla
silná zpráva o tom, jak moc na doporučení záleží styl psaní kupujícího
(hlasové vyhledávání jedním slovem vs. detailní chat dotaz).

Status: navrženo, čeká na rozhodnutí o rozsahu (pilot vs. plný běh) a na
zařazení do pořadí. Nespuštěno.

**Rozšíření designu (Daniel, 2026-09-11):** potvrdil směr — testovat od
jednoho slova až po celou větu/odstavec, a "typ věty" myslet doslova
gramaticky: oznamovací, rozkazovací, tázací. Otázka "napadá tě ještě něco?"
přinesla tyhle další úhly, taky zapsané pro pozdější rozhodnutí:

- **Styl psaní / interpunkce.** Otazník vs. bez něj, velká písmena vs.
  malá, čistý text vs. běžné psací chyby/překlepy (jak lidi opravdu píšou
  do vyhledávání nebo jak to vyjede přepis hlasu).
- **"Persona" dotazu.** Google-styl (holá klíčová slova, "running shoes
  buy cheap"), chat-styl (konverzačně, "hey what's a good running shoe"),
  hlasový asistent styl (dlouhé, bez interpunkce, jak vyjede přepis řeči).
  Silná osa, protože přímo mapuje, jak lidi dnes různé AI nástroje používají.
- **Počet a pozice omezení v dotazu.** Kolik podmínek kupující naskládá
  (rozpočet, velikost, účel, barva) a jestli je dá na začátek nebo konec
  věty.
- **Otevřená vs. uzavřená otázka.** "What's the best running shoe?"
  (otevřená) vs. "Is Brand X good for running?" (ano/ne) vs. "Is Brand X or
  Brand Y better?" (srovnávací).
- **Naléhavost/emoce.** Neutrální dotaz vs. naléhavý ("I desperately need
  running shoes for a marathon tomorrow!").
- **Napříč víc AI modely.** Jestli se efekt (pokud existuje) liší mezi
  GPT/Claude/Gemini/Perplexity. Váže se na už navrženou cross-model studii
  (Kandidát A v seznamu výše), blokovanou na Anthropic/Google klíčích od
  Daniela — dává smysl spojit sběr dat do jedné vlny, ne dělat dvakrát.
- **Demografie/generace pisatele (Daniel, 2026-09-11).** Mění se
  doporučení podle toho, kdo se ptá — žena, muž, mladá žena, starší muž?
  Dvě odlišné cesty, jak to testovat, s různými riziky:
  1. **Přímé přiznání v dotazu** — "As a 65-year-old man, what's a good
     running shoe?" — kontrolované, jasně měřitelné, ale je to umělé,
     lidi takhle v reálu nepíšou.
  2. **Odvozeno ze stylu psaní** — generačně/gender kódovaný způsob psaní
     (mladí: zkratky, emoji, neformální slang; starší generace: celé věty,
     formálnější tón) bez toho, aby se identita řekla napřímo — blíž
     realitě, propojuje se s osou "persona dotazu" a "styl psaní" výše.
  Tohle je citlivější téma než zbytek studie — pokud by se ukázal reálný
  rozdíl v doporučeních podle vnímaného pohlaví/věku pisatele, je to
  v podstatě nález o zaujatosti (bias) doporučovacího systému, ne jen
  o stylu promptu. Má to reportovat opatrně a věcně, se stejnou úrovní
  disclaimeru jako zbytek webu (žádné senzacechtivé závěry z malého
  vzorku), ale je to legitimní a hodnotná otázka — přidáno do designu.

Pořád nespuštěno, jen rozšířený design pro budoucí rozhodnutí o rozsahu.

**Finální design (Daniel, 2026-09-11): "udělej mi mapu."** Sepsaný do
`research-prep/prompt-shape/STUDY-DESIGN.md` — dvě oddělené vrstvy místo
jedné obří kombinatoriky:

- **Vrstva A (mechanická, neutrální):** délka (5) × typ věty (3,
  oznamovací/rozkazovací/tázací) = 15 kombinací.
- **Vrstva B (persony, hlavní vrstva):** 7 archetypů pisatele — neutrální
  baseline, Google-styl, hlasový asistent, mladá žena, mladý muž, starší
  žena, starší muž — každý s 8 rotujícími šablonami, aby nešlo o artefakt
  jedné věty.
- Sdílená mechanika: 4 značky recyklované ze Study #29 (fakta beze změny),
  stejný system-message mechanismus jako zbytek série.
- Odhad: Vrstva A 480 volání + Vrstva B 224 volání = **~704 volání** pro
  první kolo, škálovatelné výš v druhém kole.
- Měří se candidacy rate, selection rate, a nově "persona-brand afinita"
  — drží se nějaký styl blíž konkrétní značce napříč všemi 4 značkami?
- Metodologická poznámka zapsaná přímo do designu: persony jsou náš psaný
  text podle běžných konvencí registru, ne tvrzení o tom, jak skutečně
  píšou reálné skupiny lidí — nález je o reakci modelu na STYL, ne
  ověřené demografické chování. Psát o tom opatrně, věcně, bez přehánění,
  pokud se ukáže signál.

**Postavený skript (2026-09-12).** Daniel vybral tuhle studii jako další
na spuštění ze seznamu kandidátů. `research-prep/prompt-shape/brands.json`
(4 značky zkopírované ze Study #29 — 3 obskurní reálné + 1 fiktivní,
stejná fakta, stejní jmenovaní konkurenti) a
`research-prep/prompt-shape/run_study.py` (`grid-a` = Vrstva A, 480
volání; `personas` = Vrstva B, 224 volání; stejný mechanismus jako
Study #29 candidacy-multi — system message nese fakta + jmenované
konkurenty, jméno testované značky nikdy není v user promptu). Vrstva A
generovaná programově z pár ručně napsaných polí na značku (`bare_kw`,
`qualified_kw`, `topic`, `detail_context`), ne 60 ručně psaných vět.
Candidacy/selection se čtou přímo z textu odpovědi (stejná heuristika
jako zbytek série), žádný samostatný judge krok není potřeba. Odzkoušeno
nasucho (`--dry-run`), čísla sedí přesně na 480 + 224 = 704. Čeká na
Danielovo spuštění lokálně (`OPENAI_API_KEY`, sandbox nemá přístup k
api.openai.com, stejně jako u předchozích studií).

**Persony podložené reálným výzkumem (2026-09-12).** Daniel se zeptal,
jestli existuje výzkum na to, jak lidé v různých věkových kategoriích
píšou — ano, existuje. Sociolingvistický výzkum generačních rozdílů v
digitální komunikaci: starší generace čtou tečku na konci věty jako
jasnou/formální (71 % lidí nad 50), Gen Z ji vynechává a bere ji jako
chladnou/pasivně-agresivní, místo toho víc používá vykřičníky pro
nadšení. Emoji: 68 % Gen Z je běžně používá i v práci, u 50+ jen 36 %,
starší uživatelé je navíc častěji špatně interpretují. Existuje i
akademická literatura (Thurlow 2002, "Generation Txt?"; textisms a
generačně podmíněná CMC variace). Podle toho upravené
`young_woman`/`young_man` šablony v `run_study.py` (méně teček, víc
vykřičníků/emoji, lehce, ne karikatura) — `older_woman`/`older_man` už
byly v souladu, beze změny. Zdroje a plné znění poznámky:
`research-prep/prompt-shape/STUDY-DESIGN.md`. Skript znovu odzkoušen
nasucho, čísla beze změny (480 + 224 = 704).

**Reálná data, Daniel spustil (2026-09-12).** `grid_a_raw.json` (480
řádků) a `personas_raw.json` (224 řádků). Candidacy je skoro všude na
stropu ~97-100 % (očekávané, sedí s celou sérií), ale **selection rate
se hýbe silně a staticky signifikantně** — na rozdíl od většiny
předchozích framing/atribuce studií v sérii, tohle je skutečný nález,
ne null.

*Vrstva A — typ věty (pooled napříč značkami a délkami):* oznamovací
95,6 % vs. rozkazovací 86,9 % vs. tázací 74,4 % (χ²=29,65, p<0,00001).
Oznamovací věta vyhrává o 21 procentních bodů nad tázací, při identických
faktech a identické značce.

*Vrstva A — délka (pooled napříč značkami a typy):* bez čistého
monotónního trendu — L1 bare 91,7 %, L2 qualified 83,3 %, L3 "best X"
frázování 65,6 % (nejhorší!), L4 celá přirozená otázka 100 % (strop),
L5 odstavec 87,5 % (χ²=50,85, p<0,00001). Nejhorší je krátké
"best X" frázování, ne extrémy délky — kontraintuitivní a stojí za
zdůraznění.

*Vrstva A — 15 buněk (interakce délka × typ):* silná interakce
(χ²=167,97, p<0,000001) — např. L3_best_phrase × question = 28,1 %
(nejhorší buňka celé mřížky), zatímco L1_bare × question = 100 % a
L4_full_question × question = 100 %. Efekt typu věty NENÍ konstantní
napříč délkami.

*Vrstva B — persony (pooled napříč značkami):* older_man 96,9 % (nejlíp)
až google_style 68,8 % (nejhůř) — rozptyl 28 procentních bodů
(χ²=14,60, p=0,024, signifikantní). Pořadí: older_man > neutral_baseline
≈ voice_assistant ≈ young_woman (90,6 %) > older_woman (87,5 %) >
young_man (78,1 %) > google_style (68,8 %).

*Vrstva B — persona-brand afinita:* reálný signál, ne jen jednotná
kvalita značky. Příklad: bodyartforms má nejnižší celkovou selection
rate (76,8 %), ale u older_woman a young_woman skáče na 100 % — u
jiných person (google_style, voice_assistant) je naopak podprůměrná.
To je přesně ten typ nálezu (persona × značka interakce), který dělá
tuhle studii hodnotnou.

**Hlubší analýza + nezávislý re-check (Daniel, 2026-09-12) — DŮLEŽITÁ
OPRAVA.** Na Danielovu žádost dvě věci před psaním stránky:

1. *Logistická regrese s brand jako kontrolní proměnnou* (grid_a i
   personas): efekt typu věty + délky přežívá kontrolu na značku beze
   změny (LR test p<0,00000001), efekt persony taky (LR test p=0,024,
   skoro identické s prostým χ² testem) — značkové rozdíly efekt
   nevysvětlují, jsou to nezávislé, aditivní efekty. (Poznámka: plný
   model s L4_full_question měl konvergenční varování kvůli kvazi-
   separaci — ta buňka je 100/100 ve všech značkách, koeficient pro ni
   není interpretovatelný, ale omnibus LR test zůstává platný.)

2. *Nezávislý re-check mechanické `position` heuristiky* (byla to jen
   `idx < 15 % délky textu`, ne skutečné čtení pořadí). Ruční čtení
   vzorku odpovědí odhalilo reálnou chybu: model často začíná
   odpovědí úvodní větou ("The best X depends on...") PŘED číslovaným
   seznamem — testovaná značka byla často opravdu **"1." v seznamu**
   (skutečný vítěz), ale protože její první zmínka padla až za
   úvodní větou, stará heuristika ji mylně označila jako prohru.
   Napsán přesnější re-score (`grid_a_rescored.json`,
   `personas_rescored.json`): hledá první číslovanou položku
   seznamu a kontroluje značku v ní, a když seznam není, porovnává
   pořadí první zmínky značky vs. jmenovaných konkurentů. Shoda se
   starou heuristikou jen **85,4 %** napříč 704 řádky.

   **Výsledek přepočtu — efekt typu věty se OTOČIL:** stará
   heuristika: oznamovací 95,6 % > rozkazovací 86,9 % > tázací
   74,4 %. Nová: **tázací 87,5 % > oznamovací 82,5 % > rozkazovací
   76,2 %** (χ²=6,91, p=0,032 — pořád signifikantní, ale opačný
   směr). Hlavní "declarative vyhrává" nález ze starého skórování
   byl artefakt vadné heuristiky, ne reálný efekt — nesmí se
   publikovat v původní podobě.

**Skutečný LLM judge místo heuristiky (Daniel, 2026-09-12).** Daniel:
"chci to udelat dobre, jestli potrebujeme dalsi data tak pojd dame
dalsi data" — pravidlový re-score výše je pořád jen o málo lepší
heuristika, ne skutečný nezávislý úsudek. Přidán do `run_study.py`
příkaz `judge` — posílá každou odpověď s zmíněnou značkou na gpt-4o
jako skutečného soudce (`WINNER_JUDGE_SYSTEM`: značka je vítěz, pokud
je "1." v číslovaném seznamu, nebo jasně vedoucí doporučení, nebo
jediná jmenovaná značka bez konkurence; jinak ne), stejný
`_parse_json_loose` vzor jako zbytek série. Výstup má pole
`llm_is_winner` navíc k původnímu `position` (to zůstává v datech pro
transparentnost, ale `llm_is_winner` je číslo, kterému se má věřit).
Odzkoušeno nasucho na obou souborech (480 + 224 řádků, formát sedí).
Čeká na Daniela:

```
cd research-prep/prompt-shape
python3 run_study.py judge --in grid_a_raw.json --out grid_a_judged.json
python3 run_study.py judge --in personas_raw.json --out personas_judged.json
```

**FINÁLNÍ VÝSLEDKY — skutečný LLM judge, Daniel spustil (2026-09-12).**
`grid_a_judged.json` a `personas_judged.json`. Shoda judge se starou
heuristikou 90,1 % (grid) / 90,5 % (personas) — o dost vyšší než shoda
mého pravidlového re-score (85,4 %), což ukazuje, že i ten pravidlový
re-score byl sám o sobě nedokonalý. `llm_is_winner` je číslo, kterému
se věří, a je to teď třetí, ne druhé kolo přepočtu — pro každé zjištění
se srovnávají všechny tři metody (stará heuristika / pravidlový
re-score / LLM judge), aby bylo vidět, co je robustní a co bylo jen
artefakt konkrétní metody skórování.

*Typ věty — nekonzistentní přes metody, ale signifikantní ve finální:*
stará heuristika: oznamovací 95,6 % > rozkazovací 86,9 % > tázací
74,4 %. Pravidlový re-score: tázací 87,5 % > oznamovací 82,5 % >
rozkazovací 76,2 %. **LLM judge (finální): oznamovací 98,8 % >
tázací 93,8 % > rozkazovací 91,2 %** (χ²=9,11, p=0,011). LLM judge se
vrací ke směru staré heuristiky (oznamovací nahoře), ale nesouhlasí s
pořadím zbylých dvou, a hlavně — rozptyl je mnohem menší (7,6 b.b.,
ne 21 b.b.). Závěr: oznamovací věta má mírnou, ale skutečnou výhodu;
původní "21bodový rozdíl" byl nadhodnocený artefakt vadné heuristiky.

*Délka — nejrobustnější nález, stejný směr ve VŠECH TŘECH metodách:*
L3 "best X" frázování je nejslabší buňka podle staré heuristiky
(65,6 %), pravidlového re-score (69,8 %) I LLM judge (84,4 %) — jediný
nález, který se nezměnil napříč žádnou metodou skórování. L4 (celá
přirozená otázka) je na stropu 100 % ve všech třech. LLM judge:
L1 99,0 %, L2 97,9 %, L3 **84,4 % (nejslabší)**, L4 100 %, L5 91,7 %
(χ²=32,29, p=0,000002). Tohle je nález, který jde s klidným svědomím
publikovat.

*Persony — google_style konzistentně nejslabší napříč všemi třemi
metodami.* LLM judge: voice_assistant/young_woman/older_woman/
older_man všechny na stropu 100 %, neutral_baseline 93,8 %, young_man
90,6 %, **google_style 84,4 % (nejslabší)** (χ²=17,38, p=0,008).
Google-styl holých klíčových slov ("best ceramic dinnerware cheap")
funguje hůř než jakýkoliv jiný registr, včetně neformálního mladého
psaní — konzistentní přes všechny tři metody skórování.

*Persona-brand "afinita" — slabší nález, než se zdálo předtím.* Pod
LLM judge je matice skoro celá na stropu kromě bodyartforms (75–100 %
napříč personami) a google_style (88 % napříč značkami) — vypadá to
spíš jako dva ADITIVNÍ hlavní efekty (bodyartforms je obecně slabší
značka, google_style je obecně slabší persona), ne jako silná
interakce persona×značka, jak naznačovala data pod starou heuristikou.
Čestnější formulace pro stránku: "afinita" není tak silný nález, jak
se zdálo po prvním kole.

*Logistická regrese s kontrolou na značku (LLM judge ground truth):*
typ věty + délka přežívají kontrolu na brand (LR test p<0,00000001),
persona taky (LR test p=0,003) — oba efekty jsou nezávislé na
brandových rozdílech.

**Shrnutí pro publikaci:** délka (L3 "best X" slabý, plná otázka na
stropu) je nejrobustnější a nejsilnější nález, jde rovnou na stránku.
Persona (google_style slabý) taky robustní přes všechny tři metody.
Typ věty je reálný, ale mírnější, než se zdálo (oznamovací mírně nad
ostatními, ne dramaticky). Persona-brand afinita se má na stránce
prezentovat opatrněji než původně plánováno — spíš jako pozorování
("bodyartforms/google_style byly nejslabší napříč měřením") než jako
"objevili jsme interakci styl×značka".

   Efekt délky přežívá v podobném tvaru (χ²=38,87, p<0,000001,
   L3_best_phrase pořád slabší, L4 pořád strop 100 %). Efekt persony
   taky přežívá (χ²=16,77, p=0,010), pořadí se mírně posunulo
   (older_man/older_woman/young_woman nahoře, google_style/young_man
   dole), ale směr zůstal stejný. Persona-brand afinita (bodyartforms
   slabý napříč personami kromě young_woman) potvrzena i po přepočtu.

   **Závěr pro publikaci:** délka a persona jsou reálné, robustní
   nálezy přežívající nezávislý re-check. Typ věty (oznamovací vs.
   rozkazovací vs. tázací) NENÍ spolehlivý nález ve své původní podobě
   — bude potřeba buď hlásit s opravenými čísly (tázací vyhrává, ne
   oznamovací), nebo případně re-scorovat celý dataset ještě jednou
   skutečným LLM judge (sandbox nemá přístup k api.openai.com, čeká na
   Daniela), než se cokoliv o typu věty napíše na veřejnou stránku.

Čeká na Danielovo rozhodnutí o dalším kroku (hlubší analýza / psaní
stránky).

## Nový nápad: Kdo tvrzení říká — claim-attribution (2026-09-12)

Vzniklo z LinkedIn komentáře (John Michaels, reakce na Danielův komentář
pod cizím článkem o AI SEO): *"Not just on the website but across the
ecosystem. Where else and who is backing your claims. Not your
marketing but real claims..."* Bez metodologie a bez čísel z jeho
strany, ale testovatelné tvrzení stejným mechanismem jako zbytek série.

**Research question:** mění se selection rate (kdo vyhraje přímé
srovnání se zavedeným konkurentem), když je identický fakt o značce
rámovaný jako (a) self-claim/marketing první osobou, (b) neutrální
popis bez zdroje, nebo (c) zdánlivě potvrzený nezávislou třetí stranou
— při stejné délce a stejném informačním obsahu?

**Metodologická poznámka:** Brand Legibility (Study #29) už ukázala, že
candidacy rate pro pojmenované značky je skoro vždy na stropu ~100 %
nezávisle na framingu. Proto se měří primárně **winner rate** v přímém
hlava-nehlava srovnání (formát Cold Start/Hidden Context), ne candidacy.

**Design:** 4 značky (recyklované ze Study #29, 3 obskurní reálné + 1
fiktivní) × 4 podmínky (bez faktu / self-claim / neutrální / třetí
strana) × 20 nákupních záměrů × 5 opakování = **1 600 volání.** Fakt
vkládaný do skrytého kontextu stejným mechanismem jako Fact Injection a
Hidden Context, žádné jméno testované značky v user promptu, stejný
judge přístup jako zbytek série.

**Tři možné výsledky:** (1) atribuce nehraje roli, hraje roli jen
přítomnost faktu — vyvrací Michaelsovu tezi; (2) třetí strana vítězí
nad self-claim — potvrzuje ji, silný nález; (3) nekonzistentní/obrácený
výsledek napříč značkami — signál, že efekt závisí na něčem dalším.

Plný design: `research-prep/claim-attribution/STUDY-DESIGN.md`.

Otevřená rozhodnutí pro Daniela: zúžit vzorek (1 600 volání je nad
obvyklým rozsahem 800–2 000, ale ne extrémně), stačí 3 rámy atribuce
nebo přidat rozlišení typu třetí strany ve druhém kole, které přesně 4
značky použít.

Nespuštěno. Čeká na Danielovo "pilot" nebo "naplno".

## Nový nápad: Generický AI hlas vs. distinctivní lidský hlas — voice-authenticity (2026-09-12)

Zpřesňuje bod **#356** ze seznamu ("specificity A/B study"), který tam
ležel jen jako název bez designu. Podnět: LinkedIn post Nimry Shabbir —
tvrdí, že lidé bezpečně poznají generický, "duší prázdný" AI text a
přeskočí ho, zatímco čím dál víc věří AI úsudku o tom, KOHO doporučit.
To je pozorování o lidech (vyžadovalo by survey), otočené na
testovatelnou otázku o modelu: pozná/zohlední MODEL tentýž rozdíl při
rozhodování, koho doporučit?

**Research question:** mění se selection rate, když jsou identická,
ověřená fakta o značce napsaná ve třech registrech — holá fakta bez
hlasu, generický AI/korporátní buzzword text, nebo distinctivní
konkrétní lidský text — při stejném informačním obsahu?

**Metodologická poznámka:** stejná jako u claim-attribution — měří se
primárně winner rate kvůli ceiling efektu na candidacy zjištěnému u
Brand Legibility.

**Design:** 4 značky (recyklované ze Study #29/claim-attribution) × 3
registry (bare facts / generic AI voice / distinctive voice) × 20
nákupních záměrů × 5 opakování = **1 200 volání.** Distinctive voice =
doslovný "clear" framing ze Study #29 (žádná nová fakta), generic AI
voice = nový přepis týchž faktů do korporátních frází, bare facts =
telegrafický výčet. Konkrétní příklad (Colored Organics) ve všech třech
registrech je v designu.

**Tři možné výsledky:** (1) žádný rozdíl mezi registry — vyvrací
aplikaci Nimřina pozorování na model; (2) distinctivní hlas vítězí nad
generickým — potvrzuje ji, silný nález; (3) neočekávaný/obrácený
výsledek — model preferuje stručnost/neutralitu před jakýmkoliv
"prodejním" tónem.

Plný design: `research-prep/voice-authenticity/STUDY-DESIGN.md`.

Otevřená rozhodnutí pro Daniela: souhlasí s navrženým tónem generic/
bare příkladu na Colored Organics, napsat zbylé 3 značky stejně,
stačí 3 registry nebo přidat 4., zúžit 1 200 volání?

Nespuštěno. Čeká na Danielovo "pilot" nebo "naplno".

## Prompt-shape publikováno jako Study #30 a zapojeno po celém webu (2026-09-12)

Daniel schválil obsah `research/prompt-shape.html` po dvou kolech úprav
(šířka hero-stat-row na šířku navbaru, odstranění všech pomlček z textu,
zjednodušená angličtina, zdroje k personám hned u prvního výskytu v
sekci "Where this comes from" i podrobně u nálezu). Přiřazeno číslo
**Study #30** (poslední bylo brand-legibility #29). Zapojeno stejným
způsobem jako každá předchozí studie:

- `vercel.json` — routy `/research/prompt-shape` a `/research/prompt-shape/`.
- `sitemap-pages.xml` — nový `<url>` záznam.
- `llms.txt` — nový bullet v Research sekci + oprava zastaralého
  "19 reports and counting" na "30 reports and counting".
- `research/mechanism-studies.html` — nová karta ve gridu studií.
- `research/index.html` — nová karta v rotujícím Mechanism Studies
  panelu + nový finding-card (data-key="28") ve flip-grid sekci.
- `research/how-ai-decides.html` — nová `.mini-card` ve skupině
  "Candidacy" v Research Library + nový odkaz v `.layer-related` bloku
  sekce "4 · Candidacy" (hlavní obsah stránky, ne jen knihovna).
- Sitewide footer `.ai-sitemap` blok — odkaz na prompt-shape přidán do
  všech **150 živých stránek** (skript, ne ručně; kotva = přesný text
  odkazu na brand-legibility, vloženo hned za něj). Vynechána záměrně
  interní stará zrcadlová složka `new-web/` uvnitř `atom-landing-main 4`
  (120 souborů, zaseknutá na "18 Public Studies" a chybí jí i
  brand-legibility odkaz — už předtím nebyla součástí žádného
  sitewide kroku, není live web, netýká se tohoto zapojení).
- Sitewide "Public Studies" counter — bump na **30** ve všech 150
  živých souborech (včetně vlastní stránky prompt-shape.html).

Ověřeno skriptem: 146 souborů dostalo nový odkaz, 4 ho už měly
(mechanism-studies.html, research/index.html, how-ai-decides.html mají
odkaz v hlavním obsahu i v patičce, prompt-shape.html má vlastní
sebe-odkaz), 0 souborů bez kotvy k ruční kontrole, 0 souborů bez vzoru
Public Studies. Tag-balance kontrola (div/section/a/span) prošla na
vzorku 10 klíčových souborů po skriptu beze změny.

## Claim-attribution — postaven run_study.py, čeká na Danielův reálný běh (2026-09-12)

Daniel zvolil claim-attribution jako další studii a chtěl ji "od a až do
z... kompletně" — vznikla z LinkedIn komentáře Johna Michaelse ("kdo
stojí za tvým tvrzením... ne marketing, ale reálná tvrzení ve struktuře,
kterou LLM hledá"). Cíl: zjistit, jestli se selection rate (vyhraje
přímé srovnání s konkurentem) mění podle toho, JAK je fakt o značce
podaný — jako vlastní tvrzení (self-claim), neutrální popis bez zdroje,
nebo jako potvrzení nezávislou třetí stranou — i když fakt samotný,
jeho délka a obsah zůstávají identické. Kontrolní podmínka "bez faktu"
navíc replikuje základní Cold Start/Fact Injection nález (mění vůbec
přítomnost faktu něco).

Postaveno v `research-prep/claim-attribution/`:

- `brands.json` — 4 značky recyklované ze Study #29 (framings_obscure.json:
  Colored Organics, BodyArtForms, Barbaro Mojo) a Study #30's fiktivní
  kontroly (Hearthloom) — žádná nová fakta, jen přeformulovaný stejný
  fakt do first-person/third-person páru pro každou značku. Každá značka
  má JEDEN pevný, zavedený konkurenta (ne 3 jmenované jako u Study
  #29/#30) — Finn + Emma, Painful Pleasures, Gindo's, Kilnmere — a 20
  nákupních záměrů.
- `run_study.py` — mechanika: hlava-nehlava vynucené srovnání (stejný
  vzorec jako Cold Start a Hidden Context), fakt vkládaný do SYSTÉMOVÉ
  zprávy (ne do user promptu — stejný mechanismus jako Hidden Context/
  Fact Injection), user prompt jmenuje jen konkurenta ("What's the best
  X? I'm already considering {konkurent}..."), testovaná značka se v
  user promptu nikdy nejmenuje. 4 podmínky × 4 značky × 20 záměrů × 5
  opakování = 1 600 volání. **Reálný LLM judge (gpt-4o, temperature=0)
  zabudovaný od začátku** — ne mechanická heuristika — přesně podle
  poučení ze Study #30 (Prompt Shape), kde mechanická heuristika třikrát
  selhala a otočila hlavní nález. Judge klasifikuje winner jako
  target/competitor/neither/both z textu odpovědi.
- Otestováno `python run_study.py all --dry-run` v sandboxu — celý
  pipeline (run → judge → analyze) proběhl čistě, 1 600 řádků, žádné
  chyby. Syntetická dry-run data smazána, aby nepletla reálný běh.

Čeká na Daniela: spustit `python run_study.py all` lokálně s
`OPENAI_API_KEY` (sandbox nemá přístup k api.openai.com), pak výsledky
znovu analyzovat s plnou přísností, postavit `research/claim-attribution.html`,
ukázat Danielovi před zapojením, pak zapojit všude (vercel.json, sitemap,
llms.txt, mechanism-studies.html, research/index.html, how-ai-decides.html,
patička, Public Studies bump na 31).

## Claim-attribution — reálná data, stránka postavena, čeká na schválení (2026-09-12)

Daniel spustil `python3 run_study.py all` lokálně, 1 600 reálných volání
+ 1 600 judge volání proběhlo čistě (0 parse failures). Výsledek je
opačný, než tvrdil John Michaels:

- **Self-claim vyhrává nejvíc: 65.2%.** Třetí strana: 43.2%. Neutrální
  (bez zdroje): 23.0%. Bez faktu vůbec: 0.2%.
- Každý rozdíl je vysoce signifikantní (self-claim vs. třetí strana
  z=6.25, třetí strana vs. neutrální z=6.08, neutrální vs. bez faktu
  z=10.04, všechny p&lt;0.0001; pooled &chi;&sup2;=419.70, df=3).
  Pořadí self-claim &gt; třetí strana &gt; neutrální drží ve všech 4
  značkách nezávisle (per-brand &chi;&sup2; 52 až 168, všechny
  signifikantní samy o sobě).
- BodyArtForms je výrazně slabší napříč všemi podmínkami (strop 24 %
  místo 71-85 % u ostatních 3) — vysvětleno ruční kontrolou skutečných
  odpovědí: v piercing kategorii má gpt-4o silné vlastní znalosti
  konkurenčních značek (Neometal, Anatometal, Industrial Strength),
  které soutěží o pozornost mnohem víc než u ostatních 3 obskurních/
  fiktivních značek.
- Poctivě přiznaný confound: self-claim rám je zároveň nejkonkrétnější
  formulace ("on {brand}'s own website...") — může se částečně měřit
  "zní to jako skutečný popis produktu", ne čistě atribuce samotná.
  Uvedeno na stránce v sekci "What this doesn't prove".
- Menší datová anomálie u Barbaro Mojo (4 z 1600 řádků): model občas
  echoval frázi z injektovaného faktu ("Every Barbaro Mojo hot
  sauce...") jako by to bylo jméno značky — judge to správně
  nezapočítal jako čistou výhru. Zdokumentováno na stránce, netýká se
  platnosti hlavního nálezu.

Postaveno `research/claim-attribution.html` (Study #31), stejný design
systém jako zbytek série. Čeká na Danielovo schválení než se zapojí
sitewide (vercel.json, sitemap, llms.txt, mechanism-studies.html,
research/index.html, how-ai-decides.html, patička, Public Studies bump
na 31).

## Claim-attribution — round 2 (word-count-matched), kombinovaná data, zapojeno sitewide (2026-09-12)

Daniel chtěl studii "zabetonovat" — najít slabinu a buď ji vyvrátit,
nebo potvrdit. Nezávislá kontrola odhalila skutečný confound v round 1:
self-claim wrapper byl o 9-12 slov delší než holý fakt, third_party o
8 slov delší, neutral 0 slov navíc. Round 1 tedy částečně měřil délku
zprávy, ne čistě atribuci.

**Náprava:** `run_study_v2.py`, nový seed, wrappery přepsané na stejný
počet slov (do 1 slova rozdílu) napříč všemi 3 podmínkami atribuce,
stejný third-person `neutral_fact` string všude. Daniel spustil 1 600
dalších reálných volání + 1 600 judge volání, opět čistě (0 parse
failures). Round 2 samostatně: self-claim 69.8 %, third-party 59.0 %,
neutral 37.8 %, bez faktu 0.0 %. Efekt drží i s vyváženou délkou.

**Kombinovaná analýza (oba rounds, n=200 na buňku místo 100):**

- Self-claim 67.5 %, third-party 51.1 %, neutral 30.4 %, bez faktu
  0.1 %. Každé z 800 srovnání je vysoce signifikantní (z=6.67 / 8.45 /
  16.83, pooled &chi;&sup2;=866.67, df=3).
- Logistická regrese (statsmodels, kontrola na značku, round a počet
  slov zprávy) potvrzuje: podmínka zůstává drtivě signifikantní
  (p=7.4&times;10&#8315;&sup1;&sup2;&sup4;), zatímco vlastní efekt
  počtu slov po kontrole přestává být signifikantní (p=0.35). Délka
  byla reálná věc ke kontrole, ale neřídí nález.
- Split-half kontrola (run_idx 0-1 vs. 2-4 v rámci každé podmínky)
  nenašla žádný časový drift v API (všechny rozdíly &lt;1pp).
- Per-brand na round 2 samostatně je šum vyšší než v round 1 (u 2 ze 4
  značek přesné pořadí self-claim &gt; third-party &gt; neutral
  přesně nedrží, colored-organics má malý nesignifikantní obrat third
  vs. neutral, p=0.39). Po sečtení obou rounds (n=200) drží pořadí
  a obě klíčová srovnání jsou signifikantní ve všech 4 značkách
  zvlášť.

**Verdikt pro Michaelse:** na konkrétní testované tvrzení (self-claim
vs. třetí strana) neměl pravdu, model preferuje, když si to řekne
značka sama, ne třetí strana. Jeho širší intuice "jakýkoli zdroj je
lepší než žádný" byla ale potvrzená — třetí strana jasně poráží
neutrální tvrzení bez zdroje (51.1 % vs. 30.4 %).

Stránka `research/claim-attribution.html` přepsána na kombinovaná
čísla (67.5/51.1/30.4, 3 200 volání, nová sekce "Making Sure It
Holds" vysvětlující confound a regresi). Daniel schválil po dvou
kolech oprav (rozbitý exponent v otočné kartě, anonymizace Michaelse
na "J.M." na veřejné stránce).

**Zapojeno sitewide (main 4):** vercel.json (2 routes), llms.txt,
sitemap-pages.xml, research/mechanism-studies.html (report-card),
research/index.html (report-card + finding-card, data-key 29),
research/how-ai-decides.html (Evaluation layer — related research
link + mini-card, ne Candidacy), patička `.ai-sitemap` na 147 dalších
živých stránkách + vlastní odkaz na claim-attribution.html opraven ze
starých čísel (65%/43%) na 67.5%/51.1%, Public Studies bump 30 &rarr;
31 na 152 stránkách. `new-web/` podsložka (zastaralá kopie, mimo
routing) vědomě vynechána.
