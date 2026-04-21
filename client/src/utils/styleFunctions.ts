import { convertCelsiusToFahrenheit } from "./helperFunctions";
import { WeatherData, ChartDataHourly, ChartDataDaily } from "../types";

type WeatherDataSubset = Pick<
  WeatherData,
  "weather_description" | "local_time" | "temperature"
>;

const formatBackground = (
  weather: WeatherDataSubset | null | undefined,
): string => {
  if (!weather) return "bg-gradient-to-b";

  const description = weather.weather_description;
  const localTime = weather.local_time;

  const timeParts = localTime.split(" ");
  const timeString = timeParts[5];
  const ampm = timeParts[6];

  let hours = parseInt(timeString.split(":")[0], 10);
  const minutes = parseInt(timeString.split(":")[1], 10);

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const currentDate = new Date();
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);

  const currentHour = currentDate.getHours();
  const isDaytime = currentHour >= 6 && currentHour < 20;

  switch (true) {
    case isDaytime:
      switch (true) {
        case description.includes("clear"):
          return "bg-day-clear";
        case description.includes("few clouds"):
          return "bg-day-few-clouds";
        case description.includes("scattered clouds"):
          return "bg-day-scattered-clouds";
        case description.includes("broken clouds"):
          return "bg-day-broken-clouds";
        case description.includes("overcast clouds"):
          return "bg-day-overcast-clouds";
        case description.includes("shower rain"):
          return "bg-day-shower-rain";
        case description.includes("rain") || description.includes("drizzle"):
          return "bg-day-rain";
        case description.includes("storm"):
          return "bg-day-storm";
        case description.includes("mist"):
          return "bg-day-mist";
        case description.includes("snow"):
          return "bg-day-snow";
        default:
          return "bg-day-default";
      }
    default:
      switch (true) {
        case description.includes("clear"):
          return "bg-night-clear";
        case description.includes("few clouds"):
          return "bg-night-few-clouds";
        case description.includes("scattered clouds"):
          return "bg-night-scattered-clouds";
        case description.includes("broken clouds"):
          return "bg-night-broken-clouds";
        case description.includes("overcast clouds"):
          return "bg-night-overcast-clouds";
        case description.includes("shower rain") ||
          description.includes("drizzle"):
          return "bg-night-shower-rain";
        case description.includes("rain"):
          return "bg-night-rain";
        case description.includes("storm"):
          return "bg-night-storm";
        case description.includes("mist"):
          return "bg-night-mist";
        case description.includes("snow"):
          return "bg-night-snow";
        default:
          return "bg-night-default";
      }
  }
};

interface GradientConfig {
  useGradient: boolean;
  gradientId?: string;
  color: string;
  stops?: Array<{ offset: string; color: string; opacity: number }>;
}

// Maps a celsius value to a hex color on a cold→warm spectrum
const tempToColor = (celsius: number): string => {
  if (celsius <= 0)  return "#60d5f8"; // icy blue
  if (celsius <= 10) return "#7dd4e8"; // light blue
  if (celsius <= 18) return "#a8dcc7"; // mint
  if (celsius <= 24) return "#f5c842"; // warm yellow
  if (celsius <= 30) return "#f59642"; // orange
  return "#f56342";                     // hot red-orange
};

const buildGradientStops = (
  data: ChartDataHourly[] | ChartDataDaily[],
  units: "metric" | "imperial",
  opacity: number,
): Array<{ offset: string; color: string; opacity: number }> => {
  const n = data.length;
  return data.map((d, i) => {
    const celsius = units === "imperial" ? (d.temp - 32) * (5 / 9) : d.temp;
    const offset = n === 1 ? "0%" : `${Math.round((i / (n - 1)) * 100)}%`;
    return { offset, color: tempToColor(celsius), opacity };
  });
};

const formatAreaFillEnhanced = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
): GradientConfig => {
  if (!data || data.length === 0) {
    return { useGradient: false, color: "#ffffff66" };
  }

  const gradientId = `fill-${data.map((d) => Math.round(d.temp)).join("-")}`;
  const stops = buildGradientStops(data, units, 0.45);

  return {
    useGradient: true,
    gradientId,
    color: `url(#${gradientId})`,
    stops,
  };
};

const formatAreaStrokeEnhanced = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
): GradientConfig => {
  if (!data || data.length === 0) {
    return { useGradient: false, color: "#ffffff" };
  }

  const gradientId = `stroke-${data.map((d) => Math.round(d.temp)).join("-")}`;
  const stops = buildGradientStops(data, units, 1);

  return {
    useGradient: true,
    gradientId,
    color: `url(#${gradientId})`,
    stops,
  };
};

// Keep original functions for backward compatibility
const formatAreaFill = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
): string => {
  if (!data || data.length === 0) return "rgba(255, 255, 255, 0.4)";
  const threshold = units === "metric" ? 19 : 66;
  const temperatures = data.map((d) =>
    units === "metric" ? d.temp : convertCelsiusToFahrenheit(d.temp),
  );
  const averageTemp =
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  if (averageTemp <= threshold) return "rgba(77, 208, 225, 0.4)";
  return "rgba(255, 204, 128, 0.4)";
};

const formatAreaStroke = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
): string => {
  if (!data || data.length === 0) return "rgba(255, 255, 255, 1)";
  const threshold = units === "metric" ? 19 : 66;
  const temperatures = data.map((d) =>
    units === "metric" ? d.temp : convertCelsiusToFahrenheit(d.temp),
  );
  const averageTemp =
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  if (averageTemp <= threshold) return "rgba(77, 208, 225, 1)";
  return "rgba(255, 204, 128, 1)";
};

export {
  formatBackground,
  formatAreaFill,
  formatAreaStroke,
  formatAreaFillEnhanced,
  formatAreaStrokeEnhanced,
};
