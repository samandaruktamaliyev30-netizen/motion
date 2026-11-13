import { at } from "./timeline";

// Corrected Uzbek transcript: phrase start (SOURCE seconds), text, phrase end.
const SRC: [number, string, number][] = [
  [2.74, "Xo‘p, demak, birinchi sababi —", 3.86],
  [3.88, "butun O‘zbekiston bo‘yicha", 5.6],
  [5.64, "uning diplomi", 6.2],
  [6.28, "barcha davlat va xususiy sektorlarda", 8.66],
  [8.68, "birdek tan olinishi.", 9.7],
  [9.78, "Ikkinchi sababi —", 10.7],
  [10.76, "300 dan oshiq professor-o‘qituvchilar", 12.8],
  [12.82, "va 40 mingga yaqin talabaning mavjudligi.", 15.24],
  [15.34, "Bu sizga kelajakda", 16.2],
  [16.22, "juda katta networking beradi.", 17.44],
  [17.5, "Uchinchisi —", 18.2],
  [18.34, "xorijiy talabalarning ko‘pligi.", 20.36],
  [20.42, "Ya’ni, institutda juda ko‘p miqdorda", 22.08],
  [22.1, "xorijiy talabalar o‘qiydi.", 23.24],
  [23.3, "Bu baribir", 24.3],
  [24.7, "ingliz tilida o‘qimoqchi bo‘layotgan", 25.98],
  [26.1, "yoki rus tilida o‘qimoqchi bo‘layotgan talabalarga", 28.3],
  [28.32, "juda katta qulaylik yaratib beradi.", 29.9],
  [30.4, "Bu o‘ziga xos ustunlik beradi.", 32.2],
  [32.48, "To‘rtinchisi —", 33.0],
  [33.37, "yaxshi sharoitlar", 34.06],
  [34.06, "va shartnoma narxlarining", 36.04],
  [36.06, "boshqa xususiy oliygohlarga nisbatan pastligi.", 38.16],
  [38.22, "Va o‘ta yaxshi sharoitlar —", 39.54],
  [39.56, "tan olish kerak, juda yaxshi sharoitlar.", 40.9],
  [41.0, "Beshinchisi —", 41.6],
  [41.64, "amaliyotning juda ko‘pligi", 44.24],
  [44.26, "va amaliyotga katta e’tibor berilganligi.", 45.95],
  [46.28, "Laboratoriyalarning oxirgi rusumdagi", 47.7],
  [47.72, "zamonaviy uskunalar bilan ta’minlanganligi.", 49.62],
  [49.93, "Va ayniqsa — qulay lokatsiya.", 51.6],
];

export type Phrase = { from: number; to: number; text: string };

export const PHRASES: Phrase[] = SRC.map(([s, text, e], i) => {
  const next = SRC[i + 1];
  const from = at(s);
  const to = next ? Math.min(at(next[0]), at(e) + 10) : at(e) + 10;
  return { from, to: Math.max(to, from + 10), text };
});
