import { WeatherData, PoemData, CitySuggestion } from "../types";

const URL = "http://localhost:3000";

async function getWeatherData(city: string): Promise<WeatherData> {
  if (!city) {
    throw new Error("Invalid city value");
  }
  try {
    const response = await fetch(
      `${URL}/weather?city=${encodeURIComponent(city)}`,
    );
    const data = await response.json();
    return data as WeatherData;
  } catch (err) {
    console.error("Error fetching weather data");
    throw err;
  }
}

async function getWeatherDataByCoords(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error("Invalid latitude value");
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    throw new Error("Invalid longitude value");
  }

  try {
    const response = await fetch(`${URL}/weather/coords?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return data as WeatherData;
  } catch (err) {
    console.error("Error fetching weather data by coords");
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
    console.error("Error fetching city suggestions");
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
    console.error("Error fetching poem data");
    throw error;
  }
}

export {
  getWeatherData,
  getWeatherDataByCoords,
  getPoetryData,
  getCitySuggestions,
};
