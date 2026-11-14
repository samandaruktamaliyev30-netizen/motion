import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Check,
  Coffee,
  GraduationCap,
  Headset,
  Lock,
  LockOpen,
  MessageCircle,
  Package,
  PhoneCall,
  Puzzle,
  RefreshCw,
  Rocket,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Tag,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { clamp, count, Glass, INTER, K, Label, Pop, prog, shake, Tile, useSpring } from "./kit";
import { beatPulse, s } from "./timeline";
import { at, Stage } from "./Scenes1";

// 7) Audience → product → offer → sales process.
const STEPS: [typeof Users, string, number, [number, number]][] = [
  [Users, "Auditoriya", 23.1, [250, 140]],
  [Package, "Mahsulot", 24.24, [830, 140]],
  [Tag, "Taklif", 25.05, [250, 560]],
  [RefreshCw, "Sotuv jarayoni", 25.97, [830, 560]],
];
export const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 23.1;
  const done = at(27.07, S0);
  const pts = STEPS.map((x) => x[3]);
  const segs = [
    [pts[0], pts[1]],
    [pts[1], pts[2]],
    [pts[2], pts[3]],
  ];
  return (
    <AbsoluteFill style={{ top: 660, height: 900 }}>
      <svg width={1080} height={900} style={{ position: "absolute" }}>
        {segs.map(([a, b], i) => {
          const p = prog(f, at(STEPS[i + 1][2], S0) - 10, at(STEPS[i + 1][2], S0));
          return <line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke={K.teal} strokeWidth={8} strokeDasharray="20 14" strokeLinecap="round" opacity={0.8} />;
        })}
      </svg>
      {STEPS.map(([Icon, t, sec, [x, y]], i) => {
        const st = at(sec, S0);
        const c = prog(f, done + i * 3, done + i * 3 + 8);
        return (
          <div key={i} style={{ position: "absolute", left: x - 130, top: y - 120, width: 260, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Pop at={st}>
              <div style={{ position: "relative" }}>
                <Tile Icon={Icon} tone="teal" size={190} tilt={i % 2 ? 12 : -12} glow={0.6 + beatPulse(f) * 0.6} />
                <div style={{ position: "absolute", right: -14, top: -14, transform: `scale(${c})` }}>
                  <div style={{ width: 66, height: 66, borderRadius: 33, background: K.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${K.green}` }}>
                    <Check size={42} color="#05210f" strokeWidth={3.5} />
                  </div>
                </div>
              </div>
            </Pop>
            <Pop at={st + 4}>
              <Label size={40} weight={800} style={{ marginTop: 20, textAlign: "center" }}>{t}</Label>
            </Pop>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 8) Only then: the ad strategy. Rocket launch.
export const Strategy: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 27.6;
  const card = at(28.86, S0);
  const launch = at(30.26, S0);
  const fly = prog(f, launch - 2, launch + 14, (x) => x * x);
  const sh = shake(f, launch, 12, 12);
  return (
    <Stage>
      {/* the four steps fly in and merge */}
      {[Users, Package, Tag, RefreshCw].map((Icon, i) => {
        const p = prog(f, 0, card);
        const sx = [-330, 330, -330, 330][i];
        const sy = [-300, -300, 200, 200][i];
        return (
          <div key={i} style={{ position: "absolute", transform: `translate(${sx * (1 - p)}px, ${sy * (1 - p) - 80}px) scale(${1 - p * 0.6})`, opacity: 1 - prog(f, card - 6, card) }}>
            <Tile Icon={Icon} tone="teal" size={150} />
          </div>
        );
      })}
      <div style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
        <Pop at={card - 2} from={0.2}>
          <Glass style={{ width: 860, padding: "40px 44px", display: "flex", alignItems: "center", gap: 30, border: `2px solid ${K.teal}88`, boxShadow: `0 0 80px ${K.teal}55, 0 30px 80px rgba(0,0,0,0.5)` }}>
            <Tile Icon={Target} tone="teal" size={170} tilt={-10} glow={1.2} />
            <div>
              <Label size={30} color={K.teal} weight={700}>STRATEGIYA</Label>
              <Label size={54} weight={800} style={{ lineHeight: 1.05 }}>Reklama rejasi tayyor</Label>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ height: 14, width: 120, borderRadius: 7, background: i < 1 + Math.floor(prog(f, card, card + 30) * 3) ? K.teal : "rgba(255,255,255,0.15)" }} />
                ))}
              </div>
            </div>
          </Glass>
        </Pop>
      </div>
      <div style={{ position: "absolute", top: 560, transform: `translateY(${-fly * 1700}px) rotate(-45deg)` }}>
        <Pop at={card + 10}>
          <Tile Icon={Rocket} tone="amber" size={190} glow={1.2} />
        </Pop>
        {fly > 0 && <div style={{ position: "absolute", left: 60, top: 170, width: 70, height: 600 * fly, background: `linear-gradient(180deg, ${K.amber}, transparent)`, filter: "blur(12px)", borderRadius: 40 }} />}
      </div>
    </Stage>
  );
};

// 9) Many leads ≠ many sales: funnel, then a full-screen slam.
export const Funnel: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 30.7;
  const pour = at(31.85, S0);
  const out = at(33.38, S0);
  const slam = at(33.75, S0);
  const sl = useSpring(slam, { damping: 10, stiffness: 160 });
  const sh = shake(f, slam + 2, 30, 18);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${prog(f, slam, slam + 6) * 14}px)`, opacity: 1 - prog(f, slam, slam + 6) * 0.6 }}>
        <Stage>
          <svg width={900} height={900} viewBox="0 0 900 900">
            <defs>
              <linearGradient id="fn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={K.teal} stopOpacity={0.55} />
                <stop offset="1" stopColor={K.tealDeep} stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <path d="M90 160 L810 160 L520 560 L520 760 L380 760 L380 560 Z" fill="url(#fn)" stroke={K.teal} strokeWidth={5} opacity={prog(f, 0, 12)} />
            {f >= pour &&
              new Array(40).fill(0).map((_, i) => {
                const st = pour + i * 1.2;
                const p = prog(f, st, st + 26, (x) => x);
                if (f < st) return null;
                const x0 = 120 + ((i * 97) % 660);
                const passes = i % 9 === 0;
                const y = 20 + p * (passes ? 820 : 470);
                const x = passes ? x0 + (450 - x0) * Math.min(1, p * 1.5) : x0 + (450 - x0) * p * 0.75;
                const fade = passes ? 1 : 1 - prog(f, st + 18, st + 26);
                return <circle key={i} cx={x} cy={y} r={14} fill={passes && f >= out ? K.green : K.white} opacity={fade} />;
              })}
          </svg>
          <div style={{ position: "absolute", top: 20, display: "flex", width: 860, justifyContent: "space-between" }}>
            <Label size={40} weight={800}>{count(f, pour, pour + 40, 0, 100)} lid</Label>
          </div>
          <Pop at={out} style={{ position: "absolute", top: 790 }}>
            <Label size={46} weight={800} color={K.green}>atigi 4 ta savdo</Label>
          </Pop>
        </Stage>
      </AbsoluteFill>
      {f >= slam && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${2.2 - 1.2 * sl}) rotate(${(1 - sl) * -6}deg)`, opacity: Math.min(1, sl * 2), textAlign: "center", fontFamily: INTER }}>
            <div style={{ fontSize: 120, fontWeight: 800, color: K.white, letterSpacing: -4, lineHeight: 1 }}>Ko‘p lid</div>
            <div style={{ fontSize: 260, fontWeight: 800, color: K.red, lineHeight: 0.9, textShadow: `0 0 70px ${K.red}` }}>≠</div>
            <div style={{ fontSize: 120, fontWeight: 800, color: K.teal, letterSpacing: -4, lineHeight: 1, textShadow: `0 0 50px ${K.teal}88` }}>ko‘p savdo</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// 10) "Does advertising work in our niche?" — incoming chat question.
export const Question: React.FC = () => {
  const f = useCurrentFrame();
  const typing = f < 16;
  return (
    <Stage>
      <div style={{ position: "absolute", top: 20, right: 90 }}>
        <Pop at={0}>
          <Tile Icon={MessageCircle} tone="teal" size={150} tilt={12} glow={0.8} />
        </Pop>
      </div>
      <Pop at={4} style={{ marginTop: 160 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: "linear-gradient(135deg,#FFD27A,#E58A12)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <UserRound size={56} color="#fff" />
          </div>
          <div style={{ background: "#fff", color: "#111", borderRadius: "40px 40px 40px 10px", padding: "30px 40px", maxWidth: 720, fontFamily: INTER, fontSize: 52, fontWeight: 600, lineHeight: 1.25, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            {typing ? (
              <div style={{ display: "flex", gap: 14, padding: "10px 6px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: "#9AA3AF", transform: `translateY(${Math.sin((f - i * 4) / 3) * 6}px)` }} />
                ))}
              </div>
            ) : (
              "Bizning sohada reklama ishlaydimi?"
            )}
          </div>
        </div>
      </Pop>
    </Stage>
  );
};

// 11) Every business needs its own strategy.
const BIZ: [typeof Coffee, string, "amber" | "teal" | "red" | "green", number[]][] = [
  [Coffee, "Kafe", "amber", [0.4, 0.7, 0.5, 0.9]],
  [Stethoscope, "Klinika", "teal", [0.8, 0.5, 0.6, 0.3]],
  [ShoppingBag, "Do‘kon", "red", [0.3, 0.5, 0.9, 0.6]],
  [GraduationCap, "Ta’lim", "green", [0.6, 0.9, 0.4, 0.7]],
];
export const Industries: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 37.05;
  const own = at(38.62, S0);
  return (
    <Stage>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
        {BIZ.map(([Icon, t, tone, bars], i) => (
          <Pop key={i} at={i * 6}>
            <Glass style={{ width: 420, padding: "30px 30px 26px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Tile Icon={Icon} tone={tone} size={140} tilt={i % 2 ? 10 : -10} />
              <Label size={42} weight={800} style={{ marginTop: 16 }}>{t}</Label>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 110, marginTop: 14 }}>
                {bars.map((h, j) => (
                  <div key={j} style={{ width: 52, height: 110 * h * prog(f, own + i * 3 + j * 2, own + i * 3 + j * 2 + 12), borderRadius: 10, background: "rgba(255,255,255,0.85)" }} />
                ))}
              </div>
            </Glass>
          </Pop>
        ))}
      </div>
    </Stage>
  );
};

// 12) The customer comes… and doesn't buy.
export const NoBuy: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 40.25;
  const leave = at(41.86, S0);
  const walkIn = prog(f, 0, 22);
  const walkOut = prog(f, leave, leave + 20);
  const x = -380 + walkIn * 320 + walkOut * 700;
  const sh = shake(f, leave + 4, 12, 12);
  return (
    <Stage>
      <div style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
        <Pop at={0}>
          <Tile Icon={ShoppingCart} tone="ink" size={300} tilt={8} glow={0.4} />
        </Pop>
        <Pop at={leave + 4} style={{ position: "absolute", right: -30, top: -30 }} from={0.1}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: K.red, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${K.red}` }}>0</div>
        </Pop>
      </div>
      <div style={{ position: "absolute", top: 650, transform: `translateX(${x}px) scaleX(${f >= leave ? -1 : 1}) translateY(${Math.abs(Math.sin(f / 3)) * -16}px)`, opacity: 1 - walkOut }}>
        <Tile Icon={UserRound} tone="amber" size={170} />
      </div>
    </Stage>
  );
};

// 13) The sales team and managers matter too.
export const Sales: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 42.55;
  const team = at(43.29, S0);
  const mgr = at(44.55, S0);
  const conv = count(f, mgr, mgr + 36, 12, 38);
  const ang = interpolate(conv, [0, 50], [-90, 90]);
  return (
    <Stage>
      <div style={{ position: "absolute", top: 0, display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative" }}>
          {[0, 1, 2].map((i) => {
            const p = ((f + i * 12) % 36) / 36;
            return <div key={i} style={{ position: "absolute", left: 100 - 100 * (1 + p), top: 100 - 100 * (1 + p), width: 200 * (1 + p), height: 200 * (1 + p), borderRadius: "50%", border: `4px solid ${K.teal}`, opacity: (1 - p) * 0.6 * (f > team ? 1 : 0) }} />;
          })}
          <Pop at={0}>
            <Tile Icon={Headset} tone="teal" size={200} glow={1} />
          </Pop>
        </div>
        <Pop at={team}>
          <Glass style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 18 }}>
            <PhoneCall size={44} color={K.green} />
            <div>
              <Label size={36} weight={800}>Sotuv bo‘limi</Label>
              <Label size={26} color={K.dim} weight={500}>
                qo‘ng‘iroq · 0:{String(10 + Math.floor(f / 3) % 50).padStart(2, "0")}
              </Label>
            </div>
          </Glass>
        </Pop>
      </div>
      <Pop at={mgr - 6} style={{ position: "absolute", top: 330 }}>
        <Glass style={{ width: 760, padding: "30px 40px 36px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={520} height={290} viewBox="0 0 520 290">
            <path d="M40 270 A220 220 0 0 1 480 270" stroke="rgba(255,255,255,0.15)" strokeWidth={34} fill="none" strokeLinecap="round" />
            <path d="M40 270 A220 220 0 0 1 480 270" stroke={K.green} strokeWidth={34} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - conv / 50} />
            <line x1={260} y1={270} x2={260 + Math.sin((ang * Math.PI) / 180) * 170} y2={270 - Math.cos((ang * Math.PI) / 180) * 170} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
            <circle cx={260} cy={270} r={18} fill="#fff" />
          </svg>
          <Label size={84} weight={800} style={{ marginTop: -10 }}>{conv}%</Label>
          <Label size={30} color={K.dim} weight={600}>lid → savdo konversiyasi</Label>
        </Glass>
      </Pop>
    </Stage>
  );
};

// 14) Marketing + sales on the right track.
export const PathScene: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 46.15;
  const m = useSpring(at(47.74, S0) - 4, { damping: 13 });
  const sv = useSpring(at(48.51, S0) - 4, { damping: 13 });
  const join = at(49.05, S0);
  const route = prog(f, join, at(50.5, S0));
  const flash = f >= join ? interpolate(f, [join, join + 8], [0.7, 0], clamp) : 0;
  return (
    <Stage>
      <div style={{ position: "absolute", top: 20, display: "flex", gap: 10 }}>
        <div style={{ transform: `translateX(${(1 - m) * -500}px) rotate(${(1 - m) * -20}deg)`, opacity: Math.min(1, m * 2), textAlign: "center" }}>
          <Tile Icon={Puzzle} tone="teal" size={230} tilt={-8} />
          <Label size={42} weight={800} style={{ marginTop: 16 }}>Marketing</Label>
        </div>
        <div style={{ transform: `translateX(${(1 - sv) * 500}px) rotate(${(1 - sv) * 20}deg) scaleX(-1)`, opacity: Math.min(1, sv * 2), textAlign: "center" }}>
          <Tile Icon={Puzzle} tone="amber" size={230} tilt={-8} />
          <Label size={42} weight={800} style={{ marginTop: 16, transform: "scaleX(-1)" }}>Savdo</Label>
        </div>
        <div style={{ position: "absolute", inset: -60, borderRadius: 60, background: "white", opacity: flash, filter: "blur(30px)" }} />
      </div>
      <Pop at={join} style={{ position: "absolute", top: 420 }}>
        <Glass style={{ width: 860, padding: "30px 40px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <TrendingUp size={50} color={K.green} />
            <Label size={44} weight={800}>To‘g‘ri yo‘l</Label>
          </div>
          <svg width={780} height={220} style={{ marginTop: 10 }}>
            <path d="M10 200 C 200 190, 260 120, 400 120 S 620 40, 770 20" stroke={K.green} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - route} style={{ filter: `drop-shadow(0 0 12px ${K.green})` }} />
          </svg>
        </Glass>
      </Pop>
    </Stage>
  );
};

// 15) Subscribe — profile card with a tap.
export const Subscribe: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 50.8;
  const tap = at(51.54, S0);
  const pressed = f >= tap + 4;
  const sc = interpolate(f, [tap, tap + 4, tap + 10], [1, 0.9, 1], clamp);
  const ripple = prog(f, tap + 2, tap + 22);
  return (
    <Stage>
      <Pop at={0}>
        <Glass style={{ width: 860, padding: "44px 44px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 170, height: 170, borderRadius: 85, padding: 7, background: `conic-gradient(${K.teal}, ${K.amber}, ${K.red}, ${K.teal})` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: K.bg1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={84} color={K.teal} />
            </div>
          </div>
          <Label size={48} weight={800} style={{ marginTop: 20 }}>Marketing sirlari</Label>
          <Label size={30} color={K.dim} weight={500}>marketing · savdo · strategiya</Label>
          <div style={{ position: "relative", marginTop: 34 }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: "50%", background: K.teal, opacity: (1 - ripple) * 0.35 * (ripple > 0 ? 1 : 0), transform: `scale(${ripple})` }} />
            <div style={{ width: 640, padding: "28px 0", borderRadius: 26, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 48, color: "#fff", background: pressed ? "rgba(255,255,255,0.14)" : `linear-gradient(135deg, #5FDCF7, ${K.tealDeep})`, transform: `scale(${sc})`, boxShadow: pressed ? "none" : `0 0 50px ${K.teal}88` }}>
              {pressed ? "✓ Obuna bo‘ldingiz" : "Obuna bo‘lish"}
            </div>
          </div>
        </Glass>
      </Pop>
    </Stage>
  );
};

// 16) Practical secrets — the lock opens.
export const Secrets: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 52.3;
  const open = at(54.48, S0);
  const rays = prog(f, open, open + 24);
  const end = s(57.5) - s(S0);
  const fade = prog(f, end - 14, end);
  return (
    <AbsoluteFill>
      <Stage>
        <div style={{ position: "absolute", width: 900, height: 900, opacity: rays * 0.9, transform: `rotate(${f * 0.6}deg) scale(${0.5 + rays * 0.7})`, background: `repeating-conic-gradient(from 0deg, ${K.teal}55 0deg 8deg, transparent 8deg 24deg)`, maskImage: "radial-gradient(circle, black 0%, transparent 65%)", borderRadius: "50%" }} />
        <div style={{ transform: `scale(${1 + beatPulse(f) * 0.05})` }}>
          <Pop at={0}>
            <Tile Icon={f >= open ? LockOpen : Lock} tone={f >= open ? "teal" : "ink"} size={340} tilt={f >= open ? 0 : -10} glow={0.4 + rays * 1.4} />
          </Pop>
        </div>
        <Pop at={open + 6} style={{ position: "absolute", top: 640 }}>
          <Label size={64} weight={800} style={{ textAlign: "center" }}>
            Amaliy <span style={{ color: K.teal }}>sirlar</span>
          </Label>
        </Pop>
        {f >= open &&
          new Array(18).fill(0).map((_, i) => {
            const p = prog(f, open + (i % 6), open + 30 + (i % 6));
            const a = (i / 18) * Math.PI * 2;
            return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * (180 + p * 360) - 9, top: 450 + Math.sin(a) * (180 + p * 360) - 9, width: 18, height: 18, borderRadius: 9, background: i % 2 ? K.teal : K.amber, opacity: 1 - p, boxShadow: `0 0 16px ${K.teal}` }} />;
          })}
      </Stage>
      <AbsoluteFill style={{ background: "black", opacity: fade }} />
    </AbsoluteFill>
  );
};
