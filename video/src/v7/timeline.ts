// "Energiya va texnika" (Aynura) — source footage/v7/aynura/kadr/IMG_4844.MP4 (62.1 s, 30 fps).
// Burnt-in CapCut captions are inpainted away (scripts/v7_detext.py → public/v7/clean.mp4).
export const FPS = 30;
// Two dead pauses are removed: 28.6–30.25 s and 47.95–48.4 s.
export const CLIPS = [
  { srcStart: 0, srcEnd: 858, out: 0 },
  { srcStart: 908, srcEnd: 1439, out: 858 },
  { srcStart: 1452, srcEnd: 1864, out: 1389 },
] as const;
export const SPEECH_END = 1801;
export const TAIL = 54; // freeze on the last frame while the subscribe button finishes
export const DURATION = SPEECH_END + TAIL;

export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return SPEECH_END;
};

// Speaker's face: centre x≈530, eyes≈720, chin≈1100.
export const FACE = { cx: 530, cy: 800 };
export const LOW = 1300; // subtitles & motion live here, below the chin

const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Pictures / B-roll as requested in the brief.
export const PICS = {
  wedding: r(0, 1.6), // "Erga tegishni xohlayman"
  phone: r(1.6, 4.6), // "18 Pro Max / 17 Pro Max xohlayman"
  energy1: r(17.25, 18.9), // "energiyangiz"
  tired1: r(18.9, 21.0), // "...juda past chastotada" — tired person
  tired2: r(32.35, 34.0), // "sababi energiyangiz past"
  energy2: r(40.3, 42.9), // "energiyangizni to‘g‘ri sozlash"
};

// Motion inserts (subtitles hidden while each is on screen).
export const M = {
  fail: r(13.65, 15.0), // "u sizlarda ishlamaydi"
  why: r(15.0, 17.25), // "Bilasizlarmi, nimaga?"
  steps: r(42.9, 45.3), // "ong ostingiz bilan ishlash"
  goal: r(45.3, 47.95), // "maqsadingizga erisha olasiz"
  order: r(51.95, 53.0), // "ana undan keyin — texnika"
  telegram: r(53.0, 57.0), // "obuna bo‘lib, Telegram kanalimga o‘ting"
  subscribe: { from: at(61.85), to: DURATION },
};

// Reference-style punch-ins: scale jumps on phrase cuts (from, to, scaleStart, scaleEnd).
const SHOTS_SRC: [number, number, number, number][] = [
  [4.6, 6.05, 1.16, 1.19],
  [6.05, 8.0, 1.0, 1.04],
  [8.0, 10.3, 1.12, 1.15],
  [10.3, 12.0, 1.0, 1.04],
  [12.0, 13.65, 1.14, 1.17],
  [13.65, 17.25, 1.0, 1.06],
  [21.0, 23.15, 1.12, 1.15],
  [23.15, 27.1, 1.0, 1.05],
  [27.1, 31.6, 1.16, 1.19],
  [31.6, 32.35, 1.0, 1.02],
  [34.0, 35.67, 1.14, 1.17],
  [35.67, 39.0, 1.0, 1.05],
  [39.0, 40.3, 1.16, 1.18],
  [42.9, 45.3, 1.0, 1.04],
  [45.3, 47.95, 1.12, 1.16],
  [48.4, 49.9, 1.0, 1.03],
  [49.9, 51.95, 1.14, 1.17],
  [51.95, 57.0, 1.0, 1.05],
  [57.0, 58.6, 1.15, 1.18],
  [58.6, 62.2, 1.0, 1.06],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);
