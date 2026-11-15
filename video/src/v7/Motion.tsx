import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconCheck, IconSend, IconUser, IconWarning } from "../reel/Icons";
import { LOW } from "./timeline";

// Look borrowed from the references (cream paper cards, coloured pill tags, a stamp),
// set on the house frosted-glass base. Everything lives below the chin.
const CREAM = "#F4ECDD";
const INK = "#17181C";
const GOLD = "#F2B544";
const VIOLET = "#8E7CFF";
const BLUE = "#4C8DF6";
const RED = "#E5484D";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CARD_SHADOW = "0 2px 0 rgba(255,255,255,0.6) inset, 0 18px 40px rgba(0,0,0,0.45)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.66), rgba(14,18,28,0.44))",
  backdropFilter: "blur(16px) saturate(1.3)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const useIO = (dur: number, inF = 9, outF = 7) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { ...clamp, easing: EASE }),
    interpolate(f, [dur - outF, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }),
  );
};

const Low: React.FC<{ dur: number; children: React.ReactNode; top?: number; gap?: number }> = ({ dur, children, top = LOW - 20, gap = 22 }) => {
  const p = useIO(dur);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + p * 0.06})` }}>
      {children}
    </div>
  );
};

const Pill: React.FC<{ color: string; children: React.ReactNode; s?: number; dark?: boolean }> = ({ color, children, s = 1, dark }) => (
  <div style={{ background: color, color: dark ? INK : "white", fontFamily: INTER, fontWeight: 700, fontSize: 30, padding: "8px 22px", borderRadius: 999, transform: `scale(${s})`, boxShadow: "0 8px 20px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
    {children}
  </div>
);

const Pop: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 170 } });
  return <div style={{ transform: `scale(${s}) translateY(${(1 - s) * 30}px)`, opacity: Math.min(1, s * 1.5), ...style }}>{children}</div>;
};

/* ---------- 1. title: NEGA BIZNES / YAXŞI / RIVOJLANMAYDI (0–3.2 s) ---------- */
export const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const outAt = dur - 10; // ≈ 2.87 s; gone by 3.2 s
  const lines = [
    { t: "NEGA BIZNES", size: 104, d: 2 },
    { t: N("YAXSHI"), size: 128, d: 7, accent: true },
    { t: "RIVOJLANMAYDI", size: 104, d: 12 },
  ];
  const back = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [outAt + 2, dur], [1, 0], clamp));
  const shine = interpolate(f, [18, 40], [-30, 130], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: LOW - 140, height: 1920 - LOW + 140, background: "linear-gradient(180deg, transparent, rgba(5,8,14,0.55) 30%, rgba(5,8,14,0.7))", opacity: back }} />
      <div style={{ position: "absolute", top: LOW - 30, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((l, i) => {
          const k = interpolate(f, [l.d, l.d + 12], [0, 1], { ...clamp, easing: EASE });
          // exit: each line whips sideways with motion blur, staggered
          const o = interpolate(f, [outAt + i * 2, outAt + i * 2 + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          const dir = i % 2 === 0 ? -1 : 1;
          const hl = interpolate(f, [l.d + 6, l.d + 16], [0, 1], { ...clamp, easing: EASE });
          return (
            <div key={i} style={{ position: "relative", overflow: "hidden", padding: "4px 26px 10px" }}>
              {l.accent ? (
                <div style={{ position: "absolute", left: 10, right: 10, top: 14, bottom: 14, background: GOLD, borderRadius: 18, transformOrigin: "left center", transform: `scaleX(${hl * (1 - o)}) skewX(-6deg)` }} />
              ) : null}
              <div
                style={{
                  position: "relative",
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontSize: l.size,
                  lineHeight: 1.0,
                  letterSpacing: -2,
                  color: l.accent ? INK : "white",
                  textShadow: l.accent ? "none" : "0 6px 24px rgba(0,0,0,0.55)",
                  transform: `translateY(${(1 - k) * 110}%) translateX(${o * dir * 900}px) skewX(${o * dir * -12}deg)`,
                  filter: `blur(${(1 - k) * 8 + o * 14}px)`,
                  opacity: k * (1 - o * 0.9),
                }}
              >
                {l.t}
              </div>
              {!l.accent ? (
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", transform: "skewX(-20deg)", mixBlendMode: "overlay", opacity: 1 - o }} />
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- node card used by the org charts ---------- */
const Node: React.FC<{ label: string; boss?: boolean; w?: number; children?: React.ReactNode }> = ({ label, boss, w = 170, children }) => (
  <div style={{ position: "relative", width: w, padding: "16px 0 14px", background: boss ? CREAM : "rgba(255,255,255,0.12)", border: boss ? "none" : "1.5px solid rgba(255,255,255,0.25)", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: boss ? CARD_SHADOW : "none", backdropFilter: "blur(10px)" }}>
    <IconUser size={boss ? 58 : 46} color={boss ? INK : "white"} stroke={2.2} />
    <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: boss ? 32 : 26, color: boss ? INK : "white" }}>{label}</div>
    {children}
  </div>
);

/* ---------- 2. "hamma qarorni o'zi qabul qiladi" ---------- */
export const Org: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const xs = [-330, -110, 110, 330];
  const flow = (f * 3) % 40;
  const pulse = 1 + Math.max(0, Math.sin((f - 30) * 0.35)) * 0.05 * (f > 30 ? 1 : 0);
  return (
    <Low dur={dur} gap={0}>
      <div style={{ ...glass, borderRadius: 36, width: 960, height: 520, position: "relative" }}>
        <div style={{ position: "absolute", top: 26, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pop delay={2}>
            <div style={{ transform: `scale(${pulse})` }}>
              <Node label="Rahbar" boss w={210}>
                <div style={{ position: "absolute", top: -14, right: -16 }}>
                  <Pop delay={30}><Pill color={RED}>{N("100% qaror")}</Pill></Pop>
                </div>
              </Node>
            </div>
          </Pop>
        </div>
        <svg width={960} height={520} style={{ position: "absolute", inset: 0 }}>
          {xs.map((x, i) => {
            const k = interpolate(f, [10 + i * 3, 22 + i * 3], [0, 1], { ...clamp, easing: EASE });
            const x1 = 480 + x, y1 = 330, x2 = 480 + x * 0.18, y2 = 200;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke="rgba(255,255,255,0.28)" strokeWidth={4} strokeLinecap="round" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 30" strokeDashoffset={flow} opacity={k} />
                {k >= 1 ? <circle cx={x1 + (x2 - x1) * (((f * 0.04) + i * 0.25) % 1)} cy={y1 + (y2 - y1) * (((f * 0.04) + i * 0.25) % 1)} r={7} fill={GOLD} /> : null}
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 50 }}>
          {xs.map((_, i) => (
            <Pop key={i} delay={6 + i * 3}>
              <Node label="Xodim" w={170}>
                <div style={{ position: "absolute", top: -22, right: -10 }}>
                  <Pop delay={20 + i * 4}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: VIOLET, color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }}>?</div>
                  </Pop>
                </div>
              </Node>
            </Pop>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <Pop delay={14}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 52, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
            {N("Hamma qaror — ")}<span style={{ color: GOLD }}>{N("rahbarda")}</span>
          </div>
        </Pop>
      </div>
    </Low>
  );
};

/* ---------- 3. problem goes up to the boss again ---------- */
export const Escalate: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const travel = interpolate(f, [18, 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const count = f < 40 ? 0 : f < 52 ? 1 : f < 62 ? 3 : 9;
  const shake = f > 40 && f < 70 ? Math.sin(f * 2.2) * 5 : 0;
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative", width: 900, justifyContent: "space-between" }}>
        <Pop delay={0}>
          <div style={{ width: 300, background: CREAM, borderRadius: 28, padding: "26px 0 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: CARD_SHADOW }}>
            <Pill color={VIOLET}>Xodim</Pill>
            <IconWarning size={78} color={RED} stroke={2.4} />
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: INK }}>Muammo</div>
          </div>
        </Pop>
        <div style={{ position: "absolute", left: 300, right: 300, top: "50%", height: 6, marginTop: -3, background: "rgba(255,255,255,0.18)", borderRadius: 3 }}>
          <div style={{ width: `${travel * 100}%`, height: "100%", background: GOLD, borderRadius: 3 }} />
          <div style={{ position: "absolute", left: `${travel * 100}%`, top: -27, marginLeft: -30, width: 60, height: 60, borderRadius: 30, background: RED, display: "flex", alignItems: "center", justifyContent: "center", opacity: travel > 0 && travel < 1 ? 1 : 0, boxShadow: "0 0 30px rgba(229,72,77,0.8)" }}>
            <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 36, color: "white" }}>!</span>
          </div>
        </div>
        <Pop delay={6}>
          <div style={{ position: "relative", transform: `translateX(${shake}px)`, width: 300, background: CREAM, borderRadius: 28, padding: "26px 0 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: CARD_SHADOW }}>
            <Pill color={BLUE}>Rahbar</Pill>
            <IconUser size={78} color={INK} stroke={2.2} />
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: INK }}>{N("Yana menga")}</div>
            {count > 0 ? (
              <div key={count} style={{ position: "absolute", top: -22, right: -22, minWidth: 64, height: 64, borderRadius: 32, background: RED, color: "white", fontFamily: INTER, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.4)", transform: `scale(${interpolate(f % 12, [0, 4, 10], [1.35, 0.95, 1], clamp)})` }}>
                {count > 5 ? "9+" : count}
              </div>
            ) : null}
          </div>
        </Pop>
      </div>
    </Low>
  );
};

/* ---------- 4. "juda ko'p bizneslar mana shu tartibda ishlaydi" ---------- */
const Shop: React.FC<{ color: string }> = ({ color }) => (
  <svg width={92} height={92} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
    <path d="M5 13v7h14v-7" />
    <path d="M10 20v-4h4v4" />
  </svg>
);
export const Many: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const n = 12;
  return (
    <Low dur={dur}>
      <div style={{ ...glass, borderRadius: 34, padding: "28px 36px", display: "grid", gridTemplateColumns: "repeat(6, 110px)", gap: 14 }}>
        {Array.from({ length: n }).map((_, i) => {
          const on = interpolate(f, [4 + i * 2.2, 10 + i * 2.2], [0, 1], { ...clamp, easing: EASE });
          const warn = i % 5 !== 4; // most of them — not all
          return (
            <div key={i} style={{ position: "relative", height: 110, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, background: on ? `rgba(242,181,68,${0.08 + on * 0.1})` : "transparent", transform: `scale(${0.6 + on * 0.4})`, opacity: 0.25 + on * 0.75 }}>
              <Shop color={warn ? GOLD : "rgba(255,255,255,0.7)"} />
              {warn ? <div style={{ position: "absolute", top: 4, right: 6, width: 22, height: 22, borderRadius: 11, background: RED, opacity: on, transform: `scale(${on})` }} /> : null}
            </div>
          );
        })}
      </div>
      <Pop delay={10}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 84, color: "white", letterSpacing: -1.5, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>
            {N("JUDA KO‘P")} <span style={{ color: GOLD }}>BIZNES</span>
          </div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, color: "rgba(255,255,255,0.85)" }}>{N("mana shu tartibda ishlaydi")}</div>
        </div>
      </Pop>
    </Low>
  );
};

/* ---------- 5. the guide ("qo'llanma tayyorladim") ---------- */
export const Guide: React.FC<{ dur: number; stampAt: number }> = ({ dur, stampAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: f, fps, config: { damping: 16, stiffness: 120 } });
  const tilt = interpolate(f, [0, dur], [-16, -6]);
  const float = Math.sin(f * 0.08) * 6;
  const st = spring({ frame: f - stampAt, fps, config: { damping: 9, stiffness: 260 } });
  const shine = interpolate(f, [14, 44], [-60, 160], clamp);
  return (
    <Low dur={dur} gap={18}>
      <div style={{ perspective: 1400 }}>
        <div style={{ position: "relative", width: 470, height: 560, transform: `translateY(${(1 - rise) * 260 + float}px) rotateY(${tilt}deg) rotateX(4deg)`, transformStyle: "preserve-3d" }}>
          {/* pages */}
          <div style={{ position: "absolute", inset: "10px -14px 6px 14px", background: "#E8DFCD", borderRadius: 16, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", inset: "5px -7px 3px 7px", background: "#EFE6D6", borderRadius: 16 }} />
          {/* cover */}
          <div style={{ position: "absolute", inset: 0, background: CREAM, borderRadius: 16, overflow: "hidden", padding: "40px 40px", display: "flex", flexDirection: "column", gap: 18, boxShadow: CARD_SHADOW }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: "linear-gradient(90deg, rgba(0,0,0,0.12), transparent)" }} />
            <div style={{ alignSelf: "flex-start" }}><Pill color={VIOLET}>{N("Qo‘llanma")}</Pill></div>
            <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: INK, letterSpacing: -1.2, marginTop: 6 }}>
              {N("XODIMLARNI")}<br />{N("TO‘G‘RI")}<br /><span style={{ color: BLUE }}>{N("BOSHQARISH")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
              {[0.9, 0.75, 0.82].map((w, i) => (
                <div key={i} style={{ height: 12, width: `${w * interpolate(f, [16 + i * 5, 30 + i * 5], [0, 100], { ...clamp, easing: EASE })}%`, background: "rgba(23,24,28,0.15)", borderRadius: 6 }} />
              ))}
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "30%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-18deg)" }} />
          </div>
          {/* stamp */}
          <div style={{ position: "absolute", right: -40, bottom: 40, transform: `rotate(-12deg) scale(${f >= stampAt ? 2.2 - st * 1.2 : 0})`, opacity: f >= stampAt ? Math.min(1, st * 2) : 0 }}>
            <div style={{ border: `6px solid ${RED}`, color: RED, borderRadius: 16, padding: "8px 22px", fontFamily: INTER, fontWeight: 900, fontSize: 54, letterSpacing: 2, background: "rgba(244,236,221,0.85)", display: "flex", alignItems: "center", gap: 10 }}>
              <IconCheck size={48} color={RED} stroke={3.4} />
              TAYYOR
            </div>
          </div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- 6. CTA: comment "3", free guide ---------- */
export const Cta: React.FC<{ dur: number; sendAt: number; freeAt: number }> = ({ dur, sendAt, freeAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = f >= 16;
  const caret = Math.floor(f / 8) % 2 === 0;
  const sent = f >= sendAt;
  const press = interpolate(f, [sendAt - 3, sendAt, sendAt + 6], [1, 0.85, 1], clamp);
  const fly = interpolate(f, [sendAt, sendAt + 12], [0, 1], { ...clamp, easing: EASE });
  const free = spring({ frame: f - freeAt, fps, config: { damping: 10, stiffness: 200 } });
  const keyPop = interpolate(f, [16, 19, 24], [1.6, 0.9, 1], clamp);
  return (
    <Low dur={dur + 10} gap={20}>
      <Pop delay={0}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
          {N("Kommentariyaga yozing")}
        </div>
      </Pop>
      {/* sent comment */}
      <div style={{ height: sent ? 104 : 0, opacity: fly, transform: `translateY(${(1 - fly) * 60}px)`, overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: CREAM, borderRadius: 26, padding: "16px 26px", boxShadow: CARD_SHADOW }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})` }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, color: "rgba(23,24,28,0.55)" }}>siz · hozir</div>
            <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 40, color: INK, lineHeight: 1 }}>3</div>
          </div>
        </div>
      </div>
      {/* input */}
      <Pop delay={4}>
        <div style={{ ...glass, display: "flex", alignItems: "center", gap: 18, width: 760, borderRadius: 999, padding: "14px 16px 14px 34px" }}>
          <div style={{ flex: 1, fontFamily: INTER, fontWeight: 700, fontSize: 48, color: "white", display: "flex", alignItems: "center", height: 70 }}>
            {typed && !sent ? <span style={{ display: "inline-block", transform: `scale(${keyPop})` }}>3</span> : null}
            {!typed || sent ? <span style={{ fontWeight: 500, fontSize: 36, color: "rgba(255,255,255,0.5)" }}>{N("Izoh qo‘shing...")}</span> : null}
            <span style={{ width: 3, height: 46, marginLeft: 4, background: "white", opacity: caret && !sent ? 1 : 0 }} />
          </div>
          <div style={{ width: 82, height: 82, borderRadius: 41, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${press})` }}>
            <IconSend size={42} color={INK} stroke={2.4} />
          </div>
        </div>
      </Pop>
      <div style={{ transform: `scale(${f >= freeAt ? free : 0}) rotate(${(1 - free) * -8}deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: GOLD, borderRadius: 999, padding: "14px 34px", boxShadow: "0 0 40px rgba(242,181,68,0.55), 0 14px 30px rgba(0,0,0,0.4)" }}>
          <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 52, color: INK, letterSpacing: 1 }}>BEPUL</span>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: INK }}>{N("qo‘llanma sizga")}</span>
        </div>
      </div>
    </Low>
  );
};
