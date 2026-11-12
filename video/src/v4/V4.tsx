import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { DURATION, FACE, G, SHOTS } from "./timeline";
import { Sms } from "./Sms";
import { Captions } from "./Captions";
import { AB, Chart, Checklist, Outro, Rizq, Summary } from "./Graphics";

// Face-anchored punch-in that changes on every jump cut, with a slow push inside each shot.
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  const sc = interpolate(f, [a, b], [s0, s1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${sc})`,
        transformOrigin: `${FACE.cx}px ${FACE.cy}px`,
        // Reference grade: a touch darker, more contrast, slightly cool.
        filter: "brightness(0.93) contrast(1.1) saturate(0.95) hue-rotate(-4deg)",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const seq = (name: string, [from, to]: readonly [number, number], El: React.FC<{ dur: number }>) => (
  <Sequence name={name} from={from} durationInFrames={to - from}>
    <El dur={to - from} />
  </Sequence>
);

export const V4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Cut (pauses & repeats removed)" src={staticFile("v4/cut.mp4")} muted />
    </Camera>

    {/* vignette + lower shade so white type reads on the bright striped shirt */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 50%, rgba(0,0,0,0.45) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 20%, transparent 56%, rgba(0,0,0,0.5) 76%, rgba(0,0,0,0.62) 100%)" }} />

    <Captions />

    {seq("SMS savol", G.sms, Sms)}
    {seq("Checklist", G.checklist, Checklist)}
    {seq("Rizq Allohdan", G.rizq, Rizq)}
    {seq("3–4x chart", G.chart, Chart)}
    {seq("A → B", G.ab, AB)}
    {seq("Summary", G.summary, Summary)}
    {seq("Outro", G.outro, Outro)}

    <Audio name="Voice (cleaned)" src={staticFile("v4/voice.wav")} />
    <Audio name="Music: LoVibe" src={staticFile("v4/music.wav")} />
  </AbsoluteFill>
);

export { DURATION };
