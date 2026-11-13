import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./reel/timeline";
import { Med } from "./med/Med";
import { DURATION as MED_DURATION } from "./med/timeline";
import { Kiut, KIUT_DURATION } from "./kiut/Kiut";
import { Kiut2, KIUT2_DURATION } from "./kiut2/Kiut2";

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
      <Composition id="NegaKIUT" component={Kiut} durationInFrames={KIUT_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="KIUT" component={Kiut2} durationInFrames={KIUT2_DURATION} fps={30} width={1080} height={1920} />
    </>
  );
};
