import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, Card, fontFamily, IconBubble, Pop, Sticker, usePresence } from "./ui";
import {
  IconBell,
  IconBolt,
  IconBuilding,
  IconCalendar,
  IconCert,
  IconCheck,
  IconFire,
  IconHeart,
  IconMegaphone,
  IconQuestion,
  IconQuote,
  IconSend,
  IconTrash,
  IconUser,
  IconUsers,
  IconWarning,
  IconWrench,
  IconX,
} from "./Icons";

// Layout zones (1080x1920). Face is at y 600-1050 even at max zoom,
// so cards live ABOVE the head and stickers beside it, captions below the chin.
const TOP_Y = 250;

const TopRow: React.FC<{ children: React.ReactNode; y?: number }> = ({ children, y = TOP_Y }) => (
  <AbsoluteFill style={{ top: y, height: "auto", alignItems: "center" }}>
    <div style={{ position: "relative", display: "flex", justifyContent: "center", width: "100%" }}>
      {children}
    </div>
  </AbsoluteFill>
);

const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 46,
  color = C.ink,
}) => (
  <div style={{ fontFamily, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, letterSpacing: -0.5 }}>
    {children}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: "#5B6480", marginTop: 6 }}>{children}</div>
);

const TextBadge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ fontFamily, fontWeight: 900, fontSize: 64, color, lineHeight: 1 }}>{text}</div>
);

/* ---------- 1. Hook: phone notification ---------- */
const Notification: React.FC = () => (
  <TopRow>
    <Pop dur={44} from="top" style={{ position: "relative" }}>
      <Card style={{ width: 860, padding: "24px 28px", borderRadius: 40 }}>
        <IconBubble bg={C.green} size={92}>
          <IconQuestion size={58} color="white" stroke={2.8} />
        </IconBubble>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 28, color: "#7A8299" }}>
            <span>Talaba</span>
            <span>hozir</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 40, marginTop: 4 }}>Milliy sertifikat bekor bo‘ladimi?</div>
        </div>
      </Card>
    </Pop>
  </TopRow>
);

/* ---------- 2. Hot question ---------- */
const HotQuestion: React.FC = () => (
  <>
    <TopRow>
      <Pop dur={84} from="top" style={{ position: "relative" }}>
        <Card>
          <IconBubble bg={C.red} size={92}>
            <IconFire size={56} color="white" />
          </IconBubble>
          <div>
            <Title>Eng ko‘p so‘ralayotgan savol</Title>
            <Sub>Abituriyentlar va ota-onalar uchun</Sub>
          </div>
        </Card>
      </Pop>
    </TopRow>
    <Sticker x={150} y={760} dur={84} delay={8} bg={C.blue} size={130} rotate={-10}>
      <IconQuestion size={76} color="white" stroke={3} />
    </Sticker>
    <Sticker x={930} y={700} dur={84} delay={16} bg={C.yellow} size={110} rotate={12} phase={2}>
      <IconQuestion size={64} color={C.ink} stroke={3} />
    </Sticker>
  </>
);

/* ---------- 3. Last year: lots of A / A+ ---------- */
const LastYear: React.FC = () => (
  <>
    <TopRow>
      <Pop dur={167} from="top" style={{ position: "relative" }}>
        <Card>
          <IconBubble bg={C.blue} size={92}>
            <IconCalendar size={56} color="white" />
          </IconBubble>
          <div>
            <Title>O‘tgan yil natijalari</Title>
            <Sequence from={58} layout="none">
              <Pop dur={109} from="left" style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <IconUsers size={40} color={C.blue} />
                  <span style={{ fontFamily, fontWeight: 800, fontSize: 32, color: C.blue }}>
                    Juda ko‘p abituriyent
                  </span>
                </div>
              </Pop>
            </Sequence>
          </div>
        </Card>
      </Pop>
    </TopRow>
    <Sequence from={112} durationInFrames={55} layout="none">
      <Sticker x={160} y={800} dur={55} bg="white" size={150} rotate={-8}>
        <TextBadge text="A" color={C.blue} />
      </Sticker>
    </Sequence>
    <Sequence from={125} durationInFrames={42} layout="none">
      <Sticker x={920} y={760} dur={42} bg={C.yellow} size={160} rotate={10} phase={1.5}>
        <TextBadge text="A+" color={C.ink} />
      </Sticker>
    </Sequence>
  </>
);

/* ---------- 4. Everyone stuck at the max score ---------- */
const MaxScore: React.FC = () => {
  const f = useCurrentFrame();
  const fill = interpolate(f, [10, 83], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const full = f >= 83;
  const shake = full ? Math.sin(f * 1.7) * interpolate(f, [83, 100], [6, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <>
      <TopRow>
        <Pop dur={117} from="top" style={{ position: "relative" }}>
          <Card style={{ width: 860, flexDirection: "column", alignItems: "stretch", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <IconBubble bg={C.ink} size={76}>
                <IconUsers size={46} color="white" />
              </IconBubble>
              <Title size={42}>Maksimal ballda tirbandlik</Title>
            </div>
            <div style={{ position: "relative", height: 46, borderRadius: 23, background: "#E6EAF5", overflow: "hidden", transform: `translateX(${shake}px)` }}>
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  borderRadius: 23,
                  background: full ? C.red : `linear-gradient(90deg, ${C.blue}, #6C9BFF)`,
                }}
              />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 18, fontFamily, fontWeight: 900, fontSize: 28, color: fill > 0.85 ? "white" : C.ink }}>
                {full ? "TO‘LIB KETDI!" : `${Math.round(fill * 100)}%`}
              </div>
            </div>
          </Card>
        </Pop>
      </TopRow>
      <Sequence from={47} durationInFrames={70} layout="none">
        <Sticker x={930} y={760} dur={70} bg={C.red} size={120} rotate={10}>
          <IconWarning size={68} color="white" stroke={2.6} />
        </Sticker>
      </Sequence>
    </>
  );
};

/* ---------- 5. Something must be done ---------- */
const MustAct: React.FC = () => (
  <>
    <Sticker x={150} y={720} dur={28} bg={C.yellow} size={140} rotate={-12}>
      <IconBolt size={84} color={C.ink} stroke={2.6} />
    </Sticker>
    <Sticker x={930} y={820} dur={28} delay={4} bg={C.blue} size={120} rotate={8}>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 80, color: "white" }}>!</div>
    </Sticker>
  </>
);

/* ---------- 6. Ministries merged, new minister ---------- */
const Ministries: React.FC = () => {
  const f = useCurrentFrame();
  const merge = interpolate(f, [30, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const stage2 = f >= 99;
  const { fps } = useVideoConfig();
  const s2 = spring({ frame: f - 99, fps, config: { damping: 13 } });
  return (
    <TopRow>
      <Pop dur={136} from="top" style={{ position: "relative" }}>
        <Card style={{ width: 860, height: 190, justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {/* stage 1: two ministries merge */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, opacity: 1 - s2, transform: `translateY(${-s2 * 40}px)` }}>
            <div style={{ position: "relative", width: 260, height: 110 }}>
              <IconBubble bg={C.blue} size={104} style={{ position: "absolute", left: merge * 78, top: 3 }}>
                <IconBuilding size={62} color="white" />
              </IconBubble>
              <IconBubble bg={C.blueDark} size={104} style={{ position: "absolute", right: merge * 78, top: 3, opacity: 1 - merge * 0.9 }}>
                <IconBuilding size={62} color="white" />
              </IconBubble>
            </div>
            <div>
              <Title size={44}>{merge < 1 ? "2 ta vazirlik" : "Vazirliklar birlashdi"}</Title>
              <Sub>{merge < 1 ? "birlashmoqda…" : "2 → 1"}</Sub>
            </div>
          </div>
          {/* stage 2: new minister */}
          {stage2 ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, opacity: s2, transform: `scale(${0.8 + 0.2 * s2})` }}>
              <div style={{ position: "relative" }}>
                <IconBubble bg={C.ink} size={110}>
                  <IconUser size={66} color="white" />
                </IconBubble>
                <IconBubble bg={C.green} size={50} style={{ position: "absolute", right: -10, bottom: -8, border: "4px solid white" }}>
                  <IconCheck size={30} color="white" stroke={3.2} />
                </IconBubble>
              </div>
              <div>
                <Title size={44}>Yangi vazir tayinlandi</Title>
                <Sub>Birlashgan vazirlik rahbari</Sub>
              </div>
            </div>
          ) : null}
        </Card>
      </Pop>
    </TopRow>
  );
};

/* ---------- 7. They will do things ---------- */
const CheckItem: React.FC<{ text: string; delay: number; dur: number }> = ({ text, delay, dur }) => {
  const p = usePresence(dur, delay);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
      <IconBubble bg={C.green} size={58}>
        <IconCheck size={36} color="white" stroke={3.2} />
      </IconBubble>
      <span style={{ fontFamily, fontWeight: 800, fontSize: 40 }}>{text}</span>
    </div>
  );
};

const Plans: React.FC = () => (
  <TopRow>
    <Pop dur={141} from="top" style={{ position: "relative" }}>
      <Card style={{ width: 820, flexDirection: "column", alignItems: "flex-start", gap: 16, minHeight: 200 }}>
        <CheckItem text="Ishlar amalga oshiriladi" delay={46} dur={141} />
        <CheckItem text="Tadbirlar o‘tkaziladi" delay={120} dur={141} />
      </Card>
    </Pop>
  </TopRow>
);

/* ---------- 8a. Personal opinion ---------- */
const Opinion: React.FC = () => (
  <TopRow>
    <Pop dur={51} from="top" style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.ink, borderRadius: 999, padding: "20px 40px 20px 22px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>
        <IconBubble bg={C.yellow} size={80} style={{ borderRadius: 40 }}>
          <IconQuote size={46} color={C.ink} />
        </IconBubble>
        <Title color="white" size={46}>Ekspertning shaxsiy fikri</Title>
      </div>
    </Pop>
  </TopRow>
);

/* ---------- 8b. Certificate may be cancelled ---------- */
const Cancelled: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: f - 26, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <TopRow>
      <Pop dur={72} from="top" style={{ position: "relative" }}>
        <Card style={{ width: 880, position: "relative" }}>
          <IconBubble bg={C.blue} size={100}>
            <IconCert size={62} color="white" />
          </IconBubble>
          <div>
            <Title size={40}>MILLIY SERTIFIKAT</Title>
            <Sub>A / A+ darajalari</Sub>
          </div>
          {f >= 26 ? (
            <div
              style={{
                position: "absolute",
                right: 24,
                top: 38,
                transform: `rotate(-12deg) scale(${2.2 - 1.2 * stamp})`,
                opacity: Math.min(1, stamp * 2),
                border: `7px solid ${C.red}`,
                color: C.red,
                borderRadius: 18,
                padding: "6px 22px",
                fontFamily,
                fontWeight: 900,
                fontSize: 52,
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <IconX size={44} color={C.red} stroke={3.4} />
              BEKOR?
            </div>
          ) : null}
        </Card>
      </Pop>
    </TopRow>
  );
};

/* ---------- 9. Big problem & noise ---------- */
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = f >= 37 ? (Math.sin((f - 37) * 0.35) * 0.5 + 0.5) * interpolate(f, [37, 130], [0.4, 0.18]) : 0;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(255,40,40,${pulse}) 100%)`,
        }}
      />
      <Sequence from={37} layout="none">
        <TopRow>
          <Pop dur={93} from="top" style={{ position: "relative" }}>
            <Card>
              <IconBubble bg={C.red} size={92}>
                <IconWarning size={58} color="white" stroke={2.6} />
              </IconBubble>
              <div>
                <Title>Katta muammo</Title>
                <Sub>va katta shov-shuvlar</Sub>
              </div>
            </Card>
          </Pop>
        </TopRow>
      </Sequence>
      <Sequence from={64} durationInFrames={66} layout="none">
        <Sticker x={930} y={760} dur={66} bg={C.yellow} size={130} rotate={12}>
          <IconMegaphone size={74} color={C.ink} stroke={2.4} />
        </Sticker>
      </Sequence>
    </>
  );
};

/* ---------- 10. Fix it or remove it ---------- */
const Choice: React.FC<{ bg: string; icon: React.ReactNode; text: string; dur: number }> = ({ bg, icon, text, dur }) => (
  <Pop dur={dur} from="bottom" style={{ position: "relative" }}>
    <Card style={{ padding: "18px 26px", gap: 16 }}>
      <IconBubble bg={bg} size={76}>
        {icon}
      </IconBubble>
      <Title size={40}>{text}</Title>
    </Card>
  </Pop>
);

const FixOrRemove: React.FC = () => (
  <TopRow>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <Sequence from={15} durationInFrames={39} layout="none">
        <Choice dur={39} bg={C.green} icon={<IconWrench size={46} color="white" />} text="To‘g‘rilash" />
      </Sequence>
      <Sequence from={22} durationInFrames={32} layout="none">
        <Pop dur={32} style={{ position: "relative" }}>
          <div style={{ fontFamily, fontWeight: 900, fontSize: 36, color: "white", textShadow: "0 3px 12px rgba(0,0,0,.6)" }}>yoki</div>
        </Pop>
      </Sequence>
      <Sequence from={34} durationInFrames={20} layout="none">
        <Choice dur={20} bg={C.red} icon={<IconTrash size={46} color="white" />} text="Olib tashlash" />
      </Sequence>
    </div>
  </TopRow>
);

/* ---------- 11. Share with friends ---------- */
const Share: React.FC = () => {
  const f = useCurrentFrame();
  const fly = interpolate(f, [75, 97], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <TopRow>
      <Pop dur={97} from="top" style={{ position: "relative" }}>
        <Card style={{ width: 860 }}>
          <IconBubble bg={C.blue} size={100} style={{ overflow: "visible" }}>
            <div style={{ transform: `translate(${fly * 500}px, ${-fly * 260}px) rotate(${fly * 20}deg)`, opacity: 1 - fly * 0.8 }}>
              <IconSend size={60} color="white" />
            </div>
          </IconBubble>
          <div style={{ flex: 1 }}>
            <Title size={44}>Tanishlaringizga yuboring</Title>
            <Sub>Milliy sertifikatga tayyorlanayotganlar uchun</Sub>
          </div>
        </Card>
      </Pop>
    </TopRow>
  );
};

/* ---------- 12. Follow ---------- */
const Follow: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clicked = f >= 19;
  const press = clicked ? interpolate(f, [19, 23, 28], [1, 0.9, 1], { extrapolateRight: "clamp" }) : 1;
  const heart = spring({ frame: f - 24, fps, config: { damping: 8 } });
  const cursorX = interpolate(f, [4, 18], [280, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <>
      <TopRow>
        <Pop dur={70} from="top" style={{ position: "relative" }}>
          <Card style={{ width: 820, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <IconBubble bg={C.ink} size={96} style={{ borderRadius: 48, border: `5px solid ${C.yellow}` }}>
                <IconUser size={56} color="white" />
              </IconBubble>
              <div>
                <Title size={40}>Bizning sahifa</Title>
                <Sub>Ta’lim yangiliklari</Sub>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  transform: `scale(${press})`,
                  background: clicked ? "#E6EAF5" : C.blue,
                  color: clicked ? C.ink : "white",
                  borderRadius: 22,
                  padding: "18px 26px",
                  fontFamily,
                  fontWeight: 900,
                  fontSize: 34,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {clicked ? <IconCheck size={34} color={C.green} stroke={3.4} /> : null}
                {clicked ? "Obunadasiz" : "Obuna bo‘lish"}
              </div>
              {/* cursor */}
              <svg
                width={64}
                height={64}
                viewBox="0 0 24 24"
                style={{ position: "absolute", right: 30 - cursorX, bottom: -40, transform: `scale(${press})`, opacity: f < 50 ? 1 : 0 }}
              >
                <path d="M4 2l16 9-7 1.5L9.5 20z" fill="white" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
              </svg>
            </div>
          </Card>
        </Pop>
      </TopRow>
      <div style={{ position: "absolute", left: 930 - 65, top: 700, transform: `scale(${heart}) rotate(12deg)`, opacity: Math.min(1, heart) }}>
        <IconBubble bg="white" size={130} style={{ border: "5px solid white" }}>
          <IconHeart size={80} />
        </IconBubble>
      </div>
      <Sequence from={30} layout="none">
        <Sticker x={150} y={770} dur={40} bg={C.yellow} size={120} rotate={-12}>
          <IconBell size={70} color={C.ink} stroke={2.4} />
        </Sticker>
      </Sequence>
    </>
  );
};

export const Graphics: React.FC = () => (
  <AbsoluteFill>
    <Sequence name="Hook: notification" from={0} durationInFrames={44}>
      <Notification />
    </Sequence>
    <Sequence name="Hot question" from={44} durationInFrames={84}>
      <HotQuestion />
    </Sequence>
    <Sequence name="Last year A/A+" from={126} durationInFrames={167}>
      <LastYear />
    </Sequence>
    <Sequence name="Max score" from={293} durationInFrames={117}>
      <MaxScore />
    </Sequence>
    <Sequence name="Must act" from={410} durationInFrames={28}>
      <MustAct />
    </Sequence>
    <Sequence name="Ministries" from={438} durationInFrames={136}>
      <Ministries />
    </Sequence>
    <Sequence name="Plans" from={574} durationInFrames={141}>
      <Plans />
    </Sequence>
    <Sequence name="Opinion" from={715} durationInFrames={51}>
      <Opinion />
    </Sequence>
    <Sequence name="Cancelled?" from={766} durationInFrames={72}>
      <Cancelled />
    </Sequence>
    <Sequence name="Problem" from={838} durationInFrames={130}>
      <Problem />
    </Sequence>
    <Sequence name="Fix or remove" from={968} durationInFrames={54}>
      <FixOrRemove />
    </Sequence>
    <Sequence name="Share" from={1022} durationInFrames={97}>
      <Share />
    </Sequence>
    <Sequence name="Follow" from={1119} durationInFrames={63}>
      <Follow />
    </Sequence>
  </AbsoluteFill>
);
