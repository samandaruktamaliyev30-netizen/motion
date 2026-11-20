import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { Phrase, StyleCaptions } from "../shared/StyleCaptions";

// Simple edit (as requested): 3 s hook clip, then the main selfie take with hesitations cut,
// gentle zoom changes on the jump cuts, house subtitles below the chin, quiet music.
const F = (p: string) => staticFile(`v9/${p}`);
export const HOOK = 78;
export const DURATION = 1423;

// Main take kept parts (30 fps frames). Pauses/hesitations removed at 3.5, 13.8, 35.2, 41.5, 43.0 s.
const CUTS: [number, number, number][] = [
  [0, 106, 78],
  [122, 415, 184],
  [428, 1056, 477],
  [1070, 1244, 1105],
  [1261, 1291, 1279],
  [1299, 1413, 1309],
];

// Selfie: the face is big. Zoom is anchored on the forehead so the chin barely moves,
// and subtitles sit below the chin (main chin ≈1150–1260, hook chin ≈1300–1370).
const ANCHOR = { x: 447, y: 360 };
const SCALES = [1.0, 1.05, 1.0, 1.05, 1.0, 1.04];

const PHRASES: Phrase[] = [
  { from: 0, to: HOOK, text: "Imtihonlardan sekin-astalik bilan voz kechiladi" },
  { from: 78, to: 184, text: "2027–2028-o‘quv yilining oxiridan boshlab" },
  { from: 184, to: 266, text: "yangi, ya’ni OGE’ga o‘xshagan imtihonlar" },
  { from: 266, to: 340, text: "DTM imtihonlarining o‘rniga alternativa sifatida," },
  { from: 340, to: 384, text: "tajriba sifatida kiritila boshlaydi." },
  { from: 384, to: 477, text: "Tajriba Navoiy va Toshkent shaharlarida o‘tkaziladi." },
  { from: 477, to: 560, text: "2028–2029-o‘quv yilidan boshlab" },
  { from: 560, to: 615, text: "butun O‘zbekistonda qo‘llaniladi," },
  { from: 615, to: 686, text: "agar tajriba muvaffaqiyatli o‘tsa." },
  { from: 686, to: 770, text: "Bu degani — DTM imtihonlaridan" },
  { from: 770, to: 818, text: "bosqichma-bosqich voz kechiladi." },
  { from: 818, to: 919, text: "Ularning o‘rniga maktab imtihonlari asosida" },
  { from: 919, to: 977, text: "9-sinf bitiruvchilari litseylarga," },
  { from: 977, to: 1040, text: "11-sinf bitiruvchilari esa" },
  { from: 1040, to: 1105, text: "oliy o‘quv yurtlariga qabul qilinadi." },
  { from: 1105, to: 1124, text: "Qaytarib aytaman:" },
  { from: 1124, to: 1229, text: "9-sinf imtihonlari asosida" },
  { from: 1229, to: 1260, text: "litsey va kollejlarga," },
  { from: 1260, to: 1334, text: "11-sinf imtihonlari esa" },
  { from: 1334, to: DURATION, text: "oliy o‘quv yurtlariga kirishga asos bo‘ladi." },
];

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  let i = CUTS.findIndex(([, , out], k) => f >= out && (k === CUTS.length - 1 || f < CUTS[k + 1][2]));
  if (i < 0) i = 0;
  const [sa, sb, out] = CUTS[i];
  const s = interpolate(f, [out, out + (sb - sa)], [SCALES[i], SCALES[i] + 0.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${f < HOOK ? 1 : s})`, transformOrigin: `${ANCHOR.x}px ${ANCHOR.y}px`, filter: "contrast(1.06) saturate(1.08) brightness(1.02)" }}>
      {children}
    </AbsoluteFill>
  );
};

export const Sodda: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [DURATION - 10, DURATION], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        <Video name="Hook (3 s)" src={F("hook.mp4")} muted from={0} durationInFrames={HOOK} />
        <Video name="Main 1" src={F("main.mp4")} muted trimBefore={0} from={78} durationInFrames={106} />
        <Video name="Main 2" src={F("main.mp4")} muted trimBefore={122} from={184} durationInFrames={293} />
        <Video name="Main 3" src={F("main.mp4")} muted trimBefore={428} from={477} durationInFrames={628} />
        <Video name="Main 4" src={F("main.mp4")} muted trimBefore={1070} from={1105} durationInFrames={174} />
        <Video name="Main 5" src={F("main.mp4")} muted trimBefore={1261} from={1279} durationInFrames={30} />
        <Video name="Main 6" src={F("main.mp4")} muted trimBefore={1299} from={1309} durationInFrames={114} />
      </Camera>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 58%, rgba(0,0,0,0.3) 72%, rgba(0,0,0,0.15) 100%)" }} />

      {/* hook: chin sits lower, so the subtitle sits lower too */}
      <Sequence from={0} durationInFrames={HOOK} name="Subtitle (hook)">
        <StyleCaptions phrases={[{ from: 0, to: HOOK, text: PHRASES[0].text }]} top={1420} />
      </Sequence>
      <StyleCaptions phrases={PHRASES.slice(1)} top={1300} />

      <AbsoluteFill style={{ backgroundColor: "black", opacity: fadeOut }} />

      <Audio name="Hook voice" src={F("voice_b.wav")} from={0} durationInFrames={HOOK} />
      <Audio name="Voice 1" src={F("voice_a.wav")} trimBefore={0} from={78} durationInFrames={106} />
      <Audio name="Voice 2" src={F("voice_a.wav")} trimBefore={122} from={184} durationInFrames={293} />
      <Audio name="Voice 3" src={F("voice_a.wav")} trimBefore={428} from={477} durationInFrames={628} />
      <Audio name="Voice 4" src={F("voice_a.wav")} trimBefore={1070} from={1105} durationInFrames={174} />
      <Audio name="Voice 5" src={F("voice_a.wav")} trimBefore={1261} from={1279} durationInFrames={30} />
      <Audio name="Voice 6" src={F("voice_a.wav")} trimBefore={1299} from={1309} durationInFrames={114} />
      <Audio name="Music: LoVibe (quiet)" src={F("music.wav")} volume={0.8} />
    </AbsoluteFill>
  );
};
