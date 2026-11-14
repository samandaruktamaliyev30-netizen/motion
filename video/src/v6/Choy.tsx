import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { at, DURATION, FACE, KETTLE, LOW, M, SHOTS, TEA } from "./timeline";
import { PHRASES } from "./captions";
import { StyleCaptions } from "../shared/StyleCaptions";
import { Fast, Guests, Ions, Myth, Race, Raoult, Salts, Subscribe, Thermo, Title } from "./Motion";

const RAW = staticFile("v6/raw.mp4");
const VOICE = staticFile("v6/voice.wav");
const GRADE = "contrast(1.08) saturate(1.12) brightness(1.03)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: GRADE }}>{children}</AbsoluteFill>;
};

const BRoll: React.FC<{ src: string; dur: number; fadeOut?: boolean }> = ({ src, dur, fadeOut }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.0, 1.08]);
  const o = fadeOut ? interpolate(f, [dur - 5, dur], [1, 0], clamp) : interpolate(f, [0, 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, filter: GRADE }}>
      <Video src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

const S: React.FC<{ name: string; r: { from: number; to: number }; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={r.to - r.from}>
    {children}
  </Sequence>
);
const d = (r: { from: number; to: number }) => r.to - r.from;

// Subtitles are hidden under the opening and under every motion insert.
const HIDE: [number, number][] = [[0, KETTLE.to], ...Object.values(M).map((r) => [r.from, r.to] as [number, number])];

export const Choy: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Clip 1" src={RAW} muted trimBefore={0} from={0} durationInFrames={256} />
      <Video name="Clip 2" src={RAW} muted trimBefore={265} from={256} durationInFrames={673} />
      <Video name="Clip 3" src={RAW} muted trimBefore={946} from={929} durationInFrames={790} />
      <Video name="Clip 4" src={RAW} muted trimBefore={1762} from={1719} durationInFrames={156} />
      <Video name="Clip 5" src={RAW} muted trimBefore={1972} from={1875} durationInFrames={478} />
      <Video name="Clip 6" src={RAW} muted trimBefore={2465} from={2353} durationInFrames={143} />
    </Camera>

    {/* question: kettle on the fire — ends exactly when the question ends */}
    <S name="Kadr: choynak (savol)" r={KETTLE}>
      <BRoll src={staticFile("v6/kettle.mp4")} dur={d(KETTLE)} fadeOut />
    </S>
    {/* "qaynash temperaturasi" — tea cup */}
    <S name="Kadr: choy (qaynash harorati)" r={TEA}>
      <BRoll src={staticFile("v6/tea.mp4")} dur={d(TEA)} />
    </S>

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.38) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 48%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.12) 100%)" }} />

    <StyleCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="Sarlavha: Choy nega sekin qaynaydi?" r={M.title}><Title dur={d(M.title)} /></S>
    <S name="Mif yoki rost?" r={M.myth}><Myth dur={d(M.myth)} /></S>
    <S name="Qaynash poygasi" r={M.race}><Race dur={d(M.race)} /></S>
    <S name="Erigan tuzlar" r={M.salts}><Salts dur={d(M.salts)} /></S>
    <S name="Ca / Mg ionlari" r={M.ions}><Ions dur={d(M.ions)} /></S>
    <S name="Raul qonuni" r={M.raoult}><Raoult dur={d(M.raoult)} /></S>
    <S name="Termometr" r={M.thermo}><Thermo dur={d(M.thermo)} /></S>
    <S name="Mehmon" r={M.guests}><Guests dur={d(M.guests)} /></S>
    <S name="Toshkent tez" r={M.fast}><Fast dur={d(M.fast)} /></S>
    <S name="Obuna" r={M.subscribe}><Subscribe dur={d(M.subscribe) + 10} clickAt={at(84.9) - M.subscribe.from} /></S>

    <Audio name="Voice 1" src={VOICE} trimBefore={0} from={0} durationInFrames={256} />
    <Audio name="Voice 2" src={VOICE} trimBefore={265} from={256} durationInFrames={673} />
    <Audio name="Voice 3" src={VOICE} trimBefore={946} from={929} durationInFrames={790} />
    <Audio name="Voice 4" src={VOICE} trimBefore={1762} from={1719} durationInFrames={156} />
    <Audio name="Voice 5" src={VOICE} trimBefore={1972} from={1875} durationInFrames={478} />
    <Audio name="Voice 6" src={VOICE} trimBefore={2465} from={2353} durationInFrames={143} />
    <Audio name="Music: LoVibe (lo-fi)" src={staticFile("v6/music.wav")} volume={0.9} />
  </AbsoluteFill>
);

export const CHOY_DURATION = DURATION;
