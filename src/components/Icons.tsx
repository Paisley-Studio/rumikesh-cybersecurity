import React from "react";

/** Hand-drawn 24x24 stroke icons for the cyber world. */
const PATHS: Record<string, React.ReactNode> = {
  shield: <path d="M12 2.5l8 3v6c0 5-3.4 9.2-8 10.8C7.4 20.7 4 16.5 4 11.5v-6z" />,
  shieldCheck: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 9.2-8 10.8C7.4 20.7 4 16.5 4 11.5v-6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
      <path d="M12 15v2.5" />
    </>
  ),
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M10.7 12.3L20.5 2.5M17 6l3 3M14.5 8.5l2.5 2.5" />
    </>
  ),
  bug: (
    <>
      <path d="M8 10h8v5a4 4 0 0 1-8 0z" />
      <path d="M9 10a3 3 0 0 1 6 0" />
      <path d="M12 10v9M3.5 13.5H8M16 13.5h4.5M4.5 8.5l3.5 2M19.5 8.5l-3.5 2M4.5 19l3.8-2M19.5 19l-3.8-2" />
    </>
  ),
  terminal: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2" />
      <path d="M6.5 9l3 3-3 3M11.5 15.5h6" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 11v3a8 8 0 0 1-1.2 4.3" />
      <path d="M8.2 8.6A5 5 0 0 1 17 11v2.3" />
      <path d="M5 10.2a7.5 7.5 0 0 1 14-2.4" />
      <path d="M8 12v1.6a10 10 0 0 0 .8 4.2" />
      <path d="M15.2 15.6a14 14 0 0 1-.9 4.4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="3.5" width="18" height="7" rx="1.5" />
      <rect x="3" y="13.5" width="18" height="7" rx="1.5" />
      <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 12l6.4-6.4" />
      <circle cx="15.5" cy="9.5" r="0.8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
    </>
  ),
  chip: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9 2.5v4M15 2.5v4M9 17.5v4M15 17.5v4M2.5 9h4M2.5 15h4M17.5 9h4M17.5 15h4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  cloud: <path d="M7 18.5a5 5 0 1 1 1.2-9.8A6 6 0 0 1 19.2 10a4.2 4.2 0 0 1-.9 8.5z" />,
  file: (
    <>
      <path d="M6 2.5h8.5l4.5 4.5v14.5H6z" />
      <path d="M14 2.5V7h5" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M11 7l-5 9M13 7l5 9M7.2 18h9.6" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
      <path d="M12 19.5h.01" />
    </>
  ),
  activity: <path d="M2.5 12h4l3-8 5 16 3-8h4" />,
};

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export const Icon: React.FC<{
  name: IconName;
  size: number;
  color: string;
  strokeWidth?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({ name, size, color, strokeWidth = 1.6, glow, style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: glow ? `drop-shadow(0 0 ${size * 0.12}px ${glow})` : undefined,
        overflow: "visible",
        ...style,
      }}
    >
      {PATHS[name]}
    </svg>
  );
};
