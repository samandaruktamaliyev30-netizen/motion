import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { BROLL, DURATION, FACE, HIT, LOW, M, MUSIC_VOL, SHOTS, SFX } from "./timeline";
import { PHRASES } from "./captions";
import { StyleCaptions } from "../shared/StyleCaptions";
import { BudgetHook, Contract, Cta, Gift360, HookFlash, Team } from "./Motion";

const F = (p: string) => staticFile(`v8/${p}`);
const GRADE = "contrast(1.07) saturate(1.1) brightness(1.02)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type R = { from: number; to: number };
const d = (r: R) => r.to - r.from;

/** Speaker camera: per-shot slow push + short "punch" kicks on accent words. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  let s = interpolate(f, [a, b], [s0, s1], clamp);
  for (const h of HIT) s += interpolate(f, [h, h + 2, h + 10], [0, 0.07, 0], clamp);
  const shake = HIT.some((h) => f >= h && f < h + 6) ? Math.sin(f * 2.7) * 6 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px) scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: GRADE }}>
      {children}
    </AbsoluteFill>
  );
};

const BRoll: React.FC<{ src: string; dur: number; trim?: number; zoom?: [number, number]; rate?: number }> = ({ src, dur, trim = 0, zoom = [1.04, 1.14], rate = 1 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom);
  // quick zoom-blur entrance
  const kick = interpolate(f, [0, 6], [1.12, 1], { ...clamp });
  const blur = interpolate(f, [0, 5], [10, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${s * kick})`, filter: `${GRADE} blur(${blur}px)` }}>
      <Video src={src} muted trimBefore={trim} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

const S: React.FC<{ name: string; r: R; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={d(r)}>
    {children}
  </Sequence>
);

const HIDE: [number, number][] = Object.values(M).map((r) => [r.from, r.to] as [number, number]);

export const Interyer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Kadr (6.mp4)" src={F("raw.mp4")} muted style={{ width: "100%", height: "100%" }} />
    </Camera>

    {BROLL.map((b) => (
      <S key={b.name} name={b.name} r={b}>
        <BRoll src={F(b.src)} dur={d(b)} trim={b.trim} rate={b.rate} />
      </S>
    ))}

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(0,0,0,0.36) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.28) 58%, rgba(0,0,0,0.1) 100%)" }} />

    <StyleCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="Hook flash" r={{ from: 0, to: 8 }}><HookFlash /></S>
    <S name="Hook: byudjet" r={M.hook}><BudgetHook dur={d(M.hook)} /></S>
    <S name="Jamoa / dizayn + remont" r={M.team}><Team dur={d(M.team)} /></S>
    <S name="Shartnoma + smeta" r={M.contract}><Contract dur={d(M.contract)} /></S>
    <S name="3D + 360 sovg‘a" r={M.gift}><Gift360 dur={d(M.gift)} /></S>
    <S name="CTA" r={M.cta}><Cta dur={d(M.cta)} /></S>

    <Audio name="Voice (tozalangan)" src={F("voice.wav")} />
    {SFX.map(([at, file, vol], i) => (
      <Sequence key={i} name={`sfx ${file}`} from={at} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${file}`)} volume={vol} />
      </Sequence>
    ))}
    <Audio name="Music: referens (r3) instrumental" src={F("music.wav")} volume={(f) => MUSIC_VOL(f)} />
  </AbsoluteFill>
);

export const INTERYER_DURATION = DURATION;
