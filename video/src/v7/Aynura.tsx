import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { at, CLIPS, DURATION, FACE, LOW, M, PICS, SHOTS, SPEECH_END } from "./timeline";
import { PHRASES } from "./captions";
import { RefCaptions } from "./RefCaptions";
import { Card, Chips, Fail, Goal, Order, Phone, Photo, Subscribe, Tired } from "./Motion";

const RAW = staticFile("v7/clean.mp4");
const VOICE = staticFile("v7/voice.wav");
const GRADE = "contrast(1.12) saturate(0.95) brightness(0.97)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Punch-in camera; a short zoom "bump" on every jump so cuts feel like the reference edits.
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b);
  let s = 1.03;
  let whip = 0;
  let dir = 1;
  if (shot) {
    const [a, b, s0, s1] = shot;
    whip = interpolate(f, [a, a + 6], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    dir = SHOTS.indexOf(shot) % 2 ? 1 : -1;
    s = interpolate(f, [a, b], [s0, s1], clamp) + whip * 0.06;
  }
  // whip-zoom on every cut: short vertical slide + motion blur (reference-style)
  return (
    <AbsoluteFill style={{ transform: `translateY(${whip * 45 * dir}px) scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: `${GRADE} blur(${whip * 7}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

// Film grain + soft light leak breathing on the edge (cinematic look of the reference).
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const x = ((f * 137) % 200) - 100;
  const y = ((f * 71) % 200) - 100;
  return (
    <>
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.16, transform: `translate(${x}px, ${y}px) scale(1.25)` }}>
        <Img src={staticFile("v7/grain.png")} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${85 + 10 * Math.sin(f * 0.02)}% 15%, rgba(190,120,255,${0.12 + 0.06 * Math.sin(f * 0.05)}), transparent 45%)`, mixBlendMode: "screen" }} />
    </>
  );
};

const S: React.FC<{ name: string; r: { from: number; to: number }; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={r.to - r.from}>
    {children}
  </Sequence>
);
const d = (r: { from: number; to: number }) => r.to - r.from;

const HIDE: [number, number][] = Object.values(M).map((r) => [r.from, r.to] as [number, number]);

// SFX on every picture cut / motion insert.
const SFX: [string, number, number][] = [
  ["rm-whoosh", PICS.phone.from - 3, 0.35],
  ["rm-whoosh", PICS.energy1.from - 3, 0.35],
  ["whoosh", PICS.tired1.from - 2, 0.25],
  ["rm-whoosh", PICS.tired2.from - 3, 0.3],
  ["rm-whoosh", PICS.energy2.from - 3, 0.35],
  ["bass", M.fail.from + 9, 0.5],
  ["rm-whoosh", M.why.from - 2, 0.4],
  ["bass", M.why.from + 4, 0.45],
  ["rm-whoosh", M.first.from - 2, 0.4],
  ["bass", M.first.from + 4, 0.4],
  ["pop", M.steps.from + 2, 0.4],
  ["pop", M.steps.from + 18, 0.4],
  ["rm-whip", M.goal.from + 12, 0.4],
  ["ding", M.goal.from + 24, 0.35],
  ["pop", M.order.from + 11, 0.35],
  ["rm-mouse-click", M.telegram.from + 30, 0.7],
  ["pop", M.telegram.from + 42, 0.35],
  ["rm-mouse-click", M.subscribe.from + 26, 0.7],
];

export const Aynura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      {CLIPS.map((c, i) => (
        <Video key={i} name={`Clip ${i + 1}`} src={RAW} muted trimBefore={c.srcStart} from={c.out} durationInFrames={c.srcEnd - c.srcStart} />
      ))}
      <Sequence name="Freeze (oxiri)" from={SPEECH_END}>
        <Img src={staticFile("v7/last.png")} style={{ width: "100%", height: "100%" }} />
      </Sequence>
    </Camera>

    <S name="Rasm: to‘y (erga tegish)" r={PICS.wedding}><Photo src="v7/wedding.jpg" dur={d(PICS.wedding)} origin="45% 40%" /></S>
    <S name="Rasm: 18 Pro Max" r={PICS.phone}><Phone dur={d(PICS.phone)} switchAt={at(3.3) - PICS.phone.from} /></S>
    <S name="Rasm: energiya" r={PICS.energy1}><Photo src="v7/energy.jpg" dur={d(PICS.energy1)} glow /></S>
    <S name="Kadr: charchagan odam 1" r={PICS.tired1}><Tired dur={d(PICS.tired1)} trim={15} /></S>
    <S name="Kadr: charchagan odam 2" r={PICS.tired2}><Tired dur={d(PICS.tired2)} trim={200} /></S>
    <S name="Rasm: energiya (sozlash)" r={PICS.energy2}><Photo src="v7/energy.jpg" dur={d(PICS.energy2)} glow origin="50% 30%" /></S>

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.36) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.3) 72%, rgba(0,0,0,0.15) 100%)" }} />

    <Grain />
    <RefCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="Ishlamaydi" r={M.fail}><Fail dur={d(M.fail)} /></S>
    <S name="Karta: NIMAGA?" r={M.why}><Card dur={d(M.why)} small="Bilasizlarmi," big="Nimaga?" /></S>
    <S name="Karta: Birinchi navbatda" r={M.first}><Card dur={d(M.first)} small="1-qadam" big="Birinchi navbatda" /></S>
    <S name="Chiplar: energiya / ong osti" r={M.steps}><Chips dur={d(M.steps)} items={["Energiya", "Ong osti"]} gap={16} /></S>
    <S name="Maqsad" r={M.goal}><Goal dur={d(M.goal)} /></S>
    <S name="Energiya → texnika" r={M.order}><Order dur={d(M.order)} /></S>
    <S name="Obuna + Telegram" r={M.telegram}><Subscribe dur={d(M.telegram)} clickAt={30} telegram /></S>
    <S name="Obuna bo‘lish (oxiri)" r={M.subscribe}><Subscribe dur={d(M.subscribe) + 1} clickAt={26} /></S>

    {CLIPS.map((c, i) => (
      <Audio key={i} name={`Voice ${i + 1}`} src={VOICE} trimBefore={c.srcStart} from={c.out} durationInFrames={c.srcEnd - c.srcStart} />
    ))}
    <Audio
      name="Music: Freedom (instrumental)"
      src={staticFile("v7/music.wav")}
      volume={(f) => interpolate(f, [0, 10, DURATION - 30, DURATION], [0, 0.16, 0.16, 0], clamp)}
    />
    {SFX.map(([n, from, v], i) => (
      <Sequence key={i} name={`SFX ${n}`} from={Math.max(0, from)} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const AYNURA_DURATION = DURATION;
