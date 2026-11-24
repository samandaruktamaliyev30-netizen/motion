import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./reel/timeline";
import { Med } from "./med/Med";
import { DURATION as MED_DURATION } from "./med/timeline";
import { Kiut, KIUT_DURATION } from "./kiut/Kiut";
import { Kiut2, KIUT2_DURATION } from "./kiut2/Kiut2";
import { Reel2, REEL2_DURATION } from "./reel2/Reel2";
import { Sertifikat3, DURATION as S3_DURATION } from "./v5/Sertifikat3";
import { Choy, CHOY_DURATION } from "./v6/Choy";
import { Kimyo, KIMYO_DURATION } from "./v7/Kimyo";
import { Savollar, SAVOLLAR_DURATION } from "./v8/Savollar";
import { Sodda, DURATION as SODDA_DURATION } from "./v9/Sodda";
import { Tips } from "./v10/Tips";
import { Oddiy } from "./v11/Oddiy";
import { DURATION as ODDIY_DURATION } from "./v11/data";
import { DURATION as TIPS_DURATION } from "./v10/data";
import { Doktor, DOKTOR_DURATION } from "./v12/Doktor";

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
      <Composition id="ChoyNegaSekin" component={Choy} durationInFrames={CHOY_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Kimyo" component={Kimyo} durationInFrames={KIMYO_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="SertifikatSavollar" component={Savollar} durationInFrames={SAVOLLAR_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="DTMYangilik" component={Sodda} durationInFrames={SODDA_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="ImtihonMaslahat" component={Tips} durationInFrames={TIPS_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="BiologiyaImtihon" component={Oddiy} durationInFrames={ODDIY_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="YaxshiDoktor" component={Doktor} durationInFrames={DOKTOR_DURATION} fps={30} width={1080} height={1920} />
    </>
  );
};
