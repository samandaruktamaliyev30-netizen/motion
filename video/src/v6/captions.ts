import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts it to the new alphabet).
// [start sec (source), text]. Lines covered by a motion insert are left out on purpose.
const SRC: [number, string][] = [
  [15.22, "Hozir yurtimizda asosiy muammolardan biri"],
  [17.6, "bu — suvning qattiqligi."],
  [18.62, "Kimyoda «suvning qattiqligi» degan tushuncha bor."],
  [26.6, "Demak, Qoraqalpog‘iston yoki Xorazm hududidagi suv"],
  [29.9, "anchayin sho‘rlashgan va qattiq hisoblanadi."],
  [35.64, "Ya’ni, ebulioskopiya qonuniga ko‘ra,"],
  [38.28, "agar suv tarkibidagi erigan tuzlar"],
  [41.34, "miqdori ko‘p bo‘lsa,"],
  [42.52, "uning qaynash temperaturasi oshadi."],
  [43.7, "Demak, 100 gradusda qaynaydigan suvingiz"],
  [48.42, "Toki to‘yingan bug‘ bosimi"],
  [51.54, "atmosfera bosimiga yetib kelmaguncha,"],
  [53.28, "suvingiz qaynamaydi."],
  [54.74, "Shuning uchun ham Qoraqalpog‘iston,"],
  [56.22, "qolaversa, Xorazm hududlarida"],
  [62.24, "uni qaynash darajasiga yetkazib qo‘yishadi,"],
  [65.8, "toki mehmon kelgan payti"],
  [67.68, "choyni kechiktirmaslik uchun."],
  [69.46, "Toshkent shahrida esa"],
  [71.2, "suv anchayin yumshatilgan holatda beriladi."],
  [73.46, "Ya’ni u yerda tuzning miqdori"],
  [75.42, "me’yorlashtirilgan holatda bo‘ladi."],
  [78.72, "Kimyoning kundalik hayotimizdagi"],
  [80.16, "ahamiyatini yaxshiroq tushunish uchun"],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : DURATION, text };
});
