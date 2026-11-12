import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { DURATION, FACE, SHOTS } from "./timeline";
import { Captions } from "./Captions";
import { Graphics } from "./Graphics";
import { C } from "./ui";

const RAW = staticFile("raw.mp4");
const VOICE = staticFile("voice.wav");

// Zoom anchored on the expert's face; hard punch-ins on cuts, slow push within a shot.
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${s})`,
        transformOrigin: `${FACE.cx}px ${FACE.cy}px`,
        filter: "contrast(1.07) saturate(1.12) brightness(1.03)",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Short white flash on every cut for a snappy feel.
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const cut = SHOTS.map(([a]) => a).filter((a) => a > 0).find((a) => f >= a && f < a + 4);
  if (cut === undefined) return null;
  const o = interpolate(f - cut, [0, 4], [0.28, 0]);
  return <AbsoluteFill style={{ background: "white", opacity: o }} />;
};

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(f / DURATION) * 100}%`, background: `linear-gradient(90deg, ${C.yellow}, ${C.blue})` }} />
  );
};

const SFX: [number, string, number][] = [
  [2, "rm-ding.wav", 0.55],
  [44, "rm-whoosh.wav", 0.6],
  [52, "pop.wav", 0.5],
  [60, "pop.wav", 0.5],
  [126, "rm-whoosh.wav", 0.6],
  [184, "pop.wav", 0.5],
  [238, "rm-switch.wav", 0.6],
  [251, "rm-switch.wav", 0.6],
  [293, "rm-whoosh.wav", 0.6],
  [340, "pop.wav", 0.5],
  [376, "bass.wav", 0.6],
  [410, "rm-whip.wav", 0.6],
  [429, "bass.wav", 0.5],
  [438, "rm-whoosh.wav", 0.6],
  [480, "rm-switch.wav", 0.6],
  [537, "pop.wav", 0.55],
  [574, "rm-whoosh.wav", 0.6],
  [620, "rm-mouse-click.wav", 0.6],
  [694, "rm-mouse-click.wav", 0.6],
  [715, "rm-whoosh.wav", 0.6],
  [766, "rm-page-turn.wav", 0.6],
  [792, "rm-shutter-modern.wav", 0.7],
  [792, "bass.wav", 0.6],
  [875, "bass.wav", 0.5],
  [902, "pop.wav", 0.5],
  [983, "pop.wav", 0.55],
  [1002, "pop.wav", 0.55],
  [1022, "rm-whoosh.wav", 0.6],
  [1097, "rm-whip.wav", 0.6],
  [1119, "rm-whoosh.wav", 0.6],
  [1138, "rm-mouse-click.wav", 0.8],
  [1149, "rm-ding.wav", 0.45],
];

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        {/* Kept parts of the take (pauses removed). */}
        <Video name="Clip 1 hook" src={RAW} muted trimBefore={0} from={0} durationInFrames={126} />
        <Video name="Clip 2" src={RAW} muted trimBefore={141} from={126} durationInFrames={448} />
        <Video name="Clip 3" src={RAW} muted trimBefore={599} from={574} durationInFrames={50} />
        <Video name="Clip 4" src={RAW} muted trimBefore={658} from={624} durationInFrames={198} />
        <Video name="Clip 5" src={RAW} muted trimBefore={866} from={822} durationInFrames={297} />
        <Video name="Clip 6 outro" src={RAW} muted trimBefore={1176} from={1119} durationInFrames={63} />
      </Camera>

      {/* Soft vignette keeps attention on the face. */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 50%, rgba(0,0,0,0.38) 100%)" }} />
      {/* Darken the caption area slightly for readability. */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 18%, transparent 56%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.15) 100%)" }} />

      <Graphics />
      <Captions />
      <CutFlash />
      <ProgressBar />

      {/* Cleaned voice (same cuts as the picture). */}
      <Audio name="Voice 1" src={VOICE} trimBefore={0} from={0} durationInFrames={126} />
      <Audio name="Voice 2" src={VOICE} trimBefore={141} from={126} durationInFrames={448} />
      <Audio name="Voice 3" src={VOICE} trimBefore={599} from={574} durationInFrames={50} />
      <Audio name="Voice 4" src={VOICE} trimBefore={658} from={624} durationInFrames={198} />
      <Audio name="Voice 5" src={VOICE} trimBefore={866} from={822} durationInFrames={297} />
      <Audio name="Voice 6" src={VOICE} trimBefore={1176} from={1119} durationInFrames={63} />

      <Audio name="Music" src={staticFile("music.wav")} volume={0.9} />
      {SFX.map(([f, file, v], i) => (
        <Sequence key={i} from={f} durationInFrames={45} name={`sfx ${file}`}>
          <Audio src={staticFile(`sfx/${file}`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
