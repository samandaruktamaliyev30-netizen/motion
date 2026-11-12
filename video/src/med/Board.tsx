import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, GRAD, M, Tile } from "./ui";
import { IconBook, IconFlask, IconGradCap, IconHeartPulse, IconSchool, IconTest } from "./extraIcons";

// Chalkboard background with chalk dust texture and vignette.
const BoardBg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #2C6B53 0%, ${M.board} 55%, #10291F 100%)` }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.22, mixBlendMode: "screen" }}>
      <filter id="chalk">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.2" />
      </filter>
      <rect width="100%" height="100%" filter="url(#chalk)" />
    </svg>
    {/* faint erased smudges */}
    <div style={{ position: "absolute", left: 80, top: 1180, width: 520, height: 160, borderRadius: 200, background: "rgba(255,255,255,0.05)", filter: "blur(30px)" }} />
    <div style={{ position: "absolute", right: 60, top: 260, width: 420, height: 120, borderRadius: 200, background: "rgba(255,255,255,0.05)", filter: "blur(30px)" }} />
  </AbsoluteFill>
);

// Handwritten chalk text revealed left-to-right like it is being written.
const Chalk: React.FC<{ text: string; start: number; dur?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({
  text,
  start,
  dur = 16,
  size = 92,
  color = M.chalk,
  style,
}) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [start, start + dur], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: CAVEAT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
        textShadow: "0 0 2px rgba(255,255,255,0.5)",
        clipPath: `inset(-20% ${100 - r}% -20% 0)`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Pinned polaroid with an illustration (icon on gradient) and a caption.
const Polaroid: React.FC<{
  x: number;
  y: number;
  w?: number;
  rot: number;
  delay: number;
  bg: string;
  label: string;
  icon: React.ReactNode;
}> = ({ x, y, w = 330, rot, delay, bg, label, icon }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 11, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        background: "#FBFAF6",
        padding: "18px 18px 0",
        borderRadius: 8,
        boxShadow: "0 22px 50px rgba(0,0,0,0.5)",
        transform: `translateY(${(1 - s) * 260}px) rotate(${rot + (1 - s) * 18}deg) scale(${0.7 + 0.3 * s})`,
        opacity: Math.min(1, s * 1.6),
      }}
    >
      <div
        style={{
          height: w - 36,
          borderRadius: 4,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), transparent 60%)" }} />
        {icon}
      </div>
      <div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 52, color: "#2B2B2B", textAlign: "center", padding: "8px 0 12px" }}>{label}</div>
      {/* pin */}
      <div style={{ position: "absolute", top: -14, left: "50%", marginLeft: -16, width: 32, height: 32, borderRadius: 16, background: "radial-gradient(circle at 35% 35%, #FF8A8A, #C81E3A)", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
    </div>
  );
};

const useBoardIn = (dur: number) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [dur - 7, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, dur], [1.04, 1.0]);
  return { opacity: Math.min(inn, out), transform: `scale(${zoom * (0.94 + 0.06 * inn)})` };
};

/* Board 1: school knowledge ≠ institute requirements */
export const BoardSchool: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const st = useBoardIn(dur);
  const circle = interpolate(f, [34, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={st}>
      <BoardBg />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <Chalk text="Ta’limdagi uzviylik" start={2} size={104} style={{ marginTop: 250 }} />
      </AbsoluteFill>
      <Polaroid x={40} y={430} rot={-7} delay={4} bg={GRAD.sky} label="Maktab" icon={<IconSchool size={170} color="white" stroke={1.6} />} />
      <Polaroid x={710} y={450} rot={6} delay={12} bg={GRAD.mint} label="Institut" icon={<IconGradCap size={170} color="white" stroke={1.6} />} />
      {/* chalk ≠ with hand-drawn circle */}
      <div style={{ position: "absolute", left: 390, top: 520, width: 300, height: 300 }}>
        <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: "absolute", inset: 0 }}>
          <path
            d="M150 30 C 240 28, 278 110, 262 170 C 246 240, 160 276, 96 252 C 30 226, 18 140, 52 86 C 80 44, 130 26, 176 36"
            fill="none"
            stroke={M.amber}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - circle}
          />
        </svg>
        <Chalk text="≠" start={26} dur={8} size={230} color={M.chalk} style={{ position: "absolute", left: 92, top: 10 }} />
      </div>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <Chalk text="bilim va ko‘nikma  ≠  talablar" start={40} dur={22} size={70} color="#CFEFDF" style={{ marginTop: 860 }} />
      </AbsoluteFill>
      <Polaroid x={70} y={1430} w={250} rot={8} delay={20} bg={GRAD.amber} label="Kitob" icon={<IconBook size={120} color="white" stroke={1.7} />} />
      <Polaroid x={760} y={1460} w={250} rot={-9} delay={26} bg={GRAD.violet} label="Test" icon={<IconTest size={120} color="white" stroke={1.7} />} />
    </AbsoluteFill>
  );
};

/* Board 2: pH scale example */
export const BoardPH: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = useBoardIn(dur);
  const bar = interpolate(f, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const mk = spring({ frame: f - 26, fps, config: { damping: 12, stiffness: 90 } });
  const markerPos = interpolate(mk, [0, 1], [0, 7.4 / 14]);
  const W = 900;
  return (
    <AbsoluteFill style={st}>
      <BoardBg />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <Chalk text="Eritmaning pH qiymati" start={2} size={100} style={{ marginTop: 250 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 470, width: W }}>
        <div
          style={{
            height: 70,
            borderRadius: 35,
            background: "linear-gradient(90deg,#E11D48,#F97316,#FACC15,#22C55E,#14B8A6,#3B82F6,#6D28D9)",
            clipPath: `inset(0 ${100 - bar * 100}% 0 0 round 35px)`,
            boxShadow: "0 0 0 5px rgba(244,241,232,0.85)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: CAVEAT, fontWeight: 700, fontSize: 58, color: M.chalk, opacity: bar }}>
          <span>0 · kislota</span>
          <span>7</span>
          <span>ishqor · 14</span>
        </div>
        {/* marker */}
        <div style={{ position: "absolute", top: -96, left: markerPos * W - 60, width: 120, display: "flex", flexDirection: "column", alignItems: "center", opacity: f > 26 ? 1 : 0 }}>
          <div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 60, color: M.amber, lineHeight: 1 }}>7,4</div>
          <svg width={40} height={30} viewBox="0 0 40 30">
            <path d="M4 4h32L20 26z" fill={M.amber} />
          </svg>
        </div>
      </div>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <Chalk text="Qon pH: 7,35 – 7,45" start={40} dur={18} size={78} color="#CFEFDF" style={{ marginTop: 760 }} />
        <Chalk text="Bu nima uchun muhim?" start={56} dur={14} size={66} color={M.amber} style={{ marginTop: 22 }} />
      </AbsoluteFill>
      <Polaroid x={60} y={1420} w={260} rot={-8} delay={10} bg={GRAD.sky} label="Eritma" icon={<IconFlask size={130} color="white" stroke={1.7} />} />
      <Polaroid x={750} y={1440} w={260} rot={7} delay={18} bg={GRAD.coral} label="Organizm" icon={<IconHeartPulse size={130} color="white" stroke={1.7} />} />
    </AbsoluteFill>
  );
};

export { Tile };
