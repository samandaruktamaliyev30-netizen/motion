import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Audio } from "@remotion/media";
import { Clapperboard, Heart, Instagram, MessageCircle, Play, Scissors, Send } from "lucide-react";
import { INTER } from "../v4/ui";

// "Nano Marketing" agency promo — pure motion, cut to Gabrielis – Princeps Caeli (from 19.3 s).
export const FPS = 30;
export const DURATION = 552; // 18.4 s
const s = (sec: number) => Math.round(sec * FPS);
const HANDLE = "@samandar_uktamal1yev";

const C = {
  ink: "#06070B",
  white: "#FFFFFF",
  paper: "#F2F4F8",
  blue: "#2F5BFF",
  violet: "#7A3CFF",
  lime: "#C8FF3D",
  grad: "linear-gradient(150deg, #3D63FF 0%, #2F5BFF 45%, #7A3CFF 100%)",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const useSp = (d = 0, damping = 13, stiffness = 180) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - d, fps, config: { damping, stiffness, mass: 0.6 } });
};

// Scene windows (seconds), each change sits on a strong hit of the music.
const SC = {
  mijoz: [0, 1.57],
  topamiz: [1.57, 2.53],
  logo: [2.53, 4.41],
  target: [4.41, 5.38],
  kontent: [5.38, 6.31],
  montaj: [6.31, 7.26],
  smm: [7.26, 8.24],
  results: [8.24, 10.14],
  reels: [10.14, 12.07],
  words: [12.07, 14.65],
  end: [14.65, 18.4],
} as const;
const CUTS = Object.values(SC).map(([a]) => s(a)).filter((x) => x > 0);

const T: React.FC<{ size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties; weight?: number }> = ({ size, color = C.white, children, style, weight = 800 }) => (
  <div style={{ fontFamily: INTER, fontWeight: weight, fontSize: size, color, letterSpacing: -size * 0.045, lineHeight: 0.95, ...style }}>{children}</div>
);

// Letter-by-letter slam with 3D flip.
const Slam: React.FC<{ text: string; size: number; at?: number; color?: string; stagger?: number }> = ({ text, size, at = 0, color = C.white, stagger = 1.6 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", justifyContent: "center", perspective: 900 }}>
      {text.split("").map((ch, i) => {
        const sp = spring({ frame: f - at - i * stagger, fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: INTER, fontWeight: 800, fontSize: size, color, letterSpacing: -size * 0.04, transform: `translateY(${(1 - sp) * size * 0.9}px) rotateX(${(1 - sp) * 80}deg) scale(${0.6 + 0.4 * sp})`, opacity: f >= at + i * stagger ? 1 : 0, filter: `blur(${(1 - Math.min(1, sp)) * 10}px)`, whiteSpace: "pre" }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const Bg: React.FC<{ kind: "ink" | "blue" | "paper" }> = ({ kind }) => {
  const f = useCurrentFrame();
  const bg = kind === "ink" ? `radial-gradient(ellipse at 50% 40%, #12162A 0%, ${C.ink} 70%)` : kind === "blue" ? C.grad : `radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, ${C.paper} 75%)`;
  const ring = kind === "paper" ? "rgba(47,91,255,0.18)" : "rgba(255,255,255,0.14)";
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 540 - (380 + i * 260), top: 860 - (380 + i * 260), width: (380 + i * 260) * 2, height: (380 + i * 260) * 2, borderRadius: "50%", border: `2px solid ${ring}`, transform: `scale(${1 + ((f / 40 + i * 0.33) % 1) * 0.25})`, opacity: 1 - ((f / 40 + i * 0.33) % 1) }} />
      ))}
    </AbsoluteFill>
  );
};

// Brand mark: a "nano" dot that grows into the N monogram.
const Mark: React.FC<{ size: number; at?: number; dark?: boolean }> = ({ size, at = 0, dark }) => {
  const f = useCurrentFrame();
  const dot = useSp(at, 11, 160);
  const draw = p(f, at + 6, at + 22);
  const col = dark ? C.ink : C.white;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="mk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4A6CFF" />
          <stop offset="1" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <rect x={4} y={4} width={92} height={92} rx={26} fill="url(#mk)" transform={`translate(${50 - 50 * dot} ${50 - 50 * dot}) scale(${dot})`} />
      <path d="M30 72 V28 L70 72 V28" stroke={C.white} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <circle cx={78} cy={22} r={7} fill={C.lime} transform={`scale(${p(f, at + 18, at + 26)})`} style={{ transformOrigin: "78px 22px" }} />
      {col && null}
    </svg>
  );
};

const Wordmark: React.FC<{ at?: number; dark?: boolean; scale?: number }> = ({ at = 0, dark, scale = 1 }) => {
  const f = useCurrentFrame();
  const a = p(f, at + 10, at + 24);
  const b = p(f, at + 16, at + 30);
  const col = dark ? C.ink : C.white;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34 * scale }}>
      <Mark size={190 * scale} at={at} />
      <div style={{ overflow: "hidden" }}>
        <div style={{ transform: `translateX(${(1 - a) * -60}px)`, opacity: a }}>
          <T size={118 * scale} color={col} style={{ letterSpacing: -5 * scale }}>nano</T>
        </div>
        <div style={{ transform: `translateX(${(1 - b) * -40}px)`, opacity: b, fontFamily: INTER, fontWeight: 600, fontSize: 38 * scale, letterSpacing: 13 * scale, color: col, marginTop: 6 * scale }}>MARKETING</div>
      </div>
    </div>
  );
};

/* ---------------- scenes (local frames) ---------------- */

const Mijoz: React.FC = () => {
  const f = useCurrentFrame();
  const hit = s(0.62);
  const zoom = interpolate(f, [0, hit], [0.2, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const q = useSp(hit + 6);
  return (
    <AbsoluteFill>
      <Bg kind="ink" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {f < hit ? (
          <div style={{ width: 60, height: 60, borderRadius: 30, background: C.blue, transform: `scale(${zoom * 3})`, boxShadow: `0 0 80px ${C.blue}` }} />
        ) : (
          <div style={{ textAlign: "center" }}>
            <Slam text="MIJOZ" size={250} at={hit} stagger={1} />
            <div style={{ opacity: q, transform: `translateY(${(1 - q) * 30}px)`, marginTop: 24 }}>
              <T size={74} color="rgba(255,255,255,0.75)" weight={600} style={{ letterSpacing: -2 }}>kerakmi?</T>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Topamiz: React.FC = () => {
  const f = useCurrentFrame();
  const r = p(f, 0, 10);
  const line = p(f, 8, 18);
  return (
    <AbsoluteFill>
      <Bg kind="ink" />
      <AbsoluteFill style={{ clipPath: `circle(${r * 120}% at 50% 50%)` }}>
        <Bg kind="blue" />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <Slam text="BIZ" size={280} at={2} stagger={1.5} />
          <Slam text="TOPAMIZ" size={170} at={6} stagger={1} />
          <div style={{ width: 640 * line, height: 16, borderRadius: 8, background: C.ink, marginTop: 26 }} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const swipe = p(f, 0, 9);
  return (
    <AbsoluteFill>
      <Bg kind="blue" />
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - swipe * 100}%)` }}>
        <Bg kind="paper" />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Wordmark at={6} dark />
          <div style={{ position: "absolute", top: 1180, opacity: p(f, 30, 42), transform: `translateY(${(1 - p(f, 30, 42)) * 20}px)` }}>
            <T size={42} color="#5A6275" weight={600} style={{ letterSpacing: 0 }}>Kichik byudjet — katta natija</T>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const IconScene: React.FC<{ kind: "ink" | "blue" | "paper"; word: string; icon: React.ReactNode; wedge?: boolean }> = ({ kind, word, icon, wedge }) => {
  const f = useCurrentFrame();
  const sp = useSp(0, 11, 200);
  const w = p(f, 0, 8);
  const dark = kind === "paper" || !!wedge;
  return (
    <AbsoluteFill>
      <Bg kind={kind} />
      {wedge && <AbsoluteFill style={{ background: C.paper, clipPath: `polygon(0 ${100 - w * 45}%, 100% ${100 - w * 62}%, 100% 100%, 0 100%)` }} />}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${0.3 + 0.7 * sp}) rotate(${(1 - sp) * -25}deg)`, opacity: Math.min(1, sp * 2), marginTop: -120 }}>{icon}</div>
        <div style={{ marginTop: 70 }}>
          <Slam text={word} size={150} at={4} color={dark ? C.ink : C.white} stagger={1} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TargetScene: React.FC = () => {
  const f = useCurrentFrame();
  const arrow = p(f, 2, 12, Easing.in(Easing.quad));
  const hitShake = f > 12 && f < 22 ? Math.sin(f * 3) * (22 - f) * 0.8 : 0;
  return (
    <IconScene
      kind="blue"
      word="TARGET"
      wedge
      icon={
        <div style={{ position: "relative", width: 380, height: 380, transform: `translateX(${hitShake}px)` }}>
          {[190, 140, 90, 40].map((r, i) => (
            <div key={i} style={{ position: "absolute", left: 190 - r, top: 190 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `22px solid ${i % 2 ? C.blue : C.white}`, background: i === 3 ? C.white : "transparent", boxSizing: "border-box" }} />
          ))}
          <div style={{ position: "absolute", left: 190, top: 190, transform: `translate(${(1 - arrow) * 520}px, ${(1 - arrow) * -520}px) rotate(-45deg)`, transformOrigin: "0 0" }}>
            <div style={{ width: 300, height: 14, background: C.ink, borderRadius: 7 }} />
            <div style={{ position: "absolute", left: -40, top: -20, width: 0, height: 0, borderTop: "27px solid transparent", borderBottom: "27px solid transparent", borderRight: `48px solid ${C.ink}` }} />
          </div>
        </div>
      }
    />
  );
};

const Kontent: React.FC = () => (
  <IconScene
    kind="ink"
    word="KONTENT"
    icon={
      <div style={{ width: 300, height: 300, borderRadius: 80, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 30px 80px rgba(47,91,255,0.55), inset 0 4px 0 rgba(255,255,255,0.4)` }}>
        <Clapperboard size={160} color="#fff" strokeWidth={2} />
      </div>
    }
  />
);

const Montaj: React.FC = () => {
  const f = useCurrentFrame();
  const clips = [
    [0, 180, C.blue],
    [190, 120, C.violet],
    [320, 220, C.lime],
    [550, 150, C.white],
  ] as const;
  return (
    <AbsoluteFill>
      <Bg kind="blue" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginTop: -160, transform: `scale(${0.6 + 0.4 * p(f, 0, 8)})` }}>
          <div style={{ position: "relative", width: 720, height: 300, borderRadius: 40, background: "rgba(6,7,11,0.55)", border: "2px solid rgba(255,255,255,0.2)", padding: 30 }}>
            {[0, 1].map((row) => (
              <div key={row} style={{ position: "absolute", top: 40 + row * 120, left: 10 }}>
                {clips.map(([x, w, col], i) => {
                  const st = row * 4 + i * 2;
                  const k = p(f, st, st + 9);
                  return <div key={i} style={{ position: "absolute", left: x * 0.95 + (1 - k) * 300 * (row ? -1 : 1), width: w * 0.95, height: 90, borderRadius: 16, background: col, opacity: k * (row ? 0.75 : 1) }} />;
                })}
              </div>
            ))}
            <div style={{ position: "absolute", top: 10, bottom: 10, width: 6, borderRadius: 3, background: C.lime, left: 40 + p(f, 4, 28, (x) => x) * 640, boxShadow: `0 0 20px ${C.lime}` }} />
            <div style={{ position: "absolute", right: -40, top: -50, transform: `rotate(${p(f, 6, 16) * -30}deg)` }}>
              <div style={{ width: 120, height: 120, borderRadius: 34, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                <Scissors size={66} color={C.blue} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 80 }}>
          <Slam text="MONTAJ" size={160} at={4} stagger={1} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Smm: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg kind="paper" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 190px)", gap: 14, marginTop: -150 }}>
          {new Array(9).fill(0).map((_, i) => {
            const k = p(f, i * 1.6, i * 1.6 + 8);
            const cols = [C.blue, C.ink, C.violet, C.lime, C.blue, C.ink, C.violet, C.blue, C.lime];
            return <div key={i} style={{ width: 190, height: 190, borderRadius: 24, background: cols[i], transform: `scale(${k}) rotate(${(1 - k) * 20}deg)`, opacity: k }} />;
          })}
        </div>
        <div style={{ position: "absolute", top: 380, left: 760, transform: `scale(${useSp(6)})` }}>
          <div style={{ width: 150, height: 150, borderRadius: 44, background: "linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
            <Instagram size={88} color="#fff" />
          </div>
        </div>
        <div style={{ marginTop: 70 }}>
          <Slam text="SMM" size={190} at={3} color={C.ink} stagger={1.5} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Results: React.FC = () => {
  const f = useCurrentFrame();
  const second = s(9.19) - s(8.24);
  const views = Math.round(interpolate(f, [0, second], [0, 250], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const bars = [0.25, 0.5, 0.78, 1];
  const isB = f >= second;
  return (
    <AbsoluteFill>
      <Bg kind="paper" />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 420, textAlign: "center" }}>
          <div style={{ position: "relative", height: 150, overflow: "hidden", width: 1000 }}>
            <div style={{ position: "absolute", left: 0, right: 0, transform: `translateY(${isB ? -150 * p(f, second, second + 8) : 0}px)` }}>
              {["KO‘RISH", "MIJOZ"].map((w) => (
                <T key={w} size={140} color={C.ink} style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: C.blue }}>+</span>
                  {w}
                </T>
              ))}
            </div>
          </div>
          <T size={64} color="#5A6275" weight={700} style={{ marginTop: 14, letterSpacing: -1 }}>
            {isB ? "ko‘proq so‘rov, ko‘proq savdo" : `${views}K+ ko‘rish`}
          </T>
        </div>
        <div style={{ position: "absolute", top: 820, display: "flex", alignItems: "flex-end", gap: 40, height: 620, borderBottom: `8px solid ${C.ink}`, padding: "0 30px" }}>
          {bars.map((h, i) => {
            const k = p(f, isB ? second + i * 2 : i * 3, isB ? second + 12 + i * 2 : 14 + i * 3);
            const hh = (isB ? h : h * 0.45) * 600;
            return <div key={i} style={{ width: 150, height: hh * k + (isB ? 0.45 * h * 600 * (1 - k) : 0), borderRadius: "22px 22px 0 0", background: i === 3 ? C.grad : C.blue, opacity: 0.6 + i * 0.13 }} />;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ width: 360, height: 720, borderRadius: 56, background: "#0E1118", padding: 14, boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.12)", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 44, overflow: "hidden", position: "relative" }}>{children}</div>
  </div>
);

const ReelUI: React.FC<{ f: number; body: React.ReactNode; bg: string }> = ({ f, body, bg }) => (
  <AbsoluteFill style={{ background: bg }}>
    {body}
    <div style={{ position: "absolute", right: 18, bottom: 120, display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
      <Heart size={40} color="#fff" fill={f % 30 < 15 ? "#FF3B5C" : "transparent"} />
      <MessageCircle size={38} color="#fff" />
      <Send size={36} color="#fff" />
    </div>
    <div style={{ position: "absolute", left: 22, bottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: C.grad, border: "2px solid #fff" }} />
      <div style={{ width: 150, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.85)" }} />
    </div>
  </AbsoluteFill>
);

const Reels: React.FC = () => {
  const f = useCurrentFrame();
  const swap = s(11.12) - s(10.14);
  const inn = useSp(0, 14, 140);
  const rot = interpolate(f, [swap - 4, swap + 8], [0, 1], { ...clamp, easing: ease });
  const phones = [
    { bg: C.grad, body: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><div style={{ width: 150, height: 150, borderRadius: 75, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={70} color="#fff" fill="#fff" /></div></AbsoluteFill> },
    { bg: "linear-gradient(180deg,#E9EEFF,#AFC0FF)", body: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><div style={{ display: "flex", gap: 18, alignItems: "flex-end", height: 260 }}>{[0.4, 0.7, 1].map((h, i) => <div key={i} style={{ width: 60, height: 260 * h * p(f, 4 + i * 3, 16 + i * 3), background: C.blue, borderRadius: 10 }} />)}</div></AbsoluteFill> },
    { bg: "linear-gradient(180deg,#1B1F2E,#07080D)", body: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><T size={96} color={C.lime}>1.2M</T></AbsoluteFill> },
  ];
  // hearts burst
  const hearts = new Array(10).fill(0).map((_, i) => {
    const st = 6 + i * 3;
    const k = p(f, st, st + 24, (x) => x);
    if (f < st) return null;
    return <Heart key={i} size={50 + (i % 3) * 14} color="#FF3B5C" fill="#FF3B5C" style={{ position: "absolute", left: 640 + Math.sin(i * 2.1) * 120 + k * 60, top: 1250 - k * 700, opacity: 1 - k, transform: `rotate(${Math.sin(i) * 30}deg)` }} />;
  });
  return (
    <AbsoluteFill>
      <Bg kind="ink" />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 230 }}>
          <Slam text="REELS" size={160} at={0} stagger={1} />
        </div>
        <div style={{ position: "absolute", top: 560, width: 1080, height: 800, perspective: 1600 }}>
          {phones.map((ph, i) => {
            const slot = ((i - Math.round(rot)) % 3 + 3) % 3; // 0 center, 1 right, 2 left
            const pos = i - rot; // continuous carousel
            const x = pos * 340;
            const z = -Math.abs(pos) * 260;
            const ry = -pos * 28;
            void slot;
            return (
              <div key={i} style={{ position: "absolute", left: 540 - 180 + x * inn + (1 - inn) * (i - 1) * 60, top: 0, transform: `translateZ(${z}px) rotateY(${ry}deg) translateY(${(1 - inn) * 600}px)`, opacity: Math.abs(pos) > 1.6 ? 0 : 1, zIndex: 10 - Math.round(Math.abs(pos) * 3) }}>
                <Phone>
                  <ReelUI f={f} bg={ph.bg} body={ph.body} />
                </Phone>
              </div>
            );
          })}
        </div>
        {hearts}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WORDS: [string, number, "ink" | "blue" | "paper"][] = [
  ["STRATEGIYA", 12.07, "blue"],
  ["KONTENT", 12.72, "ink"],
  ["REKLAMA", 13.37, "paper"],
  ["SOTUV", 14.0, "blue"],
];
const Words: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(12.07);
  const idx = WORDS.reduce((acc, [, sec], i) => (f + t0 >= s(sec) ? i : acc), 0);
  const [w, sec, kind] = WORDS[idx];
  const local = f + t0 - s(sec);
  const k = p(local, 0, 7);
  const dark = kind === "paper";
  return (
    <AbsoluteFill>
      <Bg kind={kind} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${1.5 - 0.5 * k})`, filter: `blur(${(1 - k) * 12}px)`, opacity: k }}>
          <T size={w.length > 8 ? 150 : 200} color={dark ? C.ink : C.white} style={{ textAlign: "center" }}>
            {w}
          </T>
        </div>
        <div style={{ position: "absolute", top: 1150, display: "flex", gap: 16 }}>
          {WORDS.map((_, i) => (
            <div key={i} style={{ width: i === idx ? 70 : 20, height: 20, borderRadius: 10, background: dark ? C.ink : C.white, opacity: i <= idx ? 1 : 0.3 }} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const r = p(f, 0, 12);
  const h = useSp(26, 14, 160);
  const btn = useSp(36, 12, 170);
  const pulse = 1 + Math.max(0, Math.sin((f - 50) / 6)) * 0.04 * (f > 50 ? 1 : 0);
  const shine = ((f - 50) % 45) / 45;
  return (
    <AbsoluteFill>
      <Bg kind="paper" />
      <AbsoluteFill style={{ clipPath: `circle(${r * 120}% at 50% 50%)` }}>
        <Bg kind="blue" />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ marginTop: -180 }}>
            <Wordmark at={4} scale={1.05} />
          </div>
          <div style={{ marginTop: 80, opacity: h, transform: `translateY(${(1 - h) * 30}px)`, display: "flex", alignItems: "center", gap: 14 }}>
            <Instagram size={44} color="#fff" />
            <T size={46} weight={700} style={{ letterSpacing: -0.5 }}>{HANDLE}</T>
          </div>
          <div style={{ marginTop: 56, transform: `scale(${(0.5 + 0.5 * btn) * pulse})`, opacity: Math.min(1, btn * 2), position: "relative", overflow: "hidden", borderRadius: 999 }}>
            <div style={{ padding: "34px 80px", background: C.white, borderRadius: 999, fontFamily: INTER, fontWeight: 800, fontSize: 52, color: C.blue, letterSpacing: 1, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>BEPUL MASLAHAT</div>
            {f > 50 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: -200 + shine * 900, background: "linear-gradient(90deg, transparent, rgba(47,91,255,0.25), transparent)", transform: "skewX(-20deg)" }} />}
          </div>
          <div style={{ marginTop: 30, opacity: p(f, 50, 62) }}>
            <T size={34} weight={600} color="rgba(255,255,255,0.8)" style={{ letterSpacing: 0 }}>Direct’ga yozing</T>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MAP: Record<keyof typeof SC, React.FC> = {
  mijoz: Mijoz,
  topamiz: Topamiz,
  logo: Logo,
  target: TargetScene,
  kontent: Kontent,
  montaj: Montaj,
  smm: Smm,
  results: Results,
  reels: Reels,
  words: Words,
  end: End,
};

// Punch-in + RGB split on every cut, film grain over everything.
const Fx: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const c = CUTS.filter((x) => x <= f).pop() ?? -100;
  const k = interpolate(f - c, [0, 7], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + k * 0.07})`, filter: k > 0.05 ? `drop-shadow(${k * 10}px 0 0 rgba(255,0,80,0.5)) drop-shadow(${-k * 10}px 0 0 rgba(0,200,255,0.5))` : "none" }}>
      {children}
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.22 }}>
      <svg width="1080" height="1920">
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 12} />
        </filter>
        <rect width="1080" height="1920" filter="url(#gn)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Nano: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Fx>
      {(Object.keys(SC) as (keyof typeof SC)[]).map((k) => {
        const [a, b] = SC[k];
        const El = MAP[k];
        return (
          <Sequence key={k} name={k} from={s(a)} durationInFrames={s(b) - s(a)}>
            <El />
          </Sequence>
        );
      })}
    </Fx>
    <Grain />
    <Audio name="Music: Gabrielis – Princeps Caeli (from 19.3 s)" src={staticFile("nano/music.wav")} />
  </AbsoluteFill>
);
