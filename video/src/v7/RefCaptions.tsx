import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily as MONT } from "../reel/ui";
import { toNewAlphabet } from "../kiut2/alphabet";
import type { Phrase } from "../shared/StyleCaptions";

/**
 * Reference-style subtitles (Aynura reel): plain white Montserrat, no box, two tiers —
 * a small light line and a BIG extra-bold line (the words wrapped in *stars* in captions.ts).
 * Words blur/fade in on their beat, the big part lands with a zoom-blur "hit".
 * Fixed position below the chin; hidden under motion inserts; new Uzbek alphabet.
 */
type Word = { text: string; big: boolean; at: number };
type Line = { big: boolean; words: Word[] };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const SHADOW = "0 2px 4px rgba(0,0,0,0.55), 0 6px 24px rgba(0,0,0,0.55)";

const parse = (p: Phrase): Line[] => {
  const raw = toNewAlphabet(p.text).split(" ");
  let big = false;
  const ws = raw.map((w) => {
    const open = w.startsWith("*");
    const close = w.endsWith("*");
    if (open) big = true;
    const item = { text: w.replace(/\*/g, ""), big };
    if (close) big = false;
    return item;
  });
  // word timing ~ proportional to word length across the phrase
  const weights = ws.map((w) => w.text.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.max(1, (p.to - p.from) * 0.85);
  let acc = 0;
  const words: Word[] = ws.map((w, i) => {
    const at = Math.round((acc / total) * span);
    acc += weights[i];
    return { ...w, at };
  });
  const lines: Line[] = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last && last.big === w.big) last.words.push(w);
    else lines.push({ big: w.big, words: [w] });
  }
  return lines;
};

export const RefCaptions: React.FC<{ phrases: Phrase[]; top: number; hide?: [number, number][] }> = ({ phrases, top, hide = [] }) => {
  const f = useCurrentFrame();
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const p = phrases.find((x) => f >= x.from && f < x.to);
  if (!p) return null;
  const t = f - p.from;
  const out = interpolate(f, [p.to - 4, p.to], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const lines = parse(p);
  return (
    <div style={{ position: "absolute", top, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: 1 - out, filter: `blur(${out * 8}px)`, transform: `translateY(${-out * 14}px)` }}>
      {lines.map((ln, li) => {
        if (ln.big) {
          // big line lands as one hit, at its first word's beat
          const k = interpolate(t, [ln.words[0].at, ln.words[0].at + 7], [0, 1], { ...clamp, easing: EASE });
          return (
            <div
              key={li}
              style={{
                fontFamily: MONT,
                fontWeight: 900,
                fontSize: 84,
                lineHeight: 1.02,
                letterSpacing: interpolate(k, [0, 1], [8, -1.5]),
                textTransform: "uppercase",
                color: "white",
                textAlign: "center",
                textShadow: SHADOW,
                opacity: k,
                filter: `blur(${(1 - k) * 14}px)`,
                transform: `scale(${1.35 - 0.35 * k})`,
              }}
            >
              {ln.words.map((w) => w.text).join(" ")}
            </div>
          );
        }
        return (
          <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 12px" }}>
            {ln.words.map((w, wi) => {
              const k = interpolate(t, [w.at, w.at + 6], [0, 1], { ...clamp, easing: EASE });
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    fontFamily: MONT,
                    fontWeight: 600,
                    fontSize: 44,
                    lineHeight: 1.25,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "white",
                    textShadow: SHADOW,
                    opacity: k,
                    filter: `blur(${(1 - k) * 8}px)`,
                    transform: `translateY(${(1 - k) * 16}px)`,
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
