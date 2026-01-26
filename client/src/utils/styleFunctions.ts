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

// NEW: Interface for gradient configuration
interface GradientConfig {
  useGradient: boolean;
  gradientId?: string;
  color: string;
  stops?: Array<{ offset: string; color: string }>;
}

// NEW: Helper to analyze temperature distribution
const analyzeTemperatures = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
) => {
  if (!data || data.length === 0) return null;

  const threshold = units === "metric" ? 19 : 66;
  const temperatures = data.map((d) =>
    units === "metric" ? d.temp : convertCelsiusToFahrenheit(d.temp),
  );

  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const averageTemp =
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  const tempRange = maxTemp - minTemp;

  return { minTemp, maxTemp, averageTemp, tempRange, threshold };
};

// NEW: Enhanced fill function with gradient support
const formatAreaFillEnhanced = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
): GradientConfig => {
  const analysis = analyzeTemperatures(data, units);

  if (!analysis) {
    return { useGradient: false, color: "rgba(255, 255, 255, 0.4)" };
  }

  const { minTemp, maxTemp, averageTemp, tempRange, threshold } = analysis;

  // If temperature range is very small (< 2 degrees), use solid color
  if (tempRange < 2) {
    const color =
      averageTemp <= threshold
        ? "rgba(77, 208, 225, 0.4)"
        : "rgba(255, 204, 128, 0.4)";
    return { useGradient: false, color };
  }

  // Generate unique gradient ID
  const gradientId = `fill-gradient-${Math.round(minTemp)}-${Math.round(maxTemp)}`;

  const coldColor = "rgba(77, 208, 225, 0.4)";
  const warmColor = "rgba(255, 204, 128, 0.4)";

  // All warm temperatures
  if (minTemp > threshold) {
    return {
      useGradient: true,
      gradientId,
      color: `url(#${gradientId})`,
      stops: [
        { offset: "0%", color: "rgba(255, 180, 100, 0.4)" },
        { offset: "100%", color: warmColor },
      ],
    };
  }

  // All cold temperatures
  if (maxTemp < threshold) {
    return {
      useGradient: true,
      gradientId,
      color: `url(#${gradientId})`,
      stops: [
        { offset: "0%", color: coldColor },
        { offset: "100%", color: "rgba(100, 220, 235, 0.4)" },
      ],
    };
  }

  // Mixed temperatures - create gradient from cold to warm
  const thresholdPosition = Math.max(
    0,
    Math.min(100, ((threshold - minTemp) / tempRange) * 100),
  );

  return {
    useGradient: true,
    gradientId,
    color: `url(#${gradientId})`,
    stops: [
      { offset: "0%", color: coldColor },
      { offset: `${thresholdPosition}%`, color: "rgba(150, 206, 227, 0.4)" },
      { offset: "100%", color: warmColor },
    ],
  };
};

// NEW: Enhanced stroke function with gradient support
const formatAreaStrokeEnhanced = (
  data: ChartDataHourly[] | ChartDataDaily[] | null | undefined,
  units: "metric" | "imperial",
): GradientConfig => {
  const analysis = analyzeTemperatures(data, units);

  if (!analysis) {
    return { useGradient: false, color: "rgba(255, 255, 255, 1)" };
  }

  const { minTemp, maxTemp, averageTemp, tempRange, threshold } = analysis;

  // If temperature range is very small, use solid color
  if (tempRange < 2) {
    const color =
      averageTemp <= threshold
        ? "rgba(77, 208, 225, 1)"
        : "rgba(255, 204, 128, 1)";
    return { useGradient: false, color };
  }

  const gradientId = `stroke-gradient-${Math.round(minTemp)}-${Math.round(maxTemp)}`;

  const coldColor = "rgba(77, 208, 225, 1)";
  const warmColor = "rgba(255, 204, 128, 1)";

  // All warm temperatures
  if (minTemp > threshold) {
    return {
      useGradient: true,
      gradientId,
      color: `url(#${gradientId})`,
      stops: [
        { offset: "0%", color: "rgba(255, 180, 100, 1)" },
        { offset: "100%", color: warmColor },
      ],
    };
  }

  // All cold temperatures
  if (maxTemp < threshold) {
    return {
      useGradient: true,
      gradientId,
      color: `url(#${gradientId})`,
      stops: [
        { offset: "0%", color: coldColor },
        { offset: "100%", color: "rgba(100, 220, 235, 1)" },
      ],
    };
  }

  // Mixed temperatures
  const thresholdPosition = Math.max(
    0,
    Math.min(100, ((threshold - minTemp) / tempRange) * 100),
  );

  return {
    useGradient: true,
    gradientId,
    color: `url(#${gradientId})`,
    stops: [
      { offset: "0%", color: coldColor },
      { offset: `${thresholdPosition}%`, color: "rgba(150, 206, 227, 1)" },
      { offset: "100%", color: warmColor },
    ],
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
