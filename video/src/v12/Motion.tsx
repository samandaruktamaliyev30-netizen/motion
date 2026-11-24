import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { BEBAS } from "../med/ui";
import { toNewAlphabet as N } from "../kiut2/alphabet";

// v12 look: medical "monitor" theme — white type, frosted glass, one cyan accent, ECG lines.
// Everything sits low (below the speaker's chin ≈ 910 px).
export const ACC = "#5CE1FF";
export const LOW = 1090;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 8px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.45)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(12,16,26,0.7), rgba(12,16,26,0.46))",
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

// ECG trace that draws itself left→right
const ECG_PATH = "M0 60 L120 60 L140 60 L155 40 L170 60 L190 60 L205 72 L222 6 L240 104 L256 60 L300 60 L318 48 L336 60 L460 60 L475 40 L490 60 L510 60 L525 72 L542 6 L560 104 L576 60 L620 60 L638 48 L656 60 L780 60";
const Ecg: React.FC<{ start: number; len: number; color?: string; width?: number; opacity?: number }> = ({ start, len, color = ACC, width = 780, opacity = 1 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + len], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <svg width={width} height={110} viewBox="0 0 780 110" style={{ overflow: "visible", opacity, filter: `drop-shadow(0 0 10px ${color})` }}>
      <path d={ECG_PATH} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/* ---------- HOOK: over the stretcher shot ---------- */
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  const slam = (d: number) => spring({ frame: f - d, fps, config: { damping: 13, stiffness: 190 } });
  const a = slam(0);
  const b = slam(12);
  const c = slam(24);
  const bar = interpolate(f, [30, 44], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.7) 100%)" }} />
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", textShadow: SHADOW }}>
        <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 0.95, color: "white", letterSpacing: 2, transform: `scale(${2 - a})`, opacity: Math.min(1, a * 1.5), filter: `blur(${(1 - a) * 10}px)` }}>
          {N("YAXSHI DOKTOR")}
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 48, color: "rgba(255,255,255,0.9)", marginTop: 6, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
          {N("bo‘lish uchun")}
        </div>
        <div style={{ position: "relative", marginTop: 22, transform: `scale(${0.6 + c * 0.4})`, opacity: Math.min(1, c * 1.4) }}>
          <div style={{ position: "absolute", left: -18, right: -18, top: 6, bottom: 2, background: ACC, borderRadius: 14, transformOrigin: "left", transform: `scaleX(${bar})` }} />
          <div style={{ position: "relative", fontFamily: BEBAS, fontSize: 120, lineHeight: 1, color: bar > 0.5 ? "#06121A" : "white", letterSpacing: 2, padding: "0 6px" }}>
            {N("QAYSI UNIVERSITET?")}
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <Ecg start={4} len={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- FILM CARD: "Marvel — Thor: Ragnarok" ---------- */
export const FilmCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIO(dur);
  const pop = spring({ frame: f - 2, fps, config: { damping: 12 } });
  const clap = interpolate(f, [8, 13, 16], [-28, 0, -6], clamp);
  const clap2 = interpolate(f, [16, 19], [-6, 0], clamp);
  const title = interpolate(f, [10, 22], [0, 1], { ...clamp, easing: EASE });
  const sub = interpolate(f, [18, 30], [0, 1], { ...clamp, easing: EASE });
  const stars = [0, 1, 2, 3, 4];
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ ...glass, borderRadius: 34, padding: "30px 44px 30px 34px", display: "flex", alignItems: "center", gap: 34, transform: `scale(${0.85 + pop * 0.15}) translateY(${(1 - p) * 40}px)` }}>
        {/* clapperboard */}
        <svg width={150} height={140} viewBox="0 0 150 140" style={{ overflow: "visible" }}>
          <rect x={8} y={50} width={134} height={84} rx={10} fill="#0B0F17" stroke="white" strokeWidth={4} />
          <line x1={8} y1={78} x2={142} y2={78} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
          <line x1={8} y1={104} x2={142} y2={104} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
          <g transform={`rotate(${clap + clap2 * 0} 10 48)`}>
            <rect x={8} y={26} width={134} height={22} rx={5} fill="white" />
            {[0, 1, 2, 3, 4].map((i) => (
              <polygon key={i} points={`${18 + i * 26},26 ${34 + i * 26},26 ${26 + i * 26},48 ${10 + i * 26},48`} fill="#0B0F17" />
            ))}
          </g>
          <rect x={8} y={48} width={134} height={6} fill="white" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: ACC, opacity: sub }}>MARVEL · FILM</div>
          <div style={{ fontFamily: BEBAS, fontSize: 104, lineHeight: 0.95, color: "white", letterSpacing: 2, opacity: title, transform: `translateX(${(1 - title) * -30}px)` }}>THOR: RAGNAROK</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {stars.map((i) => {
              const s = spring({ frame: f - 22 - i * 3, fps, config: { damping: 10 } });
              return (
                <svg key={i} width={34} height={34} viewBox="0 0 24 24" style={{ transform: `scale(${s})` }}>
                  <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={i < 4 ? "#FFD24D" : "rgba(255,255,255,0.3)"} />
                </svg>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- small tag during the film clip ---------- */
export const ClipTag: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = useIO(dur, 10, 8);
  const blink = Math.floor(f / 15) % 2 === 0 ? 1 : 0.3;
  return (
    <div style={{ position: "absolute", top: 1770, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ ...glass, borderRadius: 999, padding: "14px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: "#FF4D5E", opacity: blink, boxShadow: "0 0 12px #FF4D5E" }} />
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "white", letterSpacing: 1 }}>{N("Film parchasi")}</span>
      </div>
    </div>
  );
};

/* ---------- XULOSA ---------- */
export const Xulosa: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIO(dur, 6, 6);
  const letters = N("XULOSA").split("");
  const line = interpolate(f, [10, 24], [0, 1], { ...clamp, easing: EASE });
  const q = spring({ frame: f - 14, fps, config: { damping: 8 } });
  return (
    <div style={{ position: "absolute", top: LOW - 10, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, textShadow: SHADOW }}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        {letters.map((ch, i) => {
          const s = spring({ frame: f - i * 2, fps, config: { damping: 12, stiffness: 200 } });
          return (
            <span key={i} style={{ display: "inline-block", fontFamily: BEBAS, fontSize: 200, lineHeight: 0.9, color: "white", letterSpacing: 4, transform: `translateY(${(1 - s) * 80}px)`, opacity: Math.min(1, s * 1.4) }}>
              {ch}
            </span>
          );
        })}
        <span style={{ display: "inline-block", fontFamily: BEBAS, fontSize: 200, lineHeight: 0.9, color: ACC, marginLeft: 8, transform: `scale(${q}) rotate(${(1 - q) * 30}deg)` }}>?</span>
      </div>
      <div style={{ width: 520, height: 10, borderRadius: 5, background: ACC, transformOrigin: "left", transform: `scaleX(${line})`, boxShadow: `0 0 18px ${ACC}`, marginTop: 6 }} />
    </div>
  );
};

/* ---------- LADDER: shifokor → yaxshi shifokor → yaxshi mutaxassis ---------- */
const ROWS = ["Shifokor", "Yaxshi shifokor", "Yaxshi mutaxassis"];
export const Ladder: React.FC<{ dur: number; at: number[] }> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIO(dur, 6, 6);
  return (
    <div style={{ position: "absolute", top: LOW - 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 16, alignItems: "flex-start" }}>
        {ROWS.map((r, i) => {
          const s = spring({ frame: f - at[i], fps, config: { damping: 14 } });
          const active = i === at.filter((x) => f >= x).length - 1;
          const check = interpolate(f, [at[i] + 6, at[i] + 14], [0, 1], clamp);
          return (
            <div key={r} style={{ ...glass, marginLeft: i * 70, borderRadius: 24, padding: "18px 30px 18px 20px", display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, s * 1.3), transform: `translateX(${(1 - s) * 120}px) scale(${active ? 1.04 : 0.97})`, borderColor: active ? ACC : "rgba(255,255,255,0.18)" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: active ? ACC : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={38} height={38} viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={active ? "#06121A" : "white"} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
                </svg>
              </div>
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 50, color: "white", opacity: active ? 1 : 0.75 }}>{N(r)}</span>
              <span style={{ fontFamily: BEBAS, fontSize: 44, color: ACC, marginLeft: 6, opacity: 0.9 }}>{"+".repeat(i + 1)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- END: subscribe over the university drone shot ---------- */
export const Subscribe: React.FC<{ dur: number; clickAt: number }> = ({ dur, clickAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - 6, fps, config: { damping: 13 } });
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [14, clickAt - 2], [220, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1470, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(inn, out), transform: `translateY(${(1 - inn) * 60}px)` }}>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? "rgba(20,24,34,0.55)" : "white", border: "2px solid white", backdropFilter: "blur(12px)", color: clicked ? "white" : "#111", borderRadius: 999, padding: "26px 62px", fontFamily: INTER, fontWeight: 800, fontSize: 52, whiteSpace: "nowrap", boxShadow: "0 14px 36px rgba(0,0,0,0.4)" }}>
          {clicked ? N("✓ Obuna bo‘ldingiz") : N("Obuna bo‘ling")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "50%", top: "50%", width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 2.2})` }} /> : null}
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 60 + cur, marginTop: 8, opacity: f < clickAt + 18 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
