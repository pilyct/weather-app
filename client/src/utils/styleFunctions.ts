import type { Units } from "../types";

export function formatBackground(weather: any) {
  // keep your existing logic; return a background class
  return "bg-gradient-to-b";
}

export function formatAreaStroke(_data: any, _units: Units) {
  return "rgba(255,255,255,0.9)";
}

export function formatAreaFill(_data: any, _units: Units) {
  return "rgba(255,255,255,0.25)";
}
