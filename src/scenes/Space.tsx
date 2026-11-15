import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { GlassFile, GlassFolder, GlassTile, useTheme } from "../components/Glass";
import { IconName } from "../components/Icons";
import { StarStreaks } from "../components/Stars";
import { FONT_MONO, rgba } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/* Energy orb                                                           */
/* ------------------------------------------------------------------ */
export const Orb: React.FC<{ x: number; y: number; size: number; power: number; spin: number }> = ({ x, y, size, power, spin }) => {
  const t = useTheme();
  const rays = 18;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      <div
        style={{
          position: "absolute",
          left: -size * 3,
          top: -size * 3,
          width: size * 6,
          height: size * 6,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(t.accentLight, 0.55 * power)} 0%, ${rgba(t.accent, 0.28 * power)} 22%, ${rgba(t.accent, 0.08 * power)} 50%, transparent 70%)`,
        }}
      />
      <svg width={size * 6} height={size * 6} viewBox="-300 -300 600 600" style={{ position: "absolute", left: -size * 3, top: -size * 3, mixBlendMode: "screen" }}>
        <defs>
          <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="0.9" />
            <stop offset="1" stopColor={t.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform={`rotate(${spin})`}>
          {new Array(rays).fill(0).map((_, i) => (
            <polygon
              key={i}
              points={`0,-2 ${120 + (i % 3) * 70},0 0,2`}
              fill="url(#ray)"
              transform={`rotate(${(i / rays) * 360 + (i % 2) * 7})`}
              opacity={power * (0.4 + (i % 3) * 0.2)}
            />
          ))}
        </g>
        <circle r={50} fill="none" stroke={t.accentLight} strokeWidth={3} opacity={0.9 * power} />
        <circle r={34} fill="none" stroke="white" strokeWidth={1.5} opacity={0.7 * power} strokeDasharray="6 8" transform={`rotate(${-spin * 2})`} />
        <circle r={22} fill="white" opacity={power} />
        <circle r={36} fill={t.accentLight} opacity={0.35 * power} />
      </svg>
    </div>
  );
};

/* Solid tumbling folder / document (non-glass), used in the file storm. */
const SolidFolder: React.FC<{ s: number; c: string; label?: string }> = ({ s, c, label }) => (
  <svg width={s} height={s * 0.78} viewBox="0 0 100 78" style={{ overflow: "visible" }}>
    <path d="M4 8a4 4 0 0 1 4-4h22l7 7h55a4 4 0 0 1 4 4v55a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill={c} />
    <rect x="12" y="14" width="74" height="40" rx="2" fill="#e9eef5" opacity="0.85" />
    <path d="M2 26a4 4 0 0 1 4-4h88a4 4 0 0 1 4 4l-2 44a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill={c} style={{ filter: "brightness(1.25)" }} />
    {label ? (
      <text x="50" y="56" textAnchor="middle" fontFamily={FONT_MONO} fontSize="14" fontWeight="600" fill="rgba(255,255,255,0.8)">
        {label}
      </text>
    ) : null}
  </svg>
);
const SolidDoc: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s * 0.78} height={s} viewBox="0 0 78 100">
    <path d="M4 2h50l22 22v72a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#dfe6ef" />
    <path d="M54 2v22h22" fill="#b9c4d2" />
    {[34, 46, 58, 70, 82].map((y) => (
      <rect key={y} x="12" y={y} width={y % 24 ? 50 : 36} height="4" fill="#8b98aa" />
    ))}
  </svg>
);

/* ------------------------------------------------------------------ */
/* 4. File storm -> orb absorbs everything                              */
/* ------------------------------------------------------------------ */
export const FileStorm: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const orbSize = interpolate(frame, [0, 70, 120, 140], [10, 60, 85, 110], { ...clamp, easing: Easing.out(Easing.quad) });
  const orbPower = interpolate(frame, [0, 20, 60], [0.4, 0.8, 1], clamp) * (1 + 0.08 * Math.sin(frame * 0.6));
  const folderColors = ["#2c3d55", "#3c5272", rgba(t.accent, 0.9), "#203c4c", "#4a5b74", rgba(t.cool, 0.75)];
  const labels = ["LOG", "SQL", "KEY", "PEM", "", "", ""];
  const N = 150;
  type It = { i: number; sx: number; sy: number; s: number; depth: number; a: number; kind: number; rx: number; ry: number; rz: number };
  const items: It[] = [];
  for (let i = 0; i < N; i++) {
    let x = (random(`fx${i}`) - 0.5) * 3800;
    const y = (random(`fy${i}`) - 0.5) * 2200;
    if (Math.abs(x) < 380 && Math.abs(y) < 260) {
      x += Math.sign(x || 1) * 420;
    }
    const depth = 300 + random(`fz${i}`) * 3400 - frame * 5;
    if (depth < 60) continue;
    const persp = 1000 / depth;
    // absorption
    const delay = random(`fd${i}`) * 30 + (depth / 3700) * 10;
    const a = interpolate(frame, [62 + delay, 102 + delay], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    const sx0 = 960 + x * persp;
    const sy0 = 540 + y * persp;
    const swirl = a * 1.4;
    const dx = sx0 - 960;
    const dy = sy0 - 540;
    const k = 1 - a;
    const sx = 960 + (dx * Math.cos(swirl) - dy * Math.sin(swirl)) * k;
    const sy = 540 + (dx * Math.sin(swirl) + dy * Math.cos(swirl)) * k;
    items.push({
      i,
      sx,
      sy,
      s: persp * (1 - a * 0.8),
      depth,
      a,
      kind: i % 5 === 0 ? 1 : 0,
      rx: random(`rx${i}`) * 360 + frame * (random(`vx${i}`) - 0.5) * 6,
      ry: random(`ry${i}`) * 360 + frame * (random(`vy${i}`) - 0.5) * 6,
      rz: random(`rz${i}`) * 360 + frame * (random(`vz${i}`) - 0.5) * 4,
    });
  }
  items.sort((p, q) => q.depth - p.depth);

  // particles from dissolving items
  const dots: React.ReactNode[] = [];
  for (const it of items) {
    if (it.a < 0.05) continue;
    for (let j = 0; j < 6; j++) {
      const lag = random(`pl${it.i}${j}`) * 0.4;
      const pa = Math.max(0, Math.min(1, (it.a - lag) / (1 - lag)));
      const jx = (random(`px${it.i}${j}`) - 0.5) * 160 * it.s;
      const jy = (random(`py${it.i}${j}`) - 0.5) * 160 * it.s;
      const x = it.sx + jx * (1 - pa);
      const y = it.sy + jy * (1 - pa);
      dots.push(<circle key={`${it.i}-${j}`} cx={x} cy={y} r={1.5 + random(`pr${it.i}${j}`) * 2.5} fill={j % 2 ? t.accentLight : "white"} opacity={(1 - pa * 0.6) * Math.min(1, it.a * 4)} />);
    }
  }
  // ambient sparks streaming in
  for (let j = 0; j < 160; j++) {
    const ph = (random(`sp${j}`) + frame * 0.012 * (0.6 + random(`spv${j}`))) % 1;
    const ang = random(`spa${j}`) * Math.PI * 2 + ph * 1.2;
    const r = (1 - ph) * 1100;
    dots.push(<circle key={`s${j}`} cx={960 + Math.cos(ang) * r} cy={540 + Math.sin(ang) * r * 0.7} r={1.4} fill={t.accentLight} opacity={interpolate(frame, [40, 80], [0, 0.9], clamp) * ph} />);
  }

  const ring = interpolate(frame, [92, 112], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${t.bg2} 0%, ${t.bg} 70%)`, overflow: "hidden" }}>
      {items.map((it) => (
        <div
          key={it.i}
          style={{
            position: "absolute",
            left: it.sx,
            top: it.sy,
            transform: `translate(-50%,-50%) scale(${it.s}) perspective(600px) rotateX(${it.rx}deg) rotateY(${it.ry}deg) rotateZ(${it.rz}deg)`,
            opacity: interpolate(it.depth, [600, 3700], [1, 0.25], clamp) * (1 - interpolate(it.a, [0.4, 0.9], [0, 1], clamp)),
            filter: it.depth < 500 ? "blur(3px)" : undefined,
          }}
        >
          {it.kind === 1 ? <SolidDoc s={150} /> : <SolidFolder s={190} c={folderColors[it.i % folderColors.length]} label={labels[it.i % labels.length]} />}
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 3px ${t.accent})` }}>
        {dots}
      </svg>
      <Orb x={960} y={540} size={orbSize} power={orbPower} spin={frame * 1.5} />
      {ring > 0
        ? new Array(6).fill(0).map((_, i) => {
            const ang = (i / 6) * Math.PI * 2 + frame * 0.05;
            const R = 210 * ring;
            const z = Math.sin(ang);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 + Math.cos(ang) * R,
                  top: 540 + z * R * 0.45,
                  transform: `translate(-50%,-50%) scale(${0.55 + z * 0.15}) rotateY(${Math.cos(ang) * 50}deg)`,
                  opacity: ring,
                  zIndex: z > 0 ? 2 : 0,
                }}
              >
                <GlassFile size={130} icon="lock" label="ENC" />
              </div>
            );
          })
        : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Comet through starfield                                           */
/* ------------------------------------------------------------------ */
export const Comet: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const D = 88;
  const head = (f: number) => {
    const u = Math.max(0, f) / D;
    const ang = Math.PI * 1.05 + u * Math.PI * 2.4;
    const R = interpolate(u, [0, 0.5, 1], [900, 330, 40], clamp);
    return { x: 960 + Math.cos(ang) * R * 1.25, y: 560 + Math.sin(ang) * R * 0.55 - u * 60 };
  };
  const strands = [0, 1, 2].map((sIdx) => {
    const pts: string[] = [];
    for (let k = 0; k < 70; k++) {
      const f = frame - k * 0.45;
      const p = head(f);
      const off = sIdx === 0 ? 0 : (sIdx === 1 ? 1 : -1) * k * 0.7 * Math.sin(k * 0.12 + frame * 0.1);
      pts.push(`${p.x.toFixed(1)},${(p.y + off).toFixed(1)}`);
    }
    return pts.join(" ");
  });
  const h = head(frame);
  const travel = frame * 0.004 + interpolate(frame, [55, 88], [0, 0.35], { ...clamp, easing: Easing.in(Easing.quad) });
  const stretch = interpolate(frame, [0, 60, 88], [0.4, 1.2, 6], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #06101c 0%, #010308 75%)`, overflow: "hidden" }}>
      <StarStreaks travel={travel} stretch={stretch} color={t.accentLight} count={600} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 10px ${t.accent})` }}>
        {strands.map((s, i) => (
          <polyline key={i} points={s} fill="none" stroke={i === 0 ? t.accentLight : t.accent} strokeWidth={i === 0 ? 4 : 1.6} strokeLinecap="round" opacity={i === 0 ? 0.95 : 0.7} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: h.x - 90, top: h.y - 90, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, white 0%, ${rgba(t.accentLight, 0.9)} 12%, ${rgba(t.accent, 0.35)} 35%, transparent 70%)` }} />
      <div style={{ position: "absolute", left: h.x - 160, top: h.y - 1, width: 320, height: 2, background: `linear-gradient(90deg, transparent, white, transparent)` }} />
      <div style={{ position: "absolute", left: h.x - 1, top: h.y - 100, width: 2, height: 200, background: `linear-gradient(180deg, transparent, white, transparent)` }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Warp speed with glass assets flying past                          */
/* ------------------------------------------------------------------ */
const WARP_ITEMS: { kind: "folder" | "file" | "tile"; icon: IconName; label: string }[] = [
  { kind: "folder", icon: "shield", label: "" },
  { kind: "file", icon: "key", label: "PEM" },
  { kind: "tile", icon: "radar", label: "" },
  { kind: "file", icon: "terminal", label: "LOG" },
  { kind: "folder", icon: "lock", label: "" },
  { kind: "file", icon: "bug", label: "CVE" },
  { kind: "tile", icon: "fingerprint", label: "" },
  { kind: "file", icon: "network", label: "PCAP" },
  { kind: "folder", icon: "server", label: "" },
  { kind: "file", icon: "code", label: "SQL" },
  { kind: "tile", icon: "eye", label: "" },
  { kind: "file", icon: "chip", label: "BIN" },
];

export const Warp: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const travel = 0.35 + frame * 0.012 + interpolate(frame, [0, 95], [0, 0.6], { ...clamp, easing: Easing.in(Easing.quad) });
  const items = new Array(44).fill(0).map((_, i) => {
    const start = random(`wst${i}`) * 70;
    const life = 40;
    const u = (frame - start) / life; // 0 far -> 1 at camera
    const a = random(`wa${i}`) * Math.PI * 2;
    const rr = 180 + random(`wr${i}`) * 520;
    const depth = interpolate(u, [0, 1], [3000, 120]);
    const s = 700 / depth;
    return { i, u, x: 960 + Math.cos(a) * rr * s, y: 540 + Math.sin(a) * rr * s * 0.75, s, depth, it: WARP_ITEMS[i % WARP_ITEMS.length], rot: (random(`wrt${i}`) - 0.5) * 50 };
  });
  const hero = interpolate(frame, [30, 92], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const heroScale = interpolate(hero, [0, 1], [0.08, 4.5]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #08131f 0%, #010307 70%)`, overflow: "hidden" }}>
      <StarStreaks travel={travel} stretch={interpolate(frame, [0, 95], [4, 10])} color={t.accentLight} count={650} seed="wp" />
      <div style={{ position: "absolute", left: 660, top: 240, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(t.accentLight, 0.5)} 0%, transparent 60%)` }} />
      {items
        .filter((p) => p.u > 0 && p.u < 1)
        .sort((p, q) => q.depth - p.depth)
        .map((p) => (
          <div
            key={p.i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translate(-50%,-50%) scale(${p.s}) perspective(800px) rotateY(${p.rot}deg)`,
              opacity: interpolate(p.u, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
              filter: p.s > 2.5 ? "blur(4px)" : undefined,
            }}
          >
            {p.it.kind === "folder" ? (
              <GlassFolder size={260} icon={p.it.icon} style={{ left: -130, top: -100 }} />
            ) : p.it.kind === "file" ? (
              <GlassFile size={220} icon={p.it.icon} label={p.it.label} style={{ left: -88, top: -110 }} />
            ) : (
              <GlassTile w={220} h={170} icon={p.it.icon} style={{ left: -110, top: -85 }} />
            )}
          </div>
        ))}
      {hero > 0 ? (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${heroScale})`, opacity: interpolate(hero, [0, 0.1, 0.85, 1], [0, 1, 1, 0]) }}>
          <GlassFolder size={420} icon="shieldCheck" style={{ left: -210, top: -164 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
