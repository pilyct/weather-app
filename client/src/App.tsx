import React, { useCallback, useEffect, useState } from "react";
import { getPoetryData, getWeatherData } from "./services/api";
import { formatBackground } from "./utils/styleFunctions";
import type { Units, WeatherData, PoemData } from "./types";
import { cn } from "./lib/cn";

import { WeatherCard } from "./components/weather/WeatherCard";
import { ForecastHourly } from "./components/weather/ForecastHourly";
import { ForecastDaily } from "./components/weather/ForecastDaily";
import { WeatherPoem } from "./components/poem/WeatherPoem";
import Spinner from "./components/Spinner";

const App: React.FC = () => {
  const [city, setCity] = useState<string>("Berlin");
  const [units, setUnits] = useState<Units>("metric");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [poemData, setPoemData] = useState<PoemData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const weatherData = await getWeatherData(city);
      if (!weatherData) throw new Error("City not found");
      setWeather(weatherData);

      const desc = weatherData.weather_description ?? "";
      const words = desc.split(" ").filter(Boolean);
      const keyword = words[1] ?? words[0] ?? "weather";

      const poem = await getPoetryData(keyword);
      if (!poem) throw new Error("No poem data found");
      setPoemData(poem);
    } catch (error: any) {
      console.error("Error fetching data:", error?.message ?? error);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchData();
  }, [fetchData, units]);

  return (
    <div className={cn("min-h-dvh w-full", formatBackground(weather))}>
      <div className="pointer-events-none fixed inset-0 animation-zoomInOut" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
            <div className="w-full lg:w-[24rem] lg:shrink-0">
              <WeatherCard
                setCity={setCity}
                units={units}
                setUnits={setUnits}
                weather={weather}
              />
            </div>

            <div className="min-w-0 flex flex-1 flex-col gap-4">
              <ForecastHourly weather={weather} units={units} />
              <ForecastDaily weather={weather} units={units} />
              <WeatherPoem poemData={poemData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
