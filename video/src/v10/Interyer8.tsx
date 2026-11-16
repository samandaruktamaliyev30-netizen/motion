import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { BROLL, DURATION, FACE, LOW, M, MUSIC_VOL, SCENE, SFX, SHOTS } from "./timeline";
import { PHRASES } from "./captions";
import { StyleCaptions } from "../shared/StyleCaptions";
import { BlueprintScene } from "./Scene";
import { Adc, Contract, Cta, Gift, Hook, Stats } from "./Motion";

const F = (p: string) => staticFile(`v10/${p}`);
// neutral grade — no extra saturation (skin was getting too red)
const GRADE = "contrast(1.05) saturate(0.97) brightness(1.02)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type R = { from: number; to: number };
const d = (r: R) => r.to - r.from;

/** Smooth slow push per shot — no punch-ins / shakes in this edit. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: GRADE }}>{children}</AbsoluteFill>;
};

/** B-roll enters with a horizontal whip-slide (motion blur), not a flash. */
const BRoll: React.FC<{ src: string; dur: number; trim: number; rate: number }> = ({ src, dur, trim, rate }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 7], [1080, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(f, [0, 7], [14, 0], clamp);
  const s = interpolate(f, [0, dur], [1.03, 1.1]);
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${s})`, filter: `${GRADE} blur(${blur}px)` }}>
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

export const Interyer8: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Kadr (8.mp4, yuz tozalangan)" src={F("raw.mp4")} muted style={{ width: "100%", height: "100%" }} />
    </Camera>

    {BROLL.map((b) => (
      <S key={b.name} name={b.name} r={b}>
        <BRoll src={F(b.src)} dur={d(b)} trim={b.trim} rate={b.rate} />
      </S>
    ))}

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, transparent 55%, rgba(0,0,0,0.32) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)" }} />

    <S name="Ovozcha: blueprint motion-sahna" r={SCENE}><BlueprintScene dur={d(SCENE)} /></S>

    <StyleCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="Hook: arzonmi?" r={M.hook}><Hook dur={d(M.hook)} /></S>
    <S name="A.D.C (shisha ramka)" r={M.adc}><Adc dur={d(M.adc)} /></S>
    <S name="Shartnoma" r={M.contract}><Contract dur={d(M.contract)} /></S>
    <S name="7 yil / ~400 loyiha" r={M.stats}><Stats dur={d(M.stats)} /></S>
    <S name="Vizual qism sovg‘a" r={M.gift}><Gift dur={d(M.gift)} /></S>
    <S name="CTA forma" r={M.cta}><Cta dur={d(M.cta)} /></S>

    <Audio name="Voice (tekislangan)" src={F("voice.wav")} />
    {SFX.map(([at, file, vol], i) => (
      <Sequence key={i} name={`sfx ${file}`} from={at} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${file}`)} volume={vol} />
      </Sequence>
    ))}
    <Audio name="Music: Metro Boomin – Superhero (drop @ A.D.C)" src={F("music.wav")} volume={(f) => MUSIC_VOL(f)} />
  </AbsoluteFill>
);

export const INTERYER8_DURATION = DURATION;
