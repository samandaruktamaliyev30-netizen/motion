import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { CalendarDays, Check, Clock, CreditCard, FileSignature, MessageCircle, Send, X } from "lucide-react";
import { INTER } from "../v4/ui";
import { PAGES } from "./captions";
import { DURATION, FACE, G, s, SHOTS } from "./timeline";

// Monochrome, reference-style overlays: white glass cards above the head, clean white captions
// below the chin. No colour grading on the footage.
const INK = "#0E0F12";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, s0, s1] = shot;
  const sc = interpolate(f, [a, b], [s0, s1], clamp);
  return <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${FACE.cx}px ${FACE.cy}px` }}>{children}</AbsoluteFill>;
};

/* ---------- card shell (top zone, above the head) ---------- */
const Top: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 16, stiffness: 170, mass: 0.6 } });
  const out = p(f, dur - 7, dur);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 120, opacity: Math.min(inn, 1 - out), transform: `translateY(${(1 - inn) * -60 - out * 30}px) scale(${0.94 + 0.06 * inn})`, transformOrigin: "50% 0%" }}>{children}</div>
    </AbsoluteFill>
  );
};
const Card: React.FC<{ children: React.ReactNode; w?: number; style?: React.CSSProperties }> = ({ children, w = 860, style }) => (
  <div style={{ width: w, borderRadius: 34, background: "rgba(255,255,255,0.93)", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", fontFamily: INTER, color: INK, padding: "26px 30px", ...style }}>{children}</div>
);
const IconBox: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark = true }) => (
  <div style={{ width: 76, height: 76, borderRadius: 20, background: dark ? INK : "#EEF0F3", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{children}</div>
);
const Row: React.FC<{ icon: React.ReactNode; title: string; sub?: string; right?: React.ReactNode }> = ({ icon, title, sub, right }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <IconBox>{icon}</IconBox>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>{title}</div>
      {sub ? <div style={{ fontSize: 26, color: "#6B7078", marginTop: 2 }}>{sub}</div> : null}
    </div>
    {right}
  </div>
);
const Tick: React.FC<{ k: number; bad?: boolean }> = ({ k, bad }) => (
  <div style={{ width: 54, height: 54, borderRadius: 27, background: INK, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})` }}>
    {bad ? <X size={32} color="#fff" strokeWidth={3} /> : <Check size={32} color="#fff" strokeWidth={3} />}
  </div>
);
const at = (sec: number, start: number) => s(sec) - s(start);

/* ---------- the cards ---------- */
const Pay: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [at(0.24, 0), at(1.4, 0)], [0, 1500], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <Top dur={dur}>
      <Card>
        <Row icon={<CreditCard size={42} color="#fff" />} title="To‘lov qabul qilindi" sub="Mijoz · hozirgina" right={<div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>+${n.toLocaleString("en-US").replace(",", " ")}</div>} />
      </Card>
    </Top>
  );
};

const Contract: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sign = p(f, at(6.76, 4.26) - 4, at(6.76, 4.26) + 14);
  return (
    <Top dur={dur}>
      <Card>
        <Row icon={<FileSignature size={42} color="#fff" />} title="Shartnoma · Noyabr" sub="Marketing xizmati" right={<div style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1.5 }}>$1 500</div>} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18, paddingTop: 16, borderTop: "1.5px solid #E4E6EA" }}>
          <svg width={300} height={60}>
            <path d="M6 44 C 30 10, 50 10, 58 40 S 90 56, 110 26 S 150 6, 160 38 S 200 50, 220 24 S 270 30, 292 20" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
          </svg>
          <div style={{ flex: 1, fontSize: 26, color: "#6B7078" }}>imzolandi</div>
          <Tick k={p(f, at(7.07, 4.26), at(7.07, 4.26) + 8)} />
        </div>
      </Card>
    </Top>
  );
};

const Month: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fill = p(f, 4, at(8.6, 7.6)) * 28; // "tugayapti"
  const bad = p(f, at(9.36, 7.6), at(9.36, 7.6) + 8);
  return (
    <Top dur={dur}>
      <Card>
        <Row icon={<CalendarDays size={42} color="#fff" />} title="Noyabr" sub={`${Math.round(fill) || 1}-kun · oy tugayapti`} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 7, marginTop: 18 }}>
          {new Array(30).fill(0).map((_, i) => (
            <div key={i} style={{ height: 30, borderRadius: 8, background: i < fill ? INK : "#E4E6EA" }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, opacity: 0.25 + 0.75 * bad }}>
          <Tick k={bad} bad />
          <div style={{ fontSize: 34, fontWeight: 700 }}>Ish hali boshlanmadi</div>
        </div>
      </Card>
    </Top>
  );
};

const Why: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const chip = (t: string, st: number) => {
    const k = p(f, st, st + 8);
    return <div style={{ padding: "20px 34px", borderRadius: 999, background: "rgba(255,255,255,0.93)", fontFamily: INTER, fontWeight: 800, fontSize: 44, color: INK, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>{t}</div>;
  };
  return (
    <Top dur={dur}>
      <div style={{ display: "flex", gap: 22, justifyContent: "center", width: 900 }}>
        {chip("Oilaviymi?", 0)}
        {chip("Shaxsiymi?", at(13.4, 12.44))}
      </div>
      <div style={{ textAlign: "center", marginTop: 18, fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.6)", opacity: p(f, at(14.57, 12.44), at(14.57, 12.44) + 8) }}>[ bilmaymiz ]</div>
    </Top>
  );
};

const TimePaid: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ok = p(f, at(20.84, 19.17), at(20.84, 19.17) + 8);
  return (
    <Top dur={dur}>
      <Card>
        <Row icon={<Clock size={42} color="#fff" style={{ transform: `rotate(${f * 6}deg)` }} />} title="Ketgan vaqt" sub="to‘lov bilan qoplangan" right={<Tick k={ok} />} />
      </Card>
    </Top>
  );
};

const Dec: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const flip = p(f, 0, 14);
  const paid = p(f, at(22.87, 21.96), at(22.87, 21.96) + 8);
  const start = p(f, at(24.09, 21.96), at(24.09, 21.96) + 8);
  return (
    <Top dur={dur}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 150, borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.15)", transform: `perspective(600px) rotateX(${(1 - flip) * 90}deg)`, transformOrigin: "50% 0%" }}>
            <div style={{ background: INK, color: "#fff", fontWeight: 700, fontSize: 24, textAlign: "center", padding: "8px 0", letterSpacing: 2 }}>DEKABR</div>
            <div style={{ background: "#fff", fontWeight: 800, fontSize: 70, textAlign: "center", padding: "4px 0 8px" }}>1</div>
          </div>
          <div style={{ flex: 1 }}>
            {[
              ["Oldindan to‘lov", paid],
              ["Ish dekabrdan boshlanadi", start],
            ].map(([t, k], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", opacity: 0.25 + 0.75 * (k as number) }}>
                <Tick k={k as number} />
                <div style={{ fontSize: 34, fontWeight: 700 }}>{t as string}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Top>
  );
};

const Comment: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const typing = f < 14;
  return (
    <Top dur={dur}>
      <Card w={880}>
        <Row
          icon={<MessageCircle size={42} color="#fff" />}
          title={typing ? "…" : "Sizda ham shunaqa mijoz bormi?"}
          sub="Kommentda yozing"
        />
      </Card>
    </Top>
  );
};

const Share: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fly = Math.sin(f / 6) * 0.5 + 0.5;
  return (
    <Top dur={dur}>
      <Card w={880}>
        <Row icon={<Send size={40} color="#fff" style={{ transform: `translate(${fly * 6}px, ${-fly * 6}px)` }} />} title="Marketolog tanishlaringizga" sub="yuboring" />
      </Card>
    </Top>
  );
};

/* ---------- captions (below the chin) ---------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = PAGES.find((q) => f >= q.from && f < q.to);
  if (!page) return null;
  const exit = interpolate(f, [page.to - 3, page.to], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ top: 1210, height: "auto", alignItems: "center", opacity: exit }}>
      <div style={{ width: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 20px" }}>
        {page.words.map((w, i) => {
          const sp = spring({ frame: f - w.from, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
          const vis = f >= w.from;
          return (
            <span key={i} style={{ display: "inline-block", fontFamily: INTER, fontWeight: w.key ? 800 : 600, fontSize: w.key ? 70 : 62, letterSpacing: -1, color: "#fff", opacity: vis ? sp : 0, transform: `translateY(${(1 - sp) * 16}px)`, filter: `blur(${(1 - Math.min(1, sp)) * 6}px)`, textShadow: "0 3px 14px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.6)" }}>
              {w.key ? (
                <>
                  <span style={{ fontWeight: 300, opacity: 0.7 }}>[ </span>
                  {w.text.replace(/[.,:?!]$/, "")}
                  <span style={{ fontWeight: 300, opacity: 0.7 }}> ]</span>
                </>
              ) : (
                w.text
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CARDS: [keyof typeof G, React.FC<{ dur: number }>][] = [
  ["pay", Pay],
  ["contract", Contract],
  ["month", Month],
  ["why", Why],
  ["time", TimePaid],
  ["dec", Dec],
  ["comment", Comment],
  ["share", Share],
];

export const Oz: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Camera>
      <Video name="Cut (pauses removed)" src={staticFile("oz/cut.mp4")} muted />
    </Camera>
    {/* soft dark gradients only for legibility — no colour change */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 26%, transparent 58%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.15) 100%)" }} />
    {CARDS.map(([k, El]) => {
      const [a, b] = G[k];
      return (
        <Sequence key={k} name={`Card: ${k}`} from={s(a)} durationInFrames={s(b) - s(a)}>
          <El dur={s(b) - s(a)} />
        </Sequence>
      );
    })}
    <Captions />
    <Audio name="Voice (cleaned)" src={staticFile("oz/voice.wav")} />
    <Audio name="Music: ICEGERGERT – Aktrisa (from 4 s)" src={staticFile("oz/music.wav")} />
  </AbsoluteFill>
);

export { DURATION };
