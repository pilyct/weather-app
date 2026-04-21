import { FaArrowUp, FaArrowDown, FaWind } from "react-icons/fa";
import { FaTemperatureThreeQuarters } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiSunrise, FiSunset } from "react-icons/fi";

import {
  iconUrlFromCode,
  convertCelsiusToFahrenheit,
  formatTemperature,
} from "../utils/helperFunctions";
import { WeatherData } from "../types";

interface TemperatureAndDetailsProps {
  weather: WeatherData;
  units: "metric" | "imperial";
}

const TemperatureAndDetails: React.FC<TemperatureAndDetailsProps> = ({
  weather,
  units,
}) => {
  const formatWeatherDescription = () => {
    if (!weather) return "text-slate-100";

    const threshold = units === "metric" ? 19 : 66;
    const currentTemp =
      units === "metric"
        ? weather.temperature
        : convertCelsiusToFahrenheit(weather.temperature);

    if (currentTemp <= threshold) return "text-cyan-300";

    return "text-orange-200";
  };

  return (
    <>
      <div
        className={`flex items-center justify-center py-6 text-lg ${formatWeatherDescription()} mt-2 md:text-xl`}
      >
        <p>
          {" "}
          {weather.weather_main} - {weather.weather_description}{" "}
        </p>
      </div>

      <div className="flex flex-row items-center justify-between space-x-2 py-2 text-white md:px-5">
        <img
          src={iconUrlFromCode(weather.icon)}
          alt="weather icon"
          className="w-18 sm:w-32  md:w-40"
        />

        <p className="text-2xl sm:text-3xl md:text-5xl">
          {formatTemperature(weather.temperature, units)}
        </p>

        <div className="flex flex-col text-xs font-light sm:space-y-2 md:space-y-2 sm:text-sm md:text-sm">
          <div className="flex items-center justify-start space-x-2">
            <FaTemperatureThreeQuarters size={18} className="mr-1" />
            Real feel:
            <span className="font-medium">
              {formatTemperature(weather.feels_like, units)}
            </span>
          </div>

          <div className="flex items-center justify-start space-x-2">
            <MdOutlineWaterDrop size={18} className="mr-1 ml-0.5" />
            Humidity:
            <span className="ml-1 font-medium">
              {weather.humidity.toFixed()}%
            </span>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <FaWind size={18} className="mx-1" />
            Wind:
            <span className="ml-1 font-medium">
              {weather.wind_speed.toFixed()} km/h
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-white/90 sm:text-sm">
        <Meta icon={<FiSunrise />} label="Rise" value={weather.sunrise} />
        <Divider />
        <Meta icon={<FiSunset />} label="Set" value={weather.sunset} />
        <Divider />
        <Meta
          icon={<FaArrowUp />}
          label="High"
          value={formatTemperature(weather.temp_max, units)}
        />
        <Divider />
        <Meta
          icon={<FaArrowDown />}
          label="Low"
          value={formatTemperature(weather.temp_min, units)}
        />
      </div>
    </>
  );
};

export default TemperatureAndDetails;

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-white/80">{icon}</span>
      <span className="text-white/70">{label}:</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function Divider() {
  return <span className="hidden text-white/40 sm:inline">|</span>;
}
