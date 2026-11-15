import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { useTheme } from "../components/Glass";
import emblemData from "../data/emblem-points.json";
import { FONT_SANS, rgba } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const EMBLEM_H = 340;
const EMBLEM_TOP = 105;
const FLOOR_Y = 835;

const Fog: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {new Array(9).fill(0).map((_, i) => {
        const x = random(`fogx${i}`) * 2200 - 140 + Math.sin(frame * 0.012 + i) * 120 + frame * (i % 2 ? 0.6 : -0.6);
        const y = 420 + random(`fogy${i}`) * 420;
        const s = 500 + random(`fogs${i}`) * 600;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - s / 2,
              top: y - s * 0.3,
              width: s,
              height: s * 0.6,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${i % 3 === 0 ? rgba(t.accent, 0.16) : rgba(t.cool, 0.1)} 0%, transparent 70%)`,
              filter: "blur(30px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

type Props = { tagline: string; url: string };

const Lockup: React.FC<Props & { reflection?: boolean }> = ({ tagline, url, reflection }) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const emblemIn = interpolate(frame, [40, 60], [0, 1], clamp);
  const flash = interpolate(frame, [44, 52, 72], [0, 1, 0], clamp);
  const wordP = interpolate(frame, [62, 88], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tagP = interpolate(frame, [78, 100], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // typewriter tagline
  const typeStart = 112;
  const chars = Math.floor(interpolate(frame, [typeStart, typeStart + tagline.length * 1.3], [0, tagline.length], clamp));
  const shown = tagline.slice(0, chars);
  const cursorOn = frame >= typeStart && frame < typeStart + tagline.length * 1.3 + 18 && Math.floor(frame / 6) % 2 === 0;
  const urlP = interpolate(frame, [142, 160], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shine = interpolate(frame, [92, 122], [-0.4, 1.4], clamp);
  const pulse = 0.75 + 0.25 * Math.sin(frame * 0.12);
  const emblemSrc = staticFile(t.emblem);
  return (
    <AbsoluteFill>
      {/* emblem glow */}
      <div
        style={{
          position: "absolute",
          left: 960 - 330,
          top: EMBLEM_TOP + EMBLEM_H / 2 - 330,
          width: 660,
          height: 660,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(t.accent, 0.32 * emblemIn * pulse)} 0%, ${rgba(t.accent, 0.08 * emblemIn)} 40%, transparent 68%)`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: EMBLEM_TOP, height: EMBLEM_H, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", height: EMBLEM_H }}>
          <Img
            src={emblemSrc}
            style={{
              height: EMBLEM_H,
              opacity: emblemIn,
              filter: `brightness(${1 + flash * 1.6}) drop-shadow(0 0 ${18 + flash * 30}px ${rgba(t.accent, 0.55)})`,
              transform: `scale(${interpolate(emblemIn, [0, 1], [0.96, 1])})`,
            }}
          />
          {!reflection ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                WebkitMaskImage: `url(${emblemSrc})`,
                WebkitMaskSize: "100% 100%",
                maskImage: `url(${emblemSrc})`,
                maskSize: "100% 100%",
                background: `linear-gradient(105deg, transparent ${shine * 100 - 12}%, rgba(255,255,255,0.85) ${shine * 100}%, transparent ${shine * 100 + 12}%)`,
                mixBlendMode: "screen",
              }}
            />
          ) : null}
        </div>
      </div>
      {/* wordmark */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 478, display: "flex", justifyContent: "center" }}>
        <Img
          src={staticFile(t.word)}
          style={{
            height: 80,
            clipPath: `inset(0 ${(1 - wordP) * 50}% 0 ${(1 - wordP) * 50}%)`,
            filter: `drop-shadow(0 0 ${12 * (1 - wordP) + 4}px ${rgba(t.accentLight, 0.6)})`,
            transform: `translateY(${(1 - wordP) * 16}px)`,
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 584, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile(t.tag)} style={{ height: 28, opacity: tagP, transform: `scaleX(${interpolate(tagP, [0, 1], [1.25, 1])})`, filter: `blur(${(1 - tagP) * 6}px)` }} />
      </div>
      {/* tagline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 652, textAlign: "center", fontFamily: FONT_SANS, fontWeight: 600, fontSize: 42, color: "white", letterSpacing: 0.5, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
        {shown}
        <span style={{ opacity: cursorOn ? 1 : 0, color: t.accent }}>|</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 716,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: 56,
          color: "white",
          opacity: urlP,
          filter: `blur(${(1 - urlP) * 10}px)`,
          transform: `translateY(${(1 - urlP) * 20}px)`,
          textShadow: `0 0 24px ${rgba(t.accent, 0.45)}`,
        }}
      >
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const LogoReveal: React.FC<Props> = ({ tagline, url }) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const pts = emblemData.points as number[][];
  const emblemW = EMBLEM_H * emblemData.aspect;
  const ex = 960 - emblemW / 2;
  const particleFade = interpolate(frame, [48, 66], [1, 0], clamp);
  const sceneIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const ring = interpolate(frame, [46, 80], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const circles: React.ReactNode[] = [];
  if (particleFade > 0) {
    for (let i = 0; i < pts.length; i++) {
      const [px, py, acc] = pts[i];
      const tx = ex + px * emblemW;
      const ty = EMBLEM_TOP + py * EMBLEM_H;
      const ang = random(`la${i}`) * Math.PI * 2;
      const dist = 500 + random(`ld${i}`) * 1100;
      const sx = 960 + Math.cos(ang) * dist;
      const sy = 300 + Math.sin(ang) * dist * 0.6;
      const delay = random(`ldl${i}`) * 18;
      const p = interpolate(frame, [4 + delay, 38 + delay], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
      const swirl = (1 - p) * 1.6;
      const dx = sx - tx;
      const dy = sy - ty;
      const x = tx + (dx * Math.cos(swirl) - dy * Math.sin(swirl)) * (1 - p);
      const y = ty + (dx * Math.sin(swirl) + dy * Math.cos(swirl)) * (1 - p);
      circles.push(
        <circle
          key={i}
          cx={x}
          cy={y}
          r={p > 0.98 ? 1.6 : 1.2 + (1 - p) * 2.2}
          fill={acc ? t.accent : i % 4 === 0 ? t.accentLight : "white"}
          opacity={Math.min(1, p * 3 + 0.15) * particleFade}
        />,
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 35%, #142233 0%, ${t.bg2} 30%, ${t.bg} 75%)`, opacity: sceneIn }}>
      <Fog />
      {/* floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: FLOOR_Y,
          bottom: 0,
          background: `linear-gradient(180deg, rgba(10,16,26,0.6) 0%, rgba(3,6,12,0.95) 60%, #010205 100%)`,
          borderTop: `1px solid ${rgba(t.accentLight, 0.12)}`,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 0.35 }}>
        {new Array(14).fill(0).map((_, i) => {
          const x0 = random(`mx${i}`) * 1920;
          const y0 = FLOOR_Y + 20 + random(`my${i}`) * 220;
          return <path key={i} d={`M${x0} ${y0} q ${80 + random(`mq${i}`) * 200} ${-10 + random(`mr${i}`) * 20} ${300 + random(`ml${i}`) * 300} ${random(`mz${i}`) * 30}`} stroke="rgba(180,200,220,0.25)" strokeWidth={1} fill="none" />;
        })}
      </svg>
      {/* reflection */}
      <AbsoluteFill
        style={{
          transform: `translateY(${FLOOR_Y * 2}px) scaleY(-1)`,
          transformOrigin: "50% 0%",
          opacity: 0.28,
          filter: "blur(2px)",
          WebkitMaskImage: `linear-gradient(0deg, transparent ${1080 - FLOOR_Y - 10}px, black ${1080 - FLOOR_Y}px, transparent ${1080 - FLOOR_Y + 220}px)`,
        }}
      >
        <Lockup tagline={tagline} url={url} reflection />
      </AbsoluteFill>
      {/* shock ring */}
      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 960 - 700 * ring,
            top: EMBLEM_TOP + EMBLEM_H / 2 - 700 * ring * 0.35,
            width: 1400 * ring,
            height: 1400 * ring * 0.35,
            borderRadius: "50%",
            border: `3px solid ${rgba(t.accentLight, 1 - ring)}`,
            boxShadow: `0 0 40px ${rgba(t.accent, (1 - ring) * 0.8)}`,
          }}
        />
      ) : null}
      <Lockup tagline={tagline} url={url} />
      {particleFade > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 3px ${t.accent})` }}>
          {circles}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
