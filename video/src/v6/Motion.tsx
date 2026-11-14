import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER } from "../shared/StyleCaptions";
import { toNewAlphabet as N } from "../kiut2/alphabet";
import { IconBell, IconCheck, IconSend } from "../reel/Icons";
import { LOW } from "./timeline";

// House look: white Inter, frosted dark glass, thin white line art.
// Two quiet accents only: warm (heat) and cool (water).
const WARM = "#FFB347";
const COOL = "#7FD8FF";
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "0 3px 6px rgba(0,0,0,0.45), 0 8px 26px rgba(0,0,0,0.5)";
const glass: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(14,18,28,0.66), rgba(14,18,28,0.44))",
  backdropFilter: "blur(16px) saturate(1.3)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const useIO = (dur: number, inF = 9, outF = 7) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { ...clamp, easing: EASE }),
    interpolate(f, [dur - outF, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }),
  );
};

const Low: React.FC<{ dur: number; children: React.ReactNode; top?: number }> = ({ dur, children, top = LOW }) => {
  const p = useIO(dur);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      {children}
    </div>
  );
};

const Rise: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [delay, delay + 12], [0, 1], { ...clamp, easing: EASE });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0 8px 10px" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - k) * 110}%)`, opacity: k, ...style }}>{children}</span>
    </span>
  );
};

/* ---------- steam wisps (decor) ---------- */
const Steam: React.FC<{ x: number; y: number; n?: number }> = ({ x, y, n = 7 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const t = ((f + i * 13) % 60) / 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin((f + i * 20) * 0.06) * 40 + (i - n / 2) * 18,
              top: y - t * 320,
              width: 90 + t * 120,
              height: 90 + t * 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)",
              filter: "blur(10px)",
              opacity: Math.sin(t * Math.PI) * 0.8,
            }}
          />
        );
      })}
    </>
  );
};

/* ---------- 1. title: "Çoy nega sekin qaynaydi?" (first 3 s) ---------- */
export const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // "sekin" types itself slowly — the word acts out its meaning
  const sekin = "sekin";
  const shown = Math.floor(interpolate(f, [12, 50], [0, sekin.length], clamp));
  const bar = interpolate(f, [12, 80], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `scale(${1 + out * 0.06})`, filter: `blur(${out * 8}px)` }}>
      <Steam x={460} y={520} />
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 1, color: "white", letterSpacing: -5, textShadow: SHADOW }}>
        <Rise delay={0}>{N("Choy")}</Rise>
        <Rise delay={4}>nega</Rise>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 1, color: WARM, letterSpacing: interpolate(f, [12, 60], [-5, 10], clamp), textShadow: SHADOW, marginTop: 4, height: 160 }}>
        {sekin.slice(0, shown)}
        <span style={{ opacity: shown < sekin.length && f % 16 < 8 ? 1 : 0, color: "white" }}>|</span>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 112, lineHeight: 1, color: "white", letterSpacing: -3, textShadow: SHADOW }}>
        <Rise delay={14}>qaynaydi?</Rise>
      </div>
      {/* slow "loading" bar */}
      <div style={{ width: 520, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.22)", marginTop: 26, overflow: "hidden" }}>
        <div style={{ width: `${bar * 100}%`, height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${WARM}, #FF6B3D)` }} />
      </div>
    </div>
  );
};

/* ---------- 2. "Mif yoki rost?" toggle ---------- */
export const Myth: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 13, stiffness: 170 } });
  const out = interpolate(f, [dur - 7, dur], [1, 0], clamp);
  const knob = (Math.sin(f * 0.18) + 1) / 2; // swings between MIF and ROST
  const W = 640;
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.4) * out, transform: `scale(${0.85 + 0.15 * s})` }}>
      <div style={{ ...glass, position: "relative", width: W, height: 150, borderRadius: 75, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 70px" }}>
        <div style={{ position: "absolute", top: 12, left: 12 + knob * (W - 24 - 300), width: 300, height: 126, borderRadius: 63, background: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }} />
        <span style={{ position: "relative", fontFamily: INTER, fontWeight: 900, fontSize: 64, color: knob < 0.5 ? "#111" : "white" }}>MIF</span>
        <span style={{ position: "relative", fontFamily: INTER, fontWeight: 900, fontSize: 64, color: knob >= 0.5 ? "#111" : "white" }}>ROST</span>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 52, color: "white", marginTop: 22, textShadow: SHADOW }}>yoki…?</div>
    </div>
  );
};

/* ---------- 3. boiling race: Toshkent vs Xorazm / Qoraqalpog‘iston ---------- */
const RaceRow: React.FC<{ label: string; progress: number; done: boolean; color: string; sub: string }> = ({ label, progress, done, color, sub }) => (
  <div style={{ width: "100%" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: INTER, color: "white", marginBottom: 10 }}>
      <span style={{ fontWeight: 800, fontSize: 42 }}>{N(label)}</span>
      <span style={{ fontWeight: 700, fontSize: 32, color: done ? color : "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 8 }}>
        {done ? <IconCheck size={34} color={color} stroke={3.2} /> : null}
        {N(sub)}
      </span>
    </div>
    <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
      <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 15, background: `linear-gradient(90deg, ${color}AA, ${color})`, boxShadow: `0 0 18px ${color}88` }} />
    </div>
  </div>
);

export const Race: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fast = interpolate(f, [10, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const slow = interpolate(f, [10, dur], [0, 0.48], clamp);
  const secs = Math.floor(interpolate(f, [10, dur], [0, 9], clamp));
  return (
    <Low dur={dur}>
      <div style={{ ...glass, width: 920, borderRadius: 40, padding: "30px 36px", display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: INTER, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,0.7)", letterSpacing: 3 }}>
          <span>{N("QAYNASH TEZLIGI")}</span>
          <span>⏱ 00:0{secs}</span>
        </div>
        <RaceRow label="Toshkent" progress={fast} done={fast >= 1} color={COOL} sub={fast >= 1 ? "qaynadi" : "qaynamoqda…"} />
        <RaceRow label="Xorazm · Qoraqalpog‘iston" progress={slow} done={false} color={WARM} sub="sekin…" />
      </div>
    </Low>
  );
};

/* ---------- 4. dissolved salts ---------- */
export const Salts: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Low dur={dur}>
      <div style={{ position: "relative", width: 700, height: 250 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 100, borderRadius: "0 0 40px 40px", background: `linear-gradient(180deg, ${COOL}55, ${COOL}22)`, borderTop: `4px solid ${COOL}` }} />
        {Array.from({ length: 9 }).map((_, i) => {
          const t0 = i * 4;
          const fall = interpolate(f, [t0, t0 + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
          const melt = interpolate(f, [t0 + 14, t0 + 30], [1, 0], clamp);
          return <div key={i} style={{ position: "absolute", left: 60 + i * 66, top: -40 + fall * 200, width: 34 * melt, height: 34 * melt, background: "white", borderRadius: 6, transform: `rotate(${f * 4 + i * 30}deg)`, opacity: melt, boxShadow: "0 0 12px rgba(255,255,255,0.6)" }} />;
        })}
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: "white", marginTop: 10, textShadow: SHADOW }}>Erigan tuzlar</div>
    </Low>
  );
};

/* ---------- 5. Ca²⁺ / Mg²⁺ ions in water ---------- */
export const Ions: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const R = 190;
  const ions = ["Ca²⁺", "Mg²⁺", "Ca²⁺", "Mg²⁺", "Ca²⁺", "Mg²⁺", "Ca²⁺"];
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", width: 2 * R, height: 2 * R, borderRadius: R, overflow: "hidden", border: "4px solid rgba(255,255,255,0.85)", background: `radial-gradient(circle at 40% 30%, ${COOL}40, rgba(14,18,28,0.6))` }}>
          {ions.map((t, i) => {
            const a = i * 0.9 + f * 0.03 * (i % 2 ? 1 : -1);
            const rr = 60 + (i % 3) * 45;
            const k = interpolate(f, [i * 5, i * 5 + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
            return (
              <div key={i} style={{ position: "absolute", left: R + Math.cos(a) * rr - 46, top: R + Math.sin(a) * rr - 46, width: 92, height: 92, borderRadius: 46, background: t.startsWith("Ca") ? "rgba(255,255,255,0.92)" : `${COOL}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 30, color: "#0E1420", transform: `scale(${k})`, boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }}>
                {t}
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: INTER, color: "white", textShadow: SHADOW }}>
          <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.1 }}>Kalsiy va</div>
          <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.1 }}>magniy ionlari</div>
          <div style={{ fontWeight: 600, fontSize: 36, marginTop: 14, color: "rgba(255,255,255,0.85)" }}>= suvning qattiqligi</div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- 6. Raoult's law / ebullioscopy ---------- */
export const Raoult: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const formula = "ΔT = K · m";
  const n = Math.floor(interpolate(f, [12, 36], [0, formula.length], clamp));
  return (
    <Low dur={dur}>
      <div style={{ ...glass, borderRadius: 40, padding: "30px 50px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "rgba(255,255,255,0.7)" }}>KIMYO</div>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 76, color: "white", marginTop: 6 }}>Raul qonuni</div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 40, color: WARM, marginTop: 4 }}>ebulioskopiya</div>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 58, color: "white", marginTop: 18, height: 70 }}>
          {formula.slice(0, n)}
          <span style={{ opacity: f % 14 < 7 && n < formula.length ? 1 : 0 }}>|</span>
        </div>
      </div>
    </Low>
  );
};

/* ---------- 7. thermometer: 100 °C → higher ---------- */
export const Thermo: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [8, dur - 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const temp = 100 + t * 4;
  const strike = interpolate(f, [4, 14], [0, 1], { ...clamp, easing: EASE });
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 46 }}>
        <div style={{ position: "relative", width: 70, height: 360 }}>
          <div style={{ position: "absolute", left: 15, top: 0, width: 40, height: 300, borderRadius: 20, border: "4px solid white", background: "rgba(14,18,28,0.5)" }} />
          <div style={{ position: "absolute", left: 25, bottom: 50, width: 20, height: 150 + t * 120, borderRadius: 10, background: `linear-gradient(180deg, #FF5A3D, ${WARM})` }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 70, height: 70, borderRadius: 35, background: "#FF5A3D", border: "4px solid white" }} />
        </div>
        <div style={{ fontFamily: INTER, color: "white", textShadow: SHADOW }}>
          <div style={{ position: "relative", display: "inline-block", fontWeight: 700, fontSize: 60, color: "rgba(255,255,255,0.7)" }}>
            100 °C
            <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, borderRadius: 3, background: "#FF5A3D", transform: `scaleX(${strike})`, transformOrigin: "left" }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 1, color: WARM, letterSpacing: -4 }}>{temp.toFixed(1).replace(".", ",")}°</div>
          <div style={{ fontWeight: 600, fontSize: 38, marginTop: 8 }}>{N("qaynash harorati oshadi")}</div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- 8. guests: tea boiled well in advance ---------- */
export const Guests: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const R = 130;
  return (
    <Low dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", width: 2 * R, height: 2 * R, borderRadius: R, border: "6px solid white", background: "rgba(14,18,28,0.5)" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: R - 3, top: 10, width: 6, height: 18, borderRadius: 3, background: "rgba(255,255,255,0.7)", transformOrigin: `3px ${R - 10}px`, transform: `rotate(${i * 30}deg)` }} />
          ))}
          <div style={{ position: "absolute", left: R - 4, top: R - 90, width: 8, height: 90, borderRadius: 4, background: "white", transformOrigin: "4px 90px", transform: `rotate(${f * 12}deg)` }} />
          <div style={{ position: "absolute", left: R - 5, top: R - 60, width: 10, height: 60, borderRadius: 5, background: WARM, transformOrigin: "5px 60px", transform: `rotate(${f * 1}deg)` }} />
          <div style={{ position: "absolute", left: R - 12, top: R - 12, width: 24, height: 24, borderRadius: 12, background: "white" }} />
        </div>
        <div style={{ fontFamily: INTER, color: "white", textShadow: SHADOW, maxWidth: 520 }}>
          <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.1 }}>{N("Mehmon kelishidan")}</div>
          <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.1, color: WARM }}>ancha oldin</div>
          <div style={{ fontWeight: 600, fontSize: 38, marginTop: 10 }}>{N("choy qaynatib qo‘yiladi")}</div>
        </div>
      </div>
    </Low>
  );
};

/* ---------- 9. Tashkent boils faster ---------- */
export const Fast: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Low dur={dur}>
      <div style={{ ...glass, width: 860, borderRadius: 40, padding: "30px 36px" }}>
        <RaceRow label="Toshkent" progress={p} done={p >= 1} color={COOL} sub={p >= 1 ? "tezroq qaynaydi" : "yumshoq suv"} />
      </div>
    </Low>
  );
};

/* ---------- 10. share + subscribe ---------- */
export const Subscribe: React.FC<{ dur: number; clickAt: number }> = ({ dur, clickAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: EASE });
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], clamp);
  const cur = interpolate(f, [16, clickAt - 2], [220, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 14], [0, 1], clamp);
  const share = spring({ frame: f - 4, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top: LOW + 20, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: inn, transform: `translateY(${(1 - inn) * 30}px)` }}>
      <div style={{ ...glass, borderRadius: 999, padding: "16px 30px", display: "flex", alignItems: "center", gap: 14, transform: `scale(${share})` }}>
        <IconSend size={40} color="white" stroke={2.2} />
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38, color: "white" }}>{N("Do‘stlaringizga ulashing")}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `scale(${press})`, background: clicked ? "rgba(255,255,255,0.16)" : "white", border: "2px solid white", backdropFilter: "blur(10px)", color: clicked ? "white" : "#111", borderRadius: 999, padding: "26px 60px", fontFamily: INTER, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}>
          {clicked ? <IconCheck size={46} color="white" stroke={3.2} /> : <IconBell size={46} color="#111" stroke={2.4} />}
          {clicked ? N("Obuna bo‘ldingiz") : N("Obuna bo‘ling")}
        </div>
        {clicked ? <div style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 22, marginTop: -44, width: 120, height: 120, borderRadius: 60, border: "4px solid white", opacity: 1 - ripple, transform: `scale(${0.4 + ripple * 1.6})` }} /> : null}
        <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 70 + cur, marginTop: 10, opacity: f < clickAt + 20 ? 1 : 0, transform: `scale(${press})` }}>
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
