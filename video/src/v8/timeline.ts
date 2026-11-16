// "Interyer dizayn" edit — kadr/6.mp4 (29.5 s, used whole; no pause cuts needed).
export const FPS = 30;
export const DURATION = 886;
export const at = (sec: number): number => Math.round(sec * FPS);
const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Speaker (wide shot): face centre ≈ (560, 780), chin ≈ 980 px.
export const FACE = { cx: 560, cy: 780 };
// Captions + motion sit just under the chin, near the middle of the frame (user request).
export const LOW = 1050;

// B-roll ("montaj uchun kadr")
export const BROLL = [
  { name: "IMG_0172 – chizmalar, ofis", src: "b0172.mp4", ...r(5.54, 7.8), trim: 0, rate: 1.35 },
  { name: "IMG_0176 – CAD loyiha", src: "b0176a.mp4", ...r(7.8, 10.36), trim: 0, rate: 1.1 },
  { name: "IMG_0178 – reja ekranda", src: "b0178.mp4", ...r(10.36, 13.02), trim: 30, rate: 1.1 },
  { name: "IMG_0164 (2) – 3D / 360 VR", src: "b0164.mp4", ...r(18.4, 23.88), trim: 0, rate: 1 },
];

// Motion inserts — captions are hidden while these are on screen.
export const M = {
  hook: r(0, 5.46),
  team: r(5.54, 7.8),
  contract: r(14.4, 18.4),
  gift: r(19.56, 21.88),
  cta: r(26.2, 29.53),
};

// Camera punch-ins on accent words
export const HIT = [0, 1.4, 2.78, 4.4, 13.02, 18.4, 24.97].map(at);

// [from, to, scaleFrom, scaleTo] — alternate wide / tight framing per phrase
export const SHOTS: [number, number, number, number][] = (
  [
    [0, 1.4, 1.12, 1.16],
    [1.4, 2.78, 1.0, 1.04],
    [2.78, 4.4, 1.18, 1.2],
    [4.4, 5.54, 1.04, 1.1],
    [13.02, 14.4, 1.16, 1.19],
    [14.4, 16.06, 1.0, 1.04],
    [16.06, 18.4, 1.12, 1.15],
    [23.88, 24.97, 1.0, 1.03],
    [24.97, 26.2, 1.16, 1.19],
    [26.2, 30, 1.0, 1.06],
  ] as [number, number, number, number][]
).map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);

// [frame, file, volume]
export const SFX: [number, string, number][] = [
  [0, "bass.wav", 0.36],
  [0, "rm-whoosh.wav", 0.23],
  [at(1.4), "pop.wav", 0.23],
  [at(2.78), "rm-whip.wav", 0.2],
  [at(4.4), "pop.wav", 0.23],
  [at(5.4), "rm-whoosh.wav", 0.25],
  [at(7.75), "rm-whip.wav", 0.16],
  [at(10.3), "rm-whip.wav", 0.16],
  [at(13.0), "rm-whoosh.wav", 0.2],
  [at(14.5), "rm-page-turn.wav", 0.23],
  [at(15.4), "ding.wav", 0.16],
  [at(16.9), "ding.wav", 0.16],
  [at(18.35), "rm-whoosh.wav", 0.23],
  [at(19.6), "riser.wav", 0.14],
  [at(20.6), "rm-ding.wav", 0.2],
  [at(23.85), "rm-whoosh.wav", 0.2],
  [at(26.2), "pop.wav", 0.23],
  [at(27.6), "rm-mouse-click.wav", 0.32],
];

// Music bed (from the reference reel, vocals removed): quiet under the voice, fade-out at the end.
export const MUSIC_VOL = (f: number): number => {
  const head = f < 10 ? 0.32 : f < 20 ? 0.32 - ((f - 10) / 10) * 0.18 : 0.14;
  const tail = f > DURATION - 25 ? Math.max(0, (DURATION - f) / 25) : 1;
  return head * tail;
};
