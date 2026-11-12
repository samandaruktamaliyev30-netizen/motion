// Timeline for "Natijaga 100% kafolat berasizmi?" (source: footage/4.mp4).
// public/v4/cut.mp4 + voice.wav are already cut (pauses, false starts and the
// repeated "mana shu loyiha…" / "Bu videoni…" takes removed), so output time = file time.
export const FPS = 30;
export const DURATION = 1903;
export const s = (sec: number) => Math.round(sec * FPS);

// Output frames where each kept clip starts (jump cuts).
export const CUTS = [0, 135, 217, 358, 424, 524, 563, 651, 718, 766, 811, 917, 1031, 1084, 1187, 1201, 1258, 1405, 1510, 1562, 1638, 1646, 1718, 1745, 1814];

// Face (OpenCV median on cut.mp4): cx≈516, forehead≈742, chin≈1064.
export const FACE = { cx: 516, cy: 900 };

// Punch-in pattern that changes on every cut, so jump cuts read as camera moves.
const PATTERN = [1.0, 1.14, 1.05, 1.2, 1.09, 1.17];
export const SHOTS: [number, number, number, number][] = CUTS.map((a, i) => {
  const b = CUTS[i + 1] ?? DURATION;
  const base = PATTERN[i % PATTERN.length];
  return [a, b, base, base + 0.035];
});

// Overlays in output frames. Captions are hidden while any of these is on screen.
export const G = {
  sms: [0, s(4.4)],
  checklist: [s(11.2), s(16.2)],
  rizq: [s(22.78), s(23.93)],
  chart: [s(30.32), s(33.2)],
  ab: [s(40.1), s(43.95)],
  summary: [s(56.9), s(60.4)],
  outro: [s(60.42), DURATION],
} as const;

export const CAPTION_HIDE: (readonly [number, number])[] = Object.values(G);
