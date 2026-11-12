import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont } from "@remotion/fonts";
import { fontFamily as MONT } from "../reel/ui";

export { MONT };
export const BEBAS = "Bebas Neue";
export const CAVEAT = "Caveat";

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF";

for (const [family, file, weight] of [
  [BEBAS, "bebasneue", "400"],
  [CAVEAT, "caveat", "400 700"],
] as const) {
  loadFont({ family, url: staticFile(`fonts/${file}-latin.woff2`), weight, unicodeRange: LATIN });
  loadFont({ family, url: staticFile(`fonts/${file}-latin-ext.woff2`), weight, unicodeRange: LATIN_EXT });
}

// Palette: medical mint/teal + warm accent.
export const M = {
  mint: "#3EE6A8",
  teal: "#14B8A6",
  sky: "#38BDF8",
  violet: "#8B5CF6",
  coral: "#FF6B6B",
  amber: "#FFC34D",
  ink: "#0B1220",
  white: "#FFFFFF",
  chalk: "#F4F1E8",
  board: "#1F4B3A",
  sage: "#8DB59A",
  sageBox: "rgba(141,181,154,0.88)",
};

export const GRAD = {
  mint: `linear-gradient(135deg, ${M.mint}, ${M.teal})`,
  sky: `linear-gradient(135deg, ${M.sky}, #2563EB)`,
  violet: `linear-gradient(135deg, #A78BFA, ${M.violet})`,
  coral: `linear-gradient(135deg, #FF8A8A, #E11D48)`,
  amber: `linear-gradient(135deg, #FFD978, #F59E0B)`,
};

export const usePresence = (dur: number, delay = 0, exit = 8) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - delay, fps, config: { damping: 15, stiffness: 170, mass: 0.7 } });
  const out = interpolate(f, [dur - exit, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(inn, out);
};

// Dark frosted glass card with a thin light border — modern look.
export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "linear-gradient(160deg, rgba(20,28,45,0.72), rgba(10,16,30,0.62))",
      backdropFilter: "blur(22px) saturate(1.4)",
      WebkitBackdropFilter: "blur(22px) saturate(1.4)",
      border: "1.5px solid rgba(255,255,255,0.18)",
      borderRadius: 36,
      boxShadow: "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
      padding: "22px 28px",
      display: "flex",
      alignItems: "center",
      gap: 22,
      fontFamily: MONT,
      color: M.white,
      ...style,
    }}
  >
    {children}
  </div>
);

// Gradient icon tile with glossy highlight.
export const Tile: React.FC<{ bg: string; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  bg,
  size = 96,
  children,
  style,
}) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 12px 30px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.35)",
      flexShrink: 0,
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.28), transparent 55%)" }} />
    <div style={{ position: "relative", display: "flex" }}>{children}</div>
  </div>
);

export const Heading: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 48,
  color = M.white,
}) => (
  <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: size, lineHeight: 1.08, color, letterSpacing: -0.5 }}>
    {children}
  </div>
);

export const Small: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "rgba(255,255,255,0.72)" }) => (
  <div style={{ fontFamily: MONT, fontWeight: 600, fontSize: 31, color, marginTop: 6, lineHeight: 1.2 }}>{children}</div>
);

// Card that drops in from the top zone (above the expert's head).
export const TopCard: React.FC<{ dur: number; delay?: number; y?: number; children: React.ReactNode }> = ({
  dur,
  delay = 0,
  y = 240,
  children,
}) => {
  const p = usePresence(dur, delay);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * -90}px) scale(${0.92 + 0.08 * p})`,
        filter: `blur(${(1 - p) * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Floating sticker beside the head.
export const Badge: React.FC<{
  x: number;
  y: number;
  dur: number;
  delay?: number;
  bg: string;
  size?: number;
  rotate?: number;
  children: React.ReactNode;
}> = ({ x, y, dur, delay = 0, bg, size = 120, rotate = 0, children }) => {
  const p = usePresence(dur, delay);
  const f = useCurrentFrame();
  const fl = Math.sin(f * 0.09 + x) * 7;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + fl,
        transform: `scale(${p}) rotate(${rotate + (1 - p) * -30}deg)`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      <Tile bg={bg} size={size} style={{ border: "4px solid rgba(255,255,255,0.9)" }}>
        {children}
      </Tile>
    </div>
  );
};
