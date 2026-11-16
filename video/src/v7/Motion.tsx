import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconBell, IconCheck, IconFlask, IconSend, IconX } from "../reel/Icons";
import { LOW } from "./timeline";

// House look: white Inter, frosted dark glass, thin line art; one warm accent (money/heat).
const GOLD = "#FFC94D";
const RED = "#FF5A5F";
const GREEN = "#3EE6A8";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.66), rgba(14,18,28,0.44))",
  backdropFilter: "blur(16px) saturate(1.3)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const useIO = (dur: number, inF = 8, outF = 6) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { ...clamp, easing: EASE }),
    interpolate(f, [dur - outF, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }),
  );
};

const Low: React.FC<{ dur: number; children: React.ReactNode; top?: number }> = ({ dur, children, top = LOW }) => {
  const p = useIO(dur);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      {children}
    </div>
  );
};

/* ---------- hook: salary counter 0 -> 100 000 000+ ---------- */
export const HookCounter: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(f, [2, dur - 14], [0, 100_000_000], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop = spring({ frame: f, fps, config: { damping: 12, stiffness: 180 } });
  const plus = spring({ frame: f - (dur - 14), fps, config: { damping: 8, stiffness: 260 } });
  const out = interpolate(f, [dur - 4, dur], [1, 0], clamp);
  const num = Math.round(v).toLocaleString("en-US").replace(/,/g, " ");
  return (
    <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: out, transform: `scale(${0.8 + 0.2 * pop})` }}>
      <div style={{ ...glass, borderRadius: 30, padding: "10px 26px", fontFamily: INTER, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "rgba(255,255,255,0.85)" }}>OYLIK</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 14 }}>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 118, color: "white", letterSpacing: -3, fontVariantNumeric: "tabular-nums", textShadow: SHADOW }}>{num}</span>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 118, color: GOLD, transform: `scale(${plus})`, display: "inline-block", textShadow: SHADOW }}>+</span>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, color: GOLD, marginTop: 4, textShadow: SHADOW }}>{N("so‘m")}</div>
    </div>
  );
};

/* ---------- question card: fewer good chemists ---------- */
export const Question: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const line = interpolate(f, [6, 40], [0, 1], { ...clamp, easing: EASE });
  const pts = [
    [0, 20],
    [80, 34],
    [160, 30],
    [240, 62],
    [320, 78],
    [400, 120],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <Low dur={dur}>
      <div style={{ ...glass, width: 940, borderRadius: 40, padding: "28px 34px", display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ width: 120, height: 120, borderRadius: 34, border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <IconFlask size={74} color="white" stroke={1.7} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, lineHeight: 1.15, color: "white" }}>{N("Maktablarda yaxshi kimyogarlar nega kamaymoqda?")}</div>
          <svg width={420} height={130} viewBox="-10 0 430 140" style={{ marginTop: 10 }}>
            <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
            <path d="M380 104 L402 122 L376 128" fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={line > 0.95 ? 1 : 0} />
          </svg>
        </div>
      </div>
    </Low>
  );
};

/* ---------- reason numbers: outline draw -> fill ---------- */
export const NumberPop: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [0, 8], [0.82, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const outline = interpolate(f, [0, 6], [0, 1], { ...clamp, easing: EASE });
  const fill = interpolate(f, [3, 12], [0, 1], { ...clamp, easing: EASE });
  const lines = interpolate(f, [4, 13], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 5, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const numStyle: React.CSSProperties = { fontFamily: INTER, fontWeight: 900, fontSize: 340, lineHeight: 0.9, letterSpacing: -10 };
  return (
    <div style={{ position: "absolute", top: LOW - 20, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateX(${-out * 120}px)`, filter: `blur(${out * 10}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        <div style={{ width: 200 * lines, height: 3, background: "linear-gradient(90deg, transparent, white)" }} />
        <div style={{ position: "relative", transform: `scale(${pop})` }}>
          <div style={{ ...numStyle, color: "transparent", WebkitTextStroke: "4px white", opacity: outline, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.45))" }}>{n}</div>
          <div style={{ ...numStyle, position: "absolute", inset: 0, color: "white", clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>{n}</div>
        </div>
        <div style={{ width: 200 * lines, height: 3, background: "linear-gradient(90deg, white, transparent)" }} />
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 14, color: "white", marginTop: 10, opacity: fill, textShadow: SHADOW }}>SABAB</div>
    </div>
  );
};

/* ---------- 90 % donut ---------- */
export const Ninety: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, 34], [0, 0.9], { ...clamp, easing: EASE });
  const R = 130;
  const C = 2 * Math.PI * R;
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", width: 2 * R + 40, height: 2 * R + 40 }}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="rgba(14,18,28,0.55)" stroke="rgba(255,255,255,0.2)" strokeWidth={28} />
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="white" strokeWidth={28} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: 84, color: "white" }}>{Math.round(p * 100)}%</div>
        </div>
        <div style={{ fontFamily: INTER, color: "white", textShadow: SHADOW, maxWidth: 480 }}>
          <div style={{ fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.85)" }}>{N("bolalarning")}</div>
          <div style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.1 }}>{N("kimyoni doktorlik uchun o‘qiydi")}</div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- salary must rise ---------- */
export const Salary: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = [0.35, 0.55, 0.78, 1];
  const second = interpolate(f, [34, 46], [0, 1], { ...clamp, easing: EASE });
  return (
    <Low dur={dur}>
      <div style={{ ...glass, width: 920, borderRadius: 40, padding: "30px 36px", display: "flex", alignItems: "flex-end", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 200 }}>
          {bars.map((h, i) => {
            const s = spring({ frame: f - i * 5, fps, config: { damping: 14, stiffness: 140 } });
            return <div key={i} style={{ width: 46, height: 200 * h * s, borderRadius: 12, background: i === bars.length - 1 ? GOLD : "rgba(255,255,255,0.85)" }} />;
          })}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: "white" }}>{N("Oylikni oshirish kerak")}</div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 36, color: GOLD, marginTop: 12, opacity: second, transform: `translateY(${(1 - second) * 12}px)` }}>{N("kimyogarlarga yaxshiroq imkoniyat")}</div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- dreams: artist / chess / chemist ---------- */
const Chip: React.FC<{ text: string; ok: boolean; delay: number }> = ({ text, ok, delay }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 180 } });
  return (
    <div style={{ ...glass, ...(ok ? { background: "white" } : {}), borderRadius: 999, padding: "16px 30px", display: "flex", alignItems: "center", gap: 12, opacity: Math.min(1, s * 1.5), transform: `scale(${0.7 + 0.3 * s})` }}>
      {ok ? <IconCheck size={40} color="#111" stroke={3} /> : <IconX size={34} color="rgba(255,255,255,0.7)" stroke={3} />}
      <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: ok ? "#111" : "rgba(255,255,255,0.75)", textDecoration: ok ? "none" : "line-through" }}>{N(text)}</span>
    </div>
  );
};

export const Dreams: React.FC<{ dur: number; chessAt: number; okAt: number }> = ({ dur, chessAt, okAt }) => (
  <Low dur={dur}>
    <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38, color: "rgba(255,255,255,0.85)", marginBottom: 20, textShadow: SHADOW }}>{N("Bolalar ham desin:")}</div>
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 960 }}>
      <Chip text="Artist bo‘laman" ok={false} delay={0} />
      <Chip text="Shaxmatchi bo‘laman" ok={false} delay={chessAt} />
      <Chip text="Kimyogar bo‘laman!" ok delay={okAt} />
    </div>
  </Low>
);

/* ---------- share + subscribe ---------- */
export const Subscribe: React.FC<{ dur: number; clickAt: number }> = ({ dur, clickAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: EASE });
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [16, clickAt - 2], [220, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  const share = spring({ frame: f - 4, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top: LOW + 20, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: inn, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ ...glass, borderRadius: 999, padding: "16px 30px", display: "flex", alignItems: "center", gap: 14, transform: `scale(${share})` }}>
        <IconSend size={40} color="white" stroke={2.2} />
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38, color: "white" }}>{N("Tanishlaringizga jo‘nating")}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? "rgba(255,255,255,0.16)" : "white", border: "2px solid white", backdropFilter: "blur(10px)", color: clicked ? "white" : "#111", borderRadius: 999, padding: "26px 60px", fontFamily: INTER, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}>
          {clicked ? <IconCheck size={46} color="white" stroke={3.2} /> : <IconBell size={46} color="#111" stroke={2.4} />}
          {clicked ? N("Obuna bo‘ldingiz") : N("Obuna bo‘ling")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 22, marginTop: -44, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} /> : null}
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 70 + cur, marginTop: 10, opacity: f < clickAt + 20 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export { GREEN };
