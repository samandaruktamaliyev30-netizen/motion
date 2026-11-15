import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import {
  BadgeCheck,
  BarChart3,
  CalendarCheck,
  Camera,
  Clapperboard,
  Coins,
  Crosshair,
  Filter,
  Heart,
  Instagram,
  Map,
  Mic,
  Send,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { INTER } from "../v4/ui";
import WORDS_RAW from "./words.json";
import WARP from "./warp.json";

// Nano Marketing — services promo with an Uzbek voice-over (uz-UZ-SardorNeural).
// Calm, stable motion: no camera shake, no grain, no streaks. Music: Pixeln World – Freedom
// (instrumental) from 38.52 s so its drop hits "Nano Marketing".
export const FPS = 30;
export const DURATION = 1185; // 39.5 s
// All times in this file are written on the original TTS timeline; WARP maps them onto the
// user's own recorded voice-over (anchors = start of each of the 59 words in both takes).
const W_OLD = (WARP.old as number[]);
const W_NEW = (WARP.new as number[]);
const warp = (t: number) => {
  if (t <= W_OLD[0]) return Math.max(0, t - W_OLD[0] + W_NEW[0]);
  for (let i = 1; i < W_OLD.length; i++) {
    if (t <= W_OLD[i]) return W_NEW[i - 1] + ((t - W_OLD[i - 1]) / (W_OLD[i] - W_OLD[i - 1])) * (W_NEW[i] - W_NEW[i - 1]);
  }
  return t - W_OLD[W_OLD.length - 1] + W_NEW[W_NEW.length - 1];
};
const s = (sec: number) => Math.min(DURATION, Math.round(warp(sec) * FPS));
const HANDLE = "@nano_marketinguz";

type RawWord = [string, number, number];
const WORDS = (WORDS_RAW as RawWord[]).map(([w, a]) => ({ w: w.replace("Es-em-em", "SMM").replace("Direktga", "Direct’ga").replace(/'/g, "‘"), t: a }));

const C = {
  ink: "#04050A",
  navy: "#0A1030",
  blue: "#3D6BFF",
  blue2: "#7C96FF",
  lime: "#C8FF3D",
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.62)",
  glass: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015))",
  border: "1.5px solid rgba(255,255,255,0.16)",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const useSp = (d = 0, damping = 16, stiffness = 140) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - d, fps, config: { damping, stiffness, mass: 0.7 } });
};

// Scene windows (seconds) — follow the voice-over.
const SC = {
  hook: [0, 2.75],
  brand: [2.75, 7.05],
  shaxsiy: [7.05, 11.7],
  smm: [11.7, 15.35],
  target: [15.35, 19.8],
  perf: [19.8, 24.95],
  strat: [24.95, 29.65],
  team: [29.65, 33.95],
  cta: [33.95, 99],
} as const;

/* ---------------- shared pieces ---------------- */
// Alpha mode: rendered without background to overlay on the user's own footage.
const AlphaCtx = React.createContext(false);
const useAlpha = () => React.useContext(AlphaCtx);
const SHADOW = "0 3px 14px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.6)";

const Txt: React.FC<{ size: number; color?: string; weight?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = C.white, weight = 800, style, children }) => {
  const alpha = useAlpha();
  return <div style={{ fontFamily: INTER, fontSize: size, fontWeight: weight, color, letterSpacing: -size * 0.035, lineHeight: 1.05, textShadow: alpha ? SHADOW : undefined, ...style }}>{children}</div>;
};

// Frosted glass — see-through: the background shows through the card.
const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const alpha = useAlpha();
  return (
    <div
      style={{
        background: alpha ? "linear-gradient(160deg, rgba(14,18,40,0.55), rgba(8,10,22,0.38))" : C.glass,
        border: C.border,
        borderRadius: 36,
        backdropFilter: "blur(10px)",
        boxShadow: alpha ? "0 20px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)" : "0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
        fontFamily: INTER,
        color: C.white,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Voice-synced caption: words of the voice-over between [from, to) seconds, each appears when spoken.
const Spoken: React.FC<{ from: number; to: number; sceneStart: number; size?: number; accent?: string[]; top: number }> = ({ from, to, sceneStart, size = 54, accent = [], top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ws = WORDS.filter((w) => w.t >= from - 0.01 && w.t < to);
  return (
    <AbsoluteFill style={{ top, height: "auto", alignItems: "center" }}>
      <div style={{ width: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `4px ${size * 0.26}px` }}>
        {ws.map((w, i) => {
          const st = s(w.t) - s(sceneStart);
          const sp = spring({ frame: f - st, fps, config: { damping: 18, stiffness: 160, mass: 0.6 } });
          const acc = accent.some((a) => w.w.toLowerCase().startsWith(a));
          return (
            <span key={i} style={{ display: "inline-block", textShadow: SHADOW, fontFamily: INTER, fontWeight: acc ? 800 : 600, fontSize: size, letterSpacing: -size * 0.02, color: acc ? C.lime : f >= st ? C.white : "rgba(255,255,255,0)", opacity: f >= st ? Math.min(1, sp * 1.3) : 0, transform: `translateY(${(1 - sp) * 22}px)` }}>
              {w.w.replace(/[:]$/, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ n: string; title: string; at?: number }> = ({ n, title, at = 0 }) => {
  const sp = useSp(at);
  return (
    <AbsoluteFill style={{ top: 250, height: "auto", alignItems: "center" }}>
      <div style={{ opacity: sp, transform: `translateY(${(1 - sp) * 40}px)`, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "10px 24px", borderRadius: 999, border: `1.5px solid ${C.lime}`, color: C.lime, fontFamily: INTER, fontWeight: 700, fontSize: 28, letterSpacing: 3 }}>XIZMAT {n}</div>
        <Txt size={112} style={{ marginTop: 22 }}>{title}</Txt>
      </div>
    </AbsoluteFill>
  );
};

const IconTile: React.FC<{ Icon: typeof Mic; size?: number; tone?: "blue" | "lime" | "glass" }> = ({ Icon, size = 150, tone = "blue" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: tone === "blue" ? "linear-gradient(160deg,#6C8DFF,#2A49E0)" : tone === "lime" ? "linear-gradient(160deg,#E2FF8A,#9BD316)" : C.glass,
      border: tone === "glass" ? C.border : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: tone === "blue" ? "0 20px 50px rgba(61,107,255,0.45), inset 0 3px 0 rgba(255,255,255,0.35)" : tone === "lime" ? "0 20px 50px rgba(200,255,61,0.35), inset 0 3px 0 rgba(255,255,255,0.5)" : "0 20px 40px rgba(0,0,0,0.35)",
    }}
  >
    <Icon size={size * 0.5} color={tone === "lime" ? C.ink : "#fff"} strokeWidth={2.1} />
  </div>
);

const NanoMark: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 30px rgba(61,107,255,0.7))` }}>
    <defs>
      <linearGradient id="nm3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5C82FF" />
        <stop offset="1" stopColor="#2A49E0" />
      </linearGradient>
    </defs>
    <rect x={2} y={2} width={96} height={96} rx={28} fill="url(#nm3)" />
    <rect x={2} y={2} width={96} height={44} rx={28} fill="#fff" opacity={0.12} />
    <path d="M30 72 V30 L70 70 V30" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    <circle cx={79} cy={21} r={8 * Math.min(1, draw * 1.2)} fill={C.lime} />
  </svg>
);

/* ---------------- calm background ---------------- */
const Space: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, ${C.navy} 0%, ${C.ink} 72%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -160 + Math.sin(t * 0.25) * 60, top: 0, width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(circle, rgba(61,107,255,0.28) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", left: -100 + Math.cos(t * 0.2) * 60, top: 1000, width: 1300, height: 1300, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,255,61,0.07) 0%, transparent 60%)" }} />
      {/* slow floating dots (round, soft — no streaks) */}
      {new Array(34).fill(0).map((_, i) => {
        const x = (i * 157.3) % 1080;
        const depth = 0.3 + (i % 6) / 6;
        const y = (((i * 331) % 2000) - f * 0.35 * depth + 4000) % 2000 - 40;
        const sz = 3 + depth * 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: "#fff", opacity: 0.06 + depth * 0.16 }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------- scenes ---------------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const line = p(f, 10, 70, Easing.inOut(Easing.cubic));
  const d = "M140 1460 C 360 1440, 420 1300, 560 1260 S 820 1060, 940 860";
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="hl" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={C.blue} />
            <stop offset="1" stopColor={C.lime} />
          </linearGradient>
        </defs>
        <path d={d} stroke="url(#hl)" strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} style={{ filter: `drop-shadow(0 0 16px ${C.lime})` }} />
      </svg>
      <div style={{ position: "absolute", left: 140 + (940 - 140) * line - 22, top: 1460 + (860 - 1460) * line - 22, width: 44, height: 44, borderRadius: 22, background: C.lime, boxShadow: `0 0 40px ${C.lime}` }} />
      <Spoken from={0} to={2.7} sceneStart={0} size={104} accent={["o‘sish"]} top={420} />
    </AbsoluteFill>
  );
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  const st = s(2.84) - s(2.75);
  const draw = p(f, st, st + 22);
  const name = useSp(st + 8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: -160 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * useSp(st)})`, opacity: useSp(st) }}>
          <NanoMark size={230} draw={draw} />
        </div>
        <div style={{ opacity: name, transform: `translateX(${(1 - name) * -40}px)` }}>
          <Txt size={156} style={{ letterSpacing: -7 }}>nano</Txt>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 46, letterSpacing: 17, color: C.dim, marginTop: 4 }}>MARKETING</div>
        </div>
      </div>
      <Spoken from={4.6} to={7} sceneStart={2.75} size={72} accent={["natija"]} top={1180} />
    </AbsoluteFill>
  );
};

// 01 Shaxsiy brend — expert profile with verified badge, rising reach.
const Shaxsiy: React.FC = () => {
  const f = useCurrentFrame();
  const card = useSp(6);
  const verified = p(f, s(9.6) - s(7.05), s(9.6) - s(7.05) + 10); // "ekspertga"
  const reach = Math.round(interpolate(f, [20, 120], [1.2, 86], { ...clamp, easing: Easing.out(Easing.cubic) }) * 10) / 10;
  return (
    <AbsoluteFill>
      <Badge n="01" title="Shaxsiy brend" />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 640, opacity: card, transform: `translateY(${(1 - card) * 60}px)` }}>
          <Glass style={{ width: 820, padding: "40px 44px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: 170, height: 170, borderRadius: 85, padding: 6, background: `conic-gradient(${C.lime}, ${C.blue}, ${C.lime})` }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#141A33", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserRound size={96} color="#fff" />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Txt size={50}>Siz</Txt>
                  <div style={{ transform: `scale(${verified})` }}>
                    <BadgeCheck size={50} color={C.ink} fill={C.lime} />
                  </div>
                </div>
                <div style={{ marginTop: 10, display: "inline-block", padding: "8px 20px", borderRadius: 999, background: verified > 0.5 ? C.lime : "rgba(255,255,255,0.12)", color: verified > 0.5 ? C.ink : C.dim, fontWeight: 800, fontSize: 30 }}>
                  {verified > 0.5 ? "Ekspert" : "Mutaxassis"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 34 }}>
              {[
                [TrendingUp, `${reach}K`, "qamrov"],
                [Mic, "24", "chiqish"],
                [Heart, "9.4%", "ishonch"],
              ].map(([Icon, v, l], i) => {
                const I = Icon as typeof Mic;
                return (
                  <div key={i} style={{ flex: 1, padding: "20px 0", borderRadius: 24, background: "rgba(255,255,255,0.06)", textAlign: "center", opacity: p(f, 14 + i * 6, 26 + i * 6) }}>
                    <I size={40} color={C.lime} />
                    <Txt size={44} style={{ marginTop: 8 }}>{v as string}</Txt>
                    <Txt size={24} weight={500} color={C.dim}>{l as string}</Txt>
                  </div>
                );
              })}
            </div>
          </Glass>
        </div>
      </AbsoluteFill>
      <Spoken from={7.9} to={11.6} sceneStart={7.05} accent={["ekspert"]} top={1420} />
    </AbsoluteFill>
  );
};

// 02 SMM — posting calendar + feed filling.
const Smm: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [C.blue, "#1C2340", C.lime, "#2B3360", C.blue2, "#151A30", "#2B3360", C.blue, "#1C2340"];
  return (
    <AbsoluteFill>
      <Badge n="02" title="SMM" />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 640, display: "flex", gap: 30 }}>
          <div style={{ opacity: useSp(4), transform: `translateX(${(1 - useSp(4)) * -80}px)` }}>
            <Glass style={{ width: 400, padding: 30 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CalendarCheck size={40} color={C.lime} />
                <Txt size={34}>Kontent-reja</Txt>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginTop: 22 }}>
                {new Array(28).fill(0).map((_, i) => {
                  const on = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26].includes(i);
                  const k = p(f, 8 + i * 1.2, 14 + i * 1.2);
                  return <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: on ? (k > 0.5 ? C.lime : "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.06)", transform: `scale(${on ? 0.8 + 0.2 * k : 1})` }} />;
                })}
              </div>
            </Glass>
          </div>
          <div style={{ opacity: useSp(8), transform: `translateX(${(1 - useSp(8)) * 80}px)` }}>
            <Glass style={{ width: 400, padding: 30 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Instagram size={40} color="#fff" />
                <Txt size={34}>Lenta</Txt>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 22 }}>
                {cols.map((c, i) => {
                  const k = p(f, 14 + i * 4, 24 + i * 4);
                  return <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: c, transform: `scale(${k})`, opacity: k }} />;
                })}
              </div>
            </Glass>
          </div>
        </div>
      </AbsoluteFill>
      <Spoken from={12.2} to={15.3} sceneStart={11.7} accent={["tizimli", "jonli"]} top={1300} />
    </AbsoluteFill>
  );
};

// 03 Targeting — crosshair locks onto the right audience.
const TargetScene: React.FC = () => {
  const f = useCurrentFrame();
  const lock = s(17.64) - s(15.35); // "auditoriyaga"
  const lk = p(f, lock - 10, lock + 4);
  const dots = new Array(30).fill(0).map((_, i) => ({ x: 120 + ((i * 173) % 840), y: 60 + ((i * 97) % 560), right: i % 4 === 0 }));
  const cx = interpolate(lk, [0, 1], [300, 540]);
  const cy = interpolate(lk, [0, 1], [200, 330]);
  return (
    <AbsoluteFill>
      <Badge n="03" title="Targeting" />
      <AbsoluteFill style={{ top: 620, height: 700 }}>
        {dots.map((d, i) => {
          const k = p(f, 4 + i * 0.8, 12 + i * 0.8);
          const dim = d.right ? 1 : 1 - 0.75 * lk;
          const pull = d.right ? lk : 0;
          const x = d.x + (540 - d.x) * pull * 0.55;
          const y = d.y + (330 - d.y) * pull * 0.55;
          return (
            <div key={i} style={{ position: "absolute", left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: d.right ? C.lime : C.blue, opacity: k * dim, transform: `scale(${k * (d.right ? 1 + lk * 0.2 : 1)})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: d.right ? `0 0 ${20 * lk}px ${C.lime}` : "none" }}>
              <UserRound size={34} color={d.right ? C.ink : "#fff"} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: cx - 150, top: cy - 150, width: 300, height: 300, opacity: p(f, 10, 20) }}>
          <Crosshair size={300} color={lk > 0.9 ? C.lime : "#fff"} strokeWidth={1.2} />
        </div>
      </AbsoluteFill>
      <Spoken from={16} to={19.7} sceneStart={15.35} accent={["kerakli", "auditoriya"]} top={1380} />
    </AbsoluteFill>
  );
};

// 04 Performance marketing — every so'm turns into a result.
const Perf: React.FC = () => {
  const f = useCurrentFrame();
  const coinAt = s(22.2) - s(19.8); // "so'm"
  const res = s(22.44) - s(19.8); // "natija"
  const flip = p(f, res - 4, res + 8);
  const roas = (interpolate(f, [res, res + 50], [1.0, 4.2], clamp)).toFixed(1);
  return (
    <AbsoluteFill>
      <Badge n="04" title="Performance marketing" />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 700, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ opacity: useSp(coinAt - 6), transform: `rotateY(${flip * 180}deg)` }}>
            {flip < 0.5 ? <IconTile Icon={Coins} tone="glass" size={220} /> : <div style={{ transform: "rotateY(180deg)" }}><IconTile Icon={TrendingUp} tone="lime" size={220} /></div>}
          </div>
          <div style={{ opacity: useSp(6) }}>
            <Glass style={{ width: 430, padding: "28px 32px" }}>
              {[
                ["ROAS", `${roas}x`, true],
                ["Lid narxi", flip > 0.5 ? "↓ 38%" : "—", false],
                ["Konversiya", flip > 0.5 ? "↑ 2.6x" : "—", false],
              ].map(([l, v, big], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                  <Txt size={30} weight={500} color={C.dim}>{l as string}</Txt>
                  <Txt size={big ? 62 : 40} color={big ? C.lime : "#fff"}>{v as string}</Txt>
                </div>
              ))}
            </Glass>
          </div>
        </div>
        <div style={{ position: "absolute", top: 1010, display: "flex", alignItems: "flex-end", gap: 18, height: 240, opacity: useSp(10) }}>
          {[0.25, 0.32, 0.3, 0.45, 0.55, 0.7, 0.85, 1].map((h, i) => (
            <div key={i} style={{ width: 70, height: 240 * h * p(f, res + i * 2, res + 14 + i * 2) + 8, borderRadius: 12, background: i === 7 ? C.lime : "rgba(124,150,255,0.75)" }} />
          ))}
        </div>
      </AbsoluteFill>
      <Spoken from={21.1} to={24.9} sceneStart={19.8} accent={["natija", "so‘m"]} top={1390} />
    </AbsoluteFill>
  );
};

// 05 Strategik marketing — roadmap with milestones.
const Strat: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [typeof Map, string][] = [
    [BarChart3, "Tahlil"],
    [Map, "Reja"],
    [Filter, "Ijro"],
    [TrendingUp, "O‘sish"],
  ];
  const road = p(f, 8, 110, Easing.inOut(Easing.cubic));
  const pts = [
    [190, 360],
    [430, 210],
    [650, 380],
    [890, 180],
  ];
  return (
    <AbsoluteFill>
      <Badge n="05" title="Strategik marketing" />
      <AbsoluteFill style={{ top: 620, height: 640 }}>
        <svg width={1080} height={640} style={{ position: "absolute" }}>
          <path d="M190 360 C 300 360, 320 210, 430 210 S 560 380, 650 380 S 800 180, 890 180" stroke="rgba(255,255,255,0.15)" strokeWidth={12} fill="none" strokeLinecap="round" />
          <path d="M190 360 C 300 360, 320 210, 430 210 S 560 380, 650 380 S 800 180, 890 180" stroke={C.lime} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - road} />
        </svg>
        {steps.map(([Icon, l], i) => {
          const k = p(f, 8 + i * 30, 20 + i * 30);
          return (
            <div key={i} style={{ position: "absolute", left: pts[i][0] - 75, top: pts[i][1] - 75, textAlign: "center", opacity: 0.35 + 0.65 * k, transform: `scale(${0.85 + 0.15 * k})` }}>
              <IconTile Icon={Icon} size={150} tone={k > 0.5 && i === 3 ? "lime" : k > 0.5 ? "blue" : "glass"} />
              <Txt size={36} style={{ marginTop: 14 }}>{l}</Txt>
            </div>
          );
        })}
      </AbsoluteFill>
      <Spoken from={26.2} to={29.6} sceneStart={24.95} accent={["aniq", "o‘sish"]} top={1360} />
    </AbsoluteFill>
  );
};

// Extras + one team: chips gather around the team core.
const CHIPS: [typeof Mic, string, number][] = [
  [Clapperboard, "Kontent", 29.74],
  [Camera, "Mobilografiya", 30.29],
  [Filter, "Sotuv voronkasi", 31.12],
  [UserRound, "Shaxsiy brend", 32.08],
  [Instagram, "SMM", 32.08],
  [Crosshair, "Targeting", 32.08],
  [TrendingUp, "Performance", 32.08],
  [Map, "Strategiya", 32.08],
];
const Team: React.FC = () => {
  const f = useCurrentFrame();
  const gather = p(f, s(32.08) - s(29.65), s(32.8) - s(29.65));
  const core = useSp(s(32.08) - s(29.65));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ top: 250, height: "auto", alignItems: "center" }}>
        <Txt size={96} style={{ textAlign: "center", opacity: useSp(0) }}>
          …va <span style={{ color: C.lime }}>yana</span>
        </Txt>
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 560, height: 820 }}>
        {CHIPS.map(([Icon, l, t], i) => {
          const st = s(t) - s(29.65) + (i > 2 ? (i - 3) * 2 : 0);
          const k = p(f, st, st + 10);
          const a = (i / CHIPS.length) * Math.PI * 2 - Math.PI / 2;
          const free = [
            [540, 90],
            [540, 230],
            [540, 370],
            [200, 120],
            [880, 120],
            [200, 600],
            [880, 600],
            [540, 700],
          ][i];
          const ring = [540 + Math.cos(a) * 360, 400 + Math.sin(a) * 300];
          const x = free[0] + (ring[0] - free[0]) * gather;
          const y = free[1] + (ring[1] - free[1]) * gather;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k * (1 - gather * 0.15)})`, opacity: k, width: "max-content" }}>
              <Glass style={{ borderRadius: 999, padding: "16px 26px", display: "flex", alignItems: "center", gap: 14, border: i < 3 ? `1.5px solid ${C.lime}` : C.border }}>
                <Icon size={38} color={i < 3 ? C.lime : "#fff"} />
                <Txt size={36} weight={700}>{l}</Txt>
              </Glass>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 540 - 110, top: 400 - 110, transform: `scale(${core})`, opacity: core }}>
          <div style={{ width: 220, height: 220, borderRadius: 110, background: "linear-gradient(160deg,#6C8DFF,#2A49E0)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(61,107,255,0.6)" }}>
            <Users size={110} color="#fff" />
          </div>
        </div>
      </AbsoluteFill>
      <Spoken from={32.0} to={33.9} sceneStart={29.65} size={64} accent={["bitta", "jamoa"]} top={1460} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const alpha = useAlpha();
  const logo = useSp(0);
  const btn = useSp(6, 13, 150);
  const h = useSp(20);
  const shine = ((f - 24) % 50) / 50;
  const fade = p(f, DURATION - s(SC.cta[0]) - 12, DURATION - s(SC.cta[0]) - 1);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 420, display: "flex", alignItems: "center", gap: 26, opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }}>
        <NanoMark size={140} />
        <div>
          <Txt size={96} style={{ letterSpacing: -4 }}>nano</Txt>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, letterSpacing: 11, color: C.dim }}>MARKETING</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 700, opacity: logo }}>
        <Txt size={52} weight={700} color={C.dim} style={{ textAlign: "center", letterSpacing: -1 }}>
          Natijaga asoslangan agentlik
        </Txt>
      </div>
      <div style={{ position: "absolute", top: 880, overflow: "hidden", borderRadius: 999, transform: `scale(${0.6 + 0.4 * btn})`, opacity: btn }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "36px 74px", borderRadius: 999, background: C.lime, color: C.ink, fontFamily: INTER, fontWeight: 800, fontSize: 56, boxShadow: `0 0 80px ${C.lime}77` }}>
          <Send size={52} color={C.ink} strokeWidth={2.6} /> BEPUL MASLAHAT
        </div>
        {f > 24 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: -200 + shine * 1100, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)", transform: "skewX(-20deg)" }} />}
      </div>
      <div style={{ position: "absolute", top: 1100, display: "flex", alignItems: "center", gap: 14, opacity: h, transform: `translateY(${(1 - h) * 20}px)` }}>
        <Instagram size={48} color="#fff" />
        <Txt size={50} weight={700} style={{ letterSpacing: -0.5 }}>{HANDLE}</Txt>
      </div>
      <Spoken from={34.1} to={36.2} sceneStart={33.95} size={52} accent={["direct"]} top={1260} />
      {alpha ? null : <AbsoluteFill style={{ background: C.ink, opacity: fade }} />}
    </AbsoluteFill>
  );
};

const MAP: Record<keyof typeof SC, React.FC> = { hook: Hook, brand: Brand, shaxsiy: Shaxsiy, smm: Smm, target: TargetScene, perf: Perf, strat: Strat, team: Team, cta: Cta };

// Gentle fade/slide between scenes — no blur zooms, no shake.
const Wrap: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const f = useCurrentFrame();
  const inn = first ? 1 : p(f, 0, 10);
  const out = last ? 0 : p(f, dur - 8, dur, Easing.in(Easing.cubic));
  return <AbsoluteFill style={{ opacity: Math.min(inn, 1 - out), transform: `translateY(${(1 - inn) * 40 - out * 40}px)` }}>{children}</AbsoluteFill>;
};

// Anti-reupload handle: small and low for the whole video, hidden on the end card (which shows it large).
const Watermark: React.FC = () => {
  const f = useCurrentFrame();
  const o = 1 - p(f, s(SC.cta[0]) - 6, s(SC.cta[0]) + 4);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 1660, display: "flex", alignItems: "center", gap: 12, padding: "10px 24px 10px 16px", borderRadius: 999, background: "rgba(0,0,0,0.35)", border: "1.5px solid rgba(255,255,255,0.16)", opacity: o * 0.9 }}>
        <Instagram size={32} color="#fff" />
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.9)" }}>{HANDLE}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Nano3: React.FC<{ transparent?: boolean }> = ({ transparent = false }) => {
  const keys = Object.keys(SC) as (keyof typeof SC)[];
  return (
    <AlphaCtx.Provider value={transparent}>
    <AbsoluteFill style={{ background: transparent ? "transparent" : C.ink }}>
      {transparent ? null : <Space />}
      {keys.map((k, i) => {
        const [a, b] = SC[k];
        const El = MAP[k];
        return (
          <Sequence key={k} name={k} from={s(a)} durationInFrames={s(b) - s(a)}>
            <Wrap dur={s(b) - s(a)} first={i === 0} last={i === keys.length - 1}>
              <El />
            </Wrap>
          </Sequence>
        );
      })}
      <Watermark />
      <Audio name="Voice-over (own recording)" src={staticFile("nano/vo4.wav")} />
      <Audio name="Music: Pixeln World – Freedom (from 39.40 s)" src={staticFile("nano/music4.wav")} />
    </AbsoluteFill>
    </AlphaCtx.Provider>
  );
};
