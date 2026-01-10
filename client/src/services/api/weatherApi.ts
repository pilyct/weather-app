import type { WeatherData } from "../../types";

export async function getWeatherData(
  city: string
): Promise<WeatherData | null> {
  // Replace with your actual endpoint logic
  // Keep this signature so App.tsx stays clean.
  try {
    const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) return null;
    return (await res.json()) as WeatherData;
  } catch {
    return null;
  }
}
