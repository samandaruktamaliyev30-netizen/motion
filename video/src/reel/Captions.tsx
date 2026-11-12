import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAGES } from "./captions";
import { C, fontFamily } from "./ui";

// Captions sit below the expert's chin (chin is at y<=1050 even at max zoom)
// and above Instagram's bottom UI (y>~1560). Width leaves room for IG side buttons.
const CAP_TOP = 1150;
const CAP_WIDTH = 860;

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = PAGES.find((p) => frame >= p.from && frame < p.to);
  if (!page) return null;

  const enter = spring({ frame: frame - page.from, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });
  const activeIdx = page.words.reduce((acc, w, i) => (frame >= w.from ? i : acc), 0);

  return (
    <AbsoluteFill style={{ top: CAP_TOP, height: "auto", alignItems: "center" }}>
      <div
        style={{
          width: CAP_WIDTH,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px 14px",
          transform: `translateY(${(1 - enter) * 40}px) scale(${0.85 + 0.15 * enter})`,
          opacity: Math.min(1, enter * 1.5),
        }}
      >
        {page.words.map((w, i) => {
          const active = i === activeIdx;
          const seen = frame >= w.from;
          const wp = spring({ frame: frame - w.from, fps, config: { damping: 12, stiffness: 260 } });
          const bg = active ? (w.key ? C.yellow : C.blue) : "transparent";
          const color = active ? (w.key ? C.ink : C.white) : w.key ? C.yellow : C.white;
          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 80,
                lineHeight: 1.12,
                letterSpacing: -1,
                color,
                background: bg,
                borderRadius: 22,
                padding: "2px 18px 8px",
                opacity: seen ? 1 : 0.7,
                transform: `scale(${active ? 1 + 0.08 * wp : 1}) rotate(${active ? -2 * wp : 0}deg)`,
                WebkitTextStroke: active ? "0px" : "12px rgba(10,14,30,0.92)",
                paintOrder: "stroke fill",
                textShadow: active ? "none" : "0 6px 22px rgba(0,0,0,0.45)",
                boxShadow: active ? "0 10px 30px rgba(0,0,0,0.35)" : "none",
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
