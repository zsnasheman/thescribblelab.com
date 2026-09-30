import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "The Scribble Lab: every space starts as a scribble";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const lockup = await readFile(join(process.cwd(), "public/brand/lockup-white.png"));
  const src = `data:image/png;base64,${lockup.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", background: "#2F2058", color: "#fff",
          display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72,
        }}
      >
        <img src={src} width={360} height={109} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 300 }}>Every space starts as a scribble.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#d5d2de" }}>
            Design and build studio · Dubai
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#6B5291" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#6B5291" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#6B5291" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#6B5291" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#1E9E74" }} />
        </div>
      </div>
    ),
    size,
  );
}
