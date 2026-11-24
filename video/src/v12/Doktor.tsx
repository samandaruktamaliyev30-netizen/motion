import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { StyleCaptions } from "../shared/StyleCaptions";
import { CLIPS, DURATION, LADDER_AT, M, PHRASES } from "./data";
import { ClipTag, FilmCard, Hook, Ladder, Subscribe, Xulosa } from "./Motion";

// "Yaxshi doktor bo‘lish uchun qayerda o‘qish kerak?"
// question shot (stretcher) under the question → speaker → film clip from the reference (with its sound)
// → speaker's conclusion → university drone shot + subscribe. No colour grade.
const F = (p: string) => staticFile(`v12/${p}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type R = { from: number; to: number };
const d = (r: R) => r.to - r.from;
// Captions are fixed below the chin (chin ≈ 910 px, max ≈ 990 with zoom).
const CAP_TOP = 1040;
// zoom anchored on the forehead so the chin barely moves
const ANCHOR = "535px 640px";
const SCALES = [1.0, 1.0, 1.06, 1.0, 1.0, 1.07, 1.0, 1.0, 1.06, 1.0];

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  let i = CLIPS.findIndex(([a, b, o]) => f >= o && f < o + (b - a));
  if (i < 0) i = 0;
  const [a, b, o] = CLIPS[i];
  const s = interpolate(f, [o, o + (b - a)], [SCALES[i], SCALES[i] + 0.025], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: ANCHOR }}>{children}</AbsoluteFill>;
};

// film clip enters as a "screen" that grows to full frame, leaves with a white flash
const MovieLayer: React.FC = () => {
  const f = useCurrentFrame();
  const len = d(M.movie);
  const g = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const flash = interpolate(f, [len - 3, len], [0, 0.7], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${0.86 + g * 0.2}) rotate(${(1 - g) * -3}deg)`, borderRadius: (1 - g) * 60, overflow: "hidden", filter: `blur(${(1 - g) * 6}px)` }}>
        <Video src={F("movie.mp4")} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

const DroneLayer: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, d(M.drone)], [1.08, 1.0], clamp);
  const flash = interpolate(f, [0, 6], [0.7, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <Video src={F("drone.mp4")} muted playbackRate={0.8} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

// whip-zoom into the question shot and a short flash when the speaker first appears
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [M.hook.to, M.hook.to + 5], [0.5, 0], clamp);
  if (f < M.hook.to || f > M.hook.to + 5) return null;
  return <AbsoluteFill style={{ background: "white", opacity: o }} />;
};

const S: React.FC<{ name: string; r: R; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={d(r)}>
    {children}
  </Sequence>
);

const HIDE: [number, number][] = [M.hook, M.film, M.movie, M.xulosa, M.ladder, M.drone].map((r) => [r.from, r.to]);
const CLICK = 52;

const SFX: [number, string, number][] = [
  [0, "bass.wav", 0.6],
  [0, "rm-whoosh.wav", 0.4],
  [24, "pop.wav", 0.35],
  [M.film.from + 12, "rm-shutter-modern.wav", 0.45],
  [M.movie.from, "rm-whoosh.wav", 0.4],
  [M.movie.to - 3, "rm-whip.wav", 0.35],
  [M.xulosa.from, "bass.wav", 0.4],
  ...LADDER_AT.map((x) => [M.ladder.from + x, "pop.wav", 0.35] as [number, string, number]),
  [M.drone.from, "rm-whoosh.wav", 0.4],
  [M.drone.from + CLICK, "rm-mouse-click.wav", 0.6],
  [M.drone.from + CLICK + 3, "rm-ding.wav", 0.3],
];

const musicVol = (f: number) => {
  const inMovie = interpolate(f, [M.movie.from - 6, M.movie.from + 6, M.movie.to - 6, M.movie.to + 6], [1, 0.28, 0.28, 1], clamp);
  const end = interpolate(f, [M.drone.from - 4, M.drone.from + 4], [1, 1.9], clamp);
  const hook = f < M.hook.to ? 1.4 : 1;
  return (f < M.movie.to ? inMovie * hook : 1) * end;
};

export const Doktor: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [DURATION - 8, DURATION], [0, 1], clamp);
  const qz = interpolate(f, [0, 10], [1.25, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) }) + interpolate(f, [10, M.hook.to], [0, 0.04], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        {CLIPS.slice(1).map(([a, b, o], i) => (
          <Video key={i} name={`Main ${i + 2}`} src={F("raw.mp4")} muted trimBefore={a} from={o} durationInFrames={b - a} />
        ))}
      </Camera>
      <Sequence name="Savol kadri (stretcher)" from={0} durationInFrames={M.hook.to}>
        <AbsoluteFill style={{ transform: `scale(${qz})` }}>
          <Video src={F("question.mp4")} muted />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.28) 66%, rgba(0,0,0,0.12) 100%)" }} />

      <StyleCaptions phrases={PHRASES} top={CAP_TOP} hide={HIDE} />

      <S name="HOOK" r={M.hook}><Hook dur={d(M.hook)} /></S>
      <S name="Film kartochka" r={M.film}><FilmCard dur={d(M.film)} /></S>
      <S name="Kino parcha (referensdan)" r={M.movie}>
        <MovieLayer />
        <Sequence from={8} durationInFrames={80}><ClipTag dur={80} /></Sequence>
      </S>
      <S name="Xulosa" r={M.xulosa}><Xulosa dur={d(M.xulosa)} /></S>
      <S name="Zinapoya" r={M.ladder}><Ladder dur={d(M.ladder)} at={LADDER_AT} /></S>
      <S name="Universitet (dron)" r={M.drone}>
        <DroneLayer />
        <Subscribe dur={d(M.drone)} clickAt={CLICK} />
      </S>
      <CutFlash />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fadeOut }} />

      {CLIPS.map(([a, b, o], i) => (
        <Audio key={i} name={`Voice ${i + 1}`} src={F("voice.wav")} trimBefore={a} from={o} durationInFrames={b - a} />
      ))}
      <Sequence name="Kino ovozi" from={M.movie.from} durationInFrames={d(M.movie)}>
        <Audio src={F("movie.wav")} volume={(x) => interpolate(x, [0, 4, d(M.movie) - 6, d(M.movie)], [0, 1, 1, 0], clamp)} />
      </Sequence>
      <Audio name="Music: ICEGERGERT" src={F("music.wav")} volume={musicVol} />
      {SFX.map(([fr, file, v], i) => (
        <Sequence key={i} from={fr} durationInFrames={50} name={`sfx ${file}`}>
          <Audio src={staticFile(`sfx/${file}`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const DOKTOR_DURATION = DURATION;
