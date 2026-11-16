import { at, DURATION } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts to the new alphabet).
// Lines covered by a motion insert are carried by the motion itself.
const SRC: [number, string][] = [
  [0.0, "Artistlarga 100 million berayotgan ekan-da?"],
  [2.45, "O‘qituvchilarga ham bersin 100 millionni!"],
  [7.84, "Ha, buning sabablari bor."],
  [10.3, "Dars kesimida, sinf kesimida"],
  [13.4, "soatlarning kamligi —"],
  [14.4, "haftasiga atigi ikki soat."],
  [17.62, "Nisbatan o‘quv markazlari,"],
  [20.82, "xususiy o‘quv dargohlariga nisbatan"],
  [22.76, "hali ham saqlanib qolganligi."],
  [25.14, "Darsini o‘tsin, nazoratini qilsin,"],
  [27.04, "savollariga javob bersin,"],
  [28.84, "kerak bo‘lsa, masalasini ishlatsin."],
  [31.3, "Darsning sifatiga qarab"],
  [32.86, "balki oylik to‘lash kerakmi?"],
  [34.62, "Kimyo fanini hamma ham bilavermaydi."],
  [37.48, "O‘zi xohlab o‘qiydiganlar ham kamayib ketdi."],
  [39.04, "Umuman olganda, hozir"],
  [40.8, "kirayotgan, o‘qiyotgan bolalarning"],
  [44.78, "Masalan, «kimyogar bo‘laman» deb…"],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : DURATION, text };
});
