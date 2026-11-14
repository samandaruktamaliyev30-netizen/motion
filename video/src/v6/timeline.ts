// "Choy nega sekin qaynaydi?" — source footage/v6/main.mp4 (86.9 s), pauses removed.
export const FPS = 30;
export const CLIPS = [
  { srcStart: 0, srcEnd: 256, out: 0 },
  { srcStart: 265, srcEnd: 938, out: 256 },
  { srcStart: 946, srcEnd: 1736, out: 929 },
  { srcStart: 1762, srcEnd: 1918, out: 1719 },
  { srcStart: 1972, srcEnd: 2450, out: 1875 },
  { srcStart: 2465, srcEnd: 2608, out: 2353 },
] as const;
export const DURATION = 2496;

export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Speaker's face (OpenCV median): x≈547, forehead≈586, chin≈859 (max 928).
export const FACE = { cx: 547, cy: 722 };
export const LOW = 1010; // subtitles & motion live here, below the chin

const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// B-roll as requested: kettle while the question is asked (ends with the question),
// tea cup at "qaynash temperaturasi".
export const KETTLE = r(0, 5.86);
export const TEA = r(42.52, 45.48);

// Motion inserts (subtitles hidden while each is on screen).
export const M = {
  title: { from: 0, to: 90 }, // first 3 s
  myth: r(3.0, 5.86),
  race: r(5.98, 13.2),
  salts: r(13.3, 15.15),
  ions: r(20.46, 26.56),
  raoult: r(32.54, 35.62),
  thermo: r(45.48, 48.41),
  guests: r(58.74, 62.23),
  fast: r(76.68, 78.7),
  subscribe: { from: at(82.18), to: DURATION },
};

export const SHOTS_SRC: [number, number, number, number][] = [
  [5.86, 13.2, 1.0, 1.05],
  [13.3, 15.2, 1.18, 1.2],
  [15.2, 20.46, 1.0, 1.05],
  [20.46, 26.56, 1.12, 1.16],
  [26.56, 32.54, 1.0, 1.05],
  [32.54, 35.62, 1.2, 1.22],
  [35.62, 42.52, 1.04, 1.1],
  [45.48, 48.41, 1.15, 1.18],
  [48.41, 54.7, 1.0, 1.06],
  [54.7, 57.85, 1.18, 1.2],
  [58.74, 63.95, 1.04, 1.08],
  [65.75, 69.46, 1.2, 1.22],
  [69.46, 76.66, 1.0, 1.06],
  [76.66, 81.66, 1.14, 1.18],
  [82.18, 87.0, 1.0, 1.05],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);
