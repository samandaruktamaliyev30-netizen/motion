import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek → new alphabet in StyleCaptions).
// Parts carried by motion inserts are omitted here.
const SRC: [number, string][] = [
  [10.3, "chunki bu savollar murakkabligi jihatidan"],
  [13.8, "—"],
  [19.66, "Bu savollar anchayin murakkab"],
  [21.17, "va fikrlashga majbur qiladi."],
  [23.6, "—"],
];

export const PHRASES: Phrase[] = SRC.filter(([, t]) => t !== "—").map(([s, text]) => {
  const i = SRC.findIndex(([ss]) => ss === s);
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : DURATION, text };
});
