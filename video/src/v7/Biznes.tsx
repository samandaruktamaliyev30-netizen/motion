import React from "react";
import { AbsoluteFill, interpolate, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { at, BROLL, BROLL_END, CLIPS, DURATION, FACE, LOW, M, MUSIC_TRIM, SHOTS, TITLE, type Trans } from "./timeline";
import { PHRASES } from "./captions";
import { StyleCaptions } from "../shared/StyleCaptions";
import { Cta, Escalate, Guide, Many, Org, Title } from "./Motion";

const RAW = staticFile("v7/raw.mp4");
const VOICE = staticFile("v7/voice.wav");
const GRADE = "contrast(1.07) saturate(1.06) brightness(1.02)";
const BGRADE = "contrast(1.06) saturate(0.95) brightness(0.97)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const TR = 8; // transition length (frames)

/** Directional motion blur (SVG filter): sx horizontal, sy vertical, in px. */
const DirBlur: React.FC<{ id: string; sx: number; sy: number }> = ({ id, sx, sy }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={`${sx} ${sy}`} />
    </filter>
  </svg>
);

/* Speaker camera: per-shot slow push, a zoom-through into the first B-roll,
   and a zoom-out arrival when the speaker comes back. */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  let s = interpolate(f, [a, b], [s0, s1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  let blur = 0;
  // punch-in on shot change: 3 frames of slight blur/overshoot
  const since = f - a;
  if (a > 0 && since < 4) {
    s *= 1 + (4 - since) * 0.012;
    blur = (4 - since) * 1.2;
  }
  // zoom-through into the B-roll block
  const into = f >= BROLL[0].r.from ? 0 : interpolate(f, [BROLL[0].r.from - TR, BROLL[0].r.from], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // arrival after the B-roll block
  const back = f < BROLL_END ? 0 : interpolate(f, [BROLL_END, BROLL_END + 10], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  s *= 1 + into * 0.35 + back * 0.3;
  blur += into * 14 + back * 12;
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: `${GRADE} blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const BRollClip: React.FC<{ src: string; trim: number; dur: number; t: Trans; last: boolean; id: string }> = ({ src, trim, dur, t, last, id }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, TR], [1, 0], { ...clamp, easing: EASE }); // 1 → 0 entering
  const push = interpolate(f, [0, dur], [1.0, 1.07]);
  let tf = "";
  let sx = 0;
  let sy = 0;
  let blur = 0;
  if (t === "zoom") {
    tf = `scale(${1 + k * 0.45})`;
    blur = k * 16;
  } else if (t === "whip") {
    tf = `translateX(${k * 100}%)`;
    sx = k * 60;
  } else if (t === "slide") {
    tf = `translateY(${k * -100}%)`;
    sy = k * 60;
  } else {
    tf = `rotate(${k * 18}deg) scale(${1 + k * 0.5})`;
    blur = k * 14;
  }
  // Each clip stays TR frames past its end, under the next clip's entry (no speaker peeking through).
  // The last one leaves AFTER the block ends (phone already gone), zooming through to the speaker.
  const out = last ? interpolate(f, [dur, dur + TR], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const filterUrl = sx || sy ? ` url(#${id})` : "";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DirBlur id={id} sx={sx} sy={sy} />
      <AbsoluteFill
        style={{
          transform: `${tf} scale(${push * (1 + out * 0.5)})`,
          filter: `${BGRADE} blur(${blur + out * 14}px)${filterUrl}`,
          opacity: 1 - out,
        }}
      >
        <Video src={staticFile(src)} trimBefore={trim} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** White light flash on every cut. */
const Flash: React.FC<{ at: number[] }> = ({ at: cuts }) => {
  const f = useCurrentFrame();
  const v = Math.max(0, ...cuts.map((c) => interpolate(f, [c - 2, c, c + 7], [0, 0.55, 0], clamp)));
  if (v <= 0) return null;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,250,240,1), rgba(255,240,215,0.6) 60%, rgba(255,230,200,0.3))", opacity: v, mixBlendMode: "screen" }} />;
};

const S: React.FC<{ name: string; r: { from: number; to: number }; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={r.to - r.from}>
    {children}
  </Sequence>
);
const d = (r: { from: number; to: number }) => r.to - r.from;

const Sfx: React.FC<{ name: string; f: number; v?: number }> = ({ name, f, v = 0.5 }) => (
  <Sequence name={`SFX ${name}`} from={Math.max(0, f)} durationInFrames={45}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);

const HIDE: [number, number][] = [[TITLE.from, TITLE.to], ...Object.values(M).map((r) => [r.from, r.to] as [number, number])];
const CUTS = [...BROLL.map((b) => b.r.from), BROLL_END];

export const Biznes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      {CLIPS.map((c, i) => (
        <Sequence key={i} name={`Spiker ${i + 1}`} from={c.out} durationInFrames={c.srcEnd - c.srcStart}>
          <Video src={RAW} muted trimBefore={c.srcStart} />
        </Sequence>
      ))}
    </Camera>

    {BROLL.map((b, i) => (
      <S key={b.name} name={b.name} r={{ from: b.r.from, to: b.r.to + TR }}>
        <BRollClip src={b.src} trim={b.trim} dur={d(b.r)} t={b.t} last={i === BROLL.length - 1} id={`db${i}`} />
      </S>
    ))}

    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.38) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 22%, transparent 55%, rgba(0,0,0,0.3) 68%, rgba(0,0,0,0.15) 100%)" }} />
    <Flash at={CUTS} />

    <StyleCaptions phrases={PHRASES} top={LOW} hide={HIDE} />

    <S name="Sarlavha: NEGA BIZNES YAXŞI RIVOJLANMAYDI" r={TITLE}><Title dur={d(TITLE)} /></S>
    <S name="Hamma qaror rahbarda" r={M.org}><Org dur={d(M.org)} /></S>
    <S name="Muammo → rahbar" r={M.escalate}><Escalate dur={d(M.escalate)} /></S>
    <S name="Juda ko'p biznes" r={M.many}><Many dur={d(M.many)} /></S>
    <S name="Qo'llanma" r={M.guide}><Guide dur={d(M.guide)} stampAt={at(38.06) - M.guide.from} /></S>
    <S name="CTA: 3 deb yozing" r={M.cta}><Cta dur={d(M.cta)} sendAt={at(48.1) - M.cta.from} freeAt={at(49.45) - M.cta.from} /></S>

    {/* sound design */}
    <Sfx name="bass" f={4} v={0.45} />
    <Sfx name="rm-whoosh" f={TITLE.to - 10} v={0.6} />
    <Sfx name="pop" f={M.org.from + 2} v={0.45} />
    <Sfx name="tick" f={M.org.from + 20} v={0.4} />
    <Sfx name="whoosh" f={M.escalate.from + 16} v={0.35} />
    <Sfx name="buzz" f={M.escalate.from + 40} v={0.25} />
    <Sfx name="whoosh" f={BROLL[0].r.from - TR} v={0.5} />
    <Sfx name="rm-whip" f={BROLL[1].r.from - 2} v={0.6} />
    <Sfx name="rm-shutter-modern" f={BROLL[1].r.from + 30} v={0.3} />
    <Sfx name="rm-whoosh" f={BROLL[2].r.from - 2} v={0.6} />
    <Sfx name="rm-whip" f={BROLL[3].r.from - 2} v={0.6} />
    <Sfx name="whoosh" f={BROLL_END - TR} v={0.5} />
    <Sfx name="pop" f={M.many.from + 4} v={0.4} />
    <Sfx name="rm-page-turn" f={M.guide.from + 2} v={0.5} />
    <Sfx name="bass" f={at(38.06)} v={0.5} />
    <Sfx name="pop" f={M.cta.from + 16} v={0.45} />
    <Sfx name="rm-mouse-click" f={at(48.1) - 1} v={0.5} />
    <Sfx name="rm-ding" f={at(49.45)} v={0.35} />

    {CLIPS.map((c, i) => (
      <Sequence key={i} name={`Ovoz ${i + 1}`} from={c.out} durationInFrames={c.srcEnd - c.srcStart}>
        <Audio src={VOICE} trimBefore={c.srcStart} />
      </Sequence>
    ))}
    <Audio
      name="Music: Metro Boomin - Superhero (Kimyo papkasidan)"
      src={staticFile("v7/music.wav")}
      trimBefore={MUSIC_TRIM}
      volume={(fr) => Math.min(1, fr / 8) * (fr < at(48.1) ? 1.0 : 0.72)}
    />
  </AbsoluteFill>
);

export const BIZNES_DURATION = DURATION;
