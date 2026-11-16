import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { at, SCENE } from "./timeline";

export const BEBAS = "Bebas Neue";
loadFont({ family: BEBAS, url: staticFile("fonts/bebasneue-latin.woff2"), weight: "400" });
loadFont({ family: BEBAS, url: staticFile("fonts/bebasneue-latin-ext.woff2"), weight: "400", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+1E00-1E9F" });

export const GOLD = "#E9C27A";
export const GOLD2 = "#C9963A";
export const AMBER = "#FFA94D";
const INK = "#0f141d";
const PAPER = "#F4EEE3";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** local frame of a source-second inside the scene */
const L = (sec: number) => at(sec) - SCENE.from;

/* ---------- floor plan (gold line-art) that draws itself; one wall cracks ---------- */
const PLAN = [
  "M60 60 H640 V520 H60 Z", // outer walls
  "M60 300 H300", // inner wall left
  "M380 300 H640", // inner wall right
  "M300 60 V200", // partition
  "M460 300 V520", // partition
  "M120 360 h120 v100 h-120 z", // sofa
  "M500 360 a40 40 0 1 0 0.1 0", // table
  "M360 120 h200 v110 h-200 z", // bed
  "M90 90 h120 v70 h-120 z", // kitchen block
];

const Plan: React.FC = () => {
  const f = useCurrentFrame();
  const crackAt = L(9.98);
  const crack = interpolate(f, [crackAt, crackAt + 8], [0, 1], clamp);
  const shake = f >= crackAt && f < crackAt + 10 ? Math.sin(f * 3.3) * 8 * (1 - (f - crackAt) / 10) : 0;
  const dim = Math.min(interpolate(f, [L(17.2), L(17.6)], [1, 0.45], clamp), interpolate(f, [L(22.3), L(22.62)], [1, 0.15], clamp));
  return (
    <svg width={700} height={580} viewBox="0 0 700 580" style={{ transform: `translateX(${shake}px)`, opacity: dim }}>
      {PLAN.map((d, i) => {
        const p = interpolate(f, [4 + i * 5, 30 + i * 5], [0, 1], { ...clamp, easing: EASE });
        return <path key={i} d={d} fill="none" stroke={i < 5 ? GOLD : "rgba(233,194,122,0.55)"} strokeWidth={i < 5 ? 7 : 3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
      })}
      {/* dimension line */}
      <g opacity={interpolate(f, [40, 52], [0, 1], clamp)}>
        <path d="M60 555 H640 M60 545 v20 M640 545 v20" stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
        <text x={350} y={548} fill="rgba(255,255,255,0.6)" fontFamily={INTER} fontSize={20} textAnchor="middle">
          12.40 m
        </text>
      </g>
      {/* crack in the right wall */}
      <path d="M640 110 L612 160 L648 205 L606 262 L640 300" fill="none" stroke={AMBER} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
    </svg>
  );
};

/* ---------- receipt of costs ---------- */
const ITEMS = [
  { t: "Usta haqi", at: 3.72, ok: true },
  { t: "Noto‘g‘ri materiallar", at: 8.4 },
  { t: "Buzilgan devorlar", at: 9.98 },
  { t: "Ustalar ketib qolishi", at: 11.18 },
  { t: "Narxlar oshishi", at: 13.72 },
];

const Receipt: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - 2, fps, config: { damping: 15, stiffness: 140 } });
  const stampAt = L(17.2);
  const stamp = spring({ frame: f - stampAt, fps, config: { damping: 10, stiffness: 300 } });
  const okTick = spring({ frame: f - L(5.54), fps, config: { damping: 9, stiffness: 260 } });
  // budget meter: master's fee fills 42 %, each hidden cost pushes it further — past the budget line
  const LEVELS = [0, 0.42, 0.62, 0.8, 0.98, 1.22];
  const n = ITEMS.filter((it) => f >= L(it.at)).length;
  const e = n === 0 ? 0 : spring({ frame: f - L(ITEMS[n - 1].at), fps, config: { damping: 18, stiffness: 120 } });
  const m = n === 0 ? 0 : LEVELS[n - 1] + (LEVELS[n] - LEVELS[n - 1]) * e;
  const over = m > 1;
  const sink = interpolate(f, [L(20.12), L(21.2)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 140, right: 140, top: 900, transform: `translateY(${(1 - inn) * 500 + sink * 900}px) scale(${1 - sink * 0.4})`, opacity: 1 - sink }}>
      <div style={{ background: PAPER, borderRadius: "22px 22px 0 0", padding: "30px 38px 34px", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: BEBAS, fontSize: 64, color: INK, letterSpacing: 2 }}>{N("REMONT XARAJATI")}</span>
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 26, color: "rgba(15,20,29,0.5)" }}>{N("o‘zingiz")}</span>
        </div>
        <div style={{ borderTop: "3px dashed rgba(15,20,29,0.25)", margin: "14px 0 10px" }} />
        {ITEMS.map((it, i) => {
          const s = spring({ frame: f - L(it.at), fps, config: { damping: 13, stiffness: 220 } });
          const hidden = !it.ok;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 66, opacity: s, transform: `translateX(${(1 - s) * 50}px)` }}>
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, color: INK, flex: 1, whiteSpace: "nowrap" }}>{N(it.t)}</span>
              {it.ok ? (
                <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, color: "#1f8a5b", opacity: okTick, transform: `scale(${okTick})`, display: "inline-block" }}>✓ {N("oddiy hol")}</span>
              ) : (
                <span style={{ fontFamily: BEBAS, fontSize: 50, color: AMBER, letterSpacing: 1 }}>+ ???</span>
              )}
              {hidden && f >= stampAt ? <div style={{ position: "absolute", left: 30, right: 30, height: 3, background: "rgba(15,20,29,0.35)", marginTop: 2 }} /> : null}
            </div>
          );
        })}
        <div style={{ borderTop: "3px dashed rgba(15,20,29,0.25)", margin: "10px 0 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: BEBAS, fontSize: 48, color: INK }}>BYUDJET</span>
          <div style={{ flex: 1, height: 26, borderRadius: 13, background: "rgba(15,20,29,0.1)", position: "relative" }}>
            <div style={{ width: `${Math.min(m, 1) * 100}%`, height: "100%", borderRadius: 13, background: over ? AMBER : GOLD2 }} />
            {over ? <div style={{ position: "absolute", right: -8, top: -10, bottom: -10, width: `${(m - 1) * 100}%`, minWidth: 16, borderRadius: 13, background: AMBER, opacity: 0.6 + 0.4 * Math.sin(f / 3) }} /> : null}
          </div>
        </div>
        {/* zig-zag tear */}
        <svg width="100%" height={22} viewBox="0 0 100 10" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -21 }}>
          <path d={`M0 0 ${Array.from({ length: 20 }, (_, i) => `L${i * 5 + 2.5} 10 L${i * 5 + 5} 0`).join(" ")}`} fill={PAPER} />
        </svg>
        {/* stamp */}
        {f >= stampAt ? (
          <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%, -50%) rotate(-12deg) scale(${2.4 - 1.4 * stamp})`, opacity: Math.min(1, stamp * 2), border: `7px solid ${AMBER}`, borderRadius: 18, padding: "8px 30px", background: "rgba(244,238,227,0.88)" }}>
            <span style={{ fontFamily: BEBAS, fontSize: 92, color: AMBER, letterSpacing: 4, whiteSpace: "nowrap" }}>{N("SMETADA YO‘Q")}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ---------- headline (kinetic) at the top of the scene ---------- */
const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines: [number, number, string, string][] = [
    [3.72, 6.86, "Usta haqi", "oddiy hol"],
    [6.86, 15.96, "Lekin…", "yashirin xarajatlar"],
    [15.96, 17.2, "Jiddiy", "muammo"],
    [17.2, 20.12, "Hech biri", "smetada yo‘q"],
    [20.12, 22.62, "Hammasi", "cho‘ntagingizdan"],
  ];
  const cur = lines.find(([a, b]) => f >= L(a) && f < L(b) && f < L(22.62));
  if (!cur) return null;
  const [a, , big, small] = cur;
  const s = spring({ frame: f - L(a), fps, config: { damping: 13, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 0.9, color: "white", letterSpacing: 3, transform: `translateY(${(1 - s) * 40}px)`, opacity: s, clipPath: `inset(0 ${(1 - s) * 50}% 0 ${(1 - s) * 50}%)` }}>{N(big)}</div>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 44, color: GOLD, letterSpacing: 6, textTransform: "uppercase", marginTop: 8, opacity: interpolate(f, [L(a) + 6, L(a) + 14], [0, 1], clamp) }}>{N(small)}</div>
    </div>
  );
};

/* ---------- wallet losing money (20.1 s → end of scene) ---------- */
const Wallet: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = L(20.6);
  const s = spring({ frame: f - start, fps, config: { damping: 12, stiffness: 180 } });
  if (f < start) return null;
  const bills = Array.from({ length: 9 }, (_, i) => {
    const t = f - start - 6 - i * 4;
    if (t < 0) return null;
    const x = Math.sin(i * 2.3) * 260;
    const y = -t * 9 + t * t * 0.55;
    const rot = Math.sin(i * 1.7) * 40 + t * (i % 2 ? 3 : -3);
    const o = interpolate(t, [0, 4, 34, 44], [0, 1, 1, 0], clamp);
    return <div key={i} style={{ position: "absolute", left: "50%", top: 120, width: 120, height: 62, marginLeft: -60, borderRadius: 8, background: "linear-gradient(135deg,#9fd8a8,#5fae74)", border: "3px solid #2e6b42", opacity: o, transform: `translate(${x * Math.min(1, t / 20)}px, ${y}px) rotate(${rot}deg)` }} />;
  });
  const gone = interpolate(f, [L(22.3), L(22.62)], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1080, left: 0, right: 0, height: 500, transform: `scale(${s})`, opacity: gone }}>
      {bills}
      <svg width={300} height={240} viewBox="0 0 30 24" style={{ position: "absolute", left: "50%", marginLeft: -150, top: 150 }}>
        <rect x="1.5" y="5" width="27" height="17" rx="3" fill={INK} stroke={GOLD} strokeWidth="1.3" />
        <path d="M4 5 L20 1.5 L22 5" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinejoin="round" />
        <rect x="19" y="11" width="9.5" height="6" rx="2" fill="none" stroke={GOLD} strokeWidth="1.3" />
        <circle cx="22.5" cy="14" r="1" fill={GOLD} />
      </svg>
    </div>
  );
};

/* ---------- the whole scene ---------- */
export const BlueprintScene: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  // circular reveal in, circular wipe out (no white flash)
  const rin = interpolate(f, [0, 10], [0, 150], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rout = interpolate(f, [dur - 10, dur], [150, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const rad = Math.min(rin, rout);
  const drift = (f * 0.6) % 60;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${rad}% at 50% 50%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #1b2433 0%, ${INK} 70%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "120px 120px, 120px 120px, 30px 30px, 30px 30px",
          backgroundPosition: `${drift}px ${drift}px`,
        }}
      />
      <Headline />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(0.86)`, transformOrigin: "50% 0%" }}>
        <Plan />
      </div>
      <Receipt />
      <Wallet />
    </AbsoluteFill>
  );
};
