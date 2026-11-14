import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { DURATION, FACE, SHOTS, srcToOut as at } from "../reel/timeline";
import { PAGES } from "../reel/captions";
import { fontFamily as MONT } from "../reel/ui";
import { IconBell, IconCheck, IconHeart, IconSend, IconX } from "../reel/Icons";
import { toNewAlphabet as N } from "../kiut2/alphabet";

// "Milliy sertifikat bekor bo‘ladimi?" — v2 edit inspired by (not copied from) the reference.
const RAW = staticFile("raw.mp4");
const VOICE = staticFile("voice.wav");
const R = (p: string) => staticFile(`reel2/${p}`);
const SFXF = (p: string) => staticFile(`sfx/${p}`);
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const YELLOW = "#FFD23F";
const LOW = 1130; // below the chin even at max zoom

/* ---------------- timing (output frames) ---------------- */
const T = {
  sms: { from: 0, to: at(1.6) },
  student: { from: at(8.2), to: at(10.26) },
  crowd: { from: at(10.26), to: at(12.46) },
  celebrate: { from: at(12.46), to: at(14.16) },
  logos: { from: at(15.8), to: at(17.1) },
  minister: { from: at(17.1), to: at(19.6) },
  stamp: { from: at(26.68), to: at(28.32) },
  protest: { from: at(29.98), to: at(33.02) },
  share: { from: at(37.48), to: at(38.74) },
  subscribe: { from: at(39.22), to: DURATION },
};
const HIDE_CAPTIONS = [T.sms, T.logos, T.minister, T.stamp, T.share, T.subscribe];
const d = (r: { from: number; to: number }) => r.to - r.from;

/* ---------------- speaker camera ---------------- */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  const s = interpolate(f, [a, b], [s0, s1], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px`, filter: "contrast(1.08) saturate(1.14) brightness(1.03)" }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------------- full-screen image B-roll: zoom-blur in, drift, quick out ---------------- */
const ImageBRoll: React.FC<{ src: string; dur: number; move: "in" | "left" | "right"; children?: React.ReactNode }> = ({ src, dur, move, children }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 7], [0, 1], { ...clamp, easing: EASE });
  const p = interpolate(f, [0, dur], [0, 1]);
  const scale = (move === "in" ? 1.05 + p * 0.12 : 1.16) + (1 - inn) * 0.18;
  const tx = move === "left" ? 40 - p * 80 : move === "right" ? -40 + p * 80 : 0;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 1.6), overflow: "hidden", backgroundColor: "black" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${tx}px)`, filter: `blur(${(1 - inn) * 14}px) contrast(1.05) saturate(1.1)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
      {children}
    </AbsoluteFill>
  );
};

/* ---------------- 1. incoming SMS with vibration ---------------- */
const Sms: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 2, fps, config: { damping: 13, stiffness: 190, mass: 0.7 } });
  const shake = f >= 2 && f < 14 ? Math.sin(f * 2.6) * interpolate(f, [2, 14], [9, 0]) : 0;
  const out = interpolate(f, [dur - 6, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const typing = f < 9; // a blink of the "typing" dots before the text lands
  return (
    <div style={{ position: "absolute", top: LOW + 10, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.5) * (1 - out), transform: `translateY(${(1 - s) * 60 + out * 30}px) translateX(${shake}px) scale(${0.85 + 0.15 * s})` }}>
      <div style={{ width: 880, borderRadius: 42, padding: "22px 26px", background: "rgba(245,245,247,0.88)", backdropFilter: "blur(24px) saturate(1.6)", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", display: "flex", gap: 20, alignItems: "flex-start", fontFamily: MONT }}>
        <div style={{ width: 86, height: 86, borderRadius: 22, background: "linear-gradient(180deg,#5BF675,#16C93D)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={52} height={52} viewBox="0 0 24 24">
            <path fill="white" d="M12 3C6.5 3 2 6.8 2 11.4c0 2.6 1.4 4.9 3.7 6.4L5 21l3.6-1.9c1.1.3 2.2.5 3.4.5 5.5 0 10-3.8 10-8.4S17.5 3 12 3z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, color: "#1C1C1E" }}>
            <span>Talaba</span>
            <span style={{ fontWeight: 500, color: "#8A8A8E" }}>hozir</span>
          </div>
          {typing ? (
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: "#8A8A8E", opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 3) * 0.6)) }} />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 42, fontWeight: 700, color: "#1C1C1E", marginTop: 4, lineHeight: 1.15 }}>{N("Milliy sertifikat bekor bo‘ladimi?")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- 2. "A+" stamp on the certificate photo ---------------- */
const APlus: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - (at(8.86) - at(8.2)), fps, config: { damping: 9, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", right: 70, top: 760, transform: `scale(${2.2 - 1.2 * s}) rotate(${-14 + 4 * s}deg)`, opacity: Math.min(1, s * 2) }}>
      <div style={{ width: 230, height: 230, borderRadius: 115, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 900, fontSize: 112, color: "#111", boxShadow: "0 16px 40px rgba(0,0,0,0.45)", border: "8px solid white" }}>A+</div>
    </div>
  );
};

/* ---------------- 3. ministries collide and merge ---------------- */
const Logos: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fly = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1) });
  const merge = interpolate(f, [14, 24], [0, 1], { ...clamp, easing: EASE });
  const flash = interpolate(f, [12, 14, 22], [0, 1, 0], clamp);
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  const gap = 360 - merge * 300;
  const card = (src: string, side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        left: 540 - 150 + side * (gap / 2 + (1 - fly) * 700),
        top: 0,
        width: 300,
        height: 310,
        borderRadius: 34,
        overflow: "hidden",
        background: "white",
        boxShadow: "0 22px 50px rgba(0,0,0,0.45)",
        transform: `rotate(${side * (1 - fly) * 30 + side * merge * 4}deg) scale(${1 - merge * 0.12})`,
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, height: 420, opacity: 1 - out }}>
      {card(R("logo_a.png"), -1)}
      {card(R("logo_b.png"), 1)}
      <div style={{ position: "absolute", left: 540 - 200, top: -40, width: 400, height: 400, borderRadius: 200, background: "radial-gradient(circle, rgba(255,255,255,0.95), transparent 65%)", opacity: flash }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 52, color: "white", textShadow: SHADOW, opacity: merge, transform: `translateY(${(1 - merge) * 20}px)` }}>
        {N("2 ta vazirlik birlashdi")}
      </div>
    </div>
  );
};

/* ---------------- 4. new minister photo card (flip in) ---------------- */
const Minister: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 120 } });
  const label = interpolate(f, [10, 20], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: LOW - 10, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, perspective: 1200 }}>
      <div style={{ width: 360, height: 318, borderRadius: 30, overflow: "hidden", border: "6px solid white", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", transform: `rotateY(${(1 - s) * 90}deg) scale(${0.8 + 0.2 * s})` }}>
        <Img src={R("minister.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 18, opacity: label, transform: `translateY(${(1 - label) * 16}px)`, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: YELLOW, color: "#111", fontFamily: MONT, fontWeight: 800, fontSize: 30, padding: "6px 18px", borderRadius: 12, letterSpacing: 1 }}>YANGI VAZIR</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 48, color: "white", textShadow: SHADOW, marginTop: 8 }}>Erkinjon Turdimov</div>
      </div>
    </div>
  );
};

/* ---------------- 5. certificate gets a "BEKOR?" stamp ---------------- */
const Stamp: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 15, stiffness: 160 } });
  const hit = at(27.52) - at(26.68);
  const st = spring({ frame: f - hit, fps, config: { damping: 8, stiffness: 240 } });
  const shake = f >= hit && f < hit + 10 ? Math.sin((f - hit) * 3) * interpolate(f, [hit, hit + 10], [14, 0]) : 0;
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: LOW, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, inn * 1.5) * (1 - out), transform: `translateY(${(1 - inn) * 60}px) translateX(${shake}px)` }}>
      <div style={{ position: "relative", width: 760, height: 380, borderRadius: 24, background: "linear-gradient(160deg,#FFFDF5,#F1EAD6)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", padding: 34, fontFamily: MONT, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 14, border: "3px solid #C9A64B", borderRadius: 16 }} />
        <div style={{ fontWeight: 900, fontSize: 52, color: "#1D2A55", textAlign: "center", marginTop: 24, letterSpacing: 2 }}>MILLIY SERTIFIKAT</div>
        <div style={{ textAlign: "center", fontWeight: 600, fontSize: 30, color: "#6B6450", marginTop: 6 }}>A / A+ daraja</div>
        <div style={{ margin: "26px auto 0", width: 480, height: 10, borderRadius: 5, background: "#E2D8BD" }} />
        <div style={{ margin: "14px auto 0", width: 380, height: 10, borderRadius: 5, background: "#E2D8BD" }} />
        <div style={{ position: "absolute", right: 46, bottom: 40, width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle at 35% 35%,#F3D27A,#C9962E)" }} />
        {f >= hit ? (
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) rotate(-14deg) scale(${2.4 - 1.4 * st})`, opacity: Math.min(1, st * 2), border: "9px solid #E5383B", color: "#E5383B", borderRadius: 20, padding: "8px 30px", fontWeight: 900, fontSize: 92, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.75)", mixBlendMode: "multiply" }}>
            <IconX size={80} color="#E5383B" stroke={3.6} />
            BEKOR?
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ---------------- 6. protest image: shake + red pulse ---------------- */
const ProtestFx: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = (Math.sin(f * 0.4) * 0.5 + 0.5) * 0.35;
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(220,30,30,${pulse}) 100%)` }} />;
};

/* ---------------- 7. share ---------------- */
const Share: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 9], [0, 1], { ...clamp, easing: EASE });
  const fly = interpolate(f, [dur - 16, dur - 2], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const out = interpolate(f, [dur - 5, dur], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: LOW + 20, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }}>
        <div style={{ transform: `translate(${fly * 500}px, ${-fly * 300}px) rotate(${fly * 25}deg)` }}>
          <IconSend size={84} color="#2F6BFF" stroke={2.4} />
        </div>
      </div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 54, color: "white", textShadow: SHADOW, marginTop: 20 }}>{N("Tanishlaringizga yuboring")}</div>
    </div>
  );
};

/* ---------------- 8. subscribe ---------------- */
const Subscribe: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 9], [0, 1], { ...clamp, easing: EASE });
  const clickAt = at(39.82) - at(39.22);
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [4, clickAt - 2], [200, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const heart = spring({ frame: f - clickAt - 6, fps, config: { damping: 8 } });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: LOW + 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: inn, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ transform: `scale(${heart})` }}>
          <IconHeart size={86} />
        </div>
        <div style={{ transform: `scale(${press})`, background: clicked ? "rgba(255,255,255,0.18)" : "#2F6BFF", border: "2px solid rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", color: "white", borderRadius: 999, padding: "24px 52px", fontFamily: MONT, fontWeight: 800, fontSize: 48, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14, boxShadow: clicked ? "none" : "0 14px 36px rgba(47,107,255,0.55)" }}>
          {clicked ? <IconCheck size={44} color="white" stroke={3.2} /> : <IconBell size={44} color="white" stroke={2.6} />}
          {clicked ? N("Obuna bo‘ldingiz") : N("Obuna bo‘ling")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "58%", top: "50%", marginTop: -60, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} /> : null}
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "62%", top: "50%", marginLeft: cur, marginTop: 6, opacity: f < clickAt + 18 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/* ---------------- captions: new alphabet, sliding highlight ---------------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (HIDE_CAPTIONS.some((r) => f >= r.from && f < r.to)) return null;
  const page = PAGES.find((p) => f >= p.from && f < p.to);
  if (!page) return null;
  const enter = spring({ frame: f - page.from, fps, config: { damping: 15, stiffness: 210, mass: 0.6 } });
  const active = page.words.reduce((acc, w, i) => (f >= w.from ? i : acc), 0);
  // On photos with a certificate in the middle, captions move up so they never cover it.
  const onPhoto = [T.student, T.celebrate].some((r) => f >= r.from && f < r.to);
  return (
    <div style={{ position: "absolute", top: onPhoto ? 250 : LOW + 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 880, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", opacity: Math.min(1, enter * 1.5), transform: `translateY(${(1 - enter) * 34}px)` }}>
        {page.words.map((w, i) => {
          const seen = f >= w.from;
          const isA = i === active;
          const k = spring({ frame: f - w.from, fps, config: { damping: 14, stiffness: 260 } });
          // highlight bar grows behind the active word
          const bar = isA ? interpolate(f - w.from, [0, 5], [0, 1], { ...clamp, easing: EASE }) : 0;
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", padding: "0 10px" }}>
              <span style={{ position: "absolute", left: 0, right: 0, top: "12%", bottom: "4%", borderRadius: 16, background: w.key ? YELLOW : "#2F6BFF", transform: `scaleX(${bar})`, transformOrigin: "left center", boxShadow: bar ? "0 8px 24px rgba(0,0,0,0.3)" : "none" }} />
              <span
                style={{
                  position: "relative",
                  fontFamily: MONT,
                  fontWeight: 900,
                  fontSize: 78,
                  lineHeight: 1.15,
                  letterSpacing: -1,
                  color: isA && w.key ? "#111" : w.key && seen ? YELLOW : "white",
                  opacity: seen ? 1 : 0.45,
                  display: "inline-block",
                  transform: `translateY(${seen ? (1 - k) * 18 : 0}px) scale(${isA ? 1 + 0.06 * k : 1})`,
                  WebkitTextStroke: isA ? "0px" : "10px rgba(10,14,30,0.9)",
                  paintOrder: "stroke fill",
                  textShadow: isA ? "none" : "0 6px 20px rgba(0,0,0,0.45)",
                }}
              >
                {N(w.text)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- sound design ---------------- */
const SFX: [number, string, number][] = [
  [0, "buzz.wav", 0.7],
  [3, "sms.wav", 0.9],
  [T.student.from, "rm-whoosh.wav", 0.6],
  [at(8.86), "pop.wav", 0.6],
  [at(8.86), "bass.wav", 0.35],
  [T.crowd.from, "rm-whip.wav", 0.5],
  [T.celebrate.from, "rm-whoosh.wav", 0.6],
  [T.celebrate.from + 2, "rm-ding.wav", 0.35],
  [T.celebrate.to, "rm-whoosh.wav", 0.4],
  [T.logos.from, "rm-whip.wav", 0.55],
  [T.logos.from + 12, "bass.wav", 0.55],
  [T.logos.from + 12, "rm-switch.wav", 0.5],
  [T.minister.from, "rm-shutter-modern.wav", 0.6],
  [T.minister.from + 10, "pop.wav", 0.45],
  [T.stamp.from - 18, "riser.wav", 0.45],
  [T.stamp.from, "rm-page-turn.wav", 0.6],
  [at(27.52), "bass.wav", 0.75],
  [at(27.52), "rm-shutter-modern.wav", 0.5],
  [T.protest.from, "bass.wav", 0.6],
  [T.protest.from, "rm-whoosh.wav", 0.6],
  [T.protest.to, "rm-whoosh.wav", 0.4],
  [T.share.from, "pop.wav", 0.5],
  [T.share.to - 16, "rm-whip.wav", 0.6],
  [T.subscribe.from, "rm-whoosh.wav", 0.5],
  [at(39.82), "rm-mouse-click.wav", 0.8],
  [at(39.82) + 6, "rm-ding.wav", 0.4],
];

const Seq: React.FC<{ name: string; r: { from: number; to: number }; children: React.ReactNode }> = ({ name, r, children }) => (
  <Sequence name={name} from={r.from} durationInFrames={r.to - r.from}>
    {children}
  </Sequence>
);

export const Reel2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Clip 1 hook" src={RAW} muted trimBefore={0} from={0} durationInFrames={126} />
      <Video name="Clip 2" src={RAW} muted trimBefore={141} from={126} durationInFrames={448} />
      <Video name="Clip 3" src={RAW} muted trimBefore={599} from={574} durationInFrames={50} />
      <Video name="Clip 4" src={RAW} muted trimBefore={658} from={624} durationInFrames={198} />
      <Video name="Clip 5" src={RAW} muted trimBefore={866} from={822} durationInFrames={297} />
      <Video name="Clip 6 outro" src={RAW} muted trimBefore={1176} from={1119} durationInFrames={63} />
    </Camera>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 50%, rgba(0,0,0,0.38) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 52%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.12) 100%)" }} />

    <Seq name="A+ sertifikat (rasm)" r={T.student}>
      <ImageBRoll src={R("student.jpg")} dur={d(T.student)} move="in">
        <APlus />
      </ImageBRoll>
    </Seq>
    <Seq name="Olomon (rasm)" r={T.crowd}>
      <ImageBRoll src={R("crowd.jpg")} dur={d(T.crowd)} move="left" />
    </Seq>
    <Seq name="100/100 (rasm)" r={T.celebrate}>
      <ImageBRoll src={R("celebrate.jpg")} dur={d(T.celebrate)} move="in" />
    </Seq>
    <Seq name="Norozilik (rasm)" r={T.protest}>
      <ImageBRoll src={R("protest.jpg")} dur={d(T.protest)} move="right">
        <ProtestFx />
      </ImageBRoll>
    </Seq>

    <Seq name="SMS" r={T.sms}>
      <Sms dur={d(T.sms)} />
    </Seq>
    <Seq name="Vazirliklar" r={T.logos}>
      <Logos dur={d(T.logos)} />
    </Seq>
    <Seq name="Vazir" r={T.minister}>
      <Minister dur={d(T.minister)} />
    </Seq>
    <Seq name="BEKOR? shtampi" r={T.stamp}>
      <Stamp dur={d(T.stamp)} />
    </Seq>
    <Seq name="Ulashish" r={T.share}>
      <Share dur={d(T.share)} />
    </Seq>
    <Seq name="Obuna" r={T.subscribe}>
      <Subscribe dur={d(T.subscribe)} />
    </Seq>

    <Captions />

    <Audio name="Voice 1" src={VOICE} trimBefore={0} from={0} durationInFrames={126} />
    <Audio name="Voice 2" src={VOICE} trimBefore={141} from={126} durationInFrames={448} />
    <Audio name="Voice 3" src={VOICE} trimBefore={599} from={574} durationInFrames={50} />
    <Audio name="Voice 4" src={VOICE} trimBefore={658} from={624} durationInFrames={198} />
    <Audio name="Voice 5" src={VOICE} trimBefore={866} from={822} durationInFrames={297} />
    <Audio name="Voice 6" src={VOICE} trimBefore={1176} from={1119} durationInFrames={63} />
    <Audio name="Music: LoVibe" src={R("music.wav")} volume={0.9} />
    {SFX.map(([f, file, v], i) => (
      <Sequence key={i} from={f} durationInFrames={50} name={`sfx ${file}`}>
        <Audio src={SFXF(file)} volume={v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const REEL2_DURATION = DURATION;
