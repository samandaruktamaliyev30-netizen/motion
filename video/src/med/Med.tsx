import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { BOARD1, BOARD2, DURATION, FACE, SHOTS } from "./timeline";
import { Title } from "./Title";
import { BoardPH, BoardSchool } from "./Board";
import { Graphics } from "./Graphics";
import { Captions } from "./Captions";
import { M } from "./ui";

const RAW = staticFile("med/raw.mp4");
const VOICE = staticFile("med/voice.wav");

// Face-anchored zoom (colour from the very first frame).
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${s})`,
        transformOrigin: `${FACE.cx}px ${FACE.cy}px`,
        filter: "brightness(1.02) contrast(1.08) saturate(1.1)",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = SHOTS.map(([a]) => a).filter((a) => a > 0);
  const c = cuts.find((a) => f >= a && f < a + 4);
  if (c === undefined) return null;
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f - c, [0, 4], [0.18, 0]) }} />;
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, height: 9, width: `${(f / DURATION) * 100}%`, background: `linear-gradient(90deg, ${M.mint}, ${M.sky})` }} />;
};


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

      <Audio name="Music: my head is empty (slowed)" src={staticFile("med/music.wav")} volume={1.3} />
    </AbsoluteFill>
  );
};
