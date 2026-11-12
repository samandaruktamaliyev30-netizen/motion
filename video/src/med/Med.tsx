import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { at, BOARD1, BOARD2, DURATION, FACE, SHOTS, TITLE_END } from "./timeline";
import { Title } from "./Title";
import { BoardPH, BoardSchool } from "./Board";
import { Graphics } from "./Graphics";
import { Captions } from "./Captions";
import { M } from "./ui";

const RAW = staticFile("med/raw.mp4");
const VOICE = staticFile("med/voice.wav");

// Face-anchored zoom; black & white during the title, colour returns at 3 s.
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gray = interpolate(f, [TITLE_END - 6, TITLE_END + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dim = interpolate(f, [TITLE_END - 6, TITLE_END + 2], [0.72, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${s})`,
        transformOrigin: `${FACE.cx}px ${FACE.cy}px`,
        filter: `grayscale(${gray}) brightness(${dim}) contrast(1.08) saturate(1.1)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [TITLE_END, ...SHOTS.map(([a]) => a).filter((a) => a > TITLE_END)];
  const c = cuts.find((a) => f >= a && f < a + 4);
  if (c === undefined) return null;
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f - c, [0, 4], [c === TITLE_END ? 0.6 : 0.22, 0]) }} />;
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, height: 9, width: `${(f / DURATION) * 100}%`, background: `linear-gradient(90deg, ${M.mint}, ${M.sky})` }} />;
};

const SFX: [number, string, number][] = [
  [0, "bass.wav", 0.7],
  [0, "rm-whoosh.wav", 0.6],
  [4, "rm-whip.wav", 0.5],
  [20, "rm-switch.wav", 0.5],
  [TITLE_END - 4, "riser.wav", 0.5],
  [TITLE_END, "rm-shutter-modern.wav", 0.6],
  [at(4.64), "rm-whoosh.wav", 0.5],
  [at(4.64) + 6, "pop.wav", 0.5],
  [at(4.64) + 12, "pop.wav", 0.5],
  [at(4.64) + 18, "pop.wav", 0.5],
  [at(6.1), "rm-whoosh.wav", 0.55],
  [BOARD1.from, "rm-page-turn.wav", 0.7],
  [BOARD1.from + 4, "pop.wav", 0.4],
  [BOARD1.from + 12, "pop.wav", 0.4],
  [BOARD1.from + 34, "rm-switch.wav", 0.5],
  [at(14.14), "rm-whoosh.wav", 0.55],
  [at(17.24), "pop.wav", 0.55],
  [at(20.98), "pop.wav", 0.55],
  [at(24.68), "rm-whoosh.wav", 0.55],
  [at(28.7), "pop.wav", 0.5],
  [BOARD2.from, "rm-page-turn.wav", 0.7],
  [BOARD2.from + 26, "rm-switch.wav", 0.5],
  [BOARD2.to, "rm-whoosh.wav", 0.5],
  [at(37.38), "rm-mouse-click.wav", 0.6],
  [at(39.96), "rm-mouse-click.wav", 0.6],
  [at(42.26), "rm-whoosh.wav", 0.55],
  [at(46.48), "rm-whoosh.wav", 0.5],
  [at(47.2), "pop.wav", 0.5],
  [at(48.86), "pop.wav", 0.5],
  [at(49.8), "rm-whoosh.wav", 0.55],
  [at(52.74), "rm-whip.wav", 0.6],
  [at(53.3), "rm-whoosh.wav", 0.55],
  [at(54.4), "rm-mouse-click.wav", 0.8],
  [at(54.4) + 4, "rm-ding.wav", 0.4],
];

export const Med: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        <Video name="Clip 1" src={RAW} muted trimBefore={0} from={0} durationInFrames={343} />
        <Video name="Clip 2" src={RAW} muted trimBefore={352} from={343} durationInFrames={321} />
        <Video name="Clip 3" src={RAW} muted trimBefore={685} from={664} durationInFrames={459} />
        <Video name="Clip 4" src={RAW} muted trimBefore={1152} from={1123} durationInFrames={28} />
        <Video name="Clip 5" src={RAW} muted trimBefore={1189} from={1151} durationInFrames={125} />
        <Video name="Clip 6" src={RAW} muted trimBefore={1320} from={1276} durationInFrames={133} />
        <Video name="Clip 7" src={RAW} muted trimBefore={1462} from={1409} durationInFrames={188} />
      </Camera>

      {/* vignette + readability gradients */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 48%, rgba(0,0,0,0.42) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 50%, rgba(0,0,0,0.38) 66%, rgba(0,0,0,0.1) 100%)" }} />

      <Graphics />

      <Sequence name="Board: Maktab ≠ Institut" from={BOARD1.from} durationInFrames={BOARD1.to - BOARD1.from}>
        <BoardSchool dur={BOARD1.to - BOARD1.from} />
      </Sequence>
      <Sequence name="Board: pH" from={BOARD2.from} durationInFrames={BOARD2.to - BOARD2.from}>
        <BoardPH dur={BOARD2.to - BOARD2.from} />
      </Sequence>

      <Captions />
      <Title />
      <CutFlash />
      <Progress />

      <Audio name="Voice 1" src={VOICE} trimBefore={0} from={0} durationInFrames={343} />
      <Audio name="Voice 2" src={VOICE} trimBefore={352} from={343} durationInFrames={321} />
      <Audio name="Voice 3" src={VOICE} trimBefore={685} from={664} durationInFrames={459} />
      <Audio name="Voice 4" src={VOICE} trimBefore={1152} from={1123} durationInFrames={28} />
      <Audio name="Voice 5" src={VOICE} trimBefore={1189} from={1151} durationInFrames={125} />
      <Audio name="Voice 6" src={VOICE} trimBefore={1320} from={1276} durationInFrames={133} />
      <Audio name="Voice 7" src={VOICE} trimBefore={1462} from={1409} durationInFrames={188} />

      <Audio name="Music: my head is empty (slowed)" src={staticFile("med/music.wav")} volume={1.15} />
      {SFX.map(([f, file, v], i) => (
        <Sequence key={i} from={f} durationInFrames={45} name={`sfx ${file}`}>
          <Audio src={staticFile(`sfx/${file}`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
