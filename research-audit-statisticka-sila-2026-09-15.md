# Atom Foundry — audit statistické síly (#406, 2026-09-15, interní, neveřejné)

Podnět: LinkedIn post Agnes Kaczmarek citující "The Dice Roll Method"
(Żatuchin, arXiv:2609.04047, 3.9.2026) — protokol pro repeated-query
auditing LLM doporučení. Reálné jádro paperu: G-theory decompozice
variance, tři úrovně opakování (exploratory n=5/G=0,58, confirmatory
n=10/G=0,74, rigorous n=15/G=0,81), ALE s výslovnou výhradou, že pevné
tiery "netransferují" mezi datasety — autor doporučuje "pilot-then-solve":
změřit vlastní variabilitu, ne slepě převzít cizí číslo opakování.

Cíl auditu: neopakovat cizí čísla, ale změřit vlastní variabilitu na
vlastních datech a zjistit, jestli některé publikované závěry přežijí
přísnější test. Použita existující raw data (`judged.json` / `judged_v2.json`
v `research-prep/*/`), žádná nová API volání.

---

## Shrnutí (pro netrpělivé)

**Dobrá zpráva:** hlavní "samotný signál" claimy (Authority 85,2 %, Brand
familiarity 79,8 %, a pravděpodobně i starší studie stejného typu) jsou
extrémně robustní. Přežily i mnohem přísnější test, než jaký byl původně
použit.

**Špatná zpráva:** claim, který teď žije na `authority-signal.html` a je
citovaný jako odlišující faktor na `brand-familiarity.html` a
`how-ai-decides.html` — že autorita má "reálný, v obou kolech se opakující
1,5bodový zbytkový vliv i proti ratingu" — **tenhle konkrétní dílčí claim
přísnější test nepřežil.** Je nerozeznatelný od šumu (p≈0,55–0,60 místo
"p<0,05"). Detaily níže.

Nic z tohohle neznamená přepočítat celou sérii nebo sbírat nová data.
Znamená to: (1) vědět, který konkrétní claim je slabý, (2) buď ho v kopii
zjemnit, nebo ho doměřit na víc intentů, pokud na něm Danielovi záleží.

---

## Metodika auditu

Původní "primary evidence" test u tří nejnovějších dvoufázových studií
(Winner vs Loser #33, Authority Signal #34, Brand Familiarity #35) je
likelihood-ratio test na `smf.logit(...)` bez klastrování — každý
jednotlivý AI call (5 opakování × 20 intentů × 4 značky × 2 kola) je v
tomhle testu považován za nezávislé pozorování. To není pravda: 5 opakování
na stejný intent + stejnou dvojici značek sdílí stejný systémový prompt a
nejsou nezávislá ve statistickém smyslu. Skutečná nezávislá jednotka je
**intent** (20 intentů × 4 značky = 80 klastrů na kolo), ne jednotlivý call.

Starší studie v sérii (Volba kandidáta / candidate-evaluation, Cold Start,
Multi-turn Displacement) tohle už řeší správně — cluster-bootstrap CI a
permutation test na úrovni intentů, ne jednotlivých callů. Tenhle audit
aplikuje stejnou (už v sérii zavedenou) metodu zpětně na Authority Signal a
Brand Familiarity, aby šlo srovnat jablka s jablky.

Test použitý v tomhle auditu: cluster-permutation test (100 000 permutací,
resampling na úrovni intentu), stejná rodina metod jako `analyze_results.py`
u Volba kandidáta.

---

## Zjištění 1 — hlavní claimy jsou v pořádku

Přepočet Phase 1 ("samotný signál") s klastrováním na intent (80 klastrů
na kolo, 160 kombinovaných):

| Studie | Publikovaný claim | Cluster-permutation přepočet |
|---|---|---|
| Authority Signal, kolo 1 | 85,5 % (n=800, p=8,97e-72 nezklastrováno) | 85,5 %, 95% CI [81,5–89,2 %], p<0,00001 |
| Authority Signal, kolo 2 | 84,8 % | 84,8 %, 95% CI [80,6–88,8 %], p<0,00001 |
| Brand Familiarity, kolo 1 | 80,6 % (p=8,97e-72 nezklastrováno) | 80,6 %, 95% CI [75,9–85,1 %], p<0,00001 |
| Brand Familiarity, kolo 2 | 78,9 % | 78,9 %, 95% CI [74,2–83,4 %], p<0,00001 |

I s 80–160 nezávislými klastry místo 800–1600 nezávislých "callů" zůstává
efekt masivní a jasně mimo šum. **Přesná čísla p=8,97e-72 apod. jsou
artefakt nezklastrovaného testu a neměla by se v kopii uvádět s tímhle
řádem přesnosti** (permutation test na 100 000 iterací nenašel ani jednu
extrémnější hodnotu, takže reálně "p<0,00001", ne "p=10⁻⁷²"), ale kvalitativní
závěr — samotný signál rozhoduje ~80–85 % — obstojí i v přísnějším testu.
Žádná akce nutná kromě jazykového zjemnění p-hodnot v kopii, pokud chce
Daniel být maximálně přesný.

## Zjištění 2 — "zbytkový vliv proti ratingu" nepřežívá klastrování

Tohle je hlavní finding auditu. Authority Signal Phase 2 tvrdí (viz meta
description, OG tagy i JSON-LD na `authority-signal.html`): *"once rating
is in the same comparison, authority's own lift falls to 1.5 points,
direction holds in both rounds."* Stejné číslo je odrazovým můstkem pro
srovnání s Brand Familiarity (+0,2/+0,4bodu) na `brand-familiarity.html` a
zmíněné v bonus sekci `how-ai-decides.html`.

Cluster-permutation přepočet na stejných datech (rating = brand v
nevýhodě, srovnání "autorita nedaná" vs "autorita daná znevýhodněné
značce", 80 klastrů na kolo):

| Studie / strana | Baseline | S bonusem | Rozdíl | Cluster-permutation p |
|---|---|---|---|---|
| Authority, znevýhodněná strana, kolo 1 | 9,2 % | 12,5 % | +3,2pb | **p=0,548** |
| Authority, znevýhodněná strana, kolo 2 | 9,2 % | 12,0 % | +2,7pb | **p=0,605** |
| Authority, zvýhodněná strana, obě kola | 100,0 % | 100,0 % | 0,0pb | p=1,000 (strop, žádný prostor) |
| Brand Familiarity, znevýhodněná strana, kolo 1 | 10,8 % | 11,8 % | +1,0pb | p=0,901 |
| Brand Familiarity, znevýhodněná strana, kolo 2 | 10,8 % | 11,5 % | +0,7pb | p=0,888 |

Směr je konzistentní (vždy kladný, v obou kolech), ale při 80 nezávislých
klastrech na kolo je i +2,7 až +3,2 bodu naprosto v mezích šumu. Brand
Familiarity stránka už tohle správně přiznává ("H2 not confirmed") —
Authority Signal stránka to naopak prezentuje jako potvrzený, replikovaný
efekt. Nesoulad je právě tady: **oba nálezy jsou statisticky stejně slabé,
ale popsané jsou různě sebejistě.**

## Zjištění 3 — starší hraniční claimy jsou správně označené, ne chybné

Volba kandidáta (`candidate-evaluation.html`), cenový signál: flip rate
26,9 % (95% CI 15,6–38,7 %) vs noise floor 11,2 %, p=0,0547, verdikt
"Nothing" — tohle už bylo správně změřené cluster-permutation testem (16
intentů = 16 klastrů) a správně popsané jako neprůkazné. Není co opravovat,
je to ukázka toho, jak by měly vypadat i ty tři novější studie.

PDP-specificity, BodyArtForms (9–12 % dopad specifických tvrzení vs
83–93 % u Colored Organics): tohle není podhodnocený vzorek (n=100 na
buňku), je to pravděpodobně reálný, jen malý efekt u téhle konkrétní
značky — stejný vzor jako Barbaro Mojo v Brand Familiarity (near-chance
outlier). Není potřeba nové měření, jen v kopii pojmenovat jako "menší
efekt u téhle značky", ne "žádný efekt".

---

## Doporučení, seřazené podle ceny

1. **Zdarma, ihned proveditelné:** upravit `authority-signal.html` (meta
   description, OG, JSON-LD, tělo stránky) tak, aby "1,5bodový, v obou
   kolech se opakující zbytkový vliv" už nebylo prezentované jako potvrzený
   efekt, ale jako směrově konzistentní, ale statisticky neprůkazný
   signál — stejným jazykem, jaký už používá Brand Familiarity ("H2 not
   confirmed"). To zároveň sjednotí srovnání mezi oběma studiemi (obě mají
   ve skutečnosti stejný výsledek: silný samotný signál, žádný prokázaný
   zbytkový vliv proti ratingu).
2. **Zdarma, volitelné:** zjemnit p-hodnoty typu "p=8,97e-72" napříč
   Winner vs Loser / Authority / Brand Familiarity na "p<0,0001" nebo
   podobně, protože přesná čísla jsou artefakt nezklastrovaného testu.
   Kvalitativní závěr se nemění, jen přesnost čísla.
3. **Vyžaduje nová data, pokud Daniel chce claim zachránit v současné
   podobě:** rozšířit Authority Signal Phase 2 ze současných 20 intentů na
   odhadem 60–80 intentů na stranu, aby 2,7–3,2bodový efekt měl šanci
   projít clusterovaným testem (hrubý odhad, ne formální power analýza —
   lze dopočítat přesně, pokud se Daniel rozhodne pro tuhle cestu).
4. Do budoucna: u nových dvoufázových studií rovnou používat
   cluster-bootstrap/permutation metodu (jako Volba kandidáta, Cold Start),
   ne nezklastrovaný LR test jako "primary evidence". Nejlevnější pojistka
   proti stejné chybě příště.

Status: audit hotový, čeká na Danielovo rozhodnutí u bodu 1 (přepsat
kopii) vs bodu 3 (doměřit).
