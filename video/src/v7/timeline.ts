// "Nega biznes yaxshi rivojlanmaydi" — source footage/v7/kadr/main.mp4 (50.9 s, 4K).
// public/v7/raw.mp4 = 4K light 1.12x crop (rows 52..3480, speaker centred, desk may show)
// + face clean-up, scaled to 1080x1920. Pauses between sentences are cut (CLIPS).
export const FPS = 30;

// Kept source ranges (seconds). Removed: pauses at 4.9, 14.7, 18.6, 26.0, 29.8, 39.4, 44.6 s and the tail.
const KEEP: [number, number][] = [
  [0, 4.98],
  [5.6, 14.81],
  [15.36, 18.67],
  [18.88, 26.03],
  [26.25, 29.86],
  [30.55, 39.5],
  [39.96, 44.7],
  [45.18, 50.6],
];
export const CLIPS: { srcStart: number; srcEnd: number; out: number }[] = (() => {
  let out = 0;
  return KEEP.map(([a, b]) => {
    const c = { srcStart: Math.round(a * FPS), srcEnd: Math.round(b * FPS), out };
    out += c.srcEnd - c.srcStart;
    return c;
  });
})();
const lastClip = CLIPS[CLIPS.length - 1];
export const DURATION = lastClip.out + lastClip.srcEnd - lastClip.srcStart;

/** Source seconds → output frame (times inside a cut snap to the next clip). */
export const at = (sec: number): number => {
  const f = Math.round(sec * FPS);
  for (const c of CLIPS) {
    if (f < c.srcStart) return c.out;
    if (f < c.srcEnd) return c.out + (f - c.srcStart);
  }
  return DURATION;
};

// Speaker in the frame: face centre (540, 795), chin ≈ 1005.
export const FACE = { cx: 540, cy: 795 };
export const LOW = 1085; // subtitles & motion live here, below the chin

const r = (a: number, b: number) => ({ from: at(a), to: at(b) });

// Title (first 3 s).
export const TITLE = { from: 0, to: at(3.2) };

// B-roll over the phone-reading part. The phone is in his hand from 15.2 s to 30.27 s (source).
export type Trans = "zoom" | "whip" | "slide" | "spin";
export const BROLL: { name: string; src: string; trim: number; r: { from: number; to: number }; t: Trans }[] = [
  { name: "Kadr: hujjatlar (mijoz savoli)", src: "v7/b1.mp4", trim: 0, r: r(15.36, 18.88), t: "zoom" },
  { name: "Kadr: muhr (ruxsat)", src: "v7/stamp.mp4", trim: 0, r: r(18.88, 22.96), t: "whip" },
  { name: "Kadr: ofis (rivojlantirish)", src: "v7/office.mp4", trim: 15, r: r(22.96, 26.25), t: "slide" },
  { name: "Kadr: kalkulyator (kundalik muammo)", src: "v7/calc.mp4", trim: 0, r: r(26.25, 30.55), t: "whip" },
];
export const BROLL_END = at(30.55);

// Motion inserts (subtitles hidden while each is on screen).
export const M = {
  org: r(8.1, 10.52), // "lekin hamma qarorni o'zi qabul qiladi"
  escalate: r(12.2, 14.81), // "duch kelsa, yana rahbariga chiqadi"
  many: r(31.45, 33.94), // "bizneslar mana shu tartibda ishlaydi"
  guide: r(35.55, 39.5), // "xodimlarini to'g'ri boshqarish bo'yicha qo'llanma tayyorladim"
  cta: { from: at(46.2), to: DURATION }, // "3 raqamini yozib qoldiring ... bepul"
};

// Camera on the speaker: [from, to, scaleFrom, scaleTo] (source seconds). Small steps hide the jump cuts.
const SHOTS_SRC: [number, number, number, number][] = [
  [0, 3.2, 1.0, 1.02],
  [3.2, 5.16, 1.04, 1.05],
  [5.16, 8.1, 1.0, 1.02],
  [8.1, 10.52, 1.0, 1.02],
  [10.52, 12.2, 1.04, 1.05],
  [12.2, 15.36, 1.0, 1.02],
  [30.55, 31.45, 1.04, 1.05],
  [31.45, 33.96, 1.0, 1.02],
  [33.96, 35.55, 1.04, 1.05],
  [35.55, 39.56, 1.0, 1.02],
  [39.56, 41.62, 1.04, 1.05],
  [41.62, 44.76, 1.0, 1.02],
  [44.76, 46.2, 1.04, 1.05],
  [46.2, 51, 1.0, 1.03],
];
export const SHOTS: [number, number, number, number][] = SHOTS_SRC.map(([a, b, s0, s1]) => [at(a), at(b), s0, s1]);

// Music: the beat drop of the track (48.5 s into it) lands on the comment being sent.
export const MUSIC_TRIM = Math.round(48.5 * FPS) - at(48.1);
