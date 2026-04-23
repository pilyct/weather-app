export interface Coordinates {
  lon: number;
  lat: number;
}

export interface ForecastTime {
  time: string;
  date: string;
  temp: number;
  weather_main: string;
  description: string;
  wind_speed: number;
  icon: string;
}

export interface ForecastDay {
  [day: string]: {
    date: string;
    time: string;
    temp: number;
    icon: string;
  };
}

export interface WeatherData {
  city_name: string;
  country: string;
  coordinates: Coordinates;
  icon: string;
  weather_main: string;
  weather_description: string;
  temperature: number;
  temp_max: number;
  temp_min: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_1h: number;
  sunrise: string;
  sunset: string;
  local_time: string;
  forecast_time: ForecastTime[];
  forecast_day: ForecastDay;
}

export interface PoemData {
  weatherWord: string;
  occurrences: number;
  title: string;
  author: string;
  lines: string[];
}

export interface ChartDataHourly {
  time: string;
  temp: number;
}

export interface ChartDataDaily {
  day: string;
  temp: number;
  icon: string;
}

export type Units = "metric" | "imperial";

export interface CitySuggestion {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  label: string;
}

export interface SavedLocation {
  id: string;
  city_name: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  temp_max: number;
  temp_min: number;
  icon: string;
}
