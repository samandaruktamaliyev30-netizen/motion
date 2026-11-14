import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { beatPulse, DROP } from "./timeline";
import { clamp, K } from "./kit";

// Living dark background: drifting perspective grid, two colour orbs, dust particles.
// Before the drop the mood is tense (red/indigo); after it the frame opens up in teal
// and everything breathes on the beat.
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const post = interpolate(f, [DROP - 2, DROP + 10], [0, 1], clamp);
  const beat = beatPulse(f);
  const t = f / 30;

  const orb = (seed: string, base: [number, number], col: string, size: number) => {
    const x = base[0] + noise2D(seed, t * 0.12, 0) * 160;
    const y = base[1] + noise2D(seed, 0, t * 0.12) * 200;
    return (
      <div
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${col} 0%, transparent 65%)`,
          transform: `scale(${1 + beat * 0.08})`,
        }}
      />
    );
  };

  const preA = "rgba(255,60,80,0.22)";
  const preB = "rgba(90,70,220,0.25)";
  const postA = `rgba(43,196,232,${0.28 + beat * 0.12})`;
  const postB = "rgba(40,90,255,0.26)";

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.bg1} 0%, ${K.bg0} 70%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 1 - post }}>
        {orb("a", [250, 500], preA, 1100)}
        {orb("b", [850, 1500], preB, 1200)}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: post }}>
        {orb("c", [820, 450], postA, 1200)}
        {orb("d", [200, 1450], postB, 1300)}
      </AbsoluteFill>

      {/* perspective floor grid */}
      <div
        style={{
          position: "absolute",
          left: -600,
          right: -600,
          top: 1150,
          height: 1400,
          transform: "perspective(700px) rotateX(62deg)",
          transformOrigin: "50% 0%",
          backgroundImage: `linear-gradient(${post ? "rgba(43,196,232,0.22)" : "rgba(255,255,255,0.08)"} 2px, transparent 2px), linear-gradient(90deg, ${post ? "rgba(43,196,232,0.22)" : "rgba(255,255,255,0.08)"} 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${(f * 3) % 120}px`,
          maskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 60%, transparent 100%)",
          opacity: 0.8 + beat * 0.2,
        }}
      />

      {/* dust */}
      {new Array(36).fill(0).map((_, i) => {
        const x = ((i * 137.5) % 1080) + noise2D("px" + i, t * 0.1, 0) * 60;
        const y = (((i * 263) % 1920) - f * (0.6 + (i % 5) * 0.25) + 1920 * 4) % 1920;
        const sz = 3 + (i % 4) * 2;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: post ? "#9BE8FA" : "#ffffff", opacity: 0.15 + (i % 3) * 0.1 }} />;
      })}

      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};
