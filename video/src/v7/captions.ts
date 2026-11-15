import { at, SPEECH_END } from "./timeline";
import type { Phrase } from "../shared/StyleCaptions";

// Corrected transcript (literary Uzbek; StyleCaptions converts it to the new alphabet).
// [start sec (source), text]. Lines covered by a motion insert are left out on purpose.
const SRC: [number, string][] = [
  [0.0, "Erga tegishni *xohlayman,*"],
  [1.6, "*18 Pro Max* xohlayman,"],
  [3.3, "*17 Pro Max* xohlayman,"],
  [4.6, "*ko‘p* xohlayman,"],
  [6.05, "yigitim bilan *urishib qoldim*"],
  [7.1, "*yarashni* xohlayman"],
  [8.0, "«shunga *texnikangiz bormi?»*"],
  [9.3, "deydigan *qizlar*"],
  [10.3, "bor, *shunaqa texnikam*"],
  [12.0, "faqat u texnikani *sizlarga bersam,*"],
  [13.65, "u sizlarda *ishlamaydi*"],
  [15.0, "bilasizlarmi, *nimaga?*"],
  [17.25, "sababi, *energiyangiz* hozir"],
  [18.9, "juda *past chastotada*"],
  [21.0, "agar energiyangiz *past bo‘lmaganida,*"],
  [23.15, "hech qanday *texnikasiz*"],
  [25.1, "*xohlagan narsangizni*"],
  [27.1, "hayotingizga *olib kirardingiz*"],
  [31.6, "*olib kira olmayapsiz,*"],
  [32.35, "sababi energiyangiz *past*"],
  [34.0, "hatto *avliyosi ham*"],
  [35.67, "sizlarga *texnika bersa,*"],
  [38.09, "u texnika *ishlamaydi*"],
  [39.0, "*birinchi navbatda*"],
  [40.3, "energiyangizni *to‘g‘ri sozlash,*"],
  [42.9, "ong ostingiz bilan *to‘g‘ri ishlash kerak*"],
  [45.3, "ana o‘shanda *maqsadingizga erishasiz*"],
  [48.4, "birinchi navbatda *men sizga*"],
  [49.9, "energiyangizni to‘g‘rilashga *yordam beraman,*"],
  [51.95, "ana undan keyin — *texnika*"],
  [53.0, "buning uchun menga *obuna bo‘ling*"],
  [55.2, "va *Telegram kanalimga* o‘ting"],
  [57.0, "u yerda energiyangizni *to‘g‘rilab,*"],
  [58.6, "maqsadlaringizga *erishtiruvchi*"],
  [60.7, "*texnikalarni* bo‘lishaman"],
];

export const PHRASES: Phrase[] = SRC.map(([s, text], i) => {
  const next = SRC[i + 1];
  return { from: at(s), to: next ? at(next[0]) : SPEECH_END, text };
});
