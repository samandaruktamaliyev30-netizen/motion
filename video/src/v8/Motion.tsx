import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconCalendar, IconCheck, IconSend } from "../reel/Icons";
import { at, LOW } from "./timeline";

// House look: white Inter, frosted dark glass, thin line art; one warm accent (interior "sand/gold").
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

/* ---------- white flash on the very first frames ---------- */
export const HookFlash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [0, 7], [0.85, 0], clamp) }} />;
};

/* ---------- HOOK (0–5.5 s): budget meter -> quality -> "this video is for you" ---------- */
const Word: React.FC<{ text: string; delay: number; size: number; color?: string; weight?: number }> = ({ text, delay, size, color = "white", weight = 900 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 11, stiffness: 220 } });
  return (
    <span style={{ display: "inline-block", fontFamily: INTER, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: -2, color, textShadow: SHADOW, opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 50}px) scale(${0.7 + 0.3 * s})` }}>
      {N(text)}
    </span>
  );
};

export const BudgetHook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const B = at(2.78); // "hamda sifatli…"
  const C = at(4.4); // "unda bu video siz uchun"
  const out = interpolate(f, [dur - 5, dur], [1, 0], clamp);

  // phase 1: meter climbs into red, then gets capped
  const climb = interpolate(f, [at(0.4), at(1.9)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cap = interpolate(f, [at(2.0), at(2.4)], [0, 1], { ...clamp, easing: EASE });
  const level = climb * (1 - 0.42 * cap); // overshoots to 100 %, then held at budget line
  const p1 = interpolate(f, [B - 4, B], [1, 0], clamp);
  // phase 2: quality stars
  const p2 = Math.min(interpolate(f, [B, B + 6], [0, 1], clamp), interpolate(f, [C - 4, C], [1, 0], clamp));
  // phase 3: for you
  const p3 = interpolate(f, [C, C + 6], [0, 1], clamp);
  const arrow = spring({ frame: f - C - 6, fps, config: { damping: 9, stiffness: 200 } });
  const bob = Math.sin((f - C) / 4) * 8;

  return (
    <div style={{ position: "absolute", top: LOW - 10, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
      {/* 1 — BYUDJET */}
      {p1 > 0 ? (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", opacity: p1 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
            <Word text="REMONT" delay={0} size={64} weight={700} color="rgba(255,255,255,0.85)" />
            <Word text="vaqtida" delay={4} size={64} weight={700} color="rgba(255,255,255,0.85)" />
          </div>
          <div style={{ marginTop: 12 }}>
            <Word text="BYUDJET" delay={at(1.4)} size={150} />
          </div>
          <div style={{ ...glass, marginTop: 22, width: 820, height: 64, borderRadius: 32, padding: 8, position: "relative" }}>
            <div style={{ height: "100%", width: `${level * 100}%`, borderRadius: 26, background: `linear-gradient(90deg, ${GREEN}, ${GOLD} 55%, ${RED})`, backgroundSize: "820px 100%" }} />
            {/* budget line */}
            <div style={{ position: "absolute", left: "58%", top: -14, bottom: -14, width: 4, borderRadius: 2, background: "white", opacity: cap }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: 820, marginTop: 12, fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "white", textShadow: SHADOW }}>
            <span style={{ opacity: 0.75 }}>{N("reja")}</span>
            <span style={{ color: cap > 0.5 ? GREEN : RED, transform: `scale(${1 + 0.15 * Math.sin(cap * Math.PI)})` }}>
              {cap > 0.5 ? N("oshmaydi ✓") : `+${Math.round(climb * 60)}%`}
            </span>
          </div>
        </div>
      ) : null}

      {/* 2 — SIFAT */}
      {p2 > 0 ? (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", opacity: p2 }}>
          <Word text="+ SIFAT" delay={B} size={150} color={GOLD} />
          <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const s = spring({ frame: f - B - 6 - i * 3, fps, config: { damping: 10, stiffness: 240 } });
              return (
                <svg key={i} width={84} height={84} viewBox="0 0 24 24" style={{ transform: `scale(${s}) rotate(${(1 - s) * -90}deg)`, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}>
                  <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill={GOLD} />
                </svg>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 3 — BU VIDEO SIZ UCHUN */}
      {p3 > 0 ? (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", opacity: p3 }}>
          <div style={{ background: "white", borderRadius: 26, padding: "18px 40px", transform: `scale(${0.8 + 0.2 * spring({ frame: f - C, fps, config: { damping: 10, stiffness: 220 } })})`, boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }}>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 84, color: "#111", letterSpacing: -2 }}>{N("Bu video siz uchun")}</span>
          </div>
          <svg width={90} height={90} viewBox="0 0 24 24" style={{ marginTop: 18, opacity: arrow, transform: `translateY(${bob}px)` }}>
            <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- "2 yildan beri" badge over the office B-roll ---------- */
export const Team: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [4, 20], [0, 2], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const line = interpolate(f, [8, 26], [0, 1], { ...clamp, easing: EASE });
  return (
    <Low dur={dur}>
      <div style={{ ...glass, borderRadius: 40, padding: "26px 44px", display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 0.9, color: GOLD, letterSpacing: -6 }}>{n}</div>
        <div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 60, color: "white", lineHeight: 1 }}>{N("yildan beri")}</div>
          <div style={{ height: 3, width: 380 * line, background: GOLD, borderRadius: 2, margin: "14px 0" }} />
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, color: "rgba(255,255,255,0.85)" }}>{N("dizayn + remont")}</div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- contract card: deadline in the contract + estimate by your budget ---------- */
const Row: React.FC<{ title: string; sub: string; delay: number; icon: React.ReactNode }> = ({ title, sub, delay, icon }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 160 } });
  const tick = spring({ frame: f - delay - 12, fps, config: { damping: 9, stiffness: 260 } });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
      <div style={{ width: 92, height: 92, borderRadius: 26, border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "white", lineHeight: 1.1 }}>{N(title)}</div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{N(sub)}</div>
      </div>
      <div style={{ width: 66, height: 66, borderRadius: 33, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tick})` }}>
        <IconCheck size={40} color="#0b1a14" stroke={3.2} />
      </div>
    </div>
  );
};

export const Contract: React.FC<{ dur: number }> = ({ dur }) => (
  <Low dur={dur}>
    <div style={{ ...glass, width: 940, borderRadius: 40, padding: "30px 36px", display: "flex", flexDirection: "column", gap: 26 }}>
      <Row title="Muddat" sub="shartnomada belgilanadi" delay={4} icon={<IconCalendar size={54} color="white" stroke={1.8} />} />
      <div style={{ height: 1.5, background: "rgba(255,255,255,0.15)" }} />
      <Row
        title="Smeta"
        sub="byudjetingizga qarab"
        delay={at(16.06) - at(14.4)}
        icon={
          <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
          </svg>
        }
      />
    </div>
  </Low>
);

/* ---------- 3D + 360° project as a gift (over the VR B-roll) ---------- */
export const Gift360: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const deg = Math.round(interpolate(f, [2, 30], [0, 360], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const spin = interpolate(f, [0, dur], [0, 300]);
  const gift = spring({ frame: f - 30, fps, config: { damping: 9, stiffness: 220 } });
  const R = 120;
  const C = 2 * Math.PI * R;
  return (
    <Low dur={dur} top={LOW - 30}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", width: 2 * R + 40, height: 2 * R + 40 }}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="rgba(14,18,28,0.55)" stroke="rgba(255,255,255,0.18)" strokeWidth={14} />
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={GOLD} strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - deg / 360)} />
          </svg>
          {/* orbit ellipse = "360° view" */}
          <svg width={2 * R + 40} height={2 * R + 40} viewBox="-140 -140 280 280" style={{ position: "absolute" }}>
            <ellipse cx={0} cy={0} rx={92} ry={30} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={3} transform={`rotate(${-18})`} />
            <circle cx={92 * Math.cos((spin * Math.PI) / 180)} cy={30 * Math.sin((spin * Math.PI) / 180)} r={9} fill="white" transform="rotate(-18)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: 78, color: "white", letterSpacing: -2 }}>{deg}°</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 72, color: "white", lineHeight: 1, textShadow: SHADOW }}>{N("3D loyiha")}</div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.85)", textShadow: SHADOW }}>{N("360° ko‘rinishda")}</div>
          <div style={{ alignSelf: "flex-start", background: GOLD, borderRadius: 999, padding: "12px 28px", display: "flex", alignItems: "center", gap: 12, transform: `scale(${gift}) rotate(${(1 - gift) * -12}deg)`, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#1a1408" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="9" width="17" height="11.5" rx="1.5" />
              <path d="M2.5 9h19M12 9v11.5M12 9C10 5 6.5 5 6.5 7.2S10 9 12 9zM12 9c2-4 5.5-4 5.5-1.8S14 9 12 9z" />
            </svg>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 44, color: "#1a1408", letterSpacing: 2 }}>{N("SOVG‘A")}</span>
          </div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- CTA: fill the form below + free consultation ---------- */
export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clickAt = at(27.6) - at(26.2);
  const inn = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: EASE });
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.92, 1], clamp);
  const cur = interpolate(f, [8, clickAt - 2], [220, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  const chip = spring({ frame: f - (at(27.22) - at(26.2)), fps, config: { damping: 12, stiffness: 200 } });
  const bob = Math.sin(f / 4) * 8;
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: inn * out, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? GREEN : "white", color: "#111", borderRadius: 999, padding: "26px 54px", fontFamily: INTER, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}>
          {clicked ? <IconCheck size={46} color="#111" stroke={3.2} /> : <IconSend size={44} color="#111" stroke={2.4} />}
          {clicked ? N("Ariza yuborildi") : N("Formani to‘ldiring")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 40, marginTop: -44, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} /> : null}
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 90 + cur, marginTop: 10, opacity: f < clickAt + 20 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ ...glass, borderRadius: 999, padding: "14px 30px", display: "flex", alignItems: "center", gap: 12, opacity: chip, transform: `scale(${0.7 + 0.3 * chip})` }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: GOLD }} />
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, color: "white" }}>{N("Bepul konsultatsiya")}</span>
      </div>
      <svg width={70} height={70} viewBox="0 0 24 24" style={{ transform: `translateY(${bob}px)`, opacity: 0.9 }}>
        <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
