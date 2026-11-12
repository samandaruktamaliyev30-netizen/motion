// Timeline for "Nega universitetda o'qish qiyin?" (source: footage/med universitet.mp4)
export const FPS = 30;

// Kept parts of the take (pauses removed). Frames at 30 fps.
export const CLIPS = [
  { srcStart: 0, srcEnd: 343, out: 0 },
  { srcStart: 352, srcEnd: 673, out: 343 },
  { srcStart: 685, srcEnd: 1144, out: 664 },
  { srcStart: 1152, srcEnd: 1180, out: 1123 },
  { srcStart: 1189, srcEnd: 1314, out: 1151 },
  { srcStart: 1320, srcEnd: 1453, out: 1276 },
  { srcStart: 1462, srcEnd: 1650, out: 1409 },
] as const;

export const DURATION = 1597;

// Source seconds -> output frame.
export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Expert's face (OpenCV, median): x≈522, forehead y≈620, chin y≈870.
export const FACE = { cx: 522, cy: 745 };

export const TITLE_END = 90; // title disappears exactly at 3 s

// Camera shots in SOURCE seconds: [start, end, scaleStart, scaleEnd].
const SHOTS_SRC: [number, number, number, number][] = [
  [0, 3.0, 1.0, 1.05],
  [3.0, 4.62, 1.2, 1.24],
  [4.62, 6.1, 1.0, 1.03],
  [6.1, 8.74, 1.25, 1.29],
  [8.74, 14.14, 1.1, 1.14],
  [14.14, 18.86, 1.0, 1.05],
  [18.86, 22.44, 1.22, 1.26],
  [22.8, 24.68, 1.06, 1.08],
  [24.68, 28.7, 1.28, 1.32],
  [28.7, 31.56, 1.04, 1.07],
  [31.56, 38.14, 1.15, 1.19],
  [38.4, 39.34, 1.0, 1.01],
  [39.63, 42.26, 1.2, 1.23],
  [42.26, 43.8, 1.0, 1.02],
  [44.0, 46.48, 1.14, 1.17],
  [46.48, 48.44, 1.26, 1.29],
  [48.72, 49.8, 1.08, 1.1],
  [49.8, 53.3, 1.0, 1.05],
  [53.3, 55.0, 1.14, 1.17],
];

export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [
  at(a),
  at(b),
  s0,
  s1,
]);

// Full-screen chalkboard cut-aways (output frames).
export const BOARD1 = { from: at(8.74), to: at(11.73) }; // school vs institute
export const BOARD2 = { from: at(31.56), to: at(34.18) }; // pH example
