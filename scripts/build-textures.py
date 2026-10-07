"""
Hand-made mark texture set: twelve circular "swatches" built from irregular dashes, hatches, dots, bursts and washes.
Original generative marks (no tracing). Usage: python3 scripts/build-textures.py [ref|brand]
ref   = the sample palette from the reference print (cream, mustard, grey, brown, black), for comparison only
brand = The Scribble Lab palette; writes public/texture/NN.svg and sheet.svg
"""
import sys, math, random, os
MODE = sys.argv[1] if len(sys.argv) > 1 else "brand"
P = {
 "ref":   dict(bg="#ebe6dc", ink="#1d1d1b", grey="#bdb5a8", grey2="#8f897f", c1="#e3b23a", c2="#c79a22", brown="#8a5a35", flat1="#bfb6a8", flat2="#e5b53b"),
 "brand": dict(bg="#ffffff", ink="#2f2058", grey="#c2b3ec", grey2="#6b5291", c1="#ff663e", c2="#d99a12", brown="#1e9e74", flat1="#ffe0d8", flat2="#ff663e"),
}[MODE]
R = 50
def rnd(seed): return random.Random(seed)
def f(x): return f"{x:.1f}"
def inside(x, y, m=0): return (x-50)**2 + (y-50)**2 <= (R-m)**2
def stroke(x1, y1, x2, y2, w, col, r, bend=0.0):
    mx, my = (x1+x2)/2 + r.uniform(-bend, bend), (y1+y2)/2 + r.uniform(-bend, bend)
    return f'<path d="M{f(x1)} {f(y1)}Q{f(mx)} {f(my)} {f(x2)} {f(y2)}" stroke="{col}" stroke-width="{f(w)}" stroke-linecap="round" fill="none"/>'

def t1(r):  # vertical dashes in columns
    o = []
    for cx in [x for x in range(-2, 106, 5)]:
        y = r.uniform(-6, 2)
        while y < 100:
            h = r.uniform(3.2, 6.2); o.append(stroke(cx+r.uniform(-.6,.6), y, cx+r.uniform(-.8,.8), y+h, r.uniform(2.0, 3.0), P["ink"], r, .5)); y += h + r.uniform(1.4, 3)
    return o
def t2(r): return [f'<circle cx="50" cy="50" r="50" fill="{P["flat1"]}"/>']
def t3(r):  # teardrops/triangles in offset rows
    o = []
    for j, y in enumerate(range(0, 106, 7)):
        for x in range(-2 + (j % 2) * 4, 106, 8):
            s = r.uniform(2.6, 3.8); a = r.uniform(-.25, .25)
            pts = [(x-s, y-s), (x+s, y-s), (x+r.uniform(-.6,.6), y+s*1.3)]
            o.append('<path d="M%s Z" fill="%s" transform="rotate(%s %s %s)"/>' % (" L".join(f"{f(px)} {f(py)}" for px, py in pts), P["c1"], f(a*57), f(x), f(y)))
    return o
def t4(r):  # sunburst rings
    o = []
    for ring, (r0, r1, n, col) in enumerate([(9, 21, 56, P["c2"]), (23, 36, 84, P["c1"]), (38, 54, 120, P["c2"])]):
        for k in range(n):
            a = (k / n) * math.tau + r.uniform(-.03, .03); ra, rb = r0 + r.uniform(0, 2), r1 - r.uniform(0, 3)
            o.append(stroke(50+math.cos(a)*ra, 50+math.sin(a)*ra, 50+math.cos(a)*rb, 50+math.sin(a)*rb, r.uniform(1.0, 1.6), col, r, .25))
    o.append(f'<circle cx="50" cy="50" r="5.5" fill="none" stroke="{P["c2"]}" stroke-width="1.6"/>')
    return o
def t5(r):  # irregular blobs
    o = []; placed = []
    for _ in range(900):
        x, y, s = r.uniform(0, 100), r.uniform(0, 100), r.uniform(2.2, 4.8)
        if not inside(x, y, 1) or any((x-a)**2 + (y-b)**2 < (s+c+.6)**2 for a, b, c in placed): continue
        placed.append((x, y, s))
        pts = [(x + math.cos(t)*s*r.uniform(.7, 1.15), y + math.sin(t)*s*r.uniform(.7, 1.15)) for t in [i/7*math.tau for i in range(7)]]
        o.append('<path d="M%s Z" fill="%s" stroke="%s" stroke-width=".8" stroke-linejoin="round"/>' % (" L".join(f"{f(px)} {f(py)}" for px, py in pts), P["brown"], P["brown"]))
    return o
def t6(r):  # woven scribble mesh: crossing strokes at many angles
    o = []
    for _ in range(520):
        x, y = r.uniform(-4, 104), r.uniform(-4, 104); a = r.choice([0.15, 0.75, 1.35, 2.0, 2.6]) + r.uniform(-.2, .2); l = r.uniform(9, 22)
        o.append(stroke(x-math.cos(a)*l/2, y-math.sin(a)*l/2, x+math.cos(a)*l/2, y+math.sin(a)*l/2, 1.15, P["grey2"], r, 1.2))
    return o
def t7(r): return [f'<circle cx="50" cy="50" r="50" fill="{P["flat2"]}"/>']
def t8(r):  # offset rows of short dashes
    o = []
    for j, y in enumerate(range(-2, 106, 5)):
        x = -4 + (j % 2) * 3 + r.uniform(0, 2)
        while x < 100:
            l = r.uniform(2.2, 3.4); o.append(stroke(x, y+r.uniform(-.5,.5), x+l, y+r.uniform(-.5,.5)+.2, 2.1, P["grey2"], r, .2)); x += l + r.uniform(1.6, 2.6)
    return o
def t9(r):  # horizontal mustard dashes of varied length
    o = []
    for y in range(-2, 106, 6):
        x = r.uniform(-12, -2)
        while x < 100:
            l = r.uniform(4, 12); o.append(stroke(x, y+r.uniform(-.7,.7), x+l, y+r.uniform(-.9,.9), r.uniform(1.8, 2.6), P["c1"], r, .5)); x += l + r.uniform(1.4, 3.4)
    return o
def t10(r):  # hatch patches
    o = []
    for _ in range(70):
        cx, cy = r.uniform(2, 98), r.uniform(2, 98); ang = r.uniform(0, math.pi)
        for k in range(9):
            off = (k - 4) * 2.4; l = r.uniform(8, 13)
            px, py = cx + math.cos(ang+math.pi/2)*off, cy + math.sin(ang+math.pi/2)*off
            o.append(stroke(px-math.cos(ang)*l/2, py-math.sin(ang)*l/2, px+math.cos(ang)*l/2, py+math.sin(ang)*l/2, 1.5, P["grey"], r, .4))
    return o
def t11(r):  # dots of varied size
    o = []; placed = []
    for _ in range(1400):
        x, y, s = r.uniform(0, 100), r.uniform(0, 100), r.choice([1.0, 1.2, 1.5, 1.9, 2.4])
        if not inside(x, y, 2) or any((x-a)**2 + (y-b)**2 < (s+c+2.2)**2 for a, b, c in placed): continue
        placed.append((x, y, s)); o.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(s)}" ry="{f(s*r.uniform(.85,1.1))}" fill="{P["ink"]}"/>')
    return o
def t12(r):  # dense wavy strokes, two tones
    o = []
    for y in range(-2, 106, 4):
        pts = f"M-4 {f(y)}"; x = -4
        while x < 104:
            x += r.uniform(5, 9); pts += f"L{f(x)} {f(y+r.uniform(-1.4,1.4))}"
        o.append(f'<path d="{pts}" stroke="{P["c2"] if (y//4)%2 else P["c1"]}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
    return o
GEN = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12]
def swatch(i):
    body = "".join(GEN[i](rnd(31 + i * 7)))
    return f'<clipPath id="c{i}"><circle cx="50" cy="50" r="{R}"/></clipPath><g clip-path="url(#c{i})">{body}</g>'
out = os.path.join(os.path.dirname(__file__), "..", "public", "texture")
os.makedirs(out, exist_ok=True)
if MODE == "brand":
    for i in range(12):
        open(os.path.join(out, f"{i+1:02d}.svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">{swatch(i)}</svg>')
cells = "".join(f'<g transform="translate({14 + (i % 3) * 116} {14 + (i // 3) * 116})">{swatch(i)}</g>' for i in range(12))
sheet = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 366 478" width="732" height="956"><rect width="366" height="478" fill="{P["bg"]}"/>{cells}</svg>'
open(os.path.join(out, f"sheet-{MODE}.svg"), "w").write(sheet); print(MODE, len(sheet)//1024, "KB")
