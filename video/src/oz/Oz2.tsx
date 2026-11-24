import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { Heart, Send } from "lucide-react";
import { INTER } from "../v4/ui";
import { PAGES } from "./captions";
import { CUTS, DURATION, FACE, G, s } from "./timeline";

// Re-edit v2 of the "Mijoz $1500" vlog: every overlay has its own motion language (no repeated
// card), all monochrome, all below the chin (y ≥ 1200). Captions hidden while an overlay is up.
// Footage colour and the voice are untouched.
const INK = "#0B0C0F";
const W = "#FFFFFF";
const TOP = 1210;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const at = (sec: number, start: number) => s(sec) - s(start);
const useSp = (d = 0, damping = 14, stiffness = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - d, fps, config: { damping, stiffness, mass: 0.6 } });
};
const shadow = "0 4px 18px rgba(0,0,0,0.6)";
const T: React.FC<{ size: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, weight = 800, color = W, style, children }) => (
  <div style={{ fontFamily: INTER, fontSize: size, fontWeight: weight, color, letterSpacing: -size * 0.04, lineHeight: 1, textShadow: color === W ? shadow : undefined, ...style }}>{children}</div>
);
const Zone: React.FC<{ dur: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ dur, children, style }) => {
  const f = useCurrentFrame();
  const out = p(f, dur - 6, dur);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: TOP, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${out * 24}px)`, ...style }}>{children}</div>
    </AbsoluteFill>
  );
};

/* 1 — slot-machine digits */
const Slot: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const digits = ["1", "5", "0", "0"];
  const line = p(f, at(1.4, 0), at(1.4, 0) + 12);
  return (
    <Zone dur={dur}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <T size={200} style={{ marginRight: 6 }}>+$</T>
        {digits.map((d, i) => {
          const stop = 8 + i * 6;
          const k = p(f, 0, stop + 10, Easing.out(Easing.cubic));
          const roll = (1 - k) * 9 * 200;
          return (
            <div key={i} style={{ height: 200, overflow: "hidden", width: 120 }}>
              <div style={{ transform: `translateY(${-((Number(d) * 200 + roll) % 2000)}px)`, filter: `blur(${(1 - k) * 6}px)` }}>
                {new Array(10).fill(0).map((_, n) => (
                  <T key={n} size={200} style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</T>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ width: 620 * line, height: 10, background: W, borderRadius: 5, marginTop: 8, boxShadow: shadow }} />
      <T size={40} weight={600} style={{ marginTop: 18, opacity: line, letterSpacing: 6 }}>TO‘LOV KELDI</T>
    </Zone>
  );
};

/* 2 — paper + signature + stamp */
const Contract: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const up = useSp(0, 15, 140);
  const sign = p(f, at(6.76, 4.26) - 6, at(6.76, 4.26) + 12);
  const stamp = useSp(at(7.07, 4.26), 9, 260);
  return (
    <Zone dur={dur}>
      <div style={{ position: "relative", width: 700, height: 360, transform: `translateY(${(1 - up) * 300}px) rotate(${(1 - up) * -8 - 2}deg)`, background: "#F4F2EC", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", padding: "34px 40px", fontFamily: INTER, color: INK }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 4 }}>SHARTNOMA</div>
        <div style={{ fontSize: 24, color: "#666", marginTop: 6 }}>Marketing xizmati · Noyabr</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: 8, width: [560, 500, 420][i], background: "#D9D6CE", borderRadius: 4, marginTop: 18 }} />
        ))}
        <div style={{ position: "absolute", left: 40, bottom: 40, fontSize: 52, fontWeight: 800 }}>$1 500</div>
        <svg width={260} height={90} style={{ position: "absolute", right: 30, bottom: 30 }}>
          <path d="M6 70 C 30 10, 52 12, 60 60 S 96 80, 116 30 S 160 4, 170 56 S 214 70, 254 26" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
        </svg>
        <div style={{ position: "absolute", right: 70, top: 40, transform: `rotate(-14deg) scale(${2.4 - 1.4 * stamp})`, opacity: f >= at(7.07, 4.26) ? Math.min(1, stamp * 2) : 0, border: `6px solid ${INK}`, borderRadius: 14, padding: "8px 18px", fontWeight: 800, fontSize: 34, letterSpacing: 3 }}>IMZOLANDI</div>
      </div>
    </Zone>
  );
};

/* 3 — month ruler + empty progress ring */
const Ruler: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const inn = p(f, 0, 12);
  const day = interpolate(f, [6, at(8.6, 7.6)], [1, 28], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zero = p(f, at(9.36, 7.6), at(9.36, 7.6) + 10);
  const x = 60 + ((day - 1) / 29) * 840;
  return (
    <Zone dur={dur}>
      <T size={36} weight={600} style={{ letterSpacing: 8, opacity: inn }}>NOYABR</T>
      <svg width={960} height={150} style={{ marginTop: 16, overflow: "visible", opacity: inn }}>
        <line x1={60} y1={90} x2={900} y2={90} stroke={W} strokeWidth={4} />
        {new Array(30).fill(0).map((_, i) => (
          <line key={i} x1={60 + (i / 29) * 840} y1={i % 5 === 0 ? 62 : 74} x2={60 + (i / 29) * 840} y2={90} stroke={W} strokeWidth={i % 5 === 0 ? 4 : 2} opacity={i < day ? 1 : 0.35} />
        ))}
        <line x1={60} y1={90} x2={x} y2={90} stroke={W} strokeWidth={10} strokeLinecap="round" />
        <g transform={`translate(${x} 90)`}>
          <circle r={18} fill={W} />
          <text y={-38} textAnchor="middle" fill={W} fontFamily={INTER} fontWeight={800} fontSize={40}>{Math.round(day)}</text>
        </g>
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 8, opacity: zero, transform: `scale(${0.8 + 0.2 * zero})` }}>
        <svg width={120} height={120}>
          <circle cx={60} cy={60} r={48} stroke="rgba(255,255,255,0.3)" strokeWidth={12} fill="none" />
          <text x={60} y={72} textAnchor="middle" fill={W} fontFamily={INTER} fontWeight={800} fontSize={36}>0%</text>
        </svg>
        <T size={54}>ish boshlanmadi</T>
      </div>
    </Zone>
  );
};

/* 4 — split-flap board */
const Flap: React.FC<{ text: string; at0: number }> = ({ text, at0 }) => {
  const f = useCurrentFrame();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {text.split("").map((ch, i) => {
        const done = at0 + i * 2 + 6;
        const cur = f >= done ? ch : f < at0 ? " " : chars[(f * 3 + i * 7) % chars.length];
        const flip = f >= done ? 1 - p(f, done, done + 4) : 1;
        return (
          <div key={i} style={{ width: 82, height: 120, borderRadius: 10, background: INK, border: "2px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 76, color: W, transform: `scaleY(${1 - flip * 0.3})` }}>{cur}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 59, height: 2, background: "rgba(0,0,0,0.8)" }} />
          </div>
        );
      })}
    </div>
  );
};
const Why: React.FC<{ dur: number }> = ({ dur }) => (
  <Zone dur={dur}>
    <Flap text="OILAVIY?" at0={0} />
    <div style={{ height: 14 }} />
    <Flap text="SHAXSIY?" at0={at(13.4, 12.44)} />
  </Zone>
);

/* 5 — clock + typed line */
const ClockScene: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const inn = useSp(0);
  const txt = "vaqt = pul";
  const typed = Math.floor(p(f, at(19.97, 19.17), at(20.84, 19.17), (x) => x) * txt.length);
  const okk = p(f, at(20.84, 19.17), at(20.84, 19.17) + 8);
  return (
    <Zone dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `scale(${inn})` }}>
        <svg width={220} height={220}>
          <circle cx={110} cy={110} r={100} fill="rgba(0,0,0,0.35)" stroke={W} strokeWidth={8} />
          {new Array(12).fill(0).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={110 + Math.sin(a) * 82} y1={110 - Math.cos(a) * 82} x2={110 + Math.sin(a) * 92} y2={110 - Math.cos(a) * 92} stroke={W} strokeWidth={4} />;
          })}
          <line x1={110} y1={110} x2={110 + Math.sin(f * 0.25) * 70} y2={110 - Math.cos(f * 0.25) * 70} stroke={W} strokeWidth={8} strokeLinecap="round" />
          <line x1={110} y1={110} x2={110 + Math.sin(f * 0.02) * 46} y2={110 - Math.cos(f * 0.02) * 46} stroke={W} strokeWidth={10} strokeLinecap="round" />
          <circle cx={110} cy={110} r={10} fill={W} />
        </svg>
        <div>
          <T size={70} style={{ fontFamily: "monospace", letterSpacing: -2 }}>
            {txt.slice(0, typed)}
            <span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span>
          </T>
          <T size={38} weight={600} style={{ marginTop: 14, opacity: okk }}>✓ qoplangan</T>
        </div>
      </div>
    </Zone>
  );
};

/* 6 — tear-off calendar */
const Tear: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const inn = useSp(0);
  const tear = p(f, at(22.6, 21.96), at(22.6, 21.96) + 16, Easing.in(Easing.quad));
  const pay = p(f, at(22.87, 21.96), at(22.87, 21.96) + 8);
  const Page: React.FC<{ m: string; d: string }> = ({ m, d }) => (
    <div style={{ width: 300, height: 320, borderRadius: 18, overflow: "hidden", background: "#F4F2EC", fontFamily: INTER, color: INK, boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
      <div style={{ background: INK, color: W, textAlign: "center", fontWeight: 800, fontSize: 34, padding: "16px 0", letterSpacing: 4 }}>{m}</div>
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 170, lineHeight: "240px" }}>{d}</div>
    </div>
  );
  return (
    <Zone dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 46, transform: `scale(${inn})` }}>
        <div style={{ position: "relative", width: 300, height: 320 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Page m="DEKABR" d="1" />
          </div>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 0%", transform: `translate(${tear * 120}px, ${tear * 700}px) rotate(${tear * 50}deg)`, opacity: 1 - tear * 0.9 }}>
            <Page m="NOYABR" d="30" />
          </div>
        </div>
        <div style={{ opacity: pay, transform: `translateX(${(1 - pay) * 40}px)` }}>
          <T size={44} weight={600}>oldindan to‘lov</T>
          <T size={64} style={{ marginTop: 10 }}>start: dekabr</T>
        </div>
      </div>
    </Zone>
  );
};

/* 7 — Instagram comment composer */
const CommentUI: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const up = useSp(0, 15, 160);
  const txt = "Bizda ham shunaqa mijoz bor 😅".replace(" 😅", "…");
  const n = Math.floor(p(f, 8, 50, (x) => x) * txt.length);
  const like = useSp(54, 9, 240);
  return (
    <Zone dur={dur}>
      <T size={44} weight={700} style={{ marginBottom: 22, opacity: up }}>Kommentda yozing ↓</T>
      <div style={{ transform: `translateY(${(1 - up) * 200}px)`, width: 900, display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 999, background: "rgba(20,20,24,0.88)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: W, flex: "none" }} />
        <div style={{ flex: 1, fontFamily: INTER, fontSize: 36, color: W }}>
          {txt.slice(0, n)}
          <span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span>
        </div>
        <div style={{ transform: `scale(${0.6 + 0.6 * like})` }}>
          <Heart size={52} color={W} fill={f >= 54 ? W : "transparent"} />
        </div>
      </div>
    </Zone>
  );
};

/* 8 — paper plane on a dashed path */
const Plane: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const k = p(f, 4, dur - 10, Easing.inOut(Easing.sin));
  const path = (t: number) => {
    const x = 80 + t * 920;
    const y = 240 - Math.sin(t * Math.PI) * 170 + Math.sin(t * Math.PI * 3) * 30;
    return [x, y];
  };
  const pts = new Array(40).fill(0).map((_, i) => path((i / 39) * k));
  const [px, py] = path(k);
  const [qx, qy] = path(Math.min(1, k + 0.01));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
  return (
    <Zone dur={dur}>
      <T size={56} style={{ textAlign: "center" }}>Tanishlaringizga</T>
      <T size={56} weight={300} style={{ textAlign: "center", marginTop: 6 }}>yuboring</T>
      <svg width={1080} height={300} style={{ marginTop: 10, overflow: "visible" }}>
        <path d={"M" + pts.map((q) => q.join(" ")).join(" L")} stroke={W} strokeWidth={4} strokeDasharray="12 12" fill="none" opacity={0.8} />
      </svg>
      <div style={{ position: "absolute", left: px - 40, top: 130 + py - 40, transform: `rotate(${ang + 45}deg)` }}>
        <Send size={80} color={W} strokeWidth={2} style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" }} />
      </div>
    </Zone>
  );
};

const OVERLAYS: [keyof typeof G, React.FC<{ dur: number }>][] = [
  ["pay", Slot],
  ["contract", Contract],
  ["month", Ruler],
  ["why", Why],
  ["time", ClockScene],
  ["dec", Tear],
  ["comment", CommentUI],
  ["share", Plane],
];

/* captions: current word highlighted in a white box */
const Captions2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (Object.values(G).some(([a, b]) => f >= s(a) && f < s(b))) return null;
  const page = PAGES.find((q) => f >= q.from && f < q.to);
  if (!page) return null;
  const cur = page.words.reduce((acc, w, i) => (f >= w.from ? i : acc), -1);
  return (
    <AbsoluteFill style={{ top: 1250, height: "auto", alignItems: "center" }}>
      <div style={{ width: 980, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 12px" }}>
        {page.words.map((w, i) => {
          const sp = spring({ frame: f - w.from, fps, config: { damping: 14, stiffness: 260, mass: 0.5 } });
          const vis = f >= w.from;
          const on = i === cur;
          return (
            <span key={i} style={{ display: "inline-block", padding: "6px 16px", borderRadius: 12, background: on ? W : "transparent", color: on ? INK : W, fontFamily: INTER, fontWeight: 800, fontSize: 64, letterSpacing: -1.5, textTransform: "lowercase", opacity: vis ? 1 : 0, transform: `scale(${vis ? 0.85 + 0.15 * sp : 0.85}) rotate(${on ? -2 : 0}deg)`, textShadow: on ? "none" : shadow }}>
              {w.text.replace(/[.,:]$/, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Different punch pattern + a short slide on every cut (instead of the plain zoom of v1).
const Camera2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const i = CUTS.reduce((acc, c, k) => (f >= c ? k : acc), 0);
  const a = CUTS[i];
  const b = CUTS[i + 1] ?? DURATION;
  const base = [1.05, 1.0, 1.12, 1.03][i % 4];
  const sc = interpolate(f, [a, b], [base + 0.03, base], clamp);
  const kick = interpolate(f - a, [0, 6], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dir = i % 2 ? 1 : -1;
  return <AbsoluteFill style={{ transform: `translateX(${i > 0 ? kick * 40 * dir : 0}px) scale(${sc})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px` }}>{children}</AbsoluteFill>;
};

export const Oz2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera2>
      <Video name="Cut (pauses removed)" src={staticFile("oz/cut.mp4")} muted />
    </Camera2>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 52%, rgba(0,0,0,0.45) 74%, rgba(0,0,0,0.25) 100%)" }} />
    {OVERLAYS.map(([k, El]) => {
      const [a, b] = G[k];
      return (
        <Sequence key={k} name={`Overlay: ${k}`} from={s(a)} durationInFrames={s(b) - s(a)}>
          <El dur={s(b) - s(a)} />
        </Sequence>
      );
    })}
    <Captions2 />
    <Audio name="Voice (original, gain only)" src={staticFile("oz/voice.wav")} />
    <Audio name="Music: ICEGERGERT – Aktrisa" src={staticFile("oz/music.wav")} />
  </AbsoluteFill>
);

export { DURATION };
