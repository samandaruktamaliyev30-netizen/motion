import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { BEBAS, CAVEAT } from "../med/ui";
import { toNewAlphabet as N } from "../kiut2/alphabet";

// v13 look: pharmacy — white type on frosted glass, syrup-amber accent, red only for danger.
// Everything sits low: the speaker's chin is at ≈ 850–905 px.
export const AMBER = "#FFB547";
export const RED = "#FF4D5E";
export const LOW = 1060;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 8px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.45)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(12,16,26,0.72), rgba(12,16,26,0.48))",
  backdropFilter: "blur(18px) saturate(1.3)",
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

const Low: React.FC<{ dur: number; top?: number; children: React.ReactNode }> = ({ dur, top = LOW, children }) => {
  const p = useIO(dur);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      {children}
    </div>
  );
};

/* syrup bottle: fill level 0..1, lid lifts by `lid` (0 closed .. 1 off) */
export const Bottle: React.FC<{ size?: number; fill?: number; lid?: number; color?: string }> = ({ size = 120, fill = 0.62, lid = 0, color = AMBER }) => {
  const top = 58 + (1 - fill) * 70;
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="btl">
          <path d="M36 40 L36 52 Q16 60 16 82 L16 128 Q16 136 24 136 L76 136 Q84 136 84 128 L84 82 Q84 60 64 52 L64 40 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#btl)">
        <rect x={0} y={top} width={100} height={140} fill={color} opacity={0.92} />
        <rect x={0} y={top} width={100} height={4} fill="white" opacity={0.35} />
      </g>
      <path d="M36 40 L36 52 Q16 60 16 82 L16 128 Q16 136 24 136 L76 136 Q84 136 84 128 L84 82 Q84 60 64 52 L64 40 Z" fill="none" stroke="white" strokeWidth={4} strokeLinejoin="round" />
      <rect x={26} y={88} width={48} height={30} rx={4} fill="white" opacity={0.9} />
      <path d="M44 103 h12 M50 97 v12" stroke={color} strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${lid * 26} ${-lid * 46}) rotate(${lid * 28} 50 30)`}>
        <rect x={31} y={20} width={38} height={20} rx={4} fill="white" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={35 + i * 7} y={23} width={2.5} height={14} rx={1} fill="rgba(0,0,0,0.25)" />
        ))}
      </g>
    </svg>
  );
};

/* ---------- HOOK: "Siroplar xavflimi?" ---------- */
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  const a = spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } });
  const b = spring({ frame: f - 14, fps, config: { damping: 14 } });
  const tri = spring({ frame: f - 4, fps, config: { damping: 9 } });
  const pulse = 1 + Math.max(0, Math.sin(((f - 10) / 15) * Math.PI)) * 0.08 * (f > 10 ? 1 : 0);
  const shake = f > 20 && f < 30 ? Math.sin(f * 2.3) * 6 : 0;
  const ring = interpolate((f - 8) % 24, [0, 24], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: LOW - 10, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", textShadow: SHADOW }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `translateX(${shake}px)` }}>
          <div style={{ position: "relative", width: 140, height: 130, transform: `scale(${tri * pulse}) rotate(${(1 - tri) * -40}deg)` }}>
            <div style={{ position: "absolute", left: 20, top: 15, width: 100, height: 100, borderRadius: 50, border: `4px solid ${RED}`, opacity: f > 8 ? 1 - ring : 0, transform: `scale(${1 + ring * 0.9})` }} />
            <svg width={140} height={130} viewBox="0 0 24 22" style={{ position: "absolute", filter: `drop-shadow(0 0 14px ${RED})` }}>
              <path d="M12 1.5L23 20.5H1z" fill={RED} stroke="white" strokeWidth={1.2} strokeLinejoin="round" />
              <path d="M12 8v6" stroke="white" strokeWidth={2.4} strokeLinecap="round" />
              <circle cx={12} cy={17.2} r={1.4} fill="white" />
            </svg>
          </div>
          <div style={{ fontFamily: BEBAS, fontSize: 190, lineHeight: 0.9, color: "white", letterSpacing: 3, transform: `scale(${1.8 - a * 0.8})`, opacity: Math.min(1, a * 1.5), filter: `blur(${(1 - a) * 10}px)` }}>
            SIROP
          </div>
        </div>
        <div style={{ marginTop: 14, ...glass, borderRadius: 999, padding: "14px 36px", opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 50, color: "white" }}>
            {N("bolangiz uchun ")}
            <span style={{ color: RED }}>{N("xavflimi?")}</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- "ikki xil muddat" ---------- */
export const Two: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(f, [6, 18], [0, 1], { ...clamp, easing: EASE });
  const s = spring({ frame: f, fps, config: { damping: 11 } });
  const chip = (d: number) => spring({ frame: f - d, fps, config: { damping: 13 } });
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative", fontFamily: BEBAS, fontSize: 260, lineHeight: 0.85, transform: `scale(${s})` }}>
          <span style={{ color: "transparent", WebkitTextStroke: `5px ${AMBER}` }}>2</span>
          <span style={{ position: "absolute", left: 0, top: 0, color: AMBER, clipPath: `inset(${(1 - fill) * 100}% 0 0 0)`, textShadow: `0 0 30px rgba(255,181,71,0.5)` }}>2</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 62, color: "white", textShadow: SHADOW }}>{N("xil muddat")}</div>
          {["Yopiq holda", "Ochilgandan keyin"].map((t, i) => {
            const c = chip(14 + i * 10);
            return (
              <div key={t} style={{ ...glass, borderRadius: 18, padding: "10px 22px", display: "flex", alignItems: "center", gap: 14, opacity: c, transform: `translateX(${(1 - c) * 80}px)` }}>
                <span style={{ fontFamily: BEBAS, fontSize: 44, color: AMBER }}>{i + 1}</span>
                <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, color: "white" }}>{N(t)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Low>
  );
};

/* ---------- bars: yopiq 2–3 yil vs ochilgandan keyin ---------- */
export const Bars: React.FC<{ dur: number; bAt: number }> = ({ dur, bAt }) => {
  const f = useCurrentFrame();
  const g1 = interpolate(f, [6, 40], [0, 1], { ...clamp, easing: EASE });
  const g2 = interpolate(f, [bAt, bAt + 14, bAt + 30], [0, 0.55, 0.12], { ...clamp, easing: EASE });
  const r2 = spring({ frame: f - bAt + 4, fps: 30, config: { damping: 14 } });
  const lid = interpolate(f, [bAt, bAt + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const years = Math.round(interpolate(f, [6, 40], [0, 3], clamp));
  const Row: React.FC<{ icon: React.ReactNode; label: string; w: number; color: string; value: string; o: number }> = ({ icon, label, w, color, value, o }) => (
    <div style={{ ...glass, borderRadius: 26, padding: "16px 26px", display: "flex", alignItems: "center", gap: 20, width: 900, opacity: o, transform: `translateY(${(1 - o) * 40}px)` }}>
      <div style={{ width: 80, display: "flex", justifyContent: "center" }}>{icon}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.9)" }}>{N(label)}</span>
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, color }}>{N(value)}</span>
        </div>
        <div style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${w * 100}%`, borderRadius: 9, background: color, boxShadow: `0 0 16px ${color}` }} />
        </div>
      </div>
    </div>
  );
  return (
    <Low dur={dur} top={LOW - 10}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Row icon={<Bottle size={56} />} label="Yopiq holda" w={g1} color={AMBER} value={years >= 2 ? "2–3 yil" : `${years} yil`} o={1} />
        <Row icon={<Bottle size={56} lid={lid} />} label="Ochilgandan keyin" w={g2} color={f > bAt + 18 ? RED : AMBER} value={f > bAt + 18 ? "juda qisqa!" : "…"} o={Math.min(1, r2)} />
      </div>
    </Low>
  );
};

/* ---------- air gets in → strength drops ---------- */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({ x: ((i * 53) % 220) - 110, d: (i * 7) % 30, s: 16 + ((i * 13) % 12) }));
export const Air: React.FC<{ dur: number; meterAt: number }> = ({ dur, meterAt }) => {
  const f = useCurrentFrame();
  const lid = interpolate(f, [4, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const drop = interpolate(f, [meterAt, meterAt + 45], [100, 35], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const color = drop > 70 ? "#3EE6A8" : drop > 50 ? AMBER : RED;
  const fill = interpolate(f, [meterAt, meterAt + 45], [0.62, 0.62], clamp);
  const tint = interpolate(f, [meterAt, meterAt + 45], [0, 1], clamp);
  const mix = (a: number[], b: number[]) => `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * tint)).join(",")})`;
  const meterIn = interpolate(f, [meterAt - 6, meterAt + 4], [0, 1], { ...clamp, easing: EASE });
  return (
    <Low dur={dur} top={LOW - 20}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 * meterIn }}>
        <div style={{ position: "relative", width: 240, height: 290, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          {PARTICLES.map((p, i) => {
            const t = ((f - p.d + 60) % 40) / 40;
            const y = interpolate(t, [0, 1], [-40, 110]);
            const x = p.x * (1 - t);
            const o = f > 12 ? Math.sin(t * Math.PI) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: 120 + x - p.s / 2, top: y, width: p.s, height: p.s, borderRadius: p.s, background: "rgba(180,225,255,0.9)", opacity: o, boxShadow: "0 0 10px rgba(180,225,255,0.8)" }} />
            );
          })}
          <div style={{ position: "absolute", top: -50, left: 0, right: 0, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 44, color: "rgba(200,235,255,0.95)", opacity: f > 12 ? 1 : 0, textShadow: SHADOW }}>
            {N("havo")} · O₂
          </div>
          <Bottle size={180} lid={lid} fill={fill} color={mix([255, 181, 71], [150, 120, 90])} />
        </div>
        <div style={{ width: meterIn * 400, overflow: "visible" }}>
        <div style={{ ...glass, borderRadius: 28, padding: "24px 30px", width: 400, boxSizing: "border-box", opacity: meterIn, transform: `translateX(${(1 - meterIn) * 60}px)` }}>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.85)" }}>{N("Dori kuchi")}</div>
          <div style={{ fontFamily: BEBAS, fontSize: 130, lineHeight: 1, color, textShadow: `0 0 24px ${color}` }}>{Math.round(drop)}%</div>
          <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${drop}%`, background: color, borderRadius: 8 }} />
          </div>
        </div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- write the opening date on the box ---------- */
export const Label: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 13 } });
  const w = interpolate(f, [16, 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const pen = 120 + w * 440;
  const penY = Math.sin(f * 1.3) * 6;
  const tick = spring({ frame: f - 66, fps, config: { damping: 10 } });
  return (
    <Low dur={dur} top={LOW - 10}>
      <div style={{ position: "relative", transform: `rotate(${-3 + (1 - s) * -8}deg) scale(${0.8 + s * 0.2})` }}>
        <div style={{ background: "#FBF7EE", borderRadius: 18, padding: "26px 40px 30px", width: 700, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", borderLeft: `14px solid ${AMBER}` }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: "#9A8F7A" }}>{N("SIROP · 100 ML")}</div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, color: "#1B1B1B", marginTop: 8 }}>{N("Ochilgan sana:")}</div>
          <div style={{ position: "relative", height: 110 }}>
            <div style={{ position: "absolute", left: 0, top: 0, fontFamily: CAVEAT, fontWeight: 700, fontSize: 100, color: "#1D4ED8", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, whiteSpace: "nowrap" }}>27.11.2026</div>
            <div style={{ position: "absolute", left: 0, right: 40, bottom: 6, height: 3, background: "rgba(0,0,0,0.15)" }} />
          </div>
        </div>
        <svg width={120} height={120} viewBox="0 0 24 24" style={{ position: "absolute", left: pen, top: 120 + penY, opacity: f < 64 ? 1 : 0, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.4))" }}>
          <path d="M3 21l3.5-1 12-12-2.5-2.5-12 12z" fill="#222" stroke="white" strokeWidth={0.8} />
          <path d="M16 5.5l2.5 2.5 2-2-2.5-2.5z" fill={AMBER} />
        </svg>
        <div style={{ position: "absolute", right: -26, top: -26, width: 92, height: 92, borderRadius: 46, background: "#3EE6A8", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tick})`, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>
          <svg width={54} height={54} viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#06261A" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Low>
  );
};

/* ---------- danger ---------- */
export const Danger: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 9, stiffness: 180 } });
  const shake = f < 14 ? Math.sin(f * 2.6) * (14 - f) * 0.8 : 0;
  const glow = 0.5 + Math.sin(f / 4) * 0.25;
  return (
    <Low dur={dur}>
      <div style={{ transform: `scale(${s}) translateX(${shake}px)`, background: "linear-gradient(135deg, rgba(120,10,20,0.85), rgba(60,6,12,0.7))", border: `2px solid ${RED}`, backdropFilter: "blur(14px)", borderRadius: 30, padding: "22px 40px", display: "flex", alignItems: "center", gap: 22, boxShadow: `0 0 ${40 * glow}px ${RED}` }}>
        <svg width={76} height={70} viewBox="0 0 24 22">
          <path d="M12 1.5L23 20.5H1z" fill={RED} stroke="white" strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M12 8v6" stroke="white" strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={12} cy={17.2} r={1.4} fill="white" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: BEBAS, fontSize: 92, lineHeight: 0.95, color: "white", letterSpacing: 2 }}>{N("ZAHARLANISH XAVFI")}</span>
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,0.85)" }}>{N("muddati o‘tgan yoki sanasi noma’lum sirop")}</span>
        </div>
      </div>
    </Low>
  );
};

/* ---------- CTA: send to young families ---------- */
export const Cta: React.FC<{ dur: number; clickAt: number }> = ({ dur, clickAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - 2, fps, config: { damping: 13 } });
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [12, clickAt - 2], [220, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fly = interpolate(f, [clickAt, clickAt + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const fam = (d: number) => spring({ frame: f - d, fps, config: { damping: 12 } });
  return (
    <div style={{ position: "absolute", top: LOW + 10, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: Math.min(inn, out), transform: `translateY(${(1 - inn) * 50}px)` }}>
      <div style={{ display: "flex", gap: 14 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ ...glass, width: 104, height: 104, borderRadius: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${fam(6 + i * 5)})` }}>
            <svg width={70} height={60} viewBox="0 0 36 30">
              <circle cx={9} cy={7} r={4} fill="white" />
              <circle cx={27} cy={7} r={4} fill="white" />
              <circle cx={18} cy={15} r={3} fill={AMBER} />
              <path d="M2 28c0-7 3-11 7-11s7 4 7 11z M20 28c0-7 3-11 7-11s7 4 7 11z" fill="white" />
              <path d="M13 29c0-5 2-8 5-8s5 3 5 8z" fill={AMBER} />
            </svg>
          </div>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? "rgba(20,24,34,0.55)" : "white", border: "2px solid white", backdropFilter: "blur(12px)", color: clicked ? "white" : "#111", borderRadius: 999, padding: "24px 54px", fontFamily: INTER, fontWeight: 800, fontSize: 48, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 36px rgba(0,0,0,0.4)" }}>
          <svg width={46} height={46} viewBox="0 0 24 24" style={{ transform: `translate(${fly * 300}px, ${-fly * 220}px) rotate(${fly * 20}deg)`, opacity: 1 - fly * 0.9 }}>
            <path d="M3 11l18-8-6 18-3-7z" fill="none" stroke={clicked ? "white" : "#111"} strokeWidth={2.2} strokeLinejoin="round" />
          </svg>
          {clicked ? N("✓ Jo‘natildi") : N("Yosh oilalarga jo‘nating")}
        </div>
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 40 + cur, marginTop: 8, opacity: f < clickAt + 18 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
