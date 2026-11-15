import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { rgba } from "../theme";
import { useTheme } from "./Glass";

/** Animated film grain via SVG turbulence (seed changes every frame). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 30} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Cinematic letterbox bars that retract between `from` and `to`. */
export const Letterbox: React.FC<{ from: number; to: number; size?: number }> = ({ from, to, size = 110 }) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [from, to], [size, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "black" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "black" }} />
    </AbsoluteFill>
  );
};

/** Bright flash peaking at `at`. */
export const Flash: React.FC<{ at: number; attack?: number; release?: number; color?: string; peak?: number }> = ({
  at,
  attack = 4,
  release = 14,
  color,
  peak = 1,
}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const o = interpolate(frame, [at - attack, at, at + release], [0, peak, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0) return null;
  const c = color ?? t.accentLight;
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: `radial-gradient(circle at 50% 50%, white 0%, ${rgba(c, 0.9)} 35%, ${rgba(c, 0.25)} 80%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

/** Fade wrapper: fades a scene in/out over its local timeline. */
export const Fade: React.FC<{
  dur: number;
  fadeIn?: number;
  fadeOut?: number;
  children: React.ReactNode;
}> = ({ dur, fadeIn = 0, fadeOut = 0, children }) => {
  const frame = useCurrentFrame();
  let o = 1;
  if (fadeIn > 0) o *= interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (fadeOut > 0) o *= interpolate(frame, [dur - fadeOut, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Soft glowing light streak (lens-flare style horizontal bar). */
export const LightStreak: React.FC<{ y: number; intensity: number; color: string; width?: number }> = ({
  y,
  intensity,
  color,
  width = 1920,
}) => (
  <div
    style={{
      position: "absolute",
      left: (1920 - width) / 2,
      top: y - 60,
      width,
      height: 120,
      opacity: intensity,
      background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.95) 0%, ${rgba(color, 0.7)} 12%, ${rgba(color, 0.15)} 45%, transparent 70%)`,
      mixBlendMode: "screen",
      pointerEvents: "none",
    }}
  />
);
