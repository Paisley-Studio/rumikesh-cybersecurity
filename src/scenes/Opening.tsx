import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { GlassFile, GlassTile, useTheme } from "../components/Glass";
import { Icon, IconName } from "../components/Icons";
import { Hacker, MonitorScreen, Room } from "../components/Room";
import { rgba } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const HOLO_ICONS: IconName[] = ["shield", "lock", "key", "fingerprint", "bug", "terminal", "eye", "radar", "server", "globe", "chip", "alert"];

/** Small floating audio/threat waveform strip. */
const WaveStrip: React.FC<{ w: number; color: string; seed: string }> = ({ w, color, seed }) => {
  const frame = useCurrentFrame();
  const h = w * 0.3;
  const pts: string[] = [];
  for (let i = 0; i <= 50; i++) {
    const env = Math.sin((i / 50) * Math.PI);
    const y = h / 2 + env * h * 0.45 * Math.sin(i * 0.9 + frame * 0.4 + random(seed) * 9) * (0.4 + random(`${seed}${i}`) * 0.6);
    pts.push(`${((i / 50) * w).toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", filter: `drop-shadow(0 0 6px ${color})` }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={2.5} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* 1a. Wide establishing shot                                          */
/* ------------------------------------------------------------------ */
export const HackerWide: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const p = interpolate(frame, [0, 66], [0, 1], clamp);
  const rotY = interpolate(p, [0, 1], [-34, -24]);
  const camZ = interpolate(p, [0, 1], [80, 260], { easing: Easing.inOut(Easing.quad) });
  const holos = new Array(26).fill(0).map((_, i) => ({
    x: (random(`hx${i}`) - 0.5) * 2200,
    y: -520 + random(`hy${i}`) * 700,
    z: -700 + random(`hz${i}`) * 950,
    kind: i % 4,
    icon: HOLO_ICONS[i % HOLO_ICONS.length],
    s: 70 + random(`hs${i}`) * 90,
  }));
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Room camX={260} camY={-60} camZ={camZ} rotY={rotY} rotX={-4}>
        {holos.map((h, i) => {
          const bob = Math.sin(frame * 0.05 + i) * 18;
          const spin = Math.sin(frame * 0.03 + i * 2) * 18;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `translate3d(${h.x + frame * (random(`hv${i}`) - 0.5) * 3}px, ${h.y + bob}px, ${h.z}px) rotateY(${-rotY + spin}deg)`,
              }}
            >
              {h.kind === 0 ? (
                <GlassTile w={h.s * 1.3} h={h.s} icon={h.icon} />
              ) : h.kind === 1 ? (
                <GlassFile size={h.s} icon={h.icon} />
              ) : h.kind === 2 ? (
                <WaveStrip w={h.s * 2.4} color={i % 3 ? t.cool : t.accent} seed={`w${i}`} />
              ) : (
                <div style={{ width: h.s * 0.7, height: h.s * 0.7, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: rgba(t.accent, 0.85), boxShadow: `0 0 30px ${rgba(t.accent, 0.8)}` }}>
                  <Icon name={h.icon} size={h.s * 0.4} color="white" />
                </div>
              )}
            </div>
          );
        })}
      </Room>
      {/* foreground bokeh holos */}
      {new Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`fg${i}`) * 1920 - 100 + frame * (i % 2 ? 2 : -2),
            top: random(`fgy${i}`) * 900,
            filter: "blur(10px)",
            opacity: 0.7,
          }}
        >
          <GlassTile w={260} h={190} icon={HOLO_ICONS[(i * 5) % HOLO_ICONS.length]} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 1b. Monitor close-up with encrypted file                             */
/* ------------------------------------------------------------------ */
export const MonitorClose: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const drift = interpolate(frame, [0, 50], [0, -120]);
  const flyers = new Array(22).fill(0).map((_, i) => {
    const speed = 0.9 + random(`fs${i}`) * 0.8;
    const z0 = 2600 * random(`fz${i}`);
    const z = z0 - frame * 55 * speed; // moving toward camera
    return {
      x: (random(`fx${i}`) - 0.5) * 2600,
      y: (random(`fy${i}`) - 0.5) * 1500,
      z,
      icon: (["shield", "lock", "key", "shieldCheck"] as IconName[])[i % 4],
      round: i % 3 !== 0,
    };
  });
  const fileRot = interpolate(frame, [0, 50], [-40, 25]);
  return (
    <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1200 }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `translateX(${drift}px) translateZ(-200px) rotateY(-8deg)` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: -260 + i * 860, top: 120, transform: `rotateY(${(1 - i) * 14}deg)`, filter: "blur(1.5px)" }}>
              <MonitorScreen w={840} h={520} variant={i === 1 ? 0 : 1} seed={`cl${i}`} />
            </div>
          ))}
        </div>
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 30%, ${rgba(t.bg, 0.7)} 100%)` }} />
      {flyers
        .filter((f) => f.z > 40)
        .sort((a, b) => b.z - a.z)
        .map((f, i) => {
          const s = 900 / (900 + f.z);
          const near = s > 1.2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + f.x * s,
                top: 540 + f.y * s,
                transform: `translate(-50%,-50%) scale(${s})`,
                filter: near ? `blur(${Math.min(12, (s - 1.2) * 8)}px)` : undefined,
                opacity: interpolate(f.z, [1800, 2600], [1, 0], clamp),
              }}
            >
              {f.round ? (
                <div style={{ width: 110, height: 110, borderRadius: 99, background: `linear-gradient(140deg, ${t.accentLight}, ${t.accent})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${rgba(t.accent, 0.7)}` }}>
                  <Icon name={f.icon} size={60} color="white" strokeWidth={2} />
                </div>
              ) : (
                <GlassTile w={150} h={120} icon={f.icon} />
              )}
            </div>
          );
        })}
      <div style={{ position: "absolute", left: 960, top: 540, perspective: 1000 }}>
        <div style={{ transform: `translate(-50%,-50%) rotateY(${fileRot}deg) rotateZ(${Math.sin(frame * 0.08) * 6}deg)`, width: 300, height: 380 }}>
          <GlassFile size={380} icon="lock" label="ENC" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Data spiral around the hacker + whip zoom                         */
/* ------------------------------------------------------------------ */
export const DataSpiral: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const pull = interpolate(frame, [0, 34], [-150, -420], { ...clamp, easing: Easing.out(Easing.cubic) });
  const whip = interpolate(frame, [30, 58], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const N = 56;
  const items = new Array(N).fill(0).map((_, i) => {
    const th = i * 0.62 + frame * 0.07 * (1 + whip * 4);
    const R = 640 + Math.sin(i) * 60;
    const z = Math.sin(th) * R;
    const s = 1000 / (1000 - z * 0.55);
    return {
      i,
      x: 960 + Math.cos(th) * R * s,
      y: 260 + i * 9 + Math.sin(th * 0.5) * 30,
      z,
      s,
      icon: HOLO_ICONS[i % HOLO_ICONS.length],
      kind: i % 3,
    };
  });
  const renderItem = (it: (typeof items)[number]) => (
    <div
      key={it.i}
      style={{
        position: "absolute",
        left: it.x,
        top: it.y,
        transform: `translate(-50%,-50%) scale(${it.s * 0.9})`,
        opacity: interpolate(it.z, [-640, 0], [0.45, 1], clamp),
        filter: it.z > 350 ? "blur(2px)" : undefined,
      }}
    >
      {it.kind === 0 ? (
        <GlassTile w={110} h={80} icon={it.icon} />
      ) : it.kind === 1 ? (
        <WaveStrip w={150} color={it.i % 2 ? t.cool : t.accent} seed={`sp${it.i}`} />
      ) : (
        <GlassFile size={90} icon={it.icon} />
      )}
    </div>
  );
  // ribbon
  const ribbon = (front: boolean) => {
    const segs: string[][] = [];
    let cur: string[] = [];
    for (let k = 0; k < 220; k++) {
      const th = k * 0.16 + frame * 0.07 * (1 + whip * 4);
      const R = 600;
      const z = Math.sin(th) * R;
      if (front !== z > 0) {
        if (cur.length > 1) segs.push(cur);
        cur = [];
        continue;
      }
      const s = 1000 / (1000 - z * 0.55);
      cur.push(`${(960 + Math.cos(th) * R * s).toFixed(1)},${(250 + k * 2.3).toFixed(1)}`);
    }
    if (cur.length > 1) segs.push(cur);
    const d = segs.map((s) => `M${s.join(" L")}`).join(" ");
    return (
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 8px ${t.cool})` }}>
        <path d={d} fill="none" stroke={rgba(t.cool, 0.6)} strokeWidth={3} />
      </svg>
    );
  };
  return (
    <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${1 + whip * 1.8}) rotate(${whip * 28}deg)`,
          filter: whip > 0 ? `blur(${whip * 26}px)` : undefined,
        }}
      >
        <Room camZ={pull} camY={-40} showHacker={false} />
        {items.filter((i) => i.z <= 0).map(renderItem)}
        {ribbon(false)}
        <div style={{ position: "absolute", left: 960 - 230, top: 560 }}>
          <Hacker w={460} />
        </div>
        {ribbon(true)}
        {items.filter((i) => i.z > 0).map(renderItem)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Vortex transition                                                 */
/* ------------------------------------------------------------------ */
export const Vortex: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const scale = interpolate(frame, [0, 36], [2.6, 0.9], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 10, 26, 36], [18, 0, 0, 10], clamp);
  const rot = frame * 13;
  const arms = 7;
  const spiral = (k: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 140; i++) {
      const th = i * 0.07;
      const r = 6 * Math.exp(0.26 * th) * 4;
      const a = th + (k / arms) * Math.PI * 2;
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  };
  const colors = [t.accent, "#0d1a2c", t.cool, "#16243a", t.accentLight, "#0b1322", "#cfd8e6"];
  return (
    <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox="-960 -540 1920 1080" style={{ filter: `blur(${blur}px)` }}>
        <defs>
          <radialGradient id="vxcore">
            <stop offset="0" stopColor={t.accentLight} />
            <stop offset="0.3" stopColor={rgba(t.accent, 0.5)} />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>
        <g transform={`rotate(${rot}) scale(${scale})`}>
          {new Array(arms).fill(0).map((_, k) => (
            <path key={k} d={spiral(k)} fill="none" stroke={colors[k % colors.length]} strokeWidth={90 - k * 6} strokeLinecap="round" opacity={0.92} />
          ))}
        </g>
        <circle r={60} fill="url(#vxcore)" />
        <circle r={5} fill="white" />
      </svg>
    </AbsoluteFill>
  );
};
