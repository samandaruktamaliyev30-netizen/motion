import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { BROLL, CAPTION_HIDE, DURATION, FACE, METRO, METRO_SRC, NUMBERS, OUTRO, SHOTS, TITLE_END } from "./timeline";
import { PHRASES } from "../kiut/captions";
import { toNewAlphabet as N } from "./alphabet";

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

const F = (p: string) => staticFile(`kiut2/${p}`);
const RAW = F("raw.mp4");
const VOICE = F("voice.wav");
const SHADOW = "0 2px 4px rgba(0,0,0,0.45), 0 6px 24px rgba(0,0,0,0.55)";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
// Colour grade: a touch warmer, richer and punchier.
const GRADE = "contrast(1.1) saturate(1.24) brightness(1.03) sepia(0.06)";

const fade = (f: number, from: number, to: number, inF = 6, outF = 5) =>
  Math.min(
    interpolate(f, [from, from + inF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(f, [to - outF, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------------- picture ---------------- */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS.filter(([a]) => a <= f).pop() ?? SHOTS[0];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px` }}>{children}</AbsoluteFill>;
};

const BRoll: React.FC<{ src: string; dur: number; zoom?: [number, number] }> = ({ src, dur, zoom = [1.0, 1.08] }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom);
  const o = interpolate(f, [0, 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>
      <Video src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

/* ---------------- title (opening) ---------------- */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= TITLE_END) return null;
  const a = fade(f, 4, TITLE_END, 14, 8);
  const b = fade(f, 12, TITLE_END, 16, 8);
  const line = interpolate(f, [18, 40], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 200 }}>
      <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 58, letterSpacing: 2, color: "white", opacity: a, transform: `translateY(${(1 - a) * 20}px)`, textShadow: SHADOW }}>
        Nega aynan
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 210, letterSpacing: -4, lineHeight: 1, color: "white", opacity: b, transform: `translateY(${(1 - b) * 30}px)`, textShadow: SHADOW }}>
        KIUT?
      </div>
      <div style={{ width: 420 * line, height: 3, background: "rgba(255,255,255,0.85)", marginTop: 26, opacity: b }} />
      <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 36, letterSpacing: 6, color: "rgba(255,255,255,0.9)", marginTop: 22, opacity: b, textShadow: SHADOW }}>
        {N("TIBBIYOT YO‘NALISHI")}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- captions: new alphabet + motion backdrop ---------------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  if (CAPTION_HIDE.some(([a, b]) => f >= a && f < b)) return null;
  const p = PHRASES.find((x) => f >= x.from && f < x.to);
  if (!p) return null;
  const t = f - p.from;
  const dur = p.to - p.from;
  const open = interpolate(t, [0, 8], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [p.to - 4, p.to], [1, 0], clamp);
  const progress = interpolate(t, [0, dur - 2], [0, 1], clamp);
  const sweep = interpolate(t, [3, 18], [-40, 140], clamp);
  const words = N(p.text).split(" ");
  return (
    <div style={{ position: "absolute", top: 1040, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
      <div
        style={{
          position: "relative",
          maxWidth: 940,
          padding: "20px 38px 26px",
          borderRadius: 30,
          overflow: "hidden",
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 30px)`,
        }}
      >
        {/* frosted backdrop */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(14,18,28,0.62), rgba(14,18,28,0.42))", backdropFilter: "blur(16px) saturate(1.3)", border: "1.5px solid rgba(255,255,255,0.16)", borderRadius: 30 }} />
        {/* light sweep */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "22%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)", transform: "skewX(-20deg)" }} />
        {/* phrase progress line */}
        <div style={{ position: "absolute", left: 38, right: 38, bottom: 12, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
        </div>
        {/* words rise in one after another */}
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
          {words.map((w, i) => {
            const k = interpolate(t, [3 + i * 2, 11 + i * 2], [0, 1], { ...clamp, easing: EASE });
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 6 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: INTER,
                    fontWeight: 600,
                    fontSize: 56,
                    lineHeight: 1.2,
                    letterSpacing: -0.5,
                    color: "white",
                    transform: `translateY(${(1 - k) * 70}px)`,
                    opacity: k,
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------------- big animated numbers 1..5 ---------------- */
const NumberPop: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const ring = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: EASE });
  const rise = interpolate(f, [2, 14], [1, 0], { ...clamp, easing: EASE });
  const label = interpolate(f, [8, 18], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 6, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const R = 170;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", top: 1030, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${-out * 40}px)`, filter: `blur(${out * 8}px)` }}>
      <div style={{ position: "relative", width: 2 * R + 20, height: 2 * R + 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={2 * R + 20} height={2 * R + 20} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.45))" }}>
          <circle cx={R + 10} cy={R + 10} r={R} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
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

/* ---------------- split screen: speaker on top, metro motion below ---------------- */
const MetroPanel: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const W = 1080;
  const H = 960;
  const train = interpolate(f, [4, 34], [1, 0], { ...clamp, easing: Easing.bezier(0.15, 0.85, 0.25, 1) });
  const speedLines = interpolate(f, [4, 34], [1, 0], clamp);
  const sign = interpolate(f, [26, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const text = interpolate(f, [34, 46], [0, 1], { ...clamp, easing: EASE });
  const doors = interpolate(f, [40, 52], [0, 1], { ...clamp, easing: EASE });
  const trainW = 1500;
  const trainX = (W - trainW) / 2 + train * 1700;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", background: "linear-gradient(180deg, #13233A 0%, #0B1524 70%, #070D17 100%)" }}>
      {/* tunnel light strips */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", top: 70, left: ((i * 260 - f * 40 * speedLines) % 1560) - 240, width: 160, height: 10, borderRadius: 5, background: "rgba(255,240,210,0.7)", boxShadow: "0 0 24px rgba(255,230,190,0.8)" }} />
      ))}
      {/* platform */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 320, background: "linear-gradient(180deg, #2A3445, #1A2230)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 14, background: "repeating-linear-gradient(90deg, #E8E8E8 0 40px, #9AA3B0 40px 80px)" }} />
      {/* speed lines */}
      {[180, 260, 360, 470].map((y, i) => (
        <div key={i} style={{ position: "absolute", top: y, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.5 * speedLines}), transparent)`, transform: `translateX(${(i % 2 ? -1 : 1) * 200 * speedLines}px)` }} />
      ))}
      {/* train */}
      <div style={{ position: "absolute", top: 200, left: trainX, width: trainW, height: 420, borderRadius: "60px 60px 18px 18px", background: "linear-gradient(180deg, #F4F6F8 0%, #D5DAE0 60%, #AEB6C1 100%)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", filter: `blur(${speedLines * 6}px)` }}>
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 10, background: "#2F6BFF" }} />
        <div style={{ position: "absolute", top: 110, left: 60, right: 60, display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ width: 150, height: 110, borderRadius: 14, background: "linear-gradient(180deg, #2B3A52, #141C2A)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.15)" }} />
          ))}
        </div>
        {/* doors open on arrival */}
        <div style={{ position: "absolute", top: 250, left: trainW / 2 - 120, width: 240, height: 170, display: "flex", justifyContent: "center", background: "#0E1522" }}>
          <div style={{ width: 120 * (1 - doors), height: "100%", background: "#C9D0D8", borderRight: "2px solid #8A939F" }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 120 * (1 - doors), height: "100%", background: "#C9D0D8", borderLeft: "2px solid #8A939F" }} />
        </div>
      </div>
      {/* station sign */}
      <div style={{ position: "absolute", top: 92, left: 60, display: "flex", alignItems: "center", gap: 18, opacity: sign, transform: `scale(${0.6 + 0.4 * sign})`, transformOrigin: "left center" }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 900, fontSize: 56, color: "#2F6BFF" }}>M</div>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, color: "white", textShadow: SHADOW }}>Metro</div>
      </div>
      {/* caption */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: text, transform: `translateY(${(1 - text) * 20}px)` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, fontFamily: INTER, fontWeight: 700, fontSize: 60, color: "white", letterSpacing: -0.6, textShadow: SHADOW }}>
          <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.6" />
          </svg>
          Metro bekati yonida
        </div>
      </div>
    </div>
  );
};

const SplitMetro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const open = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: EASE });
  const close = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const k = open * (1 - close);
  return (
    <AbsoluteFill>
      {/* top: the speaker, face centred in the upper half */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 960 + (1 - k) * 960, overflow: "hidden", filter: GRADE }}>
        <div style={{ position: "absolute", left: 0, top: -(FACE.cy - 480) * k, width: 1080, height: 1920 }}>
          <Video src={RAW} muted trimBefore={METRO_SRC} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      {/* bottom: metro motion */}
      <div style={{ position: "absolute", left: 0, top: 960 + (1 - k) * 960, width: 1080, height: 960 }}>
        <MetroPanel dur={dur} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 958 + (1 - k) * 960, height: 4, background: "white", boxShadow: "0 0 20px rgba(255,255,255,0.6)" }} />
    </AbsoluteFill>
  );
};

/* ---------------- outro: drone + subscribe ---------------- */
const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const clickAt = 34;
  const clicked = f >= clickAt;
  const btn = fade(f, 6, dur + 10, 10, 1);
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [10, clickAt - 2], [200, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: GRADE }}>
        <BRoll src={F("drone_end.mp4")} dur={dur} zoom={[1.04, 1.1]} />
      </AbsoluteFill>
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
            {clicked ? N("Obuna bo‘ldingiz") : N("Obuna bo‘ling")}
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

const Seq: React.FC<{ name: string; r: { from: number; to: number }; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={r.to - r.from}>
    {children}
  </Sequence>
);

export const Kiut2: React.FC = () => {
  const d = (r: { from: number; to: number }) => r.to - r.from;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ filter: GRADE }}>
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

        <Seq name="Universitet (fasad)" r={BROLL.front}>
          <BRoll src={F("front_v.mp4")} dur={d(BROLL.front)} zoom={[1.0, 1.05]} />
        </Seq>
        <Seq name="Ustoz (oq xalat)" r={BROLL.teacher}>
          <BRoll src={F("teacher.mp4")} dur={d(BROLL.teacher)} />
        </Seq>
        <Seq name="Professorlar" r={BROLL.profs}>
          <BRoll src={F("profs_v.mp4")} dur={d(BROLL.profs)} zoom={[1.0, 1.05]} />
        </Seq>
        <Seq name="Talabalar" r={BROLL.students}>
          <BRoll src={F("students.mp4")} dur={d(BROLL.students)} />
        </Seq>
        <Seq name="Darsda o‘qish" r={BROLL.classroom}>
          <BRoll src={F("classroom.mp4")} dur={d(BROLL.classroom)} />
        </Seq>
        <Seq name="Amaliy ish" r={BROLL.handson}>
          <BRoll src={F("handson.mp4")} dur={d(BROLL.handson)} />
        </Seq>
        <Seq name="Laboratoriya" r={BROLL.lab}>
          <BRoll src={F("lab.mp4")} dur={d(BROLL.lab)} zoom={[1.0, 1.1]} />
        </Seq>
      </AbsoluteFill>

      {/* warm/teal finishing wash + vignette */}
      <AbsoluteFill style={{ background: "linear-gradient(160deg, rgba(255,170,90,0.08), transparent 45%, rgba(0,120,140,0.08))", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 52%, rgba(0,0,0,0.38) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.1) 100%)" }} />

      <Title />
      <Captions />
      {NUMBERS.map(([a, b], i) => (
        <Sequence key={i} name={`Raqam ${i + 1}`} from={a} durationInFrames={b - a}>
          <NumberPop n={i + 1} dur={b - a} />
        </Sequence>
      ))}
      <Seq name="Split: ustoz / metro" r={METRO}>
        <SplitMetro dur={d(METRO)} />
      </Seq>
      <Seq name="Outro: dron + obuna" r={OUTRO}>
        <Outro dur={d(OUTRO)} />
      </Seq>

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

      <Audio name="Music: Freedom (instrumental)" src={F("music.wav")} volume={0.72} />
    </AbsoluteFill>
  );
};

export const KIUT2_DURATION = DURATION;
