// Frame-exact recorder for the whiteboard explainer.
//   node record.mjs stills <page.html> <outDir>              end-of-beat PNGs for review
//   node record.mjs video  <page.html> <out.mp4> [workers]   30 fps H.264 (NVENC), silent, ~550 kbps
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [mode, page_, out, nw = '3'] = process.argv.slice(2);
const FFMPEG = process.env.FFMPEG_BINARY || 'ffmpeg';
const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const FPS = 30, TAIL = 1.5;
const ENC = ['-c:v', 'h264_nvenc', '-preset', 'p6', '-rc', 'vbr', '-spatial-aq', '1', '-b:v', '750k', '-maxrate', '3M', '-bufsize', '6M', '-g', '300', '-profile:v', 'high', '-pix_fmt', 'yuv420p'];

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(page_).href + '?record', { waitUntil: 'networkidle' });
  if (!await page.evaluate(() => window.__rec.ready())) throw new Error('fonts did not load');
  return page;
}
const run = (args) => new Promise((res, rej) => { const p = spawn(FFMPEG, args, { stdio: ['ignore', 'inherit', 'inherit'] }); p.on('close', c => c ? rej(new Error('ffmpeg exit ' + c)) : res()); });

const first = await openPage();
const { beats, total } = await first.evaluate(() => ({ beats: window.__rec.beats, total: window.__rec.total }));

if (mode === 'stills') {
  mkdirSync(out, { recursive: true });
  for (let i = 0; i < beats.length; i++) {
    await first.evaluate(i => { window.__rec.beat(i); window.__rec.seek(9999); }, i);
    await first.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await first.screenshot({ path: join(out, `beat_${String(i).padStart(3, '0')}.png`) });
  }
} else if (mode === 'video') {
  const frames = Math.ceil((total + TAIL) * FPS), W = Math.max(1, +nw), t0 = Date.now();
  // split at beat starts, close to equal frame counts
  const cuts = [0];
  for (let k = 1; k < W; k++) { const want = frames * k / W; let best = beats[1].start; for (const b of beats) if (Math.abs(b.start * FPS - want) < Math.abs(best * FPS - want)) best = b.start; cuts.push(Math.round(best * FPS)); }
  cuts.push(frames);
  const tmp = out + '.parts'; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
  let shots = 0;
  const worker = async (k) => {
    const page = k === 0 ? first : await openPage(), f0 = cuts[k], f1 = cuts[k + 1], part = join(tmp, `part_${k}.mp4`);
    const ff = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', ...ENC, part], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => ff.on('close', c => c ? rej(new Error(`ffmpeg part ${k} exit ${c}`)) : res()));
    const write = buf => new Promise(res => ff.stdin.write(buf) ? res() : ff.stdin.once('drain', res));
    let bi = -1, endMs = 0, still = null;
    for (let f = f0; f < f1; f++) {
      const T = f / FPS;
      let i = bi < 0 ? 0 : bi;
      while (i < beats.length - 1 && beats[i + 1].start <= T) i++;
      if (i !== bi) { bi = i; still = null; endMs = await page.evaluate(i => window.__rec.beat(i), i); }
      const local = T - beats[bi].start;
      if (still && local * 1000 > endMs + 40) { await write(still); continue; }
      await page.evaluate(s => window.__rec.seek(s), local);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 }); shots++;
      if (local * 1000 > endMs + 40) still = buf;
      await write(buf);
      if ((f - f0) % 1800 === 0) console.log(`worker ${k}: ${((f - f0) / (f1 - f0) * 100).toFixed(0)}%, ${shots} shots total, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    ff.stdin.end(); await done; return part;
  };
  const parts = await Promise.all(Array.from({ length: W }, (_, k) => worker(k)));
  writeFileSync(join(tmp, 'list.txt'), parts.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  await run(['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-c', 'copy', '-movflags', '+faststart', out]);
  rmSync(tmp, { recursive: true, force: true });
  // narration timeline + captions, same shape as the Beyond the Model pipeline
  const lines = beats.map((b, k) => ({ number: k + 1, label: String(k + 1), scene: b.scene + 1, scene_name: b.sceneName,
    start: +(b.start + .2).toFixed(2), end: +(b.start + b.dur - .1).toFixed(2), caption: b.text, text: b.text, on_screen: b.onScreen.map(s => `“${s}”`).join(', ') }));
  const base = out.replace(/\.mp4$/i, '');
  writeFileSync(base + '_narration_timing.json', JSON.stringify(lines, null, 2));
  const ts = s => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  writeFileSync(base + '.srt', lines.map(l => `${l.number}\n${ts(l.start)} --> ${ts(l.end)}\n${l.text}\n`).join('\n'));
  console.log(`done: ${frames} frames, ${shots} rendered, ${W} workers, ${((Date.now() - t0) / 60000).toFixed(1)} min`);
}
await browser.close();
