import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { noise2D } from "@remotion/noise";
import { BarChart3, Clapperboard, Heart, Instagram, Megaphone, MessageCircle, Scissors, Send, ShoppingBag, Target, TrendingUp } from "lucide-react";
import { INTER } from "../v4/ui";

// "Nano Marketing" v2 — original concept: a tiny spark grows into an audience, a profile,
// a full service orbit and a brand. Music: Pixeln World – Freedom (instrumental) from 31.0 s;
// its drop (41.36 s) lands at 10.36 s here.
export const FPS = 30;
export const DURATION = 630; // 21 s
const s = (sec: number) => Math.round(sec * FPS);
const HANDLE = "@nano_marketinguz";
const DROP = s(10.36);
const BEAT = 0.628;
const beat = (f: number) => {
  const t = f / FPS;
  const ph = ((t % BEAT) + BEAT) % BEAT;
  return Math.exp(-ph * 8);
};

const C = {
  ink: "#04050A",
  navy: "#0A1030",
  blue: "#3D6BFF",
  blue2: "#6E8BFF",
  lime: "#C8FF3D",
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.6)",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const useSp = (d = 0, damping = 14, stiffness = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - d, fps, config: { damping, stiffness, mass: 0.6 } });
};

const Txt: React.FC<{ size: number; color?: string; weight?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = C.white, weight = 800, style, children }) => (
  <div style={{ fontFamily: INTER, fontSize: size, fontWeight: weight, color, letterSpacing: -size * 0.04, lineHeight: 1.02, ...style }}>{children}</div>
);

// Word-by-word rise with blur (absolute frames inside the current Sequence).
const Words: React.FC<{ text: string; at: number; size: number; accent?: string[]; gap?: number; color?: string }> = ({ text, at, size, accent = [], gap = 3, color = C.white }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.28}px`, width: 960 }}>
      {text.split(" ").map((w, i) => {
        const st = at + i * gap;
        const sp = spring({ frame: f - st, fps, config: { damping: 15, stiffness: 190, mass: 0.6 } });
        const acc = accent.includes(w.replace(/[.,]/g, ""));
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: INTER, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, color: acc ? C.lime : color, opacity: f >= st ? Math.min(1, sp * 1.3) : 0, transform: `translateY(${(1 - sp) * 50}px)`, filter: `blur(${(1 - Math.min(1, sp)) * 10}px)`, textShadow: acc ? `0 0 40px ${C.lime}66` : "none" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------------- background ---------------- */
const Space: React.FC = () => {
  const f = useCurrentFrame();
  const post = p(f, DROP - 2, DROP + 8);
  const b = beat(f) * post;
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.navy} 0%, ${C.ink} 70%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540 - 700 + noise2D("o1", t * 0.1, 0) * 120, top: 700 - 700, width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, rgba(61,107,255,${0.25 + post * 0.15 + b * 0.1}) 0%, transparent 60%)` }} />
      <div style={{ position: "absolute", left: 540 - 600 + noise2D("o2", 0, t * 0.1) * 120, top: 1500 - 600, width: 1200, height: 1200, borderRadius: "50%", background: `radial-gradient(circle, rgba(200,255,61,${0.06 + post * 0.08}) 0%, transparent 60%)` }} />
      {new Array(60).fill(0).map((_, i) => {
        const x = (i * 157.3) % 1080;
        const depth = 0.3 + (i % 7) / 7;
        const y = (((i * 331) % 1920) + f * depth * (1 + post * 4)) % 1920;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 2 + depth * 3, height: (2 + depth * 3) * (1 + post * 6 * depth), borderRadius: 4, background: "#fff", opacity: 0.08 + depth * 0.25 }} />;
      })}
    </AbsoluteFill>
  );
};

/* ---------------- A: the spark (0 – 3.15 s) ---------------- */
const Spark: React.FC = () => {
  const f = useCurrentFrame();
  const b = beat(f);
  const grow = useSp(0, 10, 120);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1010 - 30, width: 60, height: 60, borderRadius: 30, background: C.lime, transform: `scale(${grow * (1 + b * 0.5)})`, boxShadow: `0 0 ${60 + b * 80}px ${C.lime}, 0 0 200px ${C.lime}66` }} />
      {[0, 1, 2].map((i) => {
        const k = ((f / 30 + i * 0.33) % 1);
        return <div key={i} style={{ position: "absolute", top: 1010 - 160, width: 320, height: 320, borderRadius: "50%", border: `2px solid ${C.lime}`, transform: `scale(${0.2 + k * 1.6})`, opacity: (1 - k) * 0.5 }} />;
      })}
      <div style={{ position: "absolute", top: 420 }}>
        <Words text="Har bir katta brend" at={8} size={92} />
        <div style={{ height: 14 }} />
        <Words text="kichik qadamdan boshlanadi." at={40} size={92} accent={["kichik"]} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- B: audience network (3.15 – 6.3 s) ---------------- */
const NODES = new Array(26).fill(0).map((_, i) => {
  const a = i * 2.399; // golden angle
  const r = 90 + Math.sqrt(i) * 78;
  return { x: 540 + Math.cos(a) * r, y: 1010 + Math.sin(a) * r * 1.05, d: i * 1.4 };
});
const Network: React.FC<{ collapse?: number }> = ({ collapse = 0 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const pts = NODES.map((n, i) => ({
    x: interpolate(collapse, [0, 1], [n.x + noise2D("nx" + i, t * 0.4, 0) * 14, 540]),
    y: interpolate(collapse, [0, 1], [n.y + noise2D("ny" + i, 0, t * 0.4) * 14, 1010]),
    k: p(f, n.d, n.d + 10),
  }));
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {pts.map((a, i) =>
        pts.slice(i + 1).map((b, j) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > 230 || dist < 1) return null;
          return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.blue2} strokeWidth={2} opacity={Math.min(a.k, b.k) * (1 - dist / 230) * 0.9} />;
        }),
      )}
      {pts.map((a, i) => (
        <g key={i} transform={`translate(${a.x} ${a.y}) scale(${a.k})`}>
          <circle r={i === 0 ? 30 : 20} fill={i === 0 ? C.lime : C.blue} />
          <circle r={i === 0 ? 30 : 20} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={2} />
          <circle cy={-5} r={6} fill="#fff" opacity={i === 0 ? 0 : 0.9} />
          <path d="M-10 11 C-8 3, 8 3, 10 11" fill="#fff" opacity={i === 0 ? 0 : 0.9} />
        </g>
      ))}
    </svg>
  );
};
const Audience: React.FC = () => (
  <AbsoluteFill>
    <Network />
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 380 }}>
        <Words text="Biz auditoriyangizni topamiz" at={2} size={96} accent={["auditoriyangizni"]} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------- C: profile grows inside the phone (6.3 – 10.36 s) ---------------- */
const Phone: React.FC<{ children: React.ReactNode; tilt?: number; scale?: number }> = ({ children, tilt = 0, scale = 1 }) => (
  <div style={{ transform: `perspective(1800px) rotateY(${tilt}deg) rotateX(${tilt * 0.3}deg) scale(${scale})`, width: 470, height: 960, borderRadius: 70, padding: 16, background: "linear-gradient(160deg,#2A2F45,#0B0D16)", boxShadow: `0 60px 140px rgba(0,0,0,0.7), 0 0 120px rgba(61,107,255,0.35), inset 0 0 0 2px rgba(255,255,255,0.15)` }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 56, overflow: "hidden", background: "#0B0E1A", position: "relative" }}>{children}</div>
  </div>
);

const Profile: React.FC<{ f: number; followers: number; fill: number }> = ({ f, followers, fill }) => {
  const cols = [C.blue, "#1C2340", C.lime, "#2B3360", C.blue2, "#151A30", "#2B3360", C.blue, "#1C2340", C.lime, C.blue2, "#151A30"];
  return (
    <AbsoluteFill style={{ fontFamily: INTER, color: "#fff", padding: "50px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, padding: 5, background: `conic-gradient(${C.lime}, ${C.blue}, ${C.lime})`, transform: `rotate(${f * 2}deg)` }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0B0E1A", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${-f * 2}deg)` }}>
            <NanoMark size={70} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          {[
            ["48", "post"],
            [followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : `${followers}`, "obunachi"],
          ].map(([n, l], i) => (
            <div key={i}>
              <div style={{ fontSize: 38, fontWeight: 800, color: i === 1 ? C.lime : "#fff" }}>{n}</div>
              <div style={{ fontSize: 20, color: C.dim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 18 }}>Sizning brendingiz</div>
      <div style={{ fontSize: 20, color: C.dim, marginTop: 4 }}>marketing · kontent · sotuv</div>
      <div style={{ marginTop: 22, padding: "14px 0", borderRadius: 14, background: C.blue, textAlign: "center", fontWeight: 700, fontSize: 22 }}>Obuna bo‘lish</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 5, marginTop: 24 }}>
        {cols.map((c, i) => {
          const k = Math.max(0, Math.min(1, fill * 12 - i));
          return <div key={i} style={{ aspectRatio: "1", background: c, borderRadius: 6, transform: `scale(${k})`, opacity: k }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Grow: React.FC = () => {
  const f = useCurrentFrame();
  const end = DROP - s(6.3);
  const coll = p(f, 0, 12);
  const ph = useSp(6, 14, 120);
  const followers = Math.round(interpolate(f, [16, end - 10], [120, 48700], { ...clamp, easing: Easing.in(Easing.quad) }));
  const fill = p(f, 14, end - 20, (x) => x);
  const push = p(f, end - 22, end, (x) => x * x * x); // tension into the drop
  const hearts = new Array(12).fill(0).map((_, i) => {
    const st = 24 + i * 6;
    const k = p(f, st, st + 30, (x) => x);
    if (f < st) return null;
    return <Heart key={i} size={44 + (i % 3) * 12} color="#FF3B6B" fill="#FF3B6B" style={{ position: "absolute", left: 540 + 200 + Math.sin(i * 1.7) * 90, top: 1300 - k * 720, opacity: 1 - k }} />;
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - coll }}>
        <Network collapse={coll} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 260, opacity: 1 - push }}>
          <Words text="…va uni mijozga aylantiramiz" at={4} size={84} accent={["mijozga"]} />
        </div>
        <div style={{ position: "absolute", top: 560, transform: `translateY(${(1 - ph) * 900}px) scale(${1 + push * 0.9})`, opacity: Math.min(1, ph * 2) }}>
          <Phone tilt={interpolate(f, [0, end], [-18, 8])}>
            <Profile f={f} followers={followers} fill={fill} />
          </Phone>
        </div>
        {hearts}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- D: DROP — services orbit (10.36 – 13.5 s) ---------------- */
const SERVICES: [typeof Target, string][] = [
  [Target, "Target"],
  [Instagram, "SMM"],
  [Clapperboard, "Kontent"],
  [Scissors, "Montaj"],
  [BarChart3, "Strategiya"],
  [ShoppingBag, "Sotuv"],
  [Megaphone, "Reklama"],
  [MessageCircle, "Direct"],
];
const Orbit: React.FC = () => {
  const f = useCurrentFrame();
  const b = beat(f + DROP);
  const inn = useSp(0, 12, 150);
  const spin = f * 1.6 + (1 - inn) * -120;
  const flash = interpolate(f, [0, 8], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 290, transform: `scale(${0.6 + 0.4 * inn})`, opacity: inn }}>
          <Txt size={104} style={{ textAlign: "center" }}>
            Hammasi <span style={{ color: C.lime }}>bir joyda</span>
          </Txt>
        </div>
        {/* 3D ring */}
        <div style={{ position: "absolute", top: 1010, left: 540, transformStyle: "preserve-3d", perspective: 1400 }}>
          <div style={{ transformStyle: "preserve-3d", transform: `rotateX(68deg) rotateZ(${spin}deg)` }}>
            <div style={{ position: "absolute", left: -350, top: -350, width: 700, height: 700, borderRadius: "50%", border: `3px solid ${C.blue2}`, boxShadow: `0 0 40px ${C.blue}` }} />
            {SERVICES.map(([Icon, name], i) => {
              const a = (i / SERVICES.length) * 360;
              return (
                <div key={i} style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateZ(${a}deg) translateX(350px) rotateZ(${-a - spin}deg) rotateX(-68deg)` }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: "max-content", transform: `translate(-50%,-50%) scale(${inn * (1 + b * 0.08)})`, display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: 999, background: "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", whiteSpace: "nowrap", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                    <Icon size={30} color={i % 2 ? C.lime : "#fff"} />
                    <span style={{ fontFamily: INTER, fontSize: 28, fontWeight: 700, color: "#fff" }}>{name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* core */}
        <div style={{ position: "absolute", top: 1010 - 120, transform: `scale(${inn * (1 + b * 0.1)})` }}>
          <NanoMark size={240} glow />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* ---------------- E: growth (13.5 – 16.0 s) ---------------- */
const Growth: React.FC = () => {
  const f = useCurrentFrame();
  const line = p(f, 0, 40, Easing.inOut(Easing.cubic));
  const pts = [
    [60, 1500],
    [260, 1420],
    [420, 1440],
    [600, 1200],
    [760, 1050],
    [1000, 700],
  ];
  const d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const tags: [string, number, number, number][] = [
    ["Ko‘rishlar", 600, 1200, 10],
    ["So‘rovlar", 760, 1050, 20],
    ["Sotuvlar", 1000, 700, 32],
  ];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gl" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={C.blue} />
            <stop offset="1" stopColor={C.lime} />
          </linearGradient>
          <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.blue} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.blue} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${d} L1000 1920 L60 1920 Z`} fill="url(#ga)" opacity={line} />
        <path d={d} stroke="url(#gl)" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} style={{ filter: `drop-shadow(0 0 18px ${C.lime})` }} />
      </svg>
      {tags.map(([t, x, y, st], i) => {
        const k = p(f, st, st + 10);
        return (
          <div key={i} style={{ position: "absolute", left: Math.min(x - 120, 760), top: y - 120, opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.7 + 0.3 * k})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: i === 2 ? C.lime : "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", fontFamily: INTER, fontWeight: 800, fontSize: 32, color: i === 2 ? C.ink : "#fff" }}>
              <TrendingUp size={32} color={i === 2 ? C.ink : C.lime} /> {t}
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 300 }}>
          <Words text="Natija — o‘sishda" at={0} size={110} accent={["o‘sishda"]} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- brand mark ---------------- */
const NanoMark: React.FC<{ size: number; glow?: boolean }> = ({ size, glow }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 30px ${C.blue})` : "none" }}>
    <defs>
      <linearGradient id="nm" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5C82FF" />
        <stop offset="1" stopColor="#2A49E0" />
      </linearGradient>
    </defs>
    <rect x={2} y={2} width={96} height={96} rx={28} fill="url(#nm)" />
    <rect x={2} y={2} width={96} height={44} rx={28} fill="#fff" opacity={0.12} />
    <path d="M30 72 V30 L70 70 V30" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx={79} cy={21} r={8} fill={C.lime} />
  </svg>
);

/* ---------------- F: logo from particles (16.0 – 18.5 s) ---------------- */
const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const conv = p(f, 0, 18, Easing.inOut(Easing.cubic));
  const show = useSp(14, 12, 150);
  const tag = p(f, 30, 44);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {new Array(48).fill(0).map((_, i) => {
        const a = i * 2.399;
        const r = 700 + (i % 5) * 80;
        const x = 540 + Math.cos(a) * r * (1 - conv);
        const y = 900 + Math.sin(a) * r * (1 - conv);
        return <div key={i} style={{ position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, background: i % 3 ? C.blue2 : C.lime, opacity: 1 - show, boxShadow: `0 0 16px ${C.blue}` }} />;
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 36, transform: `scale(${0.5 + 0.5 * show})`, opacity: Math.min(1, show * 1.6), marginTop: -120 }}>
        <NanoMark size={220} glow />
        <div>
          <Txt size={150} style={{ letterSpacing: -7 }}>nano</Txt>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 44, letterSpacing: 16, color: C.dim, marginTop: 4 }}>MARKETING</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1150, opacity: tag, transform: `translateY(${(1 - tag) * 24}px)`, textAlign: "center" }}>
        <Txt size={66} weight={700} style={{ letterSpacing: -1.5 }}>
          Kichik agentlik. <span style={{ color: C.lime }}>Katta natija.</span>
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- G: call to action (18.5 – 21 s) ---------------- */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const a = useSp(0, 13, 160);
  const btn = useSp(8, 11, 170);
  const h = useSp(16, 14, 160);
  const pulse = f > 24 ? 1 + beat(f + s(18.5)) * 0.05 : 1;
  const shine = ((f - 20) % 40) / 40;
  const fade = p(f, 66, 75);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 40}px)`, marginTop: -200, textAlign: "center" }}>
        <Txt size={104}>Biznesingizni</Txt>
        <Txt size={104} color={C.lime}>o‘stiraylikmi?</Txt>
      </div>
      <div style={{ marginTop: 70, position: "relative", overflow: "hidden", borderRadius: 999, transform: `scale(${(0.4 + 0.6 * btn) * pulse})`, opacity: Math.min(1, btn * 2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "36px 70px", borderRadius: 999, background: C.lime, color: C.ink, fontFamily: INTER, fontWeight: 800, fontSize: 54, boxShadow: `0 0 80px ${C.lime}88` }}>
          <Send size={50} color={C.ink} strokeWidth={2.6} /> BEPUL MASLAHAT
        </div>
        {f > 20 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: -200 + shine * 1000, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)", transform: "skewX(-20deg)" }} />}
      </div>
      <div style={{ marginTop: 48, opacity: h, transform: `translateY(${(1 - h) * 20}px)`, display: "flex", alignItems: "center", gap: 14 }}>
        <Instagram size={46} color="#fff" />
        <Txt size={48} weight={700} style={{ letterSpacing: -0.5 }}>{HANDLE}</Txt>
      </div>
      <div style={{ marginTop: 18, opacity: h }}>
        <Txt size={34} weight={600} color={C.dim} style={{ letterSpacing: 0 }}>Direct’ga yozing</Txt>
      </div>
      <AbsoluteFill style={{ background: C.ink, opacity: fade }} />
    </AbsoluteFill>
  );
};

/* ---------------- assembly ---------------- */
const SC: [string, number, number, React.FC][] = [
  ["A spark", 0, 3.15, Spark],
  ["B audience", 3.15, 6.3, Audience],
  ["C profile", 6.3, 10.36, Grow],
  ["D orbit (drop)", 10.36, 13.5, Orbit],
  ["E growth", 13.5, 16.0, Growth],
  ["F logo", 16.0, 18.5, Logo],
  ["G cta", 18.5, 21.0, Cta],
];

// Soft zoom-through between scenes (except into the drop, which is a hard flash cut).
const Wrap: React.FC<{ dur: number; children: React.ReactNode; hardIn?: boolean; last?: boolean }> = ({ dur, children, hardIn, last }) => {
  const f = useCurrentFrame();
  const inn = hardIn ? 1 : p(f, 0, 9);
  const out = last ? 0 : p(f, dur - 6, dur);
  return <AbsoluteFill style={{ opacity: Math.min(inn, 1 - out), transform: `scale(${(0.9 + 0.1 * inn) * (1 + 0.15 * out)})`, filter: `blur(${(1 - inn) * 12 + out * 12}px)` }}>{children}</AbsoluteFill>;
};

const Cam: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const b = beat(f) * p(f, DROP - 2, DROP + 4);
  const kick = interpolate(f - DROP, [0, 10], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${noise2D("a", t * 0.3, 0) * 8 + Math.sin(f * 2.4) * kick * 18}px, ${noise2D("b", 0, t * 0.3) * 10}px) scale(${1 + b * 0.015 + kick * 0.06})` }}>{children}</AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.18 }}>
      <svg width="1080" height="1920">
        <filter id="gn2">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 12} />
        </filter>
        <rect width="1080" height="1920" filter="url(#gn2)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Nano2: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Space />
    <Cam>
      {SC.map(([name, a, b, El], i) => (
        <Sequence key={name} name={name} from={s(a)} durationInFrames={s(b) - s(a)}>
          <Wrap dur={s(b) - s(a)} hardIn={i === 0 || s(a) === DROP} last={i === SC.length - 1}>
            <El />
          </Wrap>
        </Sequence>
      ))}
    </Cam>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
    <Grain />
    <Audio name="Music: Pixeln World – Freedom (instrumental, from 31 s)" src={staticFile("nano/music2.wav")} />
  </AbsoluteFill>
);
