# Atom Foundry — content pipeline roadmap (interní, neveřejné)

Poznámka: pracovní poznámka pro Claude/Daniela mezi sessions, stejný účel jako
research-roadmap.md, jen pro content/distribuci místo výzkumu. Není routovaná,
není veřejná.

## Podnět (2026-09-16)

Daniel poslal cheat sheet "Claude Code for Content" (Alex Vacca & Mai-Lan
Khong, frontal.co) — 7-krokový content pipeline postavený na Claude Code:
Foundation (voice profile, ICP, content pillars) → Research (těžení
Reddit/YouTube/X/web) → Ideation (ranked idea batch) → Hooks (šablony,
varianty) → Copy (draft v zdokumentovaném hlasu) → Grade (skóre, práh na
přepsání) → Deliver (handoff + performance data se vrací zpátky do smyčky).

Rozhodnutí: nepřebírat doslova jejich škálu (58 šablon, 7 paralelních
výzkumníků — to je pro jejich objem obsahu, ne pro nás). Přebrat tvar pipeline
a přizpůsobit vlastnímu archivu (26 studií) a vlastní infrastruktuře
(human-traffic.html, ai-traffic.html jako zdroj performance dat pro feedback
loop). Daniel řekl 2026-09-16: "uloz si to prosim a pridej to do ukolnicku.
udelame to."

## Jak to mapujeme na Atom Foundry

**1. Foundation — chybí, staví se první.**
`voice-profile.md`: Danielův tón (přímý, stručný, bez zbytečností — viz jeho
explicitní preference "co nejvíc stručně a přímo"), čeština v chatu/interních
poznámkách, angličtina na veřejný obsah (LinkedIn/web), pravidla jako "bez
pomlček, bez otazníků, bez uvozovek" (viz LinkedIn post o AI botech,
2026-09-09).
`content-pillars.md`: mechanism studies (Study #21-26), category reports
(/reports/*), founder lab (žurnál), AI traffic zjištění (ai-signal,
ai-traffic).
Propojit s Cowork "my-writing-style" mechanismem, ať se to nemusí odhadovat
znovu každou session.

**2. Research — částečně existuje.**
Máte už z dřívějška: HN profil, Qwoted opportunities monitoring, PR/backlink
kanály. Chybí: systematické sledování, co se ptají ecommerce zakladatelé o AI
visibility (Reddit, X, HN) jako zdroj nových úhlů na existující studie i
nových témat.

**3. Ideation + Hooks — největší páka, zatím neděláme systematicky.**
26 hotových studií = potenciálně 5-10 úhlů na studii (viz dnešní AI-traffic
LinkedIn post jako příklad). Skill, co vezme publikovanou studii a vygeneruje
sadu hook variant + navrhne kanál (LinkedIn/X/HN), by vytáhl měsíce obsahu z
existujícího archivu bez nového výzkumu.

**4. Copy — děláme ad hoc, funguje, ale nekonzistentně bez voice profile.**

**5. Grade — chybí, stojí za přidání.**
Kontrola před publikací proti jednoduché rubrice (přehnaná tvrzení, špatný
framing, přesnost čísel) — relevantní po dnešní zkušenosti s cold-outreach
emailem a s tím, jak snadno se dá overclaimnout (viz "Perplexity dominance"
omyl, co jsme si dnes sami opravili).

**6. Deliver + feedback loop — infrastruktura už existuje, jen není propojená.**
`human-traffic.html` a `ai-traffic.html` sbírají přesně ta data, co by měla
téct zpátky do rozhodování, která témata/formáty dál rozvíjet. Zatím to nikdo
nepropojuje s content rozhodnutími.

## Navržené pořadí stavby

1. `voice-profile.md` + `content-pillars.md` — nejrychlejší, žádné závislosti.
2. Hook/ideation skill nad existujícím archivem studií.
3. Grade rubrika (jednoduchý checklist, ne AI skóre systém jako u nich).
4. Propojení performance dat (human-traffic/ai-traffic) do content rozhodnutí.
5. Research monitoring (Reddit/X/HN témata) — nejnižší priorita, existující
   kanály (Qwoted, HN) zatím stačí.

Další krok: napsat `voice-profile.md` a `content-pillars.md` na základě
dnešní konverzace (LinkedIn post styl, preference stručnosti).

## Formát: krátká videa se čteným slovem (2026-09-09)

Daniel chce ke studiím dělat cca 2minutová videa ve stylu konkurenta AIVO
Meridian (příklad: "The Decision-Maker Has Moved" — černé pozadí, velký
animovaný text/kinetic typography, AI hlas, synchronizované titulky, žádná
tvář, žádné screen recording). Canva Pro už má, návod jak to tam postavit:

1. Nový design → Video. Rozměr podle kanálu (1920×1080 YouTube/LinkedIn,
   1080×1920 Reels/Shorts).
2. Jedna scéna = jedna silná věta na tmavém pozadí (žádné odstavce).
3. Vybrat text → tlačítko Animovat → přednastavená animace (Rise, Vjezd,
   Psací stroj, Zvětšit) = ten "najíždějící velký text" efekt.
4. Appka Text to Speech v levém panelu (Canva Pro) → vložit scénář → vybrat
   hlas/jazyk → vygenerované audio přetáhnout na timeline.
5. Appka Titulky/Captions → automaticky vygeneruje titulky synchronizované s
   audiem, styl doladit v Brand Kitu.
6. Kopírovat stránku pro další scénu, časování stránky sladit s délkou audio
   stopy dané scény.
7. Export → Video → MP4.

Scénář na 2 minuty = cca 260-300 slov. Postup: napsat scénář pro jednu studii
jako vzor, Daniel to jednou proklikne v Canvě, pak opakovat pro zbytek
archivu (26 studií).

## Fronta hotových příspěvků k publikaci

Hotové, schválené drafty, které čekají na zveřejnění (LinkedIn, pokud není
uvedeno jinak). Po publikaci sem doplnit datum/odkaz.

### "Zero demand signal" / Bakery Paradox reakce (2026-09-25) — status: čeká na publikaci

Reakce na dev.to článek "The Bakery Paradox: Why Current AI Agents Keep
Walking Away From Your APIs" (MCP/agentic tooling, viz research-roadmap.md
kandidát "Silent Candidacy Drop" ze stejného dne). Propojuje autorem
popsaný "zero demand signal" problém (agent tiše odejde, když statické
schéma neodpovídá zúženému požadavku) s naším Study #32 (PDP Specificity).

Text (anglicky, k publikaci beze změny nebo s drobnou úpravou):

We measure why AI models pick one brand over another. A dev.to post this
week gave a sharper name to something we already see in the data: the
"zero demand signal" problem.

The setup is simple. A user asks an AI agent for something slightly off
the standard menu, low sugar, under a certain price, a specific variant.
If the product data isn't structured enough to answer that exact ask, the
agent doesn't negotiate. It just walks away. No error, no log, nothing.
The business never learns it lost the sale.

We found the product version of this in our PDP Specificity study. Vague
product pages get picked less often. Concrete ones with real specs and
variants get picked more. What the article adds is a sharper reason why:
at the exact moment a user narrows the ask, an underspecified brand
doesn't just lose, it can disappear from consideration entirely.

As agentic commerce becomes real, structured, negotiable product data
stops being a nice-to-have SEO detail. It becomes the thing that decides
whether an agent even keeps you in the running.

## Strategie: GASP framework aplikovaný na nás (2026-09-28)

Vzniklo z LinkedIn postu Diandry Escobar (Distinctiva.io, content
agentura): klientka s 200 spojeními a nula posty udělala první příspěvek
100K+ impresí (330 reakcí, 82 komentářů, 20 reposty, reální kupující v
komentářích), první měsíc s agenturou 1M impresí. Jejich framework GASP,
čtyři kbelíky obsahu, každý s jedním úkolem:

- **Growth** — dosah, nové oči. Silný, podložený názor ("hot take") do
  vlastního oboru, ne storytelling/cringe post.
- **Authority** — důkaz, důvěra.
- **Sales** — konverze.
- **Personal** — člověk za značkou.

Jejich klíčové pozorování: hot take dělá dvě věci najednou, silný názor
cizí lidi vtáhne, schopnost ho podložit je pak přesvědčí. "Too niche"
je výmluva, ne skutečná bariéra, specifický názor v úzkém oboru se hůř
kopíruje než obecný.

**Proč je tohle pro nás obzvlášť silné, ne jen zajímavý cizí framework:**
klientka v jejich příkladu měla na podložení hot takeu jen roky
zkušeností v oboru. My máme k dispozici 42 publikovaných studií s
tvrdými čísly, tedy přesně ten typ "authority" podklad pod hot take, jen
o úroveň výš (data místo anekdoty). Growth-bucket obsah pro nás by měl
systematicky brát nejvíc kontraintuitivní, nejvíc proti-narativní nález
z archivu a formátovat ho jako názor napřed, důkaz pod tím, ne opačně
(studie napřed, závěr na konci, jak to děláme teď).

**Navrhovaný vzorec pro Growth posty z archivu:** 1) najít nález, který
protiřečí tomu, co si obor myslí (Negative Reputation dnes je učebnicový
příklad, protiřečí Jairo Guerrerově tezi i obecné intuici "špatná pověst
= AI tě vyřadí"), 2) napsat ho jako přímé tvrzení, ne jako "we found
that...", 3) až pak čísla jako důkaz, 4) jedna věta na konec, co to
znamená pro čtenáře.

**První kandidát na Growth post podle tohohle vzorce, hotový draft
(2026-09-28), čeká ve frontě na publikaci:**

We ran a test this week that surprised us.

Everyone assumes a brand with a bad reputation gets quietly filtered
out by AI before it's ever mentioned. We tested that directly on 4 real
brands: neutral reputation vs. a bad one (low rating, real complaint).

Candidacy didn't drop. It went up, 39% to 54.5%.

What collapsed was the final pick. Put head to head against a named
competitor, win rate fell from 83.5% to 24.3%.

A bad reputation doesn't stop you from showing up in AI's answer. It
just guarantees you lose every time it matters.

Status: draft schválený, čeká na publikaci. Navazuje na
research-roadmap.md "Negative Reputation / Shortlist Suppression —
finální výsledek (2026-09-28)" a publikovanou stránku
`research/negative-reputation-candidacy.html`. Do budoucna: použít
tenhle vzorec (kontraintuitivní nález → tvrzení → čísla → dopad) jako
opakovatelnou šablonu pro Ideation/Hooks krok z Claude Code content
pipeline sekce výše, místo řešení úhlu od nuly u každé studie.
