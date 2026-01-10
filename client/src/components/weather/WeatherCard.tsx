import type { Units, WeatherData } from "../../types";
import { Panel } from "../ui/Panel";

import TopButtons from "./TopButtons";

import Inputs from "./Inputs";
import TimeAndLocation from "./TimeAndLocation";
import TemperatureAndDetails from "./TemperatureAndDetails";
import nimbusLogo from "../../nimbus.png";

type Props = {
  setCity: (city: string) => void;
  units: Units;
  setUnits: (units: Units) => void;
  weather: WeatherData | null;
};

export function WeatherCard({ setCity, units, setUnits, weather }: Props) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col items-center py-2">
        <img
          src={nimbusLogo}
          alt="logo"
          className="h-12 w-12 sm:h-14 sm:w-14"
        />

        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          NimbusCast
        </h1>
        <div className="mt-1 h-px w-36 bg-white/20" />
      </div>

      <TopButtons setCity={setCity} />
      <Inputs setCity={setCity} setUnits={setUnits} />

      {weather && (
        <div className="mt-2">
          <TimeAndLocation weather={weather} />
          <TemperatureAndDetails weather={weather} units={units} />
        </div>
      )}
    </Panel>
  );
}
