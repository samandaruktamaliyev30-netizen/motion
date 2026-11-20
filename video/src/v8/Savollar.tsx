import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { at, DURATION, FACE, LOW, M, SHOTS } from "./timeline";
import { PHRASES } from "./captions";
import { StyleCaptions } from "../shared/StyleCaptions";
import { Book, Card1, Card2, Card3, Cta, Hard, Hook, Top3 } from "./Motion";

const RAW = staticFile("v8/raw.mp4");
const VOICE = staticFile("v8/voice.wav");
const GRADE = "contrast(1.1) saturate(1.12) brightness(1.03)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type R = { from: number; to: number };
const d = (r: R) => r.to - r.from;

// Face-anchored zoom + a whip-zoom punch on the very first frames (the hook).
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const whip = interpolate(f, [0, 10], [0.4, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const s = interpolate(f, [a, b], [s0, s1], clamp) + whip;
  const blur = interpolate(f, [0, 8], [8, 0], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: `${GRADE} blur(${blur}px)` }}>{children}</AbsoluteFill>;
};

// quick white flash on every jump cut
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const c = SHOTS.map(([x]) => x).filter((x) => x > 0).find((x) => f >= x && f < x + 3);
  if (c === undefined) return null;
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f - c, [0, 3], [0.18, 0]) }} />;
};

const S: React.FC<{ name: string; r: R; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={d(r)}>
    {children}
  </Sequence>
);

const HIDE: [number, number][] = Object.values(M).map((r) => [r.from, r.to] as [number, number]);

const SFX: [number, string, number][] = [
  [0, "bass.wav", 0.8],
  [0, "rm-whoosh.wav", 0.6],
  [10, "pop.wav", 0.4],
  [18, "bass.wav", 0.45],
  [38, "pop.wav", 0.4],
  [50, "bass.wav", 0.5],
  [54, "rm-switch.wav", 0.45],
  [M.top3.from, "rm-whoosh.wav", 0.45],
  [M.top3.from + 6, "tick.wav", 0.6],
  [M.top3.from + 13, "tick.wav", 0.6],
  [M.top3.from + 20, "tick.wav", 0.6],
  [M.card1.from, "rm-whoosh.wav", 0.5],
  [M.hard.from, "riser.wav", 0.35],
  [M.card2.from, "rm-whoosh.wav", 0.5],
  [M.card3.from, "rm-whoosh.wav", 0.5],
  [at(25.88), "pop.wav", 0.4],
  [at(27.2), "pop.wav", 0.4],
  [at(28.68), "pop.wav", 0.4],
  [M.book.from + 4, "rm-whip.wav", 0.45],
  [M.book.from + 30, "bass.wav", 0.5],
  [M.cta.from + 26, "tick.wav", 0.7],
  [M.cta.from + 44, "rm-mouse-click.wav", 0.7],
  [M.cta.from + 48, "rm-ding.wav", 0.4],
];

export const Savollar: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Clip 1" src={RAW} muted trimBefore={0} from={0} durationInFrames={626} />
      <Video name="Clip 2" src={RAW} muted trimBefore={635} from={626} durationInFrames={35} />
      <Video name="Clip 3" src={RAW} muted trimBefore={679} from={661} durationInFrames={34} />
      <Video name="Clip 4" src={RAW} muted trimBefore={722} from={695} durationInFrames={144} />
      <Video name="Clip 5" src={RAW} muted trimBefore={875} from={839} durationInFrames={186} />
      <Video name="Clip 6" src={RAW} muted trimBefore={1070} from={1025} durationInFrames={174} />
    </Camera>

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 44%, rgba(0,0,0,0.34) 58%, rgba(0,0,0,0.14) 100%)" }} />

    <StyleCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="HOOK" r={M.hook}><Hook dur={d(M.hook)} /></S>
    <S name="TOP-3" r={M.top3}><Top3 dur={d(M.top3)} /></S>
    <S name="1-savol: Elektroliz" r={M.card1}><Card1 dur={d(M.card1)} /></S>
    <S name="Murakkablik" r={M.hard}><Hard dur={d(M.hard)} /></S>
    <S name="2-savol: Kinetika" r={M.card2}><Card2 dur={d(M.card2)} /></S>
    <S name="3-savol: Noma’lum modda" r={M.card3}>
      <Card3
        dur={d(M.card3)}
        chips={[
          ["Noma’lum moddalar", at(25.88) - M.card3.from],
          ["Noma’lum kationlar", at(27.2) - M.card3.from],
          ["Konsentratsiyani aniqlash", at(28.68) - M.card3.from],
        ]}
      />
    </S>
    <S name="Kitob" r={M.book}><Book dur={d(M.book)} /></S>
    <S name="CTA: izohda 3" r={M.cta}><Cta dur={d(M.cta) + 10} /></S>
    <CutFlash />

    <Audio name="Voice 1" src={VOICE} trimBefore={0} from={0} durationInFrames={626} />
    <Audio name="Voice 2" src={VOICE} trimBefore={635} from={626} durationInFrames={35} />
    <Audio name="Voice 3" src={VOICE} trimBefore={679} from={661} durationInFrames={34} />
    <Audio name="Voice 4" src={VOICE} trimBefore={722} from={695} durationInFrames={144} />
    <Audio name="Voice 5" src={VOICE} trimBefore={875} from={839} durationInFrames={186} />
    <Audio name="Voice 6" src={VOICE} trimBefore={1070} from={1025} durationInFrames={174} />
    <Audio name="Music: Gabrielis – Princeps Caeli" src={staticFile("v8/music.wav")} volume={(fr) => (fr < 90 ? 1.25 : 0.9)} />
    {SFX.map(([fr, file, v], i) => (
      <Sequence key={i} from={fr} durationInFrames={50} name={`sfx ${file}`}>
        <Audio src={staticFile(`sfx/${file}`)} volume={v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const SAVOLLAR_DURATION = DURATION;
