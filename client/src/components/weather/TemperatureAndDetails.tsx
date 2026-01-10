// import { FaArrowUp, FaArrowDown, FaWind } from "react-icons/fa";
// import { FaTemperatureThreeQuarters } from "react-icons/fa6";
// import { MdOutlineWaterDrop } from "react-icons/md";
// import { FiSunrise, FiSunset } from "react-icons/fi";

// import {
//   iconUrlFromCode,
//   convertCelsiusToFahrenheit,
//   formatTemperature,
// } from "../../utils/helperFunctions";
// import { WeatherData } from "../../types";

// interface TemperatureAndDetailsProps {
//   weather: WeatherData;
//   units: "metric" | "imperial";
// }

// const TemperatureAndDetails: React.FC<TemperatureAndDetailsProps> = ({
//   weather,
//   units,
// }) => {
//   const formatWeatherDescription = () => {
//     if (!weather) return "text-slate-100";

//     const threshold = units === "metric" ? 19 : 66;
//     const currentTemp =
//       units === "metric"
//         ? weather.temperature
//         : convertCelsiusToFahrenheit(weather.temperature);

//     if (currentTemp <= threshold) return "text-cyan-300";

//     return "text-orange-200";
//   };

//   return (
//     <div>
//       <div
//         className={`flex items-center justify-center py-6 text-xl ${formatWeatherDescription()} mt-2`}
//       >
//         <p>
//           {" "}
//           {weather.weather_main} - {weather.weather_description}{" "}
//         </p>
//       </div>

//       <div className="flex items-center justify-between px-5 py-2 text-white">
//         <img
//           src={iconUrlFromCode(weather.icon)}
//           alt="weather icon"
//           className="w-40"
//         />

//         <p className="text-5xl">
//           {formatTemperature(weather.temperature, units)}
//         </p>

//         <div className="flex flex-col space-y-2">
//           <div className="flex items-center justify-start space-x-2 text-sm font-light">
//             <FaTemperatureThreeQuarters size={18} className="mr-1" />
//             Real feel:
//             <span className="font-medium">
//               {formatTemperature(weather.feels_like, units)}
//             </span>
//           </div>

//           <div className="flex items-center justify-start space-x-2 text-sm font-light">
//             <MdOutlineWaterDrop size={18} className="mr-1 ml-0.5" />
//             Humidity:
//             <span className="ml-1 font-medium">
//               {weather.humidity.toFixed()}%
//             </span>
//           </div>

//           <div className="flex items-center justify-between space-x-2 text-sm font-light">
//             <FaWind size={18} className="mx-1" />
//             Wind:
//             <span className="ml-1 font-medium">
//               {weather.wind_speed.toFixed()} km/h
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-row items-center justify-center py-3 text-sm text-white space-x-[6px] mt-2">
//         <FiSunrise />
//         <p className="font-light">
//           Rise: {""}{" "}
//           <span className="ml-1 font-medium"> {weather.sunrise}</span>
//         </p>
//         <p className="font-light">|</p>

//         <FiSunset />
//         <p className="font-light">
//           Set: {""} <span className="ml-1 font-medium">{weather.sunset}</span>
//         </p>
//         <p className="font-light">|</p>

//         <FaArrowUp />
//         <p className="font-light">
//           High:{" "}
//           <span className="ml-1 font-medium">
//             {formatTemperature(weather.temp_max, units)}
//           </span>
//         </p>
//         <p className="font-light">|</p>

//         <FaArrowDown />
//         <p className="font-light">
//           Low:{" "}
//           <span className="ml-1 font-medium">
//             {formatTemperature(weather.temp_min, units)}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TemperatureAndDetails;

import React from "react";
import { FaArrowDown, FaArrowUp, FaWind } from "react-icons/fa";
import { FaTemperatureThreeQuarters } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiSunrise, FiSunset } from "react-icons/fi";

import {
  iconUrlFromCode,
  convertCelsiusToFahrenheit,
  formatTemperature,
} from "../../utils/helperFunctions";
import type { Units, WeatherData } from "../../types";

export default function TemperatureAndDetails({
  weather,
  units,
}: {
  weather: WeatherData;
  units: Units;
}) {
  const descriptionColor = () => {
    const threshold = units === "metric" ? 19 : 66;
    const currentTemp =
      units === "metric"
        ? weather.temperature
        : convertCelsiusToFahrenheit(weather.temperature);
    return currentTemp <= threshold ? "text-cyan-300" : "text-orange-200";
  };

  return (
    <div className="mt-3">
      <div className={`text-center ${descriptionColor()} px-2`}>
        <p className="text-sm font-medium sm:text-base">
          {weather.weather_main} — {weather.weather_description}
        </p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <img
          src={iconUrlFromCode(weather.icon)}
          alt="weather icon"
          className="h-20 w-20 sm:h-24 sm:w-24"
        />

        <p className="text-4xl font-semibold text-white sm:text-5xl">
          {formatTemperature(weather.temperature, units)}
        </p>

        <div className="w-full max-w-xs space-y-2 text-white sm:w-auto">
          <Row
            icon={<FaTemperatureThreeQuarters size={16} />}
            label="Real feel"
            value={formatTemperature(weather.feels_like, units)}
          />
          <Row
            icon={<MdOutlineWaterDrop size={16} />}
            label="Humidity"
            value={`${weather.humidity.toFixed()}%`}
          />
          <Row
            icon={<FaWind size={16} />}
            label="Wind"
            value={`${weather.wind_speed.toFixed()} km/h`}
          />
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
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="text-white/80">{icon}</span>
      <span className="text-white/70">{label}:</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

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
