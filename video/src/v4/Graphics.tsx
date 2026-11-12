import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Card, Check, Cross, INTER, prog, Underline, usePresence } from "./ui";

// All overlays live in the lower part of the frame (below the face), like the
// reference's slide cards. Times inside each component are local frames.
const Low: React.FC<{ dur: number; top?: number; children: React.ReactNode }> = ({ dur, top = 1210, children }) => {
  const p = usePresence(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top,
          opacity: p,
          transform: `translateY(${(1 - p) * 70}px) scale(${0.94 + 0.06 * p})`,
          transformOrigin: "50% 100%",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ n: string; text: string }> = ({ n, text }) => (
  <div style={{ fontSize: 26, fontWeight: 600, color: C.gray, letterSpacing: 2, textTransform: "uppercase" }}>
    {n} — {text}
  </div>
);

// 1) "Biz nimaga kafolat beramiz" — items tick as they are named.
const ITEMS: [string, number][] = [
  ["Kontent-plan", 0.62],
  ["Marketing strategiya", 1.12],
  ["CustDev", 2.02],
  ["Performance marketing", 3.0],
];
export const Checklist: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Low dur={dur}>
      <Card style={{ width: 860, padding: "40px 48px 44px" }}>
        <Eyebrow n="01" text="Biz qiladigan ishlar" />
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 10, letterSpacing: -1 }}>
          Barcha <span style={{ color: C.teal }}>sabablar</span>
        </div>
        <Underline p={prog(f, 8, 24)} width={250} style={{ marginLeft: 196, marginTop: -2 }} />
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          {ITEMS.map(([t, sec], i) => {
            const st = Math.round(sec * 30);
            const p = prog(f, st, st + 10);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.25 + 0.75 * p, transform: `translateX(${(1 - p) * 24}px)` }}>
                <Check size={44} p={p} />
                <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -0.4 }}>{t}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </Low>
  );
};

// 2) Big reference-style type: "Rizq Allohdan."
export const Rizq: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 16, stiffness: 150 } });
  const b = spring({ frame: f - 6, fps, config: { damping: 16, stiffness: 150 } });
  const out = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shadow = "0 6px 30px rgba(0,0,0,0.55)";
  return (
    <AbsoluteFill style={{ alignItems: "center", opacity: out }}>
      <div style={{ position: "absolute", top: 1330, fontFamily: INTER, color: C.white, textAlign: "center" }}>
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -6, lineHeight: 0.95, opacity: a, transform: `translateY(${(1 - a) * 40}px)`, textShadow: shadow }}>
          Rizq
        </div>
        <div style={{ fontSize: 76, fontStyle: "italic", fontWeight: 400, letterSpacing: -2, opacity: b, transform: `translateY(${(1 - b) * 30}px)`, textShadow: shadow }}>
          Allohdan.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3) "3–4x daromad" promise: bars grow, then a red strike — "we never promise this".
export const Chart: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bars = [0.22, 0.36, 0.58, 1];
  const strike = prog(f, 66, 80); // "men aytmayman" at +2.38 s
  return (
    <Low dur={dur}>
      <Card style={{ width: 760, padding: "36px 46px 34px", position: "relative" }}>
        <Eyebrow n="02" text="Soxta va’da" />
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 8 }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: C.teal, letterSpacing: -3 }}>3–4x</div>
          <div style={{ fontSize: 40, fontWeight: 600 }}>daromad</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 190, marginTop: 14 }}>
          {bars.map((h, i) => {
            const p = prog(f, 4 + i * 6, 20 + i * 6);
            return <div key={i} style={{ width: 120, height: 190 * h * p, borderRadius: 12, background: i === 3 ? C.teal : "#A8DDEE" }} />;
          })}
        </div>
        <svg width={760} height={420} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M60 360 L700 70" stroke={C.red} strokeWidth={10} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20, opacity: strike }}>
          <Cross size={40} p={strike} />
          <div style={{ fontSize: 36, fontWeight: 700, color: C.red }}>Bunday va’da bermayman</div>
        </div>
      </Card>
    </Low>
  );
};

// 4) A → B: the path from today's revenue to "3x" that nobody can guarantee.
export const AB: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pa = spring({ frame: f, fps, config: { damping: 14, stiffness: 180 } });
  const pb = spring({ frame: f - 18, fps, config: { damping: 14, stiffness: 180 } }); // "B nuqtaga" +0.62 s
  const line = prog(f, 4, 20);
  const money = prog(f, 72, 84); // "20–30 ming dollar" +2.4 s
  const Dot: React.FC<{ l: string; p: number; fill: string }> = ({ l, p, fill }) => (
    <div style={{ width: 120, height: 120, borderRadius: 60, background: fill, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 800, transform: `scale(${p})`, boxShadow: "0 10px 24px rgba(0,0,0,0.18)" }}>
      {l}
    </div>
  );
  return (
    <Low dur={dur}>
      <Card style={{ width: 820, padding: "36px 50px 40px" }}>
        <Eyebrow n="03" text="Loyiha yo‘li" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 26, position: "relative" }}>
          <Dot l="A" p={pa} fill={C.ink} />
          <svg width={420} height={40} style={{ overflow: "visible" }}>
            <line x1={10} y1={20} x2={10 + 400 * line} y2={20} stroke={C.teal} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
            <path d={`M${400 * line - 8} 6 L${400 * line + 10} 20 L${400 * line - 8} 34`} stroke={C.teal} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={line} />
          </svg>
          <Dot l="B" p={pb} fill={C.teal} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 32, fontWeight: 600, color: C.gray }}>
          <div style={{ opacity: money }}>
            hozir: <span style={{ color: C.ink, fontWeight: 800 }}>$20–30K</span>/oy
          </div>
          <div style={{ opacity: money }}>
            va’da: <span style={{ color: C.red, fontWeight: 800 }}>3x?</span>
          </div>
        </div>
      </Card>
    </Low>
  );
};

// 5) Wrap-up: what we guarantee vs what we don't.
export const Summary: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const r1 = prog(f, 36, 48); // "ketma-ketlik" +1.54 s
  const r2 = prog(f, 6, 18);
  return (
    <Low dur={dur}>
      <Card style={{ width: 860, padding: "38px 48px 42px" }}>
        <Eyebrow n="04" text="Kafolat" />
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 24, opacity: 0.3 + 0.7 * r2 }}>
          <Cross size={50} p={r2} />
          <div>
            <div style={{ fontSize: 42, fontWeight: 700, color: C.gray, textDecoration: r2 > 0.5 ? "line-through" : "none", textDecorationColor: C.red, textDecorationThickness: 4 }}>
              6 oyda X daromad
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, color: C.gray, marginTop: 2 }}>natija — rizq, Allohdan</div>
          </div>
        </div>
        <div style={{ height: 2, background: C.line, margin: "26px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: 0.3 + 0.7 * r1, transform: `translateX(${(1 - r1) * 20}px)` }}>
          <Check size={50} p={r1} />
          <div>
            <div style={{ fontSize: 42, fontWeight: 800 }}>
              Ishlarni <span style={{ color: C.teal }}>ketma-ket</span> bajarish
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, color: C.gray, marginTop: 2 }}>100% kafolat beramiz</div>
          </div>
        </div>
      </Card>
    </Low>
  );
};

// 6) Outro: share + subscribe button with a tap.
export const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 15, stiffness: 170 } });
  const b = spring({ frame: f - 52, fps, config: { damping: 13, stiffness: 190 } }); // "obuna" at +2.03 s
  const tap = interpolate(f, [70, 76, 84], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = f >= 76;
  const pill: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 18,
    fontFamily: INTER,
    borderRadius: 999,
    padding: "22px 40px",
    fontSize: 40,
    fontWeight: 700,
    boxShadow: "0 18px 44px rgba(0,0,0,0.3)",
  };
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1330, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ ...pill, background: "rgba(255,255,255,0.97)", color: C.ink, opacity: a, transform: `translateY(${(1 - a) * 50}px)` }}>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22l-4-9-9-4 20-7z" />
          </svg>
          Yaqinlaringizga yuboring
        </div>
        <div
          style={{
            ...pill,
            background: done ? "#2A2F38" : `linear-gradient(135deg, #3CC2E8, ${C.teal})`,
            color: "#fff",
            opacity: b,
            transform: `translateY(${(1 - b) * 50}px) scale(${tap})`,
            padding: "24px 56px",
            fontSize: 44,
          }}
        >
          {done ? "✓ Obuna bo‘lindi" : "Obuna bo‘ling"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
