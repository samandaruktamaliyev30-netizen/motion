import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEBAS, CREAM, GOLD, GOLD2, INTER, N, NAVY } from "./ui";

// YouTube thumbnail for the SmmStart video (1920×1080 → exported 1280×720).
// Devices + headline only (no speaker), same look as the edit.
const F = (p: string) => staticFile(`v12/${p}`);
const head = (size: number, color: string = CREAM): React.CSSProperties => ({
  fontFamily: BEBAS, fontWeight: 900, fontSize: size, lineHeight: 0.98, color, whiteSpace: "nowrap",
  fontVariantNumeric: "lining-nums", textShadow: "0 6px 24px rgba(0,0,0,0.6)",
});
const Sticker: React.FC<{ text: string; sub: string; x: number; y: number; gold?: boolean; rot?: number }> = ({ text, sub, x, y, gold = true, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 210, height: 210, borderRadius: "50%", transform: `rotate(${rot}deg)`,
    background: gold ? `radial-gradient(circle at 35% 30%, #fff3cf, ${GOLD} 45%, ${GOLD2})` : "radial-gradient(circle at 35% 30%, #ffffff, #e6dccb 45%, #a99d8a)",
    boxShadow: `0 0 0 6px ${NAVY}, 0 0 0 10px ${gold ? GOLD : "#e6dccb"}, 0 20px 40px rgba(0,0,0,0.55)`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: NAVY }}>
    <div style={{ fontFamily: BEBAS, fontWeight: 900, fontSize: 84, lineHeight: 0.9, fontVariantNumeric: "lining-nums" }}>{text}</div>
    <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 30, letterSpacing: 4 }}>{N(sub)}</div>
  </div>
);

export const SmmThumb: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 50%, #4a321c 0%, #22160e 40%, ${NAVY} 78%)`, overflow: "hidden" }}>
    {/* light rays + glow behind the prizes */}
    <div style={{ position: "absolute", left: 1400 - 1200, top: 540 - 1200, width: 2400, height: 2400, opacity: 0.2, background: `repeating-conic-gradient(from 0deg, ${GOLD} 0deg 5deg, transparent 5deg 18deg)`, maskImage: "radial-gradient(circle, black 0%, transparent 60%)", WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)" }} />
    <div style={{ position: "absolute", left: 950, top: 90, width: 950, height: 950, borderRadius: "50%", background: `radial-gradient(closest-side, ${GOLD2}55, transparent 75%)` }} />

    {/* prizes (black photo backgrounds dropped with "lighten") */}
    <div style={{ position: "absolute", left: 1450, top: 380, width: 460, height: 560, overflow: "hidden", maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 60%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 60%, transparent 100%)" }}>
      <Img src={F("macbook.jpg")} style={{ position: "absolute", left: 15, top: -140, width: 430 }} />
    </div>
    <Img src={F("iphone.jpg")} style={{ position: "absolute", left: 930, top: 140, height: 800, transform: "rotate(-4deg)", maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 60%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 60%, transparent 100%)" }} />
    <Sticker text="1" sub="O‘RIN" x={930} y={700} rot={-10} />
    <Sticker text="2" sub="O‘RIN" x={1690} y={330} gold={false} rot={8} />

    {/* headline */}
    <div style={{ position: "absolute", left: 80, top: 80 }}>
      <div style={{ display: "inline-block", padding: "12px 28px", borderRadius: 14, background: `linear-gradient(180deg, ${GOLD}, ${GOLD2})`, color: NAVY, fontFamily: INTER, fontWeight: 900, fontSize: 40, letterSpacing: 6 }}>{N("SMM START KURSI")}</div>
      <div style={{ ...head(150), marginTop: 40 }}>17 PRO MAX</div>
      <div style={{ ...head(104), marginTop: 10 }}><span style={{ color: GOLD }}>va</span> MACBOOK NEO</div>
      <div style={{ ...head(178, "#FFD978"), marginTop: 30, textShadow: "0 0 36px rgba(242,205,126,0.5), 0 8px 24px rgba(0,0,0,0.7)" }}>{N("YUTIB")}</div>
      <div style={{ ...head(178, "#FFD978"), marginTop: -6, textShadow: "0 0 36px rgba(242,205,126,0.5), 0 8px 24px rgba(0,0,0,0.7)" }}>{N("OLING!")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
        <div style={{ width: 70, height: 6, borderRadius: 3, background: GOLD }} />
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: CREAM, letterSpacing: 1 }}>{N("Qanday? — videoda")}</div>
      </div>
    </div>
    {/* thin gold frame */}
    <AbsoluteFill style={{ border: `6px solid ${GOLD2}`, opacity: 0.55 }} />
  </AbsoluteFill>
);
