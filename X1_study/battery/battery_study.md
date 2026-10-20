# Heart X1 battery study (ESTIMATES)
Script: `battery_study.py` -> `battery_study.json`. Published: MTOW 11,340 kg, 4x400 kW, 720 V, 360 kWh (4x90). Everything else is an assumption or a model estimate.

## Assumptions
- MTOW is fixed at 11,340 kg. Battery to shaft to propeller efficiency is 0.707. The usable SOC window is 0.90, and reserves are counted separately on top of it (the old range.m used 0.8 with reserves folded in).
- Taxi: 10 min at 60 kW. Takeoff: 60 s at 1.6 MW. Climb: 1.2 MW from the battery at 65 m/s TAS, with a 0.85 rate-of-climb knockdown. Cruise: 80 m/s. Descent: a glide at 0.8·L/D using 15% of cruise power.
- Reserve options: none / 30 min loiter at 0.8×cruise power / 20 min loiter + 50 km diversion.
- Baseline pack (the real pack mass isn't published): cells at 250 Wh/kg with a cell-to-pack mass ratio of 0.70 give 175 Wh/kg at pack level. A 360 kWh pack is then about 2,060 kg, about 18% of MTOW.
- L/D 21 is optimistic (no gear or cooling drag). 18 and 16 are the realistic cases.

## Task 1: mission energy
Cruise battery power: 600 / 700 / 790 kW at L/D 21 / 18 / 16. That's about 1.7–2.2C on a 360 kWh pack.

**What range the published 360 kWh pack gives**

| Cruise alt | L/D | Reserve | Range |
|---|---|---|---|
| 3000 m | 21 | none | ~106 km (climb alone uses ~260 kWh, 13 min) |
| 3000 m | 18 / 16 | none | can't complete the profile |
| 1500 m | 21 / 18 / 16 | none | ~122 / 105 / 93 km |
| any | any | 30 min or 20 min+50 km | not feasible (the reserve alone is 240–350 kWh) |

**Energy required at fixed MTOW (kWh installed)**

| Mission | L/D 21 | L/D 18 | L/D 16 |
|---|---|---|---|
| 100 km, 3000 m, no reserve | 349 | 386 | 428 |
| 100 km, 3000 m, 30 min | 616 | 697 | 777 |
| 200 km, 3000 m, no reserve | 578 | 655 | 723 |
| 200 km, 3000 m, 30 min | 845 | 966 | 1072 |
| 200 km, 3000 m, 20 min+50 km | 871 | 997 | 1108 |
| 200 km, 1500 m, 30 min | 807 | 929 | n/a |

Weight impact at 175 Wh/kg pack:
- **MTOW held fixed:** 200 km with a 30 min reserve at L/D 18 needs about 3,460 kg more battery. That is about 5,500 kg of pack in total, and it would wipe out the payload.
- **MTOW allowed to grow** (+0.25 kg of structure per kg of battery): 200 km at L/D 18 with no reserve converges at about 842 kWh and an MTOW of about 14.8 t. With a 30 min reserve it diverges, so there's no closed design.
- **Conclusion:** at today's pack-level energy, ES-36's 200 km all-electric claim needs about 2× better pack Wh/kg, or a reserve carried by the hybrid generator. That's my inference; the ES-36 is hybrid.

**Power check**
- 1.6 MW from 360 kWh is **4.4C** peak. At 720 V that's 2,220 A total, about 555 A per 90 kWh pack.
- That excludes the high-energy cells that only allow 1–2C, such as Amprius's 450 Wh/kg cell. You'd need a power-rated cell or a larger pack.

## Task 2: cells and layout (4 packs of 90 kWh, 720 V)

| Cell | Config per pack | Total cells | kWh | Cell mass | Pack mass, ctp 0.80 / 0.65 | Pack volume (cell vol ÷ 0.5) | Peak C |
|---|---|---|---|---|---|---|---|
| 21700, 5 Ah, 3.6 V, 70 g | 200s25p | 20,000 | 360 | 1,400 kg | 1,750 / 2,154 kg | 1.0 m³ | 4.4 |
| 4680, 24 Ah, 355 g | 200s6p | 4,800 | 415 (5p would give 346) | 1,704 kg | 2,130 / 2,622 kg | 1.3 m³ | 3.9 |
| Prismatic, 100 Ah (generic) | 197s2p | 1,576 | 575 (1p would give 288; poor granularity) | 2,285 kg | 2,857 / 3,516 kg | 2.0 m³ | 2.8 |
| Si-anode pouch, Amprius SA102, 4.3 Ah | 212s30p | 25,440 | 372 | 842 kg | 1,053 / 1,296 kg | 0.8 m³ | 4.3 (rated 1C) |

Layout notes:
- Four independent packs is the published architecture. Each pack is about 440–540 kg and 0.25 m³.
- Candidate spots are the fuselage floor or the sponsons (near the CG, short high-current runs, easy cooling) or the nacelles (good for isolating a failure and short cables, but it adds mass far out on the wing).

**Honeycomb structural wing pack**

Assumptions: t/c of 17% at the root tapering to 13% at the tip; a wing box 50% of chord wide, with 85% of the thickness usable; the fuselage carry-through and the outer 10% of span excluded; 80% packing efficiency for ribs, fittings and cooling.

- Wing box volume is about 6.4 m³. It would fit about 24,000 4680 cells (~2,090 kWh) or about 133,000 21700 cells (~2,400 kWh).
- **Volume isn't the limit; mass is.** 360 kWh needs only about 17% of the box, and 100% of the energy could sit in the wing.
- The root box is about 1.25 m wide and 0.36 m deep. Ultimate root shear (3.75 g) is about 209 kN per side.
- If the strut takes ~55% of the load (assumption), shear inboard of the strut is about 94 kN.
- The average core shear stress the cells and adhesive must carry is about **0.46 MPa** without the strut and **0.21 MPa** with it.
- Assumed (not sourced) shear strength of the potting foam or adhesive fill: about 1–3 MPa. That's a paper margin of about 2–10×, before knockdowns for temperature (~60 °C), fatigue, peel at the cell ends, and cell swelling. Torsion and skin buckling weren't checked.
- **Mass saved:** going from a cell-to-pack ratio of 0.70 to about 0.85 for the structural pack, plus some spar-web and stringer savings, gives roughly **200–450 kg** at 360 kWh (assumption range). Fire barriers between cells and the skin, and liquid cooling in the wing, eat into that.
- Wing-mounted mass also relieves wing bending, which is a plus.
- Big open issues: damage tolerance, crashworthiness, cell replacement, and certification. No precedent has flown.

## Task 3: chemistry comparison (cell level)

| Chemistry | Wh/kg | Wh/L | Cycles | Safety | Cost | Aviation maturity |
|---|---|---|---|---|---|---|
| LFP | 160–200 | 350–450 | 3,000–6,000 | Best: thermal runaway onset ~250 °C+, low heat release | pack $81/kWh (BNEF 2025) | mature; too heavy |
| NMC 811/622 | 240–280 | 600–750 | 1,000–2,000 | Thermal runaway onset ~150–200 °C | pack $128/kWh (BNEF 2025) | eVTOL/CS-23 programs (high) |
| NCA | 250–300 | 650–750 | 500–1,500 | Similar to NMC, slightly worse | ~NMC | used (e.g. 21700 eVTOL packs) |
| Si-anode Li-ion (Amprius) | 340–450 (500 announced) | 770–1,000 | 150–300 at 100% DOD for the 450 cell | NMC-class | high (not published) | UAV/HAPS shipping; not certified for crewed use |
| Li-S (Lyten) | 300–345 now; 400 target | ~475–600 | ~300–400 (C/3, 100% DOD) | No runaway in nail tests (company claim) | low potential | drone/DoD samples (low) |
| Solid-state Li-metal (QuantumScape QSE-5) | 301 | 844 | not stated publicly | Claimed ≥ Li-ion | n/a | auto samples/pilot line (low) |
| Li-air | theory >1,000; practical cells n/a | n/a | n/a | n/a | n/a | lab only |

Using the published 360 kWh and 175 Wh/kg baseline, a pack-level factor of 0.70 (0.75 for solid-state), pack volume = cell volume ÷ 0.5, and MTOW fixed:

| Chemistry (mid value) | Pack Wh/kg | 360 kWh mass / volume | 966 kWh needed (200 km, 30 min, L/D 18) mass / volume | Energy at fixed 2,057 kg pack | Range, 1500 m, L/D 18, no reserve / 30 min |
|---|---|---|---|---|---|
| LFP 170 | 119 | 3,025 kg / 1.9 m³ | 8,120 kg / 5.1 m³ | 245 kWh | 62 km / – |
| NMC 260 | 182 | 1,978 / 1.1 | 5,310 / 3.0 | 374 kWh | 110 / – |
| NCA 270 | 189 | 1,905 / 1.0 | 5,110 / 2.8 | 389 kWh | 115 / – |
| Si-anode 450 | 315 | 1,143 / 0.8 | 3,070 / 2.0 | 648 kWh | 211 / 96 |
| Li-S 330 | 231 | 1,558 / 1.4 | 4,180 / 3.9 | 475 kWh | 147 / – |
| Solid-state 301 | 226 | 1,595 / 0.9 | 4,280 / 2.3 | 464 kWh | 143 / – |

("–" means it can't carry a 30 min reserve.)

## Recommendation (judgment)
- **Today (X1 demonstrator):** high-power NMC/NCA 21700 cells in 4 independent packs of 90 kWh. They're proven, 4–5C capable and have certification data, which fits what Heart published.
- **Product path:** silicon-anode NMC is the only chemistry that roughly doubles range at the same mass, and it's drop-in Li-ion manufacturing. The catch is that today's 450 Wh/kg cells are rated 1C with 150–300 cycles, while the X1 needs ~4.4C peak and 1,000+ cycles. A realistic target is a ~350–400 Wh/kg power-balanced cell (Amprius lists 340–390 Wh/kg at 3–10C).
- **Watch:** Li-S (light but bulky, low cycle life) and solid-state (good Wh/L; mass gain is modest at 301 Wh/kg).
- **Avoid:** LFP for propulsion. It's safest and cheapest but too heavy.
- **Structural wing pack:** worth pursuing for ~200–450 kg savings, but it's a long-lead certification item.

## Sources
- Amprius SiCore specs: https://amprius.com/solutions/sicore/ ; catalog (SA102 450 Wh/kg, 950 Wh/L, 1C, 150 cycles): https://amprius.com/documents/Amprius_Product_Catalog.pdf ; SiCore 500 (Sep 2026): https://ir.amprius.com/news-events/press-releases/detail/174/
- BNEF 2025 pack prices (LFP $81, NMC $128/kWh): https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/
- Lyten Li-S (300–345 Wh/kg, 400 cycles): https://doi.org/10.1149/ma2026-013271mtgabs ; roadmap: https://milpwr.org/wp-content/uploads/2024/06/Lytens-High-Energy-LiS-Batteries-for-DoD-Applications-Jim-Paye-Jim-Paye.pdf
- QuantumScape QSE-5 (301 Wh/kg, 844 Wh/L): QS Q3-2026 call transcript, https://earningscalls.dev/transcripts/quantumscape-corporation_qs_earnings_call_transcript_2026-09-16
- LFP/NMC/NCA typical ranges and thermal runaway onset temperatures: general literature values, **not verified with a specific source in this study.** Treat them as indicative.
