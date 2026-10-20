# X1 OpenFOAM CFD vs AVL: status at 18:30 CT, Oct 19 2026 (ESTIMATES)

Detailed tables: cfd_summary_tables.md (post.py + make_cfd_md.py; regenerate with `python3 make_cfd_md.py` after the queue ends). Plots: img/cfd_vs_avl.png, img/cfd_drag_breakdown.png,
separation maps img/sep/sep_run_*.png (+ img/sep/separation.json, from sepmap.py), surface Cp / slices img/<case>_*.png. Earlier interim report: ../report_1019b/interim_report.md.
Previous version of this file: cfd_summary_0740.md.bak.

## What has finished (all 1500 iterations, k-ω SST, wall functions)
- A coarse (1.11M cells): α 0, 4, 8, 12, 16.
- B-opt coarse (1.09M): α 0, 4, 8, 12, 16.
- C10 coarse (1.09M, 10 m² foreplane, no HT, CG 8.36 m = AVL 15% SM): α 0, 4.
- A medium (2.32M): α 0.
- Still running at 18:30: C10 coarse α 8 (iteration ~500/1500). Queued: C10 α 12, 16 (+ images), B-opt medium mesh + α 0, A medium α 8.
  The box was paused again during C10 α4 (ClockTime 9777 s vs ExecutionTime 1037 s), so the queue is ~2.5 h behind. Estimated QUEUE_DONE ≈ 23:00–24:00 CT Oct 19 if not paused again.

## Cruise, CL 0.631 (coarse mesh, α 0–4 linear fit, untrimmed)
| | A | B-opt | C10 |
|---|---|---|---|
| α at cruise CL | 1.94° | 1.47° | 1.02° |
| CD | 0.0488 | 0.0496 | 0.0471 |
| L/D (AVL trim ΔCDi added) | 12.9 (13.0) | 12.7 (12.8) | 13.4 (no trim correction available) |
| AVL L/D, trimmed, buildup CD0 | 21.3 | 21.6 | 18.4 (canard_sweep.md, S_fp 10, 15% SM) |
| CLα CFD / AVL [/deg] | 0.077 / 0.109 | 0.082 / 0.105 | 0.082 / 0.107 |
| CD0 = CD − AVL CDi | 0.041 | 0.041 | 0.039 |
| dCm/dCL CFD / AVL | −0.107 / −0.180 | −0.045 / −0.178 | +0.003 / −0.175 |

- On the identical coarse meshes the three are within ±3% in L/D (C10 +3.6%, B-opt −1.5% vs A). C10's apparent edge is untrimmed: CFD Cm is about −0.22 for C10 at the 15%-SM CG, so trimming would need foreplane deflection that AVL says costs ~14% L/D. Treat the ranking as unresolved at coarse-mesh accuracy.
- C10 is about neutrally stable in CFD at the CG that AVL places at 15% SM (Cm flat from α 0 to 4; only two points). B-opt keeps only ~4.5% and A ~11%. AVL has no fuselage/nacelle Munk moment, and the foreplanes deliver less lift slope than AVL (below), so the AVL CG positions are too far aft for B-opt and C10 by roughly 10–17% MAC (estimate).

## CLmax and stall order
| | A | B-opt | C10 |
|---|---|---|---|
| CFD coarse highest CL (α) | 1.13 (16°, still creeping up) | 1.06 (12°; 0.98 at 16°) | 0.88 at 4° so far (α ≥ 8 running) |
| AVL CLmax (critical section) | 1.62, wing first | 1.47, foreplane first | 0.83, foreplane first |
| CFD upper-surface reversed area at α 4: wing / foreplane | 16% / – | 19% / 52% | 17% / 37% |
| at α 8 | 48% / – | 43% / 68% | running |
| HT reversed area α 8 / 12 / 16 | 0.5% / 6% / – | 1% / 15% / 22% | no HT |
- Foreplane vs wing: in both B-opt and C10 the foreplane separates first (larger reversed-flow fraction at every α from 4°). This matches AVL's stall order (canard-safe ordering).
- B-opt foreplane lift is almost flat from α 4 (CL contribution 0.017 → 0.016 → 0.015 at α 4/8/12): the CFD foreplane gives ~1/3 of AVL's lift slope (0.0021 vs 0.0065 /deg). The C10 foreplane is better, 0.0089 vs 0.0145 /deg (62%), but is 37% separated at α 4.
- CFD CLmax values are far below AVL's critical-section estimates; given the mesh issue below they are lower bounds, not predictions.

## Mesh check (A, α 0, coarse 1.11M → medium 2.32M cells)
| | coarse | medium | change |
|---|---|---|---|
| CL | 0.482 | 0.465 | −3.6% |
| CD | 0.0404 | 0.0338 | −16.5% (−67 counts) |
| CDp / CDf | 0.0290 / 0.0115 | 0.0214 / 0.0123 | −76 / +9 counts |
| CD0 (CD − AVL CDi) | 0.034 | 0.027 | buildup 0.022 |
| y+ median / p95 | 419 / 1038 | 240 / 693 | |
| L/D at α 0 | 11.9 | 13.8 | |
- By component, the drop is wing 138 → 105, struts 80 → 63, HT 10 → 2 counts; fuselage, nacelles and sponsons barely change. So a large part of the coarse-mesh excess drag is a mesh error (pressure drag on the lifting surfaces and struts), and the drag is not mesh-converged yet: a finer mesh would probably lower it further. Applying the α 0 ΔCD to the cruise point gives A L/D ≈ 15 (estimate; AVL 21.3).
- Both meshes are attached at α 0 (reversed area 0.1–0.3%), so α 0 cannot say whether the early separation at α 4–8 is a mesh error. That answer needs A medium α 8, which is last in the queue (≈ 23:00–24:00 CT). B-opt medium α 0 will show whether the A-vs-B-opt drag difference survives the finer mesh.

## Interpretation (estimates)
- Absolute CFD L/D, CD0 and CLmax from the coarse mesh are not credible (L/D 12–13 vs AVL 18–22; separation already at α 4 at Re 8.4e6). The medium mesh confirms the drag part is largely numerical; the separation part is still open.
- What looks robust because it appears on identical meshes and matches physics: (1) the B-opt and C10 foreplanes stall before the wing; (2) the foreplanes give much less lift slope than AVL, so (3) B-opt and C10 are less stable than AVL predicts and their CG would need to move forward; (4) none of the configurations shows an L/D advantage beyond the method's noise.

## Limitations
Steady RANS, wall functions at y+ 100–1000, half model, controls at 0 (untrimmed), no props/slipstream/gear, α ≥ 8 cases unsteady (ΔCL up to 0.05, ΔCD up to 70 counts over the last 250 it), forces integrated offline by forces.py. C10 has only two finished α points.
