import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { INTER, StyleCaptions } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { CLIPS, CTA, DURATION, INTRO, PHRASES, TIPS } from "./data";

// "Imtihon oldidan maslahatlar" — only camera-facing takes, pauses cut, ordered.
// Colour: graded in ffmpeg on the 4K source — S-curve contrast, clean whites, reds pulled back
// so the skin is natural (not flushed): curves + selectivecolor reds +cyan, slight cool balance.
// Numbers slide in from the LEFT side, a matching animated icon sits on the RIGHT,
// both beside the face (never over it); house subtitles below the chin.
const F = (p: string) => staticFile(`v10/${p}`);
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const ACC = "#FFD23F";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.72), rgba(14,18,28,0.5))",
  backdropFilter: "blur(16px) saturate(1.3)",
  border: "1.5px solid rgba(255,255,255,0.2)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};
// Face (YuNet median): x≈539, forehead≈634, chin≈1012 (p90 1116) → side items at y 640–900.
const FACE = { cx: 539, cy: 820 };
const SIDE_Y = 650;
const CAP_TOP = 1150;

/* ---------- camera: alternate framing on every jump cut ---------- */
const SCALES = [1.0, 1.08, 1.03, 1.1];
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  let i = CLIPS.findIndex(([sa, sb, o]) => f >= o && f < o + (sb - sa));
  if (i < 0) i = CLIPS.length - 1;
  const [sa, sb, o] = CLIPS[i];
  const base = SCALES[i % SCALES.length];
  const s = interpolate(f, [o, o + (sb - sa)], [base, base + 0.03], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- intro card (top, above the head) ---------- */
const Intro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 13, stiffness: 150 } });
  const out = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const chip = (t: string, d: number) => {
    const k = spring({ frame: f - d, fps, config: { damping: 14 } });
    return <div style={{ ...glass, borderRadius: 999, padding: "10px 24px", fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "white", opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}>{N(t)}</div>;
  };
  const n = Math.round(interpolate(f, [8, 30], [0, 10], clamp));
  return (
    <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.4) * out, transform: `translateY(${(1 - s) * -60}px)` }}>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: "rgba(255,255,255,0.9)", textShadow: SHADOW }}>{N("IMTIHON OLDIDAN")}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 4 }}>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, color: ACC, lineHeight: 1, textShadow: SHADOW, fontVariantNumeric: "tabular-nums" }}>{n}</span>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 84, color: "white", lineHeight: 1, textShadow: SHADOW }}>TA MASLAHAT</span>
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
        {chip("Shanba · Yakshanba", 14)}
        {chip("Biologiya · Kimyo", 20)}
      </div>
    </div>
  );
};

/* ---------- number sliding in from the left edge ---------- */
const SideNumber: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 140, mass: 0.8 } });
  const out = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const fill = interpolate(f, [6, 18], [0, 1], { ...clamp, easing: EASE });
  const streak = interpolate(f, [0, 12], [0, 1], clamp);
  const float = Math.sin(f * 0.08) * 5;
  const x = -320 + s * 360 - out * 360;
  const st: React.CSSProperties = { fontFamily: INTER, fontWeight: 900, fontSize: 170, lineHeight: 0.9, letterSpacing: -6 };
  return (
    <div style={{ position: "absolute", left: x, top: SIDE_Y + float }}>
      {/* light streak on entry */}
      <div style={{ position: "absolute", left: -200, top: 90, width: 420 * (1 - streak), height: 6, borderRadius: 3, background: `linear-gradient(90deg, transparent, ${ACC})`, opacity: 1 - streak }} />
      <div style={{ ...glass, width: 230, height: 260, borderRadius: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ ...st, color: "transparent", WebkitTextStroke: "4px white" }}>{n}</div>
          <div style={{ ...st, position: "absolute", inset: 0, color: ACC, clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>{n}</div>
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: "rgba(255,255,255,0.85)", marginTop: 8 }}>MASLAHAT</div>
      </div>
    </div>
  );
};

/* ---------- animated icons for each tip ---------- */
type IconFC = React.FC<{ f: number }>;
const sw = { fill: "none", stroke: "white", strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Breakfast: IconFC = ({ f }) => (
  <svg viewBox="0 0 200 200" width={170} height={170}>
    <circle cx="90" cy="115" r="58" {...sw} />
    <circle cx="90" cy="115" r="34" {...sw} strokeWidth={4} opacity={0.6} />
    <path d="M165 60 v110 M155 60 v30 a10 10 0 0 0 20 0 v-30" {...sw} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${70 + i * 20} ${40 - ((f + i * 10) % 30)} q6 -8 0 -16`} {...sw} strokeWidth={4} opacity={1 - ((f + i * 10) % 30) / 30} />
    ))}
  </svg>
);
const NoEnergy: IconFC = ({ f }) => {
  const x = interpolate(f, [8, 20], [0, 1], clamp);
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <rect x="65" y="30" width="70" height="140" rx="14" {...sw} />
      <path d="M90 75 l-12 30 h22 l-12 30" {...sw} stroke={ACC} />
      <path d="M30 30 L170 170" {...sw} stroke="#FF4D5E" strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x} />
    </svg>
  );
};
const Clock: IconFC = ({ f }) => (
  <svg viewBox="0 0 200 200" width={170} height={170}>
    <circle cx="100" cy="105" r="70" {...sw} />
    <path d="M100 105 V60" {...sw} transform={`rotate(${f * 6} 100 105)`} />
    <path d="M100 105 H135" {...sw} stroke={ACC} transform={`rotate(${f * 0.5} 100 105)`} />
    <path d="M80 20 h40" {...sw} />
  </svg>
);
const ReadQ: IconFC = ({ f }) => {
  const mx = 70 + Math.sin(f * 0.08) * 30;
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <rect x="35" y="25" width="120" height="150" rx="14" {...sw} />
      {[60, 85, 110, 135].map((y, i) => <path key={i} d={`M55 ${y} h${i === 3 ? 50 : 80}`} {...sw} strokeWidth={5} opacity={0.75} />)}
      <circle cx={mx + 40} cy="120" r="26" {...sw} stroke={ACC} />
      <path d={`M${mx + 59} 139 l22 22`} {...sw} stroke={ACC} strokeWidth={8} />
    </svg>
  );
};
const Timer: IconFC = ({ f }) => {
  const p = (f % 90) / 90;
  const C = 2 * Math.PI * 62;
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <circle cx="100" cy="108" r="62" {...sw} opacity={0.35} />
      <circle cx="100" cy="108" r="62" fill="none" stroke={ACC} strokeWidth={8} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * p} transform="rotate(-90 100 108)" />
      <text x="100" y="122" textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={40} fill="white">2–3′</text>
      <path d="M85 30 h30 M100 30 v16" {...sw} />
    </svg>
  );
};
const Shield: IconFC = ({ f }) => {
  const k = 1 + Math.sin(f * 0.15) * 0.04;
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <g transform={`translate(100 100) scale(${k}) translate(-100 -100)`}>
        <path d="M100 25 L160 50 V100 C160 140 132 162 100 175 C68 162 40 140 40 100 V50 Z" {...sw} />
        <path d="M72 102 l20 20 l38 -42" {...sw} stroke={ACC} strokeWidth={9} />
      </g>
    </svg>
  );
};
const Recheck: IconFC = ({ f }) => {
  const a = interpolate(f, [6, 16], [0, 1], clamp);
  const b = interpolate(f, [18, 28], [0, 1], clamp);
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <path d="M30 105 l30 30 l60 -70" {...sw} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
      <path d="M70 105 l30 30 l60 -70" {...sw} stroke={ACC} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
    </svg>
  );
};
const Return: IconFC = ({ f }) => {
  const r = Math.sin(f * 0.1) * 12;
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <g transform={`rotate(${r} 100 100)`}>
        <path d="M150 120 A55 55 0 1 1 135 60" {...sw} strokeWidth={9} />
        <path d="M150 40 V75 H115" {...sw} stroke={ACC} strokeWidth={9} />
      </g>
    </svg>
  );
};
const Scale: IconFC = ({ f }) => {
  const t = Math.sin(f * 0.07) * 12;
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <path d="M100 30 V170 M65 170 H135" {...sw} />
      <g transform={`rotate(${t} 100 50)`}>
        <path d="M40 50 H160" {...sw} />
        <path d="M40 50 L22 95 H58 Z" {...sw} strokeWidth={5} />
        <path d="M160 50 L142 95 H178 Z" {...sw} strokeWidth={5} stroke={ACC} />
      </g>
    </svg>
  );
};
const Breath: IconFC = ({ f }) => {
  // 4 s in / hold feel: radius breathes, counter 1..4
  const c = Math.floor((f / 30) % 4) + 1;
  const r = 40 + 28 * (0.5 - 0.5 * Math.cos((f / 120) * Math.PI * 2));
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <circle cx="100" cy="100" r={r + 20} fill="rgba(255,210,63,0.12)" />
      <circle cx="100" cy="100" r={r} fill="none" stroke={ACC} strokeWidth={6} />
      <text x="100" y="116" textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={48} fill="white">{c}s</text>
    </svg>
  );
};
const Share: IconFC = ({ f }) => {
  const fly = ((f % 60) / 60);
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      <g transform={`translate(${fly * 40 - 10} ${-fly * 30 + 10})`} opacity={1 - fly * 0.6}>
        <path d="M30 100 L170 40 L130 170 L100 115 Z" {...sw} />
        <path d="M100 115 L170 40" {...sw} stroke={ACC} />
      </g>
    </svg>
  );
};

const ICONS: { C: IconFC; t: string }[] = [
  { C: Breakfast, t: "Nonushta" },
  { C: NoEnergy, t: "Energetik — yo‘q" },
  { C: Clock, t: "30–40 daqiqa oldin" },
  { C: ReadQ, t: "Oxirigacha o‘qing" },
  { C: Timer, t: "2–3 daqiqa" },
  { C: Shield, t: "Sinmang" },
  { C: Recheck, t: "Qayta tekshiring" },
  { C: Return, t: "Qayting" },
  { C: Scale, t: "Tavakkal" },
  { C: Breath, t: "4 soniya nafas" },
];

const SideIcon: React.FC<{ C: IconFC; title: string; dur: number }> = ({ C, title, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 140, mass: 0.8 } });
  const out = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const x = 1080 + 40 - s * 290 + out * 330;
  const float = Math.sin(f * 0.08 + 1.5) * 5;
  return (
    <div style={{ position: "absolute", left: x, top: SIDE_Y + float, opacity: Math.min(1, s * 1.5) }}>
      <div style={{ ...glass, width: 230, height: 260, borderRadius: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <C f={f} />
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, color: "white", textAlign: "center", padding: "0 10px", lineHeight: 1.1 }}>{N(title)}</div>
      </div>
    </div>
  );
};

export const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [DURATION - 10, DURATION], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        {CLIPS.map(([sa, sb, o], i) => (
          <Video key={i} name={`Kadr ${i + 1}`} src={F("main.mp4")} muted trimBefore={sa} from={o} durationInFrames={sb - sa} />
        ))}
      </Camera>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 52%, rgba(0,0,0,0.3) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 20%, transparent 52%, rgba(0,0,0,0.3) 66%, rgba(0,0,0,0.12) 100%)" }} />

      <Sequence name="Kirish" from={INTRO.from} durationInFrames={INTRO.to - INTRO.from}>
        <Intro dur={INTRO.to - INTRO.from} />
      </Sequence>
      {TIPS.map(([a, b], i) => (
        <Sequence key={`n${i}`} name={`${i + 1}-maslahat`} from={a} durationInFrames={b - a}>
          <SideNumber n={i + 1} dur={b - a} />
          <SideIcon C={ICONS[i].C} title={ICONS[i].t} dur={b - a} />
        </Sequence>
      ))}
      <Sequence name="Ulashish" from={CTA.from} durationInFrames={CTA.to - CTA.from}>
        <SideIcon C={Share} title="Do‘stlarga yuboring" dur={CTA.to - CTA.from + 10} />
      </Sequence>

      <StyleCaptions phrases={PHRASES} top={CAP_TOP} />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fade }} />

      {CLIPS.map(([sa, sb, o], i) => (
        <Audio key={i} name={`Ovoz ${i + 1}`} src={F("voice.wav")} trimBefore={sa} from={o} durationInFrames={sb - sa} />
      ))}
      <Audio name="Music: Freedom (instrumental)" src={F("music.wav")} volume={0.9} />
      {TIPS.map(([a], i) => (
        <Sequence key={`s${i}`} from={a} durationInFrames={40} name="sfx whoosh">
          <Audio src={staticFile("sfx/rm-whoosh.wav")} volume={0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
