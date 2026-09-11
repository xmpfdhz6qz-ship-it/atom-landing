# Atom Foundry — audit výzkumu (2026-09-16, interní, neveřejné)

Kompletní průchod všech 22 publikovaných studií + flagship + 5 category reports.
Účel: (1) co máme změřeno, (2) co nemáme změřeno, (3) co by se ještě dalo
změřit, (4) cross-study analýza — hledání souvislostí, které jsme si
nevšimli, když jsme studie dělali jednu po druhé.

---

## ČÁST 1 — CO MÁME ZMĚŘENO

### Master finding (potvrzeno nezávisle 4×)
Napříč Fame Study, The Model Predicts Itself, Memory Source a Candidacy vs
Selection platí stejný vzorec: **externí signály (kvalita obchodu, sláva,
veřejná stopa) vysvětlují recommendation frequency z 0,2–11,2 %. Vlastní
minulé chování modelu vysvětluje 54,4–61,4 % (Pearson) / 91,3 % (Spearman).**
Tohle je nosná teze celé série, potvrzená čtyřmi nezávislými měřeními, ne
jedním.

### Po fázích decision path

**Retrieval — měřeno.** Web search on/off mění 77 % (76,9 %, CI 74–80 %,
n=500/kategorie). Model-swap efekt 68,9 % (CI 66–71 %). Noise floor bez
search 46–47 %, se search 27 %. (Study #1)

**Understanding — měřeno.** Zapnutí search nemění jen značky, ale i slovník
— největší posun "monohydrate" 21×. (Study #5)

**Candidacy — měřeno.** Intent-signál jediný smysluplný prediktor candidacy
(39 % vyšší u doporučených), drží napříč 9/9 niches. Frekvence uvnitř
doporučené množiny R²=1,2 %. (Study #6) Cold-start brand 0/360 bez důkazu,
recenze otevřou dveře v 53,1 % (Study #20). Hidden context zvedne candidacy
na 97–100 % u skoro všech značek. (Study #26)

**Evaluation — měřeno.** Rating+recenze 100 % follow rate (160/160, nulová
variance). Specs 81,9 %. Cena 60,6 % (na hraně, p=0,055). (Study #19)

**Recommendation — měřeno.** Flagship + 5 category reports (20 000
doporučení, 1 490 značek): korelace skóre vs frekvence r=-0,37 až +0,17,
žádná kategorie smysluplně pozitivní. Confabulace: 90 % unikátních důvodů
(26 812/29 633). (Studies flagship, #4)

**Memory — částečně měřeno.** Wikipedia samotná 1,2 % (opravený Fame Study).
4 signály kombinovaně 11,2 % (Memory Source). Model zná doménu značky ze
75,9 %. Possession-deployment gap 83,6 % (fakt, co model tvrdí že zná, se
nepoužije). Fact injection lift 77,9pp průměrně.

**Stability — měřeno/rostoucí.** Mezi-session lock-in 86 % stejná #1 značka
po 58 dnech (6 sweepů). Uvnitř konverzace T4 survival 49,5 % (CI 25,5–74,5 %,
n=200), s korelací na baseline recommend rate r=0,68 (p=0,048, n=9).

**Confidence — měřeno.** 7 metod, cross-model replikace (GPT-4o/Claude/
Gemini). Hedge language nekoreluje s reálnou logprobs-jistotou (r=0,035) ani
se self-reportem (r=0,032). Self-report vs reálná jistota r=0,345 (slabě
souvisí). 16/16 intentů stejný vítěz napříč 3 modely.

---

## ČÁST 2 — CO NEMÁME ZMĚŘENO

1. **Purchase — nula studií.** Jediná fáze s 0% pokrytím. Blokováno na
   dostupnosti agentic commerce dat.
2. **Winner vs Loser (post-hoc kauzalita důvodů) — "Active Research", žádná
   dedikovaná studie.** Máme jen, že důvody jsou 90% unikátní (confabulace),
   ne proč model vybral zrovna tenhle winner.
3. **Cross-model generalizace — skoro nic mimo Confidence Study.** Memory,
   Retrieval, Understanding, Candidacy, Evaluation, Recommendation, Stability
   jsou všechny měřené prakticky výhradně na gpt-4o. Jediná výjimka: Confidence
   Study Method 7, a to jen na 16 fixních scénářích jednoho typu signálu
   (rating), ne napříč celou sérií.
4. **Cross-platform retrieval (Perplexity vs plain ChatGPT) — 0 studií.**
   Blokováno na API klíčích.
5. **Skutečný kauzální field test — 0 studií.** Všechny kauzální důkazy
   (fact injection, hidden context) jsou simulované vložení do promptu, ne
   měření na reálném, živě crawlovaném obchodě. Founder Lab field test by
   byl první.
6. **Mechanismus "paměti" — neznámý, nazváno "the wall" přímo ve Study #1.**
   Víme, že self-consistency vysvětluje 61,4 %, ale ne CO v trénovacích
   datech tuhle paměť vytváří. Memory Source (11,2 % kombinovaně) tenhle
   wall neprorazila, jen potvrdila, že to nejsou veřejné signály.
7. **Reálná míra vytažení faktu retrievalem.** Fact Injection sama přiznává,
   že testuje jen "co se stane, když fakt je přítomen", ne "jak často by ho
   reálný retrieval systém skutečně našel".

---

## ČÁST 3 — CO BY SE JEŠTĚ DALO ZMĚŘIT

Kromě už naplánovaných (Cross-model paměť, Study #27 cross-platform, Study
#28 Founder Lab, Purchase) jsem při průchodu dat narazil na čtyři konkrétní,
levné, dosud nenavržené možnosti:

**A. Cross-study korelační matice na Wave-1 kohortě (nulová cena, žádné nové
API volání).** Bellroy, Peak Design, Rumpl, Caraway, Onyx Coffee Lab, Branch,
Boll & Branch, Wild One, Topicals, Zigpoll se opakují napříč Possession-
Deployment, Multi-turn Displacement, Fact Injection i Hidden Context. Nikdo
zatím nedal jejich čísla vedle sebe do jedné tabulky a nespočítal korelace
mezi nimi. Vidím tam už teď z hlavy dvě anomálie (viz Část 4), co by
formální tabulka buď potvrdila, nebo vyvrátila.

**B. Nezávislý soudce na už publikovaných kauzálních studiích (#23–26).**
Study #22 (Confidence) použila Claude jako slepého soudce vedle gpt-4o a
zjistila 66% shodu — ne 100%. Studie #23–26 se ale samy hodnotí gpt-4o
soudcem, co hodnotí gpt-4o odpovědi, mitigováno jen malými ručními
spot-checky (3/3, 17/17, 14/15). Přehodit Claude jako nezávislého soudce
přes existující data (žádné nové generování, jen re-scoring) by řeklo, jak
moc se dá věřit self-grading číslům.

**C. Skutečná míra vytažení faktu živým retrievalem.** Vzít stejné fakty
jako Fact Injection, ale místo vložení do promptu je dát na reálnou webovou
stránku a měřit, jak často je search-on model (Study #1 setup) sám od sebe
vytáhne. Přemostí mezeru mezi "co se stane když je fakt přítomen" a "jak
často se tam vůbec dostane".

**D. Kategorie Pets jako anomálie.** Jediná kategorie se signifikantní
(byť slabou) korelací mezi skóre a frekvencí — a je negativní (r=-0,366).
Testoval jsem hypotézu, že za tím je podíl marketplaces, ale čísla to
nepodporují čistě (Home & Living má vyšší marketplace share, 20,9 %, a
přesto pozitivní r). Nevíme proč je Pets jiná. Stálo by za dedikovaný
rozbor — možná specifika kategorie (veterinární důvěra, jiný typ
rozhodování).

---

## ČÁST 4 — CO JSEM SI VŠIML PŘI PRŮCHODU (cross-study nálezy)

**1. Tři různé korelace "baseline recommend rate vs X" míří různým směrem,
a nikdo je zatím nedal vedle sebe:**
- vs deployment rate (Possession-Deployment): r=-0,27, n=9, není signifikantní
- vs T4 conversational survival (Multi-turn): r=+0,68, p=0,048, n=9
- vs candidacy/winner lift z hidden context (Hidden Context): r=-0,63/-0,73, n=5

Silné značky si tedy nedrží svou sílu stejně ve všech třech dimenzích —
baseline síla predikuje, jestli přežijete v konverzaci, ale ne, jestli
"použijete" fakta o sobě, a slabé značky mají naopak nejvíc co získat z
exponování. To jsou tři různé mechanismy, ne jeden, a zasloužily by si
společnou tabulku (viz bod A výše).

**2. Wild One je konzistentní anomálie.** Possession-deployment rate 25 %
(jedna z vyšších v kohortě) — ale T4 survival jen 5 %, druhá nejhorší,
vytlačena Ruffwearem 18 z 20 konverzací navzdory uměle příznivému úvodu.
Značka, co "umí použít fakta o sobě", ale nedrží pozici v delší konverzaci
proti silnému category-default konkurentovi. Naznačuje, že "znalost faktů"
a "konverzační stabilita" jsou opravdu oddělené věci, ne dvě strany stejné
mince.

**3. Zigpoll je opačná anomálie.** Nejhorší reálný baseline (skoro
neviditelný), ale nejtěsnější vazba fakt→použití při fact injection (88,3 %,
ratio 1,09 — nejtěsnější v celé studii) a nejvyšší possession-deployment
rate (40 %, byť na n=5 nespolehlivé). Naznačuje, že Zigpollův problém je
čistě Candidacy/viditelnost, ne neschopnost fakta použít — jakmile se
dostane do hry, hraje efektivně.

**4. Hedging language je odpojený od tří různých věcí najednou, ne jen
jedné.** Nekoreluje s reálnou logprobs-jistotou (r=0,035), nekoreluje se
self-reportem (r=0,032, ale self-report koreluje s logprobs r=0,345 — model
má nějaký vnitřní signál, jen ho neukazuje v hedging jazyce), a nekoreluje s
repetition-stabilitou (r=-0,09 až +0,11 napříč 4 datasety). Model "ví" něco o
vlastní jistotě interně, ale jeho slovní vyjádření jistoty s tím nesouvisí
prakticky vůbec.

**5. Dvě replikace AIVO metodologie, dva různé směry odchylky.**
Possession-Deployment naměřila vyšší gap než AIVO (83,6 % vs 75,7 %, +7,9pp).
Multi-turn Displacement naměřila výrazně vyšší survival než AIVO (49,5 % vs
12,7 %), ale s otevřeně přiznaným metodologickým rozdílem (náš T1 je uměle
příznivý). Ukazuje, že čísla jsou citlivá na detaily nastavení — replikace
"stejné" metodiky jinou laboratoří nedává stejná čísla, což je důležité vědět
než se cokoliv z těchhle čísel cituje jako univerzální konstanta.

**6. Self-grading risk je systémový, ne izolovaný.** Studie #22, #23, #24,
#25 všechny nechávají gpt-4o generovat i hodnotit vlastní odpovědi,
mitigováno jen malými ručními spot-checky. Jen Study #22 (Confidence)
jednou použila nezávislého soudce (Claude) a našla 66% shodu, ne 100%. To
je jediný přímý důkaz, jak moc se dá self-grading číslům věřit — a týká se
to jen jedné studie ze čtyř, co na self-gradingu stojí. (Viz bod B v Části 3.)

---

## SHRNUTÍ

Máte silně, nezávisle potvrzenou centrální tezi (self-konzistence >>
externí signály) a solidní pokrytí 6 z 9 fází decision path. Nejslabší
místa: Purchase (nula), cross-model platnost (skoro nic mimo jednu studii),
a kauzalita v reálném světě (všechno kauzální zatím jen v simulovaném
promptu). Čtyři nové, levné analýzy (A–D výše) by šly udělat bez nových API
volání nebo s minimálními náklady, a už teď ukazují na dvě konkrétní
značkové anomálie (Wild One, Zigpoll) a jednu kategorijní anomálii (Pets),
co stojí za formální rozbor.
