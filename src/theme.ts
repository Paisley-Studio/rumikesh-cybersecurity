import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const montserrat = loadMontserrat("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const mono = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const FONT_SANS = montserrat.fontFamily;
export const FONT_MONO = mono.fontFamily;

export type ThemeName = "pink" | "blue";

export type Theme = {
  /** Brand accent — taken from the logo */
  accent: string;
  /** Lighter accent for highlights / cores */
  accentLight: string;
  /** Cool secondary used for data lines & glass tint */
  cool: string;
  /** Deep background */
  bg: string;
  bg2: string;
  /** Glass tint (rgb triplet, used with alpha) */
  glass: string;
  emblem: string;
  word: string;
  tag: string;
};

export const THEMES: Record<ThemeName, Theme> = {
  pink: {
    accent: "#FF1E8C",
    accentLight: "#FF8CC6",
    cool: "#3FD8FF",
    bg: "#02060F",
    bg2: "#0A1426",
    glass: "170, 215, 255",
    emblem: "pink-emblem.png",
    word: "pink-word.png",
    tag: "pink-tag.png",
  },
  blue: {
    accent: "#1E9BFF",
    accentLight: "#8FD3FF",
    cool: "#46F0E0",
    bg: "#03070D",
    bg2: "#101A26",
    glass: "170, 220, 255",
    emblem: "blue-emblem.png",
    word: "blue-word.png",
    tag: "blue-tag.png",
  },
};

/** "#RRGGBB" + alpha -> rgba() */
export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;
