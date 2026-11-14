import { s } from "./timeline";

// Voice-over transcript (corrected Uzbek), word starts in seconds. "*" = keyword.
type W = [string, number];
const SRC: { words: W[]; end: number }[] = [
  { words: [["Targetga", 0.0], ["oyiga", 0.48], ["*$300–400", 1.14], ["sarflaysiz.", 2.3]], end: 3.06 },
  { words: [["Lekin", 3.06], ["reklama", 3.66], ["kutilgan", 4.23]], end: 4.61 },
  { words: [["*natijani", 4.61], ["*bermayaptimi?", 5.12]], end: 5.9 },
  { words: [["Ko‘pchilik", 5.9], ["biznes", 6.71]], end: 7.05 },
  { words: [["egalari", 7.05], ["muammoni", 7.48]], end: 8.18 },
  { words: [["*reklamadan", 8.18], ["deb", 8.87], ["o‘ylaydi.", 9.06]], end: 9.66 },
  { words: [["Aslida", 9.66], ["esa", 10.27], ["sabab", 10.54]], end: 11.05 },
  { words: [["noto‘g‘ri", 11.05], ["*taklif,", 11.86]], end: 12.39 },
  { words: [["*strategiya", 12.39], ["yoki", 13.31], ["*sotuv", 13.73]], end: 14.22 },
  { words: [["*tizimi", 14.22], ["bo‘lishi", 14.51], ["mumkin.", 14.8]], end: 15.3 },
  { words: [["Ko‘pchilik", 15.3], ["avval", 16.1]], end: 16.54 },
  { words: [["*reklamani", 16.54], ["yoqadi.", 17.18]], end: 17.58 },
  { words: [["Keyin", 17.58], ["*mo‘jiza", 18.1], ["kutadi.", 18.65]], end: 19.24 },
  { words: [["Biz", 19.58], ["esa", 19.95], ["*aksincha,", 20.11]], end: 20.84 },
  { words: [["ishni", 20.84], ["biznesni", 21.45], ["*tahlil", 21.99]], end: 22.34 },
  { words: [["qilishdan", 22.34], ["boshlaymiz.", 22.69]], end: 23.1 },
  { words: [["*Auditoriya,", 23.1], ["*mahsulot,", 24.24]], end: 25.05 },
  { words: [["*taklif", 25.05], ["va", 25.76], ["*sotuv", 25.97]], end: 26.54 },
  { words: [["jarayonini", 26.54], ["o‘rganib,", 27.07]], end: 27.64 },
  { words: [["shundan", 27.64], ["keyingina", 28.24]], end: 28.86 },
  { words: [["*reklama", 28.86], ["*strategiyasini", 29.29]], end: 30.0 },
  { words: [["ishlab", 30.0], ["chiqamiz.", 30.26]], end: 30.74 },
  { words: [["Chunki", 30.74], ["ko‘p", 31.33], ["*lid", 31.85], ["kelishi", 32.1]], end: 32.61 },
  { words: [["hali", 32.61], ["ko‘p", 33.06], ["*savdo", 33.38], ["degani", 33.75]], end: 34.09 },
  { words: [["emas.", 34.09]], end: 34.7 },
  { words: [["Bizning", 34.7], ["sohada", 35.43], ["reklama", 35.84], ["*ishlaydimi?", 36.49]], end: 37.1 },
  { words: [["Har", 37.1], ["bir", 37.76], ["biznes", 37.92], ["uchun", 38.26]], end: 38.62 },
  { words: [["*alohida", 38.62], ["*strategiya", 39.16], ["kerak.", 39.78]], end: 40.3 },
  { words: [["Mijoz", 40.3], ["kelib,", 41.02]], end: 41.44 },
  { words: [["*sotib", 41.44], ["*olmasa-chi?", 41.86]], end: 42.6 },
  { words: [["Bunda", 42.6], ["*sotuv", 43.29], ["*bo‘limi", 43.84], ["va", 44.28]], end: 44.55 },
  { words: [["*menejerlar", 44.55], ["ishi", 45.28], ["ham", 45.54], ["muhim.", 45.73]], end: 46.2 },
  { words: [["Siz", 46.2], ["ham", 46.79], ["biznesingizda", 47.09]], end: 47.74 },
  { words: [["*marketing", 47.74], ["va", 48.25], ["*savdoni", 48.51]], end: 49.05 },
  { words: [["to‘g‘ri", 49.05], ["yo‘lga", 49.54], ["qo‘yishni", 49.91], ["istasangiz,", 50.25]], end: 50.86 },
  { words: [["sahifamga", 50.86], ["*obuna", 51.54], ["bo‘ling.", 51.92]], end: 52.32 },
  { words: [["Bu", 52.32], ["yerda", 52.77], ["marketingning", 53.11]], end: 54.03 },
  { words: [["*amaliy", 54.03], ["*sirlarini", 54.48], ["ulashib", 54.99], ["boraman.", 55.41]], end: 56.46 },
];

export type Word = { text: string; key: boolean; from: number };
export type Page = { words: Word[]; from: number; to: number };

export const PAGES: Page[] = SRC.map((p) => ({
  words: p.words.map(([t, sec]) => ({ text: t.replace(/^[*]/, ""), key: t.startsWith("*"), from: s(sec) })),
  from: s(p.words[0][1]),
  to: s(p.end),
}));
