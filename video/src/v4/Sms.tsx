import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER } from "./ui";

// The viewer's question arrives as a message (reference 1: white bubble, light-blue frame,
// avatar, timestamp). It is on screen while the question is read and leaves right after.
const TEXT =
  "Siz bilan marketing xizmati bo‘yicha ishlaydigan bo‘lsak, bizga natijaga chiqishga 100% kafolat berasizmi?";

const Avatar: React.FC = () => (
  <svg width={46} height={46} viewBox="0 0 46 46" style={{ flex: "none", marginTop: 2 }}>
    <defs>
      <linearGradient id="av" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7FD3F5" />
        <stop offset="1" stopColor={C.teal} />
      </linearGradient>
    </defs>
    <circle cx={23} cy={23} r={23} fill="url(#av)" />
    <circle cx={23} cy={18} r={7.5} fill="#fff" />
    <path d="M9.5 37 C12 29, 34 29, 36.5 37" fill="#fff" />
  </svg>
);

export const Sms: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - 2, fps, config: { damping: 14, stiffness: 190, mass: 0.6 } });
  const out = interpolate(f, [dur - 7, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = (0.86 + 0.14 * inn) * (1 - 0.08 * out);
  const y = (1 - inn) * 60 + out * 30;
  // Gentle "new message" glow on the frame right after it lands.
  const glow = interpolate(f, [8, 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 1255,
          width: 900,
          opacity: inn * (1 - out),
          transform: `translateY(${y}px) scale(${scale})`,
          transformOrigin: "50% 100%",
          padding: 7,
          borderRadius: 34,
          background: `linear-gradient(135deg, #9ED9F7, ${C.sky} 55%, #3B9BE0)`,
          boxShadow: `0 22px 50px rgba(0,0,0,0.32), 0 0 ${30 * glow}px rgba(90,184,240,${0.9 * glow})`,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            padding: "24px 30px 18px 26px",
            display: "flex",
            gap: 18,
            fontFamily: INTER,
          }}
        >
          <Avatar />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 38, lineHeight: 1.32, fontWeight: 500, color: C.ink, letterSpacing: -0.3 }}>{TEXT}</div>
            <div style={{ textAlign: "right", fontSize: 24, color: "#A0A6AE", marginTop: 4, fontWeight: 500 }}>19:54 ✓✓</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
