// "Interyer dizayn — 7" edit: kadr/7.mp4 (41.1 s, used whole).
// 3.85–18.0 s is a voice-over (speaker filmed from the side) -> fully covered with B-roll.
export const FPS = 30;
export const DURATION = 1233;
export const at = (sec: number): number => Math.round(sec * FPS);
const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Speaker: face centre ≈ (530, 760), chin ≈ 930 px.
export const FACE = { cx: 530, cy: 760 };
// Captions + motion just under the chin, near the middle of the frame.
export const LOW = 1050;

export const BROLL = [
  { name: "Qurilish maydoni (d8f0…)", src: "bd8f.mp4", ...r(3.85, 8.54), trim: 0, rate: 1.9 },
  { name: "Remont jarayoni (8da9…)", src: "a8da.mp4", ...r(8.54, 11.4), trim: 0, rate: 1.6 },
  { name: "Ofis: jamoa ishlayapti (IMG_0172)", src: "b0172.mp4", ...r(11.4, 13.7), trim: 100, rate: 1.2 },
  { name: "Ofis: CAD loyiha (IMG_0176)", src: "b0176a.mp4", ...r(13.7, 16.06), trim: 30, rate: 1.1 },
  { name: "Tayyor interyer (8da9…)", src: "a8da.mp4", ...r(16.06, 18.02), trim: 270, rate: 2.4 },
];

// Motion inserts — captions hidden meanwhile.
export const M = {
  hook: r(0, 3.78),
  double: r(8.54, 11.4),
  stats: r(13.2, 16.06),
  steps: r(18.08, 25.2),
  smeta: r(25.24, 33.6),
  cta: r(36.7, 41.1),
};

export const HIT = [0, 2.06, 8.54, 18.08, 25.24, 33.66, 36.7].map(at);

export const SHOTS: [number, number, number, number][] = (
  [
    [0, 2.06, 1.14, 1.18],
    [2.06, 3.85, 1.0, 1.04],
    [18.0, 25.24, 1.0, 1.05],
    [25.24, 31.3, 1.15, 1.19],
    [31.3, 33.66, 1.0, 1.03],
    [33.66, 36.7, 1.16, 1.19],
    [36.7, 42, 1.0, 1.05],
  ] as [number, number, number, number][]
).map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);

// [frame, file, volume] — kept low (user: effects were too loud)
export const SFX: [number, string, number][] = [
  [0, "bass.wav", 0.36],
  [0, "rm-whoosh.wav", 0.22],
  [at(2.06), "buzz.wav", 0.12],
  [at(3.8), "rm-whoosh.wav", 0.22],
  [at(8.5), "rm-whip.wav", 0.18],
  [at(9.3), "pop.wav", 0.2],
  [at(11.35), "rm-whoosh.wav", 0.2],
  [at(13.25), "tick.wav", 0.16],
  [at(14.3), "ding.wav", 0.16],
  [at(16.0), "rm-whip.wav", 0.16],
  [at(18.0), "rm-whoosh.wav", 0.2],
  [at(18.15), "pop.wav", 0.18],
  [at(21.0), "ding.wav", 0.15],
  [at(23.5), "ding.wav", 0.15],
  [at(27.3), "pop.wav", 0.16],
  [at(28.2), "pop.wav", 0.16],
  [at(29.9), "pop.wav", 0.16],
  [at(31.35), "rm-shutter-modern.wav", 0.22],
  [at(36.7), "pop.wav", 0.2],
  [at(38.3), "rm-mouse-click.wav", 0.3],
];

export const MUSIC_VOL = (f: number): number => {
  const head = f < 10 ? 0.32 : f < 20 ? 0.32 - ((f - 10) / 10) * 0.18 : 0.14;
  const tail = f > DURATION - 25 ? Math.max(0, (DURATION - f) / 25) : 1;
  return head * tail;
};
