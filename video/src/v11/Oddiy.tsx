import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { StyleCaptions } from "../shared/StyleCaptions";
import { CLIPS, DURATION, PHRASES } from "./data";

// Simple edit: only pauses removed (meaning kept), original colours (no grade),
// gentle framing change on each cut,
// house subtitles below the chin, quiet LoVibe underneath.
const F = (p: string) => staticFile(`v11/${p}`);
// Face (YuNet): x≈465, forehead≈464, chin≈1070 → zoom anchored on the forehead; each subtitle is
// placed below the lowest chin position measured during its phrase (min 1170).
const ANCHOR = { x: 465, y: 464 };
const SCALES = [1.0, 1.05, 1.0, 1.05, 1.0];

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  let i = CLIPS.findIndex(([sa, sb, o]) => f >= o && f < o + (sb - sa));
  if (i < 0) i = CLIPS.length - 1;
  const [sa, sb, o] = CLIPS[i];
  const s = interpolate(f, [o, o + (sb - sa)], [SCALES[i], SCALES[i] + 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${ANCHOR.x}px ${ANCHOR.y}px` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Oddiy: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [DURATION - 10, DURATION], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        {CLIPS.map(([sa, sb, o], i) => (
          <Video key={i} name={`Kadr ${i + 1}`} src={F("main.mp4")} muted trimBefore={sa} from={o} durationInFrames={sb - sa} />
        ))}
      </Camera>
      {/* each phrase sits below the speaker's lowest chin position during that phrase */}
      {PHRASES.map((p, i) => (
        <StyleCaptions key={i} phrases={[p]} top={p.top} />
      ))}
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fade }} />
      {CLIPS.map(([sa, sb, o], i) => (
        <Audio key={i} name={`Ovoz ${i + 1}`} src={F("voice.wav")} trimBefore={sa} from={o} durationInFrames={sb - sa} />
      ))}
      <Audio name="Music: LoVibe (quiet)" src={F("music.wav")} volume={0.85} />
    </AbsoluteFill>
  );
};
