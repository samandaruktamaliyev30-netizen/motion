import { srcToOut } from "./timeline";

// Corrected Uzbek transcript with word start times in SOURCE seconds.
// Each inner array is one caption page. A leading "*" marks a keyword (accent colour).
type W = [string, number];
const PAGES_SRC: { words: W[]; end: number }[] = [
  { words: [["*Milliy", 0.0], ["*sertifikat", 0.12], ["*bekor", 0.54], ["bo‘ladimi?", 0.9]], end: 1.35 },
  { words: [["Demak,", 1.4], ["bu", 1.76], ["*ko‘pchilikni", 1.98]], end: 2.56 },
  { words: [["qiziqtirayotgan", 2.58], ["*savol", 3.14]], end: 3.38 },
  { words: [["bugungi", 3.4], ["kunda.", 3.7]], end: 4.2 },
  { words: [["Agar", 4.78], ["*o‘tgan", 5.08], ["*yilni", 5.5]], end: 5.86 },
  { words: [["ko‘rganimizdek,", 5.88]], end: 6.6 },
  { words: [["juda", 6.64], ["*ko‘p", 6.84], ["miqdordagi", 7.0], ["odamlar", 7.56]], end: 8.15 },
  { words: [["yana", 8.2], ["*A,", 8.44], ["*A+", 8.86]], end: 9.08 },
  { words: [["sertifikatlarini", 9.1], ["olib,", 9.82]], end: 10.24 },
  { words: [["hamma", 10.26], ["*bitta", 10.78], ["*joyga", 11.12]], end: 11.36 },
  { words: [["borib", 11.38], ["tiqilib", 11.58], ["qoladigan", 11.86], ["bo‘lsa,", 12.24]], end: 12.44 },
  { words: [["o‘sha", 12.46], ["*maksimal", 12.62], ["*ballga", 13.02]], end: 13.28 },
  { words: [["tiqilib", 13.3], ["qoladigan", 13.6], ["bo‘lsa,", 13.92]], end: 14.14 },
  { words: [["nimadir", 14.16], ["*ish", 14.46], ["qilish", 14.62], ["*kerak!", 14.8]], end: 15.08 },
  { words: [["Hozirgi", 15.1], ["kunda", 15.42]], end: 15.78 },
  { words: [["*ikkita", 15.8], ["*vazirligimiz", 16.08], ["birlashdi,", 16.5]], end: 17.08 },
  { words: [["va", 17.1], ["*bitta", 17.92], ["*vazir", 18.4], ["tayinlandi.", 18.66]], end: 19.6 },
  { words: [["Ular,", 20.02], ["masalan,", 20.62]], end: 21.04 },
  { words: [["nimadir", 21.06], ["*ish", 21.5]], end: 22.84 },
  { words: [["amalga", 22.86], ["oshirishadi", 23.24]], end: 23.84 },
  { words: [["va", 23.86], ["nimadir", 23.96], ["*tadbir", 24.28], ["qilishadi.", 24.54]], end: 24.96 },
  { words: [["Lekin", 24.98], ["mening", 25.26], ["*shaxsiy", 25.74], ["*fikrimcha,", 26.0]], end: 26.66 },
  { words: [["*katta", 26.68], ["*ehtimol", 27.04], ["bilan", 27.38]], end: 27.5 },
  { words: [["*olib", 27.52], ["*tashlashlari", 27.72], ["mumkin.", 27.96]], end: 28.28 },
  { words: [["Sababi,", 28.3], ["nimadir", 29.4], ["atrofida", 29.98]], end: 30.32 },
  { words: [["*katta", 30.34], ["*muammo,", 30.62]], end: 31.06 },
  { words: [["katta", 31.08], ["*shov-shuvlar", 31.54]], end: 33.0 },
  { words: [["bo‘ladigan", 33.02], ["bo‘lsa,", 33.2]], end: 33.7 },
  { words: [["bunaqasini", 33.72], ["yo", 34.2], ["*to‘g‘rilash", 34.24], ["kerak,", 34.56]], end: 34.78 },
  { words: [["yo", 34.8], ["*olib", 34.86], ["*tashlash", 35.0], ["kerak.", 35.24]], end: 35.52 },
  { words: [["Bu", 35.54], ["videoni", 35.76], ["*Milliy", 36.24], ["*sertifikatga", 36.48]], end: 36.88 },
  { words: [["tayyorlanayotgan", 36.9]], end: 37.46 },
  { words: [["*tanishlaringizga", 37.48], ["*jo‘natib", 38.04], ["qo‘ying!", 38.36]], end: 38.74 },
  { words: [["Sahifamizga", 39.22], ["*obuna", 39.82], ["bo‘lishni", 40.0], ["unutmang!", 40.3]], end: 40.66 },
  { words: [["Salomat", 40.68], ["bo‘ling!", 40.98]], end: 41.3 },
];

export type CapWord = { text: string; key: boolean; from: number };
export type CapPage = { from: number; to: number; words: CapWord[] };

export const PAGES: CapPage[] = PAGES_SRC.map((p, i) => {
  const from = srcToOut(p.words[0][1]);
  const next = PAGES_SRC[i + 1];
  // Hold each page until the next one starts (no flicker), but not longer than its end + 0.5 s.
  const to = next
    ? Math.min(srcToOut(next.words[0][1]), srcToOut(p.end) + 15)
    : srcToOut(p.end);
  return {
    from,
    to: Math.max(to, from + 8),
    words: p.words.map(([t, s]) => ({
      text: t.replace(/^\*/, ""),
      key: t.startsWith("*"),
      from: srcToOut(s),
    })),
  };
});
