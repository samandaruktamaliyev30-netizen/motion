import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEBAS, CREAM, GOLD2, N } from "./ui";

// YouTube thumbnail for the SmmStart video (1920×1080 → exported 1280×720).
// Calm layout: one question on top, the two prizes side by side below.
const F = (p: string) => staticFile(`v12/${p}`);
const mask = "radial-gradient(ellipse 50% 50% at 50% 50%, black 72%, transparent 100%)";
const head = (size: number, color: string): React.CSSProperties => ({
  fontFamily: BEBAS, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, whiteSpace: "nowrap", textAlign: "center",
  fontVariantNumeric: "lining-nums", textShadow: "0 6px 24px rgba(0,0,0,0.55)",
});

export const SmmThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 45% at 50% 100%, #2a1b0f 0%, #0b0806 70%, #050404 100%)", overflow: "hidden" }}>
    {/* soft floor glow under the prizes */}
    <div style={{ position: "absolute", left: 360, top: 820, width: 1200, height: 220, borderRadius: "50%", background: `radial-gradient(closest-side, ${GOLD2}2e, transparent 80%)` }} />

    {/* question */}
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={head(112, CREAM)}>17 Pro Max va MacBook Neo’ni</div>
      <div style={{ ...head(124, "#FFD978"), marginTop: 8 }}>{N("qanday yutib olish mumkin?")}</div>
    </div>

    {/* prizes */}
    <Img src={F("iphone_single.png")} style={{ position: "absolute", left: 330, top: 300, height: 800, maskImage: mask, WebkitMaskImage: mask }} />
    <div style={{ position: "absolute", left: 900, top: 420, width: 640, height: 560, overflow: "hidden", maskImage: mask, WebkitMaskImage: mask }}>
      <Img src={F("macbook.jpg")} style={{ position: "absolute", left: 0, top: -230, width: 640 }} />
    </div>
  </AbsoluteFill>
);
