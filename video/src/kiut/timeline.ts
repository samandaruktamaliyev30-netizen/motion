// Timeline for "Nega aynan KIUT?" (source: footage/kiut/main.mp4). Frames at 30 fps.
export const FPS = 30;

// Kept parts of the take (pauses removed).
export const CLIPS = [
  { srcStart: 0, srcEnd: 129, out: 0 },
  { srcStart: 138, srcEnd: 293, out: 129 },
  { srcStart: 299, srcEnd: 327, out: 284 },
  { srcStart: 335, srcEnd: 391, out: 312 },
  { srcStart: 402, srcEnd: 732, out: 368 },
  { srcStart: 741, srcEnd: 900, out: 698 },
  { srcStart: 912, srcEnd: 967, out: 857 },
  { srcStart: 974, srcEnd: 992, out: 912 },
  { srcStart: 1001, srcEnd: 1030, out: 930 },
  { srcStart: 1043, srcEnd: 1491, out: 959 },
  { srcStart: 1498, srcEnd: 1549, out: 1407 },
  { srcStart: 1560, srcEnd: 1656, out: 1458 },
] as const;

export const DURATION = 1554;

export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Speaker's face (OpenCV median): x≈536, forehead y≈634, chin y≈878.
export const FACE = { cx: 536, cy: 756 };

// Camera shots in SOURCE seconds: [start, end, scaleStart, scaleEnd].
const SHOTS_SRC: [number, number, number, number][] = [
  [0, 2.74, 1.0, 1.0],
  [2.74, 3.88, 1.18, 1.2],
  [3.88, 4.3, 1.0, 1.01],
  [4.6, 6.28, 1.12, 1.15],
  [6.28, 9.75, 1.0, 1.05],
  [9.98, 10.76, 1.22, 1.24],
  [15.3, 17.5, 1.06, 1.09],
  [17.5, 20.42, 1.24, 1.27],
  [20.42, 23.3, 1.0, 1.04],
  [23.3, 24.41, 1.15, 1.16],
  [24.7, 28.32, 1.02, 1.06],
  [28.32, 30.01, 1.2, 1.22],
  [30.4, 32.23, 1.04, 1.06],
  [32.48, 33.08, 1.25, 1.26],
  [33.37, 34.33, 1.08, 1.09],
  [34.76, 38.22, 1.0, 1.05],
  [38.22, 41.0, 1.2, 1.23],
  [41.0, 41.64, 1.06, 1.07],
  [49.62, 51.62, 1.15, 1.18],
  [52.0, 55.3, 1.0, 1.05],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);

// B-roll cut-aways (output frames) as requested:
// question -> drone shot of the university; "300+ ustoz / 40 ming talaba" -> next shots;
// "amaliyot" -> laboratory.
export const BROLL = {
  drone: { from: 0, to: at(2.74) },
  teacher: { from: at(10.76), to: at(12.82) },
  students: { from: at(12.82), to: at(15.3) },
  lab: { from: at(41.64), to: at(49.62) },
};

// Reason sections for the small "01 / 05" marker.
export const REASONS: [number, number][] = [
  [at(2.74), at(9.75)],
  [at(9.78), at(17.44)],
  [at(17.5), at(32.23)],
  [at(32.48), at(40.9)],
  [at(41.0), DURATION],
];

export const TITLE_END = at(2.74);
export const LOCATION = { from: at(52.0), to: DURATION };

// No captions under the title or the location card.
export const CAPTION_HIDE: [number, number][] = [
  [0, TITLE_END],
  [LOCATION.from, LOCATION.to],
];
