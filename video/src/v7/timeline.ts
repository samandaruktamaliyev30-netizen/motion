// "Nega biznes yaxshi rivojlanmaydi" — source footage/v7/kadr/main.mp4 (50.9 s, 4K).
// public/v7/raw.mp4 = 4K crop rows 0..2832 (desk hidden, medium shot) + face clean-up,
// scaled to 1080x1920. No cuts, so source seconds == timeline seconds.
export const FPS = 30;
export const DURATION = 1527;
export const at = (sec: number): number => Math.round(sec * FPS);

// Speaker in the cropped frame (4K rows 0..2832, medium shot like the references): face centre (540, 1010), chin ≈ 1195.
export const FACE = { cx: 540, cy: 1010 };
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
  { name: "Kadr: kalkulyator (kundalik muammo)", src: "v7/calc.mp4", trim: 0, r: r(26.16, 30.33), t: "whip" },
];
export const BROLL_END = at(30.33); // phone leaves his hand at 30.27 s

// Motion inserts (subtitles hidden while each is on screen).
export const M = {
  org: r(8.1, 10.52), // "lekin hamma qarorni o'zi qabul qiladi"
  escalate: r(12.2, 15.0), // "duch kelsa, yana rahbariga chiqadi"
  many: r(31.45, 33.94), // "bizneslar mana shu tartibda ishlaydi"
  guide: r(35.55, 39.5), // "xodimlarini to'g'ri boshqarish bo'yicha qo'llanma tayyorladim"
  cta: { from: at(46.2), to: DURATION }, // "3 raqamini yozib qoldiring ... bepul"
};

// Camera on the speaker: [from, to, scaleFrom, scaleTo] (seconds). Kept wide (user: "not this close"):
// only slow pushes and small 4–5 % steps on phrase changes.
const SHOTS_SRC: [number, number, number, number][] = [
  [0, 3.2, 1.0, 1.03],
  [3.2, 5.16, 1.04, 1.05],
  [5.16, 8.1, 1.0, 1.02],
  [8.1, 10.52, 1.0, 1.02],
  [10.52, 12.2, 1.04, 1.05],
  [12.2, 15.0, 1.0, 1.02],
  [30.33, 31.45, 1.04, 1.05],
  [31.45, 33.96, 1.0, 1.02],
  [33.96, 35.55, 1.04, 1.05],
  [35.55, 39.56, 1.0, 1.02],
  [39.56, 41.62, 1.04, 1.05],
  [41.62, 44.76, 1.0, 1.02],
  [44.76, 46.2, 1.04, 1.05],
  [46.2, 51, 1.0, 1.03],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);
