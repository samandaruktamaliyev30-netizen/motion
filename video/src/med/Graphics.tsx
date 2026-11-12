import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { at, DURATION, OVERLAYS } from "./timeline";
import { M, MONT } from "./ui";
import { IconCheck } from "./extraIcons";

// Minimal, reference-style overlays: white text + one muted sage accent.
// All overlays sit LOW (below the chin); captions are hidden while one is on screen.
const LOW_Y = 1010;

const useFade = (dur: number, delay = 0) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [delay, delay + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const out = interpolate(f, [dur - 7, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(inn, out);
};

const Low: React.FC<{ dur: number; y?: number; children: React.ReactNode }> = ({ dur, y = LOW_Y, children }) => {
  const p = useFade(dur);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

const shadow = "0 4px 18px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.6)";

const Text: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 60, children }) => (
  <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: "white", textShadow: shadow, textAlign: "center" }}>
    {children}
  </div>
);

const NumBox: React.FC<{ n: number; size?: number; delay?: number; dur: number }> = ({ n, size = 112, delay = 0, dur }) => {
  const p = useFade(dur, delay);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: M.sageBox,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 26px rgba(0,0,0,0.3)",
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: size * 0.56, color: "white", lineHeight: 1 }}>{n}</span>
    </div>
  );
};

const ThreeReasons: React.FC<{ dur: number }> = ({ dur }) => (
  <Low dur={dur}>
    <Text size={64}>Buning 3 ta sababi bor</Text>
    <div style={{ display: "flex", gap: 26, marginTop: 26 }}>
      {[1, 2, 3].map((n, i) => (
        <NumBox key={n} n={n} delay={6 + i * 5} dur={dur} />
      ))}
    </div>
  </Low>
);

const Reason: React.FC<{ dur: number; n: number; title: string; sub: string }> = ({ dur, n, title, sub }) => (
  <Low dur={dur}>
    <div style={{ display: "flex", alignItems: "center", gap: 28, width: 920 }}>
      <NumBox n={n} size={128} dur={dur} />
      <div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: "white", textShadow: shadow }}>{title}</div>
        <div style={{ fontFamily: MONT, fontWeight: 600, fontSize: 36, lineHeight: 1.25, color: "rgba(255,255,255,0.85)", textShadow: shadow, marginTop: 8 }}>
          {sub}
        </div>
      </div>
    </div>
  </Low>
);

const Quote: React.FC<{ dur: number }> = ({ dur }) => (
  <Low dur={dur}>
    <div style={{ position: "relative", width: 880, padding: "10px 50px" }}>
      <div style={{ position: "absolute", left: -10, top: -60, fontFamily: "Georgia, serif", fontSize: 190, color: M.sage, lineHeight: 1 }}>“</div>
      <Text size={58}>Mohiyatini va ahamiyatini tushunish kerak</Text>
      <div style={{ position: "absolute", right: -10, bottom: -130, fontFamily: "Georgia, serif", fontSize: 190, color: M.sage, lineHeight: 1 }}>”</div>
    </div>
  </Low>
);

// "Obuna bo‘ling" button → tapped → "Obuna bo‘ldingiz".
const Subscribe: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const clickAt = at(54.4) - at(53.3);
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt - 2, clickAt + 1, clickAt + 7], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tapX = interpolate(f, [4, clickAt - 2], [180, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ripple = interpolate(f, [clickAt, clickAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Low dur={dur} y={1220}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            transform: `scale(${press})`,
            background: clicked ? M.sageBox : "white",
            color: clicked ? "white" : M.ink,
            borderRadius: 999,
            padding: "26px 56px",
            fontFamily: MONT,
            fontWeight: 800,
            fontSize: 48,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
          }}
        >
          {clicked ? <IconCheck size={46} color="white" stroke={3.2} /> : null}
          {clicked ? "Obuna bo‘ldingiz" : "Obuna bo‘ling"}
        </div>
        {/* tap ripple */}
        {f >= clickAt ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 120,
              height: 120,
              marginLeft: 22,
              marginTop: -44,
              borderRadius: 60,
              border: "4px solid white",
              opacity: 1 - ripple,
              transform: `scale(${0.4 + ripple * 1.6})`,
            }}
          />
        ) : null}
        {/* finger-tap cursor */}
        <svg
          width={72}
          height={72}
          viewBox="0 0 24 24"
          style={{ position: "absolute", left: "50%", top: "50%", marginLeft: 70 + tapX, marginTop: 10, opacity: f < clickAt + 18 ? 1 : 0, transform: `scale(${press})` }}
        >
          <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke={M.ink} strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    </Low>
  );
};

export const Graphics: React.FC = () => {
  const [three, r1, r2, r3, quote, sub] = OVERLAYS;
  return (
    <AbsoluteFill>
      <Sequence name="3 ta sabab" from={three[0]} durationInFrames={three[1] - three[0]}>
        <ThreeReasons dur={three[1] - three[0]} />
      </Sequence>
      <Sequence name="1-sabab" from={r1[0]} durationInFrames={r1[1] - r1[0]}>
        <Reason dur={r1[1] - r1[0]} n={1} title="Ta’limda uzviylik buzilgan" sub="Maktab bilimi institut talablariga mos emas" />
      </Sequence>
      <Sequence name="2-sabab" from={r2[0]} durationInFrames={r2[1] - r2[0]}>
        <Reason dur={r2[1] - r2[0]} n={2} title="Javobni biladi, sababini emas" sub="Xatosini isbotlab bera olmaydi" />
      </Sequence>
      <Sequence name="3-sabab" from={r3[0]} durationInFrames={r3[1] - r3[0]}>
        <Reason dur={r3[1] - r3[0]} n={3} title="Amalda qo‘llay olmaydi" sub="Bilim bor, lekin amaliyot yo‘q" />
      </Sequence>
      <Sequence name="Iqtibos" from={quote[0]} durationInFrames={quote[1] - quote[0]}>
        <Quote dur={quote[1] - quote[0]} />
      </Sequence>
      <Sequence name="Obuna tugmasi (past)" from={sub[0]} durationInFrames={DURATION - sub[0]}>
        <Subscribe dur={DURATION - sub[0] + 8} />
      </Sequence>
    </AbsoluteFill>
  );
};
