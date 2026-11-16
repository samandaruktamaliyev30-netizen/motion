import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconCheck, IconSend } from "../reel/Icons";
import { at, LOW } from "./timeline";

const GOLD = "#F2C46D";
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

const useSpring = (delay: number, damping = 11, stiffness = 220) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};

export const HookFlash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [0, 7], [0.85, 0], clamp) }} />;
};

/* ---------- HOOK: "ARZON SMETA?" price tag -> "SHOSHILMANG!" ---------- */
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const B = at(2.06);
  const tag = useSpring(2, 9, 200);
  const q = useSpring(10, 8, 260);
  const swing = Math.sin(f / 5) * 6 * (1 - Math.min(1, f / 50));
  const price = Math.round(interpolate(f, [4, 26], [0, 50], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const p1 = interpolate(f, [B - 4, B], [1, 0], clamp);
  const stop = useSpring(B, 8, 260);
  const shake = f >= B && f < B + 10 ? Math.sin(f * 3.1) * 10 * (1 - (f - B) / 10) : 0;
  const out = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: LOW - 30, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
      {p1 > 0 ? (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", opacity: p1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ transform: `scale(${tag}) rotate(${-8 + swing}deg)`, transformOrigin: "20% 50%", background: GOLD, borderRadius: "18px 18px 18px 18px", padding: "16px 30px 16px 54px", position: "relative", boxShadow: "0 16px 34px rgba(0,0,0,0.4)" }}>
              <div style={{ position: "absolute", left: 18, top: "50%", width: 18, height: 18, marginTop: -9, borderRadius: 9, background: "rgba(14,18,28,0.85)" }} />
              <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 70, color: "#1a1408", letterSpacing: -1 }}>−{price}%</span>
            </div>
          </div>
          <div style={{ marginTop: 18, transform: `scale(${0.7 + 0.3 * q})`, opacity: Math.min(1, q * 1.4) }}>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 118, color: "white", letterSpacing: -3, textShadow: SHADOW }}>{N("Arzon smeta")}</span>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 118, color: RED, textShadow: SHADOW }}>?</span>
          </div>
        </div>
      ) : null}
      {f >= B ? (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", transform: `translateX(${shake}px)` }}>
          <div style={{ background: RED, borderRadius: 30, padding: "22px 46px", transform: `scale(${0.6 + 0.4 * stop}) rotate(${(1 - stop) * -10}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={80} height={80} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z" />
              <path d="M12 7.5v6M12 16.5v.2" />
            </svg>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 92, color: "white", letterSpacing: -2 }}>{N("SHOSHILMANG!")}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- price doubles after the work starts ---------- */
export const Double: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [at(10.06) - at(8.54), at(10.06) - at(8.54) + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const a = useSpring(2, 13, 180);
  const x2 = useSpring(at(10.06) - at(8.54) + 18, 8, 260);
  const H = 260;
  return (
    <Low dur={dur} top={LOW - 30}>
      <div style={{ ...glass, borderRadius: 40, padding: "28px 44px", display: "flex", alignItems: "flex-end", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 120, height: (H / 2) * a, borderRadius: 16, background: "rgba(255,255,255,0.85)" }} />
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.8)" }}>{N("smetada")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 120, height: (H / 2) * a + (H / 2) * grow, borderRadius: 16, background: `linear-gradient(180deg, ${RED}, ${GOLD})` }} />
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.8)" }}>{N("aslida")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingBottom: 46 }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, color: "white" }}>{N("Narx")}</span>
          <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: RED, letterSpacing: -4, display: "inline-block", transform: `scale(${x2})`, transformOrigin: "left bottom" }}>×2</span>
        </div>
      </div>
    </Low>
  );
};

/* ---------- 7+ years / 400+ projects (over the office team B-roll) ---------- */
const Stat: React.FC<{ to: number; from: number; label: string; delay: number }> = ({ to, from, label, delay }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [delay, delay + 26], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const s = useSpring(delay, 12, 200);
  const plus = useSpring(delay + 26, 8, 260);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 40}px)` }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 140, lineHeight: 0.95, color: "white", letterSpacing: -5, fontVariantNumeric: "tabular-nums" }}>{v}</span>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 120, color: GOLD, display: "inline-block", transform: `scale(${plus})` }}>+</span>
      </div>
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>{N(label)}</span>
    </div>
  );
};

export const Stats: React.FC<{ dur: number }> = ({ dur }) => {
  const line = interpolate(useCurrentFrame(), [at(14.18) - at(13.2) - 4, at(14.18) - at(13.2) + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <Low dur={dur}>
      <div style={{ ...glass, borderRadius: 40, padding: "30px 50px", display: "flex", alignItems: "center", gap: 44 }}>
        <Stat to={7} from={0} label="yil tajriba" delay={0} />
        <div style={{ width: 2, height: 170 * line, background: "rgba(255,255,255,0.3)" }} />
        <Stat to={400} from={0} label="loyiha topshirilgan" delay={at(14.18) - at(13.2)} />
      </div>
    </Low>
  );
};

/* ---------- process: concept -> visual -> project approval ---------- */
const STEPS = [
  { t: "Dizayn konsepsiya", at: 18.08, ok: 20.6 },
  { t: "Vizual ko‘rinish", at: 20.78, ok: 22.4 },
  { t: "Loyiha tasdiqlanadi", at: 22.74, ok: 24.6 },
];

export const Steps: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = at(18.08);
  return (
    <Low dur={dur} top={LOW - 20}>
      <div style={{ ...glass, width: 900, borderRadius: 40, padding: "28px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
        {STEPS.map((s, i) => {
          const a = spring({ frame: f - (at(s.at) - base), fps, config: { damping: 14, stiffness: 170 } });
          const ok = spring({ frame: f - (at(s.ok) - base), fps, config: { damping: 9, stiffness: 260 } });
          const active = f >= at(s.at) - base && f < at(s.ok) - base;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: 0.25 + 0.75 * a, transform: `translateX(${(1 - a) * -40}px)` }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: ok > 0.5 ? GREEN : active ? "white" : "transparent", border: "2.5px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {ok > 0.5 ? (
                  <span style={{ transform: `scale(${ok})`, display: "flex" }}><IconCheck size={42} color="#0b1a14" stroke={3.2} /></span>
                ) : (
                  <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 36, color: active ? "#111" : "white" }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 50, color: "white" }}>{N(s.t)}</span>
            </div>
          );
        })}
      </div>
    </Low>
  );
};

/* ---------- estimate checklist + "in the contract" stamp ---------- */
const ITEMS = [
  { t: "Usta ish haqi", at: 27.2 },
  { t: "Materiallar", at: 28.18 },
  { t: "Eng kichik chiqimlar", at: 29.82 },
];

export const Smeta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = at(25.24);
  const head = spring({ frame: f, fps, config: { damping: 13, stiffness: 180 } });
  const S = at(31.3) - base;
  const stamp = spring({ frame: f - S, fps, config: { damping: 10, stiffness: 300 } });
  return (
    <Low dur={dur} top={LOW - 20}>
      <div style={{ position: "relative" }}>
        <div style={{ ...glass, width: 860, borderRadius: 36, padding: "28px 36px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: head }}>
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
            </svg>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 56, color: "white" }}>{N("SMETA")}</span>
          </div>
          <div style={{ height: 1.5, background: "rgba(255,255,255,0.15)" }} />
          {ITEMS.map((it, i) => {
            const s = spring({ frame: f - (at(it.at) - base), fps, config: { damping: 12, stiffness: 220 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.2 + 0.8 * s, transform: `translateX(${(1 - s) * 30}px)` }}>
                <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, color: "white" }}>{N(it.t)}</span>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>
                  <IconCheck size={34} color="#0b1a14" stroke={3.2} />
                </div>
              </div>
            );
          })}
        </div>
        {f >= S ? (
          <div style={{ position: "absolute", right: -10, bottom: -50, transform: `rotate(-10deg) scale(${2.2 - 1.2 * stamp})`, opacity: Math.min(1, stamp * 2), border: `6px solid ${RED}`, borderRadius: 18, padding: "10px 24px", background: "rgba(255,255,255,0.92)", boxShadow: "0 14px 30px rgba(0,0,0,0.35)" }}>
            <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 40, color: RED, letterSpacing: 2, lineHeight: 1.05, textAlign: "center" }}>
              {N("SHARTNOMADA")}
              <br />
              {N("OSHMAYDI")}
            </div>
          </div>
        ) : null}
      </div>
    </Low>
  );
};

/* ---------- CTA: form + free measurement ---------- */
export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clickAt = at(38.3) - at(36.7);
  const inn = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: EASE });
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.92, 1], clamp);
  const cur = interpolate(f, [8, clickAt - 2], [220, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  const c1 = spring({ frame: f - (at(38.18) - at(36.7)), fps, config: { damping: 12, stiffness: 200 } });
  const c2 = spring({ frame: f - (at(39.26) - at(36.7)), fps, config: { damping: 12, stiffness: 200 } });
  const bob = Math.sin(f / 4) * 8;
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  const chip = (s: number, text: string) => (
    <div style={{ ...glass, borderRadius: 999, padding: "14px 28px", display: "flex", alignItems: "center", gap: 12, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: GOLD }} />
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38, color: "white" }}>{N(text)}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: inn * out, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? GREEN : "white", color: "#111", borderRadius: 999, padding: "26px 54px", fontFamily: INTER, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}>
          {clicked ? <IconCheck size={46} color="#111" stroke={3.2} /> : <IconSend size={44} color="#111" stroke={2.4} />}
          {clicked ? N("Ariza yuborildi") : N("Formani to‘ldiring")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 40, marginTop: -44, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} /> : null}
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 130 + cur, marginTop: 14, opacity: f < clickAt + 20 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {chip(c1, "Bepul o‘lchov")}
        {chip(c2, "Taxminiy smeta")}
      </div>
      <svg width={70} height={70} viewBox="0 0 24 24" style={{ transform: `translateY(${bob}px)`, opacity: 0.9 }}>
        <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
