import "./App.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { getWeatherData, getWeatherByCoords, getPoetryData } from "./services/api-service";
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
  error: string | null;
};

const App: React.FC = () => {
  const [city, setCity] = useState("Berlin");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const skipCityFetch = useRef(true);
  const [state, setState] = useState<AppState>({
    weather: null,
    poem: null,
    loading: true,
    error: null,
  });

  const processWeatherData = useCallback(async (weatherData: any) => {
    const keyword =
      weatherData.weather_description.split(/\s+/)[1] ||
      weatherData.weather_description.split(/\s+/)[0] ||
      "weather";

    const poemData = await getPoetryData(keyword).catch(() => null);

    setState({
      weather: weatherData,
      poem: poemData,
      loading: false,
      error: null,
    });
  }, []);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const weatherData = await getWeatherData(city);
      if (!weatherData) throw new Error("City not found");
      await processWeatherData(weatherData);
    } catch (error) {
      setState({
        weather: null,
        poem: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }, [city, processWeatherData]);

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchData();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await getWeatherByCoords(latitude, longitude);
          if (!weatherData) throw new Error("Location not found");
          skipCityFetch.current = true;
          setCity(weatherData.city_name);
          await processWeatherData(weatherData);
        } catch (error) {
          setState({
            weather: null,
            poem: null,
            loading: false,
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      },
      () => {
        fetchData();
      },
      { timeout: 5000 },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipCityFetch.current) {
      skipCityFetch.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const { weather, poem, loading, error } = state;

  return (
    <div className={`min-h-screen w-full ${formatBackground(weather)}`}>
      <div className="pointer-events-none fixed inset-0 animation-zoomInOut" />

      {loading && !weather ? (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
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
      ) : (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 lg:px-6 xl:px-8">
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-start">
            <div className="w-full max-w-lg lg:max-w-xl">
              <WeatherCard
                setCity={setCity}
                units={units}
                setUnits={setUnits}
                weather={weather}
              />
            </div>
            <div className="flex w-full max-w-md flex-col gap-4 lg:max-w-lg">
              <ForecastHourly weather={weather} units={units} />
              <ForecastDaily weather={weather} units={units} />
              {poem && <WeatherPoem poemData={poem} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
