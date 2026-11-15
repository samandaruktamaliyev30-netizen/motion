import { at, SPEECH_END } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts it to the new alphabet).
// [start sec (source), text]. Lines covered by a motion insert are left out on purpose.
const SRC: [number, string][] = [
  [0.0, "Erga tegishni xohlayman,"],
  [1.6, "18 Pro Max xohlayman,"],
  [3.3, "17 Pro Max xohlayman,"],
  [4.6, "ko‘p xohlayman,"],
  [6.05, "yigitim bilan urishib qoldim —"],
  [7.1, "yarashni xohlayman."],
  [8.0, "«Shunga texnikangiz bormi?»"],
  [9.3, "deydigan qizlar."],
  [10.3, "Bor, shunaqa texnikam."],
  [12.0, "Faqat u texnikani sizlarga bersam,"],
  [13.65, "u sizlarda ishlamaydi."],
  [15.0, "Bilasizlarmi, nimaga?"],
  [17.25, "Sababi, energiyangiz hozir"],
  [18.9, "juda past chastotada."],
  [21.0, "Agar energiyangiz past bo‘lmaganida,"],
  [23.15, "hech qanday texnikasiz"],
  [25.1, "xohlagan narsangizni"],
  [27.1, "hayotingizga olib kirardingiz."],
  [31.6, "Olib kira olmayapsiz,"],
  [32.35, "sababi energiyangiz past."],
  [34.0, "Hatto avliyosi ham"],
  [35.67, "sizlarga texnika bersa,"],
  [38.09, "u texnika ishlamaydi."],
  [39.0, "Birinchi navbatda"],
  [40.3, "energiyangizni to‘g‘ri sozlashingiz,"],
  [42.9, "ong ostingiz bilan to‘g‘ri ishlashingiz kerak."],
  [45.3, "Ana o‘shanda qo‘ygan maqsadingizga erisha olasiz."],
  [48.4, "Birinchi navbatda men sizga"],
  [49.9, "energiyangizni to‘g‘rilashga yordam beraman,"],
  [51.95, "ana undan keyin — texnika."],
  [53.0, "Buning uchun menga obuna bo‘ling"],
  [55.2, "va Telegram kanalimga o‘ting."],
  [57.0, "U yerda energiyangizni to‘g‘rilab,"],
  [58.6, "sizni maqsadlaringizga erishtiruvchi"],
  [60.7, "texnikalarni bo‘lishaman."],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : SPEECH_END, text };
});
