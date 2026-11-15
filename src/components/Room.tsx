import React, { useId } from "react";
import { random, useCurrentFrame } from "remotion";
import { FONT_MONO, rgba } from "../theme";
import { useTheme } from "./Glass";

/** Live "security console" screen: waveform, code, bars. */
export const MonitorScreen: React.FC<{ w: number; h: number; variant: number; seed?: string }> = ({
  w,
  h,
  variant,
  seed = "m",
}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const wave = (k: number, amp: number, phase: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = (i / 120) * w;
      const env = Math.sin((i / 120) * Math.PI) ** 1.5;
      const y =
        h * 0.5 +
        env *
          amp *
          (Math.sin(i * 0.55 + frame * 0.35 * k + phase) * 0.6 +
            Math.sin(i * 1.7 - frame * 0.5 + phase) * 0.3 +
            (random(`${seed}${i}${Math.floor(frame / 2)}`) - 0.5) * 0.9);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const lines = 14;
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        background: `linear-gradient(180deg, #050b14 0%, #07111f 100%)`,
        overflow: "hidden",
        border: "2px solid #1a2433",
        boxShadow: `0 0 ${w * 0.12}px ${rgba(t.accent, 0.25)}`,
      }}
    >
      {/* top bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.07, background: "#0d1726", display: "flex", gap: 6, alignItems: "center", paddingLeft: 8 }}>
        {[t.accent, "#ffb020", t.cool].map((c) => (
          <div key={c} style={{ width: h * 0.025, height: h * 0.025, borderRadius: 99, background: c }} />
        ))}
        <div style={{ fontFamily: FONT_MONO, fontSize: h * 0.035, color: "rgba(255,255,255,0.5)", marginLeft: 10 }}>
          rumikesh://soc/{variant === 0 ? "threat-intel" : variant === 1 ? "packet-capture" : "endpoint-guard"}
        </div>
      </div>
      {/* grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${rgba(t.cool, 0.07)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(t.cool, 0.07)} 1px, transparent 1px)`,
          backgroundSize: `${w / 16}px ${w / 16}px`,
        }}
      />
      {variant !== 2 ? (
        <svg width={w} height={h} style={{ position: "absolute" }}>
          <polyline points={wave(1, h * 0.28, 0)} fill="none" stroke={t.cool} strokeWidth={2} opacity={0.9} />
          <polyline points={wave(1.4, h * 0.2, 2)} fill="none" stroke={t.accent} strokeWidth={1.5} opacity={0.85} />
        </svg>
      ) : null}
      {/* code column */}
      <div style={{ position: "absolute", left: w * 0.04, top: h * 0.12, width: variant === 2 ? w * 0.9 : w * 0.28 }}>
        {new Array(lines).fill(0).map((_, i) => {
          const r = random(`${seed}c${i + Math.floor(frame / 3)}`);
          return (
            <div
              key={i}
              style={{
                height: h * 0.022,
                marginBottom: h * 0.032,
                width: `${25 + r * 70}%`,
                borderRadius: 2,
                background: i % 5 === 0 ? rgba(t.accent, 0.7) : r > 0.7 ? rgba(t.cool, 0.6) : "rgba(255,255,255,0.18)",
              }}
            />
          );
        })}
      </div>
      {/* bars */}
      <div style={{ position: "absolute", right: w * 0.04, bottom: h * 0.06, display: "flex", alignItems: "flex-end", gap: w * 0.008 }}>
        {new Array(18).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              width: w * 0.012,
              height: h * (0.05 + 0.2 * Math.abs(Math.sin(frame * 0.12 + i * 0.7))),
              background: i % 4 === 0 ? t.accent : rgba(t.cool, 0.7),
            }}
          />
        ))}
      </div>
    </div>
  );
};

/** Hooded hacker silhouette seen from behind. */
export const Hacker: React.FC<{ w: number; rim?: number; style?: React.CSSProperties }> = ({ w, rim = 1, style }) => {
  const t = useTheme();
  const id = useId().replace(/:/g, "");
  const h = w * 1.2;
  return (
    <svg width={w} height={h} viewBox="0 0 400 480" style={{ position: "absolute", overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`hk${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c29" />
          <stop offset="0.5" stopColor="#0a0f17" />
          <stop offset="1" stopColor="#040609" />
        </linearGradient>
        <radialGradient id={`hl${id}`} cx="0.5" cy="0" r="0.7">
          <stop offset="0" stopColor={rgba(t.cool, 0.35)} />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
        <filter id={`hb${id}`}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path
        id={`hp${id}`}
        d="M10 480C14 400 58 334 128 304C106 252 104 172 136 112C160 66 196 38 214 38C262 44 292 92 297 150C302 210 292 262 272 304C342 332 386 400 390 480Z"
        fill={`url(#hk${id})`}
      />
      <path
        d="M10 480C14 400 58 334 128 304C106 252 104 172 136 112C160 66 196 38 214 38C262 44 292 92 297 150C302 210 292 262 272 304C342 332 386 400 390 480"
        fill="none"
        stroke={t.accent}
        strokeWidth={6}
        opacity={0.55 * rim}
        filter={`url(#hb${id})`}
      />
      <path
        d="M10 480C14 400 58 334 128 304C106 252 104 172 136 112C160 66 196 38 214 38C262 44 292 92 297 150C302 210 292 262 272 304C342 332 386 400 390 480"
        fill="none"
        stroke={t.accentLight}
        strokeWidth={1.5}
        opacity={0.6 * rim}
      />
      <path d="M128 304C160 322 236 324 272 304" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
      <path d="M214 40C200 120 196 220 206 330" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
      <path d="M10 480C14 400 58 334 128 304C106 252 104 172 136 112C160 66 196 38 214 38C262 44 292 92 297 150C302 210 292 262 272 304C342 332 386 400 390 480Z" fill={`url(#hl${id})`} />
    </svg>
  );
};

/** A 3D room: wall, desk, three curved monitors, hacker. Camera driven by props. */
export const Room: React.FC<{
  camX?: number;
  camY?: number;
  camZ?: number;
  rotY?: number;
  rotX?: number;
  showHacker?: boolean;
  children?: React.ReactNode;
}> = ({ camX = 0, camY = 0, camZ = 0, rotY = 0, rotX = 0, showHacker = true, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const mw = 560;
  const mh = 330;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1100, perspectiveOrigin: "50% 45%", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          transformStyle: "preserve-3d",
          transform: `translateZ(${camZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${-camX}px, ${-camY}px, 0px)`,
        }}
      >
        {/* back wall */}
        <div
          style={{
            position: "absolute",
            left: -2400,
            top: -1500,
            width: 4800,
            height: 2200,
            transform: "translateZ(-1100px)",
            background: `radial-gradient(ellipse 40% 50% at 50% 60%, ${rgba(t.cool, 0.18)} 0%, ${t.bg2} 45%, ${t.bg} 100%)`,
          }}
        >
          {new Array(40).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: random(`bk${i}`) * 4800,
                top: 600 + random(`bky${i}`) * 900,
                width: 20 + random(`bks${i}`) * 60,
                height: 20 + random(`bks${i}`) * 60,
                borderRadius: 99,
                background: i % 3 === 0 ? rgba(t.accent, 0.35) : rgba(t.cool, 0.25),
                filter: "blur(14px)",
                opacity: 0.5 + 0.5 * Math.sin(frame * 0.05 + i),
              }}
            />
          ))}
        </div>
        {/* floor */}
        <div
          style={{
            position: "absolute",
            left: -2400,
            top: -1400,
            width: 4800,
            height: 2800,
            transform: "translateY(420px) rotateX(90deg)",
            background: `radial-gradient(ellipse 30% 30% at 50% 50%, ${rgba(t.cool, 0.12)}, #020409 70%)`,
          }}
        />
        {/* desk */}
        <div
          style={{
            position: "absolute",
            left: -900,
            top: -330,
            width: 1800,
            height: 660,
            transform: "translateY(150px) translateZ(-300px) rotateX(90deg)",
            background: `linear-gradient(0deg, #0c141f 0%, #142233 60%, ${rgba(t.cool, 0.25)} 100%)`,
            borderRadius: 30,
          }}
        />
        {/* keyboard glow */}
        <div
          style={{
            position: "absolute",
            left: -170,
            top: -60,
            width: 340,
            height: 120,
            transform: "translateY(148px) translateZ(-180px) rotateX(90deg)",
            background: `linear-gradient(90deg, ${rgba(t.accent, 0.5)}, ${rgba(t.cool, 0.5)})`,
            borderRadius: 8,
            filter: "blur(2px)",
          }}
        />
        {/* monitors */}
        {[
          { x: -mw * 0.98, ry: 28, z: -360, v: 0 },
          { x: 0, ry: 0, z: -520, v: 1 },
          { x: mw * 0.98, ry: -28, z: -360, v: 2 },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x - mw / 2,
              top: -mh - 10,
              width: mw,
              height: mh,
              transform: `translateZ(${m.z}px) rotateY(${m.ry}deg)`,
            }}
          >
            <MonitorScreen w={mw} h={mh} variant={m.v} seed={`room${i}`} />
            <div style={{ position: "absolute", left: mw / 2 - 12, top: mh, width: 24, height: 150, background: "#0b111a" }} />
          </div>
        ))}
        {showHacker ? (
          <div style={{ position: "absolute", left: -260, top: -360, transform: "translateZ(0px)" }}>
            <Hacker w={520} />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};
