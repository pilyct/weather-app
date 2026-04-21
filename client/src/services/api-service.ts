import { WeatherData, PoemData, CitySuggestion } from "../types";

const URL = "http://localhost:3000";

async function getWeatherData(city: string = "Berlin"): Promise<WeatherData> {
  try {
    const response = await fetch(`${URL}/weather?city=${city}`);
    const data = await response.json();
    return data as WeatherData;
  } catch (err) {
    console.error("Error fetching weather data:", err);
    throw err;
  }
}

async function getWeatherDataByCoords(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  try {
    const response = await fetch(`${URL}/weather/coords?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return data as WeatherData;
  } catch (err) {
    console.error("Error fetching weather data by coords:", err);
    throw err;
  }
}

async function getCitySuggestions(query: string): Promise<CitySuggestion[]> {
  try {
    const response = await fetch(
      `${URL}/cities/suggestions?query=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data as CitySuggestion[];
  } catch (err) {
    console.error("Error fetching city suggestions:", err);
    return [];
  }
}

async function getPoetryData(keyword: string): Promise<PoemData> {
  try {
    const response = await fetch(
      `${URL}/poem?keyword=${encodeURIComponent(keyword)}`,
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();

    return data as PoemData;
  } catch (error: any) {
    console.error("Error fetching poem data:", error.message);
    throw error;
  }
}

export {
  getWeatherData,
  getWeatherDataByCoords,
  getPoetryData,
  getCitySuggestions,
};
