"""
Builds the website art layers from the supplied concept image (art direction, Sept 2026).

The concept is illustrative artwork, not completed client work. This script only crops,
cleans (removes the mock-up's own text, navigation, logo and stray marks), normalises
the paper tone so layers can sit on the site's paper colour, and derives a line-only
"ink" version of each scene for the sketch-becomes-space reveal.

Usage: python3 scripts/build-art.py /path/to/concept.png
Outputs go to public/art/. Requires numpy, opencv-python-headless, Pillow.
"""
import sys, os, numpy as np, cv2
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "art")
os.makedirs(OUT, exist_ok=True)

img = cv2.imread(SRC, cv2.IMREAD_COLOR)  # BGR
H, W = img.shape[:2]

# ---- 1. remove the mock-up's own copy, nav, logo, stray marks ------------------------
def mask_rects(rects, pad=0):
    m = np.zeros((H, W), np.uint8)
    for x0, y0, x1, y1 in rects:
        m[max(0, y0 - pad):y1 + pad, max(0, x0 - pad):x1 + pad] = 255
    return m

clean = img.copy()
text = mask_rects([
    (895, 14, 1430, 68),      # mock-up navigation and button
    (560, 222, 748, 372),     # tail of the headline
    (540, 376, 668, 402),     # tail of the sub-line
    (18, 910, 138, 956),      # gold squiggle
    (556, 694, 735, 768),     # tail of the next section heading
    (20, 985, 1470, 1030),    # discipline labels and underlines
])
clean = cv2.inpaint(clean, text, 6, cv2.INPAINT_TELEA)

# ---- 2. normalise paper to pure white so layers can multiply onto the paper colour ---
light = clean[(clean.min(axis=2) > 222)]
paper = np.percentile(light, 60, axis=0) if len(light) else np.array([250, 248, 246])
print("paper BGR", paper)
norm = np.clip(clean.astype(np.float32) / paper * 255.0, 0, 255)
# pull near-white up to white so the paper grain of the source does not show as a box
g = norm.min(axis=2, keepdims=True)
lift = np.clip((g - 236.0) / 14.0, 0, 1)
norm = norm + (255.0 - norm) * lift

# ---- 3. derived ink layer: fine dark line work only ---------------------------------
gray = cv2.cvtColor(norm.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
blur = cv2.GaussianBlur(gray, (0, 0), 5)
ink_a = np.clip((blur - gray) / 62.0, 0, 1) ** 0.9
ink_a = np.clip((ink_a * 1.15 - 0.07) / 0.93, 0, 1)
INDIGO = np.array([0x58, 0x20, 0x2f], np.float32)  # BGR of #2f2058
ink = 255.0 - ink_a[..., None] * (255.0 - INDIGO)

def feather(h, w, l=0, t=0, r=0, b=0, ellipse=False):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.ones((h, w), np.float32)
    if ellipse:
        cx, cy = (w - 1) / 2, (h - 1) / 2
        d = np.sqrt(((xx - cx) / (w / 2)) ** 2 + ((yy - cy) / (h / 2)) ** 2)
        return np.clip((1.0 - d) / 0.28, 0, 1) ** 1.2
    if l: a *= np.clip(xx / l, 0, 1)
    if t: a *= np.clip(yy / t, 0, 1)
    if r: a *= np.clip((w - 1 - xx) / r, 0, 1)
    if b: a *= np.clip((h - 1 - yy) / b, 0, 1)
    return a

# Areas where the mock-up's own words sat: faded out to transparent rather than painted over.
kill = np.zeros((H, W), np.float32)
for x0, y0, x1, y1 in [(560, 214, 752, 376), (540, 374, 672, 406), (890, 10, 1436, 60), (556, 690, 740, 770)]:
    kill[y0:y1, x0:x1] = 1.0
kill = cv2.GaussianBlur(kill, (0, 0), 9)

def to_rgba(bgr, fe_mask, extra_alpha=None):
    """Colour-to-alpha against white: paper becomes transparent, pigment keeps its colour and density."""
    n = bgr.astype(np.float32)
    a = np.clip((255.0 - n).max(axis=2) / 255.0, 0, 1)
    a = np.clip((a - 0.025) / 0.975, 0, 1)
    safe = np.maximum(a, 1e-3)[..., None]
    col = np.clip(255.0 - (255.0 - n) / safe, 0, 255)
    a = a * fe_mask
    if extra_alpha is not None: a = a * extra_alpha
    return np.dstack([col, a * 255.0])

def save_rgba(name, arr, scale=1, q=76):
    a = np.clip(arr, 0, 255).astype(np.uint8)
    if scale != 1:
        a = cv2.resize(a, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGRA2RGBA)).save(os.path.join(OUT, name), "WEBP", quality=q, alpha_quality=85, method=6)
    print(name, a.shape[1], "x", a.shape[0], os.path.getsize(os.path.join(OUT, name)) // 1024, "KB")

def save(name, arr, scale=1, q=86):
    a = np.clip(arr, 0, 255).astype(np.uint8)
    if scale != 1:
        a = cv2.resize(a, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        blur_ = cv2.GaussianBlur(a, (0, 0), 1.1)
        a = cv2.addWeighted(a, 1.35, blur_, -0.35, 0)
    Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB)).save(os.path.join(OUT, name), "WEBP", quality=q, method=6)
    print(name, a.shape[1], "x", a.shape[0], os.path.getsize(os.path.join(OUT, name)) // 1024, "KB")

def crop_pair(name, x0, y0, x1, y1, fe, scale=1, ellipse=False):
    c = norm[y0:y1, x0:x1]
    f = feather(c.shape[0], c.shape[1], *fe, ellipse=ellipse)
    kl = (1.0 - kill[y0:y1, x0:x1])
    col = to_rgba(c, f, kl)
    # ink: alpha is the line density, colour is indigo
    ia = ink_a[y0:y1, x0:x1] * f * kl
    k = np.dstack([np.broadcast_to(INDIGO, c.shape), ia * 255.0])
    save_rgba(f"{name}.webp", col, scale)
    save_rgba(f"{name}-ink.webp", k, scale)

# ---- 4. hero (wide) and hero (mobile) -------------------------------------------------
crop_pair("hero", 600, 0, 1484, 744, (270, 0, 0, 46))
crop_pair("hero-m", 690, 56, 1484, 744, (90, 0, 0, 40))

# ---- 5. five discipline vignettes -----------------------------------------------------
V = {
    "interiors":   (52, 770, 350, 972),
    "exhibitions": (340, 772, 665, 988),
    "events":      (645, 742, 955, 988),
    "brand":       (950, 772, 1240, 988),
    "kinetic":     (1222, 772, 1470, 988),
}
for k, (x0, y0, x1, y1) in V.items():
    crop_pair(f"v-{k}", x0, y0, x1, y1, (0, 0, 0, 0), scale=2, ellipse=True)

# ---- 6. material samples (no ink layer) -----------------------------------------------
T = {
    "granite":    (1392, 600, 1466, 668),
    "travertine": (938, 560, 1082, 610),
    "timber":     (470, 570, 590, 612),
    "wash":       (215, 548, 405, 596),
}
for k, (x0, y0, x1, y1) in T.items():
    c = img[y0:y1, x0:x1]
    save(f"t-{k}.webp", c, scale=3, q=82)

# ---- 7. paper grain tile ---------------------------------------------------------------
rng = np.random.default_rng(7)
n = rng.normal(0, 1, (256, 256)).astype(np.float32)
n = cv2.GaussianBlur(n, (0, 0), 0.7)
a = np.clip(np.abs(n) * 9, 0, 26).astype(np.uint8)
rgba = np.zeros((256, 256, 4), np.uint8)
rgba[..., 0:3] = np.where(n[..., None] > 0, 255, 47).astype(np.uint8)
rgba[..., 3] = a
Image.fromarray(rgba).save(os.path.join(OUT, "grain.png"), optimize=True)
