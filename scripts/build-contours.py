"""Generates the topographic contour landscape (public/shapes/contours.svg): layered noise, thresholded at many levels, traced to line paths."""
import numpy as np, cv2
rng=np.random.default_rng(5)
W,H=1800,420
def field():
    f=np.zeros((H,W),np.float32)
    for sc,amp in [(260,1.0),(120,0.5),(55,0.22)]:
        g=rng.normal(0,1,(H//sc+3,W//sc+3)).astype(np.float32)
        f+=amp*cv2.resize(g,(W,H),interpolation=cv2.INTER_CUBIC)
    yy=np.linspace(0,1,H)[:,None]
    f+= (yy-0.5)*3.4   # rises toward the bottom, like dunes
    return cv2.GaussianBlur(f,(0,0),3)
f=field(); lo,hi=np.percentile(f,3),np.percentile(f,97)
paths=[]
for lv in np.linspace(lo,hi,34):
    m=(f>lv).astype(np.uint8)*255
    cs,_=cv2.findContours(m,cv2.RETR_LIST,cv2.CHAIN_APPROX_NONE)
    for c in cs:
        if len(c)<60: continue
        a=cv2.approxPolyDP(c,1.6,False)[:,0,:]
        paths.append("M"+" L".join(f"{x} {y}" for x,y in a))
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="none" fill="none" stroke="#9a96aa" stroke-width="1" stroke-linejoin="round" stroke-opacity=".32"><path d="{" ".join(paths)}"/></svg>'
open("public/shapes/contours.svg","w").write(svg); print(len(svg)//1024,"KB",len(paths))
