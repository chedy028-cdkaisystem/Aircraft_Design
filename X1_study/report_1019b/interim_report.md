# Interim report, 2026-10-19 11:30 CT: CFD (coarse mesh) A vs B-opt + AVL. ALL ESTIMATES

Setup: OpenFOAM v1912 simpleFoam, k-ω SST, half model, 80 m/s, Re ≈ 8.4e6/MAC, ~1.1M cells (coarse; 3.1 cm cells on lifting surfaces, 5 prism layers, wall functions,
y+ median ≈ 400, p95 ≈ 1000). Controls 0° (untrimmed). No props, spinners or gear. Forces from cfd/forces.py, because OpenFOAM function objects crash in this build.

## Matched CL 0.631 (interpolated α 0–4°)
| | A coarse | B-opt coarse | AVL A / B-opt (trimmed, buildup CD0) |
|---|---|---|---|
| α at CL 0.631 | 1.94° | 1.47° | −0.12° / +0.13° |
| CD (untrimmed) | 0.0488 | 0.0496 | 0.0297 / 0.0292 |
| L/D (untrimmed; +AVL trim ΔCDi) | 12.9 (13.0) | 12.7 (12.8) | 21.3 / 21.6 |
| B-opt vs A | | −1.5% CFD | +1.5% AVL |
| CLα [/deg] | 0.077 | 0.082 | 0.109 / 0.105 |
| CD0 (CFD CD − AVL CDi) | 0.041 | 0.041 | buildup 0.0219 / 0.0210 |
| dCm/dCL (SM) | −0.107 (10.7%) | −0.045 (4.5%) | −0.180 / −0.178 (AVL: no fuselage) |
| HT dCL/dα CFD/AVL | 0.0100/0.0112 (89%) | 0.0036/0.0043 (84%) | |
| Foreplane dCL/dα CFD/AVL | – | 0.0021/0.0065 (33%) | |
| Foreplane CL contribution α0 / α4 | – | 0.009 / 0.017 (AVL 0.031 / 0.057) | |

Drag by component at α 0 (counts, A / B-opt): wing 138/143, struts 80/79, nacelles 78/78, fuselage 67/65, sponsons 20/25, HT 10/10, fin 11/6, foreplane –/8.

## High α
| α | A CL CFD (AVL) | A CD | B-opt CL CFD (AVL) | B-opt CD |
|---|---|---|---|---|
| 0 | 0.482 (0.569) | 0.040 | 0.511 (0.609) | 0.041 |
| 4 | 0.789 (1.005) | 0.058 | 0.839 (1.031) | 0.064 |
| 8 | 0.915 (1.432) | 0.148 | 0.931 (1.444) | 0.139 |
| 12 | 1.055 (1.849) | 0.219 | running | |
| 16 | 1.128 (2.251) | 0.354 | queued | |

Upper-surface reversed-flow area (separation indicator):
| case | wing | foreplane | HT |
|---|---|---|---|
| A α0 / 4 / 8 / 12 | 0% / 16% / 48% / 54% | – | 0 / 0 / 0.5% / 6% |
| B-opt α4 / 8 | 19% / 43% | **52% / 68%** | 0 / 1% |

## Interpretation (estimates)
- The coarse CFD separates far too early (wing 16% reversed flow at α 4°, lift break near α 4–8°, CL only 1.13 at α 16°). For this airfoil class at Re ~8e6 that is not physical. It points to under-resolution (3 cm cells, ~25–80 cells per chord), wall functions at y+ 400–1000, and wing/strut/nacelle junction separation (separated patches sit behind nacelles and at the strut attachment, see sep_*.png). **Absolute L/D, CD0 and CLmax from this mesh are not credible.** The medium-mesh check is still queued.
- Relative A vs B-opt on the same mesh: L/D equal within ~1.5% (CFD −1.5%, AVL +1.5%). No measurable benefit, within the noise of the method.
- Stall order: CFD agrees qualitatively with AVL that the **B-opt foreplane separates first** (52% vs wing 19% at α 4; fully separated at α 8, with its wake passing under the wing; see Bopt_a8_slice_y1.8_fp_wing.png). The foreplane carries only ~1/3 of the lift slope AVL predicts, so its pitch-stability contribution and trim role are much weaker. That is partly real (fuselage-nose interference, low Re on a 0.83 m chord) and partly the mesh.
- Tail effectiveness: HT slope 84–89% of AVL in both configurations (downwash and fuselage interference). The CFD static margin is lower than AVL's (A 11% vs 18%; B-opt 4.5% vs 18%). The main reason is that AVL has no fuselage or nacelle Munk moment. If this survives the mesh check, the B-opt CG must move forward about 10% MAC, which erodes its small L/D gain and worsens the rotation problem.
- Drag: struts (80 counts) and nacelles (78 counts, no spinners/props, blunt fronts) are the largest excesses over the buildup. Coarse strut resolution (~6 cells per chord) probably inflates the strut number; the medium mesh refines the struts.
- Convergence: α 0–4 converged (CL within ±0.002–0.02, CD within 2–17 counts per 250 iterations, p residual about 1e-4). α ≥ 8 is unsteady and separated (ΔCL up to 0.05, ΔCD up to 50 counts), so steady RANS gives only indicative values there.
