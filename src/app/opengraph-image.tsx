import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "The Scribble Lab: every space starts as a scribble";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const lockup = await readFile(join(process.cwd(), "public/brand/logo-primary.png"));
  const src = `data:image/png;base64,${lockup.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#F6F3FA", color: "#2F2058", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, fontWeight: 300 }}>Every space starts as a scribble.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#594d79" }}>Design and build studio · Dubai</div>
        </div>
        <img src={src} width={430} height={280} alt="" />
      </div>
    ),
    size,
  );
}
