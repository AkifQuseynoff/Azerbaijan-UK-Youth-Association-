import json, sys
import numpy as np
from PIL import Image
from collections import deque
import potrace

im = Image.open('logos/p1.png').convert('RGB')
a = np.array(im).astype(int)
H, W, _ = a.shape
r, g, b = a[..., 0], a[..., 1], a[..., 2]
a[:14, :, :] = 255  # remove the black bar at the top edge of the PDF render
r, g, b = a[..., 0], a[..., 1], a[..., 2]

red = (r > 140) & (g < 120) & (b < 120) & (r - g > 70)
green = (g > 100) & (g - r > 28) & (g - b > 18) & (r < 120)
blue = (b > 110) & (b - r > 45) & (b - g > 25) & ~green & ~red
# darker anti-aliased edge pixels of blue
blue |= (b > 90) & (b - r > 35) & (b - g > 18) & ~green & ~red & ((r + g + b) < 420)

MARK_Y = 1150
def label(mask):
    lab = np.zeros(mask.shape, dtype=np.int32); n = 0; comps = []
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if lab[y0, x0]: continue
        n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
        while q:
            y, x = q.popleft(); pts.append((y, x))
            for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                yy, xx = y+dy, x+dx
                if 0 <= yy < H and 0 <= xx < W and mask[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n; q.append((yy, xx))
        pts = np.array(pts)
        comps.append((n, len(pts), pts[:,1].min(), pts[:,0].min(), pts[:,1].max(), pts[:,0].max()))
    return lab, comps

def to_path(mask, scale=1.0, **kw):
    bm = potrace.Bitmap(~mask)
    pl = bm.trace(turdsize=kw.get('turd', 30), alphamax=kw.get('alpha', 1.1), opticurve=True, opttolerance=kw.get('tol', 0.4))
    d = []
    f = lambda p: f"{p.x*scale:.1f} {p.y*scale:.1f}"
    for c in pl:
        d.append('M' + f(c.start_point))
        for s in c.segments:
            if s.is_corner: d.append('L' + f(s.c) + 'L' + f(s.end_point))
            else: d.append('C' + f(s.c1) + ' ' + f(s.c2) + ' ' + f(s.end_point))
        d.append('Z')
    return ''.join(d)

out = {}
mark_blue = blue.copy(); mark_blue[MARK_Y:, :] = False
lab, comps = label(mark_blue)
comps = [c for c in comps if c[1] > 3000]
print('blue components (n,size,x0,y0,x1,y1):'); [print(' ', c) for c in comps]
for nme, m in (('red', red), ('green', green)):
    l2, c2 = label(m); c2 = [c for c in c2 if c[1] > 1500]; print(nme, c2)
    keep = np.isin(l2, [c[0] for c in c2]); out[nme] = {'d': to_path(keep, turd=20), 'bbox': [int(c2[0][2]), int(c2[0][3]), int(c2[0][4]), int(c2[0][5])]}
for c in comps:
    out[f'blue_{c[0]}'] = {'d': to_path(lab == c[0]), 'bbox': [int(c[2]), int(c[3]), int(c[4]), int(c[5])], 'size': int(c[1])}
# wordmark region
txt = blue.copy(); txt[:MARK_Y, :] = False
txt |= ((r < 140) & (b > 90) & (b - r > 25) & ~green & ~red) & (np.arange(H)[:, None] >= MARK_Y)
out['text'] = {'d': to_path(txt, turd=12, alpha=1.0, tol=0.3)}
json.dump(out, open('logo_paths.json', 'w'))
print({k: (len(v['d']) if 'd' in v else 0) for k, v in out.items()})
