"""
Builds the portfolio data and optimised images from the studio's company profile PDF (TSL Company Profile & Portfolio).
Usage: python3 scripts/build-portfolio.py /path/to/profile.pdf
Writes public/work/<slug>/NN.webp (+ -sm.webp) and src/content/portfolio.generated.ts.
Facts (names, labels, places, years) come only from the PDF text. Labels such as "Concept design" are kept exactly as printed.
"""
import sys, os, re, json
import pymupdf
from PIL import Image

PDF = sys.argv[1]
ROOT = os.path.join(os.path.dirname(__file__), "..")
d = pymupdf.open(PDF)

def page_text(n):
    t = d[n - 1].get_text()
    t = re.sub(r"-\s*\n\s*", "", t)         # hyphenated line breaks
    t = re.sub(r"\s*\n\s*", " ", t)
    t = re.sub(r"\s{2,}", " ", t).strip()
    return t

# (slug, title, client, category, service, label, where, year, text page, [image page:index ...], alt)
P = [
 ("ahmed-al-maghribi-launch", "Ahmed Al Maghribi brand launch", "Ahmed Al Maghribi", "events", "events", "Concept, design, build, hamper curation and event management", "Armani Hotel terrace, Burj Khalifa, Dubai", 2025, 7, ["06_1","06_2","06_4","07_0","07_2","06_3","07_3"], "Perfume launch event"),
 ("laduree-ramadan-tent", "Ladurée Ramadan tent", "Ladurée", "events", "events", "Design & build", "Al Bateen Marina", 2025, 9, ["09_0","09_1","08_0"], "Ramadan tent"),
 ("al-haramain-beauty-world", "Al Haramain exhibition stand", "Al Haramain", "exhibitions", "exhibitions", "Concept design", "Beauty World Middle East", 2025, 11, ["11_0","11_1","10_3"], "Exhibition stand"),
 ("laduree-expex", "Ladurée exhibition stand", "Ladurée", "exhibitions", "exhibitions", "Concept design", "EXPEX", 2025, 12, ["12_1","12_0","10_0","10_1","10_2"], "Exhibition stand"),
 ("aj-steel-pipes-adipec", "AJ Steel Pipes exhibition stand", "AJ Steel Pipes", "exhibitions", "exhibitions", "Concept design", "ADIPEC, Abu Dhabi", 2025, 13, ["13_1","13_0"], "Exhibition stand"),
 ("stanley-automechanika", "Stanley exhibition stand", "Stanley", "exhibitions", "exhibitions", "Concept design", "Automechanika Dubai", 2025, 14, ["14_0","14_1"], "Exhibition stand"),
 ("fifa-arab-cup-qatar", "FIFA Arab Cup Qatar", "FIFA Arab Cup Qatar 2025", "brand-activations", "brand-activations", "Concept, design & build", "Qatar, multi-location rollout", 2025, 17, ["17_0","16_2","16_3","05_3","17_1","16_1"], "Brand activation"),
 ("ariel-platinum-gel", "Ariel Platinum Gel", "Ariel", "brand-activations", "brand-activations", "Concept design", "", None, 18, ["18_0","18_1"], "Gamified brand activation"),
 ("huda-beauty-bowling", "Huda Beauty bowling alley", "Huda Beauty", "brand-activations", "brand-activations", "Concept design", "", None, 19, ["19_0","19_1"], "Brand activation"),
 ("chopard-kinetic-windows", "Chopard kinetic window displays", "Chopard", "kinetic-windows", "kinetic-windows", "Concept design", "", None, 20, ["20_0","20_1","20_2"], "Kinetic window display"),
 ("laduree-snow-globe", "Ladurée Christmas snow globe", "Ladurée", "brand-activations", "brand-activations", "Concept design", "Dubai Hills Mall", 2025, 21, ["21_0","15_0"], "Christmas brand activation"),
 ("the-juice-beauty", "The Juice Beauty", "The Juice Beauty", "retail", "interiors", "Concept design", "Dubai, mall retail environment", None, 24, ["23_1","24_0","24_1","22_0"], "Retail concept"),
 ("laduree-dubai-hills", "Ladurée store renovation", "Ladurée", "retail", "interiors", "Design & build", "Dubai Hills Mall", None, 26, ["25_1","26_0","26_1"], "Store renovation"),
 ("huda-beauty-kiosk", "Huda Beauty retail kiosk", "Huda Beauty", "retail", "interiors", "Concept design", "Dubai", None, 27, ["27_0","27_1"], "Retail kiosk"),
 ("ariel-kiosk", "Ariel retail kiosk", "Ariel", "retail", "interiors", "Concept design", "Dubai", None, 28, ["28_0","28_1"], "Retail kiosk"),
 ("roche-riyadh", "Roche office", "Roche", "commercial", "interiors", "Design consultancy", "Riyadh, KSA", 2020, 31, ["31_0","31_1","30_3","30_2"], "Workplace interior"),
 ("al-hilal-bank-youth-centre", "Al Hilal Bank youth banking experience centre", "Al Hilal Bank", "commercial", "interiors", "Concept design", "Dubai Mall", 2021, 33, ["32_1","33_0","33_1","29_2"], "Experience centre concept"),
 ("transmed-dubai-hills", "Transmed office", "Transmed", "commercial", "interiors", "Design consultancy", "Dubai Hills", 2021, 35, ["34_0","34_1","35_0","35_1"], "Office interior"),
 ("golf-estate-villa", "Golf Estate villa", "", "residential", "interiors", "", "Dubai", None, 38, ["38_0","36_1","37_2","36_3"], "Villa interior"),
 ("dt1-downtown", "DT1 residences", "", "residential", "interiors", "Design consultancy", "Dubai Downtown", 2020, 40, ["39_1","39_2","40_0","40_1"], "Residence interior"),
 ("downtown-design-fair-cafe", "Downtown Design entrance way and fair café", "Downtown Design", "food-and-beverage", "interiors", "Design consultancy", "Dubai", 2019, 43, ["42_1","42_2","43_0","43_1","41_2"], "Fair café"),
 ("hitchki-mirdif", "Hitchki", "Hitchki", "food-and-beverage", "interiors", "Built", "Mirdif City Centre, Dubai", 2019, 45, ["45_1","45_0","44_2","41_3"], "Restaurant interior"),
 ("wandr-jlt", "Wandr", "Eatopia Global", "food-and-beverage", "interiors", "Design consultancy", "JLT, Dubai", 2024, 47, ["47_0","46_3","47_1","46_2","46_0"], "Wholesome eatery"),
]

def clean(t):
    return t

def save(img, path, maxw):
    im = Image.open(img).convert("RGB")
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)
    return im.size

SRC = os.environ.get("PDFIMG", "/tmp/claude-0/pdfimg")
out = []
for slug, title, client, cat, svc, label, where, year, tp, imgs, alt in P:
    folder = os.path.join(ROOT, "public", "work", slug)
    os.makedirs(folder, exist_ok=True)
    text = page_text(tp)
    # strip the heading line printed on the page: keep from the first sentence-like chunk
    items = []
    for n, key in enumerate(imgs):
        f = os.path.join(SRC, f"p{key.split('_')[0]}_{key.split('_')[1]}.png")
        w, h = save(f, os.path.join(folder, f"{n+1:02d}.webp"), 1800)
        save(f, os.path.join(folder, f"{n+1:02d}-sm.webp"), 820)
        items.append({"src": f"/work/{slug}/{n+1:02d}.webp", "thumb": f"/work/{slug}/{n+1:02d}-sm.webp", "w": w, "h": h})
    out.append(dict(slug=slug, title=title, client=client, category=cat, service=svc, label=label, where=where, year=year, pdfText=text, images=items, alt=alt))
open("/tmp/claude-0/portfolio.json", "w").write(json.dumps(out, indent=1))
print(len(out), "projects")
