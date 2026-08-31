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

## Poznámka k predikci (2026-08-26)

Až budou hotové 1-3, program pravděpodobně přejde z pozorovacích/korelačních
studií k příčinným experimentům na Founder Lab (vlastní kontrolovaný obchod) —
tj. přestaneme jen měřit, co koreluje, a začneme cíleně měnit jeden signál
najednou a měřit, jestli se doporučení skutečně pohne. To by byl první
skutečný RCT v celé sérii. Aktualizace 2026-08-27: se 3 hotovými studiemi
(Volba kandidáta, Cold start, Zdroj paměti) je tahle podmínka splněná —
kandidát C výše je přesně tenhle krok.
