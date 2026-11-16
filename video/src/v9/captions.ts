import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts to the new alphabet).
// Lines covered by a motion insert are carried by the motion itself.
const SRC: [number, string][] = [
  [0.0, "Remont pod klyuchga arzon smeta berishyaptimi?"],
  [2.06, "Shoshilmang, avval buni ko‘ring."],
  [3.78, "Arzon smetada ko‘pincha material,"],
  [5.92, "usta haqi va qo‘shimcha ishlar"],
  [7.46, "alohida hisoblanadi."],
  [8.54, "Remont boshlangandan keyin"],
  [10.06, "narx ikki barobar oshadi."],
  [11.4, "Bizning jamoa —"],
  [13.2, "7 yildan beri"],
  [14.18, "400 dan oshiq loyihani topshirganmiz."],
  [16.06, "Har bir bosqichini tushuntirib boramiz."],
  [18.08, "Avval dizayn konsepsiyasini ishlab chiqamiz,"],
  [20.78, "so‘ng vizual ko‘rinishini tasdiqlatamiz,"],
  [22.74, "undan so‘ng loyihani tasdiqlatamiz."],
  [25.24, "Smetada hammasi ko‘rsatiladi:"],
  [27.2, "usta ish haqi, materiallar"],
  [28.92, "va hatto eng kichik chiqimlar."],
  [31.3, "Smeta shartnomada yoziladi va oshmaydi."],
  [33.66, "Agar obyektingiz"],
  [34.92, "Toshkent hududida bo‘lsa,"],
  [36.7, "pastdagi formani to‘ldiring."],
  [38.18, "Bepul o‘lchov qilib,"],
  [39.26, "taxminiy smetani hisoblab beramiz."],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : DURATION, text };
});
