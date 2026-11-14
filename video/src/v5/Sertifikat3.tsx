import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { Phrase, StyleCaptions } from "../shared/StyleCaptions";
import { ChatBubble, Compare, NotEqual, ThreeYears } from "./Motion";

// Motion inserts [from, to]; subtitles are hidden while one is on screen.
const M = { notEqual: [38, 100], compare: [241, 370], chat: [693, 825], years: [870, 911] } as const;
const HIDE: [number, number][] = Object.values(M).map(([a, b]) => [a, b]);

// 2:04 interview cut down to ~42 s. Segments chosen to tell one story:
// system doesn't think long-term -> certificate ≠ knowledge -> everything tied to it ->
// teacher's experience -> "I forgot, I got it long ago" -> then why give it? -> conclusion.
const RAW = staticFile("v5/raw.mp4");
const VOICE = staticFile("v5/voice.wav");
export const DURATION = 1272;

// Speaker's face in 1080×1920 space (OpenCV median): x≈625, forehead≈342, chin≈765 (max 860).
const FACE = { cx: 610, cy: 555 };

// [outFrom, outTo, scaleStart, scaleEnd] — a different framing on every jump cut.
const SHOTS: [number, number, number, number][] = [
  [0, 38, 1.0, 1.04],
  [38, 100, 1.18, 1.21],
  [100, 241, 1.0, 1.06],
  [241, 301, 1.15, 1.17],
  [301, 370, 1.0, 1.03],
  [370, 559, 1.1, 1.17],
  [559, 693, 1.22, 1.25],
  [693, 911, 1.0, 1.08],
  [911, 1053, 1.2, 1.24],
  [1053, 1161, 1.05, 1.09],
  [1161, 1218, 1.25, 1.27],
  [1218, 1272, 1.1, 1.16],
];

const PHRASES: Phrase[] = [
  { from: 0, to: 38, text: "Ta’lim jarayoni uzoqni o‘ylamayapti." },
  { from: 38, to: 100, text: "Sertifikat oldi degani — hali bilimli degani emas." },
  { from: 100, to: 175, text: "Faqat shu sertifikatga bog‘lab qo‘yib," },
  { from: 175, to: 241, text: "hammaning diqqatini sertifikatga qaratdik." },
  { from: 241, to: 301, text: "Sertifikatli bolaniyam o‘qitib ko‘ryapman," },
  { from: 301, to: 370, text: "sertifikatsiz bolaniyam o‘qitib ko‘ryapman." },
  { from: 370, to: 440, text: "Lekin sertifikati bo‘lmagan bolalar" },
  { from: 440, to: 500, text: "ko‘p holatlarda nisbatan" },
  { from: 500, to: 559, text: "institutda faollik ko‘rsatyapti." },
  { from: 559, to: 616, text: "Hayron qolasan: sertifikati bor," },
  { from: 616, to: 693, text: "lekin miyasiga hech narsa sig‘mayapti." },
  { from: 693, to: 788, text: "So‘rasang: «Voy, men sertifikatni ancha oldin olganman, ustoz," },
  { from: 788, to: 825, text: "esimdan chiqib ketibdi», deydi." },
  { from: 825, to: 870, text: "Bu qanaqasi degani?" },
  { from: 870, to: 911, text: "Senga sertifikat uch yilga berilgan!" },
  { from: 911, to: 1000, text: "Nahotki uch yilga berilgan sertifikatni olgan bola" },
  { from: 1000, to: 1053, text: "esidan hammasini chiqarib yuborgan bo‘lsa?" },
  { from: 1053, to: 1119, text: "Rostdan shunaqa holat bo‘layotgan bo‘lsa," },
  { from: 1119, to: 1161, text: "unda sertifikat berib nima qilamiz?" },
  { from: 1161, to: 1218, text: "Menimcha, sertifikat degan narsa" },
  { from: 1218, to: 1272, text: "hali zo‘r degani emas." },
];

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: "contrast(1.08) saturate(1.1) brightness(1.04)" }}>
      {children}
    </AbsoluteFill>
  );
};

const V: React.FC<{ name: string; trimBefore: number; from: number; dur: number }> = ({ name, trimBefore, from, dur }) => (
  <Video name={name} src={RAW} muted trimBefore={trimBefore} from={from} durationInFrames={dur} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
);
const A: React.FC<{ name: string; trimBefore: number; from: number; dur: number }> = ({ name, trimBefore, from, dur }) => (
  <Audio name={name} src={VOICE} trimBefore={trimBefore} from={from} durationInFrames={dur} />
);

export const Sertifikat3: React.FC = () => {
  const f = useCurrentFrame();
  const endFade = interpolate(f, [DURATION - 12, DURATION], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        <V name="A — uzoqni o‘ylamayapti" trimBefore={0} from={0} dur={38} />
        <V name="B — bilimli degani emas" trimBefore={158} from={38} dur={62} />
        <V name="C — diqqatni qaratdik" trimBefore={250} from={100} dur={141} />
        <V name="E1a — sertifikatli" trimBefore={1860} from={241} dur={60} />
        <V name="E1b — sertifikatsiz" trimBefore={1935} from={301} dur={69} />
        <V name="E2 — faollik" trimBefore={2005} from={370} dur={189} />
        <V name="F — miyasiga sig‘mayapti" trimBefore={2528} from={559} dur={134} />
        <V name="G — esimdan chiqibdi" trimBefore={2681} from={693} dur={218} />
        <V name="H — nahotki" trimBefore={2911} from={911} dur={142} />
        <V name="I — nima qilamiz" trimBefore={3058} from={1053} dur={108} />
        <V name="J1 — menimcha" trimBefore={1648} from={1161} dur={57} />
        <V name="J2 — zo‘r degani emas" trimBefore={1714} from={1218} dur={54} />
      </Camera>

      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 35%, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.12) 100%)" }} />

      {/* House subtitle style, fixed below the chin */}
      <StyleCaptions phrases={PHRASES} top={980} hide={HIDE} />

      <Sequence name="Sertifikat ≠ Bilim" from={M.notEqual[0]} durationInFrames={M.notEqual[1] - M.notEqual[0]}>
        <NotEqual dur={M.notEqual[1] - M.notEqual[0]} />
      </Sequence>
      <Sequence name="Sertifikatli / Sertifikatsiz" from={M.compare[0]} durationInFrames={M.compare[1] - M.compare[0]}>
        <Compare dur={M.compare[1] - M.compare[0]} secondAt={60} />
      </Sequence>
      <Sequence name="Talaba xabari" from={M.chat[0]} durationInFrames={M.chat[1] - M.chat[0]}>
        <ChatBubble dur={M.chat[1] - M.chat[0]} />
      </Sequence>
      <Sequence name="3 yil" from={M.years[0]} durationInFrames={M.years[1] - M.years[0]}>
        <ThreeYears dur={M.years[1] - M.years[0]} />
      </Sequence>

      <AbsoluteFill style={{ backgroundColor: "black", opacity: endFade }} />

      <A name="Voice A" trimBefore={0} from={0} dur={38} />
      <A name="Voice B" trimBefore={158} from={38} dur={62} />
      <A name="Voice C" trimBefore={250} from={100} dur={141} />
      <A name="Voice E1a" trimBefore={1860} from={241} dur={60} />
      <A name="Voice E1b" trimBefore={1935} from={301} dur={69} />
      <A name="Voice E2" trimBefore={2005} from={370} dur={189} />
      <A name="Voice F" trimBefore={2528} from={559} dur={134} />
      <A name="Voice G" trimBefore={2681} from={693} dur={218} />
      <A name="Voice H" trimBefore={2911} from={911} dur={142} />
      <A name="Voice I" trimBefore={3058} from={1053} dur={108} />
      <A name="Voice J1" trimBefore={1648} from={1161} dur={57} />
      <A name="Voice J2" trimBefore={1714} from={1218} dur={54} />

      {/* EsDeeKid – Mist: quiet intro, beat drops on the "I forgot it" story */}
      <Audio name="Music: EsDeeKid - Mist" src={staticFile("v5/music.wav")} volume={(fr) => (fr < 693 ? 0.6 : 0.33)} />
    </AbsoluteFill>
  );
};
