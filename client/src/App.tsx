import "./App.css";
import { useState, useEffect, useCallback } from "react";
import {
  getWeatherData,
  getWeatherDataByCoords,
  getPoetryData,
  getSavedLocations,
  saveLocation,
  deleteSavedLocation,
} from "./services/api-service";
import { formatBackground } from "./utils/styleFunctions";
import WeatherCard from "./components/WeatherCard";
import SavedLocations from "./components/SavedLocations";
import ForecastDaily from "./components/ForecastDaily";
import ForecastHourly from "./components/ForecastHourly";
import WeatherPoem from "./components/WeatherPoem";
import Spinner from "./components/Spinner";
import { WeatherData, PoemData, SavedLocation } from "./types";

type AppState = {
  weather: WeatherData | null;
  poem: PoemData | null;
  loading: boolean;
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
    error: null,
  });
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const weatherData = coords
        ? await getWeatherDataByCoords(coords.lat, coords.lon)
        : await getWeatherData(city);
      if (!weatherData) throw new Error("City not found");

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
    } catch (error) {
      setState({
        weather: null,
        poem: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }, [city, coords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    getSavedLocations()
      .then(setSavedLocations)
      .catch(() => {});
  }, []);

  const handleSaveLocation = useCallback(async () => {
    const { weather } = state;
    if (!weather) return;
    try {
      const saved = await saveLocation({
        city_name: weather.city_name,
        country: weather.country,
        lat: weather.coordinates.lat,
        lon: weather.coordinates.lon,
        temperature: weather.temperature,
        temp_max: weather.temp_max,
        temp_min: weather.temp_min,
        icon: weather.icon,
      });
      setSavedLocations((prev) => [...prev, saved]);
    } catch {
      // already saved or error — silently ignore
    }
  }, [state]);

  const handleDeleteLocation = useCallback(async (id: string) => {
    try {
      await deleteSavedLocation(id);
      setSavedLocations((prev) => prev.filter((l) => l.id !== id));
    } catch {
      // silently ignore
    }
  }, []);

  const handleSelectLocation = useCallback((loc: SavedLocation) => {
    setCoords({ lat: loc.lat, lon: loc.lon });
  }, []);

  const { weather, poem, loading, error } = state;

  const isSaved =
    !!weather &&
    savedLocations.some(
      (l) =>
        l.lat === weather.coordinates.lat && l.lon === weather.coordinates.lon,
    );

  let content;
  if (loading && !weather) {
    content = (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  } else if (error) {
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
          <div className="flex w-full max-w-lg flex-col gap-4 lg:max-w-xl">
            <WeatherCard
              setCity={(c) => {
                setCoords(null);
                setCity(c);
              }}
              setCoords={setCoords}
              units={units}
              setUnits={setUnits}
              weather={weather}
              isSaved={isSaved}
              onSaveLocation={handleSaveLocation}
            />
            {weather && (
              <SavedLocations
                savedLocations={savedLocations}
                units={units}
                onDelete={handleDeleteLocation}
                onSelect={handleSelectLocation}
              />
            )}
          </div>
          <div className="flex w-full max-w-md flex-col gap-4 lg:max-w-lg">
            <ForecastHourly weather={weather} units={units} />
            <ForecastDaily weather={weather} units={units} />
            {poem && <WeatherPoem poemData={poem} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full`}>
      <div className={`fixed inset-0 z-0 ${formatBackground(weather)}`} />
      <div className="pointer-events-none fixed inset-0 animation-zoomInOut" />
      <div className="relative z-10">{content}</div>
    </div>
  );
};

export default App;
