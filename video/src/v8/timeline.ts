// "Noyabrda Milliy sertifikatdan qanday savollar tushadi?" — footage/v8/main.mp4, pauses removed.
export const FPS = 30;
export const CLIPS = [
  { srcStart: 0, srcEnd: 626, out: 0 },
  { srcStart: 635, srcEnd: 670, out: 626 },
  { srcStart: 679, srcEnd: 713, out: 661 },
  { srcStart: 722, srcEnd: 866, out: 695 },
  { srcStart: 875, srcEnd: 1061, out: 839 },
  { srcStart: 1070, srcEnd: 1244, out: 1025 },
] as const;
export const DURATION = 1199;

export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Speaker (OpenCV median): x≈561, forehead≈576, chin≈798 (max 838).
export const FACE = { cx: 561, cy: 687 };
export const LOW = 960;

const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Motion inserts (subtitles hidden while each is on screen)
export const M = {
  hook: { from: 0, to: at(2.8) },
  top3: r(2.82, 7.9),
  card1: r(7.94, 10.3),
  hard: r(13.8, 16.55),
  card2: r(16.62, 19.66),
  card3: r(23.64, 31.98),
  book: r(31.98, 36.94),
  cta: { from: at(36.96), to: DURATION },
};

export const SHOTS_SRC: [number, number, number, number][] = [
  [0, 2.8, 1.0, 1.06], // hook (whip-zoom is added on top)
  [2.8, 7.92, 1.14, 1.18],
  [7.92, 10.3, 1.0, 1.03],
  [10.3, 13.8, 1.22, 1.26],
  [13.8, 16.6, 1.04, 1.08],
  [16.6, 19.66, 1.18, 1.2],
  [19.66, 23.6, 1.0, 1.06],
  [23.6, 28.86, 1.12, 1.16],
  [29.18, 31.98, 1.0, 1.03],
  [31.98, 35.36, 1.2, 1.23],
  [35.67, 36.96, 1.05, 1.07],
  [36.96, 41.5, 1.14, 1.2],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);
