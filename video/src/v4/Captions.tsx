import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAGES } from "./captions";
import { CAPTION_HIDE } from "./timeline";
import { C, INTER } from "./ui";

// Reference style: short white phrases at chest height, wide word spacing, each word
// fades/unblurs in as it is spoken; keywords in the teal accent.
const TOP = 1440; // chin ≈ 1064 (≈1100 at max punch-in), mic hand ≈ 1150–1400
const WIDTH = 940;

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (CAPTION_HIDE.some(([a, b]) => frame >= a && frame < b)) return null;
  const page = PAGES.find((p) => frame >= p.from && frame < p.to);
  if (!page) return null;
  const exit = interpolate(frame, [page.to - 3, page.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ top: TOP, height: "auto", alignItems: "center", opacity: exit }}>
      <div style={{ width: WIDTH, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px" }}>
        {page.words.map((w, i) => {
          const sp = spring({ frame: frame - w.from, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
          const visible = frame >= w.from;
          return (
            <span
              key={i}
              style={{
                fontFamily: INTER,
                fontWeight: w.key ? 700 : 600,
                fontSize: 62,
                lineHeight: 1.2,
                letterSpacing: -0.6,
                color: w.key ? C.tealLight : C.white,
                opacity: visible ? sp : 0,
                transform: `translateY(${(1 - sp) * 18}px)`,
                display: "inline-block",
                filter: `blur(${(1 - sp) * 7}px)`,
                textShadow: "0 3px 14px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.55)",
                WebkitTextStroke: "1.5px rgba(0,0,0,0.25)",
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
