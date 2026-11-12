import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { at, BOARD2, DURATION } from "./timeline";
import { Badge, GRAD, Glass, Heading, M, MONT, Small, Tile, TopCard, usePresence } from "./ui";
import {
  IconBell,
  IconBrain,
  IconBulb,
  IconCheck,
  IconFlask,
  IconGradCap,
  IconHeart,
  IconLinkBroken,
  IconQuestion,
  IconSend,
  IconStethoscope,
  IconTest,
  IconX,
} from "./extraIcons";

/* Intro chip right after the title */
const Intro: React.FC<{ dur: number }> = ({ dur }) => (
  <TopCard dur={dur}>
    <Glass>
      <Tile bg={GRAD.mint} size={92}>
        <IconGradCap size={58} color="white" />
      </Tile>
      <div>
        <Heading>Katta ball bilan kirdi…</Heading>
        <Small>…lekin o‘qish qiyin bo‘lyapti</Small>
      </div>
    </Glass>
  </TopCard>
);

/* "3 reasons" row */
const ThreeReasons: React.FC<{ dur: number }> = ({ dur }) => {
  const grads = [GRAD.sky, GRAD.violet, GRAD.amber];
  return (
    <TopCard dur={dur}>
      <Glass style={{ gap: 26 }}>
        <Heading size={46}>3 ta sabab</Heading>
        {[1, 2, 3].map((n, i) => (
          <NumTile key={n} n={n} bg={grads[i]} delay={6 + i * 6} dur={dur} />
        ))}
      </Glass>
    </TopCard>
  );
};

const NumTile: React.FC<{ n: number; bg: string; delay: number; dur: number; size?: number }> = ({ n, bg, delay, dur, size = 92 }) => {
  const p = usePresence(dur, delay, 1);
  return (
    <div style={{ transform: `scale(${p}) rotate(${(1 - p) * -40}deg)` }}>
      <Tile bg={bg} size={size}>
        <span style={{ fontFamily: MONT, fontWeight: 900, fontSize: size * 0.58, color: "white", lineHeight: 1 }}>{n}</span>
      </Tile>
    </div>
  );
};

/* Reason card: number tile + title + subtitle + progress dots */
const Reason: React.FC<{
  dur: number;
  n: number;
  bg: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}> = ({ dur, n, bg, icon, title, sub }) => {
  const f = useCurrentFrame();
  const subIn = interpolate(f, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <TopCard dur={dur}>
      <Glass style={{ width: 970, alignItems: "flex-start" }}>
        <div style={{ position: "relative" }}>
          <Tile bg={bg} size={110}>
            {icon}
          </Tile>
          <div
            style={{
              position: "absolute",
              right: -12,
              bottom: -12,
              width: 52,
              height: 52,
              borderRadius: 26,
              background: M.white,
              color: M.ink,
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }}
          >
            {n}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: M.mint }}>{n}-SABAB</span>
            {[1, 2, 3].map((k) => (
              <div key={k} style={{ width: k === n ? 34 : 12, height: 12, borderRadius: 6, background: k <= n ? M.mint : "rgba(255,255,255,0.25)" }} />
            ))}
          </div>
          <Heading size={46}>{title}</Heading>
          <div style={{ opacity: subIn, transform: `translateY(${(1 - subIn) * 12}px)` }}>
            <Small>{sub}</Small>
          </div>
        </div>
      </Glass>
    </TopCard>
  );
};

/* Check / cross row used in lists */
const Row: React.FC<{ ok: boolean; text: string; delay: number; dur: number }> = ({ ok, text, delay, dur }) => {
  const p = usePresence(dur, delay, 1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -50}px)` }}>
      <Tile bg={ok ? GRAD.mint : GRAD.coral} size={58}>
        {ok ? <IconCheck size={34} color="white" stroke={3.2} /> : <IconX size={30} color="white" stroke={3.2} />}
      </Tile>
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: "white" }}>{text}</span>
    </div>
  );
};

const PHCard: React.FC<{ dur: number }> = ({ dur }) => (
  <TopCard dur={dur}>
    <Glass style={{ width: 880, flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Tile bg={GRAD.sky} size={70}>
          <IconFlask size={42} color="white" />
        </Tile>
        <Heading size={40}>Masalan: pH</Heading>
      </div>
      <Row ok text="pH qiymatini topa oladi" delay={6} dur={dur} />
      <Row ok={false} text="Amaliy ahamiyatini bilmaydi" delay={at(39.96) - BOARD2.to} dur={dur} />
    </Glass>
  </TopCard>
);

const Medicine: React.FC<{ dur: number }> = ({ dur }) => (
  <TopCard dur={dur}>
    <Glass style={{ width: 880 }}>
      <Tile bg={GRAD.coral} size={100}>
        <IconStethoscope size={62} color="white" />
      </Tile>
      <div>
        <Heading size={44}>Tibbiyotda quruq bilim yetmaydi</Heading>
        <Small>quruq masala ✕ · quruq test ✕</Small>
      </div>
    </Glass>
  </TopCard>
);

const Essence: React.FC<{ dur: number }> = ({ dur }) => (
  <TopCard dur={dur}>
    <Glass style={{ width: 860, flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      <Heading size={40}>Asosiysi — tushunish:</Heading>
      <div style={{ display: "flex", gap: 16 }}>
        <Chip delay={at(47.2) - at(46.48)} dur={dur} bg={GRAD.violet} icon={<IconBrain size={38} color="white" />} text="Mohiyatini" />
        <Chip delay={at(48.86) - at(46.48)} dur={dur} bg={GRAD.amber} icon={<IconBulb size={38} color="white" />} text="Ahamiyatini" />
      </div>
    </Glass>
  </TopCard>
);

const Chip: React.FC<{ delay: number; dur: number; bg: string; icon: React.ReactNode; text: string }> = ({ delay, dur, bg, icon, text }) => {
  const p = usePresence(dur, delay, 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 22px 10px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.1)",
        border: "1.5px solid rgba(255,255,255,0.2)",
        opacity: p,
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      <Tile bg={bg} size={60} style={{ borderRadius: 30 }}>
        {icon}
      </Tile>
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 38, color: "white" }}>{text}</span>
    </div>
  );
};

const Share: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const flyAt = at(52.74) - at(49.8);
  const fly = interpolate(f, [flyAt, flyAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <TopCard dur={dur}>
      <Glass style={{ width: 880, overflow: "visible" }}>
        <Tile bg={GRAD.sky} size={100} style={{ overflow: "visible" }}>
          <div style={{ transform: `translate(${fly * 520}px, ${-fly * 240}px) rotate(${fly * 25}deg)`, opacity: 1 - fly * 0.7 }}>
            <IconSend size={60} color="white" />
          </div>
        </Tile>
        <div>
          <Heading size={44}>Foydali bo‘lsa — yuboring</Heading>
          <Small>Abituriyent tanishlaringizga</Small>
        </div>
      </Glass>
    </TopCard>
  );
};

/* Subscribe — placed LOW (below the chin), like reference 2 */
const Subscribe: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePresence(dur, 0, 4);
  const clickAt = at(54.4) - at(53.3);
  const clicked = f >= clickAt;
  const press = interpolate(f, [clickAt, clickAt + 3, clickAt + 8], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heart = spring({ frame: f - clickAt - 3, fps, config: { damping: 8 } });
  const cursor = interpolate(f, [4, clickAt], [220, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        top: 1180,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 120}px)`,
      }}
    >
      <Glass style={{ width: 860, justifyContent: "space-between", borderRadius: 999, padding: "16px 18px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ padding: 5, borderRadius: 60, background: "conic-gradient(from 0deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5, #FEDA75)" }}>
            <Tile bg={GRAD.mint} size={84} style={{ borderRadius: 42, border: "4px solid #0B1220" }}>
              <IconGradCap size={48} color="white" />
            </Tile>
          </div>
          <div>
            <Heading size={36}>Bizning sahifa</Heading>
            <Small>Ta’lim · Tibbiyot</Small>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ transform: `scale(${heart})`, width: 52 }}>
            <IconHeart size={52} />
          </div>
          <div
            style={{
              transform: `scale(${press})`,
              background: clicked ? "rgba(255,255,255,0.16)" : "linear-gradient(135deg,#4F8BFF,#2563EB)",
              borderRadius: 999,
              padding: "18px 28px",
              whiteSpace: "nowrap",
              fontFamily: MONT,
              fontWeight: 900,
              fontSize: 31,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: clicked ? "none" : "0 10px 26px rgba(37,99,235,0.55)",
            }}
          >
            {clicked ? <IconCheck size={32} color={M.mint} stroke={3.4} /> : <IconBell size={32} color="white" stroke={2.6} />}
            {clicked ? "Obunadasiz" : "Obuna bo‘ling"}
          </div>
          <svg
            width={60}
            height={60}
            viewBox="0 0 24 24"
            style={{ position: "absolute", right: 40 - cursor, bottom: -38, transform: `scale(${press})`, opacity: f < clickAt + 20 ? 1 : 0 }}
          >
            <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke={M.ink} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        </div>
      </Glass>
    </div>
  );
};

export const Graphics: React.FC = () => {
  const r1 = at(6.1);
  const r2 = at(14.14);
  const r3 = at(24.68);
  const ph = BOARD2.to;
  const med = at(42.26);
  const ess = at(46.48);
  const sh = at(49.8);
  const sub = at(53.3);
  return (
    <AbsoluteFill>
      <Sequence name="Intro chip" from={at(3.0)} durationInFrames={at(4.64) - at(3.0)}>
        <Intro dur={at(4.64) - at(3.0)} />
      </Sequence>
      <Sequence name="3 reasons" from={at(4.64)} durationInFrames={r1 - at(4.64)}>
        <ThreeReasons dur={r1 - at(4.64)} />
      </Sequence>
      <Sequence name="Reason 1" from={r1} durationInFrames={r2 - r1}>
        <Reason dur={r2 - r1} n={1} bg={GRAD.sky} icon={<IconLinkBroken size={64} color="white" />} title="Ta’limda uzviylik yo‘q" sub="Maktab bilimi institut talablariga mos emas" />
      </Sequence>
      <Sequence name="Reason 2" from={r2} durationInFrames={r3 - r2}>
        <Reason dur={r3 - r2} n={2} bg={GRAD.violet} icon={<IconTest size={64} color="white" />} title="Javobni biladi, sababini emas" sub="Xatosini isbotlab bera olmaydi" />
      </Sequence>
      <Sequence name="✓ right answer" from={at(17.24)} durationInFrames={r3 - at(17.24)}>
        <Badge x={930} y={720} dur={r3 - at(17.24)} bg={GRAD.mint} size={120} rotate={10}>
          <IconCheck size={70} color="white" stroke={3.2} />
        </Badge>
      </Sequence>
      <Sequence name="? why wrong" from={at(20.98)} durationInFrames={r3 - at(20.98)}>
        <Badge x={150} y={760} dur={r3 - at(20.98)} bg={GRAD.coral} size={120} rotate={-10}>
          <IconQuestion size={72} color="white" stroke={3} />
        </Badge>
      </Sequence>
      <Sequence name="Reason 3" from={r3} durationInFrames={BOARD2.from - r3}>
        <Reason dur={BOARD2.from - r3} n={3} bg={GRAD.amber} icon={<IconFlask size={64} color="white" />} title="Amalda qo‘llay olmaydi" sub="Bilim bor — amaliyot yo‘q" />
      </Sequence>
      <Sequence name="Brain badge" from={at(28.7)} durationInFrames={BOARD2.from - at(28.7)}>
        <Badge x={930} y={740} dur={BOARD2.from - at(28.7)} bg={GRAD.violet} size={116} rotate={8}>
          <IconBrain size={66} color="white" />
        </Badge>
      </Sequence>
      <Sequence name="pH card" from={ph} durationInFrames={med - ph}>
        <PHCard dur={med - ph} />
      </Sequence>
      <Sequence name="Medicine" from={med} durationInFrames={ess - med}>
        <Medicine dur={ess - med} />
      </Sequence>
      <Sequence name="Essence" from={ess} durationInFrames={sh - ess}>
        <Essence dur={sh - ess} />
      </Sequence>
      <Sequence name="Share" from={sh} durationInFrames={sub - sh}>
        <Share dur={sub - sh} />
      </Sequence>
      <Sequence name="Subscribe (low)" from={sub} durationInFrames={DURATION - sub}>
        <Subscribe dur={DURATION - sub + 4} />
      </Sequence>
    </AbsoluteFill>
  );
};
