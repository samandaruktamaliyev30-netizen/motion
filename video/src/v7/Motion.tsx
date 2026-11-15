import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconBell, IconBolt, IconBrain, IconCheck, IconSend, IconX } from "../reel/Icons";
import { LOW } from "./timeline";

// House look: white Inter, frosted dark glass. Accents taken from the video's own
// purple back-light (energy) + a red for "doesn't work" + Telegram blue.
const VIOLET = "#B98CFF";
const GOLD = "#FFD27A";
const RED = "#FF4D5E";
const TG = "#2AABEE";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.68), rgba(14,18,28,0.46))",
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

const Low: React.FC<{ dur: number; children: React.ReactNode; top?: number }> = ({ dur, children, top = LOW - 20 }) => {
  const p = useIO(dur);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})` }}>
      {children}
    </div>
  );
};

const Rise: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [delay, delay + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0 8px 10px" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - k) * 110}%)`, opacity: k, ...style }}>{children}</span>
    </span>
  );
};

/* ================= TRANSITIONS / PICTURES ================= */

// Zoom-blur punch in, light flash, slow push; quick zoom-blur out on the last frames.
const usePunch = (dur: number) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [dur - 5, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return {
    f,
    scale: 1.28 - 0.28 * inn + interpolate(f, [0, dur], [0, 0.07]) + out * 0.18,
    blur: (1 - inn) * 18 + out * 14,
    opacity: Math.min(interpolate(f, [0, 3], [0, 1], clamp), 1 - out * 0.9),
    flash: interpolate(f, [0, 2, 8], [0, 0.55, 0], clamp),
  };
};

const Flash: React.FC<{ v: number; color?: string }> = ({ v, color = "white" }) => (
  <AbsoluteFill style={{ background: color, opacity: v, mixBlendMode: "screen" }} />
);

// Full-bleed photo (wedding / energy). Blurred copy fills any gap.
export const Photo: React.FC<{ src: string; dur: number; glow?: boolean; origin?: string; tint?: string }> = ({ src, dur, glow, origin = "50% 45%", tint }) => {
  const p = usePunch(dur);
  const pulse = glow ? 0.5 + 0.5 * Math.sin(p.f * 0.25) : 0;
  return (
    <AbsoluteFill style={{ opacity: p.opacity, backgroundColor: "black" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 2040, objectFit: "cover", filter: "blur(40px) brightness(0.6)" }} />
      <AbsoluteFill style={{ transform: `scale(${p.scale})`, transformOrigin: origin, filter: `blur(${p.blur}px) ${glow ? `brightness(${1 + pulse * 0.15}) saturate(1.2)` : "contrast(1.05) saturate(1.08)"}` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {glow ? <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, rgba(185,140,255,${0.15 + pulse * 0.2}), transparent 55%)`, mixBlendMode: "screen" }} /> : null}
      {glow ? <Sparks /> : null}
      {tint ? <AbsoluteFill style={{ background: tint }} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <Flash v={p.flash} />
    </AbsoluteFill>
  );
};

const Sparks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => {
        const x = (i * 197) % 1080;
        const sp = 2 + (i % 5);
        const y = 1900 - ((f * sp * 3 + i * 271) % 2100);
        const s = 4 + (i % 4) * 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: i % 3 ? "white" : GOLD, boxShadow: `0 0 ${s * 3}px ${i % 3 ? VIOLET : GOLD}`, opacity: 0.4 + 0.6 * Math.abs(Math.sin(f * 0.2 + i)) }} />;
      })}
    </>
  );
};

// iPhone on a dark violet stage: floats in with a 3D turn, light sweep, model badge.
export const Phone: React.FC<{ dur: number; switchAt: number }> = ({ dur, switchAt }) => {
  const p = usePunch(dur);
  const { fps } = useVideoConfig();
  const f = p.f;
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 120 } });
  const rot = interpolate(f, [0, dur], [-18, 10]);
  const sweep = interpolate(f, [6, 40], [-30, 130], clamp);
  const pro17 = f >= switchAt;
  const flip = spring({ frame: f - switchAt, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ opacity: p.opacity, background: "radial-gradient(ellipse at 50% 38%, #3b2350 0%, #160d22 55%, #07050b 100%)" }}>
      <AbsoluteFill style={{ filter: `blur(${p.blur}px)`, transform: `scale(${p.scale * 0.97})` }}>
        <div style={{ position: "absolute", left: 140, top: 950, width: 800, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(185,140,255,0.45), transparent 70%)", filter: "blur(20px)" }} />
        <div style={{ position: "absolute", left: 90, top: 140, width: 900, perspective: 1600 }}>
          <div style={{ position: "relative", transform: `translateY(${(1 - s) * 300 + Math.sin(f * 0.12) * 10}px) rotateY(${rot}deg) rotateX(4deg)`, opacity: Math.min(1, s * 1.5) }}>
            <Img src={staticFile("v7/phone_cut.png")} style={{ width: 900, display: "block", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.6))" }} />
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${staticFile("v7/phone_cut.png")})`, WebkitMaskSize: "100% 100%", background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,255,255,0.35) ${sweep}%, transparent ${sweep + 12}%)` }} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "14px 38px", fontFamily: INTER, fontWeight: 800, fontSize: 54, color: "white", letterSpacing: -1, transform: `scale(${pro17 ? 0.85 + 0.15 * flip : s}) rotateX(${pro17 ? (1 - flip) * 90 : 0}deg)` }}>
          <span style={{ color: GOLD }}>{pro17 ? "17" : "18"}</span> Pro Max
        </div>
      </div>
      <Flash v={p.flash} />
    </AbsoluteFill>
  );
};

// Tired person B-roll: drained, cold grade + slow push.
export const Tired: React.FC<{ dur: number; trim: number }> = ({ dur, trim }) => {
  const p = usePunch(dur);
  return (
    <AbsoluteFill style={{ opacity: p.opacity, backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${p.scale})`, filter: `blur(${p.blur}px) saturate(0.6) contrast(1.05) brightness(0.92)` }}>
        <Video src={staticFile("v7/tired.mp4")} muted trimBefore={trim} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,30,60,0.18), rgba(10,15,30,0.35))" }} />
      <Flash v={p.flash * 0.6} />
    </AbsoluteFill>
  );
};

/* ================= MOTION INSERTS (below the chin) ================= */

/* "u sizlarda ISHLAMAYDI" — technique card gets a red stamp */
export const Fail: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: f - 9, fps, config: { damping: 9, stiffness: 220 } });
  const shake = f >= 9 && f < 17 ? Math.sin(f * 3) * (17 - f) * 1.4 : 0;
  return (
    <Low dur={dur}>
      <div style={{ position: "relative", transform: `translateX(${shake}px)` }}>
        <div style={{ ...glass, borderRadius: 36, padding: "26px 54px", display: "flex", alignItems: "center", gap: 22 }}>
          <IconBolt size={64} color={VIOLET} stroke={2.4} />
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 66, color: "white", letterSpacing: -1 }}>TEXNIKA</span>
        </div>
        <div style={{ position: "absolute", left: "50%", top: "62%", transform: `translate(-50%, 0) rotate(-8deg) scale(${2.4 - 1.4 * stamp})`, opacity: Math.min(1, stamp * 2), border: `5px solid ${RED}`, borderRadius: 18, padding: "6px 26px", background: "rgba(40,0,6,0.55)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <IconX size={50} color={RED} stroke={3.4} />
          <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 60, color: RED, letterSpacing: 1 }}>{N("ISHLAMAYDI")}</span>
        </div>
      </div>
    </Low>
  );
};

/* "Bilasizlarmi, NIMAGA?" */
export const Why: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = spring({ frame: f - 10, fps, config: { damping: 7, stiffness: 160 } });
  return (
    <Low dur={dur} top={LOW - 40}>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 52, color: "rgba(255,255,255,0.85)", textShadow: SHADOW }}>
        <Rise delay={0}>Bilasizlarmi,</Rise>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontFamily: INTER, fontWeight: 900, fontSize: 168, lineHeight: 1, color: "white", letterSpacing: -6, textShadow: SHADOW }}>
        {"NIMAGA".split("").map((c, i) => (
          <Rise key={i} delay={4 + i * 2}>{c}</Rise>
        ))}
        <span style={{ display: "inline-block", color: VIOLET, transform: `scale(${q}) rotate(${(1 - q) * -40 + Math.sin(f * 0.2) * 6}deg)`, textShadow: `0 0 40px ${VIOLET}` }}>?</span>
      </div>
    </Low>
  );
};

/* Two steps: energy + subconscious */
const Step: React.FC<{ n: number; label: string; icon: React.ReactNode; delay: number; doneAt: number }> = ({ n, label, icon, delay, doneAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: f - delay, fps, config: { damping: 15 } });
  const done = spring({ frame: f - doneAt, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ ...glass, width: 900, borderRadius: 34, padding: "20px 28px", display: "flex", alignItems: "center", gap: 22, opacity: k, transform: `translateX(${(1 - k) * -120}px)` }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: VIOLET, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: 40, color: "#160d22" }}>{n}</div>
      {icon}
      <span style={{ flex: 1, fontFamily: INTER, fontWeight: 700, fontSize: 46, color: "white" }}>{N(label)}</span>
      <div style={{ width: 62, height: 62, borderRadius: 31, background: "#3DDC84", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done})` }}>
        <IconCheck size={42} color="white" stroke={3.4} />
      </div>
    </div>
  );
};

export const Steps: React.FC<{ dur: number }> = ({ dur }) => (
  <Low dur={dur}>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Step n={1} label="Energiyani sozlash" icon={<IconBolt size={50} color={GOLD} stroke={2.4} />} delay={0} doneAt={14} />
      <Step n={2} label="Ong osti bilan ishlash" icon={<IconBrain size={50} color={VIOLET} stroke={2.2} />} delay={10} doneAt={34} />
    </div>
  </Low>
);

/* "qo'ygan MAQSADingizga erisha olasiz" — arrow hits the target */
export const Goal: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = spring({ frame: f, fps, config: { damping: 14 } });
  const fly = interpolate(f, [12, 24], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const hit = f >= 24;
  const wob = hit ? Math.sin((f - 24) * 1.4) * Math.max(0, 10 - (f - 24)) * 0.8 : 0;
  const wave = interpolate(f, [24, 44], [0, 1], clamp);
  const T = 300;
  return (
    <Low dur={dur} top={LOW - 50}>
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        <div style={{ position: "relative", width: T, height: T, transform: `scale(${ring})` }}>
          {[1, 0.74, 0.48, 0.22].map((r, i) => (
            <div key={i} style={{ position: "absolute", left: (T * (1 - r)) / 2, top: (T * (1 - r)) / 2, width: T * r, height: T * r, borderRadius: "50%", background: i % 2 ? "rgba(255,255,255,0.92)" : i === 3 ? RED : "rgba(185,140,255,0.92)", boxShadow: i === 0 ? "0 16px 40px rgba(0,0,0,0.45)" : undefined }} />
          ))}
          {hit ? <div style={{ position: "absolute", left: T / 2 - 60, top: T / 2 - 60, width: 120, height: 120, borderRadius: 60, border: `5px solid ${GOLD}`, opacity: 1 - wave, transform: `scale(${1 + wave * 2.4})` }} /> : null}
          {/* arrow */}
          <svg width={360} height={60} viewBox="0 0 360 60" style={{ position: "absolute", left: T / 2 - 8 + (1 - fly) * 700, top: T / 2 - 30 - (1 - fly) * 260, transform: `rotate(${-28 + wob}deg)`, transformOrigin: "0px 30px", opacity: f > 10 ? 1 : 0 }}>
            <path d="M0 30 L300 30" stroke="white" strokeWidth={9} strokeLinecap="round" />
            <path d="M0 30 L26 16 M0 30 L26 44" stroke="white" strokeWidth={9} strokeLinecap="round" />
            <path d="M300 30 L340 8 M300 30 L340 52 M280 30 L320 8 M280 30 L320 52" stroke={GOLD} strokeWidth={7} strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 96, lineHeight: 1, color: "white", letterSpacing: -3, textShadow: SHADOW }}>
            <Rise delay={4}>MAQSAD</Rise>
          </div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 50, color: hit ? GOLD : "white", textShadow: SHADOW }}>
            <Rise delay={22}>{N("erishasiz!")}</Rise>
          </div>
        </div>
      </div>
    </Low>
  );
};

/* "avval ENERGIYA → keyin TEXNIKA" */
export const Order: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 13 } });
  const line = interpolate(f, [4, 14], [0, 1], { ...clamp, easing: EASE });
  const b = spring({ frame: f - 11, fps, config: { damping: 11 } });
  const chip = (txt: string, sub: string, k: number, accent: string) => (
    <div style={{ ...glass, borderRadius: 30, padding: "14px 28px 18px", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${k})`, opacity: Math.min(1, k * 1.5) }}>
      <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.7)" }}>{sub}</span>
      <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 58, color: accent, letterSpacing: -1 }}>{txt}</span>
    </div>
  );
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {chip("ENERGIYA", "1. avval", a, GOLD)}
        <svg width={110} height={40} viewBox="0 0 110 40">
          <path d="M5 20 H95 M80 6 L98 20 L80 34" fill="none" stroke="white" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={160} strokeDashoffset={160 * (1 - line)} />
        </svg>
        {chip("TEXNIKA", "2. keyin", b, "white")}
      </div>
    </Low>
  );
};

/* Subscribe button with cursor click (+ optional Telegram pill) */
export const Subscribe: React.FC<{ dur: number; clickAt: number; telegram?: boolean }> = ({ dur, clickAt, telegram }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = useIO(dur, 10, telegram ? 7 : 1);
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [12, clickAt - 2], [240, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  const tg = spring({ frame: f - clickAt - 12, fps, config: { damping: 12 } });
  const btn = spring({ frame: f, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, opacity: inn, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ position: "relative", transform: `scale(${btn})` }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? "rgba(255,255,255,0.16)" : "white", border: "2px solid white", backdropFilter: "blur(10px)", color: clicked ? "white" : "#111", borderRadius: 999, padding: "26px 62px", fontFamily: INTER, fontWeight: 800, fontSize: 54, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16, boxShadow: clicked ? "0 14px 36px rgba(0,0,0,0.35)" : `0 0 ${30 + 20 * Math.sin(f * 0.3)}px rgba(185,140,255,0.8), 0 14px 36px rgba(0,0,0,0.35)` }}>
          {clicked ? <IconCheck size={50} color="white" stroke={3.2} /> : <IconBell size={50} color="#111" stroke={2.4} />}
          {clicked ? N("Obuna bo‘ldingiz") : N("Obuna bo‘lish")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 22, marginTop: -44, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} /> : null}
        <svg width={76} height={76} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 70 + cur, marginTop: 12 + cur * 0.4, opacity: f < clickAt + 20 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
      {telegram ? (
        <div style={{ borderRadius: 999, padding: "18px 40px", background: TG, display: "flex", alignItems: "center", gap: 16, transform: `scale(${tg})`, opacity: Math.min(1, tg * 1.5), boxShadow: "0 14px 36px rgba(42,171,238,0.45)" }}>
          <IconSend size={46} color="white" stroke={2.4} />
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "white" }}>Telegram kanal</span>
        </div>
      ) : null}
    </div>
  );
};
