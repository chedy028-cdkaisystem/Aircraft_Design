# High-alpha / stall-order ESTIMATES (high_alpha.py)

AVL is linear inviscid VLM: no viscous stall, no CLmax of its own. Stall here = first strip of a surface reaching an **assumed** section clmax (wing 1.6, foreplane 1.4, HT 1.2 |cl|). 'Saturated' values clip strip cl at clmax (flat-top, no lift loss, downwash not re-solved) to indicate pitch tendency. Pitch-control limit assumed ±25°. Geometry is photo-estimated; CG assumed.

## Trimmed alpha sweep, first-surface stall

| | A baseline, SM 15% | B 3-surface, SM 15% | C foreplane/no HT, same CG (SM -17%) | C foreplane/no HT, SM 15% |
|---|---|---|---|---|
| x_cg [m] | 10.19 | 9.45 | 9.21 | 8.59 |
| wing reaches clmax | α 9.5°, CL 1.62 | α 9.3°, CL 1.58 | α 9.3°, CL 1.56 | α 8.5°, CL 1.63 |
| foreplane reaches clmax | - | α 10.5°, CL 1.70 | α 14.7°, CL 2.08 | α -1.0°, CL 0.59 |
| HT reaches |clmax| | never (to 20°) | never (to 20°) | - | - |
| **first surface to stall** | **Wing** | **Wing** | **Wing** | **Foreplane** |
| canard-safe (foreplane first)? | n/a | **NO** | **NO** | yes |
| CLmax est. (CL at first stall) | 1.62 | 1.58 | 1.56 | 0.59 |
| Vs, MTOW, SL, S=60.56 m² [m/s / kt] | 43.0 / 84 | 43.6 / 85 | 43.9 / 85 | 71.1 / 138 |
| peak saturated CL (α ≤ 20°) | 1.77 | 1.74 | 1.77 | 1.71 |
| trim defl. at first stall [deg] | +3.1 | -1.8 | -5.7 | +20.7 |
| linear trim exceeds ±25° at α | no (to 20°) | no (to 20°) | no (to 20°) | 2° |
| saturated re-trim exceeds ±25° at α | no (to 20°) | no (to 20°) | no (to 20°) | 1° |
| Cmα fixed defl., linear, 3° before stall [/rad] | -1.82 | -1.68 | +0.32 | -0.83 |
| Cmα fixed defl., saturated, 3° before stall | -1.82 | -1.68 | +0.32 | -1.24 |
| Cmα fixed defl., saturated, 4° after stall | -4.52 | -2.87 | -0.87 | -1.77 |
| trimmed Cm_sat 1–4° after first stall (+ = nose-up) | -0.010, -0.048, -0.091, -0.133 | -0.004, -0.014, -0.031, -0.050 | -0.000, -0.000, -0.000, -0.000 | -0.000, -0.024, -0.054, -0.088 |

## Cruise (CL ≈ 0.631): C range-penalty decomposition

| config | CD0 | CDi trimmed | CD | L/D | trim defl | peak cl/clmax per surface at cruise | cruise α |
|---|---|---|---|---|---|---|---|
| A_sm | 0.0219 | 0.00777 | 0.02966 | 21.28 | +7.6° | Hori 0.16, Wing 0.39 | -0.12° |
| B_sm | 0.0214 | 0.00786 | 0.02923 | 21.60 | +4.8° | Hori 0.04, Wing 0.40, Fore 0.30 | +0.03° |
| C_fixed | 0.0204 | 0.00824 | 0.02865 | 22.03 | +3.1° | Fore 0.36, Wing 0.40 | -0.09° |
| C_sm | 0.0204 | 0.01388 | 0.03430 | 18.41 | +21.2° | Fore 1.04, Wing 0.38 | -0.69° |

C_sm vs A_sm: L/D 21.28 -> 18.41 (-13.5%). CD0 change alone (-0.0015, no HT): +5.3%; CDi/trim change (+0.00612): -17.8%. 

C_sm vs B_sm: L/D 21.60 -> 18.41 (-14.8%). CD0 change alone (-0.0010, no HT): +3.4%; CDi/trim change (+0.00603): -17.6%. 

C_fixed -> C_sm (same geometry, CG moved -0.62 m): CDi 0.00824 -> 0.01388 (span efficiency e 0.88 -> 0.52); foreplane mean cl 0.42 -> 1.23.
## Interpretation (ESTIMATES; added by hand after the run)
* **A and B (static margin 15%)**: the main wing reaches its clmax first (A at α≈9.5°, CL≈1.62; B at α≈9.3°, CL≈1.58), the HT never does, and pitch trim stays well inside ±25°.
  With the strip-saturated estimate, fixed-deflection Cmα gets *more* negative after the wing saturates (A −1.8 → −4.5 /rad, B −1.7 → −2.9). That is a nose-down, self-recovering stall tendency.
  The CG sits aft of the wing quarter-chord, so lost wing lift falls ahead of the CG.
  **Not captured:** a T-tail sinking into the stalled-wing wake is the classic T-tail deep-stall mechanism, and AVL has no wake/viscous model, so A and B are *not* cleared of deep stall.
  Linear Cmα also steepens with α in AVL (A: about −0.9/rad at cruise to −1.8/rad near stall), because the high wing and T-tail sit well above the CG.
* **B is not canard-safe**: the wing saturates about 1.2° of α before the foreplane (CL 1.58 vs 1.70). A small foreplane incidence or clmax change would flip that order. The `incidence_B` parameter wasn't changed, as instructed.
* **C at same CG (static margin −17%)**: the wing stalls first (α 9.3°, CL 1.56); the foreplane would only reach its limit at α≈14.7°.
  Fixed-deflection Cm is nose-up and rising (Cmα ≈ +0.3/rad, statically unstable) until the wing saturates, then turns over and crosses Cm = 0 again near α≈15.6° with a negative slope.
  That is a **stable post-stall trim point**, the signature of a deep-stall/locked-in-stall trap. On top of that, it needs active stability augmentation everywhere below stall.
* **C at 15% static margin**: the foreplane is already at clmax at cruise (peak strip ratio 1.04 at CL 0.63). Its "first stall" comes at CL≈0.59, so Vs≈71 m/s (138 kt) in the clean configuration.
  Pitch trim passes 25° at α≈2° (1° with saturation), so **trim runs out right above cruise**. It is canard-safe in stall order (the foreplane goes first, nose-down), but it has no usable CL range.
* **C range penalty (cruise CL 0.631, α≈0)**: removing the HT lowers CD0 by about 0.0015 (+5.3% L/D vs A). The trimmed CDi rises by about 0.0061 (span efficiency 0.95 → 0.52), costing −17.8% L/D. Net: −13.5% vs A and −14.8% vs B.
  Inside AVL, cruise is far from wing stall (wing peak cl/clmax ≈ 0.4), so the penalty there is all trim/induced drag.
  However, C_sm's foreplane works at its clmax in cruise, so a real viscous foreplane would add profile drag rise and buffet on top of this. That makes the AVL penalty a **lower bound**.
