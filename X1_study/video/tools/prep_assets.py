"""Build the redesigned video's image assets from the X1 study's own figures.

Board: navy drafting paper with a faint grid, vignette and dither (1920x1080).
Plots: lightness-inverted (hue kept) and keyed to transparent, so they sit on the board.
CFD renders: white background keyed out; colour fields cropped and kept as-is.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

SRC = Path(sys.argv[1])          # repo X1_study folder
OUT = Path(sys.argv[2])          # x1-explainer/assets
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def board():
    W, H = 1920, 1080
    base = np.array([11, 19, 34], float)                  # #0B1322
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.hypot((xx - W / 2) / (W * .62), (yy - H / 2) / (H * .62))
    vign = np.clip(1 - .38 * d ** 2.2, .55, 1)[..., None]
    img = base * vign
    grid = Image.new('L', (W, H), 0)
    g = ImageDraw.Draw(grid)
    for x in range(0, W, 30):                             # 20 board units = 30 px
        g.line([(x, 0), (x, H)], fill=60 if x % 150 == 0 else 26)
    for y in range(0, H, 30):
        g.line([(0, y), (W, y)], fill=60 if y % 150 == 0 else 26)
    gl = np.asarray(grid, float)[..., None] / 255
    line = np.array([70, 104, 160], float)
    img = img + (line - img) * gl * .30 * vign
    img += rng.normal(0, .9, img.shape)                    # dither against banding
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / 'board.png', optimize=True)


def dark(im, gamma=.62):
    """Flip lightness, keep hue and chroma; return RGBA with black keyed to alpha."""
    a = np.asarray(im.convert('RGB'), float) / 255
    mx, mn = a.max(2, keepdims=True), a.min(2, keepdims=True)
    L = (mx + mn) / 2
    L2 = (1 - L) ** gamma
    b = np.clip(a + (L2 - L), 0, 1)
    al = b.max(2, keepdims=True)
    rgb = np.where(al > 1e-3, b / np.maximum(al, 1e-3), 0)
    rgba = np.concatenate([rgb, al], 2)
    return Image.fromarray((rgba * 255).astype(np.uint8), 'RGBA')


def key_white(im, lo=.90, hi=.985):
    a = np.asarray(im.convert('RGB'), float) / 255
    w = a.min(2)
    al = np.clip((hi - w) / (hi - lo), 0, 1)[..., None]
    return Image.fromarray((np.concatenate([a, al], 2) * 255).astype(np.uint8), 'RGBA')


def trim(im, pad=6):
    bb = im.getchannel('A').point(lambda v: 255 if v > 18 else 0).getbbox()
    x0, y0, x1, y1 = bb
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


board()
dark(Image.open(SRC / 'results/x1_A_v2_views.png')).save(OUT / 'views_A_dark.png', optimize=True)
sep = Image.open(SRC / 'report_1020/A_a8_sep_coarse_vs_medium.png')
trim(dark(sep.crop((150, 56, 830, 482)))).save(OUT / 'sep_coarse_dark.png', optimize=True)
trim(dark(sep.crop((150, 544, 830, 975)))).save(OUT / 'sep_medium_dark.png', optimize=True)
pack = Image.open(SRC / 'battery/structural_wing_pack.png')
trim(dark(pack.crop((562, 0, 1102, 462)))).save(OUT / 'pack_moment_dark.png', optimize=True)
cp = Image.open(SRC / 'cfd/img/A_coarse_a8_cp_iso.png').crop((0, 0, 1440, 900))   # drop the colour bar
trim(key_white(cp), 4).save(OUT / 'cp_iso_keyed.png', optimize=True)
def unhatch(im, box=(0, 0, 760, 560), it=6):
    """Paint out the stray black mesh lines drawn over the top-left of the CFD slices."""
    a = np.asarray(im.convert('RGB'), float)
    m = np.zeros(a.shape[:2], bool)
    x0, y0, x1, y1 = box
    m[y0:y1, x0:x1] = a[y0:y1, x0:x1].max(2) < 90
    for _ in range(it):
        acc = np.zeros_like(a); n = np.zeros(a.shape[:2])
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ok = np.roll(np.roll(~m, dy, 0), dx, 1)
                acc += np.roll(np.roll(a, dy, 0), dx, 1) * ok[..., None]; n += ok
        fill = m & (n > 0)
        a[fill] = acc[fill] / n[fill][:, None]
        m = m & ~fill
    return Image.fromarray(a.astype(np.uint8))


unhatch(Image.open(SRC / 'cfd/img/A_coarse_a8_slice_y5_wing.png')).crop((300, 190, 1420, 820)).save(OUT / 'slice_A_a8.jpg', quality=92)
unhatch(Image.open(SRC / 'report_1019b/Bopt_a8_slice_y1.8_fp_wing.png')).crop((340, 262, 1380, 847)).save(OUT / 'slice_Bopt_a8.jpg', quality=92)
for p in sorted(OUT.iterdir()):
    print(p.name, Image.open(p).size)
