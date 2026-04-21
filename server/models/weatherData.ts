import { config } from "dotenv";
config();

interface OpenWeatherMapConfig {
  BASE_URL: string;
  GEO_URL: string;
  GEO_REVERSE_URL: string;
  API_KEY: string | undefined;
}

const openWeatherMap: OpenWeatherMapConfig = {
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEO_URL: "https://api.openweathermap.org/geo/1.0/direct",
  GEO_REVERSE_URL: "https://api.openweathermap.org/geo/1.0/reverse",
  API_KEY: process.env.WEATHER_SECRET_KEY,
};

export default openWeatherMap;
