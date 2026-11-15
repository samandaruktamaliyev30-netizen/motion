import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily as MONT } from "../reel/ui";
import { toNewAlphabet } from "../kiut2/alphabet";
import type { Phrase } from "../shared/StyleCaptions";

/**
 * "Pop" subtitle style (reference-inspired, used for the Aynura reel):
 * big uppercase Montserrat 800, 1–3 words at a time, each word pops in on its beat,
 * the word being spoken sits on a violet pill, key words glow gold.
 * Fixed position below the chin; hidden under motion inserts; new Uzbek alphabet.
 */
const VIOLET = "#8B5CF6";
const GOLD = "#FFD27A";
const KEY = /^(energiya|texnika|maqsad|ishlamaydi|past|obuna|telegram|nimaga|ong|pro|max|18|17)/i;

type W = { text: string; from: number; to: number };

// Word timings: phrase duration split by word length (speech is roughly even).
const words = (p: Phrase): W[] => {
  const ws = toNewAlphabet(p.text).split(" ");
  const weights = ws.map((w) => w.replace(/[^\p{L}\d]/gu, "").length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.max(1, p.to - p.from - 4);
  let acc = 0;
  return ws.map((text, i) => {
    const from = p.from + Math.round((acc / total) * span);
    acc += weights[i];
    return { text, from, to: p.from + Math.round((acc / total) * span) };
  });
};

// Group words into short chunks (≤3 words, ≤18 letters) so a line never gets long.
const chunks = (ws: W[]): W[][] => {
  const out: W[][] = [];
  let cur: W[] = [];
  for (const w of ws) {
    const len = cur.reduce((a, x) => a + x.text.length + 1, 0) + w.text.length;
    if (cur.length && (cur.length >= 3 || len > 18)) {
      out.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) out.push(cur);
  return out;
};

export const PopCaptions: React.FC<{ phrases: Phrase[]; top: number; hide?: [number, number][] }> = ({ phrases, top, hide = [] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const p = phrases.find((x) => f >= x.from && f < x.to);
  if (!p) return null;
  const cs = chunks(words(p));
  const ci = cs.findIndex((c, i) => f >= c[0].from && (i === cs.length - 1 || f < cs[i + 1][0].from));
  const chunk = cs[Math.max(0, ci)];
  const isLast = ci === cs.length - 1;
  const out = isLast ? interpolate(f, [p.to - 3, p.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "6px 16px", opacity: out }}>
      {chunk.map((w, i) => {
        if (f < w.from) return null;
        const s = spring({ frame: f - w.from, fps, config: { damping: 11, stiffness: 260, mass: 0.6 } });
        const active = f >= w.from && (f < w.to || (isLast && i === chunk.length - 1));
        const key = KEY.test(w.text.replace(/^[«"(]/, ""));
        return (
          <span
            key={`${ci}-${i}`}
            style={{
              display: "inline-block",
              fontFamily: MONT,
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 1.1,
              letterSpacing: -1,
              textTransform: "uppercase",
              color: key && !active ? GOLD : "white",
              padding: "2px 16px 6px",
              borderRadius: 18,
              background: active ? VIOLET : "transparent",
              boxShadow: active ? "0 10px 30px rgba(139,92,246,0.55)" : "none",
              textShadow: active ? "0 2px 6px rgba(0,0,0,0.35)" : "0 4px 0 rgba(0,0,0,0.55), 0 6px 22px rgba(0,0,0,0.75)",
              WebkitTextStroke: active ? undefined : "1.5px rgba(0,0,0,0.35)",
              transform: `translateY(${(1 - s) * 40}px) scale(${(0.55 + 0.45 * s) * (active ? 1.06 : 1)}) rotate(${(1 - s) * -6}deg)`,
              opacity: Math.min(1, s * 2),
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
