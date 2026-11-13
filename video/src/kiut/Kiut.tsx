import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { BROLL, CAPTION_HIDE, DURATION, FACE, METRO, NUMBERS, OUTRO, SHOTS, TITLE_END } from "./timeline";
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

/* ---------- big animated reason number (low, white, minimal) ---------- */
const NumberPop: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const ring = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const rise = interpolate(f, [2, 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const label = interpolate(f, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [dur - 6, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const R = 170;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", top: 1030, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${-out * 40}px)`, filter: `blur(${out * 8}px)` }}>
      <div style={{ position: "relative", width: 2 * R + 20, height: 2 * R + 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={2 * R + 20} height={2 * R + 20} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.45))" }}>
          <circle cx={R + 10} cy={R + 10} r={R} fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
          <circle cx={R + 10} cy={R + 10} r={R} fill="none" stroke="white" strokeWidth={5} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
        </svg>
        <div style={{ overflow: "hidden", height: 260, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 250, lineHeight: 1, color: "white", letterSpacing: -6, transform: `translateY(${rise * 260}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.45)" }}>
            {n}
          </div>
        </div>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: "white", marginTop: 18, opacity: label, transform: `translateY(${(1 - label) * 14}px)`, textShadow: SHADOW }}>
        {n}-SABAB
      </div>
    </div>
  );
};

/* ---------- metro animation: train arrives at the station, pin drops ---------- */
const Metro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const W = 860;
  const track = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const train = interpolate(f, [8, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const pin = interpolate(f, [38, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const text = interpolate(f, [44, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const all = fade(f, 0, dur, 6, 7);
  const station = W / 2;
  const trainW = 230;
  const trainX = -trainW + train * (station - trainW / 2 + trainW);
  return (
    <div style={{ position: "absolute", top: 1060, left: (1080 - W) / 2, width: W, height: 380, opacity: all }}>
      {/* pin + M sign above the station */}
      <div style={{ position: "absolute", left: station - 44, top: 0, transform: `translateY(${(1 - pin) * -60}px) scale(${0.6 + 0.4 * pin})`, opacity: pin }}>
        <svg width={88} height={110} viewBox="0 0 44 55" style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.5))" }}>
          <path d="M22 54S4 34 4 21a18 18 0 0 1 36 0c0 13-18 33-18 33z" fill="white" />
          <text x="22" y="28" textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={20} fill="#111">M</text>
        </svg>
      </div>
      {/* track */}
      <div style={{ position: "absolute", top: 196, left: 0, width: W * track, height: 4, borderRadius: 2, background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.4)" }} />
      {[0.12, 0.5, 0.88].map((p, i) => (
        <div key={i} style={{ position: "absolute", top: 186, left: W * p - 12, width: 24, height: 24, borderRadius: 12, border: "4px solid white", background: i === 1 ? "white" : "rgba(0,0,0,0.35)", opacity: track > p ? 1 : 0 }} />
      ))}
      {/* train */}
      <div style={{ position: "absolute", top: 128, left: trainX, width: trainW, height: 58, borderRadius: "16px 30px 12px 12px", background: "white", boxShadow: "0 8px 20px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", overflow: "hidden" }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ width: 34, height: 24, borderRadius: 5, background: "#1B1F27" }} />
        ))}
      </div>
      {/* label */}
      <div style={{ position: "absolute", top: 248, left: 0, right: 0, textAlign: "center", opacity: text, transform: `translateY(${(1 - text) * 14}px)` }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 58, color: "white", textShadow: SHADOW, letterSpacing: -0.6 }}>Metro bekati yonida</div>
      </div>
    </div>
  );
};

/* ---------- outro: campus drone shot + subscribe button ---------- */
const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const clickAt = 34;
  const clicked = f >= clickAt;
  const btn = fade(f, 6, dur + 10, 10, 1);
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cur = interpolate(f, [10, clickAt - 2], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <BRoll src={staticFile("kiut/drone_end.mp4")} dur={dur} zoom={[1.04, 1.1]} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 30}px)` }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              transform: `scale(${press})`,
              background: clicked ? "rgba(255,255,255,0.16)" : "white",
              border: "2px solid white",
              backdropFilter: "blur(10px)",
              color: clicked ? "white" : "#111",
              borderRadius: 999,
              padding: "26px 60px",
              fontFamily: INTER,
              fontWeight: 700,
              fontSize: 50,
              letterSpacing: -0.5,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 14px 36px rgba(0,0,0,0.35)",
            }}
          >
            {clicked ? (
              <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5 10 17.5 19.5 7" />
              </svg>
            ) : null}
            {clicked ? "Obuna bo‘ldingiz" : "Obuna bo‘ling"}
          </div>
          {clicked ? (
            <div style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 22, marginTop: -44, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} />
          ) : null}
          <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 70 + cur, marginTop: 10, opacity: f < clickAt + 20 ? btn : 0, transform: `scale(${press})` }}>
            <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
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
        <Video name="Clip 11 (ending, uncut)" src={RAW} muted trimBefore={1498} from={1407} durationInFrames={161} />
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
      <Sequence name="B-roll: amaliyot (C0062)" from={BROLL.practice.from} durationInFrames={BROLL.practice.to - BROLL.practice.from}>
        <BRoll src={staticFile("kiut/practice.mp4")} dur={BROLL.practice.to - BROLL.practice.from} zoom={[1.0, 1.08]} />
      </Sequence>

      {/* soft vignette + bottom shade for readable white text */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 52%, rgba(0,0,0,0.35) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 48%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.12) 100%)" }} />

      <Title />
      <Captions />
      {NUMBERS.map(([a, b], i) => (
        <Sequence key={i} name={`Raqam ${i + 1}`} from={a} durationInFrames={b - a}>
          <NumberPop n={i + 1} dur={b - a} />
        </Sequence>
      ))}
      <Sequence name="Metro" from={METRO.from} durationInFrames={METRO.to - METRO.from}>
        <Metro dur={METRO.to - METRO.from} />
      </Sequence>
      <Sequence name="Outro: obuna" from={OUTRO.from} durationInFrames={OUTRO.to - OUTRO.from}>
        <Outro dur={OUTRO.to - OUTRO.from} />
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
      <Audio name="Voice 11" src={VOICE} trimBefore={1498} from={1407} durationInFrames={161} />

      {/* EsDeeKid – Mist (extended intro): beat drop lands on "birinchi sababi" */}
      <Audio name="Music: EsDeeKid - Mist" src={staticFile("kiut/music.wav")} volume={(f) => (f < 82 ? 1.6 : 1.0)} />
    </AbsoluteFill>
  );
};

export const KIUT_DURATION = DURATION;
