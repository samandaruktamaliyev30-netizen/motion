// "Kimyo" edit — hook clip (a1, 0–1.97 s) + footage/v7/main.mp4 with pauses removed.
export const FPS = 30;
export const HOOK = 59; // frames of the "100 mln+ oylik olaman" clip at the very start

export const CLIPS = [
  { srcStart: 0, srcEnd: 54, out: 59 },
  { srcStart: 74, srcEnd: 125, out: 113 },
  { srcStart: 136, srcEnd: 279, out: 164 },
  { srcStart: 286, srcEnd: 394, out: 307 },
  { srcStart: 401, srcEnd: 494, out: 415 },
  { srcStart: 508, srcEnd: 616, out: 508 },
  { srcStart: 625, srcEnd: 1217, out: 616 },
  { srcStart: 1224, srcEnd: 1356, out: 1208 },
  { srcStart: 1364, srcEnd: 1415, out: 1340 },
  { srcStart: 1429, srcEnd: 1598, out: 1391 },
  { srcStart: 1612, srcEnd: 1767, out: 1560 },
] as const;
export const DURATION = 1715;

// main-video source seconds -> output frame
export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Speaker (OpenCV median): x≈561, forehead≈576, chin≈838.
export const FACE = { cx: 561, cy: 707 };
export const LOW = 1000;

const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// B-roll as requested
export const BROLL = {
  hook: { from: 0, to: HOOK },
  class: r(9.12, 16.45), // "1-sababi" -> many students sitting
  teach: r(30.84, 34.1), // "3-sababi" -> teacher lecturing in the auditorium
  money: r(47.32, 51.2), // "oyligini oshirish kerak" -> money
};

// Motion inserts (subtitles hidden meanwhile)
export const M = {
  hook: { from: 0, to: HOOK },
  question: r(5.4, 7.82),
  n1: r(9.12, 10.3),
  n2: r(17.06, 17.62),
  n3: r(30.84, 31.3),
  n4: r(37.04, 37.48),
  ninety: r(42.3, 44.78),
  salary: r(47.32, 51.2),
  dreams: r(51.2, 54.6),
  subscribe: { from: at(54.64), to: DURATION },
};

export const SHOTS_SRC: [number, number, number, number][] = [
  [0, 1.8, 1.0, 1.04],
  [2.45, 4.18, 1.18, 1.2],
  [4.52, 7.84, 1.0, 1.05],
  [7.84, 9.12, 1.2, 1.22],
  [16.45, 20.55, 1.0, 1.05],
  [20.82, 25.14, 1.15, 1.18],
  [25.14, 30.84, 1.0, 1.06],
  [34.1, 37.04, 1.18, 1.2],
  [37.04, 40.56, 1.0, 1.04],
  [40.8, 45.2, 1.14, 1.18],
  [45.47, 47.17, 1.0, 1.02],
  [51.2, 53.25, 1.2, 1.22],
  [53.74, 59.0, 1.0, 1.05],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);
