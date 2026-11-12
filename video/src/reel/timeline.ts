// Timeline for reel "Milliy sertifikat bekor bo'ladimi?" (source: footage/19.mp4)
// All values in frames at 30 fps unless noted.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Kept parts of the source (silences removed). src* = source frames, out = output start.
export const CLIPS = [
  { srcStart: 0, srcEnd: 126, out: 0 },
  { srcStart: 141, srcEnd: 589, out: 126 },
  { srcStart: 599, srcEnd: 649, out: 574 },
  { srcStart: 658, srcEnd: 856, out: 624 },
  { srcStart: 866, srcEnd: 1163, out: 822 },
  { srcStart: 1176, srcEnd: 1239, out: 1119 },
] as const;

export const DURATION = 1182;

// Source seconds -> output frame (snaps forward if inside a removed gap).
export const srcToOut = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Expert face in the source frame (measured with OpenCV): centre and box.
export const FACE = { cx: 535, cy: 820, top: 650, bottom: 1000 };

// Camera shots: [from, to, scaleStart, scaleEnd]. Zoom is anchored on the face,
// so the face never leaves the frame.
export const SHOTS: [number, number, number, number][] = [
  [0, 42, 1.0, 1.05],
  [42, 126, 1.2, 1.24],
  [126, 293, 1.0, 1.07],
  [293, 410, 1.14, 1.18],
  [410, 438, 1.3, 1.32],
  [438, 574, 1.0, 1.06],
  [574, 624, 1.18, 1.2],
  [624, 715, 1.02, 1.06],
  [715, 766, 1.12, 1.15],
  [766, 838, 1.28, 1.31],
  [838, 968, 1.0, 1.07],
  [968, 1022, 1.2, 1.23],
  [1022, 1119, 1.0, 1.05],
  [1119, 1182, 1.12, 1.16],
];
