import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconBrain, IconCalendar, IconCert, IconUser } from "../reel/Icons";

// Motion inserts in the house look: white Inter, frosted dark glass, thin white line icons.
// All sit LOW (below the chin); the caller hides subtitles while one is on screen.
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
export const MOTION_TOP = 960;

const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.66), rgba(14,18,28,0.44))",
  backdropFilter: "blur(16px) saturate(1.3)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const useInOut = (dur: number, inF = 9, outF = 6) => {
  const f = useCurrentFrame();
  const i = interpolate(f, [0, inF], [0, 1], { ...clamp, easing: EASE });
  const o = interpolate(f, [dur - outF, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return Math.min(i, o);
};

const Tile: React.FC<{ icon: React.ReactNode; label: string; delay: number; dur: number; strike?: boolean }> = ({ icon, label, delay, dur, strike }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 170 } });
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.4) * out, transform: `translateY(${(1 - s) * 50}px) scale(${0.85 + 0.15 * s})` }}>
      <div style={{ ...glass, width: 230, height: 230, borderRadius: 52, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {icon}
        {strike ? <div style={{ position: "absolute", width: 6, height: 260, background: "white", borderRadius: 3, transform: "rotate(45deg)", opacity: 0 }} /> : null}
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, color: "white", marginTop: 18, textShadow: SHADOW }}>{label}</div>
    </div>
  );
};

/* 1. "Sertifikat ≠ Bilim" */
export const NotEqual: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eq = spring({ frame: f - 10, fps, config: { damping: 9, stiffness: 220 } });
  const slash = interpolate(f, [16, 24], [0, 1], { ...clamp, easing: EASE });
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: MOTION_TOP, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 34 }}>
      <Tile icon={<IconCert size={130} color="white" stroke={1.6} />} label="Sertifikat" delay={0} dur={dur} />
      <div style={{ position: "relative", width: 130, height: 230, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, eq) * out, transform: `scale(${eq})` }}>
        <div style={{ position: "absolute", width: 110, height: 12, borderRadius: 6, background: "white", top: 92 }} />
        <div style={{ position: "absolute", width: 110, height: 12, borderRadius: 6, background: "white", top: 126 }} />
        <div style={{ position: "absolute", width: 12, height: 170 * slash, borderRadius: 6, background: "#FF5A5F", transform: "rotate(28deg)", boxShadow: "0 0 18px rgba(255,90,95,0.7)" }} />
      </div>
      <Tile icon={<IconBrain size={130} color="white" stroke={1.6} />} label="Bilim" delay={6} dur={dur} />
    </div>
  );
};

/* 2. "Sertifikatli / Sertifikatsiz" comparison */
const CompareCard: React.FC<{ title: string; sub: string; delay: number; withCert: boolean; dur: number }> = ({ title, sub, delay, withCert, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 15, stiffness: 160 } });
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <div style={{ ...glass, width: 430, borderRadius: 40, padding: "30px 26px", display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.4) * out, transform: `translateY(${(1 - s) * 60}px) rotate(${(1 - s) * (withCert ? -6 : 6)}deg)` }}>
      <div style={{ position: "relative" }}>
        <IconUser size={120} color="white" stroke={1.6} />
        <div style={{ position: "absolute", right: -26, bottom: -6, width: 70, height: 70, borderRadius: 35, background: withCert ? "white" : "rgba(255,255,255,0.12)", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {withCert ? <IconCert size={42} color="#111" stroke={2} /> : <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "white", lineHeight: 1 }}>–</span>}
        </div>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 48, color: "white", marginTop: 22, textShadow: SHADOW }}>{title}</div>
      <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>{N(sub)}</div>
    </div>
  );
};

export const Compare: React.FC<{ dur: number; secondAt: number }> = ({ dur, secondAt }) => (
  <div style={{ position: "absolute", top: MOTION_TOP, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
    <CompareCard title="Sertifikatli" sub="o‘qitib ko‘ryapman" delay={0} withCert dur={dur} />
    <CompareCard title="Sertifikatsiz" sub="o‘qitib ko‘ryapman" delay={secondAt} withCert={false} dur={dur} />
  </div>
);

/* 3. the student's chat message */
export const ChatBubble: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useInOut(dur);
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 170 } });
  const typing = f < 16;
  const text = N("Voy, ustoz, sertifikatni ancha oldin olganman… esimdan chiqib ketibdi");
  const chars = Math.round(interpolate(f, [16, 70], [0, text.length], clamp));
  return (
    <div style={{ position: "absolute", top: MOTION_TOP + 10, left: 70, right: 70, display: "flex", alignItems: "flex-end", gap: 18, opacity: p, transform: `translateY(${(1 - s) * 50}px)` }}>
      <div style={{ ...glass, width: 96, height: 96, borderRadius: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <IconUser size={58} color="white" stroke={1.8} />
      </div>
      <div style={{ ...glass, borderRadius: "40px 40px 40px 12px", padding: "24px 32px", transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: "left bottom", minWidth: 200 }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Talaba</div>
        {typing ? (
          <div style={{ display: "flex", gap: 10, padding: "8px 0" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "white", opacity: 0.35 + 0.65 * Math.abs(Math.sin((f + i * 4) * 0.5)) }} />
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 46, lineHeight: 1.25, color: "white" }}>
            «{text.slice(0, chars)}
            <span style={{ opacity: chars < text.length ? 1 : 0 }}>|</span>
            {chars >= text.length ? "»" : ""}
          </div>
        )}
      </div>
    </div>
  );
};

/* 4. "3 YIL" — validity period */
export const ThreeYears: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useInOut(dur, 7, 5);
  const s = spring({ frame: f, fps, config: { damping: 10, stiffness: 200 } });
  const ring = interpolate(f, [2, 20], [0, 1], { ...clamp, easing: EASE });
  const R = 120;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", top: MOTION_TOP, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 34, opacity: p }}>
      <div style={{ position: "relative", width: 2 * R + 20, height: 2 * R + 20, transform: `scale(${0.7 + 0.3 * s})` }}>
        <svg width={2 * R + 20} height={2 * R + 20} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={R + 10} cy={R + 10} r={R} fill="rgba(14,18,28,0.55)" stroke="rgba(255,255,255,0.2)" strokeWidth={6} />
          <circle cx={R + 10} cy={R + 10} r={R} fill="none" stroke="white" strokeWidth={8} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconCalendar size={110} color="white" stroke={1.7} />
        </div>
      </div>
      <div style={{ transform: `translateX(${(1 - s) * 40}px)` }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 170, lineHeight: 0.9, color: "white", letterSpacing: -6, textShadow: SHADOW }}>3 YIL</div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, color: "rgba(255,255,255,0.88)", marginTop: 10, textShadow: SHADOW }}>{N("sertifikat muddati")}</div>
      </div>
    </div>
  );
};
