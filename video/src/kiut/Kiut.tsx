import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { BROLL, CAPTION_HIDE, DURATION, FACE, LOCATION, REASONS, SHOTS, TITLE_END } from "./timeline";
import { PHRASES } from "./captions";

/* ---------- font: Inter (clean, grown-up subtitles) ---------- */
const INTER = "Inter";
loadFont({
  family: INTER,
  url: staticFile("fonts/inter-latin.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});
loadFont({
  family: INTER,
  url: staticFile("fonts/inter-latin-ext.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

const RAW = staticFile("kiut/raw.mp4");
const VOICE = staticFile("kiut/voice.wav");
const SHADOW = "0 2px 4px rgba(0,0,0,0.45), 0 6px 24px rgba(0,0,0,0.55)";

const fade = (f: number, from: number, to: number, inF = 6, outF = 5) =>
  Math.min(
    interpolate(f, [from, from + inF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(f, [to - outF, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

/* ---------- speaker camera: face-anchored zoom ---------- */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: "contrast(1.06) saturate(1.06)" }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- B-roll with a slow push-in ---------- */
const BRoll: React.FC<{ src: string; dur: number; zoom?: [number, number] }> = ({ src, dur, zoom = [1.0, 1.08] }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom);
  const o = interpolate(f, [0, 4, dur - 3, dur], [0, 1, 1, 0.98], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>
      <Video src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

/* ---------- title over the drone shot ---------- */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= TITLE_END) return null;
  const a = fade(f, 4, TITLE_END, 14, 8);
  const b = fade(f, 12, TITLE_END, 16, 8);
  const line = interpolate(f, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 560 }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 58, letterSpacing: 2, color: "white", opacity: a, transform: `translateY(${(1 - a) * 20}px)`, textShadow: SHADOW }}>
        Nega aynan
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 210, letterSpacing: -4, lineHeight: 1, color: "white", opacity: b, transform: `translateY(${(1 - b) * 30}px)`, textShadow: SHADOW }}>
        KIUT?
      </div>
      <div style={{ width: 420 * line, height: 3, background: "rgba(255,255,255,0.85)", marginTop: 26, opacity: b }} />
      <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 36, letterSpacing: 6, color: "rgba(255,255,255,0.88)", marginTop: 22, opacity: b, textShadow: SHADOW }}>
        TIBBIYOT YO‘NALISHI
      </div>
    </AbsoluteFill>
  );
};

/* ---------- small reason marker "01 / 05" ---------- */
const ReasonTag: React.FC = () => {
  const f = useCurrentFrame();
  if (CAPTION_HIDE.some(([a, b]) => f >= a && f < b)) return null;
  const i = REASONS.findIndex(([a, b]) => f >= a && f < b);
  if (i < 0) return null;
  const [a, b] = REASONS[i];
  const o = fade(f, a, b, 8, 6);
  return (
    <div style={{ position: "absolute", top: 985, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o * 0.9 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: INTER, fontWeight: 600, fontSize: 28, letterSpacing: 5, color: "white", textShadow: SHADOW }}>
        <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.8)" }} />
        {String(i + 1).padStart(2, "0")} / 05
        <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.8)" }} />
      </div>
    </div>
  );
};

/* ---------- subtitles: white, calm, phrase by phrase ---------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  if (CAPTION_HIDE.some(([a, b]) => f >= a && f < b)) return null;
  const p = PHRASES.find((x) => f >= x.from && f < x.to);
  if (!p) return null;
  const o = fade(f, p.from, p.to, 5, 4);
  return (
    <div style={{ position: "absolute", top: 1045, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: 900,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 62,
          lineHeight: 1.22,
          letterSpacing: -0.6,
          color: "white",
          textShadow: SHADOW,
          opacity: o,
          transform: `translateY(${(1 - o) * 10}px)`,
        }}
      >
        {p.text}
      </div>
    </div>
  );
};

/* ---------- location card at the end ---------- */
const Location: React.FC = () => {
  const f = useCurrentFrame();
  const o = fade(f, 0, LOCATION.to - LOCATION.from + 10, 10, 1);
  return (
    <div style={{ position: "absolute", top: 1050, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
      <svg width={74} height={74} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.6" />
      </svg>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 64, color: "white", marginTop: 14, textShadow: SHADOW, letterSpacing: -0.8 }}>Qulay lokatsiya</div>
      <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 38, color: "rgba(255,255,255,0.88)", marginTop: 8, textShadow: SHADOW }}>Metro yonida</div>
    </div>
  );
};

export const Kiut: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera>
        <Video name="Clip 1" src={RAW} muted trimBefore={0} from={0} durationInFrames={129} />
        <Video name="Clip 2" src={RAW} muted trimBefore={138} from={129} durationInFrames={155} />
        <Video name="Clip 3" src={RAW} muted trimBefore={299} from={284} durationInFrames={28} />
        <Video name="Clip 4" src={RAW} muted trimBefore={335} from={312} durationInFrames={56} />
        <Video name="Clip 5" src={RAW} muted trimBefore={402} from={368} durationInFrames={330} />
        <Video name="Clip 6" src={RAW} muted trimBefore={741} from={698} durationInFrames={159} />
        <Video name="Clip 7" src={RAW} muted trimBefore={912} from={857} durationInFrames={55} />
        <Video name="Clip 8" src={RAW} muted trimBefore={974} from={912} durationInFrames={18} />
        <Video name="Clip 9" src={RAW} muted trimBefore={1001} from={930} durationInFrames={29} />
        <Video name="Clip 10" src={RAW} muted trimBefore={1043} from={959} durationInFrames={448} />
        <Video name="Clip 11" src={RAW} muted trimBefore={1498} from={1407} durationInFrames={51} />
        <Video name="Clip 12" src={RAW} muted trimBefore={1560} from={1458} durationInFrames={96} />
      </Camera>

      <Sequence name="B-roll: dron (universitet)" from={BROLL.drone.from} durationInFrames={BROLL.drone.to - BROLL.drone.from}>
        <BRoll src={staticFile("kiut/drone.mp4")} dur={BROLL.drone.to - BROLL.drone.from} zoom={[1.0, 1.06]} />
      </Sequence>
      <Sequence name="B-roll: ustoz" from={BROLL.teacher.from} durationInFrames={BROLL.teacher.to - BROLL.teacher.from}>
        <BRoll src={staticFile("kiut/teacher.mp4")} dur={BROLL.teacher.to - BROLL.teacher.from} />
      </Sequence>
      <Sequence name="B-roll: talabalar" from={BROLL.students.from} durationInFrames={BROLL.students.to - BROLL.students.from}>
        <BRoll src={staticFile("kiut/students.mp4")} dur={BROLL.students.to - BROLL.students.from} />
      </Sequence>
      <Sequence name="B-roll: laboratoriya" from={BROLL.lab.from} durationInFrames={BROLL.lab.to - BROLL.lab.from}>
        <BRoll src={staticFile("kiut/lab.mp4")} dur={BROLL.lab.to - BROLL.lab.from} zoom={[1.0, 1.1]} />
      </Sequence>

      {/* soft vignette + bottom shade for readable white text */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 52%, rgba(0,0,0,0.35) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 48%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.12) 100%)" }} />

      <Title />
      <ReasonTag />
      <Captions />
      <Sequence name="Lokatsiya" from={LOCATION.from} durationInFrames={LOCATION.to - LOCATION.from}>
        <Location />
      </Sequence>

      <Audio name="Voice 1" src={VOICE} trimBefore={0} from={0} durationInFrames={129} />
      <Audio name="Voice 2" src={VOICE} trimBefore={138} from={129} durationInFrames={155} />
      <Audio name="Voice 3" src={VOICE} trimBefore={299} from={284} durationInFrames={28} />
      <Audio name="Voice 4" src={VOICE} trimBefore={335} from={312} durationInFrames={56} />
      <Audio name="Voice 5" src={VOICE} trimBefore={402} from={368} durationInFrames={330} />
      <Audio name="Voice 6" src={VOICE} trimBefore={741} from={698} durationInFrames={159} />
      <Audio name="Voice 7" src={VOICE} trimBefore={912} from={857} durationInFrames={55} />
      <Audio name="Voice 8" src={VOICE} trimBefore={974} from={912} durationInFrames={18} />
      <Audio name="Voice 9" src={VOICE} trimBefore={1001} from={930} durationInFrames={29} />
      <Audio name="Voice 10" src={VOICE} trimBefore={1043} from={959} durationInFrames={448} />
      <Audio name="Voice 11" src={VOICE} trimBefore={1498} from={1407} durationInFrames={51} />
      <Audio name="Voice 12" src={VOICE} trimBefore={1560} from={1458} durationInFrames={96} />

      {/* EsDeeKid – Mist (extended intro): beat drop lands on "birinchi sababi" */}
      <Audio name="Music: EsDeeKid - Mist" src={staticFile("kiut/music.wav")} volume={(f) => (f < 82 ? 1.6 : 1.0)} />
    </AbsoluteFill>
  );
};

export const KIUT_DURATION = DURATION;
