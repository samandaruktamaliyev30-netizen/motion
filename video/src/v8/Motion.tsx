import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconCheck, IconSend } from "../reel/Icons";
import { LOW } from "./timeline";

// House look (white Inter, frosted glass, thin line art) + one hot accent for the hook.
const HOT = "#FFD23F";
const BLUE = "#4DA3FF";
const RED = "#FF4D5E";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.7), rgba(14,18,28,0.48))",
  backdropFilter: "blur(16px) saturate(1.3)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const outF = (f: number, dur: number, n = 6) => interpolate(f, [dur - n, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });

/* =================== HOOK (0–2.8 s) =================== */
const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 260, mass: 0.6 } });
  const shake = f >= at && f < at + 6 ? Math.sin((f - at) * 3.2) * (6 - (f - at)) * 2 : 0;
  return (
    <div style={{ opacity: f >= at ? Math.min(1, s * 2) : 0, transform: `translateX(${shake}px) scale(${2.2 - 1.2 * s})`, filter: `blur(${(1 - Math.min(1, s)) * 6}px)`, ...style }}>
      {children}
    </div>
  );
};

export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 6], [0.95, 0], clamp);
  const flip = interpolate(f, [2, 12], [-90, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const box = interpolate(f, [50, 58], [0, 100], { ...clamp, easing: EASE });
  const o = outF(f, dur, 6);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {/* calendar tile — top-left corner, clear of the face */}
      <div style={{ position: "absolute", left: 60, top: 260, perspective: 800 }}>
        <div style={{ width: 250, borderRadius: 30, overflow: "hidden", background: "white", boxShadow: "0 20px 50px rgba(0,0,0,0.45)", transform: `rotateX(${flip}deg)`, transformOrigin: "top center" }}>
          <div style={{ background: RED, color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 34, textAlign: "center", padding: "10px 0", letterSpacing: 3 }}>NOYABR</div>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 86, color: "#111", textAlign: "center", lineHeight: 1.2, padding: "6px 0 12px", letterSpacing: -2 }}>2026</div>
        </div>
      </div>
      {/* kinetic headline, below the chin */}
      <div style={{ position: "absolute", top: LOW - 10, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Slam at={10} style={{ fontFamily: INTER, fontWeight: 600, fontSize: 52, color: "rgba(255,255,255,0.92)", textShadow: SHADOW }}>{N("Noyabr oyida")}</Slam>
        <Slam at={18} style={{ fontFamily: INTER, fontWeight: 900, fontSize: 90, color: "white", letterSpacing: -3, textShadow: SHADOW, lineHeight: 1 }}>MILLIY SERTIFIKATDAN</Slam>
        <Slam at={38} style={{ fontFamily: INTER, fontWeight: 700, fontSize: 64, color: "white", textShadow: SHADOW }}>{N("qanday savollar")}</Slam>
        <div style={{ position: "relative", padding: "0 26px" }}>
          <div style={{ position: "absolute", inset: "6px 0", borderRadius: 18, background: HOT, clipPath: `inset(0 ${100 - box}% 0 0 round 18px)` }} />
          <Slam at={50} style={{ position: "relative", fontFamily: INTER, fontWeight: 900, fontSize: 110, color: "#111", letterSpacing: -3, lineHeight: 1.05 }}>{N("TUSHADI?")}</Slam>
        </div>
      </div>
      {/* "?" burst */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t = interpolate(f, [54, 80], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const ang = (i / 10) * Math.PI * 2;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(ang) * 420 * t - 25, top: LOW + 300 + Math.sin(ang) * 260 * t - 40, fontFamily: INTER, fontWeight: 900, fontSize: 70, color: i % 2 ? HOT : "white", opacity: t > 0 ? 1 - t : 0, transform: `rotate(${i * 36 + t * 90}deg)` }}>?</div>;
      })}
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* =================== TOP-3 teaser (locked rows) =================== */
export const Top3: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = outF(f, dur);
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ ...glass, width: 900, borderRadius: 40, padding: "28px 34px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: "white" }}>{N("Ehtimoli yuqori savollar")}</span>
          <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 36, color: "#111", background: HOT, borderRadius: 12, padding: "4px 14px" }}>TOP-3</span>
        </div>
        {[1, 2, 3].map((n, i) => {
          const s = spring({ frame: f - 6 - i * 7, fps, config: { damping: 15, stiffness: 180 } });
          const shimmer = ((f * 3 + i * 40) % 200) - 50;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderTop: i ? "1px solid rgba(255,255,255,0.12)" : "none", opacity: Math.min(1, s * 1.4), transform: `translateX(${(1 - s) * -80}px)` }}>
              <div style={{ width: 70, height: 70, borderRadius: 20, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: 40, color: "white" }}>{n}</div>
              <div style={{ position: "relative", flex: 1, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.16)", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shimmer}%`, width: "30%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
              </div>
              <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =================== question cards =================== */
const BigNum: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const fill = interpolate(f, [6, 16], [0, 1], { ...clamp, easing: EASE });
  const st: React.CSSProperties = { fontFamily: INTER, fontWeight: 900, fontSize: 210, lineHeight: 0.9, letterSpacing: -8 };
  return (
    <div style={{ position: "relative" }}>
      <div style={{ ...st, color: "transparent", WebkitTextStroke: "4px white" }}>{n}</div>
      <div style={{ ...st, position: "absolute", inset: 0, color: "white", clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>{n}</div>
    </div>
  );
};

const QCard: React.FC<{ dur: number; n: number; title: string; sub: string; art: React.ReactNode; children?: React.ReactNode }> = ({ dur, n, title, sub, art, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 13, stiffness: 150 } });
  const out = interpolate(f, [dur - 7, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", perspective: 1400, opacity: 1 - out, transform: `translateX(${-out * 160}px)` }}>
      <div style={{ ...glass, width: 940, borderRadius: 44, padding: "26px 30px", display: "flex", alignItems: "center", gap: 24, transform: `rotateX(${(1 - s) * -80}deg)`, transformOrigin: "top center" }}>
        <BigNum n={n} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: HOT }}>{n}-SAVOL</div>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 58, color: "white", lineHeight: 1.05, marginTop: 4 }}>{N(title)}</div>
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>{N(sub)}</div>
        </div>
        <div style={{ width: 210, height: 210, flexShrink: 0 }}>{art}</div>
      </div>
      {children}
    </div>
  );
};

const Electrolysis: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 210 210" width={210} height={210}>
      <path d="M30 60 V180 a12 12 0 0 0 12 12 H168 a12 12 0 0 0 12 -12 V60" fill="rgba(77,163,255,0.22)" stroke="white" strokeWidth={5} />
      <rect x="30" y="100" width="150" height="92" fill="rgba(77,163,255,0.35)" />
      <rect x="62" y="40" width="16" height="120" rx="4" fill="white" />
      <rect x="132" y="40" width="16" height="120" rx="4" fill="white" />
      <text x="70" y="30" textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={28} fill={RED}>+</text>
      <text x="140" y="30" textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={28} fill={BLUE}>−</text>
      {Array.from({ length: 8 }).map((_, i) => {
        const t = ((f + i * 7) % 40) / 40;
        const x = (i % 2 ? 140 : 70) + Math.sin((f + i * 11) * 0.3) * 6;
        return <circle key={i} cx={x} cy={180 - t * 80} r={4 + (i % 3)} fill="white" opacity={1 - t} />;
      })}
    </svg>
  );
};

const Kinetics: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [6, 40], [0, 1], { ...clamp, easing: EASE });
  return (
    <svg viewBox="0 0 210 210" width={210} height={210}>
      <path d="M30 20 V180 H195" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={4} strokeLinecap="round" />
      <path d="M32 40 C 70 46, 90 150, 190 168" fill="none" stroke={HOT} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d="M32 170 C 70 164, 90 60, 190 48" fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <circle cx="160" cy="58" r="30" fill="rgba(14,18,28,0.6)" stroke="white" strokeWidth={4} />
      <line x1="160" y1="58" x2={160 + Math.sin(f * 0.25) * 20} y2={58 - Math.cos(f * 0.25) * 20} stroke="white" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

const TestTube: React.FC = () => {
  const f = useCurrentFrame();
  const hue = (f * 4) % 360;
  return (
    <svg viewBox="0 0 210 210" width={210} height={210}>
      <path d="M80 20 V160 a25 25 0 0 0 50 0 V20" fill="none" stroke="white" strokeWidth={6} />
      <path d={`M83 ${90 + Math.sin(f * 0.2) * 3} Q105 ${84 + Math.sin(f * 0.2 + 1) * 4} 127 ${90 + Math.sin(f * 0.2 + 2) * 3} V160 a22 22 0 0 1 -44 0 Z`} fill={`hsla(${hue},85%,62%,0.85)`} />
      <text x="105" y="140" textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={48} fill="white">?</text>
      <circle cx="160" cy="70" r="26" fill="none" stroke="white" strokeWidth={5} />
      <line x1="178" y1="88" x2="198" y2="108" stroke="white" strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
};

export const Card1: React.FC<{ dur: number }> = ({ dur }) => <QCard dur={dur} n={1} title="Elektroliz" sub="albatta tushadi" art={<Electrolysis />} />;
export const Card2: React.FC<{ dur: number }> = ({ dur }) => <QCard dur={dur} n={2} title="Kimyoviy kinetika" sub="fikrlashga majbur qiladi" art={<Kinetics />} />;

const Chip: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 200 } });
  return (
    <div style={{ ...glass, borderRadius: 999, padding: "12px 24px", fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "white", opacity: f >= at ? Math.min(1, s * 1.5) : 0, transform: `scale(${0.6 + 0.4 * s})`, display: "flex", alignItems: "center", gap: 10 }}>
      <IconCheck size={30} color={HOT} stroke={3} />
      {N(text)}
    </div>
  );
};

export const Card3: React.FC<{ dur: number; chips: [string, number][] }> = ({ dur, chips }) => (
  <QCard dur={dur} n={3} title="Noma’lum moddani aniqlash" sub="har doimgidek tushadi" art={<TestTube />}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 22, maxWidth: 960 }}>
      {chips.map(([t, a]) => (
        <Chip key={t} text={t} at={a} />
      ))}
    </div>
  </QCard>
);

/* =================== difficulty meter =================== */
export const Hard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [4, 30], [0, 1], { ...clamp, easing: EASE });
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), outF(f, dur));
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
      <div style={{ ...glass, width: 900, borderRadius: 40, padding: "28px 34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: INTER, color: "white" }}>
          <span style={{ fontWeight: 800, fontSize: 44 }}>{N("Murakkablik darajasi")}</span>
          <span style={{ fontWeight: 900, fontSize: 44, color: lvl > 0.85 ? RED : HOT }}>{Math.round(lvl * 10)}/10</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const on = lvl * 10 > i;
            const c = i < 5 ? HOT : i < 8 ? "#FF9A3D" : RED;
            return <div key={i} style={{ flex: 1, height: 46, borderRadius: 10, background: on ? c : "rgba(255,255,255,0.14)", boxShadow: on ? `0 0 16px ${c}88` : "none" }} />;
          })}
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.85)", marginTop: 18 }}>{N("bolalarga har doim muammo tug‘diradi")}</div>
      </div>
    </div>
  );
};

/* =================== book: questions collected =================== */
export const Book: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), outF(f, dur));
  const book = spring({ frame: f - 30, fps, config: { damping: 13, stiffness: 120 } });
  const glow = 0.5 + 0.5 * Math.sin(f * 0.15);
  return (
    <div style={{ position: "absolute", top: LOW - 20, left: 0, right: 0, height: 560, opacity: o }}>
      {/* three cards fly into the book */}
      {[1, 2, 3].map((n, i) => {
        const t = interpolate(f, [4 + i * 6, 30 + i * 6], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
        const x0 = 140 + i * 280;
        return (
          <div key={n} style={{ position: "absolute", left: x0 + (540 - 80 - x0) * t, top: 20 + 200 * t, width: 160, height: 110, borderRadius: 20, ...glass, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: 60, color: "white", opacity: 1 - t, transform: `scale(${1 - t * 0.6}) rotate(${(i - 1) * 10 * (1 - t)}deg)` }}>{n}</div>
        );
      })}
      {/* the book */}
      <div style={{ position: "absolute", left: 540 - 190, top: 120, width: 380, height: 300, perspective: 1200, transform: `scale(${0.6 + 0.4 * book})`, opacity: Math.min(1, book * 1.5) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "16px 28px 28px 16px", background: "linear-gradient(135deg,#1E3A8A,#2F6BFF)", boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 ${60 * glow}px rgba(77,163,255,${0.5 * glow})`, transform: "rotateY(-18deg)", padding: "30px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "16px solid #14286B" }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "rgba(255,255,255,0.8)" }}>MILLIY SERTIFIKAT</div>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 64, color: "white", lineHeight: 1 }}>KIMYO</div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, color: HOT }}>{N("Eng qiyin savollar")}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 50, color: "white", textShadow: SHADOW, opacity: book }}>{N("Hammasi bitta kitobda")}</div>
    </div>
  );
};

/* =================== CTA: comment "3" =================== */
export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: EASE });
  const typed = f >= 26;
  const sent = f >= 46;
  const press = interpolate(f, [42, 45, 50], [1, 0.85, 1], clamp);
  const bubble = spring({ frame: f - 48, fps, config: { damping: 12, stiffness: 180 } });
  const three = spring({ frame: f - 6, fps, config: { damping: 9, stiffness: 160 } });
  const line2 = interpolate(f, [60, 72], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ position: "absolute", top: LOW - 30, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: inn, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: "white", textShadow: SHADOW, marginBottom: 14 }}>{N("Kitobni olmoqchimisiz?")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 200, lineHeight: 0.9, color: HOT, transform: `scale(${three}) rotate(${(1 - three) * -20}deg)`, textShadow: "0 10px 40px rgba(255,210,63,0.45)" }}>3</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 600 }}>
          {sent ? (
            <div style={{ alignSelf: "flex-end", background: "white", color: "#111", borderRadius: "28px 28px 8px 28px", padding: "14px 30px", fontFamily: INTER, fontWeight: 900, fontSize: 52, transform: `scale(${bubble})`, transformOrigin: "right bottom" }}>3</div>
          ) : null}
          <div style={{ ...glass, borderRadius: 999, padding: "14px 16px 14px 30px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ flex: 1, fontFamily: INTER, fontWeight: 600, fontSize: 38, color: typed && !sent ? "white" : "rgba(255,255,255,0.55)" }}>{typed && !sent ? "3" : N("Izoh qoldiring…")}{typed && !sent && f % 14 < 7 ? "|" : ""}</span>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: typed ? BLUE : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${press})` }}>
              <IconSend size={36} color="white" stroke={2.4} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, color: "rgba(255,255,255,0.9)", marginTop: 20, opacity: line2, transform: `translateY(${(1 - line2) * 12}px)`, textShadow: SHADOW }}>{N("Biz siz bilan bog‘lanamiz")}</div>
    </div>
  );
};
