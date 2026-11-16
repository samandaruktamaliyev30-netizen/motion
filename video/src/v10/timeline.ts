// "Interyer dizayn — 8" edit: kadr/8.mp4 (48.6 s, used whole).
// 3.9–23.07 s is a voice-over (side angle) -> full-screen "blueprint" motion scene instead.
export const FPS = 30;
export const DURATION = 1458;
export const at = (sec: number): number => Math.round(sec * FPS);
const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Speaker sits left of centre: face ≈ (380, 740), chin ≈ 900 px.
export const FACE = { cx: 380, cy: 740 };
export const LOW = 1050;

// Full-screen motion scene covering the voice-over (+ small overlap on both sides).
export const SCENE = r(3.72, 23.2);

export const BROLL = [
  { name: "Ofis: jamoa (IMG_0173)", src: "IMG_0173.mp4", ...r(31.94, 36.22), trim: 60, rate: 1 },
  { name: "VR: vizual qism (IMG_0177)", src: "IMG_0177.mp4", ...r(36.22, 40.14), trim: 0, rate: 1 },
];

// Motion inserts on the speaker / B-roll — captions hidden meanwhile.
export const M = {
  hook: r(0, 3.72),
  scene: SCENE,
  adc: r(22.64, 24.7),
  contract: r(28.62, 31.94),
  stats: r(31.94, 36.22),
  gift: r(38.32, 40.14),
  cta: r(43.16, 48.6),
};

// Slow, smooth camera (no punch-ins in this edit): [from, to, scaleFrom, scaleTo]
export const SHOTS: [number, number, number, number][] = (
  [
    [0, 3.72, 1.04, 1.12],
    [23.2, 28.62, 1.0, 1.06],
    [28.62, 31.94, 1.12, 1.16],
    [40.14, 43.16, 1.1, 1.14],
    [43.16, 49, 1.0, 1.05],
  ] as [number, number, number, number][]
).map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);

export const SFX: [number, string, number][] = [
  [at(1.44), "pop.wav", 0.16],
  [at(3.6), "rm-whoosh.wav", 0.2],
  [at(3.8), "rm-page-turn.wav", 0.18],
  [at(5.54), "ding.wav", 0.12],
  [at(8.4), "tick.wav", 0.14],
  [at(9.98), "bass.wav", 0.2],
  [at(11.18), "tick.wav", 0.14],
  [at(13.72), "tick.wav", 0.14],
  [at(17.2), "rm-shutter-modern.wav", 0.2],
  [at(20.12), "rm-whoosh.wav", 0.16],
  [at(22.5), "rm-whoosh.wav", 0.2],
  [at(22.7), "riser.wav", 0.1],
  [at(28.7), "rm-page-turn.wav", 0.16],
  [at(31.9), "rm-whip.wav", 0.16],
  [at(36.2), "rm-whip.wav", 0.16],
  [at(38.4), "rm-ding.wav", 0.16],
  [at(43.2), "pop.wav", 0.16],
  [at(45.9), "rm-mouse-click.wav", 0.26],
];

// Metro Boomin – Superhero: its drop is aligned to "Biz, A.D.C jamoasi" (22.64 s).
export const MUSIC_VOL = (f: number): number => {
  const drop = at(22.64);
  let v = f < drop ? 0.11 : f < drop + 45 ? 0.16 - ((f - drop) / 45) * 0.06 : 0.1;
  if (f > DURATION - 25) v *= Math.max(0, (DURATION - f) / 25);
  return v;
};
