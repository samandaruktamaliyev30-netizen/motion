import { s } from "./timeline";

// Corrected transcript (Khorezm speech written in standard Uzbek), word starts in seconds of cut.mp4.
// "*" = keyword (bold, bracketed like the reference).
type W = [string, number];
const SRC: { words: W[]; end: number }[] = [
  { words: [["Mijozim", 0.0], ["*$1500ni", 0.24]], end: 0.83 },
  { words: [["o‘sha", 0.83], ["zahoti", 1.53], ["berib", 1.93]], end: 2.3 },
  { words: [["yubordi.", 2.3]], end: 2.8 },
  { words: [["Xo‘p,", 2.8]], end: 3.21 },
  { words: [["qanaqa", 3.21], ["bo‘ldi", 3.51], ["*bu?", 3.7]], end: 4.26 },
  { words: [["*Noyabr", 4.26], ["oyini", 4.76]], end: 4.94 },
  { words: [["boshlashdik:", 4.94]], end: 5.55 },
  { words: [["klient", 5.55], ["bilan", 5.85]], end: 6.06 },
  { words: [["*$1500lik", 6.06], ["*dogovor", 6.76]], end: 7.07 },
  { words: [["qildik.", 7.07]], end: 7.6 },
  { words: [["Lekin", 7.6], ["oy", 8.04]], end: 8.22 },
  { words: [["*tugayapti,", 8.22]], end: 8.71 },
  { words: [["bizda", 8.71], ["hali", 9.01], ["ish", 9.22]], end: 9.36 },
  { words: [["*boshlanmadi.", 9.36]], end: 9.9 },
  { words: [["Sababi,", 9.9]], end: 10.28 },
  { words: [["klientning", 10.28], ["o‘zida", 11.15]], end: 11.4 },
  { words: [["qanaqadir", 11.4]], end: 11.74 },
  { words: [["*problemalari", 11.74], ["bor.", 12.25]], end: 12.44 },
  { words: [["*Oilaviymi", 12.44], ["yoki", 13.07]], end: 13.4 },
  { words: [["*shaxsiymi,", 13.4]], end: 13.85 },
  { words: [["uni", 13.85], ["biz", 14.14], ["bilmaymiz.", 14.57]], end: 15.06 },
  { words: [["Biz", 15.06], ["oy", 15.58]], end: 15.88 },
  { words: [["tugayapti-ku,", 15.88]], end: 16.37 },
  { words: [["ishni", 16.37], ["*qachon", 16.84]], end: 17.38 },
  { words: [["boshlaymiz,", 17.38]], end: 19.17 },
  { words: [["Biroq", 19.17], ["ketgan", 19.61]], end: 19.97 },
  { words: [["*vaqtimga,", 19.97]], end: 20.4 },
  { words: [["puli", 20.4], ["bilan", 20.61]], end: 20.84 },
  { words: [["*roziman.", 20.84]], end: 21.96 },
  { words: [["*Dekabrdan", 21.96], ["oldin", 22.61]], end: 22.87 },
  { words: [["*oplata", 22.87], ["qilib", 23.24]], end: 23.51 },
  { words: [["turib,", 23.51]], end: 23.86 },
  { words: [["keyin", 23.86], ["boshlaymiz", 24.09]], end: 24.47 },
  { words: [["deyishdi.", 24.47]], end: 26.09 },
  { words: [["Qiziq,", 26.09]], end: 26.43 },
  { words: [["shunaqa", 26.43]], end: 26.68 },
  { words: [["*klientlar", 26.68], ["bormi?", 27.15]], end: 27.75 },
  { words: [["Bo‘lsa,", 27.75]], end: 27.97 },
  { words: [["*yozib", 27.97], ["ketinglar.", 28.24]], end: 29.09 },
  { words: [["Bu", 29.09], ["videoni", 29.29]], end: 29.75 },
  { words: [["*marketing", 29.75], ["sohasida", 30.25]], end: 30.62 },
  { words: [["ishlaydigan", 30.62]], end: 31.0 },
  { words: [["*tanishlaringga", 31.0]], end: 31.67 },
  { words: [["yuboringlar.", 31.67]], end: 32.12 },
  { words: [["Hammaga", 32.12], ["shunaqa", 32.46]], end: 32.62 },
  { words: [["klientlar", 32.62], ["*nasib", 32.96]], end: 33.24 },
  { words: [["qilsin.", 33.24]], end: 33.53 },
];

export type Word = { text: string; key: boolean; from: number };
export type Page = { words: Word[]; from: number; to: number };
export const PAGES: Page[] = SRC.map((p) => ({
  words: p.words.map(([t, sec]) => ({ text: t.replace(/^[*]/, ""), key: t.startsWith("*"), from: s(sec) })),
  from: s(p.words[0][1]),
  to: s(p.end),
}));
