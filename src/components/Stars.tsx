import React from "react";
import { random } from "remotion";
import { rgba } from "../theme";

/**
 * Radial star streaks flying out from the centre (warp effect).
 * `travel` is the accumulated distance (integrate speed yourself), `stretch` the streak length factor.
 */
export const StarStreaks: React.FC<{
  travel: number;
  stretch: number;
  color: string;
  count?: number;
  opacity?: number;
  cx?: number;
  cy?: number;
  seed?: string;
}> = ({ travel, stretch, color, count = 520, opacity = 1, cx = 960, cy = 540, seed = "st" }) => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const a = random(`${seed}a${i}`) * Math.PI * 2;
    const zRange = 1;
    // depth cycles from 1 (far) to ~0 (near)
    let z = (random(`${seed}z${i}`) - travel * (0.6 + random(`${seed}v${i}`) * 0.8)) % zRange;
    if (z < 0) z += zRange;
    z = Math.max(z, 0.02);
    const spread = 60 + random(`${seed}r${i}`) * 180;
    const r = spread / z;
    const r0 = spread / Math.min(1, z + stretch * 0.02);
    if (r > 1500) continue;
    const x1 = cx + Math.cos(a) * r0;
    const y1 = cy + Math.sin(a) * r0;
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    const near = 1 - z;
    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i % 7 === 0 ? "white" : color}
        strokeWidth={0.6 + near * 3.2}
        strokeLinecap="round"
        opacity={Math.min(1, near * 1.6) * opacity}
      />,
    );
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 4px ${rgba(color, 0.9)})` }}>
      {lines}
    </svg>
  );
};
