import type { Units } from "../types";

export function iconUrlFromCode(code: string) {
  // Keep your existing mapping if you have one
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

export function convertCelsiusToFahrenheit(c: number) {
  return (c * 9) / 5 + 32;
}

export function formatTemperature(temp: number, units: Units) {
  const t = Math.round(temp);
  return units === "metric" ? `${t}°C` : `${t}°F`;
}
