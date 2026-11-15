import React from "react";
import { AbsoluteFill, Audio, getStaticFiles, Sequence, staticFile } from "remotion";
import { Fade, Flash, Grain, Letterbox, Vignette } from "./components/Atmosphere";
import { ThemeCtx } from "./components/Glass";
import { LogoReveal } from "./scenes/LogoReveal";
import { DataSpiral, HackerWide, MonitorClose, Vortex } from "./scenes/Opening";
import { Comet, FileStorm, Warp } from "./scenes/Space";
import { DashboardRows, HeroVault, TileWall, Tunnel } from "./scenes/Vault";
import { ThemeName, THEMES } from "./theme";

export type MainProps = {
  theme: ThemeName;
  tagline: string;
  url: string;
  music: boolean;
};

/** [from, durationInFrames, fadeIn, fadeOut] at 30fps — 960 frames / 32s total. */
const T = {
  wide: [0, 64, 0, 0],
  close: [62, 48, 0, 0],
  spiral: [108, 58, 0, 0],
  vortex: [160, 36, 6, 6],
  storm: [190, 146, 8, 0],
  comet: [328, 88, 0, 4],
  warp: [410, 95, 6, 0],
  wall: [498, 68, 6, 4],
  tunnel: [560, 78, 6, 0],
  hero: [632, 74, 8, 4],
  rows: [700, 100, 6, 0],
  logo: [792, 168, 0, 0],
} as const;

const S: React.FC<{ k: keyof typeof T; children: React.ReactNode }> = ({ k, children }) => {
  const [from, dur, fi, fo] = T[k];
  return (
    <Sequence from={from} durationInFrames={dur} name={k}>
      <Fade dur={dur} fadeIn={fi} fadeOut={fo}>
        {children}
      </Fade>
    </Sequence>
  );
};

export const Main: React.FC<MainProps> = ({ theme, tagline, url, music }) => {
  const t = THEMES[theme] ?? THEMES.pink;
  const hasTrack = music && getStaticFiles().some((f) => f.name === "soundtrack.wav");
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{ background: "#000" }}>
        <S k="wide">
          <HackerWide />
        </S>
        <S k="close">
          <MonitorClose />
        </S>
        <S k="spiral">
          <DataSpiral />
        </S>
        <S k="vortex">
          <Vortex />
        </S>
        <S k="storm">
          <FileStorm />
        </S>
        <S k="comet">
          <Comet />
        </S>
        <S k="warp">
          <Warp />
        </S>
        <S k="wall">
          <TileWall />
        </S>
        <S k="tunnel">
          <Tunnel />
        </S>
        <S k="hero">
          <HeroVault />
        </S>
        <S k="rows">
          <DashboardRows />
        </S>
        <S k="logo">
          <LogoReveal tagline={tagline} url={url} />
        </S>

        {/* transition flashes */}
        <Flash at={330} attack={8} release={16} />
        <Flash at={500} attack={3} release={10} peak={0.7} />
        <Flash at={634} attack={3} release={10} peak={0.5} />
        <Flash at={842} attack={4} release={18} peak={0.55} />

        <Letterbox from={40} to={62} />
        <Vignette />
        <Grain />
        {hasTrack ? <Audio src={staticFile("soundtrack.wav")} /> : null}
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
