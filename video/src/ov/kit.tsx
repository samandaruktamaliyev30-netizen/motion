import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { LucideIcon } from "lucide-react";
import { INTER } from "../v4/ui";

export { INTER };

export const K = {
  bg0: "#05080F",
  bg1: "#0B1424",
  teal: "#2BC4E8",
  tealDeep: "#1385B8",
  red: "#FF4D57",
  redDeep: "#C81E33",
  amber: "#FFB547",
  green: "#2EE59D",
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.55)",
  glass: "rgba(255,255,255,0.06)",
  stroke: "rgba(255,255,255,0.12)",
};

export type Tone = "teal" | "red" | "amber" | "green" | "ink" | "white";
const TONES: Record<Tone, [string, string, string]> = {
  // top, bottom, glow
  teal: ["#5FDCF7", "#1384B8", "rgba(43,196,232,0.55)"],
  red: ["#FF7A82", "#C81E33", "rgba(255,77,87,0.5)"],
  amber: ["#FFD27A", "#E58A12", "rgba(255,181,71,0.5)"],
  green: ["#6CF5BE", "#11A86C", "rgba(46,229,157,0.5)"],
  ink: ["#3A4560", "#151B2B", "rgba(120,140,190,0.35)"],
  white: ["#FFFFFF", "#D9E2EE", "rgba(255,255,255,0.4)"],
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });

export const useSpring = (delay = 0, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });
};

// Glossy "3D" icon tile: gradient body, top highlight, inner rim, coloured glow and a floor shadow.
export const Tile: React.FC<{
  Icon: LucideIcon;
  tone?: Tone;
  size?: number;
  tilt?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ Icon, tone = "teal", size = 200, tilt = 0, glow = 1, style }) => {
  const [a, b, g] = TONES[tone];
  const r = size * 0.27;
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `perspective(900px) rotateX(${tilt * 0.6}deg) rotateY(${tilt}deg)`, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)`,
          boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,0.55), 0 0 ${size * 0.45 * glow}px ${g}, inset 0 ${size * 0.03}px ${size * 0.02}px rgba(255,255,255,0.55), inset 0 -${size * 0.05}px ${size * 0.08}px rgba(0,0,0,0.25)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: size * 0.06,
          right: size * 0.06,
          top: size * 0.04,
          height: size * 0.42,
          borderRadius: `${r * 0.85}px ${r * 0.85}px ${r * 1.6}px ${r * 1.6}px`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))",
        }}
      />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={size * 0.48} color={tone === "white" ? "#1A2233" : "#fff"} strokeWidth={2.1} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }} />
      </div>
    </div>
  );
};

// Frosted dark glass panel.
export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
      border: `1.5px solid ${K.stroke}`,
      borderRadius: 36,
      boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
      backdropFilter: "blur(14px)",
      fontFamily: INTER,
      color: K.white,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  color = K.white,
  weight = 700,
  style,
}) => <div style={{ fontFamily: INTER, fontSize: size, fontWeight: weight, color, letterSpacing: -0.5, ...style }}>{children}</div>;

// Pop-in wrapper (spring scale + rise + unblur).
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at, children, style, from = 0.4 }) => {
  const p = useSpring(at);
  const f = useCurrentFrame();
  if (f < at) return <div style={{ ...style, opacity: 0 }}>{children}</div>;
  return (
    <div style={{ ...style, opacity: Math.min(1, p * 1.4), transform: `${style?.transform ?? ""} translateY(${(1 - p) * 40}px) scale(${from + (1 - from) * p})`, filter: `blur(${(1 - Math.min(p, 1)) * 8}px)` }}>
      {children}
    </div>
  );
};

// Camera shake helper (decays).
export const shake = (f: number, at: number, amp = 18, len = 12) => {
  const t = f - at;
  if (t < 0 || t > len) return { x: 0, y: 0, r: 0 };
  const k = (1 - t / len) * amp;
  return { x: Math.sin(t * 2.7) * k, y: Math.cos(t * 3.3) * k * 0.7, r: Math.sin(t * 1.9) * k * 0.05 };
};

// Animated count-up text.
export const count = (f: number, a: number, b: number, from: number, to: number) => Math.round(interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
