import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts to the new alphabet).
// Lines covered by a motion insert are carried by the motion itself.
const SRC: [number, string][] = [
  [0.0, "Remontni o‘zingiz qilsangiz"],
  [1.44, "arzonga chiqadi deb o‘ylaysizmi?"],
  [2.74, "Keling, ko‘rib chiqamiz."],
  [3.72, "Ustalarga haq to‘laysiz — bu oddiy hol."],
  [6.86, "Lekin bundan tashqari:"],
  [8.4, "noto‘g‘ri olingan materiallar,"],
  [9.98, "buzilgan devorlar,"],
  [11.18, "kelishmovchilik sababli ustalarning ketib qolishi"],
  [13.72, "va bozor narxining qimmatlashib borishi."],
  [15.96, "Bu jiddiy muammo."],
  [17.2, "Bularning hech biri smetada yozilmaydi,"],
  [20.12, "lekin hammasi sizning cho‘ntagingizdan ketadi."],
  [22.64, "Biz — A.D.C jamoasi —"],
  [24.7, "hammasini smetada ko‘rsatib o‘tamiz"],
  [26.74, "va bu shartnomada ham bo‘ladi."],
  [28.62, "O‘zgarmaydi. Muddat ham"],
  [30.06, "shartnomada ko‘rsatib o‘tiladi."],
  [31.94, "7 yil davomida"],
  [33.22, "400 ga yaqin loyihamizni"],
  [34.76, "shu tartibda topshirganmiz."],
  [36.22, "Remont pod klyuch buyurtma qilganlarga"],
  [38.32, "vizual qismini sovg‘a qilamiz."],
  [40.14, "Agar obyektingiz"],
  [41.52, "Toshkent hududi atrofida bo‘lsa,"],
  [43.16, "formani to‘ldiring."],
  [44.52, "Sizga bepul o‘lchov qilib,"],
  [46.26, "taxminiy smetani hisoblab beramiz."],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : DURATION, text };
});
