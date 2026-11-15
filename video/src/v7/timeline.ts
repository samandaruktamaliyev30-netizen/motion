// "Nega biznes yaxshi rivojlanmaydi" — source footage/v7/kadr/main.mp4 (50.9 s, 4K).
// public/v7/raw.mp4 = 4K crop rows 60..2800 (desk hidden, ~1.4x closer) + face clean-up,
// scaled to 1080x1920. No cuts, so source seconds == timeline seconds.
export const FPS = 30;
export const DURATION = 1527;
export const at = (sec: number): number => Math.round(sec * FPS);

// Speaker in the cropped frame: face centre (540, 995), chin ≈ 1190.
export const FACE = { cx: 540, cy: 995 };
export const LOW = 1290; // subtitles & motion live here, below the chin

const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Title (first 3 s), leaves with a transition at 3 s.
export const TITLE = { from: 0, to: at(3.2) };

// B-roll over the phone-reading part (0:15–0:30). Each entry: clip, source offset (frames), transition in.
export type Trans = "zoom" | "whip" | "slide" | "spin";
export const BROLL: { name: string; src: string; trim: number; r: { from: number; to: number }; t: Trans }[] = [
  { name: "Kadr: hujjatlar (mijoz savoli)", src: "v7/b1.mp4", trim: 0, r: r(15.0, 18.8), t: "zoom" },
  { name: "Kadr: muhr (ruxsat)", src: "v7/stamp.mp4", trim: 0, r: r(18.8, 22.96), t: "whip" },
  { name: "Kadr: ofis (rivojlantirish)", src: "v7/office.mp4", trim: 15, r: r(22.96, 26.16), t: "slide" },
  { name: "Kadr: kalkulyator (kundalik muammo)", src: "v7/calc.mp4", trim: 0, r: r(26.16, 29.96), t: "whip" },
];
export const BROLL_END = at(29.96);

// Motion inserts (subtitles hidden while each is on screen).
export const M = {
  org: r(8.1, 10.52), // "lekin hamma qarorni o'zi qabul qiladi"
  escalate: r(12.2, 15.0), // "duch kelsa, yana rahbariga chiqadi"
  many: r(31.45, 33.94), // "bizneslar mana shu tartibda ishlaydi"
  guide: r(35.55, 39.5), // "xodimlarini to'g'ri boshqarish bo'yicha qo'llanma tayyorladim"
  cta: { from: at(46.2), to: DURATION }, // "3 raqamini yozib qoldiring ... bepul"
};

// Camera on the speaker: [from, to, scaleFrom, scaleTo] (seconds). Punch-ins land on cuts.
const SHOTS_SRC: [number, number, number, number][] = [
  [0, 3.2, 1.0, 1.05],
  [3.2, 5.16, 1.12, 1.15],
  [5.16, 8.1, 1.0, 1.04],
  [8.1, 10.52, 1.06, 1.08],
  [10.52, 12.2, 1.14, 1.16],
  [12.2, 15.0, 1.02, 1.05],
  [29.96, 31.45, 1.12, 1.15],
  [31.45, 33.96, 1.0, 1.03],
  [33.96, 35.55, 1.1, 1.12],
  [35.55, 39.56, 1.0, 1.04],
  [39.56, 41.62, 1.08, 1.1],
  [41.62, 44.76, 1.0, 1.04],
  [44.76, 46.2, 1.12, 1.14],
  [46.2, 51, 1.0, 1.05],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);
