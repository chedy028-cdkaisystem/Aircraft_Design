# OpenFOAM RANS check of the Heart X1 parametric model (A, B-opt, C10): ESTIMATES

**Setup.** OpenFOAM v1912 (Debian package), steady incompressible simpleFoam, k-ω SST, V = 80 m/s, ν = 1.86e-5 (ISA 3000 m, Re ≈ 8.4e6 on MAC 1.944 m). Half model with a symmetryPlane at y = 0. Freestream velocity/pressure BCs on one farfield box (x −50…120, y 0…60, z −60…60 m), so α is set by the flow direction and every α uses the same mesh. Geometry: cad/x1_{A,Bopt,C10}_cfd.stl (OpenVSP with fine tessellation and the corrected pod diameters), split into per-component patches (cfd/split_stl.py). Mesh: snappyHexMesh, 4 m background cells, refinement boxes to 0.25 m, surfaces level 6–7 (3.1 cm on lifting surfaces) for **coarse** and 7–8 for **medium**, 5 prism layers, Spalding wall function (y+ ≈ 100s, see table). Controls at 0° (untrimmed). Moment reference = 15%-SM CG of each configuration. Coefficients use the full-aircraft Sref 60.56 m² and c 1.944 m (half-model forces / half Sref). 1500 SIMPLE iterations per case.

**Workaround.** Every OpenFOAM function object (forceCoeffs, yPlus, …) aborts in this build with an 'IOstream sha1' error, so forces are integrated by `cfd/forces.py` from fields written every 250 iterations. Pressure uses the face/owner value; shear = (ν+ν_t,wall)·U_t/y_n, which is the same as OpenFOAM's wall-function wallShearStress. Convergence is judged from residuals and the change in CL/CD over the last 250 iterations.

## 1. Results per case

| case | α | CL | CD | L/D | Cm | CL wing | CL foreplane | CL HT | AVL CL | AVL Cm | ΔCL last 250 it | ΔCD last 250 [counts] | y+ p5/p50/p95 | cells |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A_coarse | 0 | 0.482 | 0.0404 | 11.9 | 0.441 | 0.447 | – | -0.041 | 0.569 | 0.414 | -0.0015 | -1.8 | 140/418/1038 | 1.11M |
| A_coarse | 4 | 0.789 | 0.0578 | 13.7 | 0.409 | 0.676 | – | -0.001 | 1.005 | 0.336 | -0.0180 | 16.9 | 88/406/1025 | 1.11M |
| A_coarse | 8 | 0.915 | 0.1481 | 6.2 | 0.224 | 0.742 | – | 0.043 | 1.432 | 0.223 | -0.0296 | 24.7 | 126/405/1006 | 1.11M |
| A_coarse | 12 | 1.055 | 0.2193 | 4.8 | 0.199 | 0.824 | – | 0.064 | 1.849 | 0.077 | 0.0548 | 15.5 | 124/421/1015 | 1.11M |
| A_coarse | 16 | 1.128 | 0.3536 | 3.2 | 0.142 | 0.849 | – | 0.087 | 2.251 | -0.097 | -0.0217 | -47.5 | 126/425/1019 | 1.11M |
| A_medium | 0 | 0.465 | 0.0338 | 13.8 | 0.454 | 0.447 | – | -0.044 | 0.569 | 0.414 | -0.0030 | -1.0 | 84/239/693 | 2.32M |
| A_medium | 8 | 1.128 | 0.0903 | 12.5 | 0.346 | 0.943 | – | 0.040 | 1.432 | 0.223 | -0.0233 | 8.4 | 57/223/720 | 2.32M |
| Bopt_coarse | 0 | 0.511 | 0.0414 | 12.3 | 0.101 | 0.441 | 0.009 | -0.019 | 0.609 | 0.051 | -0.0004 | -3.2 | 129/422/1039 | 1.09M |
| Bopt_coarse | 4 | 0.839 | 0.0638 | 13.1 | 0.086 | 0.696 | 0.017 | -0.004 | 1.031 | -0.024 | -0.0000 | 7.6 | 87/406/1032 | 1.09M |
| Bopt_coarse | 8 | 0.931 | 0.1385 | 6.7 | 0.048 | 0.771 | 0.016 | 0.010 | 1.444 | -0.124 | 0.0174 | 48.8 | 111/408/1000 | 1.09M |
| Bopt_coarse | 12 | 1.063 | 0.2223 | 4.8 | 0.029 | 0.861 | 0.015 | 0.021 | 1.847 | -0.246 | 0.0559 | 72.5 | 125/417/1003 | 1.09M |
| Bopt_coarse | 16 | 0.978 | 0.3180 | 3.1 | -0.013 | 0.752 | 0.021 | 0.035 | 2.234 | -0.389 | 0.0496 | 35.5 | 111/429/1010 | 1.09M |
| Bopt_medium | 0 | 0.509 | 0.0340 | 15.0 | 0.095 | 0.439 | 0.010 | -0.019 | 0.609 | 0.051 | 0.0056 | -6.2 | 81/227/695 | 2.31M |
| C10_coarse | 0 | 0.547 | 0.0410 | 13.3 | -0.219 | 0.438 | 0.028 | – | 0.644 | -0.271 | -0.0017 | 0.6 | 140/417/1027 | 1.09M |
| C10_coarse | 4 | 0.876 | 0.0649 | 13.5 | -0.218 | 0.679 | 0.064 | – | 1.073 | -0.346 | -0.0103 | -1.2 | 82/403/1021 | 1.09M |
| C10_coarse | 8 | 0.962 | 0.1478 | 6.5 | -0.175 | 0.739 | 0.080 | – | 1.493 | -0.438 | -0.0210 | -48.5 | 119/412/981 | 1.09M |
| C10_coarse | 12 | 1.031 | 0.2380 | 4.3 | -0.169 | 0.778 | 0.077 | – | 1.901 | -0.547 | 0.0250 | -47.8 | 108/424/988 | 1.09M |

## 2. Cruise (CL 0.631) and CD0 vs the buildup

| case | CLα CFD / AVL [/deg] | α at cruise CL | CD untrimmed | L/D untrimmed | + AVL trim ΔCDi | L/D trim-corrected | AVL L/D (trimmed, buildup CD0) | CD0 from CFD (CD − AVL CDi) | CD0 buildup |
|---|---|---|---|---|---|---|---|---|---|
| A_coarse | 0.0766 / 0.1088 | 1.94 | 0.0488 | 12.9 | -0.0005 | 13.0 | 21.3 | 0.0406 | 0.0219 |
| Bopt_coarse | 0.0822 / 0.1054 | 1.47 | 0.0496 | 12.7 | -0.0003 | 12.8 | 21.6 | 0.0411 | 0.0210 |
| C10_coarse | 0.0822 / 0.1072 | 1.02 | 0.0471 | 13.4 | 0.0000 | 13.4 | – | 0.0392 | – |

## 3. Stability and tail effectiveness (linear range, α ≤ 8°)

| case | dCm/dCL CFD | dCm/dCL AVL | static margin CFD (−dCm/dCL) | HT dCL/dα CFD / AVL [/deg] | foreplane dCL/dα CFD / AVL [/deg] |
|---|---|---|---|---|---|
| A_coarse | -0.107 | -0.180 | 10.7% | 0.0100 / 0.0112 | – / – |
| Bopt_coarse | -0.045 | -0.178 | 4.5% | 0.0036 / 0.0043 | 0.0021 / 0.0065 |
| C10_coarse | 0.003 | -0.175 | -0.3% | – / – | 0.0089 / 0.0145 |

## 4. Stall order (component CL relative to its own linear fit; a negative value = lift lost)

| case | comp | α 0 | α 4 | α 8 | α 12 | α 16 | max CL | α at max |
|---|---|---|---|---|---|---|---|---|
| A_coarse | CL | 0.000 | 0.000 | -0.181 | -0.347 | -0.581 | 1.128 | 16 |
| A_coarse | CL_wing | 0.000 | 0.000 | -0.164 | -0.311 | -0.516 | 0.849 | 16 |
| A_coarse | CL_ht | -0.000 | -0.000 | 0.005 | -0.014 | -0.031 | 0.087 | 16 |
| Bopt_coarse | CL | 0.000 | 0.000 | -0.237 | -0.434 | -0.847 | 1.063 | 12 |
| Bopt_coarse | CL_wing | 0.000 | 0.000 | -0.179 | -0.343 | -0.707 | 0.861 | 12 |
| Bopt_coarse | CL_fp | 0.000 | 0.000 | -0.009 | -0.019 | -0.022 | 0.021 | 16 |
| Bopt_coarse | CL_ht | -0.000 | -0.000 | -0.000 | -0.004 | -0.005 | 0.035 | 16 |
| C10_coarse | CL | 0.000 | 0.000 | -0.243 | -0.503 | – | 1.031 | 12 |
| C10_coarse | CL_wing | 0.000 | 0.000 | -0.180 | -0.382 | – | 0.778 | 12 |
| C10_coarse | CL_fp | 0.000 | 0.000 | -0.020 | -0.058 | – | 0.080 | 8 |

## 5. Mesh independence (coarse vs medium)

| case | cells | CL | CD | Cm | CDp | CDf |
|---|---|---|---|---|---|---|
| A_a0 | 1.11M → 2.32M | 0.482 → 0.465 | 0.0404 → 0.0338 (-17%) | 0.441 → 0.454 | 0.0290 → 0.0214 | 0.0115 → 0.0123 |
| A_a8 | 1.11M → 2.32M | 0.915 → 1.128 | 0.1481 → 0.0903 (-39%) | 0.224 → 0.346 | 0.1380 → 0.0787 | 0.0102 → 0.0116 |
| Bopt_a0 | 1.09M → 2.31M | 0.511 → 0.509 | 0.0414 → 0.0340 (-18%) | 0.101 → 0.095 | 0.0302 → 0.0221 | 0.0111 → 0.0119 |

## Figures

![CFD vs AVL](img/cfd_vs_avl.png)

![drag breakdown](img/cfd_drag_breakdown.png)

![A_coarse_a0_cp_iso.png](img/A_coarse_a0_cp_iso.png)
![A_coarse_a12_cp_iso.png](img/A_coarse_a12_cp_iso.png)
![A_coarse_a16_cp_iso.png](img/A_coarse_a16_cp_iso.png)
![A_coarse_a8_cp_iso.png](img/A_coarse_a8_cp_iso.png)
![A_medium_a0_cp_iso.png](img/A_medium_a0_cp_iso.png)
![Bopt_coarse_a0_cp_iso.png](img/Bopt_coarse_a0_cp_iso.png)
![Bopt_coarse_a12_cp_iso.png](img/Bopt_coarse_a12_cp_iso.png)
![Bopt_coarse_a16_cp_iso.png](img/Bopt_coarse_a16_cp_iso.png)
![C10_coarse_a4_cp_iso.png](img/C10_coarse_a4_cp_iso.png)
![C10_coarse_a8_cp_iso.png](img/C10_coarse_a8_cp_iso.png)
![A_coarse_a0_slice_y5_wing.png](img/A_coarse_a0_slice_y5_wing.png)
![A_coarse_a12_slice_y5_wing.png](img/A_coarse_a12_slice_y5_wing.png)
![A_coarse_a16_slice_y5_wing.png](img/A_coarse_a16_slice_y5_wing.png)
![A_coarse_a8_slice_y5_wing.png](img/A_coarse_a8_slice_y5_wing.png)
![A_medium_a0_slice_y5_wing.png](img/A_medium_a0_slice_y5_wing.png)
![Bopt_coarse_a0_slice_y5_wing.png](img/Bopt_coarse_a0_slice_y5_wing.png)
![Bopt_coarse_a12_slice_y5_wing.png](img/Bopt_coarse_a12_slice_y5_wing.png)
![Bopt_coarse_a16_slice_y5_wing.png](img/Bopt_coarse_a16_slice_y5_wing.png)
![C10_coarse_a4_slice_y5_wing.png](img/C10_coarse_a4_slice_y5_wing.png)
![C10_coarse_a8_slice_y5_wing.png](img/C10_coarse_a8_slice_y5_wing.png)
