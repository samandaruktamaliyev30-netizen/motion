import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DollarSign, Gift, Hourglass, Megaphone, Search, Settings, Sparkles, Target, UserRound, BarChart3 } from "lucide-react";
import { clamp, count, Glass, INTER, K, Label, Pop, prog, shake, Tile, useSpring } from "./kit";
import { s } from "./timeline";

// Local frame of a voice word time, relative to the scene start (both in seconds).
export const at = (sec: number, start: number) => s(sec) - s(start);

export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ top: 660, height: 900, alignItems: "center", justifyContent: "center", ...style }}>{children}</AbsoluteFill>
);

// 1) $300–400 a month goes into target ads.
export const Spend: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 0;
  const money = count(f, at(1.0, S0), at(2.4, S0), 0, 400);
  const line = prog(f, 6, 80);
  const pts = [0, 0.12, 0.2, 0.38, 0.46, 0.62, 0.75, 0.9, 1].map((v, i) => [40 + i * 95, 250 - v * 200]);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <Stage>
      <Pop at={0}>
        <Glass style={{ width: 880, padding: "34px 40px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Tile Icon={Megaphone} tone="red" size={92} glow={0.6} />
            <div style={{ flex: 1 }}>
              <Label size={40}>Target reklama</Label>
              <Label size={26} color={K.dim} weight={500}>Kampaniya · Instagram</Label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: INTER, fontSize: 26, color: K.green, fontWeight: 700 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: K.green, boxShadow: `0 0 ${10 + 8 * Math.sin(f / 4)}px ${K.green}` }} />
              Faol
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 26 }}>
            <Label size={150} weight={800} style={{ letterSpacing: -6, color: K.white }}>
              ${money}
            </Label>
            <Label size={34} color={K.dim} weight={600}>/ oy sarf</Label>
          </div>
          <svg width={800} height={270} style={{ marginTop: 6 }}>
            <defs>
              <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={K.red} stopOpacity={0.45} />
                <stop offset="1" stopColor={K.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${path} L800 270 L40 270 Z`} fill="url(#sp)" opacity={line} />
            <path d={path} stroke={K.red} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
          </svg>
        </Glass>
      </Pop>
      {/* coins raining into the campaign */}
      {[0, 1, 2, 3, 4].map((i) => {
        const st = 20 + i * 11;
        const p = prog(f, st, st + 26);
        if (f < st) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 120 + i * 200, top: -260 + p * 420, opacity: 1 - prog(f, st + 20, st + 28), transform: `rotate(${p * 200 * (i % 2 ? 1 : -1)}deg)` }}>
            <Tile Icon={DollarSign} tone="amber" size={90} glow={0.5} />
          </div>
        );
      })}
    </Stage>
  );
};

// 2) …but the ads don't bring the expected result.
export const NoResult: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 3.0;
  const q = at(5.12, S0);
  const sh = shake(f, q, 16, 14);
  return (
    <Stage>
      <div style={{ transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)` }}>
        <Pop at={0}>
          <Glass style={{ width: 880, padding: "34px 40px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <Tile Icon={BarChart3} tone="ink" size={92} glow={0.4} />
              <Label size={40}>Natija</Label>
              <div style={{ flex: 1 }} />
              <svg width={56} height={56} viewBox="0 0 50 50" style={{ transform: `rotate(${f * 12}deg)` }}>
                <circle cx={25} cy={25} r={20} stroke="rgba(255,255,255,0.15)" strokeWidth={6} fill="none" />
                <path d="M25 5 A20 20 0 0 1 45 25" stroke={K.white} strokeWidth={6} fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 20 }}>
              <Label size={170} weight={800} style={{ letterSpacing: -6 }}>0</Label>
              <Label size={40} color={K.dim} weight={600}>sotuv</Label>
            </div>
            <svg width={800} height={160}>
              <line x1={20} y1={120} x2={20 + 760 * prog(f, 4, 40)} y2={120} stroke="rgba(255,255,255,0.4)" strokeWidth={6} strokeDasharray="18 14" strokeLinecap="round" />
            </svg>
          </Glass>
        </Pop>
      </div>
      <Pop at={q} style={{ position: "absolute", right: 70, top: 20 }} from={0.2}>
        <div style={{ width: 200, height: 200, borderRadius: 100, background: `radial-gradient(circle at 35% 30%, #FF8A90, ${K.redDeep})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 150, color: "#fff", boxShadow: `0 0 80px ${K.red}aa, 0 20px 40px rgba(0,0,0,0.5)` }}>
          ?
        </div>
      </Pop>
    </Stage>
  );
};

// 3) Most owners blame the ads.
export const Blame: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 5.85;
  const hit = at(8.18, S0);
  const sh = shake(f, hit + 8, 14, 16);
  const arrows = prog(f, hit - 4, hit + 8);
  return (
    <Stage>
      <div style={{ position: "absolute", top: 40, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r * 3}deg)` }}>
        <Pop at={4}>
          <Tile Icon={Megaphone} tone="red" size={300} tilt={-12} glow={0.6 + prog(f, hit, hit + 10)} />
        </Pop>
      </div>
      <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
        {[180, 540, 900].map((x, i) => (
          <path key={i} d={`M${x} 650 Q ${(x + 540) / 2} 520, 540 ${380}`} stroke={K.red} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - arrows} opacity={0.9} />
        ))}
      </svg>
      <div style={{ position: "absolute", top: 640, display: "flex", gap: 110 }}>
        {[0, 1, 2].map((i) => (
          <Pop key={i} at={10 + i * 8}>
            <Tile Icon={UserRound} tone="ink" size={170} glow={0.3} />
          </Pop>
        ))}
      </div>
      <Pop at={hit + 6} style={{ position: "absolute", top: 380 }} from={1.8}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: K.red, border: `6px solid ${K.red}`, borderRadius: 20, padding: "6px 26px", transform: "rotate(-8deg)", background: "rgba(10,0,4,0.6)", letterSpacing: 2 }}>
          AYBDOR?
        </div>
      </Pop>
    </Stage>
  );
};

// 4) The real cause: offer, strategy or sales system.
const CAUSES: [typeof Gift, string, number][] = [
  [Gift, "Taklif", 11.86],
  [Target, "Strategiya", 12.39],
  [Settings, "Sotuv tizimi", 13.73],
];
export const Cause: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 9.6;
  const dimMega = prog(f, at(11.0, S0), at(11.6, S0));
  return (
    <Stage>
      <div style={{ position: "absolute", top: -30, display: "flex", alignItems: "center", gap: 24, opacity: 1 - dimMega * 0.6, transform: `scale(${1 - dimMega * 0.25})` }}>
        <Tile Icon={Megaphone} tone="ink" size={120} glow={0.2} />
        <Label size={44} color={K.dim} style={{ textDecoration: dimMega > 0.5 ? "line-through" : "none", textDecorationColor: K.red, textDecorationThickness: 6 }}>
          Reklama emas
        </Label>
      </div>
      <div style={{ position: "absolute", top: 170, display: "flex", flexDirection: "column", gap: 30 }}>
        {CAUSES.map(([Icon, t, sec], i) => {
          const st = at(sec, S0) - 4;
          const p = useSpringAt(st);
          return (
            <div key={i} style={{ opacity: f >= st ? Math.min(1, p * 1.4) : 0, transform: `translateX(${(1 - p) * (i % 2 ? 300 : -300)}px) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg)` }}>
              <Glass style={{ width: 860, padding: "26px 32px", display: "flex", alignItems: "center", gap: 30 }}>
                <Tile Icon={Icon} tone={i === 1 ? "teal" : i === 0 ? "amber" : "red"} size={140} tilt={-10} />
                <div>
                  <Label size={58} weight={800}>{t}</Label>
                  <Label size={28} color={K.red} weight={700} style={{ marginTop: 4 }}>
                    noto‘g‘ri bo‘lsa — natija yo‘q
                  </Label>
                </div>
              </Glass>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
const useSpringAt = (st: number) => useSpring(st, { damping: 13, stiffness: 150 });

// 5) Switch the ads on… and wait for a miracle. Tension builds into the drop.
export const Miracle: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 15.25;
  const on = prog(f, at(17.18, S0), at(17.18, S0) + 8);
  const magic = at(18.1, S0);
  const wait = at(18.65, S0);
  const end = s(19.55) - s(S0);
  const tension = prog(f, wait + 4, end, (x) => x * x);
  const sh = shake(f, wait + 4, 10 * tension + 4, end - wait);
  return (
    <Stage>
      <div style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 + tension * 0.35})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Pop at={0}>
          <Glass style={{ width: 820, padding: "36px 44px", display: "flex", alignItems: "center", gap: 30 }}>
            <Tile Icon={Megaphone} tone={on > 0.5 ? "teal" : "ink"} size={120} />
            <Label size={52} weight={800} style={{ flex: 1 }}>Reklama</Label>
            <div style={{ width: 190, height: 104, borderRadius: 52, background: on > 0.5 ? K.green : "rgba(255,255,255,0.18)", position: "relative", boxShadow: on > 0.5 ? `0 0 40px ${K.green}aa` : "none" }}>
              <div style={{ position: "absolute", top: 8, left: 8 + on * 86, width: 88, height: 88, borderRadius: 44, background: "#fff", boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }} />
            </div>
          </Glass>
        </Pop>
        <div style={{ position: "relative", marginTop: 60, height: 360, width: 900, display: "flex", justifyContent: "center" }}>
          <Pop at={magic}>
            <Tile Icon={Sparkles} tone="amber" size={240} tilt={10} glow={1.4} />
          </Pop>
          <Pop at={wait} style={{ position: "absolute", right: 60, top: 80 }}>
            <div style={{ transform: `rotate(${interpolate(f, [wait, wait + 20], [0, 180], clamp)}deg)` }}>
              <Tile Icon={Hourglass} tone="white" size={150} />
            </div>
          </Pop>
          {f >= magic &&
            new Array(14).fill(0).map((_, i) => {
              const p = prog(f, magic, magic + 26);
              const a = (i / 14) * Math.PI * 2;
              const r = 120 + p * 320;
              return <div key={i} style={{ position: "absolute", left: 450 + Math.cos(a) * r, top: 120 + Math.sin(a) * r * 0.7, width: 18, height: 18, background: K.amber, transform: `rotate(45deg) scale(${1 - p})`, boxShadow: `0 0 20px ${K.amber}`, opacity: 1 - p }} />;
            })}
        </div>
      </div>
      {/* darkening + flash into the drop */}
      <AbsoluteFill style={{ top: -660, height: 1920, background: "black", opacity: tension * 0.55, pointerEvents: "none" }} />
    </Stage>
  );
};

// 6) "Biz esa AKSINCHA" — drop: slam, flash, shockwave, then analysis.
export const Aksincha: React.FC = () => {
  const f = useCurrentFrame();
  const S0 = 19.55;
  const word = useSpring(0, { damping: 11, stiffness: 120, mass: 0.9 });
  const out = prog(f, at(20.84, S0) - 6, at(20.84, S0) + 6);
  const ring = prog(f, 0, 22);
  const sh = shake(f, 2, 26, 16);
  const scan = at(21.99, S0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: `10px solid ${K.teal}`, transform: `scale(${1 + ring * 6})`, opacity: 1 - ring }} />
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 210,
            letterSpacing: -10,
            color: K.white,
            transform: `translate(${sh.x}px, ${sh.y - out * 520}px) perspective(1000px) rotateY(${(1 - word) * 90}deg) scale(${(2.4 - 1.4 * word) * (1 - out * 0.55)})`,
            opacity: Math.min(1, word * 2) * (1 - out),
            textShadow: `0 0 60px ${K.teal}, 0 0 120px ${K.teal}88`,
          }}
        >
          AKSINCHA
        </div>
      </AbsoluteFill>
      <Stage>
        <Pop at={at(20.84, S0)}>
          <Glass style={{ width: 860, height: 520, padding: 40, position: "relative", overflow: "hidden" }}>
            <Label size={30} color={K.dim} weight={600}>Biznes tahlili</Label>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 34, height: 330, marginTop: 30 }}>
              {[0.35, 0.6, 0.45, 0.8, 0.62, 0.95].map((h, i) => (
                <div key={i} style={{ flex: 1, height: 330 * h * prog(f, at(20.84, S0) + i * 3, at(20.84, S0) + 14 + i * 3), borderRadius: 14, background: `linear-gradient(180deg, ${K.teal}, ${K.tealDeep})`, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, width: 6, left: 40 + 780 * prog(f, scan - 6, scan + 26), background: K.teal, boxShadow: `0 0 30px ${K.teal}`, opacity: f > scan - 6 ? 1 : 0 }} />
          </Glass>
        </Pop>
        <div style={{ position: "absolute", left: 40 + 600 * prog(f, scan - 6, scan + 26), top: 520 }}>
          <Pop at={at(21.6, S0)}>
            <Tile Icon={Search} tone="teal" size={190} tilt={-14} glow={1.2} />
          </Pop>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
