import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { LightStreak } from "../components/Atmosphere";
import { GlassFolder, GlassTile, useTheme } from "../components/Glass";
import { Icon, IconName } from "../components/Icons";
import { FONT_MONO, FONT_SANS, rgba, Theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const MODULES: [IconName, string][] = [
  ["shield", "FIREWALL"],
  ["eye", "IDS"],
  ["lock", "VPN"],
  ["radar", "SIEM"],
  ["server", "SOC"],
  ["bug", "CVE"],
  ["key", "MFA"],
  ["fingerprint", "IAM"],
  ["chip", "EDR"],
  ["terminal", "PENTEST"],
  ["globe", "DNS"],
  ["cloud", "CASB"],
  ["alert", "XDR"],
  ["network", "ZTNA"],
  ["code", "SAST"],
  ["activity", "NDR"],
  ["file", "DLP"],
  ["wifi", "WAF"],
];

/* Mini dashboard thumbnails drawn in SVG */
const Thumb: React.FC<{ kind: number; w: number; h: number; t: Theme; seed: string; frame: number }> = ({ kind, w, h, t, seed, frame }) => {
  const bg = `linear-gradient(135deg, ${rgba(t.accent, 0.55)} 0%, #101a2c 55%, ${rgba(t.cool, 0.45)} 100%)`;
  const content = (() => {
    switch (kind % 6) {
      case 0: {
        const pts = new Array(24).fill(0).map((_, i) => `${(i / 23) * w},${h * 0.7 - (Math.sin(i * 0.8 + frame * 0.1) * 0.2 + random(`${seed}${i}`) * 0.3) * h}`);
        return <polyline points={pts.join(" ")} fill="none" stroke="white" strokeWidth={2.5} />;
      }
      case 1:
        return (
          <>
            {new Array(9).fill(0).map((_, i) => {
              const bh = h * (0.2 + 0.55 * Math.abs(Math.sin(i * 1.3 + frame * 0.08 + random(seed) * 5)));
              return <rect key={i} x={w * 0.08 + i * w * 0.095} y={h * 0.88 - bh} width={w * 0.06} height={bh} rx={2} fill={i % 3 ? "white" : t.accentLight} opacity={0.9} />;
            })}
          </>
        );
      case 2:
        return (
          <>
            {new Array(46).fill(0).map((_, i) => (
              <circle key={i} cx={w * (0.08 + random(`${seed}m${i}`) * 0.84)} cy={h * (0.15 + random(`${seed}n${i}`) * 0.7)} r={i % 7 === 0 ? 4 : 1.8} fill={i % 7 === 0 ? t.accentLight : "white"} opacity={i % 7 === 0 ? 0.5 + 0.5 * Math.sin(frame * 0.3 + i) : 0.6} />
            ))}
          </>
        );
      case 3: {
        const p = 0.3 + random(seed) * 0.5;
        const r = h * 0.32;
        const a = p * Math.PI * 2;
        return (
          <g transform={`translate(${w / 2},${h / 2})`}>
            <circle r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={r * 0.35} />
            <path d={`M0 ${-r} A${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${Math.sin(a) * r} ${-Math.cos(a) * r}`} fill="none" stroke={t.accentLight} strokeWidth={r * 0.35} />
          </g>
        );
      }
      case 4:
        return (
          <g transform={`translate(${w / 2},${h / 2})`}>
            <circle r={h * 0.36} fill="none" stroke="rgba(255,255,255,0.4)" />
            <circle r={h * 0.22} fill="none" stroke="rgba(255,255,255,0.3)" />
            <line x1={0} y1={0} x2={Math.cos(frame * 0.15) * h * 0.36} y2={Math.sin(frame * 0.15) * h * 0.36} stroke={t.accentLight} strokeWidth={3} />
          </g>
        );
      default:
        return (
          <g transform={`translate(${w / 2},${h / 2})`}>
            <circle r={h * 0.26} fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth={2} />
            <path d={`M${-h * 0.08} ${-h * 0.12} L${h * 0.13} 0 L${-h * 0.08} ${h * 0.12}Z`} fill="white" />
          </g>
        );
    }
  })();
  return (
    <div style={{ width: w, height: h, background: bg, borderRadius: 8, overflow: "hidden" }}>
      <svg width={w} height={h}>{content}</svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 7. Wall of glass security modules                                    */
/* ------------------------------------------------------------------ */
export const TileWall: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const cols = 13;
  const rows = 8;
  const tw = 210;
  const th = 150;
  const gap = 26;
  const push = interpolate(frame, [0, 68], [-700, 320], { easing: Easing.inOut(Easing.quad) });
  const ry = interpolate(frame, [0, 68], [-10, 8]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0b1a26 0%, #010307 75%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1300 }}>
        <div style={{ position: "absolute", left: 960, top: 540, transformStyle: "preserve-3d", transform: `translateZ(${push}px) rotateX(6deg) rotateY(${ry}deg)` }}>
          {new Array(rows * cols).fill(0).map((_, k) => {
            const c = k % cols;
            const r = Math.floor(k / cols);
            const x = (c - (cols - 1) / 2) * (tw + gap);
            const y = (r - (rows - 1) / 2) * (th + gap);
            const dist = Math.hypot(c - cols / 2, r - rows / 2);
            const pop = interpolate(frame, [dist * 2, dist * 2 + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            const m = MODULES[(k * 7) % MODULES.length];
            const hot = random(`hot${k}`) > 0.85;
            const variant = k % 3;
            return (
              <div key={k} style={{ position: "absolute", left: x - tw / 2, top: y - th / 2, opacity: pop, transform: `translateZ(${(1 - pop) * -400 + random(`tz${k}`) * 40}px)` }}>
                {variant === 1 ? (
                  <GlassFolder size={tw * 0.92} icon={m[0]} style={{ left: tw * 0.04, top: 0 }} />
                ) : (
                  <GlassTile w={tw} h={th} icon={m[0]} label={m[1]} glow={hot ? 0.8 : 0.25} iconColor={hot ? t.accentLight : undefined} />
                )}
              </div>
            );
          })}
          {/* light cross lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const vx = (Math.floor(random(`lx${i}`) * cols) - cols / 2) * (tw + gap);
            const hy = (Math.floor(random(`ly${i}`) * rows) - rows / 2) * (th + gap);
            const fl = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.2 + i * 1.7));
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: vx - 1, top: -900, width: 3, height: 1800, background: `linear-gradient(180deg, transparent, ${t.accentLight}, white, ${t.accentLight}, transparent)`, opacity: fl, boxShadow: `0 0 18px ${t.accent}`, transform: "translateZ(30px)" }} />
                <div style={{ position: "absolute", left: -1600, top: hy - 1, width: 3200, height: 3, background: `linear-gradient(90deg, transparent, ${t.accentLight}, white, ${t.accentLight}, transparent)`, opacity: fl * 0.8, boxShadow: `0 0 18px ${t.accent}`, transform: "translateZ(30px)" }} />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Tunnel fly-through                                                */
/* ------------------------------------------------------------------ */
export const Tunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const cam = interpolate(frame, [0, 78], [0, 5200], { easing: Easing.in(Easing.quad) }) + frame * 20;
  const hw = 760;
  const hh = 440;
  const depthCount = 24;
  const step = 340;
  const tiles: React.ReactNode[] = [];
  const walls = [
    { key: "L", tf: (z: number, j: number) => `translate3d(${-hw}px, ${(j - 1) * 290}px, ${z}px) rotateY(90deg)` },
    { key: "R", tf: (z: number, j: number) => `translate3d(${hw}px, ${(j - 1) * 290}px, ${z}px) rotateY(-90deg)` },
    { key: "T", tf: (z: number, j: number) => `translate3d(${(j - 1) * 480}px, ${-hh}px, ${z}px) rotateX(-90deg)` },
    { key: "B", tf: (z: number, j: number) => `translate3d(${(j - 1) * 480}px, ${hh}px, ${z}px) rotateX(90deg)` },
  ];
  for (const w of walls) {
    for (let k = 0; k < depthCount; k++) {
      for (let j = 0; j < 3; j++) {
        const z = -k * step;
        const vis = z + cam;
        if (vis > 900) continue;
        const idx = k * 3 + j + w.key.charCodeAt(0);
        const m = MODULES[idx % MODULES.length];
        const thumb = idx % 4 === 0;
        tiles.push(
          <div key={`${w.key}${k}${j}`} style={{ position: "absolute", left: -130, top: -95, transform: w.tf(z, j) }}>
            {thumb ? (
              <GlassTile w={260} h={190} glow={0.2}>
                <div style={{ position: "absolute", left: 16, top: 16 }}>
                  <Thumb kind={idx} w={228} h={158} t={t} seed={`tn${idx}`} frame={frame} />
                </div>
              </GlassTile>
            ) : (
              <GlassTile w={260} h={190} icon={m[0]} label={idx % 3 === 0 ? m[1] : undefined} glow={0.2} />
            )}
          </div>,
        );
      }
    }
  }
  const out = interpolate(frame, [62, 78], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#010307", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: out > 0 ? `blur(${out * 14}px)` : undefined, opacity: 1 - out * 0.6 }}>
        <div style={{ position: "absolute", inset: 0, perspective: 700 }}>
          <div style={{ position: "absolute", left: 960, top: 540, transformStyle: "preserve-3d", transform: `translateZ(${cam}px) rotateZ(${Math.sin(frame * 0.04) * 4}deg)` }}>
            {tiles}
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 340, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(t.accentLight, 0.45)} 0%, transparent 65%)` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9. Hero glass vault folder                                           */
/* ------------------------------------------------------------------ */
export const HeroVault: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const inP = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const turn = interpolate(frame, [22, 74], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const scale = interpolate(inP, [0, 1], [0.45, 1]) * interpolate(turn, [0, 1], [1, 1.12]);
  const ry = interpolate(turn, [0, 1], [0, -38]);
  const x = interpolate(turn, [0, 1], [0, -380]);
  const open = interpolate(frame, [26, 60], [0, 0.45], { ...clamp, easing: Easing.out(Easing.cubic) });
  const streak = interpolate(frame, [0, 20, 74], [0.3, 1, 0.7], clamp);
  const insert = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: `linear-gradient(135deg, #f7c84a 0%, ${t.accent} 40%, #2b56ff 75%, #0e1626 100%)` }}>
      <div style={{ position: "absolute", left: "8%", bottom: "-20%", width: "60%", height: "80%", borderRadius: "50%", background: rgba(t.cool, 0.8), filter: "blur(8px)" }} />
      <div style={{ position: "absolute", right: "8%", top: "12%" }}>
        <Icon name="shieldCheck" size={190} color="white" strokeWidth={1.8} glow={t.accentLight} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0e1d2a 0%, #010307 70%)`, overflow: "hidden" }}>
      {/* background folder grid */}
      <div style={{ position: "absolute", inset: 0, perspective: 1200 }}>
        <div style={{ position: "absolute", left: 960, top: 540, transformStyle: "preserve-3d", transform: `translateZ(${-400 + frame * 3}px) translateX(${x * 0.4}px)` }}>
          {new Array(7 * 11).fill(0).map((_, k) => {
            const c = (k % 11) - 5;
            const r = Math.floor(k / 11) - 3;
            if (Math.abs(c) <= 1 && Math.abs(r) <= 1) return null;
            const m = MODULES[(k * 5) % MODULES.length];
            return (
              <div key={k} style={{ position: "absolute", left: c * 270 - 115, top: r * 230 - 90, opacity: 0.55, filter: "brightness(0.7)" }}>
                {k % 2 ? <GlassFolder size={230} icon={m[0]} /> : <GlassTile w={230} h={170} icon={m[0]} label={m[1]} glow={0.1} />}
              </div>
            );
          })}
        </div>
      </div>
      {/* light grid lines */}
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.4 }}>
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
          <line key={i} x1={960 + i * 300 + x * 0.2} y1={0} x2={960 + i * 180 + x * 0.2} y2={1080} stroke={rgba(t.accentLight, 0.5)} strokeWidth={1} />
        ))}
      </svg>
      <LightStreak y={560} intensity={streak} color={t.accent} width={2400} />
      <div style={{ position: "absolute", left: 960 + x, top: 540, perspective: 1600 }}>
        <div style={{ transform: `translate(-50%,-50%) scale(${scale}) rotateY(${ry}deg) rotateX(${Math.sin(frame * 0.05) * 4}deg)`, width: 640, height: 500, opacity: inP }}>
          <GlassFolder size={640} open={open} insert={insert} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 10. Rows of security dashboards panning                              */
/* ------------------------------------------------------------------ */
const CARD_NAMES = ["Threat Map", "Live Traffic", "Vuln Scan", "SOC Feed", "Firewall Logs", "Pen Test", "Incident", "Dark Web", "Endpoint", "Cloud Audit", "Malware Lab", "Zero Trust"];

export const DashboardRows: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const rush = interpolate(frame, [72, 100], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const cw = 300;
  const ch = 240;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 75% 50%, ${rgba(t.accent, 0.25)} 0%, #061019 35%, #010307 75%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + rush * 2})`, filter: rush > 0 ? `blur(${rush * 18}px)` : undefined, opacity: 1 - rush * 0.7 }}>
        <div style={{ position: "absolute", inset: 0, perspective: 1400, perspectiveOrigin: "70% 50%" }}>
          <div style={{ position: "absolute", left: 0, top: 540, transformStyle: "preserve-3d", transform: `rotateY(-24deg) translateZ(-200px)` }}>
            {[0, 1, 2].map((row) => {
              const speed = [7, 9, 6][row];
              return new Array(14).fill(0).map((_, i) => {
                const x = i * (cw + 30) - frame * speed + row * 90 - 200;
                const idx = i + row * 5;
                return (
                  <div key={`${row}-${i}`} style={{ position: "absolute", left: x, top: (row - 1) * (ch + 34) - ch / 2 }}>
                    <GlassTile w={cw} h={ch} glow={0.25}>
                      <div style={{ position: "absolute", left: 18, top: 18 }}>
                        <Thumb kind={idx} w={cw - 36} h={ch - 82} t={t} seed={`dr${idx}`} frame={frame} />
                      </div>
                      <div style={{ position: "absolute", left: 20, bottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                        <Icon name={MODULES[idx % MODULES.length][0]} size={26} color={t.accentLight} />
                        <span style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 22, color: "white" }}>{CARD_NAMES[idx % CARD_NAMES.length]}</span>
                      </div>
                      <span style={{ position: "absolute", right: 18, bottom: 22, fontFamily: FONT_MONO, fontSize: 14, color: rgba(t.cool, 0.9) }}>LIVE</span>
                    </GlassTile>
                  </div>
                );
              });
            })}
          </div>
        </div>
        <LightStreak y={540} intensity={0.8} color={t.accent} width={2600} />
        <div style={{ position: "absolute", left: 1350, top: 240, width: 700, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(t.accentLight, 0.5)} 0%, transparent 60%)`, mixBlendMode: "screen" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
