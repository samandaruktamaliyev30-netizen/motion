import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { toNewAlphabet } from "../kiut2/alphabet";

/* ======================= look ======================= */
// Navy cards + warm gold accent (picks up the gold trim on the speaker's shirt).
// Palette & type taken from smmstart.netlify.app (course site): warm espresso darks, gold, cream, coral.
export const NAVY = "#130c08"; // --bg
export const NAVY2 = "#261a12"; // --card
export const BLUE = "#e46a4f"; // --coral (secondary accent)
export const GOLD = "#f2cd7e"; // --gold-hi
export const GOLD2 = "#d9a94f"; // --gold
export const CREAM = "#f6eddc"; // --cream
export const MUTED = "#c2ad93"; // --muted
export const ORANGE = "#F07A3A"; // "cosmic orange" phone finish
export const RED = "#FF5468";
export const GREEN = "#38D47F";
export const BEBAS = "Playfair Display"; // headings (site h1/h2)
export const INTER = "Montserrat"; // body / labels (site body)
export const N = toNewAlphabet;

loadFont({ family: BEBAS, url: staticFile("fonts/playfair-latin.woff2"), weight: "400 900", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212" });
loadFont({ family: BEBAS, url: staticFile("fonts/playfair-latin-ext.woff2"), weight: "400 900", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+2020, U+20A0-20AB, U+20AD-20C4" });

loadFont({ family: INTER, url: staticFile("fonts/montserrat-latin.woff2"), weight: "100 900", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212" });
loadFont({ family: INTER, url: staticFile("fonts/montserrat-latin-ext.woff2"), weight: "100 900", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+2020, U+20A0-20AB, U+20AD-20C4" });

// site easing: cubic-bezier(.16,.9,.25,1)
export const EASE = Easing.bezier(0.16, 0.9, 0.25, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const SHADOW = "0 3px 8px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.35)";
export const glass: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(38,26,18,0.92), rgba(19,12,8,0.9))",
  backdropFilter: "blur(8px)",
  border: "1.5px solid rgba(217,169,79,0.45)",
  boxShadow: "0 20px 44px rgba(0,0,0,0.45)",
};
export const useSpring = (delay = 0, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });
};
export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/* ======================= full-screen card ======================= */
// Cut-away card like the references: zoom-blur in, push out. Background: navy gradient,
// drifting dot grid, soft light bloom.
export const FullCard: React.FC<{ dur: number; children: React.ReactNode; bg?: string; bloom?: string }> = ({ dur, children, bg, bloom = GOLD2 }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 6, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const drift = f * 0.6;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 1.6) * (1 - out), transform: `scale(${1.12 - 0.12 * inn + 0.12 * out})`, filter: `blur(${(1 - inn) * 14 + out * 10}px)` }}>
      <AbsoluteFill style={{ background: bg ?? `radial-gradient(ellipse at 50% 30%, #3a2a1c 0%, #1d130d 42%, ${NAVY} 78%)` }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(217,169,79,0.12) 2px, transparent 2.5px)", backgroundSize: "44px 44px", backgroundPosition: `${drift}px ${drift * 0.5}px` }} />
      {/* site "glow": soft gold bloom breathing (4 s) */}
      <AbsoluteFill style={{ background: `radial-gradient(closest-side at 50% 48%, ${bloom}55, ${bloom}14 60%, transparent 78%)`, opacity: 0.75 + 0.25 * Math.sin((f / 120) * Math.PI * 2) }} />
      {children}
    </AbsoluteFill>
  );
};

/* ======================= kinetic words ======================= */
// A word that slams in: big → normal scale, blur clears, tiny shake.
export const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at, children, style, from = 1.9 }) => {
  const f = useCurrentFrame();
  const s = useSpring(at, { damping: 12, stiffness: 240, mass: 0.6 });
  const shake = f >= at && f < at + 6 ? Math.sin((f - at) * 3.1) * (6 - (f - at)) * 1.6 : 0;
  return (
    <div style={{ opacity: f >= at ? Math.min(1, s * 2.2) : 0, transform: `translateX(${shake}px) scale(${from - (from - 1) * s})`, filter: `blur(${Math.max(0, 1 - s) * 8}px)`, ...style }}>
      {children}
    </div>
  );
};
// Word rising from a mask line.
export const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const s = useSpring(at, { damping: 16, stiffness: 160 });
  return (
    <div style={{ overflow: "hidden", padding: "0 6px" }}>
      <div style={{ transform: `translateY(${(1 - s) * 110}%)`, ...style }}>{children}</div>
    </div>
  );
};
// Playfair is ~1.6× wider than the old condensed face → sizes scaled.
export const big = (size: number, color: string = CREAM): React.CSSProperties => ({ fontFamily: BEBAS, fontWeight: 800, fontSize: Math.round(size * 0.72), color, lineHeight: 1.08, letterSpacing: 0, fontVariantNumeric: "lining-nums", textShadow: SHADOW, whiteSpace: "nowrap" });

/* ======================= lower-left chip (ref: "icon | Vaqt") ======================= */
export const Chip: React.FC<{ dur: number; icon?: React.ReactNode; text: string; sub?: string; accent?: string; left?: number; bottom?: number }> = ({ dur, icon, text, sub, accent = GOLD, left = 90, bottom = 420 }) => {
  const f = useCurrentFrame();
  const s = useSpring(0, { damping: 15, stiffness: 180 });
  const wipe = interpolate(f, [3, 16], [0, 100], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 7, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left, bottom, display: "flex", alignItems: "center", gap: 20, opacity: 1 - out, transform: `translateX(${-out * 60}px)` }}>
      {icon && (
        <div style={{ ...glass, width: 92, height: 92, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s}) rotate(${(1 - s) * -40}deg)` }}>
          <div style={{ width: 54, height: 54 }}>{icon}</div>
        </div>
      )}
      <div style={{ width: 4, height: 70 * s, borderRadius: 2, background: accent }} />
      <div style={{ ...glass, borderRadius: 24, padding: "14px 30px 16px", clipPath: `inset(-20px ${100 - wipe}% -20px 0 round 24px)` }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: CREAM, textShadow: SHADOW, whiteSpace: "nowrap", lineHeight: 1.1 }}>{N(text)}</div>
        {sub && <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 28, color: accent, textShadow: SHADOW, whiteSpace: "nowrap", marginTop: 4 }}>{N(sub)}</div>}
      </div>
    </div>
  );
};

/* ======================= stacking list on the left (below the chin line) ======================= */
export type Item = { at: number; text: string; icon?: React.ReactNode; num?: string };
export const Stack: React.FC<{ dur: number; items: Item[]; top?: number; left?: number; step?: number; size?: number; title?: string }> = ({ dur, items, top = 470, left = 90, step = 96, size = 40, title }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shown = items.filter((it) => f >= it.at);
  const last = shown.length - 1;
  return (
    <div style={{ position: "absolute", left, top: top - (title ? 70 : 0), opacity: 1 - out, transform: `translateX(${-out * 80}px)` }}>
      {title && <Rise at={0} style={{ display: "inline-block", fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: NAVY, background: GOLD, borderRadius: 12, padding: "8px 18px", marginBottom: 18 }}>{N(title)}</Rise>}
      {items.map((it, i) => <StackRow key={i} it={it} i={i} step={step} size={size} active={i === last} />)}
    </div>
  );
};
const StackRow: React.FC<{ it: Item; i: number; step: number; size: number; active: boolean }> = ({ it, step, size, active }) => {
  const f = useCurrentFrame();
  const s = useSpring(it.at, { damping: 14, stiffness: 190 });
  if (f < it.at) return <div style={{ height: step }} />;
  return (
    <div style={{ height: step, display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, s * 1.5) * (active ? 1 : 0.72), transform: `translateX(${(1 - s) * -120}px) rotate(${(1 - s) * -6}deg)` }}>
      <div style={{ ...glass, width: step - 18, height: step - 18, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", background: active ? `linear-gradient(180deg, ${GOLD}, ${GOLD2})` : glass.background, transform: `scale(${0.6 + 0.4 * s})` }}>
        {it.num ? (
          <span style={{ fontFamily: BEBAS, fontWeight: 800, fontVariantNumeric: "lining-nums", fontSize: (step - 18) * 0.6, color: active ? NAVY : CREAM, lineHeight: 1 }}>{it.num}</span>
        ) : (
          <div style={{ width: (step - 18) * 0.58, height: (step - 18) * 0.58, color: active ? NAVY : CREAM }}>{it.icon}</div>
        )}
      </div>
      <div style={{ ...glass, borderRadius: 20, padding: "10px 26px 12px", fontFamily: INTER, fontWeight: 800, fontSize: size, color: CREAM, whiteSpace: "nowrap" }}>{N(it.text)}</div>
    </div>
  );
};

/* ======================= big numbered card (side, below chin) ======================= */
export const NumCard: React.FC<{ dur: number; num: string; label: string; sub?: string; badge?: string; badgeAt?: number; left?: number; top?: number }> = ({ dur, num, label, sub, badge, badgeAt = 0, left = 90, top = 560 }) => {
  const f = useCurrentFrame();
  const s = useSpring(0, { damping: 13, stiffness: 150, mass: 0.8 });
  const fill = interpolate(f, [6, 22], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const bs = useSpring(badgeAt, { damping: 9, stiffness: 220 });
  const st: React.CSSProperties = { fontFamily: BEBAS, fontWeight: 800, fontVariantNumeric: "lining-nums", fontSize: 190, lineHeight: 0.9, letterSpacing: 0 };
  const streak = interpolate(f, [0, 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: left - 420 + s * 420 - out * 500, top, display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ position: "absolute", left: -300, top: 110, width: 600 * (1 - streak), height: 6, borderRadius: 3, background: `linear-gradient(90deg, transparent, ${GOLD})`, opacity: 1 - streak }} />
      <div style={{ ...glass, minWidth: 230, height: 270, padding: "0 26px", borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", paddingTop: 20 }}>
          <div style={{ ...st, color: "transparent", WebkitTextStroke: `3px ${CREAM}` }}>{num}</div>
          <div style={{ ...st, position: "absolute", left: 0, right: 0, top: 20, color: GOLD, clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>{num}</div>
        </div>
      </div>
      <div style={{ ...glass, borderRadius: 30, padding: "24px 34px 28px", opacity: interpolate(f, [8, 18], [0, 1], clamp), transform: `translateY(${interpolate(f, [8, 20], [30, 0], { ...clamp, easing: EASE })}px)` }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 56, color: CREAM, textShadow: SHADOW, whiteSpace: "nowrap", lineHeight: 1.05 }}>{N(label)}</div>
        {sub && <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 32, color: MUTED, textShadow: SHADOW, marginTop: 10, whiteSpace: "nowrap" }}>{N(sub)}</div>}
        {badge && f >= badgeAt && (
          <div style={{ display: "inline-block", marginTop: 16, padding: "8px 22px", borderRadius: 999, background: GOLD, color: NAVY, fontFamily: INTER, fontWeight: 900, fontSize: 30, letterSpacing: 3, transform: `scale(${bs})` }}>{N(badge)}</div>
        )}
      </div>
    </div>
  );
};

/* ======================= money tile with counter ======================= */
export const Money: React.FC<{ dur: number; label: string; a: number; b: number; left?: number; top?: number; sub?: string }> = ({ dur, label, a, b, left = 90, top = 590, sub }) => {
  const f = useCurrentFrame();
  const s = useSpring(0, { damping: 14, stiffness: 160 });
  const t = interpolate(f, [6, 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left, top, opacity: Math.min(1, s * 1.5) * (1 - out), transform: `translateY(${(1 - s) * 80 + out * 40}px) scale(${0.9 + 0.1 * s})`, transformOrigin: "left center" }}>
      <div style={{ ...glass, borderRadius: 34, padding: "26px 40px 30px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: GOLD, whiteSpace: "nowrap" }}>{N(label.toUpperCase())}</div>
        <div style={{ ...big(130), textShadow: "none", marginTop: 8, fontVariantNumeric: "lining-nums tabular-nums" }}>
          ${fmt(a * t)} <span style={{ color: GOLD }}>–</span> ${fmt(b * t)}
        </div>
        {sub && <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, color: MUTED, marginTop: 6, whiteSpace: "nowrap" }}>{N(sub)}</div>}
      </div>
    </div>
  );
};

/* ======================= icons (line art, currentColor) ======================= */
const L = { fill: "none", stroke: "currentColor", strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ color: "inherit", overflow: "visible" }}>{children}</svg>
);
const white = (el: React.ReactNode) => <div style={{ color: CREAM, width: "100%", height: "100%" }}>{el}</div>;
export const Ic = {
  card: <Svg><rect x="8" y="22" width="84" height="56" rx="10" {...L} /><path d="M8 40 H92 M22 62 H44" {...L} /></Svg>,
  cap: <Svg><path d="M50 22 L94 42 L50 62 L6 42 Z" {...L} /><path d="M26 52 V72 Q50 86 74 72 V52 M88 45 V68" {...L} /></Svg>,
  home: <Svg><path d="M12 48 L50 16 L88 48 M22 40 V86 H78 V40" {...L} /><path d="M42 86 V62 H58 V86" {...L} /></Svg>,
  baby: <Svg><circle cx="50" cy="40" r="24" {...L} /><circle cx="41" cy="38" r="2.5" fill="currentColor" /><circle cx="59" cy="38" r="2.5" fill="currentColor" /><path d="M42 50 Q50 56 58 50 M30 70 Q50 92 70 70" {...L} /></Svg>,
  case: <Svg><rect x="8" y="30" width="84" height="56" rx="10" {...L} /><path d="M36 30 V20 H64 V30 M8 54 H92" {...L} /></Svg>,
  bank: <Svg><path d="M10 36 L50 14 L90 36 Z M16 86 H84 M24 44 V76 M42 44 V76 M58 44 V76 M76 44 V76" {...L} /></Svg>,
  up: <Svg><path d="M10 80 L36 52 L54 66 L88 26" {...L} /><path d="M66 24 H90 V48" {...L} /></Svg>,
  dollar: <Svg><circle cx="50" cy="50" r="40" {...L} /><path d="M62 34 Q56 28 48 28 Q36 28 36 38 Q36 48 50 50 Q64 52 64 62 Q64 72 50 72 Q40 72 36 66 M50 20 V80" {...L} /></Svg>,
  gift: <Svg><rect x="12" y="40" width="76" height="48" rx="6" {...L} /><path d="M8 28 H92 V40 H8 Z M50 28 V88 M50 28 Q34 6 24 18 Q18 28 50 28 Q66 6 76 18 Q82 28 50 28" {...L} /></Svg>,
  trophy: <Svg><path d="M30 14 H70 V40 Q70 62 50 62 Q30 62 30 40 Z M30 22 H14 Q14 44 32 46 M70 22 H86 Q86 44 68 46 M50 62 V76 M32 88 H68 L64 76 H36 Z" {...L} /></Svg>,
  bot: <Svg><rect x="16" y="32" width="68" height="50" rx="14" {...L} /><circle cx="38" cy="56" r="6" fill="currentColor" /><circle cx="62" cy="56" r="6" fill="currentColor" /><path d="M50 32 V18 M6 52 V64 M94 52 V64" {...L} /><circle cx="50" cy="14" r="5" {...L} /></Svg>,
  task: <Svg><rect x="18" y="12" width="64" height="80" rx="10" {...L} /><path d="M32 36 L40 44 L54 30 M32 64 H68" {...L} /></Svg>,
  star: <Svg><path d="M50 8 L62 36 L92 38 L69 58 L76 88 L50 72 L24 88 L31 58 L8 38 L38 36 Z" {...L} /></Svg>,
  users: <Svg><circle cx="36" cy="34" r="14" {...L} /><path d="M10 84 Q10 58 36 58 Q62 58 62 84" {...L} /><circle cx="70" cy="30" r="11" {...L} /><path d="M70 50 Q90 50 92 74" {...L} /></Svg>,
  clock: <Svg><circle cx="50" cy="50" r="40" {...L} /><path d="M50 24 V50 L68 62" {...L} /></Svg>,
  globe: <Svg><circle cx="50" cy="50" r="40" {...L} /><path d="M10 50 H90 M50 10 Q28 50 50 90 Q72 50 50 10" {...L} /></Svg>,
  camera: <Svg><rect x="12" y="12" width="76" height="76" rx="22" {...L} /><circle cx="50" cy="50" r="18" {...L} /><circle cx="72" cy="28" r="4" fill="currentColor" /></Svg>,
  target: <Svg><circle cx="50" cy="50" r="40" {...L} /><circle cx="50" cy="50" r="24" {...L} /><circle cx="50" cy="50" r="8" fill="currentColor" /></Svg>,
  check: <Svg><circle cx="50" cy="50" r="40" {...L} /><path d="M30 52 L44 66 L72 36" {...L} /></Svg>,
  heart: <Svg><path d="M50 84 Q12 58 12 34 Q12 14 32 14 Q44 14 50 28 Q56 14 68 14 Q88 14 88 34 Q88 58 50 84 Z" {...L} /></Svg>,
  test: <Svg><rect x="14" y="10" width="72" height="80" rx="10" {...L} /><path d="M28 30 H72 M28 48 H72 M28 66 H52" {...L} /><circle cx="70" cy="70" r="12" {...L} /></Svg>,
  rocket: <Svg><path d="M50 8 Q74 26 70 62 H30 Q26 26 50 8 Z M30 62 L18 78 L34 74 M70 62 L82 78 L66 74 M42 74 L50 92 L58 74" {...L} /><circle cx="50" cy="38" r="8" {...L} /></Svg>,
  mic: <Svg><rect x="36" y="10" width="28" height="48" rx="14" {...L} /><path d="M22 46 Q22 72 50 72 Q78 72 78 46 M50 72 V90 M34 90 H66" {...L} /></Svg>,
  video: <Svg><rect x="8" y="24" width="60" height="52" rx="10" {...L} /><path d="M68 42 L92 28 V72 L68 58" {...L} /></Svg>,
  down: <Svg><path d="M50 12 V84 M22 58 L50 86 L78 58" {...L} /></Svg>,
  wallet: <Svg><rect x="8" y="24" width="84" height="60" rx="10" {...L} /><path d="M64 46 H92 V64 H64 Z M18 24 L66 10 L72 24" {...L} /></Svg>,
};
export const W = (k: keyof typeof Ic) => white(Ic[k]);

/* ======================= devices (vector, no brand logos) ======================= */
// Phone, rear view: full-width camera plateau, three lenses, flash — cosmic-orange aluminium.
export const Phone: React.FC<{ w?: number; shine?: number; color?: string }> = ({ w = 300, shine = 0, color = ORANGE }) => {
  const h = w * 2.08;
  return (
    <svg viewBox="0 0 300 624" width={w} height={h} style={{ overflow: "visible", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" }}>
      <defs>
        <linearGradient id="pbody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB07A" />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor="#B2471B" />
        </linearGradient>
        <linearGradient id="pplat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF9A62" />
          <stop offset="1" stopColor="#D85A22" />
        </linearGradient>
        <radialGradient id="lens" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#3A4B78" />
          <stop offset="0.45" stopColor="#0B0F1C" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <linearGradient id="pshine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="pclip"><rect x="0" y="0" width="300" height="624" rx="54" /></clipPath>
      </defs>
      <rect x="0" y="0" width="300" height="624" rx="54" fill="url(#pbody)" />
      <rect x="3" y="3" width="294" height="618" rx="51" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
      <g clipPath="url(#pclip)">
        <rect x="-10" y="-10" width="320" height="214" rx="40" fill="url(#pplat)" />
        <rect x="-10" y="198" width="320" height="6" fill="rgba(0,0,0,0.12)" />
        <rect x={-200 + shine * 700} y="-50" width="120" height="740" fill="url(#pshine)" transform={`rotate(18 150 312)`} />
      </g>
      {[[76, 60], [76, 148], [148, 104]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="40" fill="#8E3A16" />
          <circle cx={x} cy={y} r="35" fill="#1B1F2B" stroke="#C9C9CF" strokeWidth="2.5" />
          <circle cx={x} cy={y} r="25" fill="url(#lens)" />
          <circle cx={x - 8} cy={y - 9} r="5" fill="rgba(255,255,255,0.55)" />
        </g>
      ))}
      <circle cx="222" cy="58" r="15" fill="#FFF3D6" stroke="#C26A3A" strokeWidth="3" />
      <circle cx="222" cy="150" r="13" fill="#141826" />
      <circle cx="262" cy="104" r="6" fill="#141826" />
    </svg>
  );
};

// Laptop, front 3/4: thin display with colourful wallpaper, silver deck.
export const Laptop: React.FC<{ w?: number; shine?: number }> = ({ w = 760, shine = 0 }) => (
  <svg viewBox="0 0 760 500" width={w} height={(w * 500) / 760} style={{ overflow: "visible", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" }}>
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFD36E" />
        <stop offset="0.35" stopColor="#FF7A59" />
        <stop offset="0.7" stopColor="#7B5CFF" />
        <stop offset="1" stopColor="#2F7BFF" />
      </linearGradient>
      <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F1F2F6" />
        <stop offset="1" stopColor="#A9ADB8" />
      </linearGradient>
      <linearGradient id="lshine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="white" stopOpacity="0" />
        <stop offset="0.5" stopColor="white" stopOpacity="0.45" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <clipPath id="scr"><rect x="98" y="28" width="564" height="372" rx="8" /></clipPath>
    </defs>
    <rect x="80" y="10" width="600" height="408" rx="26" fill="#D7DAE2" />
    <rect x="86" y="16" width="588" height="396" rx="22" fill="#0A0C12" />
    <rect x="98" y="28" width="564" height="372" rx="8" fill="url(#wall)" />
    <g clipPath="url(#scr)">
      <circle cx="250" cy="300" r="170" fill="rgba(255,255,255,0.18)" />
      <circle cx="560" cy="110" r="120" fill="rgba(255,255,255,0.14)" />
      <rect x="98" y="28" width="564" height="20" fill="rgba(255,255,255,0.25)" />
      <rect x="300" y="366" width="160" height="24" rx="10" fill="rgba(255,255,255,0.35)" />
      <rect x={-100 + shine * 900} y="0" width="140" height="440" fill="url(#lshine)" transform="rotate(20 380 214)" />
    </g>
    <path d="M30 420 H730 L760 456 Q760 470 744 470 H16 Q0 470 0 456 Z" fill="url(#deck)" />
    <rect x="310" y="420" width="140" height="12" rx="6" fill="#9EA3AF" />
    <path d="M0 456 Q0 470 16 470 H744 Q760 470 760 456" fill="none" stroke="#7E8390" strokeWidth="3" />
  </svg>
);

// Rotating light rays behind hero objects.
export const Rays: React.FC<{ color?: string; size?: number; opacity?: number }> = ({ color = GOLD, size = 1500, opacity = 0.22 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity, transform: `rotate(${f * 0.4}deg)`, background: `repeating-conic-gradient(from 0deg, ${color} 0deg 6deg, transparent 6deg 20deg)`, maskImage: "radial-gradient(circle, black 0%, transparent 62%)", WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 62%)" }} />
  );
};

// Confetti burst (deterministic).
export const Confetti: React.FC<{ at: number; n?: number; cx?: number; cy?: number }> = ({ at, n = 46, cx = 960, cy = 520 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 60) return null;
  const cols = [GOLD, GOLD2, BLUE, CREAM, ORANGE, "#fff"];
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i * 137.5 * Math.PI) / 180;
        const sp = 14 + ((i * 7) % 11);
        const x = cx + Math.cos(a) * sp * f;
        const y = cy + Math.sin(a) * sp * f * 0.8 + 0.5 * 1.1 * f * f;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 8, background: cols[i % cols.length], transform: `rotate(${f * (10 + i)}deg)`, opacity: interpolate(f, [40, 60], [1, 0], clamp), borderRadius: 2 }} />;
      })}
    </>
  );
};

/* ======================= device photos (user-supplied) ======================= */
// iphone.jpg 1122×1402, macbook.jpg 1024×1536 (text "The Colorful" / "Explore Now" removed).
// Black photo backgrounds melt into a dark card through a soft radial mask.
export const DEVICE = {
  phone: { src: "v12/iphone.jpg", ar: 1122 / 1402 },
  laptop: { src: "v12/macbook.jpg", ar: 1024 / 1536 },
};
export const DARK_BG = "radial-gradient(ellipse at 50% 55%, #1A120C 0%, #050505 70%)";
export const DevicePhoto: React.FC<{ kind: keyof typeof DEVICE; h: number; style?: React.CSSProperties }> = ({ kind, h, style }) => {
  const d = DEVICE[kind];
  const mask = "radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)";
  return (
    <Img src={staticFile(d.src)} style={{ height: h, width: h * d.ar, display: "block", maskImage: mask, WebkitMaskImage: mask, ...style }} />
  );
};
