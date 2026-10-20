# Video brief: "Redesigning an electric airliner on a laptop": an independent study of the Heart Aerospace X1

## 0. Instructions to Opus (read first)
- **Audience:** general technical YouTube viewers. They're curious about aviation and engineering, but they aren't aerospace specialists. Explain each term the first time it comes up (L/D, static margin, canard, CFD, mesh).
- **Tone:** concise, plain and honest. Keep it easy to follow, and show a number only where it carries the point.
- **Target runtime:** about 20 minutes. A chapter outline with timings is in section 1.
- **Style:** your choice. This brief only lists facts and suggests which existing images fit each section.
- **Nature of the numbers:** everything here is an **estimate from an independent hobby study**, not Heart Aerospace data. Heart hasn't published CAD for the X1. Our geometry combines a few published figures with dimensions estimated from public photos and engineering assumptions. Tools: OpenVSP (geometry), AVL (vortex-lattice aerodynamics and stability), Octave/Python (range, mission and battery models), OpenFOAM (CFD). Say this clearly near the start and again at the end. Schemes B, B-opt and C are hypothetical layouts. None of them exists on the real aircraft.
- **No Heart photos.** Heart's media terms say images "should be downloaded for each use and not stored locally" and are for editorial use with credit. We deleted our copies. Don't use or recreate Heart's photos. Use only our own renders and plots (section 4), or generic illustrations.
- Don't invent numbers. If a number isn't in this brief, leave it out.

## 1. Suggested chapter outline (~20 min)
| # | Chapter | Approx. min |
|---|---|---|
| 1 | Hook + what the X1 is + disclaimer | 1.5 |
| 2 | Building the model from public data | 2.0 |
| 3 | Battery and mission energy: does 360 kWh work? | 3.0 |
| 4 | Battery chemistry comparison | 2.0 |
| 5 | Structural "honeycomb" wing battery | 2.5 |
| 6 | Adding a small front wing: schemes A, B, B-opt, C in AVL | 3.0 |
| 7 | CFD setup: OpenFOAM | 1.5 |
| 8 | CFD results | 3.0 |
| 9 | Limitations, mistakes and corrections | 1.0 |
| 10 | Conclusions and next steps | 0.5 |
| | **Total** | **20.0** |

## 2. Chapter details

### Ch 1. Hook: the Heart X1 and the question
- The Heart Aerospace X1 is an all-electric regional-aircraft demonstrator. Published figures: span 32.3 m (106 ft), length 23.2 m (76 ft), height 7.3 m (24 ft), MTOW about 11,340 kg (25,000+ lb). It has 4 × 400 kW motors (1,800 rpm, 2,100 N·m, 720 V) and 4 × 90 kWh = 360 kWh of batteries with water-glycol cooling. The layout is a strut-braced high wing with a T-tail and 4 wing-mounted pods. First flight press release: Aug 2026.
- Our questions: How far can it really fly on 360 kWh? Would better batteries, or a battery built into the wing, help? Would a small front wing (canard/foreplane) improve efficiency? And does a real CFD simulation agree with the quick low-order tools?
- Origin of scheme C: a remark attributed to Elon Musk suggesting a "small wing" up front in place of the tail. We tested that idea literally.
- Disclaimer: these are independent estimates, not Heart data.

### Ch 2. Building the model
- **Method:** a single parameter file (`params.yaml`) tags every value as *published*, *photo-estimate* or *assumption*, each with an uncertainty. A Python generator builds the OpenVSP geometry, the AVL input decks, a watertight STL and a drag (CD0) build-up from that file.
- **Photo-estimated values** were scaled off the published span, length and height. Wing root/tip chord 2.5/1.25 m, giving a wing area of 60.6 m², aspect ratio 17.2 and MAC 1.94 m (about ±15% on area). Nacelles at y = 3.8 and 7.8 m, 3.6 m long and 0.8 m in diameter, with 2.0 m props. Fuselage 20.8 × 2.3 × 2.35 m. Fin swept 52°. Horizontal tail 12 m². Struts attach to the wing at y = 6.5 m.
- **Closure check:** the model is 22.9 m long vs 23.2 m published, and 7.37 m tall vs 7.3 m.
- **Assumptions:** NACA 4415/4412 wing and NACA 0012 tails. CG at 25% MAC. Cruise at 80 m/s and 3,000 m (assumed; Heart hasn't published a cruise condition). Propeller efficiency 0.80, battery 0.95, drive 0.93.
- **Baseline AVL results (scheme A):** cruise CL 0.631, L/D about 21.3, and about 140 km range from the simple cruise-only formula. Rate of climb about 1,760 fpm on 4 motors and about 1,180 fpm on 3.
- Range sensitivity: each unit of L/D is worth about 6.6 km. L/D ±10% changes range ±10%. A mass change of ±500 kg changes range by about ∓4.5%.
- **Caveat:** L/D 21 is optimistic. The CD0 (about 0.022) leaves out landing gear, cooling and excrescence drag. The biggest uncertainty is the wing chord and area.
- Takeaway: a transparent, parametric "paper airplane" built from public data, good enough to compare ideas.
- Images: `results/x1_A_v2_views.png` (corrected 3-view), `results/x1_A_cfd_views.png`.

### Ch 3. Battery and mission energy: why 360 kWh fails with reserves
- **Method:** a mission model at fixed MTOW 11,340 kg. Segments: taxi (10 min at 60 kW), takeoff (60 s at 1.6 MW), climb (1.2 MW at 65 m/s), cruise at 80 m/s, and a gliding descent. Battery-to-propeller efficiency 0.707. The usable state-of-charge window is 90%, with reserves added on top. We tested L/D 21 (optimistic), 18 and 16 (realistic). Assumed pack: 250 Wh/kg cells and a 0.70 cell-to-pack ratio give 175 Wh/kg at pack level, so 360 kWh weighs about 2,060 kg, about 18% of MTOW.
- Cruise battery power is 600/700/790 kW at L/D 21/18/16, about 1.7–2.2C.
- **Range on 360 kWh:**
  - At 3,000 m and L/D 21 with no reserve: about 106 km. The climb alone uses about 260 kWh over 13 min.
  - At 3,000 m and L/D 18 or 16: the mission can't be completed.
  - At 1,500 m with no reserve: about 122/105/93 km at L/D 21/18/16.
  - **With any reserve** (30 min loiter, or 20 min plus a 50 km diversion): not feasible at any altitude or L/D. **The reserve alone needs 240–350 kWh.**
- **Energy needed (kWh installed, L/D 21/18/16):**

  | Mission | L/D 21 | L/D 18 | L/D 16 |
  |---|---|---|---|
  | 100 km, no reserve | 349 | 386 | 428 |
  | 100 km, 30 min reserve | 616 | 697 | 777 |
  | 200 km, no reserve | 578 | 655 | 723 |
  | 200 km, 30 min reserve | 845 | 966 | 1,072 |
  | 200 km, 20 min + 50 km | 871 | 997 | 1,108 |
  | 200 km at 1,500 m, 30 min | 807 | 929 | n/a |
- **Weight spiral:**
  - With MTOW fixed, 200 km plus a 30 min reserve at L/D 18 needs about 3,460 kg more battery (about 5,500 kg of pack in total), which wipes out the payload.
  - If MTOW is allowed to grow, 200 km with no reserve converges at about 842 kWh and about 14.8 t. With a 30 min reserve the design never converges.
- **Power check:** a 1.6 MW takeoff from 360 kWh is a 4.4C peak, about 2,220 A at 720 V, or about 555 A per pack. That rules out today's high-energy cells, which are only rated for 1–2C.
- **Mission range per scheme** (from the B-opt study, 360 kWh): A 107 km (3,000 m) and 124 km (1,500 m) with no reserve; B-opt 109/125 km. Every 30 min reserve case is infeasible. With a "realistic" extra drag of +0.006 CD0 (A's L/D becomes 17.70), the 3,000 m case is infeasible and 1,500 m gives 103 km. Climbing to 3,000 m costs more energy than it saves at 80 m/s.
- Our inference: the 200 km all-electric claim for Heart's later ES-36 would need roughly 2× better pack Wh/kg, or a reserve carried by its hybrid generator.
- Takeaway: the X1 makes sense as a demonstrator. Battery energy density, not aerodynamics, is what limits it.

### Ch 4. Chemistry comparison
- Cell-level data:
  - **LFP:** 160–200 Wh/kg, 3,000–6,000 cycles. Safest, with a pack cost of $81/kWh (BNEF 2025), but too heavy.
  - **NMC:** 240–280 Wh/kg, 1,000–2,000 cycles, pack cost $128/kWh. Mature in eVTOL and CS-23 programs.
  - **NCA:** 250–300 Wh/kg, 500–1,500 cycles.
  - **Silicon-anode** (Amprius): 340–450 Wh/kg, with 500 announced. The 450 Wh/kg cell manages only 150–300 cycles and is rated 1C. Not certified for crewed aircraft.
  - **Li-S** (Lyten): 300–345 Wh/kg, with a 400 Wh/kg target and about 300–400 cycles.
  - **Solid-state** (QuantumScape QSE-5): 301 Wh/kg and 844 Wh/L.
  - **Li-air:** lab only.
- Same pack mass (2,057 kg), with range at 1,500 m, L/D 18, given as no reserve / with a 30 min reserve:

  | Chemistry | Energy | Range |
  |---|---|---|
  | LFP | 245 kWh | 62 km / – |
  | NMC | 374 kWh | 110 km / – |
  | NCA | 389 kWh | 115 km / – |
  | **Si-anode** | **648 kWh** | **211 km / 96 km** (the only one that can carry a reserve) |
  | Li-S | 475 kWh | 147 km / – |
  | Solid-state | 464 kWh | 143 km / – |
- Cell options for 4 × 90 kWh at 720 V:
  - 21700: 200s25p, 20,000 cells, 1,400 kg of cells.
  - 4680: 200s6p, 4,800 cells.
  - Si-anode pouch: 212s30p, 25,440 cells, 842 kg of cells.
- **Recommendation:**
  - **Demonstrator:** high-power NMC/NCA 21700 cells in 4 independent 90 kWh packs. They're proven, handle 4–5C, and have certification data.
  - **Product:** silicon-anode NMC, the only chemistry that roughly doubles range at the same mass, and it uses standard Li-ion manufacturing. Today's 450 Wh/kg cells, though, are 1C with 150–300 cycles, while the X1 needs a 4.4C peak and 1,000+ cycles. A realistic target is a power-balanced cell of about 350–400 Wh/kg (Amprius lists 340–390 Wh/kg at 3–10C).
  - Watch Li-S and solid-state. Avoid LFP for propulsion.
- Note: some LFP/NMC/NCA values are general literature figures that this study didn't check against a specific source.

### Ch 5. Structural "honeycomb" wing battery
- **Idea:** pack cylindrical cells into the wing box and bond them with potting, so the cells act as a honeycomb core that carries structural load.
- **Volume isn't the limit.** The wing box holds about 6.4 m³, enough for about 24,000 4680 cells (~2,090 kWh). 360 kWh needs only about 17–20% of it. Mass is the real constraint.
- **Method:** a half-wing beam model (strut at y = 6.5 m, strut angle about 24.6°) with Schrenk lift distribution. Ultimate load cases: +3.75 g, −1.5 g, and a 3 g landing. Five placements were compared.
- **Structural pack mass:** 1,753 kg (cells 1,440, potting 167, busbars/BMS 86, fire barriers 60) vs 2,057 kg for a conventional pack.
- **Bending relief:**
  - Cells inboard of the strut give **no** relief, because the peak moment (about 397 kNm) sits at the strut and is set by the loads outboard of it.
  - Cells outboard of the strut cut the wing moment by 33% and strut tension by 29%. The costs: landing-case strut compression nearly triples (65 → 174 kN), roll inertia rises 113%, and crash exposure increases.
- **Net mass saving** (about 2.3–3.3% of MTOW, equivalent to about 45–65 kWh or +10–15% energy):

  | Placement | Net saving |
  |---|---|
  | Inboard block | 280 kg |
  | Spread inboard of the strut | 257 kg |
  | Outboard of the strut | 377 kg |
  | Full span | 321 kg |

  About 300 kg comes from deleting pack structure. The other 0–120 kg is bending relief, which only exists outboard of the strut.
- **Bond strength is the key finding.** Peak shear on the core is 0.5–1.5 MPa and peel is 0.4–1.1 MPa. Structural PU or epoxy adhesives bonded to **bare or primed metal cans** have design values of 2.4–3.8 MPa (typical datasheet values ×0.25), so margins are roughly +60% to +600%. **With ordinary PET-wrapped cells, the shrink film's adhesive limits the bond** (2 MPa typical → 0.5 MPa design), and every placement fails. So the cells must be unwrapped and primed, with electrical insulation provided by the potting or a coating instead.
- **Thermal:**
  - Takeoff plus climb heats the pack about 30 K with essentially no cooling during that time.
  - A spread layout can reject the cruise losses (~18 kW) passively through the skins. An inboard block can reject only about 13–14 kW, which isn't enough.
  - A full-depth block of NMC cells gets too hot in the core (72–289 K gradient), so keep the stack to about 2 tiers or add conduction fins.
- **Recommendation:** spread the cells from the root to the outboard nacelle (about y 1.2–7.8 m), 2 tiers deep, bonded with structural PU of at least 10 MPa class to primed cans, with fins conducting heat to the skins. Net saving about 250–300 kg. Treat fully outboard placement as a later step.
- **Open issues:** crashworthiness, thermal-runaway venting inside the wing, cell swelling, the fact that cells can't be replaced individually, flutter, and certification. There is no established certification path, and no aircraft has flown with this.
- Image: `battery/structural_wing_pack.png`.

### Ch 6. The front-wing schemes in AVL
- **AVL in one line:** a fast vortex-lattice method that models lifting surfaces only. It has no viscous stall, so stall is estimated as the moment the first wing strip reaches an assumed section clmax (wing 1.6, foreplane 1.4).
- **Schemes:**
  - **A:** the baseline T-tail.
  - **B:** a Piaggio P.180-style three-surface layout. Foreplane 3.5 m² plus a tail shrunk to 60%.
  - **C:** a foreplane replaces the horizontal tail entirely ("Musk's literal" version).
  - **B-opt:** the best B found by a sweep. 4 m² foreplane at x = 7 m, +2° incidence, tail reduced to 4.8 m².
- Fair comparison: CG placed for 15% static margin in each scheme, and everything trimmed at cruise CL 0.631.
- **Scheme C:**
  - Statically unstable at the same CG (static margin −17%), it shows L/D 22.0 (+3–4%), but only with active stability augmentation. It also shows a deep-stall-trap signature.
  - Made stable (15% margin), the 6 m² foreplane needs +21° of elevator to trim and runs at its clmax in cruise. L/D drops to 18.4 and range to 121 km (−13.6%), and the foreplane stall gives Vs about 71 m/s, so the aircraft has no usable CL range.
  - Area sweep from 2 to 18 m²: **the smallest viable foreplane is 10 m²** (trim 15.9°, L/D 18.40, range −13.6%). Every viable size loses 13.6–16.4% of range.
  - Breakdown vs A: deleting the tail is worth +5.3% L/D, but trim/induced drag costs −17.8% (span efficiency falls from 0.95 to 0.52). Net −13.5%.
- **Scheme B (original):** L/D 21.6 vs 21.3, but the wing stalls before the foreplane, so it's **not canard-safe**.
- **B sweep** (foreplane 4–12 m² × position x 2.5–7 m): larger foreplanes lose range (down to −7.5%). The best is 4 m² at x 7 m: L/D 21.38, +0.4%. Shrinking the tail to 4.8 m² gives L/D 21.60, **+1.4%**. A P.180-proportioned 14.5 m² tail gives −4.0%.
- **B-opt vs A at 15% static margin:**
  - L/D 21.60 vs 21.28 (**+1.5%**). Simple range 142.3 vs 140.2 km. Mission range +1.5–2 km.
  - **Stall order:** the foreplane stalls first (CL 1.474 vs the wing's 1.556) and the nose drops. That's the safe P.180-style behavior. The cost is a CLmax 0.15 lower and **Vs 45.1 m/s vs 43.0** (87.7 vs 83.7 kt).
  - **Rotation is the weak point.** With an elevator on the small tail only, the nose wheel doesn't lift until about **54 m/s** (≈1.2 Vs), against a target VR of 49.6 m/s. Possible fixes: a foreplane flap, a tail of about 6–6.5 m², or a larger elevator chord. Each of these eats part of the 1.5% gain. (A's own rotation result isn't meaningful: at 15% margin its CG falls behind the estimated main gear, which points to an inconsistency in the photo geometry.)
  - **Phugoid:** period 42 s with ζ ≈ −0.01, roughly neutral, vs A at 49 s and +0.021. AVL's phugoid damping is unreliable anyway, so read it as "lightly damped, watch it."
  - **Engine-out:** with an outboard motor out, B-opt needs **8.8° of rudder** vs A's 11.1° (limit 25°). The fin is unchanged and still adequate. Vmc is about 38 m/s, below Vs.
  - Climb is unchanged (about 1,763 fpm on 4 motors, 1,182 on 3). Short period and dutch roll are well damped. The spiral mode doubles in about 26 s, which is acceptable.
- Takeaway: a canard replacing the tail (C) is clearly worse. A small foreplane added to a smaller tail (B-opt) is a small, fragile gain, inside the geometry uncertainty.
- Images: `results/canard_sweep.png`, `results/schemeB_sweep.png`, `results/schemeBopt_summary.png`, `results/high_alpha_plots.png`, `results/x1_Bopt_views.png`, `results/x1_C10_views.png`.

### Ch 7. CFD setup
- **Why CFD:** AVL ignores the fuselage, nacelles, struts, viscosity and real stall.
- **Solver:** OpenFOAM simpleFoam (steady RANS) with the k-ω SST turbulence model and wall functions. 80 m/s at 3,000 m conditions (Re ≈ 8.4 million).
- **Domain:** a **half model** with a symmetry plane. Angle of attack is set by the flow direction, so one mesh serves every α.
- **Configurations:** A, B-opt and C10 (the 10 m² canard).
- **Meshes:** snappyHexMesh with 5 prism layers. **Coarse ≈ 1.1 million cells; medium ≈ 2.3 million.** 1,500 iterations per case. Cases ran one at a time on 6 cores because memory was limited to 15 GB, in an overnight queue.
- **Workaround:** OpenFOAM's built-in force tools crashed in this build. We wrote our own script, `forces.py`, which integrates pressure and wall shear stress from the saved flow fields.
- **Runs:** coarse sweeps at α 0/4/8/12/16 for A and B-opt and 0/4/8/12 for C10. Medium runs: A at α 0 and 8, B-opt at α 0. Control surfaces were left at 0° (untrimmed).
- Image: `results/x1_Bopt_cfd_views.png`, `results/x1_C10_cfd_views.png`.

### Ch 8. CFD results
- **Coarse mesh first:**
  - Cruise L/D at CL 0.631 was A 12.9, B-opt 12.7, C10 13.4 (untrimmed), vs AVL's 21.3/21.6/18.4.
  - The wing separated early, at α 4–8°.
  - Static margins from CFD came out at A 10.7%, B-opt 4.5% and C10 about neutral (−0.3%).
- **Mesh check (A at α 8):**
  - Upper-surface reversed-flow area 47% → 10%.
  - CL 0.915 → 1.128 (AVL 1.432).
  - CD 0.148 → 0.090 (−39%).
  - L/D 6.2 → 12.5.
  - At α 0, CD fell 16% (A) and 18% (B-opt).
  - **So most of the early separation was a mesh error.** Drag still isn't fully mesh-converged, so the absolute numbers are conservative.
- **Cruise efficiency, corrected for the medium mesh:**
  - **A ≈ 15.0 and B-opt ≈ 14.9**, vs AVL's ~21.
  - The extra drag of B-opt over A shrank from 9 to 2 counts. CFD can't tell them apart, so B-opt's +1.5% is neither confirmed nor refuted.
  - Why the gap to AVL: an unconverged mesh, plus real interference drag that AVL's build-up lacks. At α 0 on the medium mesh, struts contribute 63 counts, nacelles 75 and the fuselage 62, vs a total build-up CD0 of 210–220 counts.
- **C10, trimmed, is not better.** Untrimmed it looks about 4–5% better (≈15.7 if the same mesh shift applies; no medium run). But to trim it must deflect the foreplane, which AVL estimates costs about 14% of L/D.
- **The foreplane stalls first and lifts less than AVL predicts:**
  - C10 coarse, α 0/4/8/12: CL 0.55/0.88/0.96/1.03.
  - Foreplane CL peaks at α 8 at 0.080 (AVL 0.167) and falls by α 12.
  - Reversed flow is foreplane 78% vs wing 49% at α 12.
  - Foreplane lift slope is about ⅓ of AVL's for B-opt and about 62% for C10. Stall order matches AVL (canard-safe).
  - At α 12 all three configurations have the same lift (A 1.055, B-opt 1.063, C10 1.031). Coarse CLmax values are low by at least about 0.2.
- **Stability revision:**
  - On the medium mesh, A's dCm/dCL is −0.163, 74% of AVL's value (coarse was only 60%).
  - So our earlier warning that B-opt and C10 would need the CG moved forward by 10–17% MAC was probably too pessimistic.
  - This isn't re-checked for B-opt/C10, which have no medium runs at higher α.
- **Nacelle-wing junction separation:**
  - At α 8 on the medium mesh, the remaining separation sits just behind and outboard of the two nacelle-wing junctions (y ≈ 3–4 m and 8–8.7 m).
  - Nacelle drag barely changes with the mesh (223 → 233 counts).
  - This may be a real feature of this pod placement. A finer mesh is needed to confirm it.
- Images:
  - `report_1020/A_a8_sep_coarse_vs_medium.png`
  - `report_1020/mesh_check_drag.png`
  - `report_1020/C10_sep_a8_a12.png`
  - `report_1020/cfd_vs_avl.png`
  - `report_1019c/cfd_drag_breakdown.png`
  - `cfd/img/A_coarse_a8_cp_iso.png`
  - `cfd/img/A_coarse_a8_slice_y5_wing.png`

### Ch 9. Honest limitations and corrections
- **CAD bug:** an OpenVSP parameter (FineRatio = length/radius) made the nacelles and sponsons in the first CAD export **twice the intended diameter**. It was found and fixed. Measured on the CFD meshes, the nacelles are 0.80 m (intended 0.8) and the sponsons about 0.84 m, so **the CFD used the correct geometry**. We had earlier said otherwise, and that was wrong. The AVL results never used the CAD.
- The mesh isn't converged: only two levels, no extrapolation, and drag still moves 16–39% per refinement. The cases at α ≥ 8° are partly unsteady.
- **C10 at α 16 diverged** (the solver crashed about a minute in). There's no result, and it wasn't re-run.
- No propellers or slipstream, no landing gear, no trimmed CFD, wall functions only.
- AVL is linear and stall uses assumed clmax values.
- The geometry is photo-estimated, with wing area about ±15%. The CG and masses are assumptions.
- The battery and structure numbers rely on assumed knockdowns and typical datasheet values, not test allowables.

### Ch 10. Conclusions and next steps
1. **The battery limits the mission.** 360 kWh gives about 105–125 km with no reserve and can't fly with a reserve. Silicon-anode cells are the product path; NMC/NCA suits the demonstrator.
2. A structural wing battery could save about 250–380 kg, but it needs bare, primed cans and a long certification road.
3. A canard replacing the tail (C) costs about 14% range once it's made stable and trimmed. A small foreplane plus a smaller tail (B-opt) gains about 1.5% in AVL, and CFD shows it tied with the baseline. Not worth the complexity on this evidence.
4. CFD puts real-world L/D nearer 15 than 21. Interference drag from struts, nacelles and the fuselage matters, and the nacelle-wing junctions deserve design attention.
5. **Next steps:** a finer CFD mesh and a mesh-convergence study; medium-mesh runs at high α for B-opt and C10; trimmed CFD and propeller slipstream; a detailed nacelle-junction fairing study; finite-element analysis and testing of the cell-potting bond; better geometry if Heart publishes more data.

## 3. Key findings recap (one paragraph)
Using only public data, we built a parametric Heart X1 and analyzed it with AVL, mission and battery models, a structural wing-battery model, and OpenFOAM CFD. All results are estimates. The battery dominates everything. The published 360 kWh pack flies about 105–125 km with no reserve and can't carry a 30-minute reserve. Silicon-anode cells would roughly double range at the same mass (648 kWh, 211 km), while high-power NMC/NCA suits the demonstrator. Building cells into the wing as a bonded honeycomb could save about 250–380 kg, but only with bare, primed cell cans. Replacing the tail with a canard costs about 13.6% range once it's stable (the minimum viable foreplane is 10 m²). The best three-surface layout, B-opt (4 m² foreplane at x 7 m, 4.8 m² tail), gains about 1.5% L/D in AVL. That gain comes with a 2 m/s higher stall speed and weak takeoff rotation (the nose wheel lifts at about 54 m/s). CFD on a refined mesh shows A and B-opt tied at L/D about 15 (vs AVL's about 21), foreplanes stalling first and lifting less than AVL predicts, and the remaining separation concentrated at the nacelle-wing junctions.

## 4. Existing images worth using (paths relative to /workspace/x1_model)
- Geometry: `results/x1_A_v2_views.png`, `results/x1_Bopt_views.png`, `results/x1_C10_views.png`, `results/x1_A_cfd_views.png`, `results/x1_Bopt_cfd_views.png`, `results/x1_C10_cfd_views.png`
  - Avoid `results/x1_A_views.png`, `x1_B_views.png` and `x1_C_views.png`. They show the old pods at twice the diameter.
- Battery/structure: `battery/structural_wing_pack.png`
- AVL studies: `results/canard_sweep.png`, `results/schemeB_sweep.png`, `results/schemeBopt_summary.png`, `results/high_alpha_plots.png`
- CFD:
  - `report_1020/A_a8_sep_coarse_vs_medium.png`
  - `report_1020/mesh_check_drag.png`
  - `report_1020/C10_sep_a8_a12.png`
  - `report_1020/cfd_vs_avl.png`
  - `report_1019c/cfd_drag_breakdown.png`
  - `report_1019b/Bopt_a8_cp_iso.png`
  - `report_1019b/Bopt_a8_slice_y1.8_fp_wing.png`
  - `report_1019b/sep_run_A_coarse_a8.png`
  - `report_1019c/sep_run_C10_coarse_a4.png`
  - `cfd/img/A_coarse_a8_cp_iso.png`
  - `cfd/img/A_medium_a0_cp_iso.png`
  - `cfd/img/A_coarse_a8_slice_y5_wing.png`
