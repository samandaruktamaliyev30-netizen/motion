// Uzbek Latin -> new (reformed) Latin alphabet: oʻ→ö, gʻ→ğ, sh→ş, ch→ç.
// The apostrophe in words like "ta’lim", "e’tibor" (tutuq belgisi) stays.
const APOS = "[‘ʻ'`]";

export const toNewAlphabet = (s: string): string =>
  s
    .replace(new RegExp(`O${APOS}`, "g"), "Ö")
    .replace(new RegExp(`o${APOS}`, "g"), "ö")
    .replace(new RegExp(`G${APOS}`, "g"), "Ğ")
    .replace(new RegExp(`g${APOS}`, "g"), "ğ")
    .replace(/SH/g, "Ş")
    .replace(/Sh/g, "Ş")
    .replace(/sh/g, "ş")
    .replace(/CH/g, "Ç")
    .replace(/Ch/g, "Ç")
    .replace(/ch/g, "ç");
