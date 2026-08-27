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

**3. Zdroj paměti — DALŠÍ NA ŘADĚ**
Otázka: Co přesně tu paměť vytváří (širší otisk než jen Wikipedia)?
Rozsah zúžen (2026-08-27, Daniel): jen OpenAI, bez cross-model srovnání —
to je zaparkované jako navazující studie, až budou k dispozici
Anthropic/Google klíče.
Metoda: znovupoužije stejný closed-book baseline (50 promptů, žádné
search, žádná injektovaná fakta) jako Volba kandidáta/Cold start, pak pro
každou značku, co se v datech objevila, stáhne 4 volně dostupné signály
bez API klíče — Wikipedia pageviews, počet jazykových verzí na
Wikidatech, stáří domény (WHOIS), objem mediálních zmínek (GDELT).
Korelace/regrese proti frekvenci doporučení, srovnání s 1,2% baseline z
The Fame Study.
Status: **PŘIPRAVENO K SPUŠTĚNÍ.** Kompletní balíček v
`research-prep/zdroj-pameti/`: STUDY-DESIGN.md (hypotézy, design,
statistika), phase1_prompts.json (stejných 50 promptů), run_study.py
(otestováno --dry-run bez chyby, kroky phase1/aggregate/footprint),
analyze_results.py (bootstrap CI + permutační test + kombinovaný regresní
model), README.md (jak spustit, včetně zkratky na přeskočení Phase 1
reuse ze dvou předchozích studií). Chybí jen OPENAI_API_KEY (+
`pip3 install openai python-whois numpy`) a spustit `python3 run_study.py all`.

**Bonus track — doporučení → nákup (dlouhý horizont)**
Otázka: Vede doporučení k reálnému nákupu?
Proč bonus/později: závisí na dostupnosti agentic commerce dat (ChatGPT
Shopping apod.), zatím nemáme snadný způsob měření.
Status: zaparkováno, sledovat vývoj agentic commerce.

## Poznámka k predikci (2026-08-26)

Až budou hotové 1-3, program pravděpodobně přejde z pozorovacích/korelačních
studií k příčinným experimentům na Founder Lab (vlastní kontrolovaný obchod) —
tj. přestaneme jen měřit, co koreluje, a začneme cíleně měnit jeden signál
najednou a měřit, jestli se doporučení skutečně pohne. To by byl první
skutečný RCT v celé sérii.
