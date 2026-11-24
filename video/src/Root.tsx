import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./reel/timeline";
import { Med } from "./med/Med";
import { DURATION as MED_DURATION } from "./med/timeline";
import { V4 } from "./v4/V4";
import { DURATION as V4_DURATION } from "./v4/timeline";
import { Ov } from "./ov/Ov";
import { DURATION as OV_DURATION } from "./ov/timeline";
import { Nano, DURATION as NANO_DURATION } from "./nano/Nano";
import { Nano2, DURATION as NANO2_DURATION } from "./nano2/Nano2";
import { Nano3, DURATION as NANO3_DURATION } from "./nano3/Nano3";
import { Oz, DURATION as OZ_DURATION } from "./oz/Oz";
import { Oz2 } from "./oz/Oz2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MilliySertifikat"
        component={Reel}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MedUniversitet"
        component={Med}
        durationInFrames={MED_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Kafolat"
        component={V4}
        durationInFrames={V4_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TargetReklama"
        component={Ov}
        durationInFrames={OV_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NanoMarketing"
        component={Nano}
        durationInFrames={NANO_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NanoMarketing2"
        component={Nano2}
        durationInFrames={NANO2_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NanoMarketing3"
        component={Nano3}
        durationInFrames={NANO3_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NanoMarketing3Alpha"
        component={Nano3}
        durationInFrames={NANO3_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ transparent: true }}
      />
      <Composition
        id="NanoMarketing3Key"
        component={Nano3}
        durationInFrames={NANO3_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ keyColor: "#FF00FF" }}
      />
      <Composition
        id="Mijoz1500"
        component={Oz}
        durationInFrames={OZ_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Mijoz1500v2"
        component={Oz2}
        durationInFrames={OZ_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
