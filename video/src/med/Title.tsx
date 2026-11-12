import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEBAS, GRAD, M } from "./ui";
import { TITLE_END } from "./timeline";

// "NEGA UNIVERSITETDA O‘QISH QIYIN?" — visible 0..3 s, framed around the face:
// NEGA above the head, the rest below the chin.
export const Title: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f >= TITLE_END) return null;

  const exit = interpolate(f, [TITLE_END - 10, TITLE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const nega = "NEGA".split("");
  const line2In = spring({ frame: f - 10, fps, config: { damping: 14, stiffness: 140 } });
  const boxWipe = interpolate(f, [18, 32], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textIn = spring({ frame: f - 24, fps, config: { damping: 13, stiffness: 160 } });
  const shine = interpolate(f, [34, 60], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.08})`, filter: `blur(${exit * 10}px)` }}>
      {/* Top: NEGA with outlined echoes */}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          {nega.map((ch, i) => {
            const s = spring({ frame: f - i * 3, fps, config: { damping: 12, stiffness: 180 } });
            return (
              <span
                key={i}
                style={{
                  fontFamily: BEBAS,
                  fontSize: 300,
                  lineHeight: 0.9,
                  color: M.white,
                  letterSpacing: 8,
                  display: "inline-block",
                  transform: `translateY(${(1 - s) * 120}px)`,
                  opacity: s,
                  textShadow: "0 12px 40px rgba(0,0,0,0.55)",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {[0.55, 0.25].map((o, k) => {
          const s = spring({ frame: f - 8 - k * 5, fps, config: { damping: 16 } });
          return (
            <div
              key={k}
              style={{
                fontFamily: BEBAS,
                fontSize: 300,
                lineHeight: 0.9,
                letterSpacing: 8,
                color: "transparent",
                WebkitTextStroke: `3px rgba(255,255,255,${o})`,
                marginTop: -200,
                transform: `translateY(${(1 - s) * -60}px)`,
                opacity: s,
                WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 45%, black 70%, transparent 100%)",
                maskImage: "linear-gradient(180deg, transparent 0%, black 45%, black 70%, transparent 100%)",
              }}
            >
              NEGA
            </div>
          );
        })}
      </div>

      {/* Bottom: UNIVERSITETDA / O‘QISH QIYIN? (below the chin) */}
      <div style={{ position: "absolute", top: 1000, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div
          style={{
            fontFamily: BEBAS,
            fontSize: 150,
            lineHeight: 0.95,
            letterSpacing: 4,
            color: M.white,
            transform: `translateY(${(1 - line2In) * 80}px)`,
            opacity: line2In,
            textShadow: "0 10px 34px rgba(0,0,0,0.6)",
          }}
        >
          UNIVERSITETDA
        </div>
        <div style={{ position: "relative", padding: "6px 34px 0", transform: "rotate(-2deg)" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              background: GRAD.mint,
              clipPath: `inset(0 ${100 - boxWipe}% 0 0 round 22px)`,
              boxShadow: "0 16px 40px rgba(20,184,166,0.45)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${shine}%`,
                width: "18%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          </div>
          <div
            style={{
              position: "relative",
              fontFamily: BEBAS,
              fontSize: 158,
              lineHeight: 1,
              letterSpacing: 4,
              color: M.ink,
              opacity: textIn,
              transform: `scale(${0.8 + 0.2 * textIn})`,
            }}
          >
            O‘QISH QIYIN?
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
