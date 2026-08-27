import "./App.css";
import { useState, useEffect, useCallback } from "react";
import {
  getWeatherData,
  getWeatherDataByCoords,
  getPoetryData,
} from "./services/api-service";
import { formatBackground } from "./utils/styleFunctions";
import WeatherCard from "./components/WeatherCard";
import ForecastDaily from "./components/ForecastDaily";
import ForecastHourly from "./components/ForecastHourly";
import WeatherPoem from "./components/WeatherPoem";
import Spinner from "./components/Spinner";
import { WeatherData, PoemData } from "./types";

type AppState = {
  weather: WeatherData | null;
  poem: PoemData | null;
  loading: boolean;
  poemLoading: boolean;
  error: string | null;
};

const App: React.FC = () => {
  const [city, setCity] = useState("Berlin");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [state, setState] = useState<AppState>({
    weather: null,
    poem: null,
    loading: true,
    poemLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      poemLoading: false,
      error: null,
    }));

    try {
      const weatherData = coords
        ? await getWeatherDataByCoords(coords.lat, coords.lon)
        : await getWeatherData(city);
      if (!weatherData) throw new Error("City not found");

      setState({
        weather: weatherData,
        poem: null,
        loading: false,
        poemLoading: true,
        error: null,
      });

      const keyword =
        weatherData.weather_description.split(/\s+/)[1] ||
        weatherData.weather_description.split(/\s+/)[0] ||
        "weather";

      const poemData = await getPoetryData(keyword).catch(() => null);

      setState((prev) => ({
        ...prev,
        poem: poemData,
        poemLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        poemLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  }, [city, coords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { weather, poem, loading, poemLoading, error } = state;

  let content;
  if (loading && !weather) {
    content = (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  } else if (error && !weather) {
    content = (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm">
          <p className="mb-4 text-lg font-semibold text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="mx-auto w-full max-w-350 px-4 py-8 lg:px-6 xl:px-8">
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-start">
          <div className="w-full max-w-lg lg:max-w-xl">
            <WeatherCard
              setCity={(c) => {
                setCoords(null);
                setCity(c);
              }}
              setCoords={setCoords}
              units={units}
              setUnits={setUnits}
              weather={weather}
              error={error}
            />
          </div>
          <div className="flex w-full max-w-md flex-col gap-4 lg:max-w-lg">
            <ForecastHourly weather={weather} units={units} />
            <ForecastDaily weather={weather} units={units} />
            {(poem || poemLoading) && <WeatherPoem poemData={poem} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full`}>
      <div className={`fixed inset-0 z-0 ${formatBackground(weather)}`} />
      <div className="pointer-events-none fixed inset-0 animation-zoomInOut" />
      {loading && weather && (
        <div className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-white/10">
          <div className="h-full w-1/3 animate-pulse bg-blue-400" />
        </div>
      )}
      <div className="relative z-10">{content}</div>
    </div>
  );
};

export default App;
