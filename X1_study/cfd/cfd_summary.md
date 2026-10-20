# X1 OpenFOAM CFD vs AVL: final status, Oct 20 2026 08:40 CT (ESTIMATES)

Queue finished at 21:40 CT Oct 19 (QUEUE_DONE in queue.log). Tables: cfd_summary_tables.md (regenerated). Separation maps for every case: img/sep/ (+ separation.json, sep_final.log).
Report images: ../report_1020/ (A_a8_sep_coarse_vs_medium.png, mesh_check_drag.png, C10_sep_a8_a12.png, cfd_vs_avl.png). Previous version: cfd_summary_1830.md.bak.

## Finished cases (1500 it, k-ω SST, wall functions)
- A coarse α 0/4/8/12/16; B-opt coarse α 0/4/8/12/16; C10 coarse α 0/4/8/12.
- A medium (2.32M) α 0 and 8; B-opt medium (2.31M) α 0.
- C10 coarse α 16 FAILED: simpleFoam diverged (floating-point exception in the U solve) about one minute after start; no result. Its images were moved to img/failed_C10_a16/. Not re-run.

## Geometry check: nacelle / sponson diameters
The 2x-diameter bug (OpenVSP POD FineRatio = L/radius, found Oct 19, see cad_v2.py) affected the original CAD exports cad/x1_A/B/C.stl/.step. The CFD meshes were built from cad/x1_*_cfd.stl, which were written by the corrected cad_v2.py. Measured on the CFD surface patches (all three configs): nacelle height 0.80 m (intended 0.8 m), length 3.6 m (3.6); sponson 0.84 x 0.86 m (intended 0.8), length 4.9 m (4.2 + blending). So the CFD results are NOT inflated by 2x pods; the bug matters only for anything that used the original CAD files.

## Mesh check: is the coarse-mesh early separation and high drag a mesh error? Mostly yes.
| | A α0 coarse → medium | B-opt α0 coarse → medium | A α8 coarse → medium | AVL (α8, A) |
|---|---|---|---|---|
| CL | 0.482 → 0.465 | 0.511 → 0.509 | 0.915 → 1.128 | 1.432 |
| CD [counts] | 404 → 338 (−16%) | 414 → 340 (−18%) | 1481 → 903 (−39%) | CDi 390 |
| wing CD [counts] | 138 → 105 | 143 → 109 | 1009 → 467 | |
| nacelles CD [counts] | 78 → 75 | 78 → 75 | 223 → 233 | |
| wing upper-surface reversed area | 0.1% → 0.3% | 0.1% → 0.2% | 47% → 10% | |
| L/D | 11.9 → 13.8 | 12.3 → 15.0 | 6.2 → 12.5 | |
- At α 8 the medium mesh removes most of the wing separation (47% → 10% reversed area) and adds +0.21 CL. The coarse-mesh separation at α 4–8, and the CLmax values that came from it, were largely numerical. What remains on the medium mesh is concentrated just behind/outboard of the two nacelle-wing junctions (y ≈ 3–4 m and 8–8.7 m) and nacelle drag does not change with mesh (223 → 233 counts at α 8). A hunch, not verified: nacelle-wing junction separation may be a real feature of this pod placement, or may need a finer mesh still.
- Drag is still not mesh-converged (−16 to −18% at α 0, −39% at α 8 from one refinement). Absolute CD/L/D from these meshes remain upper/lower bounds respectively.
- A medium α 0–8: CLα 0.083 /deg (AVL 0.108, 77%; coarse α 0–4 was 70%). dCm/dCL −0.163 (AVL α 0–8 −0.221, 74%; coarse α 0–4 was 60% of AVL). So the coarse mesh also understated stability; the earlier "AVL CG is 10–17% MAC too far aft for B-opt/C10" estimate is probably too pessimistic. No medium α>0 for B-opt/C10, so their stability is not re-checked.

## Cruise, CL 0.631: A vs B-opt vs C10 vs AVL (estimates)
| | A | B-opt | C10 |
|---|---|---|---|
| coarse L/D (untrimmed) | 12.9 | 12.7 | 13.4 |
| medium-corrected L/D (coarse cruise CD − α0 medium ΔCD) | ≈ 15.0 | ≈ 14.9 | ≈ 15.7 if the same ~70-count shift applies (no C10 medium run; untrimmed) |
| A medium α0/α8 quadratic-polar fit | ≈ 14.5 | – | – |
| AVL L/D (trimmed, buildup CD0) | 21.3 | 21.6 | 18.4 |
- A vs B-opt drag difference shrinks with the mesh: +9 counts (coarse) → +2 counts (medium) at α 0. At the cruise CL they are tied within the method's noise. B-opt's AVL advantage (+1.5%) is neither confirmed nor refuted.
- C10 still looks ~4–5% better untrimmed, but it needs foreplane deflection to trim (CFD Cm ≈ −0.22 at the AVL 15%-SM CG) that AVL says costs ~14% L/D, and AVL already ranks it last (18.4). Ranking unchanged: A ≈ B-opt; C10 not better once trimmed.
- Gap to AVL: even medium-corrected L/D ~15 vs AVL ~21. Part is the unconverged mesh; part is real interference/junction drag the AVL buildup does not have (struts 63, nacelles 75, fuselage 62 counts at α 0 on medium vs buildup CD0 total 210–220 counts).

## C10 alpha sweep (coarse, new since 18:30)
| α | 0 | 4 | 8 | 12 | 16 |
|---|---|---|---|---|---|
| CL (AVL) | 0.547 (0.644) | 0.876 (1.073) | 0.962 (1.493) | 1.031 (1.901) | failed |
| CD | 0.0410 | 0.0649 | 0.1478 | 0.2380 | |
| Cm | −0.219 | −0.218 | −0.175 | −0.169 | |
| foreplane CL (AVL) | 0.028 (0.052) | 0.064 (0.110) | 0.080 (0.167) | 0.077 (0.222) | |
| reversed area foreplane / wing | 0 / 0.1% | 37% / 17% | 57% / 44% | 78% / 49% | |
- Foreplane lift peaks at α 8 and drops at α 12, and the foreplane is always more separated than the wing: foreplane stalls first, as AVL predicts (canard-safe order), consistent with B-opt.
- Coarse CL at α 12: A 1.055, B-opt 1.063, C10 1.031, so no configuration has a high-α lift edge on identical meshes. Given the A medium result, all coarse CLmax values are low by roughly 0.2 or more; treat them as lower bounds.
- C10 Cm gets less negative from α 4 to 12 (−0.218 → −0.169) while CL rises: a pitch-up trend on the coarse mesh, driven by the separating wing. It may be a coarse-mesh artifact like A's separation.

## Bottom line (estimates)
1. The coarse-mesh early separation and much of the high drag were mesh errors (A α 8: separation 47% → 10%, CD −39%, CL +23%).
2. On the finer mesh A and B-opt are tied in cruise drag; CFD does not resolve the small AVL difference between them.
3. Robust across configurations: the B-opt and C10 foreplanes deliver much less lift slope than AVL and stall before the wing; C10 is not better once trim is counted.
4. Nacelle-wing junctions are the main remaining separation/drag source at α 8 on the medium mesh (worth a look in the design, to be verified with a finer mesh).
5. CFD geometry used the intended 0.8 m pod diameters, so the 2x CAD bug does not affect these results.

## Limitations
Steady RANS, wall functions (y+ median 220–420), half model, controls at 0 (untrimmed), no props/slipstream/gear, two mesh levels only (no Richardson extrapolation), α ≥ 8 cases unsteady (coarse ΔCD up to 72 counts over the last 250 it; medium α 8 8 counts), forces integrated offline by forces.py. C10 has no medium-mesh run and no α 16.
