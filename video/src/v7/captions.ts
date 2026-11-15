import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts it to the new alphabet).
// [start sec, text]. Lines covered by the title or a motion insert are left out on purpose;
// a phrase ends where the next one (or a motion insert) starts.
const SRC: [number, string, number?][] = [
  [3.2, "Biznesingiz avvalgidek ishlashda davom etadimi?"],
  [5.16, "Ko‘pchilik biznes egalari xodim yollaydi,", 8.1],
  [10.52, "Natijada xodim muammoga", 12.2],
  [15.36, "Mijoz savol bersa,"],
  [16.6, "rahbardan javob kutadi."],
  [18.8, "Bir ishni boshlash uchun ham"],
  [20.98, "rahbarning ruxsati kerak."],
  [22.96, "Natijada rahbar biznesni"],
  [24.62, "rivojlantirish o‘rniga"],
  [26.14, "kundalik muammolarni hal qilish"],
  [28.3, "bilan band bo‘ladi."],
  [30.55, "Hozirgi kunda juda ko‘p", 31.45],
  [33.96, "Men ushbu bizneslar uchun", 35.55],
  [39.56, "Bu qo‘llanma ichida xodimlarni"],
  [41.6, "boshqarish bo‘yicha barcha ma’lumotlar bor."],
  [44.76, "Qo‘llanmani olish uchun", 46.2],
];

export const PHRASES: Phrase[] = SRC.map(([s, text, end], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: end !== undefined ? at(end) : next ? at(next[0]) : DURATION, text };
});
