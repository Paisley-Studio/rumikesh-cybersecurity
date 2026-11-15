import React, { createContext, useContext, useId } from "react";
import { FONT_MONO, rgba, Theme, THEMES } from "../theme";
import { Icon, IconName } from "./Icons";

export const ThemeCtx = createContext<Theme>(THEMES.pink);
export const useTheme = () => useContext(ThemeCtx);

/** Rounded glass card with an icon and an optional label. */
export const GlassTile: React.FC<{
  w: number;
  h: number;
  icon?: IconName;
  label?: string;
  tint?: string;
  glow?: number;
  iconColor?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ w, h, icon, label, tint, glow = 0.35, iconColor, style, children }) => {
  const t = useTheme();
  const c = tint ?? t.accent;
  const s = Math.min(w, h);
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        borderRadius: s * 0.12,
        background: `linear-gradient(150deg, rgba(${t.glass},0.30) 0%, rgba(${t.glass},0.10) 38%, rgba(${t.glass},0.04) 70%, ${rgba(c, 0.16)} 100%)`,
        border: `${Math.max(1, s * 0.012)}px solid rgba(${t.glass},0.45)`,
        boxShadow: `inset 0 ${s * 0.02}px ${s * 0.05}px rgba(255,255,255,0.35), inset 0 -${s * 0.04}px ${s * 0.1}px ${rgba(c, 0.25)}, 0 0 ${s * 0.25}px ${rgba(c, glow)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s * 0.1,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* specular sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 42%, transparent 52%)",
        }}
      />
      {children}
      {icon ? (
        <Icon
          name={icon}
          size={s * (label ? 0.42 : 0.55)}
          color={iconColor ?? "rgba(255,255,255,0.92)"}
          glow={c}
        />
      ) : null}
      {label ? (
        <div
          style={{
            fontFamily: FONT_MONO,
            fontWeight: 600,
            fontSize: s * 0.2,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: s * 0.01,
            textShadow: `0 0 ${s * 0.08}px ${rgba(c, 0.8)}`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** A translucent glass folder drawn in SVG. `open` 0..1 tilts the front flap. */
export const GlassFolder: React.FC<{
  size: number;
  icon?: IconName;
  label?: string;
  open?: number;
  tint?: string;
  insert?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ size, icon, label, open = 0, tint, insert, style }) => {
  const t = useTheme();
  const c = tint ?? t.accent;
  const id = useId().replace(/:/g, "");
  const w = size;
  const h = size * 0.78;
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <svg width={w} height={h} viewBox="0 0 100 78" style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`rgba(${t.glass},0.40)`} />
            <stop offset="0.6" stopColor={`rgba(${t.glass},0.10)`} />
            <stop offset="1" stopColor={rgba(c, 0.25)} />
          </linearGradient>
          <linearGradient id={`f${id}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={`rgba(${t.glass},0.45)`} />
            <stop offset="0.5" stopColor={`rgba(${t.glass},0.14)`} />
            <stop offset="1" stopColor={rgba(c, 0.35)} />
          </linearGradient>
        </defs>
        {/* back panel with tab */}
        <path
          d="M4 8a4 4 0 0 1 4-4h22l7 7h55a4 4 0 0 1 4 4v55a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
          fill={`url(#b${id})`}
          stroke={`rgba(${t.glass},0.7)`}
          strokeWidth="0.8"
        />
      </svg>
      {insert ? (
        <div
          style={{
            position: "absolute",
            left: w * 0.12,
            top: h * 0.12 - open * h * 0.1,
            width: w * 0.76,
            height: h * 0.62,
            borderRadius: w * 0.04,
            overflow: "hidden",
          }}
        >
          {insert}
        </div>
      ) : null}
      <svg
        width={w}
        height={h}
        viewBox="0 0 100 78"
        style={{
          position: "absolute",
          overflow: "visible",
          transformOrigin: "50% 100%",
          transform: `perspective(${size * 3}px) rotateX(${open * 38}deg)`,
          filter: `drop-shadow(0 0 ${size * 0.05}px ${rgba(c, 0.55)})`,
        }}
      >
        {/* front panel */}
        <path
          d="M2 26a4 4 0 0 1 4-4h88a4 4 0 0 1 4 4l-2 44a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
          fill={`url(#f${id})`}
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="0.9"
        />
        <path d="M6 25h88" stroke="rgba(255,255,255,0.8)" strokeWidth="0.6" />
      </svg>
      {icon || label ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: h * 0.36,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: size * 0.06,
            transformOrigin: "50% 100%",
            transform: `perspective(${size * 3}px) rotateX(${open * 38}deg)`,
          }}
        >
          {icon ? <Icon name={icon} size={size * 0.28} color="rgba(255,255,255,0.95)" glow={c} /> : null}
          {label ? (
            <span
              style={{
                fontFamily: FONT_MONO,
                fontWeight: 600,
                fontSize: size * 0.13,
                color: "white",
                textShadow: `0 0 ${size * 0.05}px ${c}`,
              }}
            >
              {label}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/** Glass document with folded corner, icon and label. */
export const GlassFile: React.FC<{
  size: number;
  icon?: IconName;
  label?: string;
  tint?: string;
  style?: React.CSSProperties;
}> = ({ size, icon, label, tint, style }) => {
  const t = useTheme();
  const c = tint ?? t.accent;
  const id = useId().replace(/:/g, "");
  const w = size * 0.8;
  const h = size;
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <svg width={w} height={h} viewBox="0 0 80 100" style={{ position: "absolute", overflow: "visible", filter: `drop-shadow(0 0 ${size * 0.06}px ${rgba(c, 0.5)})` }}>
        <defs>
          <linearGradient id={`d${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`rgba(${t.glass},0.48)`} />
            <stop offset="0.55" stopColor={`rgba(${t.glass},0.12)`} />
            <stop offset="1" stopColor={rgba(c, 0.32)} />
          </linearGradient>
        </defs>
        <path d="M6 2h48l22 22v70a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill={`url(#d${id})`} stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
        <path d="M54 2v18a4 4 0 0 0 4 4h18" fill={`rgba(${t.glass},0.35)`} stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: h * 0.12,
          gap: h * 0.04,
        }}
      >
        {icon ? <Icon name={icon} size={size * 0.34} color="white" glow={c} /> : null}
        {label ? (
          <span
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 600,
              fontSize: size * 0.16,
              color: "white",
              letterSpacing: size * 0.01,
              textShadow: `0 0 ${size * 0.05}px ${c}`,
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
};
