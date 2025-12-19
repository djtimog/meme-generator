import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RGBAColor } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rgbaToCss = (color?: RGBAColor) => {
  if (!color) return undefined;
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
