import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { at, LOW } from "./timeline";
import { BEBAS, GOLD, GOLD2 } from "./Scene";

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const GOLD_TEXT: React.CSSProperties = {
  background: `linear-gradient(180deg, #FFF1C9 0%, ${GOLD} 45%, ${GOLD2} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
const glassPane: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))",
  backdropFilter: "blur(18px) saturate(1.4)",
  border: "1.5px solid rgba(255,255,255,0.38)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 24px 60px rgba(0,0,0,0.35)",
};

const useIO = (dur: number, inF = 8, outF = 6) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { ...clamp, easing: EASE }),
    interpolate(f, [dur - outF, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }),
  );
};
const useS = (delay: number, damping = 12, stiffness = 200) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};

/* ---------- HOOK: editorial kinetic type — "O‘ZINGIZ QILSANGIZ / ARZONMI?" ---------- */
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur, 6, 6);
  const top = useS(0, 14, 180);
  const big = useS(at(1.44), 10, 220);
  const line = interpolate(f, [at(1.6), at(2.3)], [0, 1], { ...clamp, easing: EASE });
  const q = useS(at(2.1), 7, 240);
  const look = useS(at(2.74), 12, 200);
  return (
    <div style={{ position: "absolute", top: LOW - 30, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: "white", textShadow: SHADOW, opacity: top, transform: `translateY(${(1 - top) * 20}px)` }}>{N("REMONTNI O‘ZINGIZ QILSANGIZ")}</div>
      <div style={{ display: "flex", alignItems: "flex-end", marginTop: 6 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 210, lineHeight: 0.9, letterSpacing: 4, ...GOLD_TEXT, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))", clipPath: `inset(0 ${(1 - big) * 100}% 0 0)` }}>ARZONMI</span>
        <span style={{ fontFamily: BEBAS, fontSize: 210, lineHeight: 0.9, color: "white", display: "inline-block", transform: `scale(${q}) rotate(${(1 - q) * 30}deg)`, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))" }}>?</span>
      </div>
      <div style={{ width: 640 * line, height: 5, borderRadius: 3, background: GOLD, marginTop: 4 }} />
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, opacity: look, transform: `translateY(${(1 - look) * 20}px)` }}>
        <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, color: "white", textShadow: SHADOW }}>{N("Keling, ko‘rib chiqamiz")}</span>
      </div>
    </div>
  );
};

/* ---------- "A.D.C" in a transparent glass frame, gold letters ---------- */
export const Adc: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur, 1, 8);
  const frame = useS(0, 14, 160);
  const letters = ["A", ".", "D", ".", "C"];
  const shine = interpolate(f, [20, 44], [-30, 130], clamp);
  const sub = interpolate(f, [22, 32], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ position: "absolute", top: LOW - 40, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
      <div style={{ ...glassPane, position: "relative", overflow: "hidden", borderRadius: 34, padding: "18px 64px 10px", transform: `scale(${0.85 + 0.15 * frame})`, clipPath: `inset(0 ${(1 - frame) * 50}% 0 ${(1 - frame) * 50}% round 34px)` }}>
        {/* corner ticks */}
        {[
          { left: 14, top: 14, b: "borderLeft", c: "borderTop" },
          { right: 14, top: 14, b: "borderRight", c: "borderTop" },
          { left: 14, bottom: 14, b: "borderLeft", c: "borderBottom" },
          { right: 14, bottom: 14, b: "borderRight", c: "borderBottom" },
        ].map(({ b, c, ...pos }, i) => (
          <div key={i} style={{ position: "absolute", width: 26, height: 26, ...pos, [b]: `3px solid ${GOLD}`, [c]: `3px solid ${GOLD}` }} />
        ))}
        <div style={{ display: "flex", alignItems: "baseline", position: "relative" }}>
          {letters.map((ch, i) => {
            const s = spring({ frame: f - 6 - i * 3, fps: 30, config: { damping: 10, stiffness: 220 } });
            const dot = ch === ".";
            return (
              <span key={i} style={{ fontFamily: BEBAS, fontSize: dot ? 170 : 210, lineHeight: 1, letterSpacing: 6, ...GOLD_TEXT, display: "inline-block", opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 60}px) scale(${dot ? s : 1})`, filter: `blur(${(1 - Math.min(1, s)) * 8}px) drop-shadow(0 4px 12px rgba(0,0,0,0.35))` }}>
                {ch}
              </span>
            );
          })}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-20deg)", mixBlendMode: "overlay" }} />
        </div>
      </div>
      <div style={{ marginTop: 16, fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 14, color: "white", textShadow: SHADOW, opacity: sub, transform: `translateY(${(1 - sub) * 14}px)` }}>{N("JAMOASI")}</div>
    </div>
  );
};

/* ---------- contract: gold line-art sheet + signature drawing ---------- */
export const Contract: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur);
  const sheet = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: EASE });
  const sig = interpolate(f, [at(30.06) - at(28.62), at(30.06) - at(28.62) + 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lock = useS(10, 9, 240);
  const row = (t: string, d: number) => {
    const s = interpolate(f, [d, d + 10], [0, 1], { ...clamp, easing: EASE });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: s, transform: `translateX(${(1 - s) * 30}px)` }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: GOLD }} />
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 42, color: "white" }}>{N(t)}</span>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", top: LOW - 10, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ ...glassPane, background: "linear-gradient(135deg, rgba(14,18,28,0.62), rgba(14,18,28,0.4))", width: 900, borderRadius: 34, padding: "26px 36px", display: "flex", gap: 30, alignItems: "center" }}>
        <svg width={170} height={220} viewBox="0 0 170 220">
          <path d="M20 10 H120 L150 40 V210 H20 Z M120 10 V40 H150" fill="none" stroke={GOLD} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sheet} />
          {[60, 85, 110, 135].map((y, i) => (
            <path key={y} d={`M42 ${y} H${i % 2 ? 110 : 128}`} stroke="rgba(255,255,255,0.5)" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(f, [8 + i * 3, 18 + i * 3], [0, 1], clamp)} />
          ))}
          <path d="M40 182 C55 150 62 196 76 172 S98 160 104 182 S126 170 136 176" fill="none" stroke="white" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sig} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 84, lineHeight: 0.9, letterSpacing: 2, ...GOLD_TEXT, transform: `scale(${0.8 + 0.2 * lock})`, transformOrigin: "left center" }}>{N("SHARTNOMADA")}</div>
          {row("Smeta — o‘zgarmaydi", 12)}
          {row("Muddat — belgilangan", at(29.6) - at(28.62))}
        </div>
      </div>
    </div>
  );
};

/* ---------- editorial stats over the office B-roll ---------- */
export const Stats: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur);
  const fill7 = interpolate(f, [4, 18], [0, 1], { ...clamp, easing: EASE });
  const d2 = at(33.22) - at(31.94);
  const n = Math.round(interpolate(f, [d2, d2 + 28], [0, 400], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const s2 = useS(d2, 12, 200);
  const big: React.CSSProperties = { fontFamily: BEBAS, fontSize: 260, lineHeight: 0.82, letterSpacing: 2 };
  return (
    <div style={{ position: "absolute", top: LOW - 60, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: p }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative" }}>
          <div style={{ ...big, color: "transparent", WebkitTextStroke: `4px ${GOLD}` }}>7</div>
          <div style={{ ...big, position: "absolute", inset: 0, ...GOLD_TEXT, clipPath: `inset(${(1 - fill7) * 100}% 0 0 0)` }}>7</div>
        </div>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, letterSpacing: 8, color: "white", textShadow: SHADOW }}>{N("YIL")}</span>
      </div>
      <div style={{ width: 3, height: 260, background: "rgba(255,255,255,0.4)", marginBottom: 20, transform: `scaleY(${s2})` }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", opacity: s2 }}>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontFamily: BEBAS, fontSize: 120, color: "white", marginRight: 6, textShadow: SHADOW }}>~</span>
          <span style={{ ...big, color: "white", fontVariantNumeric: "tabular-nums", textShadow: SHADOW }}>{n}</span>
        </div>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, letterSpacing: 8, color: "white", textShadow: SHADOW }}>{N("LOYIHA")}</span>
      </div>
    </div>
  );
};

/* ---------- gift: visual part for free (over the VR B-roll) ---------- */
export const Gift: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur);
  const lid = useS(8, 8, 200);
  const word = useS(14, 10, 220);
  const sparks = Array.from({ length: 8 }, (_, i) => {
    const t = Math.max(0, f - 10);
    const a = (i / 8) * Math.PI * 2;
    const d = interpolate(t, [0, 18], [0, 120], { ...clamp, easing: Easing.out(Easing.cubic) });
    const o = interpolate(t, [0, 4, 16, 24], [0, 1, 1, 0], clamp);
    return <div key={i} style={{ position: "absolute", left: 90 + Math.cos(a) * d - 6, top: 40 + Math.sin(a) * d - 6, width: 12, height: 12, borderRadius: 6, background: GOLD, opacity: o }} />;
  });
  return (
    <div style={{ position: "absolute", top: LOW - 20, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 34, opacity: p }}>
      <div style={{ position: "relative", width: 180, height: 180 }}>
        {sparks}
        <svg width={180} height={180} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.5))" }}>
          <rect x="4" y="11" width="16" height="10" rx="1.2" fill="rgba(14,18,28,0.6)" />
          <path d="M12 11v10" />
          <g transform={`translate(0 ${-lid * 3}) rotate(${-lid * 14} 4 10)`}>
            <rect x="3" y="7.5" width="18" height="3.5" rx="1" fill="rgba(14,18,28,0.6)" />
            <path d="M12 7.5c-2-3.6-5.6-3.4-5.6-1.4S10 7.5 12 7.5zM12 7.5c2-3.6 5.6-3.4 5.6-1.4S14 7.5 12 7.5z" />
          </g>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, color: "white", textShadow: SHADOW }}>{N("Vizual qism")}</span>
        <span style={{ fontFamily: BEBAS, fontSize: 170, lineHeight: 0.9, letterSpacing: 4, ...GOLD_TEXT, display: "inline-block", transform: `scale(${0.7 + 0.3 * word})`, transformOrigin: "left center", filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.5))" }}>{N("SOVG‘A")}</span>
      </div>
    </div>
  );
};

/* ---------- CTA: a form that fills itself ---------- */
const Field: React.FC<{ label: string; value: string; start: number }> = ({ label, value, start }) => {
  const f = useCurrentFrame();
  const chars = Math.floor(interpolate(f, [start, start + value.length * 1.3], [0, value.length], clamp));
  const caret = f >= start && chars < value.length && Math.floor(f / 4) % 2 === 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>{N(label)}</span>
      <div style={{ height: 70, borderRadius: 16, border: `2px solid ${f >= start && chars < value.length ? GOLD : "rgba(255,255,255,0.25)"}`, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 22px" }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: "white" }}>{N(value.slice(0, chars))}</span>
        {caret ? <span style={{ width: 3, height: 38, background: GOLD, marginLeft: 3 }} /> : null}
      </div>
    </div>
  );
};

export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur);
  const send = at(45.9) - at(43.16);
  const pressed = f >= send;
  const press = interpolate(f, [send - 2, send + 1, send + 7], [1, 0.93, 1], clamp);
  const c1 = useS(at(44.52) - at(43.16) + 30, 12, 200);
  const c2 = useS(at(46.26) - at(43.16) + 8, 12, 200);
  const chip = (s: number, t: string) => (
    <div style={{ ...glassPane, background: "rgba(14,18,28,0.55)", borderRadius: 999, padding: "12px 26px", opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: GOLD }}>✓ </span>
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: "white" }}>{N(t)}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: LOW - 30, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ ...glassPane, background: "linear-gradient(135deg, rgba(14,18,28,0.7), rgba(14,18,28,0.5))", width: 780, borderRadius: 34, padding: "26px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 64, letterSpacing: 3, ...GOLD_TEXT }}>{N("ARIZA FORMASI")}</span>
        <Field label="Hudud" value="Toshkent" start={4} />
        <Field label="Telefon" value="+998 __ ___ __ __" start={22} />
        <div style={{ marginTop: 6, height: 76, borderRadius: 18, background: pressed ? "#3EE6A8" : `linear-gradient(180deg, ${GOLD}, ${GOLD2})`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${press})` }}>
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "#14110a" }}>{pressed ? N("✓ Yuborildi") : N("Yuborish")}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {chip(c1, "Bepul o‘lchov")}
        {chip(c2, "Taxminiy smeta")}
      </div>
    </div>
  );
};
