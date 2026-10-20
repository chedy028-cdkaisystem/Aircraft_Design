# X1 explainer video

"Redesigning an electric airliner, on a laptop": a hand-drawn explainer of this study in 10 chapters, built from [`../video_brief.md`](../video_brief.md).

| File | What it is |
|---|---|
| `x1_on_a_laptop.mp4` | The video: 1080p, 30 fps, silent |
| `x1_on_a_laptop.srt` | Captions, one per narration line |
| `x1_on_a_laptop_narration_timing.json` | Narration lines with start and end times, for adding a voice-over |
| `index.html` | The same video as an interactive page: play, step, chapters, captions, browser voice-over |
| `assets/` | The drafting-board texture and the study's own figures, recoloured for the dark board |
| `tools/prep_assets.py` | Builds `assets/` from the study's figures |
| `tools/record.mjs` | Renders `index.html` frame by frame into the MP4 |

All numbers are estimates from an independent study, not Heart Aerospace data. The video uses no Heart photos, only the study's own renders and plots and generic illustrations drawn from the study's estimated geometry.

## Re-render

From this folder, with Microsoft Edge installed and an ffmpeg build that has `h264_nvenc`:

```bash
python tools/prep_assets.py .. assets
npm install playwright-core@1.55.0
node tools/record.mjs video index.html x1_on_a_laptop.mp4 3
```

`record.mjs` reads `FFMPEG_BINARY` (default `ffmpeg`) and `EDGE_PATH`. The last argument is the number of parallel render workers. `node tools/record.mjs stills index.html stills` writes one PNG per narration beat for review.

`index.html` loads its fonts (Kalam, JetBrains Mono) from Google Fonts.
