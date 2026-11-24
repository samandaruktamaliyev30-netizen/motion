// "Mijoz $1500" vlog (source: footage/ozim/IMG_0370.MOV). public/oz/cut.mp4 + voice.wav are
// already cut (pauses removed), so output time = file time.
export const FPS = 30;
export const DURATION = 1006; // 33.53 s
export const s = (sec: number) => Math.round(sec * FPS);

// Output frames where each kept clip starts (jump cuts).
export const CUTS = [0, 98, 123, 226, 428, 460, 541, 826, 873, 960];

// Face (OpenCV on cut.mp4): x 180–680, top ≈565, chin ≈1060 → cards above y≈470, captions below y≈1150.
export const FACE = { cx: 430, cy: 820 };

const PATTERN = [1.0, 1.07, 1.02, 1.1];
export const SHOTS: [number, number, number, number][] = CUTS.map((a, i) => {
  const b = CUTS[i + 1] ?? DURATION;
  const base = PATTERN[i % PATTERN.length];
  return [a, b, base, base + 0.025];
});

// Top cards [from, to] in seconds.
export const G = {
  pay: [0.0, 2.75],
  contract: [4.26, 7.55],
  month: [7.6, 12.42],
  why: [12.44, 15.05],
  time: [19.17, 21.9],
  dec: [21.96, 26.05],
  comment: [26.68, 29.05],
  share: [29.09, 32.1],
} as const;
