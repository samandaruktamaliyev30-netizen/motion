import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEBAS, CREAM, GOLD, GOLD2, INTER, N, NAVY } from "./ui";

// YouTube thumbnail for the SmmStart video (1920×1080 → exported 1280×720).
// Same look as the edit: espresso background, gold glow, Playfair + Montserrat.
const F = (p: string) => staticFile(`v12/${p}`);
const head = (size: number, color: string = CREAM): React.CSSProperties => ({
  fontFamily: BEBAS, fontWeight: 900, fontSize: size, lineHeight: 0.98, color, whiteSpace: "nowrap",
  fontVariantNumeric: "lining-nums", textShadow: "0 6px 24px rgba(0,0,0,0.6)",
});

export const SmmThumb: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 62% 45%, #4a321c 0%, #22160e 38%, ${NAVY} 75%)`, overflow: "hidden" }}>
    {/* light rays */}
    <div style={{ position: "absolute", left: 1350 - 1100, top: 520 - 1100, width: 2200, height: 2200, opacity: 0.16, background: `repeating-conic-gradient(from 0deg, ${GOLD} 0deg 5deg, transparent 5deg 18deg)`, maskImage: "radial-gradient(circle, black 0%, transparent 60%)", WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)" }} />
    {/* gold glow behind the speaker */}
    <div style={{ position: "absolute", left: 1000, top: 80, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(closest-side, ${GOLD2}66, transparent 75%)` }} />

    {/* speaker (cut out), right side */}
    <Img src={F("speaker_cut.png")} style={{ position: "absolute", right: -60, bottom: -40, height: 1080, filter: `drop-shadow(0 0 2px ${GOLD}) drop-shadow(0 0 40px ${GOLD2}88) drop-shadow(0 30px 60px rgba(0,0,0,0.6))` }} />

    {/* devices, bottom-left (black photo backgrounds dropped with "lighten") */}
    <Img src={F("iphone.jpg")} style={{ position: "absolute", left: 40, top: 560, height: 560, mixBlendMode: "lighten", transform: "rotate(-6deg)" }} />
    <div style={{ position: "absolute", left: 470, top: 600, width: 560, height: 520, overflow: "hidden", mixBlendMode: "lighten" }}>
      <Img src={F("macbook.jpg")} style={{ position: "absolute", left: 0, top: -230, width: 560 }} />
    </div>

    {/* headline */}
    <div style={{ position: "absolute", left: 70, top: 60 }}>
      <div style={{ display: "inline-block", padding: "10px 26px", borderRadius: 14, background: `linear-gradient(180deg, ${GOLD}, ${GOLD2})`, color: NAVY, fontFamily: INTER, fontWeight: 900, fontSize: 40, letterSpacing: 6 }}>SMM START</div>
      <div style={{ ...head(132), marginTop: 26 }}>17 PRO MAX</div>
      <div style={{ ...head(112), marginTop: 6 }}><span style={{ color: GOLD }}>+</span> MACBOOK NEO</div>
      <div style={{ ...head(144, "#FFD978"), marginTop: 18, textShadow: "0 0 30px rgba(242,205,126,0.45), 0 6px 20px rgba(0,0,0,0.7)" }}>{N("YUTIB OLING!")}</div>
    </div>
    {/* thin gold frame */}
    <AbsoluteFill style={{ border: `6px solid ${GOLD2}`, opacity: 0.55 }} />
  </AbsoluteFill>
);
