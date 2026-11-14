import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { toNewAlphabet } from "../kiut2/alphabet";

/**
 * HOUSE SUBTITLE STYLE — use this for every edit (user's request).
 * White Inter 600 on a frosted dark pill that opens from the centre, a light sweep,
 * words rising one after another and a thin phrase-progress line.
 * Text is converted to the new Uzbek alphabet (ö, ğ, ş, ç).
 * Position is fixed (below the speaker's chin) — it never jumps around.
 */
export const INTER = "Inter";
loadFont({
  family: INTER,
  url: staticFile("fonts/inter-latin.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});
loadFont({
  family: INTER,
  url: staticFile("fonts/inter-latin-ext.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

export type Phrase = { from: number; to: number; text: string };

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const StyleCaptions: React.FC<{
  phrases: Phrase[];
  top: number;
  hide?: [number, number][];
  newAlphabet?: boolean;
}> = ({ phrases, top, hide = [], newAlphabet = true }) => {
  const f = useCurrentFrame();
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const p = phrases.find((x) => f >= x.from && f < x.to);
  if (!p) return null;
  const t = f - p.from;
  const dur = p.to - p.from;
  const open = interpolate(t, [0, 8], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [p.to - 4, p.to], [1, 0], clamp);
  const progress = interpolate(t, [0, dur - 2], [0, 1], clamp);
  const sweep = interpolate(t, [3, 18], [-40, 140], clamp);
  const words = (newAlphabet ? toNewAlphabet(p.text) : p.text).split(" ");
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
      <div
        style={{
          position: "relative",
          maxWidth: 940,
          padding: "20px 38px 26px",
          borderRadius: 30,
          overflow: "hidden",
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 30px)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(14,18,28,0.62), rgba(14,18,28,0.42))", backdropFilter: "blur(16px) saturate(1.3)", border: "1.5px solid rgba(255,255,255,0.16)", borderRadius: 30 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "22%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)", transform: "skewX(-20deg)" }} />
        <div style={{ position: "absolute", left: 38, right: 38, bottom: 12, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
        </div>
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
          {words.map((w, i) => {
            const k = interpolate(t, [3 + i * 2, 11 + i * 2], [0, 1], { ...clamp, easing: EASE });
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 6 }}>
                <span style={{ display: "inline-block", fontFamily: INTER, fontWeight: 600, fontSize: 56, lineHeight: 1.2, letterSpacing: -0.5, color: "white", transform: `translateY(${(1 - k) * 70}px)`, opacity: k }}>
                  {w}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
