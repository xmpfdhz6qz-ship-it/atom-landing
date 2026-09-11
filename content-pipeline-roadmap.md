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
