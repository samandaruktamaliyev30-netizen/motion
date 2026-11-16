import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { at, BROLL, DURATION, FACE, HOOK, LOW, M, SHOTS } from "./timeline";
import { PHRASES } from "./captions";
import { StyleCaptions } from "../shared/StyleCaptions";
import { Dreams, HookCounter, Ninety, NumberPop, Question, Salary, Subscribe } from "./Motion";

const F = (p: string) => staticFile(`v7/${p}`);
const RAW = F("raw.mp4");
const VOICE = F("voice.wav");
const GRADE = "contrast(1.08) saturate(1.12) brightness(1.03)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type R = { from: number; to: number };
const d = (r: R) => r.to - r.from;

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: GRADE }}>{children}</AbsoluteFill>;
};

const BRoll: React.FC<{ src: string; dur: number; zoom?: [number, number]; cut?: boolean }> = ({ src, dur, zoom = [1.02, 1.1], cut }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom);
  const o = cut ? 1 : interpolate(f, [0, 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, filter: GRADE }}>
      <Video src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

const S: React.FC<{ name: string; r: R; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={d(r)}>
    {children}
  </Sequence>
);

const HIDE: [number, number][] = Object.values(M).map((r) => [r.from, r.to] as [number, number]);

export const Kimyo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Main 1" src={RAW} muted trimBefore={0} from={59} durationInFrames={54} />
      <Video name="Main 2" src={RAW} muted trimBefore={74} from={113} durationInFrames={51} />
      <Video name="Main 3" src={RAW} muted trimBefore={136} from={164} durationInFrames={143} />
      <Video name="Main 4" src={RAW} muted trimBefore={286} from={307} durationInFrames={108} />
      <Video name="Main 5" src={RAW} muted trimBefore={401} from={415} durationInFrames={93} />
      <Video name="Main 6" src={RAW} muted trimBefore={508} from={508} durationInFrames={108} />
      <Video name="Main 7" src={RAW} muted trimBefore={625} from={616} durationInFrames={592} />
      <Video name="Main 8" src={RAW} muted trimBefore={1224} from={1208} durationInFrames={132} />
      <Video name="Main 9" src={RAW} muted trimBefore={1364} from={1340} durationInFrames={51} />
      <Video name="Main 10" src={RAW} muted trimBefore={1429} from={1391} durationInFrames={169} />
      <Video name="Main 11" src={RAW} muted trimBefore={1612} from={1560} durationInFrames={155} />
    </Camera>

    <S name="HOOK: 100 mln+ oylik (kadr)" r={BROLL.hook}><BRoll src={F("hook.mp4")} dur={HOOK} zoom={[1.08, 1.16]} cut /></S>
    <S name="1-sabab: o‘quvchilar" r={BROLL.class}><BRoll src={F("class.mp4")} dur={d(BROLL.class)} /></S>
    <S name="3-sabab: ustoz dars beryapti" r={BROLL.teach}><BRoll src={F("teach.mp4")} dur={d(BROLL.teach)} /></S>
    <S name="Oylik: pul" r={BROLL.money}><BRoll src={F("money.mp4")} dur={d(BROLL.money)} /></S>

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.38) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 46%, rgba(0,0,0,0.32) 60%, rgba(0,0,0,0.12) 100%)" }} />

    <StyleCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="Hook: hisoblagich" r={M.hook}><HookCounter dur={d(M.hook)} /></S>
    <S name="Savol" r={M.question}><Question dur={d(M.question)} /></S>
    <S name="1" r={M.n1}><NumberPop n={1} dur={d(M.n1)} /></S>
    <S name="2" r={M.n2}><NumberPop n={2} dur={d(M.n2)} /></S>
    <S name="3" r={M.n3}><NumberPop n={3} dur={d(M.n3)} /></S>
    <S name="4" r={M.n4}><NumberPop n={4} dur={d(M.n4)} /></S>
    <S name="90%" r={M.ninety}><Ninety dur={d(M.ninety)} /></S>
    <S name="Oylik" r={M.salary}><Salary dur={d(M.salary)} /></S>
    <S name="Kimyogar bo‘laman" r={M.dreams}><Dreams dur={d(M.dreams)} chessAt={at(52.3) - M.dreams.from} okAt={at(53.8) - M.dreams.from} /></S>
    <S name="Obuna" r={M.subscribe}><Subscribe dur={d(M.subscribe) + 10} clickAt={at(58.0) - M.subscribe.from} /></S>

    <Audio name="Hook voice" src={F("hook.wav")} from={0} durationInFrames={HOOK} />
    <Audio name="Voice 1" src={VOICE} trimBefore={0} from={59} durationInFrames={54} />
    <Audio name="Voice 2" src={VOICE} trimBefore={74} from={113} durationInFrames={51} />
    <Audio name="Voice 3" src={VOICE} trimBefore={136} from={164} durationInFrames={143} />
    <Audio name="Voice 4" src={VOICE} trimBefore={286} from={307} durationInFrames={108} />
    <Audio name="Voice 5" src={VOICE} trimBefore={401} from={415} durationInFrames={93} />
    <Audio name="Voice 6" src={VOICE} trimBefore={508} from={508} durationInFrames={108} />
    <Audio name="Voice 7" src={VOICE} trimBefore={625} from={616} durationInFrames={592} />
    <Audio name="Voice 8" src={VOICE} trimBefore={1224} from={1208} durationInFrames={132} />
    <Audio name="Voice 9" src={VOICE} trimBefore={1364} from={1340} durationInFrames={51} />
    <Audio name="Voice 10" src={VOICE} trimBefore={1429} from={1391} durationInFrames={169} />
    <Audio name="Voice 11" src={VOICE} trimBefore={1612} from={1560} durationInFrames={155} />
    <Audio name="Music: LoVibe – a good man with a broken heart" src={F("music.wav")} volume={0.9} />
  </AbsoluteFill>
);

export const KIMYO_DURATION = DURATION;
