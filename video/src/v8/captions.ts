import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts to the new alphabet).
// Lines covered by a motion insert are carried by the motion itself.
const SRC: [number, string][] = [
  [0.38, "Remont vaqtida byudjetingiz oshmasligi"],
  [2.78, "hamda sifatli bo‘lishini xohlasangiz,"],
  [4.4, "unda bu video siz uchun."],
  [5.54, "Biz, A.D.C jamoasi, 7 yildan beri"],
  [7.8, "dizayn va remont pod klyuch"],
  [9.38, "xizmati bilan shug‘ullanamiz."],
  [10.36, "400 dan oshiq loyihani"],
  [11.66, "muvaffaqiyatli yakunlaganmiz."],
  [13.02, "Biz va’da bermaymiz:"],
  [14.4, "muddat shartnomada belgilanadi,"],
  [16.06, "smeta byudjetingizga qarab"],
  [17.78, "hisoblab beriladi."],
  [18.4, "Remont boshlashdan oldin"],
  [19.56, "360° ko‘rinishini sovg‘a qilib beramiz."],
  [21.88, "Remontni ham shu loyihaga"],
  [23.88, "muvofiq birma-bir bajaramiz."],
  [24.97, "Uyingizni remont qilmoqchi bo‘lsangiz,"],
  [26.2, "pastdagi formani to‘ldiring"],
  [27.22, "va bepul konsultatsiya oling."],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : DURATION, text };
});
