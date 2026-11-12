import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Montserrat variable font, bundled locally (render works offline).
export const fontFamily = "Montserrat";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/montserrat-latin.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});
loadFont({
  family: fontFamily,
  url: staticFile("fonts/montserrat-latin-ext.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

export const C = {
  blue: "#2F6BFF",
  blueDark: "#1A3FB8",
  yellow: "#FFD23F",
  red: "#FF4D4F",
  green: "#22C55E",
  ink: "#0E1530",
  white: "#FFFFFF",
  glass: "rgba(255,255,255,0.94)",
};

// Spring-in + fade-out helper. Returns 0..1 "presence".
export const usePresence = (dur: number, delay = 0, exit = 8) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
  const out = interpolate(f, [dur - exit, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(inn, out);
};

export const Pop: React.FC<{
  dur: number;
  delay?: number;
  from?: "top" | "bottom" | "left" | "right" | "scale";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ dur, delay = 0, from = "scale", style, children }) => {
  const p = usePresence(dur, delay);
  const d = (1 - p) * 120;
  const t =
    from === "top"
      ? `translateY(${-d}px)`
      : from === "bottom"
        ? `translateY(${d}px)`
        : from === "left"
          ? `translateX(${-d}px)`
          : from === "right"
            ? `translateX(${d}px)`
            : `scale(${0.4 + 0.6 * p})`;
  return (
    <div style={{ position: "absolute", opacity: Math.min(1, p * 1.4), transform: t, ...style }}>
      {children}
    </div>
  );
};

// Gentle idle float for stickers.
export const useFloat = (amp = 8, speed = 0.08, phase = 0) => {
  const f = useCurrentFrame();
  return Math.sin(f * speed + phase) * amp;
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.glass,
      borderRadius: 34,
      boxShadow: "0 18px 50px rgba(10,20,60,0.35), 0 2px 0 rgba(255,255,255,0.6) inset",
      padding: "22px 30px",
      display: "flex",
      alignItems: "center",
      gap: 22,
      fontFamily,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const IconBubble: React.FC<{
  bg: string;
  size?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ bg, size = 96, children, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 3.2,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 10px 28px ${bg}66`,
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Sticker: React.FC<{
  x: number;
  y: number;
  dur: number;
  delay?: number;
  bg: string;
  size?: number;
  rotate?: number;
  phase?: number;
  children: React.ReactNode;
}> = ({ x, y, dur, delay = 0, bg, size = 120, rotate = 0, phase = 0, children }) => {
  const p = usePresence(dur, delay);
  const fl = useFloat(7, 0.09, phase);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + fl,
        transform: `scale(${p}) rotate(${rotate + (1 - p) * -25}deg)`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      <IconBubble bg={bg} size={size} style={{ border: "5px solid white" }}>
        {children}
      </IconBubble>
    </div>
  );
};
