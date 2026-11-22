import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { CLIPS, DURATION, SEGS } from "./clips";
import {
  BLUE, big, Chip, clamp, Confetti, EASE, fmt, FullCard, GOLD, glass, INTER, Item, Money, N, NAVY, NumCard,
  ORANGE, DARK_BG, CREAM, MUTED, GOLD2, DevicePhoto, Rays, Rise, SHADOW, Slam, Stack, useSpring, W,
} from "./ui";

// "SMM Start" — YouTube 16:9 edit after the references: wide/close jump framing on every cut,
// full-screen navy motion cards, lower-left keyword chips, animated numbers.
// No subtitles (only keywords), no music, NO colour grade — footage stays exactly as shot.
const F = (p: string) => staticFile(`v12/${p}`);
export const SMM_DURATION = DURATION;

/* ---------- source seconds → output frame (pauses removed) ---------- */
const T = (sec: number) => {
  const sf = Math.round(sec * 30);
  for (const [sa, sb, o] of CLIPS) {
    if (sf < sa) return o;
    if (sf < sb) return o + sf - sa;
  }
  return DURATION;
};

/* ---------- camera: wide / medium / close on every cut ---------- */
// Face (measured on the source): centre x≈1005, y≈470, chin≈545.
const FOCUS = { x: 1005, y: 470 };
const SHOT = {
  W: { s: 1.0, x: 1005, y: 470 },
  M: { s: 1.35, x: 960, y: 440 },
  C: { s: 1.7, x: 960, y: 420 },
  // speaker pushed to the right third while a side panel is on screen (left 2/3 free)
  R: { s: 1.4, x: 1380, y: 440 },
  R2: { s: 1.6, x: 1490, y: 420 },
};
type Shot = keyof typeof SHOT;
const PATTERN: Shot[] = ["C", "W", "M", "C", "W", "C", "M", "W"];
const CUTS: number[] = (() => {
  const pts = [...CLIPS.map((c) => c[2]), ...SEGS.map((s) => T(s))].sort((a, b) => a - b);
  const out: number[] = [];
  for (const p of pts) if (!out.length || p - out[out.length - 1] >= 40) out.push(p);
  return out;
})();
// While a side panel / chip is on screen the speaker is framed on the right third.
const BUSY: [number, number][] = [];

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  let i = 0;
  while (i + 1 < CUTS.length && CUTS[i + 1] <= f) i++;
  const a = CUTS[i];
  const b = CUTS[i + 1] ?? DURATION;
  const busy = BUSY.some(([x, y]) => f >= x && f < y);
  const k: Shot = busy ? (i % 2 ? "R2" : "R") : PATTERN[i % PATTERN.length];
  const sh = SHOT[k];
  const push = interpolate(f, [a, b], [0, 0.025], clamp);
  const punch = interpolate(f, [a, a + 6], [0.025, 0], { ...clamp, easing: EASE });
  const s = sh.s * (1 + push + punch);
  const tx = sh.x - FOCUS.x * s;
  const ty = sh.y - FOCUS.y * s;
  return <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>{children}</AbsoluteFill>;
};

/* ---------- sequencing helpers ---------- */
type Ev = { a: number; b: number; render: (dur: number, r: (sec: number) => number) => React.ReactNode; name: string; sfx?: string; busy?: boolean };
const ev = (name: string, a: number, b: number, render: Ev["render"], sfx?: string, busy?: boolean): Ev => ({ name, a, b, render, sfx, busy });

/* =================== cards =================== */
// 0:00 — "17 Pro Max va MacBook Neo'ni qanday qilib yutib olish mumkin?"
const HookCard: React.FC<{ dur: number; r: (s: number) => number }> = ({ dur, r }) => {
  const f = useCurrentFrame();
  const ps = useSpring(0, { damping: 14, stiffness: 110, mass: 0.9 });
  const ls = useSpring(r(1.05), { damping: 15, stiffness: 110, mass: 0.9 });
  const lOn = f >= r(1.05);
  const float = Math.sin(f * 0.09) * 8;
  const zoom = interpolate(f, [0, dur], [1, 1.07]);
  const q1 = r(2.1);
  const q2 = r(2.5);
  // phone alone in the centre first, then slides left when the laptop arrives
  const phoneX = interpolate(ls, [0, 1], [960 - 345, 150]);
  return (
    <FullCard dur={dur} bg={DARK_BG} bloom={ORANGE}>
      <Rays color={ORANGE} opacity={0.16} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: "absolute", left: phoneX, top: 150 + float + (1 - ps) * 900, transform: `rotate(${(1 - ps) * -18}deg) scale(${0.8 + 0.2 * ps})`, opacity: Math.min(1, ps * 2) }}>
          <DevicePhoto kind="phone" h={800} />
        </div>
        {lOn && (
          <div style={{ position: "absolute", left: 1140 + (1 - ls) * 900, top: 140 - float * 0.6, transform: `rotate(${(1 - ls) * 14}deg)`, opacity: Math.min(1, ls * 2) }}>
            <DevicePhoto kind="laptop" h={840} />
          </div>
        )}
        {lOn && <Slam at={r(1.05) + 4} style={{ position: "absolute", left: 960 - 30, top: 480, ...big(170, GOLD) }}>+</Slam>}
        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 40, opacity: interpolate(f, [q1 - 6, q1], [1, 0], clamp) }}><Slam at={2} style={big(80)}>17 PRO MAX</Slam></div>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
          <Slam at={q1} style={big(110)}>{N("QANDAY QILIB")}</Slam>
          <Slam at={q2} style={big(110, GOLD)}>{N("YUTIB OLISH")}</Slam>
          <Slam at={q2 + 6} style={big(110)}>{N("MUMKIN?")}</Slam>
        </div>
        <Confetti at={q2} cy={420} />
      </AbsoluteFill>
    </FullCard>
  );
};

// "Videoni oxirigacha ko'ring" — YouTube-like progress bar racing to the end.
const WatchBar: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, dur - 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  const inn = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 190, opacity: inn * out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
        <div style={{ width: 0, height: 0, borderTop: "20px solid transparent", borderBottom: "20px solid transparent", borderLeft: "32px solid white" }} />
        <Rise at={2} style={{ fontFamily: INTER, fontWeight: 900, fontSize: 52, color: CREAM, textShadow: SHADOW }}>{N("Videoni oxirigacha ko‘ring")}</Rise>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.3)" }}>
        <div style={{ position: "relative", width: `${p * 100}%`, height: 10, borderRadius: 5, background: "#FF2A3A" }}>
          <div style={{ position: "absolute", right: -13, top: -8, width: 26, height: 26, borderRadius: 13, background: "#FF2A3A", boxShadow: "0 0 18px rgba(255,42,58,0.9)" }} />
        </div>
      </div>
    </div>
  );
};

// Credit → more income: line chart drawing up.
const IncomeCard: React.FC<{ dur: number; r: (s: number) => number }> = ({ dur, r }) => {
  const f = useCurrentFrame();
  const t1 = r(10.3);
  const draw = interpolate(f, [t1, t1 + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pts = "M 360 820 L 600 760 L 780 790 L 980 640 L 1160 670 L 1360 470 L 1560 300";
  return (
    <FullCard dur={dur}>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        <Slam at={0} style={big(150, MUTED)}>{N("KREDIT")}</Slam>
        <Slam at={r(9.1)} style={big(150)}>{N("TEZROQ YOPISH")}</Slam>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d={pts} fill="none" stroke={GOLD} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 18px ${GOLD})` }} />
        {draw > 0.98 && <circle cx="1560" cy="300" r="20" fill={GOLD} />}
      </svg>
      {f >= t1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", gap: 28 }}>
          <Slam at={t1} style={big(130, GOLD)}>{N("KO‘PROQ")}</Slam>
          <Slam at={t1 + 8} style={big(130)}>DAROMAD</Slam>
        </div>
      )}
      {[0, 1, 2, 3, 4].map((i) => {
        const st = t1 + 10 + i * 6;
        const y = interpolate(f, [st, st + 50], [1100, 200 + i * 40], { ...clamp, easing: Easing.out(Easing.quad) });
        return f >= st ? <div key={i} style={{ position: "absolute", left: 420 + i * 260, top: y, width: 80, height: 80, color: GOLD, opacity: interpolate(f, [st + 30, st + 50], [1, 0], clamp) }}>{W("dollar")}</div> : null;
      })}
    </FullCard>
  );
};

// Generic kinetic statement card (word by word).
const WordsCard: React.FC<{ dur: number; words: { t: string; at: number; gold?: boolean; size?: number }[]; icon?: React.ReactNode }> = ({ dur, words, icon }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, dur], [1, 1.08]);
  return (
    <FullCard dur={dur} bloom={GOLD}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${zoom})` }}>
        {icon && <Slam at={0} style={{ width: 130, height: 130, marginBottom: 30 }}>{icon}</Slam>}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 36px", maxWidth: 1600 }}>
          {words.map((w, i) => <Slam key={i} at={w.at} style={big(w.size ?? 210, w.gold ? GOLD : CREAM)}>{N(w.t)}</Slam>)}
        </div>
      </AbsoluteFill>
    </FullCard>
  );
};

// "SMM" with orbiting social icons.
const SmmCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const icons = ["heart", "camera", "video", "users", "target", "up"] as const;
  return (
    <FullCard dur={dur} bloom={BLUE}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Slam at={0} from={3} style={big(360)}>SMM</Slam>
        <Rise at={10} style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, letterSpacing: 14, color: GOLD }}>{N("SOHASI HAQIDA")}</Rise>
      </AbsoluteFill>
      {icons.map((k, i) => {
        const s = interpolate(f, [4 + i * 3, 16 + i * 3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
        const a = (i / icons.length) * Math.PI * 2 + f * 0.025;
        return (
          <div key={k} style={{ position: "absolute", left: 960 + Math.cos(a) * 560 - 55, top: 520 + Math.sin(a) * 340 - 55, width: 110, height: 110, borderRadius: 32, ...glass, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>
            <div style={{ width: 60, height: 60 }}>{W(k)}</div>
          </div>
        );
      })}
    </FullCard>
  );
};

// 1 000 000 subscribers counter + filling avatar grid.
const MlnCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [4, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const n = 1000000 * t;
  const cols = 24;
  const rows = 4;
  return (
    <FullCard dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300 }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: GOLD, marginBottom: 10 }}>{N("3 YIL · 25 TA LOYIHA")}</div>
        <div style={{ ...big(300), fontVariantNumeric: "lining-nums tabular-nums" }}>{fmt(n)}</div>
        <Rise at={20} style={{ ...big(110), color: GOLD }}>{N("OBUNACHI")}</Rise>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - (cols * 64) / 2, bottom: 150, display: "grid", gridTemplateColumns: `repeat(${cols}, 56px)`, gap: 8 }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const on = i / (cols * rows) < t;
          return <div key={i} style={{ width: 56, height: 56, color: on ? GOLD : "rgba(255,255,255,0.15)" }}>{on ? <div style={{ color: GOLD, width: "100%", height: "100%" }}>{UserDot}</div> : UserDot}</div>;
        })}
      </div>
    </FullCard>
  );
};
const UserDot = (
  <svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="34" r="18" fill="currentColor" /><path d="M16 92 Q16 60 50 60 Q84 60 84 92 Z" fill="currentColor" /></svg>
);

// "3 ta savolga javob beraman"
const ThreeCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ring = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: EASE });
  const C = 2 * Math.PI * 230;
  return (
    <FullCard dur={dur} bloom={GOLD}>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <circle cx="700" cy="540" r="230" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="18" />
        <circle cx="700" cy="540" r="230" fill="none" stroke={GOLD} strokeWidth="18" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90 700 540)" />
      </svg>
      <div style={{ position: "absolute", left: 700 - 200, top: 540 - 200, width: 400, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Slam at={2} from={3} style={{ ...big(400, GOLD), paddingTop: 40 }}>3</Slam>
      </div>
      <div style={{ position: "absolute", left: 1010, top: 330 }}>
        <Rise at={8} style={big(200)}>{N("TA SAVOL")}</Rise>
        <Rise at={16} style={{ fontFamily: INTER, fontWeight: 700, fontSize: 50, color: MUTED, marginTop: 20 }}>{N("— va javoblar")}</Rise>
      </div>
    </FullCard>
  );
};

// Section opener: "1-SAVOL" + question.
const SectionCard: React.FC<{ dur: number; n: string; q: string; children?: React.ReactNode }> = ({ dur, n, q, children }) => {
  const f = useCurrentFrame();
  const line = interpolate(f, [6, 24], [0, 1], { ...clamp, easing: EASE });
  return (
    <FullCard dur={dur}>
      {children}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <Slam at={0} from={2.6} style={big(330, GOLD)}>{n}</Slam>
          <Rise at={6} style={big(200)}>-SAVOL</Rise>
        </div>
        <div style={{ width: 900 * line, height: 6, borderRadius: 3, background: GOLD, margin: "20px 0 30px" }} />
        <Rise at={12} style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: CREAM, textAlign: "center" }}>{N(q)}</Rise>
      </AbsoluteFill>
    </FullCard>
  );
};

// Income bars: beginner / 6 months / 3 years (me).
const BarsCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bars = [
    { l: "Boshlang‘ich", v: "$300 – 500", h: 0.17 },
    { l: "6 oydan keyin", v: "$500 – 1 000", h: 0.33 },
    { l: "3 yillik tajriba", v: "$2 000 – 3 000", h: 1 },
  ];
  return (
    <FullCard dur={dur}>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center" }}>
        <Rise at={0} style={big(110)}>{N("SMM'DA OYLIK DAROMAD")}</Rise>
      </div>
      <div style={{ position: "absolute", left: 300, right: 300, bottom: 180, height: 640, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        {bars.map((b, i) => {
          const g = interpolate(f, [6 + i * 10, 34 + i * 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const top = i === 2;
          return (
            <div key={i} style={{ width: 340, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ ...big(top ? 84 : 66, top ? GOLD : CREAM), opacity: g, marginBottom: 14 }}>{b.v}</div>
              <div style={{ width: 240, height: 400 * b.h * g, borderRadius: "22px 22px 6px 6px", background: top ? `linear-gradient(${GOLD}, ${GOLD2})` : `linear-gradient(${BLUE}, #9c3f2b)`, boxShadow: top ? `0 0 40px ${GOLD}66` : "none" }} />
              <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: CREAM, marginTop: 18, whiteSpace: "nowrap" }}>{N(b.l)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 300, right: 300, bottom: 174, height: 4, background: "rgba(255,255,255,0.4)" }} />
    </FullCard>
  );
};

// Q3 opener: devices + question.
const PrizeQCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ps = useSpring(4, { damping: 13, stiffness: 120 });
  const ls = useSpring(12, { damping: 14, stiffness: 120 });
  const float = Math.sin(f * 0.09) * 8;
  return (
    <FullCard dur={dur} bg={DARK_BG} bloom={ORANGE}>
      <Rays color={ORANGE} opacity={0.14} />
      <div style={{ position: "absolute", left: 230, top: 220 + float + (1 - ps) * 900, transform: `rotate(${(1 - ps) * -20}deg)` }}>
        <DevicePhoto kind="phone" h={720} />
      </div>
      <div style={{ position: "absolute", left: 1090 + (1 - ls) * 1000, top: 200 - float * 0.6 }}>
        <DevicePhoto kind="laptop" h={740} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 10, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 6 }}>
        <Slam at={0} from={2.6} style={big(220, GOLD)}>3</Slam>
        <Rise at={4} style={big(110)}>-SAVOL</Rise>
      </div>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}>
        <Rise at={18} style={{ fontFamily: INTER, fontWeight: 800, fontSize: 60, color: CREAM, textShadow: SHADOW }}>{N("Qanday qilib yutib olish mumkin?")}</Rise>
      </div>
    </FullCard>
  );
};

// "10 ta sovg'a" — gifts popping in.
const TenCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <FullCard dur={dur} bloom={GOLD}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        <Slam at={0} from={2.6} style={big(260, GOLD)}>10</Slam>
        <Slam at={6} style={big(260)}>{N("TA SOVG‘A")}</Slam>
      </div>
      <div style={{ position: "absolute", left: 210, right: 210, top: 640, display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const s = interpolate(f, [8 + i * 2.5, 18 + i * 2.5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
          return <div key={i} style={{ width: 120, height: 120, color: i < 2 ? GOLD : CREAM, transform: `scale(${s}) translateY(${Math.sin(f * 0.15 + i) * 8}px)` }}><div style={{ color: i < 2 ? GOLD : CREAM, width: "100%", height: "100%" }}>{IcGift}</div></div>;
        })}
      </div>
    </FullCard>
  );
};
const IcGift = (
  <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="40" width="76" height="48" rx="6" /><path d="M8 28 H92 V40 H8 Z M50 28 V88 M50 28 Q34 6 24 18 Q18 28 50 28 Q66 6 76 18 Q82 28 50 28" />
    </g>
  </svg>
);

// Prize reveal: place + device.
const PlaceCard: React.FC<{ dur: number; place: string; name: string; device: "phone" | "laptop"; note?: string; noteAt?: number }> = ({ dur, place, name, device, note, noteAt = 0 }) => {
  const f = useCurrentFrame();
  const ds = useSpring(6, { damping: 12, stiffness: 110, mass: 0.9 });
  const float = Math.sin(f * 0.09) * 10;
  const medal = place === "1" ? GOLD : "#E6DCCB";
  return (
    <FullCard dur={dur} bg={DARK_BG} bloom={device === "phone" ? ORANGE : GOLD}>
      <Rays color={medal} opacity={0.14} />
      <div style={{ position: "absolute", left: 150, top: 250 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <Slam at={0} from={2.6} style={big(380, medal)}>{place}</Slam>
          <Rise at={6} style={big(170)}>{N("-O‘RIN")}</Rise>
        </div>
        <Rise at={14} style={{ ...big(110), marginTop: 10 }}>{name}</Rise>
        {note && f >= noteAt && (
          <Rise at={noteAt} style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, color: GOLD, marginTop: 24 }}>{N(note)}</Rise>
        )}
      </div>
      <div style={{ position: "absolute", right: 120, top: (device === "phone" ? 70 : 20) + float + (1 - ds) * 900, transform: `rotate(${(1 - ds) * 16}deg) scale(${0.85 + 0.15 * ds})` }}>
        <DevicePhoto kind={device} h={device === "phone" ? 880 : 960} />
      </div>
      <Confetti at={8} cx={device === "phone" ? 1430 : 1400} cy={420} />
    </FullCard>
  );
};

// Formula strip: test + daily points = total.
const Formula: React.FC<{ dur: number; r: (s: number) => number }> = ({ dur, r }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const box = (t: string, at: number, gold = false) => {
    const s = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
    return <div style={{ ...glass, background: gold ? GOLD : glass.background, color: gold ? NAVY : CREAM, padding: "18px 30px", borderRadius: 24, fontFamily: INTER, fontWeight: 800, fontSize: 40, transform: `scale(${s})`, whiteSpace: "nowrap" }}>{N(t)}</div>;
  };
  const op = (t: string, at: number) => <div style={{ ...big(80, GOLD), opacity: f >= at ? 1 : 0 }}>{t}</div>;
  return (
    <div style={{ position: "absolute", left: 90, top: 500, display: "flex", alignItems: "center", gap: 22, opacity: out }}>
      {box("Test bali", 0)}
      {op("+", r(300.6))}
      {box("Kunlik ballar", r(300.6))}
      {op("=", r(305.7))}
      {box("Umumiy ball", r(305.7), true)}
    </div>
  );
};

// CTA — details in the description.
const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const s = useSpring(0, { damping: 14, stiffness: 140 });
  const bob = Math.abs(Math.sin(f * 0.16)) * 18;
  const fade = interpolate(f, [dur - 15, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 90, top: 480, display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, s * 1.5) * fade, transform: `translateY(${(1 - s) * 100}px)` }}>
      <div style={{ width: 110, height: 110, borderRadius: 32, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 62, height: 62, color: NAVY, transform: `translateY(${bob - 9}px)` }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 12 V84 M22 58 L50 86 L78 58" fill="none" stroke={NAVY} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      <div style={{ ...glass, borderRadius: 30, padding: "20px 36px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 52, color: CREAM, whiteSpace: "nowrap" }}>{N("Kurs haqida batafsil — tavsifda")}</div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 32, color: GOLD, marginTop: 4, whiteSpace: "nowrap" }}>{N("Hoziroq ro‘yxatdan o‘ting")}</div>
      </div>
    </div>
  );
};

// Name lower-third.
const NameTag: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bar = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 90, top: 620, opacity: out }}>
      <div style={{ width: 8, height: 170 * bar, background: GOLD, position: "absolute", left: 0, top: 0, borderRadius: 4 }} />
      <div style={{ marginLeft: 26, ...glass, borderRadius: 30, padding: "18px 40px 24px" }}>
        <Rise at={4} style={big(150)}>AYNURA</Rise>
        <Rise at={10} style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, color: GOLD, letterSpacing: 4 }}>{N("SMM MUTAXASSIS")}</Rise>
      </div>
    </div>
  );
};

// Stat tiles: 23 yosh · 3 yil · 25+ loyiha.
const Stats: React.FC<{ dur: number; r: (s: number) => number }> = ({ dur, r }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const tiles = [
    { at: r(42.9), n: 23, suf: "", l: "yosh" },
    { at: r(44.3), n: 3, suf: "", l: "yil tajriba" },
    { at: r(48.3), n: 25, suf: "+", l: "loyiha" },
  ];
  return (
    <div style={{ position: "absolute", left: 90, top: 640, display: "flex", gap: 22, opacity: out }}>
      {tiles.map((t, i) => {
        const k = interpolate(f, [t.at, t.at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        const c = interpolate(f, [t.at, t.at + 24], [0, t.n], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{ ...glass, width: 190, height: 200, borderRadius: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, opacity: k > 0 ? 1 : 0 }}>
            <div style={{ ...big(120, GOLD), textShadow: "none" }}>{Math.round(c)}{t.suf}</div>
            <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, color: CREAM, whiteSpace: "nowrap" }}>{N(t.l)}</div>
          </div>
        );
      })}
    </div>
  );
};

/* =================== timeline (source seconds) =================== */
const st = (a: number, items: [number, string, React.ReactNode?, string?][]) => (r: (s: number) => number): Item[] =>
  items.map(([sec, text, icon, num]) => ({ at: r(sec) - r(a), text, icon, num }));

const EVENTS: Ev[] = [
  // ---------- HOOK (first ~40 s: strongest motion) ----------
  ev("Hook: 17 Pro Max + MacBook Neo", 0, 3.62, (d, r) => <HookCard dur={d} r={r} />, "rm-whoosh"),
  ev("Oxirigacha ko'ring", 3.62, 6.45, (d) => <WatchBar dur={d} />, "rm-switch"),
  ev("Kredit", 6.9, 10.25, (d) => <Chip dur={d} icon={W("card")} text="Kredit" sub="qanday tezroq yopaman?" />, "pop"),
  ev("Ko'proq daromad", 10.25, 14.2, (d, r) => <IncomeCard dur={d} r={(s) => r(s) - r(10.25)} />, "rm-whoosh"),
  ev("Kimlar uchun (stack)", 15.5, 27.3, (d, r) => (
    <Stack dur={d} title="BU VIDEO SIZ UCHUN, AGAR…" items={st(15.5, [[15.6, "Talabasiz", W("cap")], [19.3, "Uy bekasisiz", W("home")], [20.4, "Dekretdasiz", W("baby")], [24.5, "Biznes egasisiz", W("case")], [26.0, "Davlat xodimisiz", W("bank")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("Qo'shimcha daromad", 27.6, 30.5, (d) => <Chip dur={d} icon={W("wallet")} text="Qo‘shimcha daromad" />, "pop"),
  ev("Biznesni rivojlantirish", 30.6, 34.4, (d) => <Chip dur={d} icon={W("up")} text="Biznesni rivojlantirish" />, "pop"),
  ev("Aynan siz uchun", 34.5, 36.65, (d, r) => <WordsCard dur={d} words={[{ t: "BU VIDEO", at: 0, size: 150 }, { t: "AYNAN", at: r(35.4) - r(34.5), gold: true }, { t: "SIZ UCHUN", at: r(35.8) - r(34.5) }]} />, "rm-whip"),
  ev("SMM sohasi", 39.6, 41.45, (d) => <SmmCard dur={d} />, "rm-whoosh"),
  // ---------- about ----------
  ev("Name tag", 41.6, 42.85, (d) => <NameTag dur={d} />, "rm-switch", true),
  ev("Stats", 42.85, 52.3, (d, r) => <Stats dur={d} r={(s) => r(s) - r(42.85)} />, "pop", true),
  ev("1 mln obunachi", 55.9, 61.3, (d) => <MlnCard dur={d} />, "rm-whoosh"),
  ev("3 ta savol", 61.4, 64.05, (d) => <ThreeCard dur={d} />, "rm-whip"),
  ev("3 savol ro'yxati", 64.1, 86.5, (d, r) => (
    <Stack dur={d} items={st(64.1, [[64.1, "Qanday va qancha pul topish mumkin?", undefined, "1"], [70.0, "SMM kimlarga to‘g‘ri keladi?", undefined, "2"], [75.0, "Sovg‘alarni qanday yutib olaman?", undefined, "3"]])(r)} step={110} size={40} top={520} />
  ), "pop", true),
  // ---------- Q1: money ----------
  ev("1-savol", 86.6, 91.9, (d) => <SectionCard dur={d} n="1" q="Qanday va qancha pul topish mumkin?" />, "rm-whoosh"),
  ev("$300-500", 92.0, 100.6, (d) => <Money dur={d} label="Boshlang‘ich SMMchi" a={300} b={500} sub="uyda o‘tirib ham" />, "ding", true),
  ev("$500-1000", 100.95, 110.0, (d) => <Money dur={d} label="6 oydan keyin" a={500} b={1000} sub="oyiga" />, "ding", true),
  ev("Daromad bars", 110.55, 116.5, (d) => <BarsCard dur={d} />, "rm-whoosh"),
  ev("Talaba", 116.9, 119.6, (d) => <Chip dur={d} icon={W("cap")} text="Men ham talabaman" />, "pop"),
  ev("Kun tartibi", 119.8, 128.2, (d, r) => (
    <Stack dur={d} items={st(119.8, [[119.9, "Ertalab — o‘qish", W("cap")], [121.5, "Darsdan so‘ng — loyihalarimga", W("case")], [125.6, "Online — uydan yoki kafedan", W("globe")]])(r)} step={92} size={38} />
  ), "pop", true),
  ev("$2000-3000", 128.3, 135.5, (d) => <Money dur={d} label="Oylik daromadim" a={2000} b={3000} sub="qayerda bo‘lishimdan qat’i nazar" />, "ding", true),
  ev("O'zim to'layman", 135.7, 142.2, (d, r) => (
    <Stack dur={d} title="3 YILDAN BERI O‘ZIM TO‘LAYMAN" items={st(135.7, [[136.8, "Kontrakt", W("check")], [137.7, "Xarajatlar", W("check")], [138.8, "Kvartira", W("check")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("Kontrakt / orzular", 143.9, 148.6, (d) => <Chip dur={d} icon={W("cap")} text="Kontraktni o‘zim to‘lasam" />, "pop"),
  ev("Orzular", 148.7, 151.4, (d) => <Chip dur={d} icon={W("star")} text="Orzularim" />, "pop"),
  ev("Daromad yetmayapti", 151.4, 153.5, (d) => <Chip dur={d} icon={W("wallet")} text="Daromad yetmayapti" accent="#FF5468" />, "pop"),
  ev("Aynan siz uchun SMM", 153.9, 157.4, (d, r) => <WordsCard dur={d} words={[{ t: "AYNAN SIZ UCHUN", at: 0, size: 150 }, { t: "SMM", at: r(155.2) - r(153.9), gold: true, size: 300 }]} />, "rm-whip"),
  ev("Orzularga pul", 158.3, 162.3, (d) => <Chip dur={d} icon={W("star")} text="Orzularingizga pul yetadi" />, "pop"),
  // ---------- Q2: who ----------
  ev("2-savol", 162.6, 165.3, (d) => <SectionCard dur={d} n="2" q="SMM kimlarga to‘g‘ri keladi?" />, "rm-whoosh"),
  ev("Kim uchun sifatlar", 168.8, 178.9, (d, r) => (
    <Stack dur={d} items={st(168.8, [[170.0, "Shijoatli", W("rocket")], [171.2, "Pul ishlashni xohlaydigan", W("dollar")], [175.5, "Biznesga natija beradigan", W("up")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("1 Talaba", 179.0, 186.0, (d) => <NumCard dur={d} num="1" label="Talaba" sub="o‘qishdan bo‘sh vaqtda" />, "bass", true),
  ev("2 Dekret", 186.0, 198.6, (d, r) => <NumCard dur={d} num="2" label="Dekretdagi ona" sub="online format · uydan" badge="ONLINE" badgeAt={r(195.9) - r(186.0)} />, "bass", true),
  ev("3 Davlat xodimi", 198.6, 209.0, (d, r) => <NumCard dur={d} num="3" label="Davlat xodimi" sub="asosiy ishdan tashqari" badge="ONLINE · OFFLINE" badgeAt={r(204.8) - r(198.6)} />, "bass", true),
  ev("4 Biznes egasi", 209.0, 225.5, (d, r) => <NumCard dur={d} num="4" label="Biznes egasi" sub="biznesingizni o‘zingiz yuritasiz" badge="IDEAL" badgeAt={r(214.7) - r(209.0)} />, "bass", true),
  ev("SMM orqali", 225.8, 242.3, (d, r) => (
    <Stack dur={d} title="SMM ORQALI" items={st(225.8, [[227.7, "Instagram yuritish", W("camera")], [231.0, "Target reklama", W("target")], [235.9, "Amaliyot", W("task")], [240.0, "Biznesni rivojlantirish", W("up")]])(r)} step={92} size={40} />
  ), "pop", true),
  // ---------- Q3: prizes ----------
  ev("3-savol", 242.65, 249.4, (d) => <PrizeQCard dur={d} />, "rm-whoosh"),
  ev("10 ta sovg'a", 253.95, 256.5, (d) => <TenCard dur={d} />, "rm-whip"),
  ev("Kurs o'quvchilari", 261.4, 267.1, (d) => <Chip dur={d} icon={W("gift")} text="Kursimni olganlar uchun" sub="10 ta maxsus sovg‘a" />, "pop"),
  ev("Jarayon", 270.3, 286.4, (d, r) => (
    <Stack dur={d} title="QANDAY ISHLAYDI" items={st(270.3, [[271.6, "Maxsus bot", W("bot")], [275.2, "Har kuni vazifa va dars", W("task")], [279.4, "Vaqtida bajarsangiz", W("clock")], [285.2, "+ ball", W("star")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("Kurs yakuni test", 286.5, 299.0, (d, r) => (
    <Stack dur={d} items={st(286.5, [[287.9, "Kurs yakunida", W("cap")], [293.5, "Test", W("test")], [297.1, "Eng yuqori ball", W("trophy")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("Formula", 299.0, 306.9, (d, r) => <Formula dur={d} r={(s) => r(s) - r(299.0)} />, "pop"),
  ev("Top-10", 307.0, 315.4, (d) => <Chip dur={d} icon={W("trophy")} text="TOP-10 · umumiy ball" />, "pop"),
  ev("1-o'rin", 315.45, 317.95, (d) => <PlaceCard dur={d} place="1" name="17 PRO MAX" device="phone" />, "rm-whoosh"),
  ev("2-o'rin", 317.95, 323.4, (d, r) => <PlaceCard dur={d} place="2" name="MACBOOK NEO" device="laptop" note="Shaxsan o‘zim topshiraman" noteAt={r(321.7) - r(317.95)} />, "rm-whoosh"),
  ev("3-o'rin", 323.45, 330.0, (d) => <NumCard dur={d} num="3" label="Jamoamga ishga olaman" sub="3-o‘rin" />, "bass", true),
  ev("Biznes egalari", 330.0, 339.6, (d, r) => (
    <Stack dur={d} items={st(330.0, [[331.0, "SMM loyihalar", W("camera")], [332.6, "Biznes egalari yozadi", W("users")], [338.8, "Vaqtim yetmaydi", W("clock")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("Agentlik", 339.8, 347.6, (d) => <Chip dur={d} icon={W("case")} text="O‘z agentligim" sub="jamoa yig‘yapman" />, "pop"),
  ev("A'lo yakunlasangiz", 347.7, 353.9, (d) => <Chip dur={d} icon={W("trophy")} text="Kursni a’lo yakunlasangiz" sub="jamoamga qabul qilaman" />, "pop"),
  ev("4-o'rin", 354.0, 364.6, (d) => <NumCard dur={d} num="4" label="Kursingizni sotishda" sub="yordam beraman" />, "bass", true),
  ev("5-10 o'rin", 364.7, 376.2, (d, r) => <NumCard dur={d} num="5–10" label="1 oylik mentorlik" sub="savollaringizga javob" badge="ZOOM · OFFLINE" badgeAt={r(372.8) - r(364.7)} />, "bass", true),
  ev("Agentlikka saralash", 381.8, 393.5, (d, r) => (
    <Stack dur={d} title="AGENTLIGIMGA OLAMAN" items={st(381.8, [[386.4, "Kreativ", W("star")], [387.6, "Shijoatli", W("rocket")], [388.6, "A’lo bitirgan", W("trophy")]])(r)} step={92} size={40} />
  ), "pop", true),
  ev("CTA", 393.8, 402.75, (d) => <Cta dur={d} />, "ding"),
];
// every overlay that sits on the footage (not a full-screen card) reframes the speaker
const FULL = new Set(["Hook: 17 Pro Max + MacBook Neo", "Ko'proq daromad", "Aynan siz uchun", "SMM sohasi", "1 mln obunachi", "3 ta savol", "1-savol", "Daromad bars", "Aynan siz uchun SMM", "2-savol", "3-savol", "10 ta sovg'a", "1-o'rin", "2-o'rin"]);
for (const e of EVENTS) if (!FULL.has(e.name) && e.name !== "Oxirigacha ko'ring") BUSY.push([T(e.a), T(e.b)]);

/* =================== composition =================== */
export const SmmStart: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [DURATION - 15, DURATION], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        {CLIPS.map(([sa, sb, o], i) => (
          <Video key={i} name={`Kadr ${i + 1}`} src={F("main.mp4")} muted trimBefore={sa} from={o} durationInFrames={sb - sa} />
        ))}
      </Camera>
      {EVENTS.map((e) => {
        const from = T(e.a);
        const dur = Math.max(1, T(e.b) - from);
        const r = (sec: number) => T(sec) - from;
        return (
          <Sequence key={e.name} name={e.name} from={from} durationInFrames={dur} layout="none">
            {e.render(dur, r)}
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fadeOut }} />
      {CLIPS.map(([sa, sb, o], i) => (
        <Audio key={i} name={`Ovoz ${i + 1}`} src={F("voice.wav")} trimBefore={sa} from={o} durationInFrames={sb - sa} />
      ))}
      {EVENTS.filter((e) => e.sfx).map((e) => (
        <Sequence key={`sfx-${e.name}`} from={T(e.a)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${e.sfx}.wav`)} volume={e.sfx === "pop" ? 0.18 : 0.3} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

