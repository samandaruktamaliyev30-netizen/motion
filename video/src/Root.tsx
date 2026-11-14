import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./reel/timeline";
import { Med } from "./med/Med";
import { DURATION as MED_DURATION } from "./med/timeline";
import { Kiut, KIUT_DURATION } from "./kiut/Kiut";
import { Kiut2, KIUT2_DURATION } from "./kiut2/Kiut2";
import { Reel2, REEL2_DURATION } from "./reel2/Reel2";
import { Sertifikat3, DURATION as S3_DURATION } from "./v5/Sertifikat3";

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
      <Composition id="MilliySertifikat2" component={Reel2} durationInFrames={REEL2_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="SertifikatFikr" component={Sertifikat3} durationInFrames={S3_DURATION} fps={30} width={1080} height={1920} />
    </>
  );
};
