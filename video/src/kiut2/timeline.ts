// "KIUT" edit v3 — same take and cuts as ../kiut, new B-roll plan.
import { at, CLIPS, DURATION, FACE, NUMBERS, OUTRO, SHOTS, SPEECH_END, TITLE_END } from "../kiut/timeline";

export { at, CLIPS, DURATION, FACE, NUMBERS, OUTRO, SHOTS, SPEECH_END, TITLE_END };

// B-roll plan (output frames), as requested:
//  start            -> university building (KIUT facade)
//  "300+ ustoz"     -> teachers (white-coat lecturer, professors)
//  "40 ming talaba" -> students in a lecture
//  "yaxshi sharoit" -> students studying in class
//  "amaliyot"       -> hands-on work + laboratory
const split = at(11.9);
export const BROLL = {
  front: { from: 0, to: at(2.74) },
  teacher: { from: at(10.76), to: split },
  profs: { from: split, to: at(12.82) },
  students: { from: at(12.82), to: at(15.3) },
  classroom: { from: at(38.22), to: at(40.9) },
  handson: { from: at(41.64), to: at(46.28) },
  lab: { from: at(46.28), to: at(49.62) },
};

// "Bittasi metro oldida …" -> split screen: speaker on top, metro below.
export const METRO = { from: at(51.62), to: at(54.28) };
// Source frame of the speaker at METRO.from (clip 11 starts at src 1498 / out 1407).
export const METRO_SRC = 1498 + (METRO.from - 1407);

export const CAPTION_HIDE: [number, number][] = [
  [0, TITLE_END],
  ...NUMBERS,
  [METRO.from, METRO.to],
  [OUTRO.from, OUTRO.to],
];
