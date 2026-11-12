import { at, TITLE_END } from "./timeline";

// Corrected Uzbek transcript, word starts in SOURCE seconds. "*" = keyword.
type W = [string, number];
const SRC: { words: W[]; end: number }[] = [
  { words: [["talaba", 2.32], ["*universitet", 2.68]], end: 3.42 },
  { words: [["dasturida", 3.44], ["*qiynaladi?", 4.06]], end: 4.6 },
  { words: [["Buning", 4.64], ["*uchta", 5.04], ["*sababi", 5.42], ["bor.", 5.82]], end: 6.05 },
  { words: [["*Birinchisi,", 6.1]], end: 6.76 },
  { words: [["bu", 6.78], ["ta’limdagi", 6.94], ["*uzviylikning", 7.5], ["*buzilganligi.", 8.0]], end: 8.7 },
  { words: [["Ya’ni,", 8.74], ["maktabda", 9.1], ["berilgan", 9.84]], end: 10.22 },
  { words: [["*bilim", 10.24], ["va", 10.45], ["*ko‘nikmalar", 10.62]], end: 11.06 },
  { words: [["institutdagi", 11.08], ["*talablarga", 12.26]], end: 13.2 },
  { words: [["*mos", 13.22], ["*kelmasligi.", 13.42]], end: 14.04 },
  { words: [["*Ikkinchisi,", 14.14]], end: 14.84 },
  { words: [["bolalar", 14.86], ["*test", 15.5], ["ishlayotgan", 15.74], ["paytda,", 16.2]], end: 16.72 },
  { words: [["qaysi", 16.74], ["*to‘g‘ri", 17.24], ["*javob", 17.7]], end: 18.0 },
  { words: [["ekanligini", 18.02], ["biladi.", 18.44]], end: 18.84 },
  { words: [["Lekin", 18.86], ["qolganlari", 19.48]], end: 20.26 },
  { words: [["nima", 20.28], ["uchun", 20.54], ["*noto‘g‘ri", 20.98], ["ekanligini", 21.46]], end: 22.1 },
  { words: [["*isbotlab", 22.12], ["bera", 23.18], ["olmaydi,", 23.3]], end: 23.7 },
  { words: [["yoki", 23.72], ["uni", 23.86], ["*tushunmaydi.", 24.1]], end: 24.6 },
  { words: [["*Uchinchisi,", 24.68]], end: 25.26 },
  { words: [["bu", 25.28], ["*amalda", 25.86], ["*qo‘llash.", 26.36]], end: 27.5 },
  { words: [["Amalda", 27.54], ["*qo‘llay", 28.14], ["*olmaydi.", 28.3]], end: 28.68 },
  { words: [["Olgan", 28.7], ["bilim", 29.28], ["va", 29.5], ["ko‘nikmalarini", 29.6]], end: 30.24 },
  { words: [["*amalda", 30.26], ["*qo‘llash", 30.8], ["yo‘q.", 31.2]], end: 31.5 },
  { words: [["Masalan,", 31.56], ["eritmaning", 32.48]], end: 33.06 },
  { words: [["*pH", 33.08], ["qiymatini", 33.3], ["oladigan", 33.5], ["bo‘lsak,", 33.8]], end: 34.16 },
  { words: [["yoki", 34.18], ["*organizmdagi", 34.42]], end: 34.96 },
  { words: [["*pH", 34.98], ["qiymatini", 35.34], ["oladigan", 35.7], ["bo‘lsak,", 36.04]], end: 36.44 },
  { words: [["uni", 36.46], ["pH’ini", 36.8], ["*topishi", 37.38], ["mumkin,", 37.64]], end: 38.04 },
  { words: [["lekin", 38.06], ["uning", 38.68], ["qanday", 39.62], ["*amaliy", 39.96], ["*ahamiyati", 40.36]], end: 40.82 },
  { words: [["borligi", 40.84], ["haqida", 41.26], ["*tushuncha", 41.54], ["*yo‘q.", 41.88]], end: 42.2 },
  { words: [["*Tibbiyot", 42.26], ["*oliygohlarida", 42.82]], end: 43.48 },
  { words: [["qandaydir", 43.5], ["*quruq", 44.3], ["*masalalar", 44.6]], end: 44.86 },
  { words: [["yoki", 44.88], ["*quruq", 45.24], ["*testlar", 45.5], ["ishlatilmaydi.", 45.82]], end: 46.4 },
  { words: [["U", 46.48], ["yerda", 46.6], ["asosan,", 46.8]], end: 47.18 },
  { words: [["*mohiyatini", 47.2], ["tushunish", 47.7], ["kerak,", 48.08]], end: 48.42 },
  { words: [["va", 48.76], ["*ahamiyatini", 48.86], ["tushunish", 49.16], ["kerak.", 49.52]], end: 49.78 },
  { words: [["Agar", 49.8], ["videomiz", 50.16], ["*foydali", 50.52], ["bo‘lgan", 50.76], ["bo‘lsa,", 51.02]], end: 51.3 },
  { words: [["buni", 51.36], ["*abituriyent", 51.8], ["*tanishlaringizga", 52.22]], end: 52.72 },
  { words: [["*jo‘natib", 52.74], ["qo‘ying", 53.02]], end: 53.28 },
];

export type CapWord = { text: string; key: boolean; from: number };
export type CapPage = { from: number; to: number; words: CapWord[] };

export const PAGES: CapPage[] = SRC.map((p, i) => {
  const next = SRC[i + 1];
  const from = Math.max(at(p.words[0][1]), i === 0 ? TITLE_END : 0);
  const to = next ? Math.min(at(next.words[0][1]), at(p.end) + 12) : at(p.end) + 6;
  return {
    from,
    to: Math.max(to, from + 8),
    words: p.words.map(([t, s]) => ({ text: t.replace(/^\*/, ""), key: t.startsWith("*"), from: at(s) })),
  };
});
