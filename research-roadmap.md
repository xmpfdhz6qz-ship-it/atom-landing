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

## Nový nápad: Vágní vs. konkrétní PDP/pricing specifikace, pdp-specificity (2026-09-12)

Zpřesňuje bod **#356** z jiného úhlu než voice-authenticity. Podnět:
LinkedIn komentář Kristine Estigoy pod founders-reality-check postem —
tvrdí, že čím konkrétnější jsou features/benefits/claims na pricing a
PDP stránkách, tím větší šance na AI doporučení. Daniel na to veřejně
odpověděl, že to otestujeme, takže tohle je design, co ten slib plní.

**Research question:** mění se selection rate, když je o produktu k
dispozici stejné množství textu ve formátu PDP/pricing stránky, ale
jednou jako vágní marketingové tvrzení bez čísel a podruhé jako
konkrétní specifikace (přesné rozměry, materiály, ceny, záruky)?

**Rozdíl od voice-authenticity:** ta mění REGISTR/HLAS (holá fakta /
generický AI tón / distinctivní lidský tón) při stejné hloubce faktů.
Tahle studie mění HLOUBKU/KONKRÉTNOST samotných tvrzení. Jde napsat
distinctivním hlasem, ale pořád vágně na čísla, a naopak, jsou to dvě
nezávislé osy.

**Design:** 4 značky (recyklované ze Study #29/claim-attribution/
voice-authenticity) x 3 podmínky (bez claims / vágní / konkrétní) x 20
nákupních záměrů x 5 opakování = **1 200 volání.** Stejná fakta v obou
verzích, mění se jen forma, číslo/specifikace vs. vágní přídavné jméno.

Plný design: `research-prep/pdp-specificity/STUDY-DESIGN.md`.

Otevřená rozhodnutí pro Daniela: spojit s voice-authenticity do
jednoho faktoriálního designu (3 registry x 2 úrovně konkrétnosti)
místo dvou samostatných 1 200volání studií, souhlasí s navrženým tónem
vágní/konkrétní přepisu na příkladu Colored Organics, zúžit sample
size?

**Update (2026-09-13): naplno proběhly 3 kola, 3 600 volání, publikováno jako
Study #32 — `research/pdp-specificity.html`.**

Kolo 1 (původní 4 značky, 1 200 volání): specifické tvrzení vyhrálo nad
vágním v poolovaném součtu (62.8 % vs. 54.2 %, no_claims 0 %), ale
Colored Organics (organické dětské oblečení) šlo opačným směrem
(93 % vágní vs. 83 % konkrétní).

Kolo 2 (přesná replikace, nové API seedy, 1 200 volání): poolovaný efekt
se replikoval téměř identicky (63.0 % vs. 54.0 %), Colored Organics
reverzoval znovu (94 % vágní vs. 87 % konkrétní). Kontrola na word count
(specifické verze byly o 7 až 20 slov delší) potvrdila, že efekt není
jen délka textu (p=0.0005 po kontrole, word count sám p=0.24).
Test interakce brand x specificity přes obě kola (LR=35.87, df=3,
p<0.0001) potvrdil, že heterogenita mezi značkami je reálná, ne jen šum
ze 4 nekorigovaných testů.

Kolo 3 (4 nové značky, zvolené záměrně 2 a 2 na ose trust/safety
sensitive vs. čistě funkční, 1 200 volání): Wild One a Primally Pure
(trust) vs. Bellroy a Zigpoll (funkční). Wild One reverzoval významně
(87 % vágní vs. 74 % konkrétní, p=0.02), Zigpoll zlepšil se významně
(85 % vs. 96 %, p=0.008). Bellroy a Primally Pure byly už u stropu
(99 až 100 % v obou podmínkách u obou), takže tam nebyl prostor cokoliv
zjistit.

**Finální spojená analýza (všech 8 značek, 2 400 volání, po 600 na
buňku):** funkční kategorie (Barbaro Mojo, Hearthloom, Bellroy, Zigpoll)
68.8 % vágní na 84.5 % konkrétní, zisk 15.7 bodu, p<0.0001. Trust
kategorie (Colored Organics, BodyArtForms, Wild One, Primally Pure)
65.2 % vágní na 60.7 % konkrétní, ztráta 4.5 bodu (samotný trust pokles
není signifikantní na této velikosti vzorku, ale interakce
category_type x specificity je, LR=39.26, df=1, p<0.0001).

**Verdikt:** Kristine měla pravdu jen zčásti. Konkrétnost pomáhá
spolehlivě ve funkčních kategoriích, ale ve značkách, kde je hlavní
věcí důvěra a bezpečnost, konkrétnost buď nepomáhá, nebo skutečně
škodí. 0 ze 4 trust značek ukázalo signifikantní zlepšení, 3 ze 4
funkčních značek ano.

## Nový nápad: Services vertikála (terapeuti, lokální služby) — samostatný kanál (2026-09-14)

Podnět: LinkedIn vlákno s Amiya M. (zakladatelka Findable Therapist),
která popsala vlastní pozorování u terapeutů — v jejím pole je kandidátů
tak málo, že "projít do užšího výběru" je většina bitvy, na rozdíl od
přeplněného e-commerce, kde vyhrává až samotná selekce. Nezávisle na tom
se Daniela na to samé (jestli umíme změřit AI doporučení u služeb)
zeptal i jiný člověk. Dva nezávislé podněty na stejnou mezeru je dost
silný signál, že jde o vlastní vertikálu, ne jen o odpověď v komentáři.

**Proč je to jiné od dosavadní série:** celá dosavadní série (Volba
kandidáta, Cold Start, Brand Legibility, Claim Attribution,
pdp-specificity, Winner vs Loser návrh) běží na e-commerce značkách s
jasným produktem, cenou a recenzemi. Služby (terapeuti, právníci,
řemeslníci, lokální poskytovatelé) mají jinou strukturu dat: NAP
konzistence (jméno/adresa/telefon) napříč weby a adresáři, licence a
certifikace místo specifikací, recenze mají jinou váhu a menší objem,
a hlavně, podle Amiyina pozorování, výrazně méně kandidátů vůbec projde
do prvního gate.

**Otevřené otázky pro design:** replikovat existující Candidacy/Evaluation
metodiku na nové kategorii (terapeuti, právníci, řemeslníci) místo
e-commerce značek, nebo cíleně přidat cross-source konzistenci (stejný
popis napříč weby/adresáři vs. nekonzistentní) jako nový faktor, který
dosavadní série vůbec netestovala. Pravděpodobně vyžaduje i test s
live search zapnutým, protože NAP konzistence dává smysl hlavně jako
retrieval signál, ne jako signál z paměti modelu.

Status: nápad, čeká na design. Feeds novou mezeru, kterou zatím
/research/how-ai-decides vůbec nepokrývá (celá mapa je postavená na
produktových značkách).

## Nový nápad: Audit statistické síly napříč vlastní sérií (2026-09-14)

Podnět: LinkedIn post Agnes Kaczmarek (Marketing Enigma AI), cituje
akademický preprint "The Dice Roll Method" (arXiv, 3.9.2026, reanalýza
cca 190 000 pozorování), který tvrdí, že i 5 pozorování může být jen
exploratory evidence, ne spolehlivý závěr, a že počet opakování musí
být kalibrovaný na konkrétní use case, ne fixní napříč vším.

**Proč se nás to týká přímo:** velká část dosavadní série (Cold Start,
Claim Attribution, pdp-specificity, Brand Legibility) běží na 5
opakováních na buňku. Recommendation Confidence studie testovala jinou
věc, jestli hedging modelu koreluje s reálnou jistotou, ne jestli je
náš vlastní počet opakování statisticky dostatečný. Zatím nemáme
vlastní audit vlastní metodiky na tohle konkrétní kritérium, a právě
jsme veřejně citovali paper, který ho pojmenovává.

**Co by se mělo změřit:** power analýza napříč existujícími studiemi,
kolik opakování by bylo skutečně potřeba pro naměřenou velikost efektu,
aby výsledek nebyl jen exploratory podle vlastního citovaného kritéria.
Konkrétní kandidáti na doběhnutí vyšším n: BodyArtForms null výsledek
(pdp-specificity), hraniční p-hodnoty (cena v Volbě kandidáta, p=0,055).

Status: nápad, čeká na prioritizaci. Není nová studie o novém tématu,
je to audit rigoróznosti stávající série, přímý důsledek vlastního
požadavku na "neprůstřelnost" každé studie.

## Winner vs Loser — run_study.py napsaný, čeká na Danielův reálný běh (2026-09-14)

Design v `research-prep/winner-vs-loser/STUDY-DESIGN.md` byl zabetonovaný
(pre-registrované H1/H2/H3/Null, povinná round 2 replikace na novém seedu,
confound checky naplánované předem, korekce na mnohonásobné testování
jedním LR testem místo sedmi, no file-drawer, sekce o síle testu). Teď
napsané a dry-run ověřené: `run_study.py` (kolo 1) + `run_study_v2.py`
(kolo 2, `--compare`), 4 značky x 8 podmínek (rating x specificita x
formát) x 20 záměrů x 5 opakování = 3 200 volání na kolo, 6 400 celkem.

Dry-run (simulovaná data, ne reálná) prošel čistě na obou kolech, 0/3200
parse failures na kolo, LR test se spočítal bez chyby. `analyze` teď
automaticky počítá i všechny confound checky ze sekce 7, word count podle
formátu, stropové/podlahové efekty po buňce, position bias, "follows the
rating" rate, a jeden LR test na celý model jako primární důkaz.

Čeká se na Danielův reálný běh přes jeho vlastní terminál a
OPENAI_API_KEY, stejně jako u každé předchozí studie v sérii.

## Winner vs Loser hotovo, publikováno jako Study #33 (2026-09-15)

Oba běhy proběhly naostro (Daniel, vlastní OPENAI_API_KEY), 6 400 volání
celkem, 0/6400 parse failures. Podle vlastního pre-registrovaného
pravidla (efekt musí držet směr i signifikanci zvlášť v obou kolech,
ne jen v poolovaných datech) se potvrdily jen dva ze čtyř nálezů.

Potvrzeno: rating rozhoduje o vítězi 90.8 % případů bez ohledu na
zbylé dva faktory (99.2 % vs 17.6 % podle úrovně ratingu, replikováno
skoro identicky v obou kolech). Specificita má menší, ale reálný
samostatný efekt (55.5 % vs 61.3 %, p<0.001 v obou kolech zvlášť).

Nepotvrzeno: interakce kategorie x specificita (hlavní nález z
pdp-specificity) a hlavní efekt formátu zprávy oba selhaly v testu
zvlášť po kole (p=0.063/0.328 pro interakci, p=0.2515/0.1511 pro
formát), i když poolovaná data vypadala hraničně signifikantně —
přesně ten typ pasti, na který bylo pre-registrované pravidlo
postavené.

Stránka `/research/winner-vs-loser` hotová a zapojená všude: vercel.json,
sitemap-pages.xml, llms.txt, footer ai-sitemap odkaz na 153 stránkách,
karta v mechanism-studies.html i research/index.html (report-card +
rotating finding-card), mini-card + Related research odkaz v
how-ai-decides.html Evaluation vrstvě, status bonus sekce "Winner vs
Loser" tam povýšen z "Active Research" na "Partially Measured" (tři
z jedenácti kandidátních signálů teď reálně změřené, zbytek otevřený).
Public Studies počítadlo 32 → 33 všude.

## Purchase konečně navrženo, ne zaparkováno (2026-09-14)

Podnět: LinkedIn post Christian Rich (Azoma, agentic commerce) o Meta's
Muse/Clark asistentovi, co reálně živě prochází Amazon a dokončí nákup
kartáčku bez zásahu člověka. Jeden anekdotický příklad s motivovaným
rámováním (sám dělá byznys na agentic commerce), ale ukazuje, že agentic
checkout je nasazený, ne hypotetický. Daniel se rozhodl Purchase mezeru
už nenechávat na konec, řešíme ji teď, ne až po Founder Lab RCT.

Design v `research-prep/purchase-measurement/STUDY-DESIGN.md`: observační
audit existujících dat Founder Labu, ne nový experiment, žádná nová AI
volání. Rozdělit provoz na lidský / známý AI crawler bot / AI-referral
session, spočítat conversion rate po třídě, srovnat s lidskou
návštěvností. Pre-registrované H1 (AI provoz existuje a konvertuje), H2
(jde rozeznat agentic checkout od AI-assisted lidského nákupu), Null
(zatím nic měřitelného, objem příliš malý nebo nový, publikovatelné jako
první reálná baseline stejně jako pozitivní nález).

Blokováno na 3 technických otázkách pro Daniela (loguje se referrer u
site_visits, existuje tabulka/webhook s dokončenými objednávkami
spárovatelná se session, jak dlouho tracking běží a jaký je objem), ne na
API klíči. Jakmile bude jasno, jde se rovnou na pull skript, žádné GPT
volání to nepotřebuje.

**Update (2026-09-15): zastaveno na startu.** Daniel odpověděl — Founder
Lab nemá zatím ani jedinou dokončenou objednávku. Bez jediné konverze
nejde počítat žádný conversion rate, ani nulový nález by nebyl
informativní (nejde odlišit "AI provoz nekonvertuje" od "nikdo zatím
nekonvertuje"). Purchase se teď dělat nebude. Design v
`research-prep/purchase-measurement/STUDY-DESIGN.md` zůstává hotový a
čeká, dokud Founder Lab nebude mít reálné objednávky, na kterých se dá
něco měřit.

## Authority — Study #34, hotovo, obě kola reálně proběhla (2026-09-15)

Design v `research-prep/authority-signal/STUDY-DESIGN.md`: přímé
pokračování Winner vs Loser (Study #33), testuje Authority, další
kandidátní signál ze seznamu na how-ai-decides bonus sekci. Dvě fáze,
aby ratingova dominance (99 % vs 18 %) nepřehlušila slabší signál dřív,
než ho vůbec uvidíme: Fáze 1 měří Authority samotnou (metodika Volby
kandidáta, čisté číslo srovnatelné s hierarchií rating/specificita/cena),
Fáze 2 kříží Authority x rating 2x2 (metodika Winner vs Loser), aby šlo
oddělit hlavní efekt od interakce s ratingem.

Napsané a dry-run ověřené: `run_study.py` (kolo 1) + `run_study_v2.py`
(kolo 2, `--compare`). Fáze 1: 4 značky x 2 podmínky x 20 záměrů x 5
opakování = 800 volání. Fáze 2: 4 značky x 4 podmínky x 20 záměrů x 5
opakování = 1 600 volání. 2 400 volání na kolo, 4 800 celkem. Dry-run
prošel čistě na obou kolech, 0/4800 parse failures, LR test (fáze 2) i
binomický test (fáze 1) se spočítaly bez chyby.

Pre-registrované H1 (Authority sama posune verdikt), H2 (přežije proti
ratingu, ale slaběji, víc když je s ratingem v konfliktu než když s ním
souhlasí), Null (Authority je šum). Povinná round 2 replikace, žádný
file-drawer, word-count poznámka (authority přidává větu, tedy délku
navíc ze své podstaty, ne confound co se dá odstranit).

Daniel spustil obě kola naostro přes vlastní terminál a OPENAI_API_KEY.
0/4 800 parse failures napříč oběma koly. Výsledky:

Fáze 1 (Authority samotná, bez ratingu): kolo 1 85,5 % (p=9,47e-99),
kolo 2 84,8 % (p=3,30e-94), kombinovaně 85,2 %. Per-brand kombinovaně:
barbaro-mojo 64,5 %, colored-organics 81,3 %, hearthloom 96,8 %,
bodyartforms 98,0 % — není to čistě trust vs. funkční rozdělení
(barbaro-mojo i hearthloom jsou obě "funkční" kategorie, přesto úplně
jiná čísla), pořadí značek identické v obou kolech.

Fáze 2 (Authority x rating 2x2): rating sám o sobě 100,0 % / 10,8 %
kombinovaně (prakticky beze změny oproti Winner vs Loser). Authority
sama (pooled marginal) jen 56,1 % / 54,6 %, rozdíl ~1,5 bodu. Když
Authority souhlasí se silnějším ratingem, žádný samostatný efekt vidět
není (obě buňky na stropu/podlaze, 100,0 %/9,2 % v obou kolech). Když
Authority jde proti ratingu (na slabší značku), zvedne ji z 10,8 % na
12,3 % kombinovaně — reálný, stejnosměrný, ale téměř zanedbatelný
posun v obou kolech. Stejná velikost efektu (~1,5–1,6 bodu) se ukázala
i na opačné straně: značka se silnějším ratingem, která navíc dostane
Authority, jde z 89,2 % na 90,8 %. LR test (fáze 2, plný model vs.
null): kolo 1 LR=1651,07, kolo 2 LR=1659,81, oba p≈0 — ale prakticky
celou tu sílu dodává rating (koeficient ~29,6), ne Authority
(koeficient jen 0,29–0,34). 14 z 16 fáze-2 buněk označeno jako
strop/podlaha v obou kolech, identická sada obě kola.

Verdikt: Authority je sama o sobě silný signál, silnější než
specificita (81,9 %), druhý nejsilnější po ratingu — ale jakmile je
rating v místnosti, Authority se z nezávislé páky mění téměř v šum,
ještě víc než Format ve Winner vs Loser.

Stránka `research/authority-signal.html` (Study #34) postavena,
odeslána Danielovi ke kontrole, po zpětné vazbě opravena (badge
spacing v prompt-table, stale title/og/JSON-LD headline, přesná
formulace "unchanged from Winner vs Loser" nahrazena přesnějším
popisem). Daniel schválil, sitewide zapojeno (2026-09-16): vercel.json,
sitemap-pages.xml, llms.txt, research/mechanism-studies.html
(report-card + footer link), research/index.html (report-card +
finding-card data-key=32 + footer link), research/how-ai-decides.html
(Evaluation mini-card, Related research link, bonus "Winner vs The
Loser" section paragraph updated s Authority výsledky), a sitewide
footer ai-sitemap odkaz + bump 33→34 Public Studies napříč všemi 155
živými stránkami (stará nepoužívaná `new-web/` podsložka a
`atomfoundry-redesign.html` vynechány, stejně jako u předchozích
studií). Do winner-vs-loser.html přidán dodatek s odkazem na
pokračování.

## Guinea pig pro services vertikálu: Cassio Oliveira (2026-09-15)

LinkedIn vlákno s Cassio Oliveira (Fractional Chief Health Officer /
executive health coach pro zakladatele, 15+ let, 8 zemí). Reagoval na
Danielovo zjištění o web search (77 % změna doporučení) otázkou, jestli
stejná dynamika platí i pro službu bez product page. Daniel mu nabídl
změření, kde stojí proti konkurenci v AI doporučeních — Cassio řekl ano.

Dal 4 reálné dotazy, jak by ho jeho kupující reálně hledal (ne jak by se
sám popsal):
- fractional chief health officer
- executive health coach for founders
- who can help a CEO fix their energy and sleep
- health advisor for business owners over 40

Vlastní pozorování, které stojí za zapsání: pracuje v angličtině,
portugalštině a francouzštině, brazilský a evropský trh se prý chovají
úplně jinak. Tvrdí, že stejný dotaz ve třech jazycích nedá jen jiný
překlad doporučení, ale úplně jinou sadu doporučených. To je proměnná,
kterou žádná naše dosavadní e-commerce studie nemá (jazyk/trh jako
faktor vedle rating/specificity/format).

Status: zatím nic neměříme. Cassio je zapsaný jako dobrovolný guinea pig
pro services vertikálu (viz task #405, services vertikála — terapeuti /
lokální služby, navržena dřív z podnětu Amiya M.). Až se na tu studii
dostane řada, jeho 4 dotazy jsou hotový vstupní materiál a
cross-language/market dynamika je silný kandidát na druhý faktor v
designu, ne jen bonus poznámka.

## Brand familiarity — Study #35, hotovo, obě kola reálně proběhla (2026-09-16)

Daniel vybral z nabídnutých možností (Brand familiarity / Stability vrstva
/ Confidence audit / services vertikála) přímé pokračování stejné rodiny
studií po Authority — další netestovaný kandidátní signál ze seznamu na
how-ai-decides bonus sekci "Winner vs The Loser" (4 z 11 tagů teď
změřené: rating, specificity, format, authority).

Design v `research-prep/brand-familiarity/STUDY-DESIGN.md`: signál =
samostatně tvrzená, nikým neatribuovaná šíře uznávaná popularita/známost
("It is one of the most recognized and widely trusted [category] brands
among [audience]."), záměrně odlišná od Authority (žádný jmenovaný třetí
subjekt) i od claim-attribution (žádná změna atribuce, jen jiný obsah
tvrzení). Stejná dvoufázová metodika jako Authority: Fáze 1 měří
familiarity samotnou (metodika Volby kandidáta), Fáze 2 kříží familiarity
x rating 2x2 (metodika Winner vs Loser). Stejné 4 značky, stejné
target_plain_claim/competitor_claim (beze změny z Authority), nový
familiarity_fact per značku (15-17 slov, srovnatelná délka s Authority's
authority_fact).

Vzorek stejný jako Authority: Fáze 1 = 800 volání/kolo, Fáze 2 = 1 600
volání/kolo, 2 400/kolo, 4 800 celkem přes 2 povinná kola. Pre-registrované
H1 (familiarity sama posune verdikt, očekávaně slabší než Authority's
85,2 %), H2 (přežije proti ratingu, ale slaběji, víc v konfliktu než v
souhlasu), Null (familiarity je šum, samo o sobě publikovatelný nález —
odliší "tvrzení o popularitě" od "konkrétní zmínka od třetí strany").

Napsané a dry-run ověřené: `run_study.py` (kolo 1, SEED=20260917) +
`run_study_v2.py` (kolo 2, SEED=20260924, `--compare`). Oba běhy prošly
čistě, 0/4 800 simulovaných parse failures, LR test i binomický test se
spočítaly bez chyby, `--compare` blok funguje.

Daniel spustil obě kola naostro. 0/4 800 parse failures napříč oběma
koly.

**Fáze 1 (familiarity samotná):** kolo 1 80,6 % (p=8,97e-72), kolo 2
78,9 % (p=1,95e-63), kombinovaně 79,8 % — silný signál, blízko
specificitě (81,9 %), o něco slabší než Authority (85,2 %). Per-brand
kombinovaně: barbaro-mojo 53,5 % (identicky v obou kolech, nejslabší
reakce ze všech značek/signálů dosud měřených), bodyartforms 96,8 %,
colored-organics 87,0 %, hearthloom 81,8 %.

**Fáze 2 (familiarity x rating 2x2):** rating sám 99,8 %/11,2 %
kombinovaně, beze změny. Familiarity sama (pooled marginal) jen
55,6 %/55,4 % — rozdíl kombinovaně 0,2 bodu (kolo 1 0,4 b, kolo 2 přesně
0,0 b). Menší než Authority's 1,5 bodu. Rozpad podle shody s ratingem:
když familiarity souhlasí se silnějším ratingem, žádný efekt (obě buňky
prakticky na stropu/podlaze v obou kolech). Když familiarity jde proti
ratingu, zvedne slabší značku z ~11,2 % na ~11,7 % kombinovaně (+0,6 b
kolo 1, +0,4 b kolo 2) — směr konzistentní v obou kolech, ale velikost
efektu je v řádu šumu při n=400/buňku. LR test (fáze 2, plný model vs.
null): kolo 1 LR=1621,71, kolo 2 LR=1605,73, oba p≈0, ale koeficient
familiarity samotné je v obou kolech minimální (0,08-0,10) — sílu testu
táhne skoro výhradně rating. 14 z 16 buněk na stropu/podlaze, identická
sada v obou kolech.

**Verdikt (obě kola replikují směr i významnost, per pre-registrované
pravidlo):** H1 potvrzeno — familiarity sama je silný signál (~79,8 %).
H2 nepotvrzeno — jakmile je v modelu rating, efekt familiarity je
statisticky neodlišitelný od nuly. Čistší, ostřejší verze "spolknuto
ratingem" příběhu než Authority, kde malý ~1,5bodový efekt v obou kolech
přece jen přežil. Zajímavý kontrast mezi studiemi: pojmenovaná zmínka od
třetí strany si proti ratingu drží drobnou, ale reálnou a opakovanou
výhodu; holé, nijak nepodložené tvrzení o vlastní popularitě ne.

Stránka `research/brand-familiarity.html` postavená, ukázaná Danielovi
a schválená ("dej vsude prosim"). Sitewide zapojeno 2026-09-15:
vercel.json, sitemap-pages.xml, llms.txt, mechanism-studies.html,
research/index.html (report-card + finding-card data-key 33),
how-ai-decides.html (mini-card v Evaluation vrstvě, Related research
odkaz, aktualizovaný úvodní odstavec bonus sekce), sitewide footer
ai-sitemap odkaz na 155 živých stránkách, sitewide bump Public Studies
34→35. Addendum na winner-vs-loser.html rozšířen o Study #35 vedle
Study #34.

## Audit statistické síly — Study #406, hotovo (2026-09-15)

Plné znění: `research-audit-statisticka-sila-2026-09-15.md`. Podnět: vlastní
veřejná citace paperu "The Dice Roll Method" (arXiv:2609.04047), který
pojmenovává přesně tohle riziko u repeated-query LLM měření.

Metodika: cluster-permutation test (klastrováno na úrovni intentu, ne
jednotlivého callu) přepočítaný zpětně na existující raw data Authority
Signal a Brand Familiarity, stejná metoda, jakou už dřív v sérii používaly
Volba kandidáta / Cold Start / Multi-turn Displacement. Žádná nová API
volání.

**Hlavní claimy v pořádku:** Authority 85,2 % a Brand familiarity 79,8 %
(samotný signál, Fáze 1) přežily i mnohem přísnější klastrovaný test —
95% CI zůstávají daleko od 50% šumu, i při 80–160 nezávislých klastrech
místo 800–1600 jednotlivých callů.

**Oprava nutná:** věta výše ("malý ~1,5bodový efekt v obou kolech přece
jen přežil") **neplatí**. Cluster-permutation přepočet na 80 klastrech na
kolo dává p=0,548 (kolo 1) a p=0,605 (kolo 2) pro Authority na
znevýhodněné straně — statisticky nerozeznatelné od šumu, přestože směr
je v obou kolech kladný. Brand Familiarity svůj vlastní (menší) zbytkový
efekt už správně označila jako neprůkazný ("H2 not confirmed") — Authority
Signal stránka ho naopak prezentuje jako potvrzený. Kontrast mezi
studiemi tedy neplatí tak, jak je teď publikovaný na
`authority-signal.html` / `brand-familiarity.html` / bonus sekci
`how-ai-decides.html`: obě studie ve skutečnosti ukazují totéž — silný
samotný signál, žádný prokázaný zbytkový vliv proti ratingu.

Status: audit hotový. Daniel zvolil zdarma variantu — kopie opravena
2026-09-15 na `authority-signal.html` (meta description, OG, JSON-LD,
hero stat label, oba shrnující bias-cards, tabulkové flagy, supporting
evidence flip card), `brand-familiarity.html` (srovnávací pasáž a
"Where this comes from" úvod), `how-ai-decides.html` (bonus sekce) a
`llms.txt` (oba entries, Authority i Brand familiarity). Nová formulace:
oba residuální efekty (Authority +1,5pp, Familiarity +0,2/+0,4pp) jsou
popsané jako malé, směrově konzistentní, ale statisticky neprůkazné —
žádný z nich není prezentovaný jako "real, confirmed" efekt. Doměřování
na víc intentů zůstává volitelné, nevyžádané.

## Source stability — Study #354, design hotový, čeká na schválení (2026-09-15)

Plné znění: `research-prep/source-stability/STUDY-DESIGN.md`. Zatímco se
čeká na Cassiovu odpověď (services vertikála, task #405), Daniel zvolil
tenhle kandidát ze zbylých dvou neblokovaných (druhý byl structured markup
vs plain prose, #358).

Otázka: mění se citovaný zdroj (doména z reálné web search citace) spolu
s vítězem napříč opakováními stejného dotazu, nebo je vítěz stabilní/
nestabilní nezávisle na tom, jaký zdroj search zrovna najde? Navazuje na
Live Retrieval (#28, jak spolehlivě search vůbec funguje) a na Two Months
Later / Recommendation Lock-in (stabilita doporučení v čase).

Klíčová designová rozhodnutí, promítnutá přímo z předchozích lekcí:
recency-cued fráze ve všech promptech ("right now in 2026"), protože
Live Retrieval's `diagnose_search.py` ukázal, že jinak se search
nespolehlivě zapíná; otevřené doporučovací prompty na reálné konkurenční
kategorie (ne nucený výběr mezi dvěma jmény, ne syntetické značky ze
zbytku série, protože živý search potřebuje reálný obsah k nalezení);
a cluster-permutation test na úrovni intentu jako PRIMÁRNÍ evidence od
první verze `analyze_results.py`, ne až jako dodatečná oprava — přímé
poučení z dnešního auditu #406.

Otevřené body, na kterých design čeká na Daniela: (1) potvrdit/upravit
navržený seznam kategorií (sluchátka, robotický vysavač, meal kit,
mechanická klávesnice — všechny zvolené jako "víc než jeden věrohodný
vítěz", ne monopolní trh), (2) souhlas s tím, že se nejdřív pustí malý
pilotní běh (20-30 volání) ověřující invocation rate nové fráze, než se
commitne plný design na 320-400 volání.

Status: Daniel odsouhlasil navržené 4 kategorie beze změny a potvrdil
pilot nejdřív. `pilot_search.py` proběhl reálně 2026-09-15: **20/20 (100 %)
invocation rate** napříč všemi 4 pilotovanými kategoriemi — recency-cued
fráze funguje spolehlivě. Vedlejší zjištění z pilota: citovaná sada domén
je u některých kategorií (headphones) prakticky identická napříč
opakováními, u jiných (meal_kit) se reálně mění — dobrý signál, že bude
co měřit, ne strop ani podlaha předem.

Rozšířeno na 8 kategorií (přidány electric_toothbrush, air_fryer,
gaming_mouse, bluetooth_speaker). Napsané a dry-run ověřené: `run_study.py`
(search + judge na vytažení top_brand z volného textu přes LLM, protože
zde na rozdíl od zbytku série není vítěz daný nuceným výběrem ze dvou
jmen) a `analyze_results.py`. Klíčové poučení z auditu #406 zabudované
od první verze: primární evidence je cluster-permutation test na úrovni
kategorie (8 nezávislých klastrů), ne nezklastrovaný test na jednotlivé
páry volání — žádná dodatečná oprava, rovnou správně.

Metrika: pro každou kategorii, u párů opakování s vysokým překryvem
citovaných domén (Jaccard &ge; 0,5) vs nízkým, rozdíl v P(stejná top
značka). Kladný a průkazný rozdíl = zdroj řídí výsledek (H1). Rozdíl
blízko nule = vítěz je na zdroji do značné míry nezávislý (H2).

Čeká se na Danielův reálný běh, 2 nezávislá kola (80 volání na kolo,
160 celkem na search krok, plus judge volání navíc).

Status: Daniel spustil reálně obě kola 2026-09-15 (search + judge,
80 volání/kolo, 0 low-confidence judge extrakcí v obou kolech). Primární
evidence (cluster-permutation, jednotka = kategorie): kolo 1 n=6
kategorií, průměrný diff +10,8pp, 95% CI [0,0; +24,0]pp, p=0,501; kolo 2
n=6, průměrný diff +5,0pp, CI [0,0; +15,0]pp, p=1,000; kombinovaně n=12,
průměrný diff +7,9pp, CI [0,0; +16,5]pp, p=0,248. Žádný z testů není
průkazný na obvyklé hladině — **podporuje H2** (vítěz je do značné míry
nezávislý na tom, jaký zdroj search zrovna najde), ne H1.

Deskriptivně silnější podpora H2: v 5 z 6 kategorií v obou kolech je
winner_stability 80-100 % (model dokola vybírá stejnou značku), zatímco
source_stability (identická sada domén napříč páry) je mnohem nižší
(2-49 %) — vítěz je stabilní, i když se citovaný zdroj mění opakování od
opakování. Jediná výjimka je meal_kit: nízká winner_stability (40 %/60 %)
a jediná kategorie s reálně kladným diffem v obou kolech nezávisle
(+39,3pp / +30,0pp) — zajímavý signál, ale je to 1 z 6 klastrů, primární
test ho správně nepřeceňuje.

Limitace k řešení před stavbou stránky: gaming_mouse vypadl z analýzy
(`not enough usable/varied data`) v OBOU kolech nezávisle, robot_vacuum a
headphones vypadly po jednom kole — efektivní n je tedy 6, ne 8, na kolo.
Potřeba diagnostikovat, jestli je to gaming_mouse specifická vlastnost
(např. search vždy vrátí buď identickou, nebo vždy zcela odlišnou sadu
domén, takže není co srovnávat), než se to napíše do limitací stránky.

Další krok: čeká na Danielovo rozhodnutí, jestli nejdřív prošetřit
gaming_mouse anomálii, nebo rovnou stavět research page s H2 jako hlavním
zjištěním a meal_kit jako open question.

Gaming_mouse anomálie vyšetřena přímo na reálných judged datech (Daniel
vložil `judged_r1.json`/`judged_r2.json` řádky pro tuhle kategorii):
párový Jaccard mezi všemi 45 dvojicemi opakování byl v obou kolech ≥ 0,5,
takže "low overlap" koš byl v obou kolech prázdný a `analyze_results.py`
korektně vrátil `None` podle už navrženého defenzivního chování
(`if not high or not low: return None`). Není to bug — je to nejextrémnější
reálný datový bod pro H2 v celém datasetu (vítěz i zdroj drží skoro
dokonale, výběr domén se prakticky vůbec nemění mezi opakováními).
S tímhle vysvětlením se přešlo rovnou ke stavbě stránky.

**Status: postaveno a nasazeno (2026-09-15).** `research/source-stability.html`
(Study #36 ve veřejném číslování) hotová a zapojená sitewide: `vercel.json`,
`sitemap-pages.xml`, `llms.txt`, karta na `research/mechanism-studies.html`,
záznam v rotujícím okně i flip-card kartě na `research/index.html`, sitewide
bump "35 → 36 Public Studies" (157 souborů) a footer `.ai-sitemap` odkaz
přidaný na 156 stránkách. Hlavní zjištění na stránce: winner stability ~90 %
napříč 8 kategoriemi, zatímco source stability (identická sada citovaných
domén) je mnohem nižší a proměnlivější; kombinovaný cluster-permutation diff
+7,9pp, CI [0,0; +16,5]pp, p=0,248 — prezentováno čestně jako neprůkazné
(podporuje H2). meal_kit vyzdvižen jako jediná výjimka a jediný skutečně
otevřený bod. gaming_mouse vysvětlení (extrémní stabilita, ne bug) je součástí
stránky. Otevřeno: rozhodnutí o `robots.txt` `Disallow: /report` pravidle,
které pravděpodobně blokuje i `/reports` (a tedy všech 10+ report stránek)
zůstává na Danielovi, netýká se téhle study.

## Nový nápad: Hierarchie sekundárních signálů + kategorie jako moderátor authority/familiarity (2026-09-16)

Podnět: LinkedIn diskuze pod "5 e-commerce founders" postem. Mansoor Ali se
zeptal, jestli third-party authority a relevance fungují konzistentně, když
AI vybírá mezi podobnými značkami, a v odpovědi navrhl hypotézu, že skutečná
výzva možná není jeden silný signál, ale konzistentní mix signálů, co se
navzájem posilují. Taky se ptal, jak se to liší napříč odvětvími.

Odpověď z existujících dat (Winner vs Loser) hypotézu o "mixu" spíš
nepodpořila — tři signály naskládané najednou (rating, specificita, formát)
se neposilovaly rovnoměrně, rating rozhodl 90,8 % bez ohledu na zbytek. Ale
to je jen hierarchie proti ratingu, nikdy jsme netestovali sekundární
signály (specificita, formát, authority, familiarity) proti sobě navzájem
bez ratingu v místnosti.

**Návrh A: Hierarchie mezi sekundárními signály, bez ratingu.** Máme čtyři
signály, co všechny prohrávají proti ratingu podobným způsobem
(authority 85,2 % → 1,5pp, familiarity 79,8 % → 0,2pp, specificita menší
ale replikovaný efekt). Nikdy netestované proti sobě navzájem. Otázka: když
rating chybí nebo je vyrovnaný, vyhrává authority nad specificitou?
Familiarity nad authority? Existuje jedna univerzální hierarchie signálů,
nebo se to mezi páry signálů liší nepředvídatelně (což by podpořilo
Mansoorovu intuici o "mixu" líp, než odpověď, co jsme mu dali)?

**Návrh B: Moderuje kategorie i authority a familiarity, ne jen
specificitu?** PDP Specificity je jediná studie, co testovala, jestli se
efekt signálu obrací podle typu kategorie (funkční vs. důvěra-založená) —
+15,7pp funkční, -4,5pp důvěra-založená, obrácené znaménko. Nikdy
neověřeno, jestli totéž platí pro authority nebo familiarity, co by
intuitivně mohly být v kategoriích jako zdraví/bezpečnost ještě silnější
než ve funkčních.

Obě dvě jde spojit do jednoho designu, levné, recyklují stejné značky a
metodiku (forced two-way choice, LLM judge) ze Winner vs Loser/Authority
Signal/Brand Familiarity/PDP Specificity kohorty. Status: nápad zapsaný,
design zatím nenavržený, čeká na Danielovo rozhodnutí o prioritě vůči
zbylé frontě (cross-model, cross-platform, Founder Lab, SEO Ranking
Factors).

## Signal Hierarchy — Study #37, postaveno a nasazeno (2026-09-17)

Synthesis studie: authority, familiarity, specificita a formát testované
proti sobě navzájem a v kombinaci, rating úplně vyřazený z porovnání. 12 z
16 možných kombinací signálů (baseline, všech 6 párů, všechny 4 triple bez
jednoho signálu, plný stack), 4 značky, 20 purchase intentů, 5 opakování,
2 nezávislá kola (9 600 volání celkem). Specificita nejsilnější samostatný
marginální přispěvatel k plnému stacku (+3,25pp kombinovaně), authority a
familiarity těsně za ní a mění pořadí podle toho, jestli se díváš na
samostatný main effect nebo marginální přínos k plnému stacku. Formátův
vlastní marginální přínos se zaokrouhlí na nulu v obou kolech zvlášť
(-0,2pp pak 0,0pp). Dva signály dohromady už dosahují 96-100% winner rate
ve většině párů, přidání třetího nebo čtvrtého přidává jen pár bodů navíc
(saturace, ne sčítání).

Zapojeno sitewide: `vercel.json`, `sitemap-pages.xml`, `llms.txt`, karta na
`research/mechanism-studies.html`, záznam v rotujícím okně i flip-card
kartě na `research/index.html`, sitewide bump "36 → 37 Public Studies" a
footer `.ai-sitemap` odkaz přidaný napříč weby. Continued-in dodatek
přidán na `winner-vs-loser.html`.

## Structured Markup vs Plain Prose — Study #38 (task #358), postaveno a nasazeno (2026-09-17)

Třetí a nejpřímější test formátového signálu v sérii, tentokrát na jiném
výstupu: ne kdo vyhraje nucené srovnání, ale kolik z injektovaných faktů se
model rozhodne citovat a kolik konkrétní slovní zásoby použije, když je
otázka otevřená a jednoznačková (single-brand, žádné forced two-way
choice). Recykluje injection mechaniku z Fact Injection / Hidden Context
(system-message "Additional context retrieved for this query: {brand}").
Jeden binární faktor: stejná 3 fakta na značku (specific_claim,
authority_fact, familiarity_fact — plný stack obsah z Signal Hierarchy AFSM
podmínky) buď jako plynulý odstavec, nebo jako odrážkový seznam. Dvě
outcome metriky: citation rate (LLM judge, gpt-4o teplota=0, 3 judge
volání na odpověď) a vocabulary lift (deterministický substring match proti
5 předregistrovaným charakteristickým výrazům na značku).

4 značky, 2 podmínky, 20 purchase intentů, 5 opakování, 2 nezávislá kola
(1 600 volání, 4 800 judge volání celkem). Primární statistika: párový
t-test na cluster-level průměrech (80 clusterů = 4 značky x 20 intentů,
každý zprůměrovaný přes 5 opakování).

**Výsledek: obrácený efekt vůči H1, replikovaný nezávisle v obou kolech.**

Structured format necituje víc faktů ani nepoužívá víc specifické slovní
zásoby než prose — cituje míň a používá míň. Kolo 1: citation rate prose
65,3 % vs. structured 59,5 % (-5,83pp, p=0,0003), vocabulary lift prose
67,7 % vs. structured 64,5 % (-3,25pp, p=0,0044). Kolo 2 nezávisle: citation
rate prose 63,8 % vs. structured 59,2 % (-4,67pp, p=0,0011), vocabulary
lift prose 68,9 % vs. structured 64,4 % (-4,50pp, p<0,0001). Obě metriky,
oba směry, oba p-hodnoty drží v obou kolech zvlášť — podle no-file-drawer
pravidla série jde o potvrzený nález, ne round-1 náhodu. Word count prose
vs. structured skoro identický (145,1 vs. 141,3 kombinovaně), structured
byl pokud vůbec, tak kratší — vylučuje "delší odpověď cituje víc" confound
v opačném směru. Brand mention rate obě podmínky u stropu (99,8-100 %),
takže rozdíl v citaci není jen tím, že by structured odpovědi méně často
jmenovaly značku vůbec.

Třetí null/obrácený nález pro formátový signál v řadě (po Winner vs Loser
a Signal Hierarchy), první, co měří citation fidelity a vocabulary reuse
místo výběru vítěze. Přímo protiřečí běžné GEO radě "strukturuj obsah do
odrážek, aby ho AI citovala".

**Status: postaveno a nasazeno jako samostatná stránka (2026-09-17)** dle
Danielova rozhodnutí ("samostatna stranka"). `research/structured-markup.html`
zapojeno sitewide: `vercel.json`, `sitemap-pages.xml`, `llms.txt`, karta na
`research/mechanism-studies.html`, karta i flip-card na `research/index.html`,
sitewide bump "37 → 38 Public Studies" (159 souborů) a footer `.ai-sitemap`
odkaz přidaný na 158 stránkách. Continued-in dodatky přidány na
`winner-vs-loser.html` a `signal-hierarchy.html`. DOI zatím chybí, čeká na
Daniela až ho vytvoří na Zenodo.

## Category as moderator of authority/familiarity — hotovo, obě kola reálně proběhla (2026-09-18)

"Návrh B" z 16.9. nápadu (Hierarchie sekundárních signálů + kategorie jako
moderátor), druhá půlka po Signal Hierarchy (Návrh A, Study #37). PDP
Specificity je jediná studie v sérii, co testovala, jestli se efekt signálu
obrací podle kategorie (+15,7pp funkční, -4,5pp důvěra-založená, χ²=39,26,
p<0,0001). Authority a Familiarity byly obě měřené na stejných 4 značkách
(2 funkční, 2 důvěra), ale žádná z nich nikdy nerozdělila svůj vlastní
výsledek podle kategorie, obě reportovaly jen jedno pooled číslo.

Design: 8 značek (4 funkční — Barbaro Mojo, Hearthloom, Bellroy, Zigpoll;
4 důvěra — Colored Organics, BodyArtForms, Wild One, Primally Pure), žádný
rating v místnosti (rating by obojí přehlušil stejně jako ve Winner vs
Loser). Na značku 4 podmínky: signal_type (authority/familiarity) x
signal_level (target_has/competitor_has). Původní 4 značky recyklují
byte-identické authority_fact/familiarity_fact ze Studie #34/#35. Nové 4
(Bellroy, Zigpoll, Wild One, Primally Pure, recyklované z PDP Specificity
kola 3) dostaly nově napsané plain_claim páry (word-count matched, 12/12,
12/12, 13/13, 12/12) a nové authority_fact/familiarity_fact věty ve stejném
rozsahu délky jako originál (13-17 slov).

8 značek x 4 podmínky x 20 intentů x 5 opakování = 3 200 volání na kolo,
6 400 celkem přes 2 nezávislá kola. Primární statistika: dva LR testy
(interakce kategorie x signal_level), jeden pro authority, jeden pro
familiarity, samostatně. Hypotézy explicitně obousměrné: buď moderace jde
stejným směrem jako specificita (funkční > důvěra), nebo opačným směrem
(sociální důkaz váží víc, když je v sázce bezpečnost — důvěra > funkční),
nebo žádná interakce (specificitin nález by pak byl specifický pro
konkrétnost, ne obecná vlastnost důvěra-kategorií).

`run_study.py` + `run_study_v2.py` spuštěny naostro Danielem (vlastní
OPENAI_API_KEY), 2026-09-18. 0/6400 judge parse failures kombinovaně přes
obě kola.

**Výsledek: efekt jde OPAČNÝM směrem než specificita, replikovaný nezávisle
v obou kolech.**

Authority: overall follows-the-signal rate kolo 1 = 69,9 %, kolo 2 = 69,4 %.
Funkční: kolo 1 = 65,4 %, kolo 2 = 64,9 %. Důvěra: kolo 1 = 74,5 %, kolo 2 =
74,0 %. Category x signal_level LR test: kolo 1 LR=461,93 p=8,49e-100, kolo
2 LR=433,11 p=1,49e-93.

Familiarity: overall kolo 1 = 67,2 %, kolo 2 = 66,9 %. Funkční: kolo 1 =
60,0 %, kolo 2 = 60,4 %. Důvěra: kolo 1 = 74,4 %, kolo 2 = 73,5 %. LR test:
kolo 1 LR=381,87 p=1,87e-82, kolo 2 LR=380,2 p=4,30e-82.

Oba signály, oba směry, obě p-hodnoty drží v obou kolech zvlášť, podle
no-file-drawer pravidla série jde o potvrzený nález. Směr je opačný než u
PDP Specificity (+15,7pp funkční, -4,5pp důvěra): tam specificita pomáhala
funkčním kategoriím a škodila důvěra-kategoriím, tady autorita i
familiarity signál pomáhají VÍC důvěra-kategoriím než funkčním (H2 z
designu, "sociální důkaz váží víc, když je v sázce bezpečnost", potvrzeno
H1 zamítnuto). Position bias check (target named first vs. second):
69,2 % vs. 67,5 %, malý rozdíl, nic co by zpochybnilo hlavní nález. 14
buněk (ze 64) flagováno jako ceiling/floor v obou kolech, konzistentně
stejné buňky, očekávané u menších podmínek.

**Status: postaveno a nasazeno jako samostatná stránka (2026-09-18)** dle
Danielova rozhodnutí ("dal bych to jako samostatnou stranku"). Publikovaná
jako Study #39, `research/category-fit.html`. Zapojeno sitewide:
`vercel.json`, `sitemap-pages.xml`, `llms.txt`, karta na
`research/mechanism-studies.html`, karta i rotující finding-card na
`research/index.html`, sitewide bump "38 → 39 Public Studies" (160
souborů) a footer `.ai-sitemap` odkaz přidaný napříč weby. Continued-in
dodatky přidány na `pdp-specificity.html`, `authority-signal.html` a
`brand-familiarity.html`. DOI: 10.5281/zenodo.22832667 (přidáno
2026-09-18, `.doi-citation` blok v hero + `identifier` pole na Article
i Dataset v JSON-LD).

## Winner stability across varied intents (not just identical repeat) — Study #40 (2026-09-18)

Vzniklo z výměny na LinkedIn pod postem Vurala Cifciho: Daniel citoval Source
Stability (research/source-stability.html) jako důkaz, že vítěz zůstává
stabilní (~90 %) i když se citovaný zdroj mění (2,2-80 %). Vural namítl
datem od SparkToro (pod 1 % šance na stejný seznam dvakrát) a argumentoval,
že stabilita hlavně drží tam, kde je incumbent už zavedený.

Mezera: Source Stability studie testovala pouze opakování IDENTICKÉ otázky
(stejný prompt, 10x, per kategorie). Netestovala, jestli vítěz zůstává
stabilní i napříč RŮZNĚ formulovanými dotazy se stejným záměrem ve stejné
kategorii. To je jiný typ variance (cross-intent, ne test-retest).

Design: stejných 8 kategorií jako Source Stability, 3 formulace se stejným
záměrem na kategorii (what's the best / which X should I buy / can you
recommend), 5 opakování na formulaci, 2 nezávislá kola (240 search volání,
240 judge volání). Primární test: P(stejný vítěz | stejná formulace) vs.
P(stejný vítěz | jiná formulace), cluster-permutation test na úrovni
kategorie.

**Reálné výsledky (obě kola, Daniel spustil vlastním OPENAI_API_KEY):**
Kolo 1: mean diff +2.2pp, 95% CI [0.0, +6.2]pp, p=0.499 (neprůkazné).
Kolo 2: mean diff +4.0pp, 95% CI [0.0, +9.3]pp, p=0.245 (neprůkazné).
Kombinovaně (16 category-clusterů): +3.1pp, 95% CI [+0.4, +6.4]pp, p=0.063
(na hraně, ale ne pod 0.05). Podle no-file-drawer pravidla (finding musí
držet v obou kolech zvlášť) toto NENÍ průkazný efekt formulace, což
potvrzuje Danielovo tvrzení silněji, ne Vuralovu námitku: přeformulování
otázky vítěze spolehlivě nerozhodilo.

5 z 8 kategorií mělo rozdíl na nule nebo blízko ní v obou kolech nezávisle
(robot_vacuum, air_fryer, gaming_mouse, bluetooth_speaker, headphones).
Sekundárně: incumbent kategorie (winner stability >= 90 %, tato studie
vlastní pooled čísla) měly průměrný rozdíl +0.1pp, open kategorie (meal_kit,
mechanical_keyboard, electric_toothbrush) +8.0pp, ale žádná ze 3 open
kategorií tento rozdíl nedržela konzistentně mezi koly (meal_kit 0.0→20.0pp,
mechanical_keyboard 0.0→9.3pp, electric_toothbrush 16.2→2.7pp opačným
směrem) — orientační pozorování, ne potvrzený nález.

**Status: postaveno a nasazeno jako samostatná stránka
(research/winner-stability-intents.html, Study #40), propojená s
source-stability.html obousměrně ("continued in" dodatek tam, "direct
follow-up" v hero na nové stránce). Sitewide wiring hotové (vercel.json,
sitemap, llms.txt, mechanism-studies.html, research/index.html rotující
okno i reports grid, footer ai-sitemap všude, Public Studies 39→40).
Vural dostal krátkou zprávu s výsledky. DOI: 10.5281/zenodo.22833586
(přidáno 2026-09-18, `.doi-citation` blok v hero + `identifier` pole na
Article i Dataset v JSON-LD).**

## Dva kandidáti na Study #41+ z výměny s Albertem Barberisem (2026-09-19)

Vzniklo z LinkedIn diskuze pod Albertovým (CEO AndromedAI) postem o AI
traffic napříč retail sektory. Daniel okomentoval, že "structured" může
znamenat dvě různé věci, které netáhnou stejným směrem: schema.org JSON-LD
(neviditelná metadata) prý pomáhá citaci, ale Structured Markup studie
(Study #38) ukázala, že viditelné bullety místo prózy citaci naopak
snižují, se stejnými fakty. Alberto odpověděl vyhýbavě ("depends on
several factors"), přidal ale dva konkrétní body, které jdou přímo
testovat a zatím je nemáme:

1. Strukturování produktových dat pomáhá, "not necessarily through
   JSON-LD, clear on-page attributes matter too."
2. Kromě "attribute coverage" je potřeba i "intent coverage": co produkt
   je, pro koho je, správná klíčová slova, což AI prý sama vždy neodvodí.

**Kandidát A — Neviditelná JSON-LD data vs. viditelné bullety vs. próza
(tříramenný test).** Structured Markup (Study #38) srovnávala jen
viditelné bullety vs. prózu na stránce, nikdy netestovala skutečná
schema.org JSON-LD data samostatně. Design: stejné fakty, tři varianty
na stránku — (a) čistá próza bez markupu, (b) próza + JSON-LD structured
data v pozadí (Product/Offer schema), (c) viditelné bullety bez JSON-LD.
Měří citation fidelity a vocabulary reuse stejnou metodikou jako Study
#38. Přímo testuje Albertovo tvrzení "invisible metadata helps citation",
které jsme sami nikdy neizolovali od formátu viditelného textu.

**Kandidát B — Intent coverage jako samostatná proměnná.** PDP
Specificity (Study #32) testovala vague vs. concrete specs, ne
persona/use-case framing. Design: stejný produkt, stejné specs, jen
přidat/odebrat explicitní větu typu "built for X, used for Y" (kdo je
cílovka, k čemu produkt slouží), nezávisle na specifičnosti faktů.
Testuje přímo Albertovo tvrzení, že AI si "pro koho a k čemu" sama vždy
neodvodí.

Oba by šly navázat na tuhle LinkedIn výměnu jako hook ("po diskuzi jsme
to otestovali"). Status: uloženo jako kandidáti na Study #41/#42, zatím
nezařazeno do číslovaného pořadí, design (kategorie, počet volání,
statistika) čeká na rozpracování, až Daniel řekne který jde první.

## 19 kandidátů na doplnění pěti slabých sekcí decision path (2026-09-19)

Podnět: vizuální timeline všech 36 studií podle data a fáze (viz widget
"atom_foundry_studies_timeline") ukázala, že poslední měsíc jde skoro
všechen výzkum do Evaluation (9 studií) a Recommendation & Stability
(7), zatímco pět dalších fází zůstává tenkých: Confidence (1), Retrieval
(2), Understanding (2), Memory (4), Candidacy (5). Daniel: "udelame
vsechny" — všech 19 kandidátů níže jde do fronty, číslování a pořadí se
doplní, až se začnou postupně stavět.

Metoda: pro každou sekci přečteny reálné meta description a section-body
texty všech existujících studií v ní (ne jen mini-card popisky), aby
návrhy skutečně navazovaly na to, co už změřeno, a neduplikovaly to.

### Confidence (dnes 1 studie: Recommendation Confidence, #22)

Recommendation Confidence zjistila, že hedge jazyk v odpovědi (slova typu
"seems"/"may be" vs. "clearly") vůbec neodpovídá reálné vnitřní jistotě
modelu (token logprobs), r=0,03, potvrzeno 7 nezávislými metodami, 3
poskytovateli (GPT-4o, Claude Sonnet, Gemini), 5 frázováními. Ale úplně
celý design stojí na jednom scénáři: rating rozhoduje spor mezi dvěma
blízkými brandy (recyklováno z Candidate Evaluation fáze 3). Price a
specs signály se nikdy netestovaly.

1. **Zopakovat pro price a specs signály.** Přímo přiznané omezení
   studie samotné ("Methods 5 through 7 do not repeat this design for
   the price or specs signal types"). Nejlevnější, nejcitelnější
   rozšíření.
2. **Predikuje logprob-jistota stabilitu doporučení?** Propojit s Winner
   Stability Intents (#40) a Source Stability (#36) — drží vysoko-jistá
   doporučení líp přes přeformulování/opakování než nízko-jistá? Data z
   části existují, jde hlavně o novou analýzu, ne nutně nový sběr.
3. **Genuinní remíza, ne rating-rozhodnutý spor.** Všech 7 metod testovalo
   scénář, kde JE jasný rozhodující signál (rating). Netestováno: co dělá
   hedge jazyk / logprob gap, když opravdu není co rozhodnout.
4. **Hedguje model víc v důvěra-kategoriích?** Přímá vazba na Category
   Fit (#39) — authority/familiarity už tam mají opačný efekt podle
   kategorie, konfidence-jazyk se dosud nekontroloval stejně.

### Retrieval (dnes 2 studie: Web Search Rewrites 77%, #1; Live Retrieval, #28)

Web Search Rewrites zjistilo, že vynucené search on/off mění 77 %
doporučení (50 nákupních promptů, jeden model). Live Retrieval dalo
stejnému modelu reálný search nástroj k volnému použití na stejný styl
otevřených nákupních otázek — model ho nepoužil ani jednou z 960 volání.
Diagnostika potvrdila, že nástroj funguje, jen ne pro tenhle styl
promptu. Napětí mezi oběma studiemi (search evidentně věc mění, ale
model si o něj sám neřekne) zůstává nevysvětlené.

1. **Jaký prompt styl model donutí sáhnout po search sám.** Live
   Retrieval skončila na nule pro otevřené nákupní otázky. Netestováno:
   explicitní signály čerstvosti ("nejnovější X v 2026"), přímé srovnání
   cen, nebo formulace nutící ověření faktu.
2. **Vynucený search a Accuracy+Depth pokrytí.** Accuracy+Depth měřilo
   61,1% CDI pokrytí bez search vůbec. Zapnutí search by mohlo tuhle
   mezeru zavřít, přímý most Retrieval → Understanding.
3. **Cross-platform retrieval (Perplexity/Claude vs. GPT).** Dlouho
   zaparkovaný kandidát, blokovaný na Anthropic/Google/Perplexity
   klíčích, restatováno jako priorita v týhle sekci.
4. **Koreluje dobrovolné použití search s tím, že se doporučení
   skutečně změní**, stejně jako to dělá vynucené on/off? I vzácné
   případy dobrovolného volání (pokud existují napříč kategoriemi) by šly
   post-hoc srovnat.

### Understanding (dnes 2 studie: Search Changes the Vocabulary, #5; Accuracy + Depth, #27)

Search Changes the Vocabulary: se zapnutým search model jmenuje
ingredience a specifikace, s vypnutým jen dojmy, na stejných 50
promptech jako Study #1. Accuracy + Depth: model je téměř nikdy věcně
špatně (33/34 tvrzení potvrzeno, 97,1 %), ale nevyžádaně pokryje jen
61,1 % reálných atributů napříč 8 kategoriemi, nerovnoměrně — udržitelnost
zmíní 8 z 9 brandů, záruku/certifikaci jen 3 z 9, i když existují a jsou
ověřitelné.

1. **Fact-injection styl přímo na podpokryté CDI kategorie.** Vzít
   záruku/certifikaci konkrétních brandů, vložit je do kontextu stejně
   jako Fact Injection (#25), sledovat, jestli je model pak skutečně
   použije nevyžádaně.
2. **Predikuje hloubka popisu (CDI), kdo vyhraje doporučení?**
   Accuracy+Depth měřilo kvalitu popisu, ne jestli souvisí s výsledkem.
   Reuse existující kohorty, žádná nová fakta.
3. **"Search mění slovník" rozdělené na funkční vs. důvěra-kategorie.**
   Přímá vazba na Category Fit (#39), replikace původních 50 promptů s
   kategorie-split analýzou.
4. **Konkrétnost slovníku vs. token-logprob jistota.** Hedge slova v
   Confidence studii selhala jako signál skutečné jistoty (r=0,03).
   Možná je konkrétnost slovníku (ingredience/specs vs. dojmy) lepší
   proxy, netestováno.

### Memory (dnes 4 studie: The Fame Study, #2; Memory Source, #21; Possession vs Deployment, #23; Fact Injection, #25)

Veřejná sláva/stopa (Wikipedia, Wikidata, stáří domény, GDELT) vysvětlí
dohromady jen 11,2 % frekvence doporučení, žádný signál samostatně
významný. Vlastní minulé chování modelu vysvětlí 61,4 % (The Model
Predicts Itself) — co přesně ten rozdíl tvoří, zůstává největší
nevyřešenou otázkou celé série. Possession vs Deployment: 75,8 % faktů,
co model tvrdí že o brandu zná, se nikdy nepoužije v reálném
doporučení. Fact Injection: vložení JEDNOHO ověřeného faktu dá průměrně
+77,9pp.

1. **Cross-model paměť.** Pořád nejvyšší priorita v týhle sekci, čeká na
   Anthropic/Google API klíč od Daniela, levné znovupoužití stejného
   closed-book baseline.
2. **Dose-response fact injection: 0/1/3/6 faktů.** Fact Injection
   testovala jen jeden vložený fakt. Křivka s víc fakty najednou by
   ukázala, jestli se possession-deployment mezera zavírá lineárně, nebo
   má práh/diminishing returns.
3. **Possession rate podle stáří/zavedenosti značky.** Zná model novější
   značky hůř (possession), nebo je jen nenasazuje (deployment)? Rozlišuje
   dvě různé příčiny téhož symptomu, vazba na Cold Start (#20).
4. **Pořadí/salience uvnitř 6 possessed faktů.** Používá se spíš první
   fakt, co model vybaví, než šestý? Testovalo by mechanismus uvnitř
   samotné paměťové reprezentace, ne jen její obsah.

### Candidacy (dnes 5 studií: Candidacy vs Selection, #6; Cold Start, #20; Hidden Context, #26; Brand Legibility, #29; Prompt Shape, #30)

Jeden faktor z AI Commerce Score odlišuje 599 kdy-doporučených obchodů
od 60 325 nikdy-nedoporučených, přežije kontrolu na kategorii, cirkularitu
i vlastnictví obchodu, ale ten samý faktor uvnitř skupiny už nic
nepredikuje (dostat se do hry vs. vyhrát ji řídí různé věci). Cold Start:
značka bez historie prohraje 0 z 360 běhů bez důkazu, recenze otevřou
dveře na 53,1 %, PR a objem prodejů skoro nic. Hidden Context: fiktivní
"viděl jsi reklamu na X" tvrzení hýbe vítězem víc než cokoliv jiného
testovaného, včetně reálného produktového faktu. Brand Legibility: jasnost
framingu identity brandu skoro vůbec nehraje roli, jakmile jsou fakta v
kontextu, 12 z 13 brandů (včetně vymyšleného) narazí na stejný strop bez
ohledu na framing. Prompt Shape: jak kupující formuluje otázku, mění
výsledek, bare-keyword prohrává s přirozeným jazykem konzistentně ve
dvou nezávislých kolech.

1. **Founder Lab: kauzálně změnit "ten jeden faktor" z Candidacy vs
   Selection.** Posun z korelace na kauzalitu na reálném kontrolovaném
   obchodě, přímo navazuje na dávno zaparkovaný RCT plán (kandidát C ze
   sekce "Další kandidáti na výzkum" výše).
2. **Hidden Context rozšíření: fiktivní "viděl reklamu" na OBOU stranách
   srovnání najednou.** Vyhraje živější/novější fikce, nebo se efekty
   vyruší? Nejpřekvapivější nález série, dosud testovaný jen
   jednostranně.
3. **Cold Start dose-response: kolik recenzí stačí.** 1 vs. 10 vs. 100
   recenzí pro značku bez historie, hledá práh, ne jen binární
   ano/ne z původní studie.
4. **Brand Legibility odveta: framing dvou legible brandů proti sobě.**
   Původní test měl konkurenty bez vlastních faktů. Co když má framing
   soupeř stejně čitelná fakta, vrátí se efekt při skutečné konkurenci?

Status: všech 19 kandidátů schváleno k realizaci ("udelame vsechny",
Daniel 2026-09-19). Číslování (Study #41 a dál) a pořadí realizace se
přiřadí postupně, jak se budou stavět, stejným vzorcem jako celá
dosavadní série (STUDY-DESIGN.md → run_study.py → dry-run → Danielovo
reálné spuštění → analyze_results.py → publikace).

## Founder Lab multi-choice faktoriál — verze A (rychlá, simulovaná) a verze B (živá, kauzální) (2026-09-19)

Daniel: "urcite zacneme a, to b tak at je v road mape". Vzniklo z otázky,
jestli umíme simulovat volbu mezi 5 e-shopy (Founder Lab + 4 reální
konkurenti) a postupně měnit faktory u Founder Labu, abychom zjistili,
který nese nejvíc váhy, nebo jestli je to kombinace.

**Verze B (živá, kauzální, zaparkovaná na později):** až verze A ukáže
vítězný faktor/kombinaci, implementovat ho doopravdy na živém
founderlab.com (ne textová injekce, ale skutečná změna stránky), počkat
na reindex, přeměřit reálné chování AI. To je ten dávno plánovaný
"Founder Lab field test" (kandidát C), teď s konkrétním, datově
podloženým prvním krokem místo obecného "zkusíme něco změnit".

**Verze A** — plný design viz konverzace 2026-09-19, shrnutí: Founder
Lab (dnes 0% recommend rate, potvrzeno v reports/founder-lab.html jako
baseline bez historie/recenzí) proti 4 reálným konkurentům v 5-way
multi-choice promptu, místo dosavadních pairwise srovnání. Fáze 0
(baseline replicate v multi-choice), Fáze 1 (rating check, dominuje i
mimo pár?), Fáze 2 (frakční faktoriál zbylých signálů s ratingem
vypnutým, stejná logika jako Signal Hierarchy, ale na Founder Labu
konkrétně a v multi-choice formátu misto pairwise). Status: design
schválen, čeká na rozpracování STUDY-DESIGN.md.

## Founder Lab multi-choice faktoriál — plný design verze A (2026-09-19, doplněno)

Daniel: "zapis to cele prosim do road mapy... jsem zvedavy jak to dopadne
a zda se postupnym pridavani ruznych faktoru do founder lab... zacne ai
doporucovat." Plné znění designu, jak byl odsouhlasený v konverzaci
2026-09-19, aby se k němu dalo vrátit bez nutnosti znovu procházet chat.

### Výchozí bod

Founder Lab je jediný brand v celé sérii, který máme jako živý obchod s
nulovou historií, potvrzeno v reports/founder-lab.html: 0 doporučení z
400 pozorování (20 buyer-intent promptů o minimalistickém vybavení a
dárcích pro zakladatele, 10 klasických a 10 s konkrétním kontextem,
každý poslaný ChatGPT 20krát). Ze stejného reportu už víme, koho model
sahá misto Founder Labu: Everlane a Uniqlo na oblečení (fleece joggers,
streetwear), Yeti na lahve na vodu, Moleskine a Muji na desk a gifting
otázky. Návrh pětice pro multi-choice test: Founder Lab + Everlane +
Uniqlo + Yeti + Moleskine/Muji, protože je to reálná, už jednou změřená
konkurence, ne vymyšlená.

Kategorie Founder Labu je napůl funkční (oblečení, gear) a napůl důvěra
(dárky, gifting), takže dopředu neumíme s jistotou říct, kterým směrem
se u něj projeví specificita popisu (Category Fit ukázal, že specificita
pomáhá ve funkčních kategoriích a škodí v důvěra kategoriích). To je
sám o sobě zajímavý vedlejší výstup studie.

### Proč ne prosté "jeden faktor za druhým" (staircase)

Kdyby se faktory přidávaly čistě postupně a nikdy neodebíraly (kolo 1
rating, kolo 2 rating plus authority, kolo 3 rating plus authority plus
specificita...), nejde rozlišit, jestli zlepšení ve třetím kole patří
specificitě samotné, nebo kombinaci se vším, co už bylo přidané dřív.
Signal Hierarchy (#37) přesně tohle řešil frakčním faktoriálem, tady
navrhuju stejnou logiku, jen škálovanou na skutečnou 5-way volbu místo
párového souboje.

### Fáze 0, baseline v multi-choice formátu

Zopakovat baseline, ale novým způsobem, jedním promptem, kde model vybírá
mezi všemi 5 brandy najednou (dosud jsme dělali jen pairwise nebo otevřený
recall, multi-choice s 5 opcemi najednou je metodicky nové). Cíl: ověřit,
že Founder Lab i v tomto formátu prohrává 0 nebo blízko 0, aby další kola
měla srovnatelný start.

### Fáze 1, kontrola ratingu

Přidat Founder Labu jen rating/recenze, nic jiného, a zjistit, jestli
rating dominuje stejně silně jako v párovém srovnání (Candidate
Evaluation #19 to nikdy netestoval mimo pár). Očekávání: rating
pravděpodobně hodně posune, ale možná ne se stejnou silou jako 1 na 1,
protože teď soutěží proti 4 brandům najednou.

### Fáze 2, faktoriál, jádro studie

Rating se záměrně vypne (stejně jako u Signal Hierarchy), aby nesmázl
ostatní signály, a zkříží se těchto 5 faktorů na Founder Labu: authority
(zmínka třetí stranou), familiarity claim, specificita popisu produktu,
formát (bullety vs. próza), hidden context (fiktivní "uživatel viděl
reklamu na Founder Lab", nejsilnější nález celé série, #26). Plný
faktoriál pro 5 faktorů by byl 32 podmínek, moc drahé. Signal Hierarchy
zvládl 4 faktory na 12 podmínkách (frakční faktoriál), návrh je podobně
redukovaná sada, zhruba 12 až 16 podmínek, prioritizovaná podle toho, co
už víme že má sílu (specificita a hidden context na první místo).

Analýza: logistická regrese na Founder Lab win rate s hlavními efekty i
interakcemi, LR test pro každý faktor zvlášť a pro kombinace, stejná
metoda jako Signal Hierarchy. Výstup: buď jeden jasně nejsilnější faktor,
nebo konkrétní kombinace, která funguje víc než součet jednotlivých
částí.

### Rozsah

Signal Hierarchy měl 9 600 volání na 4 faktory ve 2 kolech. 5-way volba
je dražší na jedno volání než pairwise (víc kontextu, víc tokenů), takže
očekávaný rozpočet je podobný nebo mírně nižší, řádově tisíce volání,
přesné číslo se doladí až po potvrzení počtu podmínek a kol.

### Co je potřeba k rozjezdu

Danielův vlastní API klíč pro reálný běh (stejný postup jako u
předchozích studií), pak STUDY-DESIGN.md a run_study.py analogicky k
dosavadní sérii. Status: design schválen, čeká na Danielův čas
("az budu mit cas tak zacneme"), zatím nezahájeno.

### Verze B, zaparkovaná

Až verze A ukáže vítězný faktor nebo kombinaci, implementovat ho
doopravdy na živém founderlab.com (skutečná změna stránky, ne textová
injekce do promptu), počkat na reindex, přeměřit reálné chování AI.

## Nový kandidát: Brand Staleness / doznívání brandu v paměti modelu (2026-09-19)

Vzniklo z LinkedIn komentáře Tima de Rosena (CEO, AIVO) pod postem Brand
Finance "When Brands Go Dark" (-9% average annual fall in Brand Strength
po tom, co brand přestane být viditelný na trhu). Tim se ptá, jestli síla
brandu nedoznívá jen v hlavách lidí, ale i uvnitř AI modelů, a jestli by
stálo za to otestovat, jestli se stejné zpoždění (consideration a
knowledge přežívají awareness) projevuje i v tom, co modely říkají.

Otázka: když brand v realitě doopravdy zanikne nebo přestane být aktivní
k určitému datu, jak dlouho ho AI modely ještě doporučují, jako by
existoval nebo byl aktivní. Tohle je nová osa, kterou v celé sérii
nemáme, dosud testujeme jen "je brand doporučen teď, s danými signály",
ne jak dlouho zůstává v paměti modelu poté, co v realitě zmizí.

Navržený postup, bez čekání let na přirozený rozpad: využít, že různé
modely mají různá data ořezu (knowledge cutoff), což funguje jako
přirozený časostroj. Najít reálné brandy, co doopravdy zanikly nebo
přestaly být aktivní k přesně známému datu, a stejnou closed-book i
buying otázku pustit napříč modely s různým cutoff. Model s cutoff před
zánikem by měl brand pořád tlačit jako živý, model s cutoff dlouho po
zániku by ho měl přestat doporučovat, pokud model fakt zapomíná mrtvé
značky. Pokud ho i dlouho po zániku pořád silně doporučuje, potvrzuje to
Timovu hypotézu o reziduální hodnotě/zpoždění v modelové paměti.

Metodicky nejblíž Possession vs Deployment (#23) a Memory Source (#21),
jen s časem/cutoff jako novou nezávislou proměnnou, což jsme takhle
nikdy netestovali. Status: schváleno k zapsání ("urcite to zapis do road
mapy", Daniel 2026-09-19), číslování a realizace zatím nepřiřazeny.

## Wave-2 scale-up: deploy_rate vs t4_survival, skripty hotové (2026-09-19)

Navazuje na CDI-vs-výsledek null nález výše. Vybráno 21 nových reálných
brandů (10 funkčních, 11 důvěra-citlivých), design a skripty napsané a
end-to-end ověřené na dry-run (research-prep/wave2-survival-scaleup/).
Plný běh je 3 fáze: baseline (8 400 volání, jen nových 21), possession vs
deployment a multi-turn displacement (obojí na všech 30 brandech, cca
4 350 volání), celkem cca 12 750 volání, víc než Signal Hierarchy (9 600).
Status: čeká na Daniela, vlastní API klíč a čas, "chci to plne... kdyz
neco delame tak poradne" (Daniel 2026-09-19). Přesné příkazy do terminálu
dané Danielovi přímo v chatu.

## Wave-2 scale-up, výsledky (2026-09-20)

Plný běh dokončen (baseline 8 400 volání na 21 nových brandech, plus
possession/deployment a multi-turn/T4 na všech 30, minus Cotopaxi s 0%
baseline, tedy n=29 s oběma metrikami).

**Hlavní hypotéza se nepotvrdila.** deploy_rate vs t4_survival: Pearson
r=-0,028 (p=0,885), Spearman r=+0,129 (p=0,505), prakticky nula. Při n=9 to
vypadalo na r=-0,543, byl to šum, stejný vzorec jako u CDI dřív. Ověřeno i
citlivostním testem (vyhození Nutrafol a Zigpoll jako extrémů), výsledek
zůstává null (r=0,076, p=0,705).

**Vedlejší nález, mnohem silnější, než jsme čekali.** baseline_recommend_pct
vs t4_survival_pct: Pearson r=+0,527 (p=0,0033), Spearman r=+0,557
(p=0,0017), na n=29. Tohle replikuje a posiluje už publikovaný nález na
multi-turn-displacement.html (původně r=0,68, p=0,048 na n=10), teď na
třikrát větším vzorku s mnohem nižší p-hodnotou. Vztah drží ve stejném
směru i po rozdělení na funkční (n=15, r=0,479, p=0,071) a důvěra-citlivé
(n=14, r=0,591, p=0,026) kategorie zvlášť, není to tažené jednou skupinou.
Zapsáno jako Update přímo na multi-turn-displacement.html.

**Zajímavá výjimka, stojí za další pohled.** Několik brandů se od
celkového trendu výrazně odchýlilo oběma směry. Ridge Wallet (85,5%
baseline, jen 10% T4 survival) a Olly (74% baseline, 0% T4 survival) mají
silná čísla na startu, ale v delší konverzaci se rychle ztratí. Naopak
Kopari (0,5% baseline, 50% T4 survival) a Onyx Coffee Lab (16,5% baseline,
50% T4 survival) jsou skoro nikdy organicky nedoporučené, ale jakmile je
někdo výslovně zmíní, drží se docela dobře. Tohle je jiná osa než
Candidacy vs Selection (#6), spíš "dostat se do rozhovoru" vs "udržet se v
rozhovoru", a mohl by z toho být další kandidát na studii, proč Ridge/Olly
ztrácí půdu pod nohama a co dělá Kopari/Onyx odolnější, i když start mají
mnohem slabší.

**Bonus, slabší vztah.** baseline vs deploy_rate: Spearman r=+0,435
(p=0,018, signifikantní), Pearson r=+0,252 (p=0,188, není). Spíš pořadový
vztah než přímo lineární, opačný směr než původní hypotéza o "kompenzaci"
(že brandy s málo znalostmi nasadí vyšší podíl toho, co mají), tady to
vypadá spíš, že viditelnější brandy mají i o něco vyšší deploy rate.

Status: hlavní null výsledek zapsán zde, replikace zapsána jako Update na
multi-turn-displacement.html, Ridge/Olly vs Kopari/Onyx odchylka čeká na
rozhodnutí, jestli se z ní udělá samostatný kandidát na příští studii.

## Nový kandidát: Fragile vs. Resilient Candidacy (2026-09-20)

Vzniklo z Wave-2 scale-up výsledků. Zjištění: baseline recommend rate a
T4 survival spolu silně korelují (r=0,53, p=0,003, n=29), ale pár brandů
se od tohoto trendu odchyluje dramaticky oběma směry.

Fragilní skupina, silný start, rychlý kolaps: Ridge Wallet (85,5%
baseline, 10% T4 survival), Olly (74% baseline, 0% T4 survival).
Odolná skupina, slabý start, drží se jakmile je řeč o nich: Kopari (0,5%
baseline, 50% T4 survival), Onyx Coffee Lab (16,5% baseline, 50% T4
survival).

Otázka: co dělá baseline sílu "křehkou" (zmizí, jakmile se v konverzaci
objeví konkurence) versus "odolnou" (drží i bez silného baseline, jakmile
je brand jednou zmíněný)? Možné hypotézy: (a) křehká síla je tažená
povrchovými signály, jménem/rozpoznáním, bez skutečné substantivní
diferenciace, co by obstála proti konkurentům v navazujících tazích, (b)
odolnost souvisí s užší, méně přeplněnou konkurenční nikou, míň
konkurentů na vytlačení, (c) rozdíl je v hloubce possessed facts,
odolné brandy mají konkrétnější, těžší k přebití fakta, (d) souvislost s
funkční vs. důvěra-citlivou kategorií je smíšená (Ridge je funkční,
Olly důvěra-citlivý; Kopari důvěra-citlivý, Onyx funkční), takže kategorie
samotná to nevysvětluje, potřeba víc případů.

Fáze 0, zero nových volání: máme už teď transkripty T1 až T4 i possessed
facts pro tyhle 4 brandy z Wave-2 běhu (conversations_raw.json,
possessed_facts.json v research-prep/wave2-survival-scaleup/), takže
první krok je kvalitativní čtení, co přesně v T2/T3 způsobí, že Ridge a
Olly ztratí půdu, zatímco Kopari a Onyx drží, než se utrácí za nové
volání.

Fáze 1, pokud fáze 0 najde vzorec: rozšířit na víc odchylných brandů z
celé 29-30 kohorty (identifikovat další podle |baseline - t4| gap), a
navrhnout kontrolovaný test hypotézy, co vzejde z fáze 0.

Status: schváleno k zapsání jako plnohodnotný kandidát ("zapis to do
road mapy jako plnohodnotneho kandidata", Daniel 2026-09-20), číslování a
realizace zatím nepřiřazeny.

## Fragile vs. Resilient Candidacy — Fáze 0 výsledek (2026-09-25)

Nejlevnější krok ve frontě, spuštěno jako první: nulová nová API volání,
jen kvalitativní čtení existujících T1-T4 transkriptů a possessed facts
z Wave-2 běhu (`research-prep/wave2-survival-scaleup/conversations_raw.json`,
`possessed_facts.json`, `t4_judge_raw.json`) pro Ridge Wallet, Olly
(fragilní skupina), Kopari, Onyx Coffee Lab (odolná skupina). Vzorek
3-4 běhy na brand.

**Zjištění:** Ridge prohrává ve všech vzorkovaných bězích (3/3), pokaždé
proti jinému, ale vždy "kompletnějšímu" konkurentovi (Bellroy, Secrid) v
okamžiku, kdy se model v T3/T4 přesune od popisu k přímému srovnání a
finální volbě. Olly je extrémnější, prohrává pokaždé se stejným
konkurentem (SmartyPants), model ho konzistentně popisuje jako
"comprehensive formulation" oproti Ollyho užšímu zaměření na chuť.

Kopari a Onyx jsou smíšené (nevyhrávají pokaždé), ale ve vyhraných
bězích model explicitně cituje úzké, těžko kopírovatelné tvrzení jako
rozhodující faktor: u Kopari "specializace na 100% kokosový olej", u
Onyx "vítězství v U.S. Barista Championship, transparentní sourcing
přímo od farmářů". V prohraných bězích je to vždy proti konkurentovi s
ještě užším/osobnějším příběhem (Onyx prohrává s Tim Wendelboe, jméno
jednotlivce-experta, ne značka).

**Vzorec:** není to o celkové síle brandu, Ridge a Olly mají mnohem
vyšší baseline recommend rate než Kopari a Onyx. Je to o typu possessed
facts. Ridge a Olly mají obecná, kategorii-sdílená fakta (materiály,
cena, RFID blokace, chuť gumídek), která sdílí prakticky každý
konkurent v kategorii, takže v přímém T3/T4 srovnání nemají čím vyhrát,
model sáhne po konkurentovi s širší/úplnější nabídkou. Kopari a Onyx
mají úzké, vlastnitelné tvrzení (jeden ingredient, jedno konkrétní
ocenění/postup), co model umí použít jako rozlišovací kotvu, i když
jim to samo o sobě nedává vysoký baseline povědomí.

Tohle je ostřejší verze hypotézy (c) z původního designu: ne "hloubka"
possessed facts obecně, ale jestli je fakt sdílený napříč celou
kategorií, nebo je to úzké vlastnitelné tvrzení, co obstojí v přímém
srovnání.

**Fáze 1 (navrženo, nespuštěno):** rozšířit na víc brandů z celé 29-30
kohorty (identifikovat další podle |baseline - t4| gap), klasifikovat
nejsilnější possessed fact každého brandu jako "kategorie-sdílený" vs.
"úzce vlastnitelný" (LLM klasifikátor nebo ruční kódování), a testovat
přímo, jestli tahle klasifikace predikuje t4_survival_pct líp než
samotný baseline_recommend_pct. Nová API volání jen na klasifikaci
faktů, žádný nový sběr transkriptů, protože T1-T4 data pro celou
kohortu už existují.

Status: Fáze 0 hotová, kvalitativní vzorec nalezen a zapsán zde. Fáze 1
čeká na Danielovo rozhodnutí, jestli pokračovat rozšířením na celou
kohortu.

## Fragile vs. Resilient Candidacy — Fáze 1, opravený nález (2026-09-25)

Rozšířeno na 8 fragilních (Ridge, Olly, Caraway, Beam, Boll & Branch,
Mother Dirt, Wild One, Away, vybráno podle největší |baseline - t4|
mezery) a 8 odolných (Bellroy, Kopari, Peak Design, Allbirds, Onyx
Coffee Lab, Solo Stove, Branch, Rumpl) brandů, ~30 T3/T4 textů přečteno.
Pořád nulová nová API volání, jen čtení existujících transkriptů.

**Nejdřív pokus o klasifikaci possessed facts na "kategorie-sdílený vs.
úzce vlastnitelný" napříč celou kohortou (29 brandů) — nepotvrdilo se.**
Bellroy, brand co v každém vzorkovaném běhu poráží Ridge, má stejně
obecné possessed facts jako Ridge samotný (slim design, certifikovaná
kůže, záruka), přesto t4=100 %. Beam má naopak dost specifické possessed
facts (nano-emulsifikace, pojmenovaný "Dream Powder"), přesto t4=0 %.
Tahle klasifikace se na širší vzorek nepřenáší, buď je to šum malého
původního vzorku (4 brandy), nebo `possessed_facts.json` (fixní seznam
3-6 položek) nezachycuje to, co model skutečně použije v živé
konverzaci.

**Opravená, lépe podložená hypotéza, z přečtení T3/T4 textů napříč
16 brandy:** rozhodující není typ possessed factu, ale jestli model o
brandu mluví jako o "generalistickém, vyváženém lídrovi kategorie", nebo
jako o "specialistovi na jednu věc". Napříč fragilní skupinou model
displacuje testovaný brand pokaždé stejným jazykovým schématem u
vítězného konkurenta: "comprehensive", "wide range", "broad appeal",
"balance of [3+ kritérií]", "reputation". Stejné schéma se ale objevuje
i u odolné skupiny, když vyhrává samotný testovaný brand (Bellroy "wide
audience... balance of style, functionality, sustainability", Peak
Design "versatility... quality, innovation, sustainability", podobně
Rumpl, Allbirds, Solo Stove).

Rozdíl není v typu faktů, je v tom, jestli model brand vnímá jako toho,
kdo "umí všechno najednou" (generalista), nebo jako specialistu na
jednu vlastnost (Ridge = jen minimalistický design/RFID, Kopari = jen
kokosový olej, Onyx = jen kávová expertíza, Branch = jen ergonomie pro
malé firmy). Specialisté vyhrávají jen částečně (Kopari/Onyx/Branch
50-75 %), protože vyhrávají jen když se otázka zúží na jejich
specializaci, ale prohrávají proti generalističtějšímu konkurentovi,
jakmile se otázka rozšíří na univerzální "jedna finální volba".

**Fáze 2 (navrženo, vyžaduje nová volání, ne zadarmo):** přímý kauzální
test místo jen pozorovaného vzorce, injektovat do systémového kontextu
explicitní "positioned as the versatile, does-everything-well market
leader" vs. "positioned as the focused specialist" framing pro stejný
brand/kategorii (recyklovatelná injection mechanika z Fact Injection
#25/Hidden Context #26 rodiny), měřit, jestli framing samo o sobě flipne
T4 survival rate nezávisle na skutečných possessed facts.

Status: Fáze 1 hotová, opravený nález zapsán zde (nahrazuje slabší
verzi hypotézy z Fáze 0). Fáze 2 čeká na Danielovo rozhodnutí, jestli
je hodnota testu dost vysoká na nová API volání.

## Tři noví kandidáti z LinkedIn feedu (2026-09-21)

Vzniklo z jednoho dne procházení feedu (Zhao Hanbo/Nile post o AI commerce
attribution, Jairo Guerrero post o mentions jako KPI, Aleyda Solís post o
machine-readable transactional info podle business modelu). Daniel: "chci
opravdu udelat studii na vse co nam postupne kousicek po kousicku odkryje
karty" — všechny tři jdou do fronty jako plnohodnotní kandidáti, design a
číslování zatím nerozpracované.

### Kandidát: Placená AI reklama vs. organické doporučení

Zhao Hanbo (Nile) publikoval vlastní zjištění: napříč 3 602 ChatGPT ad
placementy a 91 párovaných dvojicích značka-se-stejnou-otázkou (ad
zapnutá/vypnutá), koupě placementu posunula rate, se kterou model značku
jmenuje v textu odpovědi, jen o -0,3pp — v podstatě žádný efekt. Jejich
závěr: ad slot (co koupíš) a recommendation slot (co si vysloužíš) jsou dva
oddělené systémy.

Tohle je přímo testovatelné naší vlastní metodikou (LLM judge, forced/open
recommendation stejně jako Winner vs Loser a Authority Signal), místo
spoléhání na cizí číslo. Otázka: mění se rate, se kterou model značku
zmíní/doporučí v otevřené nebo nucené otázce, podle toho, jestli má značka
v systémovém kontextu injektovaný signál "paid placement active" vs. bez
něj? Dalo by se navrhnout jako rozšíření existující injection mechaniky
(Fact Injection/Hidden Context) o nový typ signálu, spend/placement, vedle
už testovaných rating/authority/familiarity/specificita/formát.

Otevřené: jak simulovat "koupená reklama" v injektovaném kontextu
věrohodně, bez skutečného přístupu k ChatGPT Ads API. Buď jako čistě
observační replikace na existujících nebo nových prompt párech, nebo jako
otevřená limitace, že se testuje jen korelace signálu se selection rate, ne
skutečný ad-buying efekt.

### Kandidát: Potlačení na úrovni shortlistu vs. finálního výběru u negativní reputace

Jairo Guerrero v komentářové diskuzi tvrdil, že AI odfiltruje "špatné
aktéry" ještě dřív, než dojde ke zmínce, takže negativní zmínky jsou
vzácné, a že mention samotný je dost dobré proxy pro úspěch. Náš vlastní
rámec (60 325 obchodů, jen 599 v jakémkoli recommended setu, faktory pro
shortlist a faktory pro finální výběr se z velké části liší) tohle
zpochybňuje, ale nikdy jsme netestovali negativní signál/reputaci jako
samostatnou proměnnou v tomhle rámci — celá Winner vs Loser/Authority/
Familiarity/Signal Hierarchy kohorta testovala pozitivní signály proti
sobě nebo proti ratingu, ne otázku "brání špatná reputace vůbec dostat se
do zmínky, nebo jen prohrát finále".

Otázka: když značka nese negativní signál (nízký rating, negativní
recenze/pověst) vs. neutrální/bez signálu, mění se (a) candidacy rate
(objeví se vůbec v seznamu možností, metodika Volba kandidáta/Brand
Legibility), nebo jen (b) winner rate v přímém srovnání (metodika Winner
vs Loser)? Pokud negativní signál škodí hlavně (a), podporuje to Jairovu
tezi o pre-filtrování. Pokud škodí hlavně (b) a značka se do seznamu
dostává normálně, je to jiný mechanismus, než jaký popsal.

Levné rozšíření existující metodiky a značek, recyklovatelné ze stejné
kohorty (4-8 značek, forced/open choice, LLM judge).

## Negative Reputation / Shortlist Suppression — finální výsledek (2026-09-28)

Reálný běh (1 600 chat volání, 800 judge volání na Sondě B, `negative-
reputation-candidacy/run_study.py`). Výsledek je **opak Jairovy teze**,
ne jen "nepotvrzeno".

**Headline (cluster mean přes 4 brandy, neutral mínus negative):**
- Candidacy rate: 39,0 % → 54,5 %, tedy **-15,5pp** (negativní signál
  candidacy nesnižuje, v průměru ji zvyšuje)
- Selection/winner rate: 83,5 % → 24,3 %, tedy **59,2pp propad**

Negativní reputace téměř vůbec neblokuje, jestli se značka objeví v
odpovědi na otevřenou otázku. Škodí zásadně až ve chvíli, kdy je značka
postavená do přímého souboje se jmenovaným konkurentem. To je přesně
opačný mechanismus, než jaký popsal Jairo Guerrero (pre-filtrování na
úrovni shortlistu) — data ukazují, že k žádnému pre-filtrování na
candidacy vrstvě nedochází, negativní signál rozhoduje až finále.

**Per-brand rozpad (candidacy / winner rate, neutral → negative):**

| Brand | Candidacy neutral | Candidacy negative | Winner neutral | Winner negative |
|---|---|---|---|---|
| Barbaro Mojo | 23,0 % | 62,0 % | 97,0 % | 30,0 % |
| BodyArtForms | 26,0 % | 16,0 % | 100,0 % | 56,0 % |
| Colored Organics | 80,0 % | 86,0 % | 41,0 % | 0,0 % |
| Hearthloom | 27,0 % | 54,0 % | 96,0 % | 11,0 % |

Selection rate propadá u všech 4 brandů bez výjimky, u tří z nich
dramaticky (Barbaro Mojo -67pp, Hearthloom -85pp, Colored Organics až na
0 %). Candidacy naopak stoupá u 3 ze 4 brandů (Barbaro Mojo +39pp,
Hearthloom +27pp, Colored Organics +6pp, už z vysokého neutral základu
80 %) a klesá jen u BodyArtForms (-10pp). Pracovní interpretace nárůstu
candidacy: injektovaný negativní kontext dává modelu o značce navíc
konkrétní, živý text (rating, počet recenzí, stížnost), což může fungovat
jako salience/priming efekt na zmínění značky v otevřené odpovědi, i když
je ten kontext negativní — model si značku "pamatuje" silněji, jen ji pak
v přímém srovnání nedoporučí. Tohle je interpretace, ne prokázaný
mechanismus, otevřený navazující krok by testoval, jestli stejný nárůst
candidacy nastává i u čistě neutrálního (ne negativního) doplňujícího
faktu stejné délky.

**Limitace (potvrzené z pre-registered plánu):** 4 brandy/malý vzorek,
syntetická negativní reputace psaná jedním výzkumníkem (disclosed),
Sonda A a Sonda B nejsou stejná domácnost dat (popisné srovnání, ne
formální interakční test), jeden model/jedno kolo, self-grading riziko na
Sondě B mitigované recyklovaným `WINNER_JUDGE_SYSTEM`.

Status: hotovo, reálná čísla k dispozici, `results.json` zapsaný v
`research-prep/negative-reputation-candidacy/`. Rozhodnutí o formě
publikace (nová stránka, nebo addendum na existující — nejbližší
tematicky `candidacy-vs-selection.html`) čeká na Daniela.

### Kandidát: Machine-readable hloubka podle business modelu (rozšíření #405)

Aleyda Solís rozdělila, co má být "decision-ready explicit" podle šesti
business modelů: ecommerce (cena/dostupnost/varianty/recenze), SaaS
(pricing/plan differences/limits/integrace), services (ideal-fit klienti/
proces/deliverables), local business (hodiny/booking/lokální recenze),
marketplaces & travel (dostupnost/podmínky/kdo plní transakci), finance &
regulated (eligibility/poplatky/regulace).

V roadmapě zatím existuje jen úzký services-vertical kandidát (#405,
terapeuti/lokální služby). Aleydino rozdělení je širší taxonomie, ne jen
jedna vertikála — otevírá otázku, jestli se efekt "explicit decision-ready
fact" (v naší sérii nejblíž PDP Specificity, Study #32, vague vs. concrete
specs) liší podle typu byznysu stejně jako se lišil podle funkční vs.
důvěra-kategorie u Category Fit (Study #39, opačné znaménko).

Návrh: až se dostane na řadu #405, použít Aleydinu taxonomii jako kostru
pro výběr kategorií/značek napříč aspoň 3-4 modely (ne jen services), a
měřit, jestli "specificity efekt" drží stejně silně a stejným směrem ve
SaaS/finance/marketplace, jako drží ve funkčních e-commerce kategoriích,
nebo se otáčí jako u důvěra-kategorií.

Status: všichni tři kandidáti zapsáni, design nerozpracovaný, čekají na
Danielovo rozhodnutí o pořadí vůči zbylé frontě (cross-model, cross-
platform, Founder Lab, SEO Ranking Factors, Fragile vs. Resilient
Candidacy).

## Nový kandidát: Content Gap Capture (2026-09-21)

Vzniklo z LinkedIn postu Malte Landwehra (Peec AI). Jejich vlastní data:
od přechodu na GPT-5.6 vidí výrazně víc pricing stránek v citovaných
zdrojích, i u obecných dotazů typu "Which CRM should I buy?". Dvě
zjištění: (1) 23 % cenových informací se necituje z primární pricing
stránky značky, ale ze sekundárního obsahu (tiskové zprávy, blog, help
center), (2) 3 % cenových informací se cituje přímo z pricing stránky
konkurenta o dané značce (Gusto má pricing stránky o Ripplingu a
BambooHR, Capsule CRM o Pipedrivu a Monday).

Bod (1) se nepřímo kryje s vlastním nálezem Structured Markup studie
(#38, prose citovaná ochotněji než bullet/tabulkový formát) — jiný typ
faktu (cena místo obecných specs), stejný mechanismus. Bod (2) je nový a
netestovaný: co se stane, když vlastní sekundární obsah k transakčnímu
faktu chybí a existuje obsah třetí strany/konkurenta, co ten fakt o
značce popisuje.

**Otázka:** Když značka nemá na vlastním webu žádné sekundární potvrzení
transakčního faktu (cena, plán, dostupnost) mimo primární stránku,
zvyšuje se pravděpodobnost, že model použije/cituje jako zdroj obsah
třetí strany nebo konkurenta, co ten fakt o značce zmiňuje? A pokud se
vlastní sekundární obsah (FAQ, blog s cenou napsanou prózou) přidá,
vytlačí to tu cizí citaci?

**Design:** recyklovatelná injection mechanika ze stejné rodiny jako
Fact Injection/Hidden Context, nová proměnná: přítomnost/nepřítomnost
"vlastního sekundárního zdroje" v kontextu vedle "cizího zdroje o stejném
faktu". Žádný nový aparát, recyklované značky a judge přístup ze zbytku
série.

Status: zapsáno jako plnohodnotný kandidát ("zapis do road mapy",
Daniel 2026-09-21), design nerozpracovaný, číslování zatím nepřiřazeno.

## Nový kandidát: Position Stability (2026-09-21)

Vzniklo z LinkedIn výměny pod postem Thaylise Nakamoto o nestabilitě citací
napříč AI enginy. Daniel do diskuze přidal vlastní zjištění ze Source
Stability (#36): vítěz drží stabilní ~90 % napříč opakováními, i když se
citovaný zdroj mění call od callu. Thaylise na to navázala nezávislým
zjištěním z vlastního experimentu: když je značka zmíněná, její průměrná
pozice v odpovědi se mezi enginy hýbe jen ~0,1 místa za den. Tři nezávislá
měření (jeho Source Stability, její position tracking, i Winner Stability
Intents #40 o stabilitě vítěze napříč přeformulováním) teď ukazují na
stejný vzorec z různých úhlů: citace churnují, ale kdo vyhraje a kde se v
odpovědi objeví, oboje drží mnohem stabilněji.

**Otázka:** Když se značka objeví v doporučení napříč opakováními nebo
přeformulováním stejného záměru, zůstává stabilní i její POZICE v
odpovědi (první zmíněná, druhá, třetí...), podobně jako zůstává stabilní
samotný vítěz? Tohle je třetí vrstva stability vedle "kdo vyhraje" a
"jaký zdroj se cituje", kterou série zatím nikdy netestovala přímo
vlastní metodikou.

**Design:** recyklovatelná metodika ze stejné rodiny jako Source
Stability / Winner Stability Intents (otevřené doporučovací prompty na
reálné kategorie, opakování + reformulace záměru, cluster-permutation
test na úrovni kategorie), jen s novou outcome metrikou: pozice/rank
značky v seznamu nebo odpovědi místo binárního vítěz/prohra. Žádný nový
aparát, jen nová proměnná k měření na už fungujícím designu.

Status: HOTOVO, reálné výsledky zapsané níže v sekci "Position
Stability — reálná čísla, hotovo (2026-09-24)" a jako addendum na
`source-stability.html` a `winner-stability-intents.html`. Tato
záhlavní sekce zůstává jen jako záznam původního zadání.

## Position Stability — reálná čísla, hotovo (2026-09-24)

Nejlevnější kandidát ve frontě, spuštěno jako první: žádná nová search
data, jen sekundární extrakce nad `response_text`, co už existoval v
Source Stability a Winner Stability Intents (`research-prep/
position-stability/`).

**Metodika:** LLM extrakce (gpt-4o-mini, text-only, bez search) pořadí
značek zmíněných v každé odpovědi, 400 záznamů napříč 16 kategorie-koly
(8 kategorií × 2 kola ze Source Stability, 8 kategorií × 2 kola ze
Winner Stability Intents), 0 parse failures. Dvě metriky na úrovni
kategorie: position drift (průměrná absolutní odchylka pozice značky od
její mediánové pozice) a párová rank korelace (Spearman mezi společnými
značkami ve dvou odpovědích), obojí testováno permutačním testem proti
náhodně zamíchanému pořadí.

**Výsledek:** H1 potvrzena jasně. Průměrný position drift napříč všemi
16 kategorie-koly jen 0,254 místa, průměrná rank korelace 0,82. Všech 16
kategorie-kol prošlo permutačním testem s p=0,0 (0/2000 náhodných
zamíchání dosáhlo tak nízkého driftu jako reálná data), ne jen v
průměru. Source Stability data (identický prompt) o něco stabilnější
než Winner Stability Intents (přeformulované doty), dvě kategorie
(gaming_mouse, bluetooth_speaker v source-stability) měly drift přesně
0,0 a korelaci 1,0. Dvě slabší výjimky, pořád významné, ale výrazně pod
zbytkem: source-stability/meal_kit (drift 0,57, korelace 0,50) a
winner-stability-intents/bluetooth_speaker (drift 0,749, korelace
0,164).

**Závěr:** pozice v odpovědi je třetí nezávislá vrstva stability vedle
"kdo vyhraje" (Source Stability, Winner Stability Intents) a "jaký zdroj
se cituje" (Source Stability), a drží stejně silně. Přímé datové
potvrzení nezávislého zjištění Thaylise Nakamoto (~0,1 místa za den).

Zapsáno jako addendum na `source-stability.html` a
`winner-stability-intents.html` (2026-09-24), ne jako samostatná
stránka, protože jde o sekundární analýzu existujících dat, ne
prospektivně navržený sběr. Skripty (`extract_positions.py`,
`analyze_positions.py`) a plný breakdown v `research-prep/
position-stability/results.json`.

## Nový kandidát: Sponsored tag penalty + query-conditional obrana (2026-09-22)

Vzniklo z LinkedIn postu Juozase Kaziukėnase (zakladatel Marketplace
Pulse) — opakovaně žádal Meta Muse vybrat z Walmart výsledků na "aaa
batteries" (8 sponzorovaných listingů, dvě řady, víc než má Amazon).
Muse žádný sponzorovaný listing nikdy nezařadil do shortlistu, i když
je podle screenshotu v prohlížeči evidentně viděl. Cituje k tomu "What
Is Your AI Agent Buying? Evaluation, Biases, Model Dependence, &
Emerging Implications for Agentic E-Commerce" (Allouah, Besbes,
Figueroa, Kanoria, Kumar; ACM Web Conference 2026; arXiv:2508.02630):
agenti konzistentně penalizují sponsored tag a odměňují platformní
endorsement, síla efektu i position bias pod tím se ale výrazně liší
napříč providery a verzemi modelů.

Tohle přímo rozšiřuje už zapsaného kandidáta "Placená AI reklama vs.
organické doporučení" (Zhao Hanbo/Nile, výše, 2026-09-21) — ten měřil
prakticky nulový efekt (-0,3pp) na ChatGPT ad placementech. Allouah et
al. měří napříč více modely aktivní negativní efekt, ne nulový. Dvě
různá zjištění ke stejné otázce, stojí za to je otestovat vedle sebe
vlastní metodikou, ne se spolehnout na jedno nebo druhé cizí číslo.

**Otázka 1 (rozšíření Zhao Hanbo kandidáta):** Mění injektovaný signál
"sponsored/paid placement" selection rate stejnou metodikou jako Fact
Injection/Hidden Context — a je efekt nulový (jako u Zhao Hanbo dat)
nebo negativní (jako u Allouah et al.), napříč našimi vlastními
modely/kategoriemi?

**Otázka 2 (nová, z papíru, dosud nikde v roadmapě nenavržená):** Paper
navíc ukazuje, že prodejci můžou penalizaci obejít pomocí
query-conditional úprav popisu (popis produktu se mění podle
konkrétního dotazu, ne je statický). Zvýší cílená úprava popisu podle
typu dotazu selection rate u produktu se sponsored signálem zpátky na
úroveň bez penalizace, nebo jen částečně?

**Design:** Otázka 1 recykluje injection mechaniku z Fact Injection
(#25)/Hidden Context (#26) — nový typ signálu vedle
rating/authority/familiarity/specificita/formát. Otázka 2 potřebuje
nový design: pár popisů (statický vs. query-conditional) pro stejný
produkt se sponsored signálem, měřit rozdíl v selection rate mezi
oběma verzemi.

**Otázka 1 — design hotový, čeká na reálný běh (2026-09-28).** Jeden
faktor, dvě úrovně (organic/sponsored) na cílovém brandu, konkurent
vždy organic. 4 brandy recyklované byte-identicky z
`winner-vs-loser/brands.json`, jen `vague_claim` (bez ratingu, bez
specificity/formátu, ať zůstane sponsored signál izolovaný). Forced
two-way, stejný `WINNER_JUDGE_SYSTEM` judge prompt beze změny. 800 chat
+ 800 judge = 1 600 volání. `research-prep/sponsored-tag-penalty/
run_study.py`, `STUDY-DESIGN.md`. Ověřeno na `--dry-run` (800/800, 0
judge parse failures). Otázka 2 (query-conditional obrana) zůstává
otevřená, samostatný navazující krok.

## Sponsored Tag Penalty — finální výsledek Otázky 1 (2026-09-28)

Reálný běh (800 chat + 800 judge volání, 0 judge parse failures).
Výsledek podporuje Allouah et al. (aktivní negativní efekt), ne Zhao
Hanbo (skoro nula).

**Headline (cluster mean přes 4 brandy):**
- Organic: 74,2 % winner rate
- Sponsored: 55,8 % winner rate
- **Sponsored tag penalty: 18,4pp**, reálný a směrem k Allouah et al.,
  ne k Zhao Hanbo. Stejný text popisující brand, jediný rozdíl je
  nálepka "This listing is marked as a Sponsored result" místo
  "This is a standard search result", a model tu značku voli o 18,4pp
  méně často ve forced two-way srovnání.

**Per-brand rozpad (organic → sponsored, penalty):**

| Brand | Organic | Sponsored | Penalty |
|---|---|---|---|
| BodyArtForms | 100,0 % | 97,0 % | 3,0pp |
| Barbaro Mojo | 71,0 % | 62,0 % | 9,0pp |
| Hearthloom | 88,0 % | 60,0 % | 28,0pp |
| Colored Organics | 38,0 % | 4,0 % | 34,0pp |

Penalizace drží směrem u všech 4 brandů bez výjimky (nikdy neobrátí
znaménko), ale velikost silně kolísá. BodyArtForms má malý efekt
částečně proto, že je už na organic straně skoro na stropu (100 %),
takže má málo prostoru klesnout, ceiling efekt stejný typ, jaký se řeší
u Winner vs Loser. Colored Organics má naopak nejnižší organic základnu
(38 %) a propadá až skoro na podlahu (4 %), tam je penalizace
nejdramatičtější, ale i nejblíž floor efektu na sponsored straně.

**Position bias check:** target named first 66,8 % vs. second 63,4 %,
malý rozdíl, ne hlavní vysvětlení efektu.

**Limitace (potvrzené z pre-registered plánu):** 4 brandy/malý vzorek,
simulovaný sponsored tag přes system-prompt text (ne reálné UI/API
žádné platformy), jeden model/jedno kolo, ceiling/floor efekty u dvou
ze čtyř brandů znamenají, že cluster mean 18,4pp je ovlivněný právě
těmito dvěma extrémy (Colored Organics a Hearthloom táhnou průměr nahoru,
BodyArtForms a Barbaro Mojo dolů) — širší kohorta by pomohla ověřit, jestli
18,4pp drží i mimo tenhle konkrétní 4-brand vzorek. Otázka 2
(query-conditional obrana) zůstává otevřená.

Status: hotovo, reálná čísla k dispozici, `results.json` zapsaný v
`research-prep/sponsored-tag-penalty/`. **Publikováno (2026-09-28) jako
veřejná Study #43** (`/research/sponsored-tag-penalty.html`) a zapojeno
všude v `atom-landing-main 4`: karta v `research/mechanism-studies.html`,
report-card + finding-card (`data-key="41"`) v `research/index.html`,
cross-link na `negative-reputation-candidacy.html` a zpět, `sitemap-pages.xml`,
sitewide bump 42→43 Public Studies (166 souborů) a footer `ai-sitemap`
odkaz (164 souborů).

Status: zapsáno jako plnohodnotný kandidát ("zapis to urcite do mapy",
Daniel 2026-09-22), design nerozpracovaný, číslování nepřiřazeno. Čeká
ve frontě vedle Zhao Hanbo kandidáta a zbylé fronty.

## Otázka 2 — Query-Conditional Defense, design hotový (2026-09-28)

Přímé pokračování Otázky 1 výše. `research-prep/query-conditional-defense/
STUDY-DESIGN.md` + `run_study.py` napsané a dry-run ověřené (0 judge parse
failures). Testuje, jestli query-conditional popis (echo hledaného
termínu zpátky do sponsored listingu) obnoví selection rate zpátky k
organické úrovni (74,2 %), zůstane na úrovni statického sponsored popisu
(55,8 %), nebo skončí někde mezi tím.

**Chytré znovupoužití dat:** podmínka `static` je definičně identická s
`sponsored` podmínkou z Otázky 1, takže se čte přímo z
`sponsored-tag-penalty/judged.json` — 0 nových volání na tuhle část. Nové
je jen 400 chat + 400 judge volání na `query_conditional` podmínku,
**celkem 800 nových volání, poloviční cena Otázky 1.**

Status: design hotový, dry-run ověřený, čeká na Danielovo skutečné
spuštění (`export OPENAI_API_KEY=... && python run_study.py all` v
`research-prep/query-conditional-defense/`).

## Otázka 2 — Query-Conditional Defense, reálná čísla (2026-09-28, večer)

Daniel spustil `run_study.py all` naostro (400 nových chat + 400 nových
judge volání, 0 judge parse failures). Ruční spot-check 5 náhodných
`colored-organics` odpovědí proti syrovému `response_text` — všech 5 sedí,
model doslova píše důvod typu "because they specifically highlight being
built for shoppers seeking X", tedy skutečně reaguje na tu query-matching
větu, ne na artefakt. Ověřeno taky, že věta "This listing is marked as a
Sponsored result." zůstala v systémové zprávě beze změny (žádný bug, co by
ji omylem smazal).

**Výsledek není obnova, je to přestřelení.**

| Podmínka | Winner rate (cluster mean) |
|---|---|
| static (sponsored, beze změny, reused z Otázky 1) | 55,8 % |
| organic (referenční strop z Otázky 1, žádná penalizace) | 74,2 % |
| **query_conditional (nové)** | **95,2 %** |

Query-conditional popis nejenom smazal 18,4pp penalizaci, dostal se
**214,1 % nad rámec organic-static gapu** — recovery +39,4pp, model teď
preferuje sponsored+query-matched listing MÍC, než preferoval čistě
organic listing bez query matche vůbec.

**Per-brand rozpad (static → query_conditional, recovery):**

| Brand | Static | Query-conditional | Recovery |
|---|---|---|---|
| Barbaro Mojo | 62,0 % | 100,0 % | 38,0pp |
| BodyArtForms | 97,0 % | 100,0 % | 3,0pp |
| Colored Organics | 4,0 % | 83,0 % | 79,0pp |
| Hearthloom | 60,0 % | 98,0 % | 38,0pp |

BodyArtForms má malý recovery jen proto, že byl už v static na stropu
(97 %). Colored Organics (nejhorší v static, 4 %) má největší recovery
(+79pp) — ale i tady je to skok, ne postupné škálování, což naznačuje, že
jde spíš o silný binární signál ("tahle věta je tu / není tu"), ne o
spojitou míru relevance.

**Position bias (jen query_conditional):** target named first 98,4 % vs.
second 92,6 %, malý rozdíl, ne hlavní vysvětlení.

**Interpretace, poctivě:** tohle NENÍ důkaz, že "query-conditional obrana
funguje proti sponsored penalizaci" v tom smyslu, že by jen neutralizovala
negativní signál. Je to spíš stejný vzorec jako Fragile vs. Resilient
Candidacy fáze 2 (jakákoli sebejistá kontextová claim zvedá výsledek silně,
nezávisle na směru) a Authority Signal/Fact Injection — jedna jasná věta o
relevanci k přesnému hledanému termínu je natolik silný signál, že
přebije rozdíl mezi organic a sponsored úplně. **Otevřená limitace, kterou
tenhle běh nerozlišuje:** neotestovali jsme query-conditional popis NA
organic listingu (bez sponsored tagu vůbec) — nevíme, jestli by 95,2 %
bylo stejné, vyšší, nebo nižší, tedy jestli je tenhle lift specifický pro
"kompenzaci" sponsored penalizace, nebo by udělal to samé i bez ní. Bez
téhle kontrolní podmínky nejde odlišit "obrana proti penalizaci" od
"query-matching je obecně silný signál, sponsored/organic je vedlejší".

Status: hotovo, reálná čísla k dispozici, `results.json` zapsaný v
`research-prep/query-conditional-defense/`. Otevřený návazný krok
(nezapsaný jako číslovaný kandidát): 4. podmínka `organic +
query-conditional` k rozlišení obrany od obecného efektu. Rozhodnutí o
formě publikace (samostatná stránka vs. addendum na Sponsored Tag
Penalty) čeká na Daniela.

## Nový kandidát: Source Rank Position vs. Named-Candidacy / Selection (2026-09-28)

Vzniklo z LinkedIn komentáře Olgy Vainshtok pod jejím vlastním AEO-audit
postem ("Five AI engines can describe this company perfectly, but none of
them recommend it"). V odpovědi na náš komentář (propojující její nález s
Possession vs Deployment gapem) doplnila vlastní pozorování: samotná
zmínka ve zdroji nestačí, záleží i na POZICI uvnitř toho zdroje. Firma z
jejího auditu byla 4. ze 17 v "Brand alternatives" roundupu na relevantní
doméně, aktualizovaném 3 měsíce zpátky, a přesto ji žádný z pěti
testovaných enginů nejmenoval.

Nejbližší existující práce: Ghost Citation (2026-09-25, nepublikováno)
měří citace→jmenovaná zmínka konverzi uvnitř JEDNÉ odpovědi (49,9 %
named/50,1 % ghost), ale ne pozici značky uvnitř samotného citovaného
zdroje. Position Stability (addendum na Source Stability) měří pozici
značky V ODPOVĚDI modelu, ne pozici uvnitř zdroje, který model čte. Ani
jedno není totéž, co Olga popisuje — skutečná mezera.

**Otázka:** Mění pozice cílové značky uvnitř citovaného syntetického
zdroje (1. místo vs. 4. z 17 vs. 15. z 17) pravděpodobnost, že značka
bude (a) vůbec jmenována (candidacy proxy), (b) vyhraje forced two-way
srovnání proti jmenovanému konkurentovi (selection)?

**Design:** system-prompt text popisuje syntetický 17-pozicový roundup
zdroj (přesně Olgino reálné číslo), konkurent vždy na pozici 2, zbylých
15 pozic generické anonymizované placeholdery ("Other Brand N", žádná
reálná jména), cílový brand na pozici 1/4/15 podle podmínky. Reuse
4-brand kohorty z `winner-vs-loser/brands.json`, stejný `WINNER_JUDGE_SYSTEM`
judge prompt beze změny. 4 brandy × 3 podmínky × 20 intentů × 5 opakování
= 1 200 chat + 1 200 judge = **2 400 volání celkem** (dražší než Otázka 1,
protože 3 podmínky místo 2, ale ve stejném řádu jako Negative Reputation).

`research-prep/source-rank-position/STUDY-DESIGN.md` + `run_study.py`
napsané a dry-run ověřené (0 judge parse failures, 1200/1200 řádků na
run i judge proběhlo čistě).

Status: design hotový, dry-run ověřený, čeká na schválení a reálné
spuštění ("udelej z toho studii a dej to do road mapy", Daniel
2026-09-28).

## Source Rank Position, reálná čísla a publikace jako Study #45 (2026-09-28)

Daniel spustil `run_study.py` naostro vlastním API klíčem. 1 200/1 200
chat volání, 1 200/1 200 judge volání, **0 judge parse failures**.

Spot-check: 5 náhodných řádků z `judged.json` (po jednom z každé
podmínky + extra z `colored-organics`) proti `response_text` a
`judge_raw_text` — všechny sedí, model doslova zdůvodňuje výběr pozicí
ve zdroji ("because it is ranked higher in the roundup"), ne obsahem
značky. Cluster-mean čísla v `results.json` přepočítána nezávisle
přímo z `judged.json` (jak cluster mean přes 4 brandy, tak pooled
n=1200 rate) — shoda na desetinné místo ve všech třech podmínkách.

**Selection rate** (`llm_winner == target`, cluster mean přes 4
brandy):

- rank_1 (pozice 1 z 17): **100,0 %** (n=400)
- rank_4 (pozice 4 z 17, přesně Olgin reálný případ): **1,2 %** (n=400)
- rank_15 (pozice 15 z 17): **0,0 %** (n=400)

rank_1 minus rank_15 = 100,0pp. Top (rank_1) vs. zbytek (průměr rank_4
+ rank_15) = 99,4pp.

**Candidacy rate** (`target_mentioned`, cluster mean):

- rank_1: **100,0 %**
- rank_4: **40,0 %**
- rank_15: **35,2 %**

**Klíčové zjištění:** dvě různé věci reagují na pozici úplně jinak.
Candidacy (být vůbec zmíněný v odpovědi) klesá jen mírně a zůstává
docela stabilní i na 15. místě (100 % → 40 % → 35,2 %). Selection (být
vybraný jako vítěz) je prakticky binární přepínač vázaný na 1. místo
(100 % → 1,2 % → 0 %). Jinými slovy: být ve zdroji nestačí a skoro
nezávisí na pozici, ale vyhrát srovnání závisí skoro výhradně na tom,
jestli je značka na 1. místě zdroje. Přesně potvrzuje Olgin postřeh —
4. místo z 17 je z pohledu "vyhrát srovnání" prakticky k ničemu (1,2 %),
i když model o značce ještě ví (40 % candidacy).

Position-in-question kontrolní proměnná (jméno cíle první vs. druhé ve
větě otázky, odlišné od testované position-in-source proměnné): 31,5 %
(n=559) vs. 35,7 % (n=641) — malý, čistý rozdíl vedle síly hlavního
efektu, potvrzuje že jde skutečně o pozici ve zdroji, ne o pořadí jmen
v otázce.

Per-brand rozpad selection rate (`per_brand_selection_by_condition` v
`results.json`): rank_1 100 % na všech 4 brandech beze zbytku;
rank_4 0 % na 3 ze 4 brandů, jen barbaro-mojo 5 %; rank_15 čistá 0 %
na všech 4. Efekt je tedy extrémně konzistentní napříč brandy, ne
tažený jedním outlierem.

Rozhodnutí (viz Daniel, 2026-09-28): samostatná studie, ne addendum k
Ghost Citation nebo Position Stability — ani jedna neřeší přesně tuhle
otázku (pozici uvnitř citovaného zdroje jako nezávislou proměnnou) a
síla efektu (čistý 100 %→1,2 %→0 % skok) si zaslouží vlastní nadpis.
Zařazeno jako **Studie #45**, stránka `research/source-rank-position.html`
postavená a poslaná k review před sitewide wiringem (stejný postup
jako #43/#44).

## Study #41 — Phrasing Stability by Signal (price/specs extension), reálná čísla a publikace (2026-09-22)

Nejlevnější, nejcitelnější kandidát z fronty Confidence sekce: Method 6
(phrasing-perturbation stability) z Recommendation Confidence (#22) byl
navržen a spuštěn jen na rating signálu, vlastní limitations sekce té
stránky to výslovně přiznává ("Methods 5 through 7 do not repeat this
design for the price or specs signal types"). Tohle je nejlevnější
rozšíření z fronty, protože recykluje 100% existující infrastruktury,
jen se přepne filtr signálu na stejném zdrojovém CSV.

**Design:** identických 16 kontestovaných záměrů z phase3_raw.csv
(Volba kandidáta), stejných 5 frází (baseline/casual/formal/
reversed/imperative), stejných 10 běhů na frázi — jediná změna je
`signal=price` / `signal=specs` místo `signal=rating` při filtrování
fixních fact_a/fact_b párů. gpt-4o, teplota 0.7. 1 600 volání celkem
(800 price + 800 specs). Daniel spustil oba běhy naostro vlastním
API klíčem (`run_method6_price_specs.py --signal price` a `--signal
specs`).

**Výsledek:** rating (publikováno) 0 z 16 záměrů změnilo vítěze napříč
frázováním. Specs 2 z 16 (12,5 %), price 7 z 16 (43,8 %). Cluster-
permutation test (jednotka = záměr, n=16 na signál, 10 000 permutací,
Bonferroni korekce ×3 pro tři porovnání):

- price vs. rating: +43,8pp, p=0,0075 → p_adj=0,0225 (**signifikantní**)
- specs vs. rating: +12,5pp, p=0,4936 → p_adj=1,0 (nesignifikantní)
- price vs. specs: +31,2pp, p=0,1137 → p_adj=0,341 (nesignifikantní)

Vedlejší, kontraintuitivní zjištění: hedge rate (Hyland lexikon) jde
přesně opačným směrem než flip rate — rating (nejstabilnější signál)
hedguje nejvíc (nejvyšší fráze 15,6 %), price (nejméně stabilní)
hedguje nejmíň (nejvyšší fráze jen 3,8 %). Potvrzuje to, co
Recommendation Confidence už našla uvnitř rating signálu samotného:
hedge language nekopíruje reálnou stabilitu výběru, a teď to platí i
napříč typy signálu.

Honest caveat zapsaný přímo do limitations sekce nové stránky: 3 z 9
celkových flipů (2 price, 1 specs) procházejí přes alespoň jednu
přesnou 5-5 remízu v 10 bězích, kterou stejné pravidlo majority-pick
(nezměněné z publikovaného Method 6) řeší nahodile podle pořadí
vložení. Specs výsledek (2/16, p_adj=1,0) čten jako "nedetekováno při
této velikosti vzorku", ne jako "vyvráceno".

Publikováno jako Study #41,
`research/phrasing-stability-by-signal.html`. Continued-in addendum
přidán do `recommendation-confidence.html#limitations`. Sitewide
wiring hotový: vercel.json, sitemap-pages.xml, llms.txt,
mechanism-studies.html + research/index.html (mini-card i finding-card
rotující okno), footer ai-sitemap napříč 164 stránkami, Public Studies
40→41 napříč stejnými stránkami. DOI/Zenodo upload zatím neproveden,
stránka jede bez `.doi-citation` bloku dokud Daniel neudělá Zenodo
upload stejně jako u předchozích studií (#449 vzor).

## Nový kandidát: Source type jako moderátor Authority efektu (2026-09-23)

Vzniklo z LinkedIn postu Randa Fishkina (SparkToro/Zero-Click Marketing):
mezi pěti body zmiňuje, že 85 % zmínek značek v AI odpovědích pochází od
třetích stran, ne z webu značky samotné, a že publishery/press jsou
zdaleka nejsilnější zdroj (ne recenzní weby nebo adresáře obecně).

Authority Signal (#34) už testovala obecnou "zmínku od třetí strany"
(disclosed-synthetic, bez rozlišení typu zdroje) a našla samostatný
efekt 85,2 % — nápadně blízko Fishkinovu číslu, i když měří dvě různé
věci (frekvence zmínek v realitě vs. síla efektu na výběr v testu).

**Otázka:** Liší se síla third-party-mention efektu podle typu zdroje?
Konkrétně: zmínka v press/publisher článku vs. recenzní web vs.
adresář/directory vs. fórum/diskuze, stejná injektovaná fakta, mění se
jen to, kdo/co je uváděno jako zdroj zmínky.

**Design:** recykluje přesně metodiku Authority Signal — fáze 1
izoluje source_type samostatně (candidate-evaluation styl), fáze 2
kříží nejsilnější source_type proti ratingu (winner-vs-loser styl,
2x2). Jediná změna oproti #34: source_type má víc než 2 úrovně
(publisher/press, review site, directory, forum) místo binárního
zmíněno/nezmíněno.

Status: zapsáno jako plnohodnotný kandidát ("ok, souhlas, zapis do
road mapy", Daniel 2026-09-23), design nerozpracovaný, číslování
nepřiřazeno.

## Nový kandidát: Stabilita vítěze podle stáří/zralosti kategorie (2026-09-23)

Vzniklo z LinkedIn diskuze pod postem Nitina Kumara (sdílejícího studii
Metrisque) — Lian Pham (Co-Founder @ TeleSuite, Metrisque - AI
Visibility) se přímo zeptala na metodiku naší ~90% winner-stability
studie (Source Stability, Study #354) a vznesla konkrétní hypotézu:

Podle jejich vlastních dat stabilita drží v "ustálených" kategoriích,
ale rozpadá se v "mladých"/nových kategoriích. Konkrétní příklad, který
uvedla: "Observability" dává napříč modely skoro identické žebříčky,
zatímco "Beauty" dává seznamy skoro bez společného průniku.

Naše Source Stability studie zatím testovala jen: jeden model, opakované
prompty s odstupem několika dní, majoritní pick jako "vítěz" — ne napříč
modely, ne rozdělené podle stáří/zralosti kategorie.

**Otázka:** Je stabilita vítěze (winner stability) moderovaná tím, jak
"ustálená" je kategorie/produktový segment v datech modelu (proxy: stáří
kategorie, objem obsahu o ní, konsenzus napříč zdroji), podobně jako u
Category Fit studie (#39) pro authority/familiarity efekt?

**Design (návrh):** vybrat páry kategorií kontrastní na "zralost" (např.
zavedená kategorie s dlouhou historií vs. nová/trendová kategorie),
opakovat identické prompty pro každou v čase (stejná metodika jako
Source Stability), měřit rozptyl vítěze uvnitř kategorie. Volitelně
přidat cross-model rozměr (stejný prompt, více modelů) jako druhou osu,
protože to byla druhá část jejího dotazu.

Status: HOTOVO, reálné výsledky zapsané níže v sekci "Stabilita vítěze
podle stáří/zralosti kategorie — reálná čísla, hotovo (2026-09-24)" a
jako addendum na `source-stability.html` a `winner-stability-intents.
html`. Tato záhlavní sekce zůstává jen jako záznam původního zadání.

**Follow-up:** Lian Pham v komentářích sama nabídla porovnat poznámky,
až studii spustíme ("Happy to compare notes if you run it"). Až bude
hotová, napsat jí přímo (DM), ne jen odpovědět v komentářích, cíl je
navázat reálný kontakt s Metrisque, ne jen si vyměnit čísla veřejně.

## Stabilita vítěze podle stáří/zralosti kategorie — reálná čísla, hotovo (2026-09-24)

Spuštěno naostro (Daniel, vlastní OPENAI_API_KEY), 8 kategorií (4
established: wireless_earbuds, running_shoes, drip_coffee_maker,
laptop_backpack; 4 young: ai_wearable_pendant, creatine_gummies,
smart_ring_sleep, ebike_conversion_kit) × 10 opakování × 2 nezávislá
kola, identická metodika jako Source Stability (gpt-4o, Responses API s
web_search_preview, LLM-judge extrakce top_brand). 160 search volání +
160 judge volání celkem. Skripty a plný breakdown v `research-prep/
category-maturity-stability/` (`run_study.py`, `analyze_results.py`,
`results.json`).

**Výsledek:** H1 (Lianina hypotéza) směrově potvrzena, těsně pod
konvenční hranicí významnosti. Kombinovaně napříč oběma koly (8
kategorie-kol na skupinu): established průměr 88,5 % winner stability,
young průměr 59,2 %, rozdíl +29,3pp, cluster-permutation p=0,052.
Po kolech zvlášť: kolo 1 established 90,3 % vs. young 57,2 % (p=0,264),
kolo 2 established 86,7 % vs. young 61,1 % (p=0,371) — jednotlivá kola
sama o sobě neprůkazná (malý vzorek, n=4 na skupinu), kombinovaný
výsledek na hraně.

Established kategorie byly skoro všechny na 100 % (wireless_earbuds/
Sony, drip_coffee_maker/Technivorm, laptop_backpack/Timbuk2), jedinou
výjimkou running_shoes (47–61 %, Nike vs. ASICS se přetahují). U young
kategorií to nebylo jednotné: smart_ring_sleep drželo 100 % (Oura
kategorii úplně ovládá, i když je "mladá"), zatímco creatine_gummies
(27–29 %, 4 různé značky napříč koly) a ai_wearable_pendant (36–53 %)
byly nejnestabilnější v celé studii.

**Závěr:** není to čistě "mladá kategorie = nestabilní". Je to spíš, jestli
i mladá kategorie už má jasného lídra (smart_ring_sleep/Oura ano,
creatine_gummies ne). Stáří kategorie koreluje se stabilitou, ale
mechanismus je přítomnost/nepřítomnost jasného vítěze, ne věk sám o
sobě — přímo v duchu Category Fit (#39) zjištění o moderátorech.

Zapsáno jako druhý addendum na `source-stability.html` a
`winner-stability-intents.html` (2026-09-24). Další krok: DM Lian Pham
s reálnými čísly (viz follow-up výše).

## Nový kandidát: Ghost Citation jako předstupeň Candidacy (2026-09-24)

Vzniklo z LinkedIn vlákna se Semrush (viz komunikace výše) a jejich
navazující studie "Why 62% of AI citations don't lead to brand mentions"
(Semrush + Kevin Indig, červen 2026, 3 981 pozorování napříč 115 prompty,
4 AI enginy, 14 zemí). Jejich klíčové číslo: 62 % citací je "ghost
citation" (Indigův termín), model použije stránku jako zdroj, ale nikdy
nezmíní jméno značky v textu odpovědi. Jen 13,2 % je citace + zmínka
zároveň, 25,1 % je zmínka bez citace.

Semrush a Indig měří jen citace vs. zmínka, k samotnému doporučení/
výběru (co měří celá naše série, Candidacy vs Selection #6, Brand
Legibility #29) se vůbec nedostávají. To je mezera přímo pod tím, co
sami už máte, ne duplicita.

**Otázka:** Je "ghost citation" (citovaný, ale nezmíněný) slabší
předstupeň candidacy než "plná zmínka" (citace + jméno)? Konkrétně: u
značek, co se v odpovědi objeví jen jako ghost citation, je
pravděpodobnost, že se objeví v shortlistu/candidacy setu na navazující
otázku (Volba kandidáta / Brand Legibility metodika), nižší než u
značek s plnou zmínkou? Pokud ano, je citace bez zmínky měřitelně
slabší signál než citace se zmínkou, ne jen jiná kategorie.

**Design:** recyklovatelná extrakce ze stejné rodiny jako Position
Stability, LLM extrakce (ghost citation vs. plná zmínka vs. jen zmínka
bez citace) nad existujícím `response_text` z otevřených
recommendation studií, co mají search zapnutý a citace zaznamenané
(Source Stability, Live Retrieval #28), zkřížit s tím, jestli se stejná
značka objevila v navazujícím forced-choice/candidacy testu na stejnou
kategorii. Případně nová fáze: cíleně injektovat "cited-only" vs.
"cited-and-named" kontext (rodina Fact Injection/Hidden Context) a
měřit rozdíl v selection rate přímo.

Status: zapsáno jako plnohodnotný kandidát ("cokoliv te napadne z toho
co jsem ti poslal udelat studii tak prosim do toho", Daniel 2026-09-24),
design nerozpracovaný, číslování nepřiřazeno.

## Ghost Citation — finální výsledek (2026-09-25)

Design se přerámoval oproti původnímu zápisu výše, viz
`research-prep/ghost-citation/STUDY-DESIGN.md` pro detail. Live
Retrieval (#28) nemohl posloužit jako druhý zdroj dat, jeho `citations`
pole je prázdné na všech 800 řádcích (zdokumentovaná limitace té
studie se ukázala jako reálný problém). Jediný zdroj dat je Source
Stability, oba kola (`judged_r1.json` + `judged_r2.json`), 160
search-enabled odpovědí napříč 8 kategoriemi spotřebního zboží, každá
s reálnými citacemi a už extrahovaným vítězem (`top_brand`).

Otázka se zúžila z "citace domény značky napříč webem → zmínka
značky" (Semrush měří tohle) na "citace uvnitř JEDNÉ odpovědi →
povýšení na jmenovaného kandidáta v TÉ samé odpovědi" (naše data na tu
první otázku nemají strukturu, spotřební kategorie s roundup citacemi,
ne B2B značky s vlastní doménou).

**Reálné výsledky** (160 volání, LLM extrakce na `judged_r1.json` +
`judged_r2.json`, 1 576 citací celkem):

Celkově: 49,9 % citací "named" (jasně vázaná na konkrétní jmenovaný
produkt v textu), 50,1 % "ghost" (citovaný zdroj bez jmenovaného
produktu, na který by šlo přiřadit). To je pozoruhodně blízko
Semrushovu číslu (62 % ghost citation), i když jde o jinou metodiku a
jinou definici "ghost" — u nás v rámci jedné odpovědi, u nich napříč
webem. Shoda řádu velikosti (přibližně polovina až dvě třetiny citací
nikdy nekonvertuje na jmenovanou zmínku) je sama o sobě zajímavá,
protože jde o nezávislé potvrzení stejného typu jevu na jiném datasetu
a jiné metodice.

Po kategoriích je docela rozptyl: headphones nejnižší ghost rate
(31,7 %), mechanical_keyboard nejvyšší (58,9 %), zbytek (air_fryer,
bluetooth_speaker, electric_toothbrush, gaming_mouse, meal_kit,
robot_vacuum) mezi 50-54 %. Žádný zjevný společný jmenovatel mezi
headphones a zbytkem kategorií na první pohled, stálo by za doplnění
v budoucnu.

**Sanity check na existující metodiku:** vítězná značka (`top_brand`,
už dřív extrahovaná pro Source Stability) je v 98,1 % případů (157/160)
klasifikovaná jako "named", jen 1,9 % (3/160) jako "ghost". To je
uklidňující potvrzení, že existující Source Stability judge pipeline
je spolehlivá — vítěz je téměř vždy skutečně jmenovaný, ne jen
ghost-citovaný. Těch 3 nesouhlasných případů stojí za ruční spot-check
před publikací, stejná mitigace jako u předchozích studií.

Popisně: průměr 9,85 citace na odpověď, 4,91 jmenovaných produktů na
odpověď, tedy v průměru 49,8 % toho, co model procitoval, se skutečně
povýší na jmenovaného kandidáta v dané odpovědi.

**Poctivá limitace (z designu, potvrzeno):** tohle je užší otázka než
původní Semrush srovnání, měří se konverze uvnitř jedné odpovědi, ne
citace domény značky napříč webem. Cross-reference s odděleným
candidacy/forced-choice testem na stejných kategoriích (Fáze 2 z
původního návrhu) se nekonala, žádný existující dataset nesdílí
kategorie/značky se Source Stability. Self-grading riziko: stejný
model dělal extrakci jako generoval odpovědi v části série.

Status: hotovo, reálná čísla k dispozici. Rozhodnutí o formě publikace
čeká na Daniela — nejpřirozenější místo je addendum na
`research/source-stability.html`, protože recykluje přesně tu samou
data (stejná role jako Category Maturity Stability addendum tamtéž).

## Nový kandidát: Query délka/struktura vs. selection rate (2026-09-24)

Vzniklo ze stejné Semrush/Indig studie. Jejich zjištění: krátké
konverzační dotazy dávají 30-50x víc brand mentions než dlouhé
strukturované dotazy (rozsah promptů 16-98 znaků, průměr ~60). Krátký
dotaz jako "Should I lease or buy a car for my business?" skoro vždy
zmíní značku, delší přeformulovaná verze stejné otázky skoro nikdy, i
když vyvolá víc citací.

Tohle je blízko naší vlastní Prompt Shape studii (#356), ale Indigovo
číslo (30-50x) je řádově dramatičtější než cokoliv, co jsme dosud
naměřili na fázi frázování/formulace. Otázka, jestli měří to samé, nebo
jestli je "délka/struktura dotazu" jiná proměnná než "frázování stejné
délky" (baseline/casual/formal/reversed/imperative), co testuje
Phrasing Stability by Signal (#41).

**Otázka:** Platí stejný dramatický rozdíl (krátký konverzační vs.
dlouhý strukturovaný dotaz na stejný záměr) i pro finální selection
rate/vítěze, ne jen pro to, jestli se značka vůbec zmíní? Nebo je efekt
specifický pro "zmínku" jako měkčí metriku a na tvrdší metrice
(vyhraje/prohraje) se ztrácí, podobně jako hedge language nekopíruje
skutečnou stabilitu výběru (Recommendation Confidence, Study #41)?

**Design:** recyklovatelná metodika ze stejné rodiny jako Prompt Shape/
Phrasing Stability, nová proměnná vedle existujících frázových
variant: pár dotazů na stejný záměr, jeden krátký/konverzační, jeden
dlouhý/strukturovaný, stejné kategorie a značky jako existující
kohorta, LLM judge na selection rate.

Status: zapsáno jako plnohodnotný kandidát ("cokoliv te napadne z toho
co jsem ti poslal udelat studii tak prosim do toho", Daniel 2026-09-24),
design nerozpracovaný, číslování nepřiřazeno.

## Nový kandidát: Personalizace přebíjí populační doporučení? (2026-09-25)

Vzniklo z LinkedIn postu Christiana Riche (Founding US GTM @ Azoma,
Agentic Commerce Optimization for CPG). Jeho tvrzení: viditelnost je
"vanity metric" v agentic commerce, protože jakmile hyper-personalizovaný
asistent (Meta Muse) vykonává nákup za konkrétního uživatele, na obecné
viditelnosti/share-of-voice nezáleží. Podle něj byl "agentic discovery"
(share of voice) jen dočasný předkrm, skutečný agentic commerce už běží,
a jediné, co má smysl měřit, je "agentic readiness framework" na úrovni
brandu (Azoma's 5C's), ne populační doporučovací rate.

Tohle je jiný, ostřejší claim než obvyklá SEO/citace-vs-mention debata,
kterou vyvracíte běžně (viz Semrush vlákno). Christian netvrdí, že
recommendation je lepší metrika než visibility, jako to říkáte vy,
tvrdí, že i recommendation měřená napříč populací (co model doporučí
"obecnému" uživateli na daný prompt, přesně metodika celé vaší série)
přestane platit, jakmile agent personalizuje výstup podle konkrétního
uživatele. To je přímá výzva metodickému základu celé série, ne jen
SEO crowd argumentu.

**Otázka:** Když se do promptu/systémového kontextu injektuje
uživatelsky specifický signál (historie nákupů, stated preference,
loajalita ke značce, cenová citlivost), flipne to vítěze silněji, než
to dělají dosavadní testované signály (rating, authority, familiarity,
specificita)? Pokud ano, podporuje to Christianovu tezi, že populační
recommendation rate je zastaralá metrika ve světě personalizovaných
agentů. Pokud vítěz zůstává překvapivě stabilní i s injektovaným
personalizačním kontextem, podobně jako drží stabilní přes Source/
Position Stability navzdory měnícím se zdrojům, je to naopak silný
protipříklad k jeho tezi.

**Design:** recyklovatelná injection mechanika ze stejné rodiny jako
Fact Injection (#25)/Hidden Context (#26)/Sponsored tag kandidát, nová
proměnná vedle rating/authority/familiarity/specificita/formát/sponsored:
"user persona context" (2-4 kontrastní persony na kategorii, např.
"loajální zákazník značky X" vs. "cenově citlivý nováček" vs. "eco-
conscious kupující"), stejné kategorie/značky jako existující kohorta,
LLM judge na selection rate, cluster-permutation test (jednotka =
kategorie). Otevřená limitace: injektovaná persona v promptu je pořád
simulace, ne skutečná agentní personalizace přes user memory/historii,
jak to dělá reálný Meta Muse, takže jde o test citlivosti na
personalizační signál, ne přímou repliku produkčního agenta.

Status: zapsáno jako plnohodnotný kandidát ("chci dat odpoved, ze my
se touto otazkou jiz zabirame... zapis to a at je to tam poradne",
Daniel 2026-09-25), design nerozpracovaný, číslování nepřiřazeno.

## Nový kandidát: Silent Candidacy Drop (2026-09-25)

Vzniklo z dev.to článku "The Bakery Paradox: Why Current AI Agents Keep
Walking Away From Your APIs" (MCP/agentic tooling autor, bez konkrétního
jména). Jádro článku: dnešní MCP servery vystavují statický seznam
nástrojů (příklad autora: pekárna s tabulí menu). Když AI agent chce
něco, co se přesně neshoduje se žádným nadefinovaným schématem (dort
s méně cukrem a extra kakaem), agent to nezkusí vyjednat, prostě potichu
odejde. Firma transakci ztratí a nedostane žádný signál proč. Autor to
nazývá "zero demand signal" problém a navrhuje řešení: dynamic capability
negotiation (`request_capability`), kdy agent pošle serveru, co přesně
potřebuje a proč, a server na místě vytvoří dočasné schéma nástroje.

Tohle je stejný jev, který už částečně měříme, jen na jiné vrstvě a bez
tohoto rámce. Study #32 (PDP Specificity) ukázal, že konkrétní vs vágní
detaily na product page mění, jestli model značku vůbec vybere. Tenhle
článek dává tomu jevu ostřejší formulaci: nejde jen o to, že model
"vybírá méně" u vágních stránek, model se u konkrétního, zúženého
požadavku uživatele (cenový strop, dietní omezení, konkrétní varianta)
může značky potichu vzdát úplně, přestože by značka na obecnější verzi
stejného promptu byla kandidátem. To je přesně ten typ ztráty, kterou
firma nevidí a nemá jak se o ní dozvědět.

**Otázka:** Když se do promptu přidá konkrétní, zužující omezení (cena,
dietní/technické omezení, specifická varianta produktu), roste míra, s
jakou model značku úplně vynechá ze zvažovaných kandidátů (na rozdíl od
toho, že ji zvažuje a nevybere), a mění se tahle míra podle toho, jestli
possessed_facts/product page obsahují strukturovaná data k té konkrétní
variantě, nebo ne? Jinými slovy: bere v agentic kontextu (schopnost
negociovat, ne jen doporučit) strukturovanost dat ještě větší roli než
ve stávajících studiích specificity a markupu?

**Design:** recyklovatelná metodika, dvě vrstvy vedle sebe: (1) rozšíření
possession-vs-deployment mechaniky o "narrow constraint" prompty (např.
"pod $40, bez [alergen/materiál]" vs. obecný "doporuč mi X"), měření
jestli je brand vůbec zmíněn (candidacy) ne jen jestli vyhraje
(selection); (2) k tomu párové porovnání brandů se strukturovanými
product-page daty k dané konkrétní variantě (recyklace metodiky Study
#38 Structured Markup) vs. brandů, které mají jen obecné possessed
facts bez variant. Cluster-permutation test, jednotka = kategorie.
Otevřená limitace: bez skutečného MCP/tool-calling prostředí jde o
simulaci "silent walk-away" přes chat completion rozhraní (žádná
odmítnutá tool-call, jen chybějící zmínka), ne přímou repliku
agentního tool-selection chování popsaného v článku.

Status: zapsáno jako plnohodnotný kandidát ("ano, urcite", Daniel
2026-09-25), design nerozpracovaný, číslování nepřiřazeno. Souvisí s
už čekajícím kandidátem "Machine-readable depth by business model"
(#341/roadmapa 2026-09-21) — tenhle článek mu dává konkrétnější
zdůvodnění a časování (agentic commerce/MCP nabírá na síle právě teď).

## Fragile vs. Resilient Candidacy — Fáze 2, finální výsledek (2026-09-25)

Daniel spustil naostro (`t4run`, `t4judge`, `analyze_results.py`),
8 brandů x 2 framingy x 8 běhů, 128 čtyřtahových konverzací + 128 judge
volání.

**Primární hypotéza (z Fáze 1): NEPOTVRZENO.** Rozdíl generalist minus
specialist framing napříč 8 brandy je +1.6pp v průměru, paired t-test
t=+0.314, p=0.7627 — naprosto neprůkazné, čistý šum. 4 z 8 brandů měly
vyšší přežití při generalist framingu, 2 při specialist, 2 remíza.
Kausální test tedy nepotvrdil, že by "generalista vs specialista"
jazykový rámec sám o sobě byl pákou, která rozhoduje o T4 survival.
Pozorovaná korelace z Fáze 0/1 (brandy popisované jako "comprehensive/
versatile" přežívaly víc než brandy popisované jako úzcí specialisté)
se jako přímá kauzalita nepotvrdila — když se ten samý jazykový rámec
injektuje uměle, směr framingu na výsledek prakticky nemá vliv.

**Vedlejší, nečekaný a mnohem silnější nález:** obě podmínky (generalist
i specialist) systematicky zvedly T4 survival oproti přirozenému
baseline (bez injekce) u téměř všech brandů, a to zhruba stejně silně:

| brand | natural | generalist | specialist |
|---|---|---|---|
| Olly | 0% | 25% | 50% |
| Cotopaxi | 0% | 0% | 12.5% |
| Beam | 0% | 75% | 62.5% |
| Ridge | 10% | 37.5% | 25% |
| Kopari | 50% | 87.5% | 87.5% |
| Onyx Coffee Lab | 50% | 87.5% | 75% |
| Bellroy | 100% | 100% | 100% |
| Peak Design | 100% | 100% | 87.5% |

Průměrný lift oproti natural baseline: generalist +25.3pp, specialist
+23.75pp — prakticky identický lift bez ohledu na směr framingu. Jinými
slovy, nezáleží na tom, JAK je brand v system message popsaný
(all-rounder vs specialista), záleží na tom, že je popsaný vůbec, nějakým
sebejistým "for context: X je široce uznávaný jako..." tvrzením. To je
svým tvarem blízké Authority Signal (#34) a Fact Injection (#25) nálezům
(jedna nezávislá/autoritativní zmínka mimo vlastní stránky brandu silně
posouvá výsledek), jen aplikované na framing/positioning claim, ne na
konkrétní faktický claim.

**Poctivá limitace:** natural baseline pochází z jiného sběru dat
(wave2-survival-scaleup, jiný běh/datum/teplotní draw), takže srovnání
injected vs natural není čistě párové v rámci jedné session — část
rozdílu může být šum mezi různými běhy, ne čistě efekt injekce. Velikost
posunu u několika brandů (Olly 0%→50%, Beam 0%→75%) je ale příliš velká
na to, aby šlo jen o šum, takže je to reálný, byť ne dokonale
kontrolovaný signál.

**Závěr a uzavření kandidáta:** Fragile vs. Resilient Candidacy jako
původně formulovaná hypotéza (generalist framing = páka na přežití) je
uzavřená s poctivým nulovým výsledkem — nepotvrdila se. Zároveň fáze 2
odhalila jiný, silnější a užitečnější nález (jakákoli sebejistá
kontextová "endorsement" injekce zvedá přežití bez ohledu na směr), který
zapadá do stejné rodiny jako Authority Signal/Fact Injection, ale
testovaný přes framing/positioning claim místo faktického tvrzení. Tenhle
vedlejší nález stojí za zvážení jako samostatný budoucí kandidát
("Framing Injection jako obecný lift, ne směrový lever") s pořádnou
kontrolní podmínkou (stejná session, no-injection arm vedle obou
framingů, ne separátní dataset), pokud o něj bude zájem.

Status: Fáze 0-2 hotové, kandidát uzavřen (Daniel: "ano, pojdme to
dodelat at to z te road mapy mizi", 2026-09-25). Rozhodnutí o veřejné
stránce/publikaci čeká na Daniela — jde o poctivý nulový výsledek u
původní hypotézy plus zajímavý vedlejší nález, ne o čistou pozitivní
studii k publikaci beze změny rámce.

## Nový kandidát: Recommendation vs. Commitment (uzavírá Purchase, fáze 9) (2026-09-28)

Vzniklo z LinkedIn postu Juozase Kaziukėnase (Marketplace Pulse, stejný
autor jako Sponsored Tag Penalty kandidát) o Instinct, osobním AI
nákupním agentovi. Klíčová čísla z postu (zdroj: rozhovor s Noah Shinnem,
CEO Instinct, na podcastu Invest Like the Best): Instinct už zprostředkoval
**1 miliardu dolarů** v agentic commerce transakčním objemu, **50 %**
z toho je cestování, a **do 3 týdnů používání má 40 % uživatelů**
sdílenou osobní kreditku s agentem. Kaziukėnas glosuje, že Meta Muse
(zdarma distribuce miliardám uživatelů, podle něj lepší produkt) tohle
číslo pravděpodobně vynásobí 10×, a že OpenAI prý taky pracuje na
vlastním personal agentovi.

**Proč to není jen zajímavá zpráva, ale skutečná mezera v naší vlastní
roadmapě:** Purchase je fáze 9 z 9 v `how-ai-decides` decision path a
jediná **úplně otevřená, nula studií**, viz "Pokrytí decision path" výše.
Poznámka u ní z 2026-08-27 řekla doslova, že čeká na dostupnost agentic
commerce dat, protože "zatím nemáme snadný způsob měření." Tenhle post
je konkrétní, čerstvý důkaz, že agenti už reálně dokončují nákupy v
miliardovém měřítku, ne jen v laboratorních testech — což znamená, že
otázka "říká AI jméno brandu" vs. "AI ten brand reálně koupí" teď jde
otestovat i naší vlastní metodikou, bez čekání na Instinct/Muse data.

**Otázka:** Když se dá modelu k dispozici skutečná akce (tool call na
"koupit"/"objednat"), ne jen prostor napsat textovou odpověď, shoduje se
brand, který model *pojmenuje* jako doporučení, s brandem, který si
model *vybere*, když musí závazně zavolat nástroj a dokončit transakci?
Je "říct" a "udělat" stejná věc, nebo se rozcházejí — stejně jako se
rozcházela candidacy a selection (Candidacy vs Selection), possession a
deployment (Possession vs Deployment #23), citace a jmenovaná zmínka
(Ghost Citation)? Tohle je poslední, dosud netestovaný krok v tom samém
vzorci, co běží celou sérií: verbální výstup modelu často neodpovídá
tomu, co model se stejnou informací skutečně udělá, když má k dispozici
akci místo věty.

**Design:** recyklovaná forced two-way metodika (stejná 4-brand kohorta
z `winner-vs-loser/brands.json`, stejný `vague_claim`, stejní
konkurenti, 20 intentů), dvě paralelní podmínky na STEJNÉM promptu a
STEJNÉM systémovém kontextu, jediný rozdíl je nástroj, co má model
k dispozici:

- **text_only** (baseline, recyklovatelné z existujících studií nebo
  levně dorunuto) — model odpoví na "Between {a} and {b}, which is the
  better choice for {intent}?" volným textem, jako celá dosavadní série.
- **tool_commit** (nové) — model dostane přesně dva nástroje,
  `purchase(brand="{a}")` a `purchase(brand="{b}")`, se systémovou
  instrukcí, že musí zavolat přesně jeden, žádná textová odpověď se
  nepočítá. Měří se, které jméno je předané jako argument.

Srovnání: shoda/neshoda mezi tím, co `text_only` pojmenuje jako vítěze a
co `tool_commit` reálně "koupí" pro STEJNOU dvojici brand/intent/run
(párované srovnání, ne jen dva nezávislé cluster means). Hlavní
statistika: **commitment flip rate** — v kolika % párů se tool-call
volba liší od textové volby.

**Sample size:** 4 brandy × 20 intentů × 5 opakování × 2 podmínky = 800
volání, žádný samostatný judge krok potřeba pro `tool_commit` větev
(argument nástroje je strukturovaná odpověď, ne text k soudcování) —
jen `text_only` větev potřebuje `WINNER_JUDGE_SYSTEM` jako obvykle.
Levnější než většina studií v sérii.

**Limitace (disclosed předem):**
1. **Simulovaný tool-calling, ne reálná agentic commerce infrastruktura**
   (žádné skutečné platby, žádné reálné API objednávek) — testuje, jestli
   samotná přítomnost závazné akce mění výběr modelu, ne přímou repliku
   Instinct/Muse pipeline.
2. **4 brandy, malý vzorek**, stejná kohorta jako celá tahle rodina studií.
3. **Binární "musí vybrat jeden" force** může sám o sobě změnit chování
   (demand characteristics nutit rozhodnutí), ne čistě izolovat efekt
   "akce vs. text" — pre-registered jako otevřená limitace, ne skrytá.
4. Nezachytává druhý zajímavý bod z postu (že se chování uživatele mění
   v čase/po týdnech používání) — to je otázka o lidech, ne o modelu,
   mimo rozsah naší metodiky.

**Proč tohle uzavřít jako prioritu:** je to jediná fáze z 9 v decision
path, co má dnes nula studií, návrh nevyžaduje nové API klíče ani čekání
na Founder Lab, a přímo navazuje na stejný "řekne vs. udělá" vzorec, co
je nosným zjištěním prakticky celé série (Ghost Citation, Possession vs
Deployment, Candidacy vs Selection).

Status: zapsáno jako plnohodnotný kandidát ("urcite to zapis do road
mapy... se vsemi detaily", Daniel 2026-09-28), design nerozpracovaný do
`STUDY-DESIGN.md`/`run_study.py` (jen popsaný zde), číslování
nepřiřazeno, čeká na zařazení do pořadí a schválení stavby.

## Provozní: bot scraping na `/webhook/get-store`, zablokováno (2026-09-30)

Daniel si všiml, že n8n workflow "AI Readiness — Get Store" (endpoint
za "Get My Free AI Score" scan boxem na webu) běží podezřele často,
víc exekucí za minutu, než by odpovídalo reálnému lidskému provozu.

**Zjištění:** opakující se automatizovaný scraping, ne reální
uživatelé. Dva jasné signály v hlavičkách požadavků:

- `user-agent: "node"` — doslova defaultní User-Agent Node.js
  fetch/http klienta, žádný prohlížeč tohle neposílá.
- Druhá varianta požadavku předstírala prohlížeč, ale hlásila
  `Chrome/153.0.0.0` — verze, co v září 2026 reálně neexistuje,
  typický spoofnutý User-Agent.

Requesty přicházely z AWS IP rozsahů (`44.220.244.188`,
`3.238.65.191`, měnící se), systematicky procházely různé domény
(`flojak.com`, `godsword.org`, `hairtamin.com`...) přes GET dotaz na
`?domain=`. Workflow dělá jen `SELECT` proti tabulce
`ai_readiness_scans` (žádné nové skórování, žádné volání AI modelu),
ale pokud doména v DB existovala, endpoint vracel **celý uložený
záznam** (total_score, všechny dílčí skóre, `main_leak`, `quick_fix`
atd.) jako čistý JSON. Potvrzeno přímo v exekuci: `hairtamin.com`
dostal 200 a reálná data ještě před opravou. Jde tedy o exfiltraci
už naměřených, proprietárních dat po doménách, ne o náklad za výpočet.

**Oprava:** do workflow přidány dva nové nody mezi "Webhook GET" a
"Extract Domain":

- **Detect Bot** (Code node) — označí request jako `isBot: true`,
  pokud `user-agent` je `"node"`, prázdný, nebo IP je na seznamu
  (`44.220.244.188` zatím jediná pevně blokovaná).
- **Block Bot?** (IF node) — `isBot === true` → nový **Respond 403**
  node (žádný DB dotaz, žádná data ven), jinak pokračuje beze změny
  do "Extract Domain" → "Fetch from DB" → "Found?" → 200/404.

Upravený workflow (`AI Readiness — Get Store (bot-blocked).json`)
naimportován Danielem, potvrzeno v produkci: stejný bot, jiná AWS IP
(`3.238.65.191`), doména `hairtamin.com` → `isBot: true` → 403,
žádná data neunikla. Bot dál zkouší (IP se střídá), ale je teď
zablokovaný na úrovni user-agentu, což je stabilnější signál než
jedna konkrétní IP.

**Otevřené a nedořešené:**

1. Nevíme, jak dlouho scraping běžel před odhalením ani kolik domén
   stihl přes 200 odpovědi stáhnout, Daniel se rozhodl to cíleně
   nezjišťovat ("ani radeji nechci vedet jak dlouho to dela").
2. Ochrana je zatím jen na tomhle jednom webhooku
   (`/webhook/get-store`). Žádná systematická kontrola napříč
   ostatními veřejnými n8n webhooky (scan trigger, site-stats-sync,
   ai-signal apod.) zatím neproběhla.
3. Obrana je založená na jednoduchých signálech (user-agent string,
   pevný seznam IP). Sofistikovanější bot s reálným prohlížečovým
   fingerprintem (validní Chrome verze, plné `sec-ch-ua` hlavičky,
   rotující reziduální/residential IP) by tudy prošel beze změny.
4. Volitelně navržené, zatím nepostavené: logovací větev (Sheets/
   Slack) pro zablokované pokusy, aby šlo sledovat objem/frekvenci
   scrapingu v čase bez nutnosti procházet n8n exekuce ručně, Daniel
   zatím řekl "zatím to takto nechame" (2026-09-30).

**Návrh dalšího kroku (nový úkol, ne prioritizovaný):** provést
stejný audit user-agent/IP signálů napříč všemi veřejně dostupnými
webhooky (ne jen get-store), a zvážit plošnější ochranu (rate limiting
podle IP/ASN, případně jednoduchý token/nonce z frontendu místo
otevřeného GET), aby se nemuselo řešit každý endpoint jednotlivě a
zvlášť pokaždé, když se najde nový scraping pattern.

## Nový kandidát: Copy Relevance × Site/Page Relevance (interakce) (2026-09-30)

Vzniklo z LinkedIn diskuze pod Query-Conditional Defense (#44) s
Mansoorem Ali. Náš komentář vysvětlil, že 95,2 % vs. 74,2 % izoluje
výhradně **query-to-copy relevance** (popis sponsorovaného listingu
echuje přesný search term), zatímco web/stránka/kontext zdroje byly
schválně drženy konstantní. Mansoor na to navázal přesnou otázkou:
"whether that relevance comes from the site, the specific page, the
query, or the relationship between all three" a pak, po vysvětlení,
ještě ostřeji: jestli se efekt copy relevance replikuje i tehdy, když
je samotný zdroj (web/stránka) už sám o sobě vysoce relevantní k
dotazu, tedy jestli jde o **nezávislé, sčítající se signály**, nebo
jestli jeden z nich **dominuje** a druhý se stává irelevantním.

**Odkud to je a proč je to skutečná mezera:** Query-Conditional
Defense (#44) testovala jen jednu proměnnou (copy relevance) na jednom
fixním, generickém zdroji. Nikdy jsme netestovali, co se stane, když
se zdroj samotný stane proměnnou vedle copy relevance, jestli se
efekty kombinují aditivně, nebo jde o interakci, kde jeden signál
překryje druhý (podobný vzorec interakce, jaký Signal Hierarchy #16
našla mezi authority/familiarity/specificity, jen aplikovaný na
tenhle konkrétní pár proměnných poprvé).

**Otázka:** Mění se velikost efektu copy relevance (query-matched vs.
static popis) podle toho, jestli je zdroj/stránka, ze kterého model
čerpá, sama o sobě vysoce relevantní k dotazu, nebo generická? Jde o
dva nezávislé, sčítající se signály, nebo jeden dominuje?

**Design — 2×2, reuse dvou už existujících podmínek:**

1. generický zdroj × statický popis — **reuse** ze Sponsored Tag
   Penalty (#43), 0 nových volání
2. generický zdroj × query-matched popis — **reuse** z
   Query-Conditional Defense (#44), 0 nových volání
3. vysoce relevantní zdroj (stránka/kontext tematicky přesně sedící
   k dotazu) × statický popis — **nová podmínka**
4. vysoce relevantní zdroj × query-matched popis — **nová podmínka**

Stejná 4-brand kohorta (Colored Organics, BodyArtForms, Barbaro Mojo,
Hearthloom), stejných 20 reálných buyer intentů, stejný
`WINNER_JUDGE_SYSTEM` judge prompt beze změny, forced two-way
srovnání.

**Statistika:** hlavní porovnání 2×2 (main effect copy relevance,
main effect site/page relevance, a interakční term mezi nimi).
Analogicky k Signal Hierarchy, primární otázka je, jestli je součet
samostatných efektů (1→2 a 1→3) blízký kombinovanému efektu (1→4),
nebo jestli 4. podmínka saturuje pod tímhle součtem (jeden signál
dominuje) nebo ho naopak přestřelí (super-aditivní efekt, podobný
tomu, co #44 samo našlo vs. organický baseline).

**Sample size:** jen 2 nové podmínky (3 a 4) potřebují nová data,
4 brandy × 20 intentů × 5 opakování × 2 podmínky = **800 nových chat
volání + 800 nových judge volání = 1 600 nových volání celkem**,
podmínky 1 a 2 se recyklují beze změny ze stávajících `judged.json`
souborů (stejná konvence jako celá tahle rodina studií).

**Limitace (disclosed předem):**
1. 4 brandy, malý vzorek, stejná kohorta jako celá série.
2. "Vysoce relevantní zdroj" je definovaný přes system-prompt popis,
   ne přes reálný web/live retrieval, stejné omezení jako #43/#44.
3. Jen 2×2 (4 podmínky) — nezachycuje spojitou škálu "jak relevantní
   je zdroj", jen binární kontrast generický/vysoce relevantní.
4. Podmínky 1 a 2 pocházejí z jiných původních běhů (#43 a #44), ne
   ze stejné jedné session jako nové podmínky 3 a 4, stejné omezení,
   jaké už #44 samo přiznává u své static-sponsored podmínky.

Status: zapsáno jako plnohodnotný kandidát ("jo, zapis to do road
mapy", Daniel 2026-09-30), design nerozpracovaný do
`STUDY-DESIGN.md`/`run_study.py` (jen popsaný zde), číslování
nepřiřazeno, čeká na zařazení do pořadí a schválení stavby.

## Nový kandidát: Vlastní nákupní AI agent pro Founder Lab (2026-09-30)

Podnět: Daniel četl dev.to článek o stavbě prvního AI agenta přes AWS
Bedrock AgentCore (zákaznický support agent s order trackingem,
refundy, Knowledge Base, memory, code interpreterem a browser
toolem) a zeptal se, jestli by něco podobného dávalo smysl pro Atom
Foundry. Po rozboru padlo, že přímá replikace (order tracking/
refundy/loyalty) nesedí — Atom Foundry nemá checkout ani cart
("not a storefront, no checkout or cart", viz `llms.txt` capabilities
endpoint) — ale Daniel navrhl vlastní, jinou verzi: **vlastní nákupní
AI agent, co skutečně prochází a nakupuje, ne jen odpovídá na
prompty.**

**Účel (Daniel, 2026-09-30):** primárně Founder Lab. Místo čekání na
dávkové API volání přes `run_study.py`/gpt-4o batch scripty po každé
změně na kontrolovaném obchodě, agent by běžel průběžně proti
Founder Labu a dal rychlou zpětnou vazbu hned po zásahu (schema
markup, recenze, cena, cokoli se mění v RCT sérii). Až budou z
Founder Labu reálná data / ověřený vzorec, stejný agent by se
nasadil i na jiné eshopy a značky mimo Founder Lab — potenciální
posun směrem k produktu blízkému AI Agent Snapshot, jen měřícímu
agentic shopping chování (browsing, porovnávání, rozhodování), ne jen
frekvenci doporučení ve statickém chatu.

**Proč je to jiná osa měření, ne duplicita existující práce:**
všechny dosavadní studie v sérii (#19-#26 a dál) jsou statický chat
completion — jeden prompt, jedna odpověď, žádné víckrokové
prohlížení ani tool use. Vlastní nakupující agent, co fakticky
prochází Founder Lab jako by nakupoval (hledá, porovnává, rozhoduje
se za běhu), je nová osa, kterou zatím nikdo z téhle série netestoval
— blízké tomu, o čem psal Richard Crone (agentic commerce, agent
jako "wallet") i Stuart Forrest (OpenAI vlastní index/crawler) v
LinkedIn diskuzích, které Daniel řešil paralelně tentýž den.

**Klíčová metodologická past, na kterou je potřeba dát pozor:**
vlastní agent není totéž co ChatGPT Shopping, Perplexity nebo
Gemini — je to jeden konkrétní model + vlastní tool-calling logika.
Jako rychlý interní dev signál ("změnila se rozhodovací tendence
agenta po tomhle zásahu") je to v pořádku. Prezentovat jeho výstupy
jako "takhle se chová AI" bez ověření proti reálným modelům by ale
byla přesně ta chyba, kterou Atom Foundry jinde kritizuje (assumed
vs. measured — viz sekce "SEO Ranking Factors vs AI Recommendation
Factors" výše). Řešení, levné a v souladu se stávající metodologií:
periodicky stejný test pustit i přes skutečné gpt-4o/Claude/
Perplexity a měřit korelaci mezi verdiktem vlastního agenta a
verdiktem reálných modelů — kalibrace, ne jen vlastní bublina.

**Technický přístup — levně, ale ať dělá co je potřeba (Daniel,
2026-09-30):** ne AWS AgentCore/Bedrock/Lambda/IAM stack z článku —
navržený pro enterprise ecommerce support, těžká infrastruktura na
velikost, co Atom Foundry nepotřebuje. Místo toho lehčí stack nad
existující infrastrukturou (n8n + Postgres + OpenAI API, stejně jako
zbytek research pipeline):

- **Reasoning model:** gpt-4o nebo Claude s tool-use/function
  calling, stejný vzorec jako Volba kandidáta/Cold start/Fact
  Injection atd. — žádný nový vendor lock-in.
- **Browser tool:** headless browser (Playwright/Puppeteer) napojený
  jako n8n Code node nebo jednoduchá HTTP tool layer, ne AgentCore
  Browser Tool ani Bedrock Gateway.
- **Cíl akce agenta:** na Founder Lab obchodě projít nákupní
  rozhodování end-to-end (najít produkt, porovnat možnosti, vybrat,
  zdůvodnit) a zalogovat výsledek strukturovaně (Postgres, stejná
  tabulka-styl jako `ai_readiness_scans`), aby šlo před/po srovnání
  dělat stejným způsobem jako u ostatních RCT studií v sérii.
- **Memory/Knowledge Base:** nepotřeba v prvním kroku — Founder Lab
  je jeden kontrolovaný obchod, ne multi-tenant support systém jako v
  článku. Případně relevantní až ve fázi "nasadit na jiné eshopy",
  kde by se hodila znalostní báze o tom, co už se na které značce
  testovalo.

**Navazuje na:** Founder Lab field test (Study #31, poslední bod v
odsouhlaseném pořadí z 2026-09-16) — tenhle agent je infrastruktura,
která Study #31 dělá rychlejší a levnější k iteraci, ne samostatná
paralelní studie. Dává smysl stavět těsně před/současně s tím, jak se
Founder Lab RCT rozjíždí, ne jako samostatný předřazený projekt.

**Limitace (disclosed předem, stejná disciplína jako zbytek série):**
1. Vlastní agent = proxy, ne ground truth pro chování reálných AI
   shopping asistentů, dokud není kalibrovaný proti nim (viz past
   výše).
2. Agentic/browsing chování se může lišit model od modelu stejně
   jako se liší static recommendation chování (Study #28 cross-
   platform retrieval už tohle naznačila u jiné osy) — jedna
   reasoning-model volba nebude reprezentovat celou kategorii.
3. Browser automation na živém, měnícím se Founder Lab obchodě je
   křehčí než uzavřené chat-completion studie — potřeba počítat s
   údržbou (změny DOM, layoutu) jinak, než u čistě textových studií.

Status: zapsáno jako plnohodnotný kandidát ("necham si tebou
doporucit... zapis to prosim do roadmapy", Daniel 2026-09-30), design
nerozpracovaný do `STUDY-DESIGN.md`/kódu, čeká na zařazení do pořadí
(navrhovaně: těsně před/se startem Study #31 Founder Lab field test).

## Zjištění: atomfoundry.dev má 35,6 tis. neindexovaných stránek v GSC, dominantní příčina je kvalita, ne crawl frekvence (2026-10-01)

Podnět: Daniel narazil na LinkedIn post Cyruse Shepharda sdílející
studii Adama Genta ("The 190-Day Indexing Rule", Indexing Insight,
1,4M URL/18 webů) — pokud Googlebot stránku nekrawluje ~130-190 dní,
roste šance, že ji Google vyřadí z indexu nebo ji "zapomene" úplně
(URL is unknown to Google). Daniel se zeptal, jestli tohle ohrožuje
atomfoundry.dev. Prošli jsme to společně přímo v Google Search
Console účtu pro `atomfoundry.dev`.

**Strukturální kontext (zjištěno z repa před nahlédnutím do GSC):**
`sitemap-pages.xml` obsahuje 2 680 URL, z toho 2 516 (94 %) jsou
jednotlivé store detail stránky (`/store/{domain}`) — web je
dominantně programmatic SEO na velkém počtu podobně strukturovaných,
nízko-aktualizovaných stránek. Přesně tenhle typ obsahu je
nejnáchylnější k problémům popsaným v tom postu.

**Reálná data z GSC (Přehled, stav k 21.09.26):**
- **31 798 indexovaných stránek vs. 35 579 (zaokrouhleno 35,6 tis.)
  neindexovaných** — víc než polovina celkového počtu URL, které
  Google o webu ví, není v indexu.
- **Statistiky procházení (Nastavení → Statistiky procházení), okno
  cca 03.07.–21.09.26:** 84,4 tis. celkových požadavků o procházení,
  1,47 mld. stažených dat, průměrná doba odezvy 120 ms. Graf ukazuje
  dvě výrazné špičky (~9 tis. požadavků/den) v polovině a na konci
  července — pravděpodobně vlna objevování po submitnutí sitemapy s
  tisíci store stránkami — a pak pád crawl aktivity prakticky na
  nulu od začátku srpna, s drobným oživením začátkem září.
- **Podle účelu: 90 % požadavků je "Nalezení" (objevování nových
  URL), jen 10 % je "Aktualizace" (re-crawl už známých stránek).**
  Google tedy drtivě upřednostňuje hledání nového obsahu před
  ověřováním, jestli starý obsah pořád platí/je relevantní.
- Podle typu Googlebota: 99 % Chytrý telefon. Podle odpovědi: 100 %
  OK (200), žádné technické problémy se serverem (stav hostitelského
  serveru: bez problémů za posledních 90 dní).

**Rozpad "Proč stránky nejsou indexovány" (Indexování → Stránky,
poslední aktualizace 21.09.26, 10 důvodů celkem):**

| Důvod | Zdroj | Stránky |
|---|---|---|
| Procházeno – momentálně neindexováno | Systémy Google | **31 529** |
| Objeveno – momentálně neindexováno | Systémy Google | 3 545 |
| Falešné 404 | Web | 252 |
| Blokováno souborem robots.txt | Web | 109 |
| Duplicitní stránka bez kanonické verze vybrané uživatelem | Web | 77 |
| Vyloučeno značkou noindex | Web | 25 |
| Nenalezeno (404) | Web | 23 |
| Alternativní stránka se správnou značkou kanonické stránky | Web | 12 |
| Duplicitní stránka, Google zvolil jinou kanonickou stránku | Systémy Google | 6 |
| Stránka s přesměrováním | Web | 1 |

**Klíčový závěr, ověřený proti hypotéze z LinkedIn postu:** drtivá
většina (31 529 z 35,6 tis., ~89 %) spadá do kategorie "Procházeno –
momentálně neindexováno" — tedy Google stránku **navštívil,
vyhodnotil, a aktivně se rozhodl ji nezařadit do indexu.** To je
**kvalitativní rozhodnutí, ne důsledek nedostatečné crawl
frekvence.** Mechanismus z postu (stránka byla dřív indexovaná,
přestala se crawlovat, Google ji po 130-190 dnech "zapomněl") by se
projevil hlavně v kategorii "Objeveno – momentálně neindexováno"
(capacity/crawl-budget problém) — ta je ale desetkrát menší (3 545).
Takže hypotéza "ohrožuje nás 190denní pravidlo" se **nepotvrdila
jako hlavní příčina** — reálný problém je jiný, i když příbuzný:
**scale/thin-content problém typický pro programmatic SEO.** Při
tisících podobně strukturovaných store stránek Google usuzuje, že
velká část nepřináší dost unikátní hodnotu na zařazení do indexu,
nezávisle na tom, jak často by je crawloval znovu.

**Podpůrný signál pro stejný závěr:** 90/10 poměr Nalezení/Aktualizace
v crawl statistikách znamená, že Google tráví drtivou většinu crawl
kapacity objevováním nových URL, ne re-crawlováním starých — což by
samo o sobě bylo rizikové pro 190denní scénář, ale protože dominantní
down-stream příčina je "Procházeno – momentálně neindexováno" (ne
"nedostatečně crawlováno"), ukazuje to, že Google kapacitu na
re-crawl/re-evaluaci těchto stránek má a využívá ji, jen se
rozhoduje proti indexaci.

**Doporučení (zapsáno, nerealizováno):**
1. Zvýšit vnímanou jedinečnost jednotlivých store stránek (víc
   unikátního textu/kontextu na stránku, ne jen číselné skóre a
   faktorový rozpad ve stejné šabloně).
2. Silnější interní prolinkování z vysoko-hodnotných stránek
   (homepage, research, benchmarks) na nejslabší/nejméně navštěvované
   store stránky.
3. Zvážit konsolidaci nebo noindex u nejslabších/nejméně
   hodnotných store stránek místo snahy mít indexovaných všech 60k+
   — běžný kompromis u programmatic SEO na téhle škále.
4. Následný krok k ověření: rozkliknout kategorii "Procházeno –
   momentálně neindexováno" v GSC a zjistit, jestli jde primárně o
   store stránky (očekávaný/potvrzující výsledek), nebo je mezi nimi
   signifikantní podíl jiného typu obsahu (neočekávaný, vyžadoval by
   zvláštní vyšetření).

Status: zjištění zapsáno, doporučení nerealizovaná, čeká na
rozhodnutí o prioritě vůči zbytku roadmapy.

## Nový kandidát: SKU-level lock-in vs. brand-level lock-in (2026-10-01)

Podnět: LinkedIn diskuze pod postem Zhao Hanbo o 11denním poločasu
rozpadu AI citací (Profound, 883k stránek). Napsali jsme komentář
porovnávající jeho číslo s naším Recommendation Lock-in zjištěním
(86% stabilita #1 brandu přes 6 sweepů za 2 měsíce) — vysvětlili jsme
rozdíl tím, že on měří rozpad jednotlivé citované stránky, my měříme
stabilitu toho, která **značka** vyhrává celkově, a obojí může platit
zároveň (podkladové stránky/citace rotují, zatímco úsudek modelu "kdo
je nejlepší v kategorii" zůstává stabilní, protože se opírá víc o
vlastní minulý vzorec modelu než o čerstvost jedné stránky). Zhao
Hanbo na to reagoval a položil přesnou, dosud nezodpovězenou otázku:
**"Curious whether you see the same stability at the product/SKU
level, or mainly at the brand level?"**

**Proč je to reálná mezera:** Recommendation Lock-in (Two Months
Later) měřila stabilitu výhradně na úrovni **značky** (#1 brand napříč
50 nákupními intenty, 6 sweepů). Nikdy jsme netestovali, jestli stejná
stabilita platí i na úrovni konkrétního **produktu/SKU** uvnitř té
značky. Odpověděli jsme mu upřímně, že nemáme data, jen odhad
("SKU-level stability bude pravděpodobně nižší, protože konkrétní
produkt lze vyměnit za novější model nebo lépe hodnocenou alternativu
od stejné značky, aniž by se pohnula celková pozice značky") —
otestovat to je logický další krok.

**Otázka:** Je stabilita doporučení (lock-in) na úrovni jednotlivého
produktu/SKU stejně silná jako na úrovni značky, nebo je nižší —
tedy mění model doporučený konkrétní produkt častěji, než mění
doporučenou značku jako celek?

**Hypotéza (předregistrovaná zde, před sběrem dat):** SKU-level
lock-in < brand-level lock-in. Důvod: v rámci jedné značky existuje
víc blízkých substitutů (různé modely/varianty), které můžou mezi
sebou soutěžit a měnit pořadí, aniž by to ovlivnilo, jestli značka
jako celek zůstává #1 volbou kategorie.

**Navržený design — reuse infrastruktury Two Months Later/Recommendation
Lock-in:** stejných 50 nákupních intentů, stejný mechanismus 6
nezávislých sweepů přes delší časové okno (replikovat ~2 měsíce), ale
tentokrát zaznamenávat nejen doporučenou **značku**, ale i konkrétní
**doporučený produkt/model/SKU** v odpovědi (tam, kde ho model
jmenuje). Srovnat: (a) % shoda #1 značky napříč sweepy (replikace
stávajícího 86% čísla jako baseline), (b) % shoda #1 konkrétního
produktu napříč sweepy — u stejných intentů, stejné kohorty.

**Limitace (disclosed předem):**
1. Ne všechny kategorie/odpovědi jmenují konkrétní produkt/model —
   u obecnějších kategorií (např. "nejlepší obchod s oblečením") SKU
   úroveň nemusí dávat smysl, je potřeba vybrat kategorie/intenty, kde
   model typicky jmenuje konkrétní produkt, ne jen značku.
2. Vyžaduje nové sweepy přes delší okno (2 měsíce), ne jednorázový
   běh — nejde to urychlit beze změny designu (na rozdíl od
   gpt-4o-only studií, co šly postavit a vyhodnotit hned).
3. Je to přímá reakce na cizí otázku (Zhao Hanbo), ne vlastní interní
   prioritizovaný nápad — stojí za zvážení, jestli to zapadá do
   pořadí, nebo jde o samostatný vedlejší projekt.

Status: zapsáno jako kandidát ("co dalsi studie do road mapy",
Daniel 2026-10-01), vzniklo přímo z LinkedIn výměny se Zhao Hanbo,
design nerozpracovaný do `STUDY-DESIGN.md`/kódu, čeká na zařazení do
pořadí.

## Nový kandidát: Content Archetype × Citation (2026-10-05)

Podnět: LinkedIn post Anny York (Citation School), "15 content
archetypes that get you into AI answers" — Tier 1 citation-winning
formáty (definice, srovnání, otázky, seznamy, frameworky, původní
výzkum, statistiky, how-to, problém-řešení, myth-busting) a Tier 2
authority formáty (trendy, case studies, zákulisí, selhání s
ponaučením, názory). Tvrzení: formát obsahu určuje, co AI cituje.
Nemáme k tomu žádná vlastní data — naše studie měří výběr
produktu/značky, ne citace podle formátu obsahu.

**Otázka:** Mění při zachování stejných faktů formát obsahu
(archetyp), jak často ho model cituje a použije jeho fakta, nebo
rozhoduje obsah (fakta, rating) a forma je druhořadá?

**Navržený design:**
- ~50 záměrů, pro každý stejný obsah napsaný v 6–8 archetypech
  (definice, srovnání, FAQ, seznam, how-to, case study, názor).
  Fakta, délka a značka konstantní, mění se jen forma.
- Měřit podíl citací a podíl použití faktu z dané verze, 10 běhů na
  variantu.
- Kontroly: náhodné střídání pozice dokumentu (jinak měříme pořadí,
  ne formát), paired baseline s identickým obsahem pro noise floor
  (stejná metoda jako Candidate Evaluation, noise floor 11,2 %).
- Reuse infrastruktury Candidate Evaluation / Source Rank Position.

**Možné výsledky (obojí publikovatelné):** formát záleží, nebo
rozhodují fakta a forma ne — druhé by potvrdilo dosavadní linii
(rating 160/160, specs 81,9 %, price 60,6 %).

**Limitace (disclosed předem):**
1. Laboratorní test na gpt-4o s umělými stránkami, ne měření
   reálného webu. Netvrdit "takhle cituje ChatGPT", jen "takhle se
   chová model při tomto výběru".
2. Pozor na záměnu formátu a délky/hustoty faktů — nutné párovat.
3. Je to reakce na cizí post, ne vlastní prioritizovaný nápad.

**Související menší kandidáti ze stejného dne:**
- Vladimir Fedorov (ShelfSignal): test "existující politika obchodu
  vedle produktu" = varianta Fact Injection, metodu už máme.
- Amazon Branded Conversations (newsletter J. Lambadjieva) navazuje
  na Hidden Context (vymyšlená expozice reklamě měla největší efekt).

Status: zapsáno jako kandidát (Daniel 2026-10-05), design
nerozpracovaný do `STUDY-DESIGN.md`/kódu, čeká na zařazení do
pořadí.

## Nový kandidát: 3 studie k tomu, JAK AI rozhoduje (podnět: AIVO "Brand Valuation" článek, 2026-10-05)

Podnět: článek AIVO Journal "Your Brand Valuation Prices a Customer
Who Is Leaving the Room" (5. 10. 2026). Tvrzení: metody oceňování
značek (Interbrand, Brand Finance, Kantar BrandZ, mentální
dostupnost) předpokládají lidského rozhodovatele. AIVO uvádí 2 160
konverzací o výběru banky (fintechy 1 345 doporučení vs. tradiční
banky 452, Mercury 383), 87,3 % značek přítomných brzy v konverzaci
je před finálním doporučením vytlačeno a navrhuje metriku "Brand
Alpha" (doporučení vs. tržní podíl). Ověřeno jen z článku, jejich
metodika nezkontrolována.

**Cíl zařazení (Daniel 2026-10-05):** ne další varianty stejných
testů, ale studie, které nám pomůžou blíže pochopit mechanismus
rozhodování AI. Proto jsou designy záměrně jiné než dosavadní
head-to-head Fact Injection (flip rate proti noise floor 11,2 %).

### 1. Heritage vs. Evidence: směnný kurz (exchange rate)
**Otázka:** Jakou "cenu" má v rozhodnutí modelu dědictví značky
(věk, velikost, rozsah) oproti důkazům a kolik důkazů ho vyváží?
**Design (nový, ne single-factor flip):** konfliktní páry, kde
značka A vede v dědictví a B v důkazu (rating). Dědictví se zvyšuje
po stupních (založeno 2017 → 2000 → 1950 → 1890; počet poboček),
rating rozdíl se mění po stupních. Výstup: dose-response křivka a
"směnný kurz" (o kolik ratingu se musí A zhoršit, aby ji B porazila
při daném dědictví) a prahový bod, kde se vítěz otáčí.
**Co nám to řekne:** jestli dědictví vůbec něco váží, nebo jen
slouží jako rozstřel při shodě důkazů. Testuje přímo AIVO tvrzení
"stoletá značka prohraje s fintechem" a rozšiřuje Fame study (1,2 %),
která měřila slávu, ne konkrétní signály dědictví.

### 2. Stakes × Evidence: váhový profil podle sázky kategorie
**Otázka:** Mění se relativní váha signálů (rating, cena, specs,
dědictví, regulace/záruky) podle toho, jak vysoká je sázka
v kategorii (boty/audio vs. banky/pojištění)?
**Design (nový, ne opakování Candidate Evaluation):** místo
jednoho flip rate na faktor odhadnout z konfliktních voleb
(conjoint-like) váhový profil signálů pro každou kategorii zvlášť a
porovnat nízkou vs. vysokou sázku. Opírat se o odhalené volby, ne o
modelem uváděné důvody (Confabulation: 29 633 důvodů, 26 812
unikátních, vysvětlení nejsou spolehlivá).
**Co nám to řekne:** jestli je naše pořadí důkazů (rating 160/160,
specs 81,9 %, price 60,6 %) obecné, nebo specifické pro e-commerce.
Spojuje Semrush YMYL zjištění (jiné zdroje u peněz/zdraví) s AIVO
výsledkem u bank.

### 3. Multi-turn Displacement: kdy a čím je kandidát vytlačen
**KOREKCE (2026-10-05, kontrola roadmapy):** Study #24 (`research/multi-turn-displacement.html`, "It Recommends You First. By Turn Four, It's Moved On") už vícekolové vytlačení měří, s neutrálními doplňujícími otázkami, které značku nejmenují. Tento kandidát je tedy z velké části duplicita. Zůstává jen užší varianta: *jaký typ omezující podmínky (cena, region, funkce, důvěra) značku vytlačí*. Do počtu otevřených studií se nezapočítává, dokud není přeformulován.
**Otázka:** Kdy v konverzaci kandidát vypadne a který typ doplňující
podmínky uživatele ho vytlačí?
**Design:** vícekolové konverzace, v každém kole přidat jednu
omezující podmínku (cena, region, funkce, důvěra) a zaznamenat po
kolech, kdo je #1 a kdo vypadl; vyhodnotit podle typu podmínky.
**Před zápisem do pořadí ověřit překryv** se Silent Candidacy Drop a
Fragile vs. Resilient Candidacy (zda byly vícekolové). Pokud ano,
je to jen rozšíření, ne nová studie.

**Vyhnout se:** replikaci Brand Alpha (doporučení vs. tržní podíl):
potřebuje reálná tržní data, která nemáme, a je blízko Memory Source
(R² 11,2 %, 50 značek, CI 3,8–37,5 %).

**Limitace (obecně):** gpt-4o, syntetická zadání, ne reálné
asistenty. Netvrdit "takhle rozhodují ChatGPT/Gemini", jen "takhle se
chová model při tomto výběru". Dědictví a stakes je nutné
operacionalizovat opatrně, aby se nemíchaly s délkou/hustotou
textu.

Status: zapsáno jako tři kandidáti (Daniel 2026-10-05), design
nerozpracovaný do `STUDY-DESIGN.md`/kódu, čeká na zařazení do
pořadí. Doporučené pořadí: 1 → 2 → 3.

## Závěrečný kandidát: Brand Playbook, syntéza všech studií (2026-10-05)

Podnět: Daniel (2026-10-05): "až budeme mít hotové všechny studie,
projít je všechny, udělat příklady z každé a sestavit jasný návod,
co a jak udělat, aby byla značka co nejvíce doporučovaná, na základě
studií."

**Formát:** pro každou studii jeden řádek: zjištění → páka →
konkrétní krok pro značku → štítek jistoty (silný / střední / slabý).
Příklady z dnešních studií: rating otočil vítěze 160/160 (sbírat a
zveřejňovat hodnocení), Cold Start (bez důkazu 0/360, s review
skóre 53,1 %, PR 1,9 %, prodeje 0,3 %: dodat strojově čitelný
důkaz, nespoléhat na PR), Lock-in (86 % stejná #1: vstup je těžší
než udržení), Possession vs Deployment (75,8 % známých faktů se
nepoužije: fakta musí být ve formě, kterou model využije).

**Řazení kroků:** podle síly účinku a replikace, ne podle
studií.

**Pravidla poctivosti (zapsat předem):**
1. Všechno je z testů na gpt-4o a syntetických zadání, žádné tvrzení
   typu "takto vás ChatGPT doporučí". Každý krok má štítek jistoty.
2. Pokud se studie neshodují, ukázat to, neschovat.
3. Playbook je hypotéza k ověření na reálném brandu, ideálně případ
   před/po (např. Founder Lab).

Závislost: čeká na dokončení tří kandidátů z AIVO podnětu
(Heritage vs. Evidence, Stakes × Evidence, Multi-turn Displacement)
a ostatních rozpracovaných studií.

Status: zapsáno jako závěrečný kandidát, nic nerozpracováno.


## PŘEHLED: otevřené studie a kandidáti (kontrola 2026-10-05)

Účel: jedno místo, kde je vidět, co ještě není postavené. Vzniklo
kontrolou všech sekcí roadmapy proti reálně publikovaným studiím v
`research/` (publikovány #1–7, #18–45; chybějící čísla 8–17 nejsou
v tomto přehledu řešena). Stavy jsou odvozené ze statusů sekcí a ze
souborů, ne z jednotného registru, proto je dobré přehled při každé
nové studii aktualizovat.

### A. Volné kandidáty z LinkedIn výměn a podnětů (12)
1. Content Gap Capture (2026-09-21)
2. Source type jako moderátor Authority efektu (2026-09-23)
3. Ghost Citation jako předstupeň Candidacy (2026-09-24)
4. Query délka/struktura vs. selection rate (2026-09-24)
5. Personalizace přebíjí populační doporučení? (2026-09-25)
6. Silent Candidacy Drop (2026-09-25), souvisí s Machine-readable depth
7. Recommendation vs. Commitment (uzavírá Purchase, fáze 9) (2026-09-28)
8. Copy Relevance × Site/Page Relevance (2026-09-30), úkol #28
9. SKU-level vs. brand-level lock-in (2026-10-01), slib Zhao Hanbo
10. Content Archetype × Citation (2026-10-05)
11. Heritage vs. Evidence, směnný kurz (2026-10-05)
12. Stakes × Evidence, váhový profil podle sázky (2026-10-05)

### B. Dva kandidáti z výměny s Albertem Barberisem (2026-09-19), oba otevřené
13. A: neviditelné JSON-LD vs. viditelné bullety vs. próza (v žádné studii se JSON-LD netestovalo)
14. B: Intent coverage ("pro koho a k čemu") jako samostatná proměnná

### C. Kandidáti decision path ze 2026-09-19 (19 otevřených; hotový je jediný, Confidence #1 = Study #41)
Upozornění: záhlaví sekce uvádí "19", vypsaných položek je 20 (hotová
+ 19 otevřených). Rozdíl nevyřešen. K1 se může překrývat s Founder Lab
multi-choice faktoriálem (sekce 2026-09-19), ověřit před realizací.

Confidence (3 otevřené)
- C2 HOTOVO (2026-10-06): Confidence predicts stability, addendum na #22
- C3 Genuinní remíza, ne rating-rozhodnutý spor
- C4 HOTOVO (2026-10-06): nulový výsledek, nepublikováno

Retrieval (4)
- R1 Jaký prompt styl model donutí sáhnout po search sám (navazuje na Live Retrieval #28)
- R2 Vynucený search a Accuracy+Depth pokrytí
- R3 Cross-platform retrieval (Perplexity/Claude vs. GPT), dříve blokováno na API klíčích
- R4 Koreluje dobrovolné použití search se změnou doporučení

Understanding (4)
- U1 Fact-injection styl na podpokryté CDI kategorie
- U2 Predikuje hloubka popisu (CDI), kdo vyhraje doporučení?
- U3 "Search mění slovník" rozdělené na funkční vs. důvěra-kategorie
- U4 HOTOVO (2026-10-06): nulový výsledek, nepublikováno

Memory (4)
- M1 Cross-model paměť (nejvyšší priorita sekce), dříve blokováno na API klíčích Anthropic/Google
- M2 Dose-response fact injection: 0/1/3/6 faktů
- M3 Possession rate podle stáří/zavedenosti značky
- M4 Pořadí/salience uvnitř 6 possessed faktů

Candidacy (4)
- K1 Founder Lab: kauzálně změnit "ten jeden faktor" z Candidacy vs Selection
- K2 Hidden Context rozšíření: fiktivní "viděl reklamu" na obou stranách
- K3 HOTOVO (2026-10-06): Cold Start Dose-Response, nepublikováno
- K4 Brand Legibility odveta: framing dvou legible brandů proti sobě

### D. Mimo čisté studie
- Vlastní nákupní AI agent pro Founder Lab (produktový experiment)
- Brand Playbook, závěrečná syntéza (čeká na dokončení ostatních)
- Multi-turn Displacement: přeformulovat na "typ omezující podmínky" (Study #24 už existuje), nepočítá se

### Součet
- Studie: 12 (A) + 2 (B) + 19 (C) = **33** (+1 přidán 2026-10-06: Evidence → Recommendation Conversion = **34**)
- Plus Founder Lab agent a Brand Playbook = **36 položek**

### K ověření
- Stav "Founder Lab multi-choice faktoriál, verze A (simulovaná) a B (živá)" (sekce 2026-09-19): z kontroly nepoznat, zda je hotová.
- Zda cross-model / cross-platform stále blokují chybějící API klíče.
- Číslování: dvě stránky nesou "Study #43" (`sponsored-tag-penalty`, `query-conditional-defense`), druhá má být #44.
- Mnoho položek v C jsou levné analýzy nad existujícími daty, skutečná pracnost je nižší než počet.


## Nový kandidát: Evidence → Recommendation Conversion (2026-10-06)

Podnět: odpověď Semrushe pod naším komentářem k jejich AI Visibility
Index mini-studii (YMYL): "citations and brand mentions often move
independently, so the next layer really is understanding what turns
sourced evidence into an actual brand recommendation." Veřejně
převzali náš rámec (další vrstva = co mění důkaz v doporučení).

**Co už máme a co zůstalo otevřené:** Ghost Citation (hotovo,
2026-09-25) změřil konverzi citace na jmenovaný produkt uvnitř jedné
odpovědi (49,9 % named / 50,1 % ghost, vítěz named v 98,1 %). Fáze 2
původního návrhu, propojení citace s oddělenou volbou kandidáta, se
nekonala (žádný dataset nesdílel kategorie/značky). Zůstává tedy
nezodpovězená otázka, co z důkazu v citovaném zdroji dělá skutečný
výběr.

**Otázka:** Za jakých podmínek se důkaz obsažený v citovaném zdroji
promění v to, že model značku doporučí?

**Design (nový, ne další head-to-head flip):** dosud jsme fakta
vkládali přímo do promptu (Fact Injection, Winner vs Loser). Tady je
důkaz uvnitř "citovaného zdroje" a mění se vlastnosti zdroje:
- **Korroborace:** 1 zdroj vs. 3 nezávislé zdroje se stejným tvrzením
  (dosud netestováno).
- **Konflikt:** jeden zdroj značku chválí, druhý ne.
- **Typ zdroje a forma tvrzení:** brand-owned vs. recenzent vs.
  komunita; číslo vs. přídavné jméno.
- **Jmenování:** zdroj jmenuje značku v nadpisu vs. jen uvnitř textu
  (původní "cited-only vs cited-and-named").
Výstup: funnel důkaz v kontextu → jmenovaný → vybraný na stejných
bězích, dose-response podle počtu a shody zdrojů.

**Hypotézy (předregistrováno zde, před sběrem dat):**
1. Korroborace zvyšuje konverzi víc než typ zdroje.
2. Konflikt snižuje konverzi víc, než odpovídá průměru obou zdrojů.

**Limitace (disclosed předem):**
1. gpt-4o, syntetické "zdroje" vložené do kontextu, ne reálný
   retrieval. Live Retrieval (#28) ukázal, že model s search
   nástrojem při otevřených nákupních otázkách nesáhl po searchi
   ani jednou z 960 volání, proto se důkaz dodává do kontextu.
2. Self-grading riziko, pokud extrakci dělá stejný model.
3. Nepřekrývat se Claim Attribution (#31) a Source Rank Position
   (#45): ověřit před realizací, ať se neměří totéž.

Souvisí: Ghost Citation (Fáze 2), Possession vs Deployment (#23),
Source Stability (#36), Fact Injection (#25).

Status: zapsáno jako plnohodnotný kandidát (Daniel 2026-10-06),
design nerozpracovaný do `STUDY-DESIGN.md`/kódu, čeká na zařazení do
pořadí.

## Rozpracováno: Signal Effect Ladder (2026-10-06)

Studie bez nových API volání (re-analýza uložených dat), první z pěti
(pořadí 1 → 2 → 3 → 4 → 5 podle přehledu). První průchod hotový z
publikovaných čísel: `research-prep/signal-effect-ladder/LADDER.md`
(čtyři pásma: rozhodující / silné samo, mizí vedle ratingu / střední /
zanedbatelné). Zbývá přepočet z `results.json` na jednotnou míru a
jistota u každého řádku. Podklad pro Brand Playbook.

**Aktualizace 2026-10-06 (ověření Signal Effect Ladder):** přepočet z
`results.json` našel dvě nepřesnosti v publikovaných formulacích:
(1) Candidate Evaluation (#19): 160/160, 81,9 %, 60,6 % jsou
"follows the numbers" (výběr značky s lepším faktem), ne flip rate;
skutečný flip rate je 50,0 / 41,9 / 26,9 % (noise floor 11,2 %),
price je v noise; (2) Memory Source (#21): kombinovaný R² 11,2 % je
na 50 značkách (CI 3,8–37,5 %), ne na 95. Detaily v
`research-prep/signal-effect-ladder/LADDER.md`. K rozhodnutí: opravit
formulace na stránkách a v LinkedIn postu.

**Opraveno v main 4 (2026-10-06):** formulace "flipped the verdict 160 of
160" nahrazena "decided the pick in 160 of 160 runs" (candidate-evaluation,
how-ai-decides, cold-start, index, mechanism-studies, llms.txt; v JSON-LD
popisu candidate-evaluation oddělen follows rate 160/160, 81,9 %, 60,6 %
od flip rate specs 41,9 % a price 26,9 %). Memory Source (#21): souhrny a
llms.txt upřesněny na "up to 95 brands", kombinovaný R² 11,2 % na 50
značkách (CI 3,8-37,5 %); tělo stránky to už uvádělo správně. LinkedIn post
a ostatní nezměněno.

## Hotovo: Heterogenita efektů po značkách (studie bez API volání, 2026-10-06)

Druhá z pěti studií bez nových volání. Re-analýza `results.json` ze 14
studií se stejnými 4 značkami: `research-prep/heterogeneity-by-brand/`
(`analyze.py`, `results.json`, `FINDINGS.md`). Hlavní nálezy: směr efektů
platí u všech 4 značek, ale velikost se liší 3× až 25× (sponzorovaná
penalizace 3 až 34 b., query-conditional 3 až 79 b.); dva případy bez
konzistentního směru (negativní reputace a candidacy: bodyartforms −10 b.;
claim attribution u bodyartforms nízko ve všech podmínkách); pořadí značek
napříč metrikami se shoduje jen tak, jak by dalo náhodou (33,8 % vs 33,3 %),
tedy žádná obecná "citlivost značky". Doporučení: publikovat rozmezí vedle
průměrů a doplnit značky s různou výchozí hodnotou.

**Opraveno v main 4 (2026-10-06, po studii Heterogenita):** na stránkách
#43 (sponsored-tag-penalty), #44 (query-conditional-defense) a #42
(negative-reputation-candidacy) doplněno rozmezí po značkách do meta
popisů, JSON-LD a úvodního textu (penalizace 3 až 34 b., obnova 3 až 79 b.);
u #42 upřesněno, že candidacy vzrostla u 3 ze 4 značek (bodyartforms
−10 b.), také v how-ai-decides, index a llms.txt. Per-brand tabulky na
stránkách už rozmezí i výjimku uváděly, doplněny byly jen souhrny.

## Hotovo: Stated vs. revealed reasons (studie bez API volání, 2026-10-06)

Třetí z pěti studií bez nových volání (`research-prep/stated-vs-revealed/`:
`analyze.py`, `results.json`, `FINDINGS.md`). Klíčová zjištění: sponzorovaný
štítek je skrytý řidič (efekt −18,4 b., model ho jmenuje v 1,0 % odpovědí);
autorita samotná rozhoduje (rozdíl 71 b.), ale pojmenována je jen v 47 až 65 %;
vedle ratingu je zmínka autority/familiarity dekorace (27 % / 55 % zmínek při
efektu kolem nuly); pozice ve zdroji je jmenována v 99 až 100 % a odpovídá
efektu. Vzorec: uvedené důvody sledují nápadnost v promptu, ne příčinu.
Publikační forma zatím nerozhodnuta (addendum k Confabulation #4 nebo samostatně).

**Publikováno (2026-10-06):** Stated vs. revealed reasons jako addendum
na `research/ai-confabulates-its-reasons.html` (Study #4): sekce
"Does the reason at least name what moved the pick?" s tabulkou (sponsored
1,0 %, autorita 47-65 %, rating 68-86 %, pozice ve zdroji 99-100 %), závěrem a
metodickými limitacemi; věta přidána i do záznamu Confabulation v
`llms.txt`. Nová číslovaná studie ani karta v indexu nevznikla.

## Hotovo: Confidence predicts stability (2026-10-06)
Logprob gap predikuje shodu free-text vs. logprob volby (AUC 0,855, p 0,0005; uvnitř specs 0,852, price 0,706). Predikuje "následuje lepší fakt" jen u specs (AUC 0,675), u price ne (0,515, p 0,77). Rating bez variance. Detail: research-prep/confidence-predicts-stability/FINDINGS.md. Publikováno: addendum na research/recommendation-confidence.html + llms.txt.

## Rozpracováno: Own crawl logs (2026-10-06)
ai_visits: 1 226 návštěv AI botů (8. 7.–6. 10.), 0 na /llms.txt a /robots.txt. Test curl GPTBot ukázal, že tyto cesty obcházely middleware (logovala se jen `/`), takže nula NENÍ publikovatelná. Oprava lokálně: api/static-log.js + routes ve vercel.json (čeká na deploy a ověření curl testem). Sběr reálných dat začne po deployi; vyhodnotit za 4–6 týdnů. Vedlejší nález: meta-externalagent chodí na /products/null (rozbitý odkaz).

## Hotovo: C4 Hedging podle kategorie (2026-10-06)
Nulový výsledek. Hedged share trust 4,3 % vs. functional 6,7 % (p 0,34, varianta B p 0,33), logprob gap 0,896 vs. 0,903 (p 0,86). 16 intentů, nízká síla; rozdíl mezi signály (rating hedguje nejvíc) je větší než mezi kategoriemi. Detail: research-prep/hedging-by-category/FINDINGS.md. Nepublikováno.

## Hotovo: U4 Konkrétnost slovníku vs. logprob jistota (2026-10-06)
Nulový výsledek. Sdruženě ρ 0,45, ale jde o confound typu signálu (rating reasony citují "rating", gap ≈ 1). Uvnitř price/specs ρ −0,02 / 0,12 (p 0,79 / 0,13); rating 0,23 pravděpodobně artefakt lexikonu a délky. Jazyk (hedging ani konkrétnost) jistotu modelu neodráží, interní logprob ano. Detail: research-prep/vocab-concreteness/FINDINGS.md. Nepublikováno.

Publikováno (2026-10-06): null kontroly C4 (hedging podle kategorie) a U4 (konkrétnost slovníku) přidány jako odstavec do addenda na research/recommendation-confidence.html + llms.txt. /products/null: v našem kódu zdroj nenalezen (viz kontrola níže).

## Připraveno: K3 Cold Start Dose-Response (2026-10-06)
research-prep/cold-start-dose-response/ (STUDY-DESIGN.md, run_study.py, analyze_results.py). 11 podmínek (počet recenzí 5–2 500 při 4,7★; hodnocení 3,8–4,9★ při 500 recenzích; jen skóre; jen počet) × 36 intentů × 10 běhů = 3 960 volání gpt-4o, fixní dávky bez jitteru. Dry-run prošel (pipeline + analýza). Čeká na spuštění s OpenAI klíčem: `python run_study.py run` (resumable), pak `python analyze_results.py`.

## Hotovo: K3 Cold Start Dose-Response (2026-10-06)
3 960 běhů. Hodnocení je páka: 3,8★ 0 %, 4,1★ 2,2 %, 4,4★ 18,1 %, 4,7★ 62,5 %, 4,9★ 84,7 % (při 500 recenzích). Počet je zesilovač: 5 recenzí 2,8 %, 25 22,2 %, 100 52,5 %, 500 62,5 %, 2 500 67,5 % (500 vs. 2 500 nevýznamné, p 0,39). Jen skóre 26,4 %, jen počet 2,5 %, kombinace 62,5 %. 4,7★ s 5 recenzemi jen 2,8 %: model malý vzorek diskontuje. Detail: research-prep/cold-start-dose-response/FINDINGS.md. Nepublikováno; návrh: addendum ke Cold Start (#20) nebo samostatná studie (čeká na schválení).

## Publikováno (připraveno k deployi): Study #46 Cold Start Dose-Response (2026-10-06)
Stránka research/cold-start-dose-response.html. Napojeno: vercel.json route, sitemap-pages.xml, llms.txt (záznam + "46 studies"), karta v research/mechanism-studies.html (+ hero "36 studies"), report-card + finding-card (data-key 44) v research/index.html, odkaz + mini-card v research/how-ai-decides.html, footer odkaz ve 167 dalších HTML (vč. root, reports, vocabulary, products, framework, benchmarks, stores, research), "Public Studies" 45 → 46 na 169 stránkách + "46 studies measuring…" / "46 public studies" v textech. Nezasaženo: new-web/, research-prep/, _pages/ (zastaralé kopie).

## Nové kandidáti z LinkedIn výměny Hufford / Lily Ray (2026-10-06)

Zdroj: post Brendana Huffordа (AEO, analýza 250 nejcitovanějších stránek napříč klienty za 90 dní, Profound) a komentář Lily Ray (citovaný žebříček často nevede k doporučení značky, která ho napsala; v jejích testech na Googlu je značka vynechána přes 80 % případů, citace podporuje konkurenci). Hufford: u dvou klientů, oba hodně citovaní, je zavedený lídr jmenován v 47 % odpovědí, nováček ve 2 % ("leaders keep leading"). Rada: "napiš si žebříček, na kterém budeš", zkontroluj top 25 citovaných stránek (homepage, FAQ, About, alternatives, pricing).

### 1. Source Rank × Brand Prior (nová volání, ~1 000–1 500 gpt-4o)
Otázka: když je nováček (fiktivní značka z Cold Start) ve zdroji na 1. místě a zavedený incumbent níž, vyhraje pozice, nebo paměť modelu? Design: 17pozicový žebříček z Study #45; podmínky: nováček na 1. / 2. / 4. místě, incumbent na zbylém (a případně varianta s nováčkovým ratingem ≥ 4,4★ z #46). 36 dominantních intentů z Cold Start × podmínky × 10 běhů. Měří se selection a named-candidacy zvlášť. Odpovídá přímo na spor "leaders keep leading" (Hufford: 47 % vs 2 %) vs. "rozhoduje pozice ve zdroji" (#45: 100 / 1,2 / 0 %). Limit: syntetický zdroj, jeden model.

### 2. Autor zdroje: vendor-written vs. nezávislý žebříček (nová volání, podobný rozsah)
Otázka: rozlišuje model, kdo žebříček napsal? Stejný obsah a pořadí, podepsáno nezávislou redakcí vs. dodavatelem (včetně cílové značky samotné). Spojit s existujícím kandidátem A2 (Source type jako moderátor Authority efektu). Testuje Hufford radu "napiš si žebříček" a Lilyino pozorování, že citace často slouží konkurenci.

### 3. Vlastní logy: které typy stránek AI boti načítají (bez volání)
Z ai_visits (1 226 návštěv 8. 7.–6. 10., po deployi opravy static-log i /llms.txt, /robots.txt, sitemapy) rozložení cest podle typu (homepage, FAQ, About, produkt, studie, store stránky) a bota. Doplněk ke studii 5. Malý vzorek, bez inference o citacích v odpovědích.

### Neměřitelné nyní
Google vs. ChatGPT placený/přihlášený účet (Lily), citace FAQ/pricing/alternatives stránek v reálném retrievalu (Live Retrieval #28 měřilo 0 z 960, bez přístupu k platformám).

## PLÁN: Audit mezer po dokončení všech plánovaných studií (zapsáno 2026-10-06)

Pravidlo: až budou hotové všechny studie z roadmapy (viz "PŘEHLED: otevřené studie a kandidáti" a nové kandidáty z 2026-10-06), neděláme okamžitě další. Nejdřív celé dosavadní portfolio projdeme ze všech stran a z toho určíme, kde je díra. Další studie vznikají z nalezených mezer, ne z náhodných podnětů.

Jak audit provést (osnova):
1. Matice "co jsme změřili": proměnná (signál, kontext, zdroj, dotaz, kategorie, značka) × fáze rozhodnutí (kandidatura, selection, stabilita, jistota) × model/platforma. Prázdné buňky jsou kandidáti na mezeru.
2. Slabá místa metody napříč sérií: stejné 4 značky (obecnost), jeden model (gpt-4o), syntetická fakta a fiktivní značky, forced two-way proti otevřeným dotazům, žádný živý retrieval, žádné multi-turn. U každého zjistit, které závěry na tom stojí.
3. Replikace a konzistence: závěry, které stojí na jediném měření nebo na malém n (např. 16 intentů, 36 klastrů), a ty, které se mezi studiemi nepotvrdily nebo si odporují (rating vs. cena, uvedené důvody vs. skutečné příčiny, jazyk vs. interní jistota).
4. Výhrady z vnějšku: kritiky a protipříklady z LinkedIn výměn (platformy, personalizace, Google vs. ChatGPT, lidé vs. model, např. ReFiBuy human study), které jsme zatím nemohli změřit.
5. Pro značky: projít Brand Playbook a ověřit, že každé doporučení má pod sebou studii, a které doporučení stojí jen na jedné.
6. Výstup: seznam mezer seřazený podle dopadu na rozhodnutí značky a podle proveditelnosti, z něj nové studie.

Vstupy, které se mají projít: cross-study-matrix/matrix.json, Signal Effect Ladder, Heterogeneita po značkách, Stated vs. revealed, Confidence predicts stability, Cold Start Dose-Response, Brand Playbook, všechny roadmap sekce "Neměřitelné nyní".

## Nový kandidát: Rozštěpená entita / Entity Fragmentation (2026-10-07)

Zdroj: LinkedIn post Sayeda Sadikha Nawaje Aliho (duplicitní Google Business Profiles zubní kliniky, recenze a fotky rozpůlené mezi dvěma záznamy). Přímá data nemáme; Daniel mu slíbil, že dá vědět, až budou.

Otázka: ztratí firma při doporučování, když se její recenze rozdělí mezi dva duplicitní záznamy, a o kolik?

Design (navazuje na K3 Cold Start Dose-Response, stejných 36 intentů, fiktivní nováček proti incumbentovi, gpt-4o, 10 běhů): A) jeden záznam 4,7★ / 100 recenzí (reference, v K3 52,5 %); B) dva záznamy se stejným názvem, každý 4,7★ / 50 recenzí; C) jeden záznam 4,7★ / 50 recenzí (kontrola samotného menšího počtu); D) dva záznamy se stejným názvem a konfliktními údaji (jiná adresa, 4,3★ vs. 4,5★). A vs. B = cena rozštěpení; B vs. C = penalizuje model duplicitu nad samotný menší počet; D = vliv konfliktních faktů. Odhad 1 400–1 800 volání.

Limity předem: fiktivní značky, syntetické recenze, jeden model, forced two-way; neměří Google ani lokální pack, jen zacházení s rozštěpenými daty v kontextu.

Status: zapsáno, nerealizováno. Spadá pod audit mezer po dokončení plánovaných studií.

## Nový kandidát: Klasifikace → kandidatura / Classification → Candidacy (2026-10-07)

Zdroj: LinkedIn post Silvie Stolarcikové (QIVO Global), "AI Classification Audit": AI podle webu, LinkedInu, starého PR a katalogů rozhodne, co firma je a do jaké kategorie patří, a z toho vzniká shortlist ("firmu neztratíte v dealu, nikdy do něj nevstoupíte"). Její 20minutový audit (5 kroků, skóre podle počtu neshod) je sebehodnocení, ne měření. Teze (klasifikace určuje kandidaturu, "identity coherence je příčina") je věrohodná, ale netestovaná.

Otázka: předpovídá kategorie, do které model firmu zařadí při otevřeném dotazu ("co je X, do jaké kategorie patří"), zda se firma objeví v odpovědích na dotaz kupujícího na její skutečnou kategorii?

Design (nová volání, rozsah určit podle počtu značek): reálné značky s jasnou kategorií (různá známost, včetně malých); fáze 1: otevřená klasifikace každé značky (bez nápovědy kategorie), vyhodnocení shody se skutečnou kategorií LLM judge; fáze 2: dotaz kupujícího na skutečnou kategorii (bez jména značky), měření, zda se značka objeví (candidacy) a zda je vybrána (selection); analýza: shoda klasifikace vs. candidacy, kontrola známosti značky jako konfounderu (Fame Study: známost sama vysvětluje málo, ale model's own memory hodně). Cluster přes značky, permutační test.

Souvislé výsledky: Brand Legibility (kvalita popisu v promptu candidacy skoro nemění, jakmile jsou fakta v kontextu; týká se popisu v promptu, ne naučené klasifikace), Candidacy vs Selection, AI Knows Your Website (75,9 %), Possession vs Deployment (75,8 % faktů nepoužito).

Limity předem: jeden model (gpt-4o) bez živého retrievalu, klasifikace z paměti modelu, ne z aktuálního webu; výběr značek ovlivní výsledek; "shoda klasifikace" závisí na definici kategorie a judge.

Status: zapsáno, nerealizováno. Spadá pod audit mezer po dokončení plánovaných studií. Slib: komentář pro Silvii až bude mít data (zatím žádný).

## Nový kandidát: B2B / Procurement doména (výběr dodavatele agentem) (2026-10-07)

Zdroj: LinkedIn post Tima de Rosena (AIVO), který sdílí 90denní plán BCG (Alex Baxter) pro agentický procurement: pilot na tail-spend + paralelně diagnostika pěti nepřímých kategorií. Tim: jakmile agenti povedou shortlisting dodavatelů end-to-end, výsledek dodavatele závisí na tom, jak ho vyhodnotí stroj, který nikdy nepotká; kupující dostane explicitní rozhodovací logiku, prodávající "bránu, kterou nevidí"; tvrdí, že rozdíly ve výběru jsou "už materiální" (bez čísel, jde o propagaci AIVO).

Mezera: všechny naše studie měří B2C produktová doporučení (rating, cena, specifika, značky z e-commerce). Nemáme žádná data o výběru dodavatele v B2B procurementu (jiné signály: certifikace, reference, cena za kontrakt, SLA, kapacita, compliance).

Otázka: platí mechanismy z naší série (model sleduje ověřitelný důkaz v kontextu, pozice ve zdroji rozhoduje, stabilita doporučení, prahy důkazu z K3) i při výběru dodavatele pro firemní nákup, a které signály jsou tam rozhodující?

Design (nápad, nerozpracováno): forced two-way výběr dodavatele pro 20–30 B2B kategorií (nepřímé nákupy: IT služby, logistika, kancelářské potřeby, SaaS), fiktivní vs. zavedený dodavatel; signály: certifikace/reference/cena/SLA/hodnocení; opakování pro stabilitu; reuse designu K3 a Source Rank × Brand Prior. Limity předem: jeden model, fiktivní dodavatelé, syntetické důkazy, žádný skutečný procurement workflow.

Status: zapsáno, nerealizováno. Spadá pod audit mezer po dokončení plánovaných studií. Souvisí s Cronovým rámcem (routing = verified context × eligibility × preference × economic offer × execution certainty) a s CommerceAgentBench (exekuce agentů, 61,7 %).

## Připraveno: Source Rank × Brand Prior (2026-10-07)
research-prep/source-rank-x-brand-prior/ (STUDY-DESIGN.md, run_study.py, analyze_results.py). Pozice nováčka ve zdroji (N1/N4/N15, incumbent na 2.; I1 incumbent 1., nováček 2.) × důkaz (žádný vs. 4,7★/500 recenzí) = 8 podmínek × 36 intentů × 10 běhů = 2 880 volání gpt-4o. Hypotézy zapsány předem (H1 pozice přebije paměť, H2 paměť přebije pozici, H3 jako #45, H4 důkaz a pozice se sčítají). Dry-run prošel. Čeká na spuštění s OpenAI klíčem.

## Hotovo: Source Rank × Brand Prior (2026-10-07)
2 880 běhů. Úplně binární: nováček na 1. místě zdroje 100 % (bez důkazu i s 4,7★/500 recenzemi), na 4. a 15. místě 0 % (i s důkazem), incumbent na 1. místě = nováček 0 %. Model cituje pořadí ve zdroji u ~99–100 % odpovědí, rating/recenze u <1 %. Pozice přebila paměťový prior (vyvrací "leaders keep leading" v tomto designu) i důkaz (v K3 stejné 4,7★/500 dalo 62,5 % bez zdroje). Strop 100/0 je limit: zdroj v system promptu s pokynem "Use this source if it's relevant", sousední pozice netestovány, forced two-way, jeden model. Detail: research-prep/source-rank-x-brand-prior/FINDINGS.md. Nepublikováno. Návazné testy (pokyn, sousední pozice, spolehlivost zdroje, konflikt zdroj vs. důkaz) zapsány ve FINDINGS.

## Source Rank × Brand Prior v2 (robustness) — připraveno ke spuštění
Skripty: research-prep/source-rank-x-brand-prior/run_study_v2.py, analyze_results_v2.py, STUDY-DESIGN-v2.md (dry-run OK, 8 400 volání, 25 podmínek). Testuje: bez instrukce, zdroj v user zprávě, nedůvěryhodný/sponzorovaný zdroj, pořadí vs. rating konflikt, gradient pozic, reálné značky. Po výsledcích: FINDINGS, stránka Study #47 + wiring (46→47).

## Nový kandidát: Press s fakty vs. generický press (z výměny s Mansoor Ali)
Hypotéza (Mansoor Ali, LinkedIn): hodnota třetí strany není v existenci zmínky, ale v informaci, kterou model může ověřit a použít (zdroj spojující značku s kategorií / use case / schopností).
Máme: Cold Start (#46) press 1,9 % vs. review score 53,1 %; Fact Injection +77,9 pp. Neměřeno: press zmínka nesoucí konkrétní fakta vs. generická zmínka.
Návrh: Cold Start geometrie (fiktivní nováček vs. incumbent, 36 intentů × 10 běhů), podmínky: žádný důkaz / generický press ("featured in X") / press s kategorií a use case / press s ověřitelnými čísly (specs, cena) / rating (kotva). Čistý kontrast generický vs. s fakty. Žádný slib veřejně; zmínit jen "may come back with numbers" pokud Daniel zvolí.
Souvisí: Source authorship (A2), Copy Relevance (#28), Mansoor Ali čeká na výsledky Copy Relevance.
**PŘIPOMENOUT DANIELOVI po dokončení: poslat výsledky Mansoor Ali (LinkedIn, slíbeno veřejně v komentáři: "I'll add it to our roadmap and run it, then share the results here").**

## Source Rank × Brand Prior v2 — HOTOVO (FINDINGS-v2.md)
Instrukce/umístění/zdroj nevadí; žádný gradient (vyšší pozice vyhrává vždy, i 1 vs 2); reálné značky stejně; blog bez efektu, "sponsored" štítek −22 pp; rank 1 + 3,4★ stále 86 %, rank 4 + 4,9★ 1,7 %. Zbývá kontrola v3 (neřazený seznam, run_study_v3_control.py, 1 440 volání) a volitelně replikace na druhém modelu → pak Study #47.

## Publikováno (připraveno k deployi): Study #47 Source Rank × Brand Prior
research/source-rank-brand-prior.html. Kontrola v3 (neřazený seznam 0,8 %) uzavřela námitku "první v seznamu". Napojeno: route (vercel.json), sitemap-pages.xml, llms.txt, footer link (168 stránek), počty 46→47, mechanism-studies (37 studií), index (report-card + finding-card data-key 45), how-ai-decides. Zbývá: deploy (commit/push), případně replikace na druhém modelu.

## Později: Zenodo nová verze k #22 (Recommendation Confidence)
Doplnit odkaz na follow-up Phrasing Stability by Signal (ceny se při přeformulování mění, rating ne) a addendum o logprob gap (AUC 0,855). LinkedIn příspěvek o #22 zůstává beze změny (shodný se Zenodem).

## Pozorování: Founder Lab (founder.atomfoundry.dev) — bingbot chodí jen na home
Widget "Agent activity" (8. 10. 2026): 1 unikátní bot (bingbot, typ SEARCH), návštěvy jen na `home` (před 16 h, 1 d, 8 d, 9 d, 22 d). Žádné produktové stránky, žádní AI boti (GPTBot / ClaudeBot / PerplexityBot).
Co ověřit: Bing Webmaster Tools (sitemap odeslán? kolik URL zaindexováno?), IndexNow, robots.txt Shopify obchodu (blokuje produktové cesty?), sitemap Founder Labu.
Souvislost: Bing index slouží jako zdroj pro některé AI vyhledávače (ChatGPT search ho využívá, ne výlučně). Neindexované produkty = nemají odkud být načteny. Testovací obchod pro měření bot návštěv (Study 5 / own crawl logs).

## Hotovo: Signal Effect Ladder (2026-10-08), studie 1 z 5 bez API volání
`research-prep/signal-effect-ladder/LADDER-FINAL.md` + `ladder_final.json` + `build_ladder.py`: 40 řádků (signál x studie) na jednotné míře (pp nad vlastním baseline signálu, z uložených results*.json), s cluster-CI tam, kde existuje (36 intentů), a jistotou Strong/Medium/Weak (replikace x šířka). Hlavní zjištění: pozice ve zdroji a rating s dostatkem recenzí jsou nejsilnější a nejlépe podložené (±100 pp, replikováno přes 36 intentů); autorita/familiarita samy 65-85 % follow, ale vedle ratingu mizí; formát ≈ 0 nebo záporný; press 1,9 % a objem 0,3 %. Nejslabší důkazy (nepoužít jako páteř playbooku bez replikace): Hidden Context (5 značek, široký CI), Fact Injection (4 ručně vybrané značky). Nepublikováno jako stránka; podklad pro Brand Playbook. Další z pěti: viz přehled.
**Později (Daniel 2026-10-08):** Signal Effect Ladder publikovat jako samostatnou syntézní stránku v research/ (označit "Synthesis", nepočítat do čísla studií, odkaz z how-ai-decides); nepoužít Weak řádky (Hidden Context, Fact Injection) bez označení; zdůraznit nesrovnatelnost "follows" řádků. Zatím nic nedělat.

## Připraveno: Press with Facts vs. Generic Press (2026-10-08)
research-prep/press-with-facts/ (STUDY-DESIGN.md s předregistrovanými H1-H4, run_study.py, analyze_results.py; dry-run OK, 2 160 volání, 6 podmínek: none / press_generic / press_fit / press_facts / press_fit_facts / review_direct). Slib Mansoor Ali: po dokončení mu poslat výsledky.

## Hotovo: Press with Facts (2026-10-08), FINDINGS.md
generic press 1,9 % (= none, replikuje Cold Start); press s fit na přesný dotaz 80,6 %; press s fakty (4,7★/500) 52,8 % ≈ přímé recenze 51,9 %; fit+fakty 96,9 %. H2 vyvrácena (fit přidal +78,6 pp, čekali jsme málo). Caveat: "top choice for přesný dotaz" je blízké přímému doporučení, ne neutrální relevance. Doporučená kontrola před publikací: press jen na úrovni kategorie / sousedního use case. **PŘIPOMENOUT: poslat výsledky Mansoor Ali (veřejný slib).**
**Kontrola k Press with Facts (2026-10-08):** run_extra.py (1 080 volání: press_category, press_adjacent, press_offtopic), analyze_results.py upraven (`python3 analyze_results.py press_raw.csv press_extra_raw.csv`). Po doběhnutí: FINDINGS, stránka Study #48 + wiring (47→48), odpověď Mansoor Ali.

## Publikováno (připraveno k deployi): Study #48 Press with Facts (2026-10-08)
research/press-with-facts.html. Kontrola: category-level 15,0 %, adjacent use case 0,0 %, off-topic 0,0 % (exact query 80,6 %) = efekt je o shodě s položeným dotazem. Napojeno: route, sitemap, llms.txt, footer (169 stránek), počty 47→48, mechanism-studies (38), index (data-key 46), how-ai-decides. **PŘIPOMENOUT: odpověď Mansoor Ali (komentář připravit s kompletním obrazem včetně kontroly).**

## Publikováno (připraveno k deployi): Founder's Reality Check #12 "The Work Nobody Asked Me to Do." (2026-10-08)
the-work-nobody-asked-me-to-do.html; napojeno: hub (JSON-LD ListItem 12, bublina Entry 012, view-transition, footer), #11 (Next entry + footer), #10 (footer), vercel.json route, sitemap-pages.xml.

## Kandidát: Review Recency (zdroj: Mikko Rekola post, 12. 10. 2026)
- Tvrzení k ověření: "LLM i agenti preferují čerstvé recenze; 30 000 recenzí z let 2020–2022 váží míň než nedávné." Zatím NEMÁME data (v komentáři přiznáno: "haven't tested it yet").
- Design (navazuje na Cold Start #46): fixní hodnocení a počet recenzí, mění se jen stáří: bez data / 3 měsíce / 1 rok / 3 roky; případně stejné skóre starší vs. mladší u konkurenta. Metoda jako ostatní: gpt-4o, forced choice, cluster bootstrap přes intenty, permutační testy, Bonferroni.
- Omezení k uvedení na stránce: recenze jsou text v promptu, testujeme reakci modelu na zmínku o stáří, ne způsob, jakým reálný agent řadí/filtruje recenze.
- Pozn.: komentář pod Mikkovým postem nic neslibuje; studie je volitelná.

## Classification → Candidacy: design hotový (2026-10-12)
Složka `research-prep/classification-candidacy/` (STUDY-DESIGN.md, run_study.py, analyze_results.py; dry-run ověřen). Nový design místo čistě pozorovacího: 10 vymyšlených B2B SaaS firem, cílová firma soutěží s 11 konkurenty o shortlist 3 (šance 25 %); podmínky core_clear / secondary_dominant / hierarchy_explicit (stejná fakta, jiná váha) + kontrola no_target; měří se inclusion a klasifikace (judge). ~1,200 volání. Důvod: Brand Legibility narazil na strop (firma bez konkurence ~100 %). Status: čeká na spuštění Danielem.

## Nápad: Repeat Retrieval (zdroj: Mariia Skula post, 12. 10. 2026)
- Pozorování: ChatGPT načetl tutéž stránku dvakrát v jedné session (jednou s UTM chatgpt.com, jednou bez). Mariia z toho usuzuje, že se vrací ke zdrojům, které už vyhodnotil, a že opakované načtení vede k doporučení. Je to jedno pozorování, ne vzorec; alternativy: stejná stránka vrácená více podotazy (fan-out), dvě komponenty (search vs. open).
- K ověření: (1) jak často se stejná URL opakuje napříč podotazy v jedné session, (2) zda opakovaně načtená stránka častěji vede k doporučení značky, (3) co ji opakuje (shoda s podotazy vs. "důvěra"). Vyžaduje živé vyhledávání / logy fan-out, ne closed-book gpt-4o design; navazuje na Live Retrieval a Web Search Rewrites.
- Nezměřeno, v komentáři přiznáno ("we haven't tracked repeat retrieval itself"). Status: nápad, nerealizováno.

## Téma k návratu: Jak se dostat k zákazníkům, ne k oboru (2026-10-12)
Podnět: post Diandry Escobar (publikum, které čte vs. publikum, které platí). Pozorování: většina reakcí na komentáře Daniela jsou GEO/SEO konzultanti a lidé z oboru (Semrush, Peec, agentury); kupující Atom Foundry jsou majitelé e-shopů a značek. Nejsou k tomu data, jde o marketingovou úvahu.
Nápady k rozpracování:
1. Jazyk kupujícího: "AI doporučuje vašeho konkurenta a vy nevíte proč" místo R²/bootstrap; studie jen jako důkaz.
2. Kde jsou kupující: komentovat u e-commerce/founder lidí (Svenson, Rekola, Shopify prostředí), ne jen u GEO nástrojů.
3. Vstup pro zákazníka: scan/audit webu ("koho AI doporučuje místo vás") jako první krok, studie jako důvěryhodnost.
4. Vlastní posty zakončovat výzvou pro majitele značek; připravit 2–3 posty z posledních studií psané pro majitele e-shopů bez žargonu.
5. Měřit, odkud chodí první konverzace (DM, scan, návštěvy) a podle toho přesunout čas.
Status: zapsáno, k návratu.

## Classification → Candidacy: výsledky v1–v3 (2026-10-14)
- v1 (10 kat.): core 100 / secondary-dominant 73 / hierarchy-explicit 74 %.
- v2 (20 kat., konkurenti stejně bohatí, klasifikace výběrem z možností): core_clear 82.8, secondary_dominant 24.0, hierarchy_explicit 27.5 % (−58.8 pp, p_bonf 0.0003; explicit hierarchy −3.5 pp n.s.); klasifikace jádra 100 % ve všech podmínkách → misklasifikace není mechanismus.
- v3 (1 800 volání): core_clear 87.7, secondary_first_core_heavy 59.0, balanced_core_first 61.0, core_first_secondary_heavy 45.0, secondary_dominant 27.7, template_twin (základ) 50.0 %. Váha: −42.7 pp (core-first); pořadí: −28.7 pp (core-heavy) / +17.3 pp (secondary-heavy). core_clear vs twin +37.7 (p 0.009); secondary_dominant vs twin −22.3 (p_bonf 0.31, n.s.). Základ není 25 % (twin 50 %), úrovně neinterpretovat, jen rozdíly.
- Závěr: AI zařadí firmu správně, ale na shortlist ji dá, když jádro vede a tvoří většinu textu; deklarace kategorie nepomáhá. Status: čeká na publikaci jako Study #49; slib Silvii (komentář s čísly) stále otevřený.

## Study #49 Classification → Candidacy publikováno a zapojeno (2026-10-14)
Stránka `research/classification-candidacy.html`; zapojeno: footer (172 stránek), počet studií 49 (174 stránek), mechanism-studies (karta + "39 studies"), research/index (karta + finding-card data-key 47), how-ai-decides (odkaz + mini-karta), llms.txt (+ "49 studies and counting"), sitemap-pages.xml, vercel.json. K nasazení: commit/push. Dále: komentář pro Silvii s čísly po nasazení.

## Připraveno: Review Recency (2026-10-15)
Složka `research-prep/review-recency/` (STUDY-DESIGN.md, run_study.py, analyze_results.py; dry-run ověřen). 12 podmínek (nedatované, čerstvé, staré 4 roky, rozložené, smíšené, 30 000 starých vs. nedatovaných, čerstvé malé, pokles/zlepšení hodnocení za poslední 3 měsíce), 4 320 volání. Podnět Mikko Rekola. Status: čeká na spuštění Danielem.

## Hotovo: Review Recency (2026-10-15), 4 320 volání
Výsledky (selection nováčka): baseline_undated 50.8, recent_all 72.8 (+21.9, p_bonf 0.0009), old_all 0.0 (−50.8), mixed_mostly_old (450 starých + 50 čerstvých) 0.0, spread (rovnoměrně 5 let) 60.8 (+10.0, n.s. p 0.15), old_large (30 000 starých) 1.4 vs undated_large 71.1 (−69.7), recent_all (500) vs old_large (30 000) +71.4, recent_small (40) 36.9 vs undated_small 22.5 (+14.4, p 0.0099), decline (4.7★ celkově, 3.8★ za 3 měsíce) 2.5 (−48.3), improve (3.8★ celkově, 4.7★ za 3 měsíce) 10.6 vs low_undated 0.0 (+10.6, p 0.0045). Mikkovo tvrzení potvrzeno. Limity: relativní data v promptu, jeden model, fiktivní značky; staré recenze fungují jako "žádný důkaz" (0 %), ale může jít i o čtení "nic nového = neaktivní značka". Status: čeká na rozhodnutí o publikaci (Study #50). Mikko Rekola slíbil "data later this month", možná jiný zdroj.
