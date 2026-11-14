// "Target reklama" voice-over (footage/Ovoz_2026-11-14_01-41.mp3) — fully animated motion piece.
export const FPS = 30;
export const DURATION = 1725; // 57.5 s (voice 55.85 s + tail)
export const s = (sec: number) => Math.round(sec * FPS);

// Music (EsDeeKid – Mist) starts at its 10.0 s so its drop lands on "Biz esa aksincha".
export const DROP = s(19.55);
const BEAT0 = 19.745; // first post-drop beat, seconds
const BEAT = 0.4644; // 129.2 bpm
// 0..1 pulse that peaks on every beat after the drop.
export const beatPulse = (frame: number) => {
  const t = frame / FPS;
  if (t < BEAT0 - 0.05) return 0;
  const ph = ((t - BEAT0) % BEAT + BEAT) % BEAT;
  return Math.exp(-ph * 9);
};

export type SceneId =
  | "spend"
  | "noresult"
  | "blame"
  | "cause"
  | "miracle"
  | "aksincha"
  | "steps"
  | "strategy"
  | "funnel"
  | "question"
  | "industries"
  | "nobuy"
  | "sales"
  | "path"
  | "subscribe"
  | "secrets";

export const SCENES: [SceneId, number, number][] = (
  [
    ["spend", 0, 3.0],
    ["noresult", 3.0, 5.85],
    ["blame", 5.85, 9.6],
    ["cause", 9.6, 15.25],
    ["miracle", 15.25, 19.55],
    ["aksincha", 19.55, 23.1],
    ["steps", 23.1, 27.6],
    ["strategy", 27.6, 30.7],
    ["funnel", 30.7, 34.6],
    ["question", 34.6, 37.05],
    ["industries", 37.05, 40.25],
    ["nobuy", 40.25, 42.55],
    ["sales", 42.55, 46.15],
    ["path", 46.15, 50.8],
    ["subscribe", 50.8, 52.3],
    ["secrets", 52.3, 57.5],
  ] as [SceneId, number, number][]
).map(([id, a, b]) => [id, s(a), s(b)]);

// Headline captions are hidden while a full-screen type moment owns the frame.
export const HEADLINE_HIDE: [number, number][] = [
  [s(19.55), s(20.84)], // AKSINCHA
  [s(33.75), s(34.6)], // LID ≠ SAVDO
];
