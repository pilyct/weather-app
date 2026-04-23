import React from "react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import TopButtons from "./TopButtons";
import Inputs from "./Inputs";
import TimeAndLocation from "./TimeAndLocation";
import TemperatureAndDetails from "./TemperatureAndDetails";
import { WeatherData } from "../types";

interface WeatherProps {
  setCity: (city: string) => void;
  setCoords: (coords: { lat: number; lon: number }) => void;
  units: "metric" | "imperial";
  setUnits: (units: "metric" | "imperial") => void;
  weather: WeatherData | null;
  isSaved: boolean;
  onSaveLocation: () => void;
}

const WeatherCard: React.FC<WeatherProps> = ({
  setCity,
  setCoords,
  units,
  setUnits,
  weather,
  isSaved,
  onSaveLocation,
}) => {
  return (
    <div className="w-full rounded-2xl border-2 border-slate-100/5 bg-gradient-to-br px-6 pt-5 pb-6 shadow-xl backdrop-blur-2xl">
      <div className="flex flex-col items-center justify-center py-4">
        <img
          src="/nimbus.png"
          alt="logo"
          className="h-20 w-20 object-contain sm:h-24 sm:w-24"
        />
        <h1 className="mt-3 text-4xl font-medium text-white underline decoration-white/60 underline-offset-8 sm:text-5xl">
          NimbusCast
        </h1>
      </div>

      <div className="space-y-4">
        <TopButtons setCity={setCity} />
        <Inputs setCity={setCity} setCoords={setCoords} setUnits={setUnits} />

        {weather && (
          <>
            <TimeAndLocation weather={weather} />
            <TemperatureAndDetails weather={weather} units={units} />
            <button
              onClick={onSaveLocation}
              disabled={isSaved}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 disabled:cursor-default disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <MdBookmark size={18} />
                  Location saved
                </>
              ) : (
                <>
                  <MdBookmarkBorder size={18} />
                  Save this location
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
