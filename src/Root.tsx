import { Composition } from "remotion";
import { Main, MainProps } from "./Main";
import { FPS, H, W } from "./theme";

const defaults: MainProps = {
  theme: "pink",
  tagline: "Every Threat. One Shield.",
  url: "rumikesh.com",
  music: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="RumikeshIntro" component={Main} durationInFrames={960} fps={FPS} width={W} height={H} defaultProps={defaults} />
      <Composition
        id="RumikeshIntroBlue"
        component={Main}
        durationInFrames={960}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ ...defaults, theme: "blue" as const }}
      />
    </>
  );
};
