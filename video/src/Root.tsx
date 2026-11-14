import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./reel/timeline";
import { Med } from "./med/Med";
import { DURATION as MED_DURATION } from "./med/timeline";
import { V4 } from "./v4/V4";
import { DURATION as V4_DURATION } from "./v4/timeline";
import { Ov } from "./ov/Ov";
import { DURATION as OV_DURATION } from "./ov/timeline";

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
    </>
  );
};
