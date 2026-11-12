import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

// Reference look: clean Inter type, white cards, teal/sky accent, thin red underline.
export const INTER = "InterV4";
for (const [file, weight, style] of [
  ["Regular", "400", "normal"],
  ["Medium", "500", "normal"],
  ["SemiBold", "600", "normal"],
  ["Bold", "700", "normal"],
  ["ExtraBold", "800", "normal"],
  ["Italic", "400", "italic"],
  ["BoldItalic", "700", "italic"],
] as const) {
  loadFont({ family: INTER, url: staticFile(`fonts/Inter-${file}.otf`), weight, style });
}

export const C = {
  teal: "#1FA6CB", // chart bars / "siz?" accent in the reference
  tealLight: "#62D3F2", // keyword colour on top of video
  sky: "#5AB8F0", // SMS bubble border
  red: "#E2474C", // hand-drawn underline / strike
  ink: "#15181E",
  gray: "#8A9099",
  line: "#E6E9EE",
  white: "#FFFFFF",
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Spring in, eased out at the end of a [0, dur) window.
export const usePresence = (dur: number, delay = 0, exit = 8) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 160, mass: 0.7 } });
  const out = interpolate(f, [dur - exit, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(inn, out);
};

export const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// White card like the iPad slides in the reference.
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.97)",
      borderRadius: 34,
      boxShadow: "0 24px 60px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.12)",
      fontFamily: INTER,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

// Red marker underline drawn left → right.
export const Underline: React.FC<{ p: number; width: number; style?: React.CSSProperties }> = ({ p, width, style }) => (
  <svg width={width} height={16} style={{ display: "block", overflow: "visible", ...style }}>
    <path
      d={`M2 10 Q ${width * 0.3} 4, ${width * 0.55} 9 T ${width - 2} 7`}
      stroke={C.red}
      strokeWidth={4.5}
      strokeLinecap="round"
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);

export const Check: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 40, color = C.teal, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx={20} cy={20} r={19} fill={color} opacity={p} />
    <path
      d="M11 20.5 L17.5 27 L29 14"
      stroke="#fff"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);

export const Cross: React.FC<{ size?: number; p?: number }> = ({ size = 40, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx={20} cy={20} r={19} fill={C.red} opacity={p} />
    <path
      d="M13 13 L27 27 M27 13 L13 27"
      stroke="#fff"
      strokeWidth={4}
      strokeLinecap="round"
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);
