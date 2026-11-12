import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./reel/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MilliySertifikat"
      component={Reel}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
