import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAGES } from "./words";
import { DROP, HEADLINE_HIDE } from "./timeline";
import { clamp, INTER, K } from "./kit";

// Kinetic headline in the top band: every spoken word drops in with a spring, blur and a
// slight 3D tilt; keywords get the accent colour (red in the "problem" half, teal after the drop)
// and a soft glow.
export const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (HEADLINE_HIDE.some(([a, b]) => f >= a && f < b)) return null;
  const page = PAGES.find((p) => f >= p.from && f < p.to);
  if (!page) return null;
  const exit = interpolate(f, [page.to - 4, page.to], [0, 1], clamp);
  const accent = page.from >= DROP ? K.teal : K.red;

  return (
    <AbsoluteFill style={{ top: 250, height: 380, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 980,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "0 26px",
          opacity: 1 - exit,
          transform: `translateY(${-exit * 30}px)`,
          filter: `blur(${exit * 8}px)`,
        }}
      >
        {page.words.map((w, i) => {
          const sp = spring({ frame: f - w.from, fps, config: { damping: 13, stiffness: 210, mass: 0.6 } });
          const vis = f >= w.from;
          return (
            <span
              key={i}
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: w.key ? 100 : 88,
                lineHeight: 1.12,
                letterSpacing: -2.5,
                color: w.key ? accent : K.white,
                display: "inline-block",
                opacity: vis ? Math.min(1, sp * 1.3) : 0,
                transform: `perspective(800px) translateY(${(1 - sp) * 60}px) rotateX(${(1 - sp) * -55}deg) scale(${0.8 + 0.2 * sp})`,
                filter: `blur(${(1 - Math.min(sp, 1)) * 10}px)`,
                textShadow: w.key ? `0 0 34px ${accent}88, 0 6px 24px rgba(0,0,0,0.6)` : "0 6px 24px rgba(0,0,0,0.6)",
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
