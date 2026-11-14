import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { noise2D } from "@remotion/noise";
import { Instagram } from "lucide-react";
import { beatPulse, DROP, DURATION, SCENES, SceneId } from "./timeline";
import { Background } from "./Background";
import { Headline } from "./Headline";
import { clamp, INTER } from "./kit";
import { Aksincha, Blame, Cause, Miracle, NoResult, Spend } from "./Scenes1";
import { Funnel, Industries, NoBuy, PathScene, Question, Sales, Secrets, Steps, Strategy, Subscribe } from "./Scenes2";

const MAP: Record<SceneId, React.FC> = {
  spend: Spend,
  noresult: NoResult,
  blame: Blame,
  cause: Cause,
  miracle: Miracle,
  aksincha: Aksincha,
  steps: Steps,
  strategy: Strategy,
  funnel: Funnel,
  question: Question,
  industries: Industries,
  nobuy: NoBuy,
  sales: Sales,
  path: PathScene,
  subscribe: Subscribe,
  secrets: Secrets,
};

// Scene in/out: zoom-through with blur so every change reads as a camera move.
const SceneWrap: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const f = useCurrentFrame();
  const inn = first ? 1 : interpolate(f, [0, 8], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const out = last ? 0 : interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inn, 1 - out),
        transform: `scale(${(0.88 + 0.12 * inn) * (1 + out * 0.18)})`,
        filter: `blur(${(1 - inn) * 14 + out * 12}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Handheld-style camera drift + beat punch over the whole graphic layer.
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const b = beatPulse(f);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${noise2D("cx", t * 0.25, 0) * 10}px, ${noise2D("cy", 0, t * 0.25) * 12}px) rotate(${noise2D("cr", t * 0.2, 1) * 0.6}deg) scale(${1 + b * 0.012})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Full-frame white flash on the music drop ("AKSINCHA").
const DropFlash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [DROP, DROP + 7], [0.85, 0], clamp);
  return f >= DROP && o > 0 ? <AbsoluteFill style={{ background: "white", opacity: o }} /> : null;
};

// Author watermark (anti-reupload): stays on screen for the whole video, low in the frame.
const Handle: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        top: 1655,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px 12px 18px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.38)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        fontFamily: INTER,
        fontSize: 34,
        fontWeight: 600,
        color: "rgba(255,255,255,0.88)",
        letterSpacing: 0.2,
        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      <Instagram size={36} color="rgba(255,255,255,0.9)" strokeWidth={2.2} />
      @samandar_uktamal1yev
    </div>
  </AbsoluteFill>
);

export const Ov: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Background />
    <Camera>
      {SCENES.map(([id, a, b], i) => {
        const El = MAP[id];
        return (
          <Sequence key={id} name={`Scene: ${id}`} from={a} durationInFrames={b - a}>
            <SceneWrap dur={b - a} first={i === 0 || id === "aksincha"} last={i === SCENES.length - 1}>
              <El />
            </SceneWrap>
          </Sequence>
        );
      })}
      <Headline />
    </Camera>
    <DropFlash />
    <Handle />
    <Audio name="Voice-over (cleaned)" src={staticFile("ov/voice.wav")} />
    <Audio name="Music: EsDeeKid – Mist (from 10 s, drop on AKSINCHA)" src={staticFile("ov/music.wav")} />
  </AbsoluteFill>
);

export { DURATION };
