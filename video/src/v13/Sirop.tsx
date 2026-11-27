import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { StyleCaptions } from "../shared/StyleCaptions";
import { AIR_METER, BARS_B, CLIPS, DURATION, M, PHRASES } from "./data";
import { Air, Bars, Cta, Danger, Hook, Label, Two } from "./Motion";

// "Muddati o‘tgan sirop" — one lab take, pauses cut, punch-zooms on the jump cuts,
// pharmacy-themed motion cards below the chin, house captions (hidden while a card is up). No colour grade.
const F = (p: string) => staticFile(`v13/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type R = { from: number; to: number };
const d = (r: R) => r.to - r.from;
const CAP_TOP = 1000; // chin ≈ 850, max 905
const ANCHOR = "584px 600px"; // forehead, so the chin barely moves when zooming
const SCALES = [1.0, 1.08, 1.0, 1.06, 1.0, 1.07, 1.0, 1.05, 1.0, 1.07, 1.0];

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  let i = CLIPS.findIndex(([a, b, o]) => f >= o && f < o + (b - a));
  if (i < 0) i = CLIPS.length - 1;
  const [a, b, o] = CLIPS[i];
  const whip = i === 0 ? interpolate(f, [0, 10], [0.3, 0], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const s = interpolate(f, [o, o + (b - a)], [SCALES[i], SCALES[i] + 0.03], clamp) + whip;
  const blur = interpolate(f, [0, 8], [8, 0], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: ANCHOR, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
};

const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const c = CLIPS.map(([, , o]) => o).filter((x) => x > 0).find((x) => f >= x && f < x + 3);
  if (c === undefined) return null;
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f - c, [0, 3], [0.14, 0]) }} />;
};

const S: React.FC<{ name: string; r: R; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={d(r)}>
    {children}
  </Sequence>
);

const HIDE: [number, number][] = Object.values(M).map((r) => [r.from, r.to] as [number, number]);
const CLICK = 70;

const SFX: [number, string, number][] = [
  [0, "bass.wav", 0.7],
  [0, "rm-whoosh.wav", 0.5],
  [4, "buzz.wav", 0.25],
  [14, "pop.wav", 0.35],
  [M.two.from, "rm-whoosh.wav", 0.4],
  [M.two.from + 14, "tick.wav", 0.5],
  [M.two.from + 24, "tick.wav", 0.5],
  [M.bars.from, "rm-whoosh.wav", 0.4],
  [M.bars.from + BARS_B, "pop.wav", 0.4],
  [M.air.from + 4, "pop.wav", 0.4],
  [M.air.from + AIR_METER, "riser.wav", 0.25],
  [M.label.from, "rm-page-turn.wav", 0.45],
  [M.label.from + 66, "rm-ding.wav", 0.3],
  [M.danger.from, "bass.wav", 0.55],
  [M.danger.from, "buzz.wav", 0.25],
  [M.cta.from, "rm-whoosh.wav", 0.4],
  [M.cta.from + CLICK, "rm-mouse-click.wav", 0.6],
  [M.cta.from + CLICK + 4, "rm-whip.wav", 0.3],
];

export const Sirop: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [DURATION - 8, DURATION], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        {CLIPS.map(([a, b, o], i) => (
          <Video key={i} name={`Clip ${i + 1}`} src={F("raw.mp4")} muted trimBefore={a} from={o} durationInFrames={b - a} />
        ))}
      </Camera>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 48%, rgba(0,0,0,0.3) 62%, rgba(0,0,0,0.16) 100%)" }} />

      <StyleCaptions phrases={PHRASES} top={CAP_TOP} hide={HIDE} />

      <S name="HOOK: Sirop xavflimi?" r={M.hook}><Hook dur={d(M.hook)} /></S>
      <S name="2 xil muddat" r={M.two}><Two dur={d(M.two)} /></S>
      <S name="Yopiq vs ochiq" r={M.bars}><Bars dur={d(M.bars)} bAt={BARS_B} /></S>
      <S name="Havo → kuch tushadi" r={M.air}><Air dur={d(M.air)} meterAt={AIR_METER} /></S>
      <S name="Sanani yozing" r={M.label}><Label dur={d(M.label)} /></S>
      <S name="Zaharlanish xavfi" r={M.danger}><Danger dur={d(M.danger)} /></S>
      <S name="CTA: jo‘nating" r={M.cta}><Cta dur={d(M.cta)} clickAt={CLICK} /></S>
      <CutFlash />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fadeOut }} />

      {CLIPS.map(([a, b, o], i) => (
        <Audio key={i} name={`Voice ${i + 1}`} src={F("voice.wav")} trimBefore={a} from={o} durationInFrames={b - a} />
      ))}
      <Audio name="Music: Freedom (instrumental)" src={F("music.wav")} volume={(x) => (x < M.hook.to ? 1.4 : x >= M.cta.from ? 1.3 : 1)} />
      {SFX.map(([fr, file, v], i) => (
        <Sequence key={i} from={fr} durationInFrames={50} name={`sfx ${file}`}>
          <Audio src={staticFile(`sfx/${file}`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const SIROP_DURATION = DURATION;
