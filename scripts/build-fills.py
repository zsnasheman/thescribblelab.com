"""Seamless fill tiles for the three chosen textures (01 vertical dashes, 08 short offset dashes, 09 long horizontal dashes), in brand colours.
Writes public/texture/fill-NN-colour.svg (120 x 120 tiles, transparent background)."""
import random, os
COL = {"indigo": "#2f2058", "lavender": "#6b5291", "coral": "#ff663e", "mustard": "#d99a12", "emerald": "#1e9e74", "mist": "#c2b3ec", "tint": "#d9d3ea"}
T = 120
def seg(x1, y1, x2, y2, w, c):
    return f'<path d="M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}" stroke="{c}" stroke-width="{w:.1f}" stroke-linecap="round" fill="none"/>'
def lines(items): return "".join(items)
def f01(c, r):  # vertical dashes, columns every 6, sequences divide the tile height exactly so tiles join
    o = []
    for cx in range(3, T, 6):
        n = r.randint(11, 14); ys = [i * T / n for i in range(n)]
        for i, y in enumerate(ys):
            h = T / n * r.uniform(.55, .78); y0 = y + r.uniform(0, T / n * .2)
            o.append(seg(cx + r.uniform(-.7, .7), y0, cx + r.uniform(-.9, .9), y0 + h, r.uniform(2.3, 3.2), c))
    return o
def f08(c, r):  # short dashes in offset rows; dashes that cross the tile edge are repeated on the other side
    o = []
    for j in range(24):
        y = j * 5 + 2.5; n = 17; step = T / n
        for i in range(n):
            x = i * step + (step / 2 if j % 2 else 0) + r.uniform(-.4, .4); l = r.uniform(2.4, 3.4); dy = r.uniform(-.4, .4)
            for sx in (0, -T):
                o.append(seg(x + sx, y + dy, x + sx + l, y + dy, 2.1, c))
    return o
def f09(c, r):  # long horizontal dashes
    o = []
    for j in range(20):
        y = j * 6 + 3; x = 0.0
        n = r.randint(7, 9); step = T / n
        for i in range(n):
            x0 = i * step + r.uniform(0, 1.5); l = step * r.uniform(.5, .78); dy = r.uniform(-.8, .8); dy2 = r.uniform(-1, 1); w = r.uniform(1.9, 2.6)
            for sx in (0, -T):
                o.append(seg(x0 + sx, y + dy, x0 + sx + l, y + dy2, w, c))
    return o
out = os.path.join(os.path.dirname(__file__), "..", "public", "texture"); os.makedirs(out, exist_ok=True)
for n, fn in (("01", f01), ("08", f08), ("09", f09)):
    for name, c in COL.items():
        body = "".join(fn(c, random.Random(int(n) * 17)))
        open(os.path.join(out, f"fill-{n}-{name}.svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {T} {T}" width="{T}" height="{T}">{body}</svg>')
print("ok")
