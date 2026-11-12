import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAGES } from "./captions";
import { M, MONT } from "./ui";

// Reference-2 style: clean white text at chest height, words appear as they are spoken.
// Improved: keyword accent, soft glow on the current word, smooth rise-in.
const TOP = 1010; // chin is at y≈870 (≈905 at max zoom)
const WIDTH = 900;

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = PAGES.find((p) => frame >= p.from && frame < p.to);
  if (!page) return null;
  const exit = interpolate(frame, [page.to - 4, page.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const current = page.words.reduce((acc, w, i) => (frame >= w.from ? i : acc), -1);

  return (
    <AbsoluteFill style={{ top: TOP, height: "auto", alignItems: "center", opacity: exit }}>
      <div style={{ width: WIDTH, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 24px" }}>
        {page.words.map((w, i) => {
          const s = spring({ frame: frame - w.from, fps, config: { damping: 15, stiffness: 220, mass: 0.5 } });
          const visible = frame >= w.from;
          const isCur = i === current;
          return (
            <span
              key={i}
              style={{
                fontFamily: MONT,
                fontWeight: 800,
                fontSize: 70,
                lineHeight: 1.18,
                letterSpacing: -0.5,
                color: w.key ? "#6CFFC2" : M.white,
                opacity: visible ? s : 0,
                transform: `translateY(${(1 - s) * 26}px) scale(${isCur ? 1.06 : 1})`,
                display: "inline-block",
                WebkitTextStroke: "9px rgba(8,12,22,0.9)",
                paintOrder: "stroke fill",
                textShadow: isCur
                  ? `0 0 26px ${w.key ? "rgba(62,230,168,0.65)" : "rgba(255,255,255,0.45)"}, 0 4px 18px rgba(0,0,0,0.7)`
                  : "0 4px 18px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.6)",
                filter: `blur(${(1 - s) * 6}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
