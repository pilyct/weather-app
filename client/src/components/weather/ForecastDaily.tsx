// import { useEffect, useState } from "react";
// import { WeatherData, ForecastDay, ChartDataDaily } from "../../types";
// import { iconUrlFromCode, formatTemperature } from "../../utils/helperFunctions";
// import { formatAreaFill, formatAreaStroke } from "../../utils/styleFunctions";
// import TemperatureAreaChart from "./TemperatureAreaChart";

// interface ForecastDailyProps {
//   weather: WeatherData | null;
//   units: "metric" | "imperial";
// }

// const ForecastDaily: React.FC<ForecastDailyProps> = ({ weather, units }) => {
//   const [chartData, setChartData] = useState<ChartDataDaily[]>([]);

//   useEffect(() => {
//     if (weather && weather.forecast_day) {
//       setChartData(transformForecastData(weather.forecast_day));
//     }
//   }, [weather]);

//   const transformForecastData = (forecast: ForecastDay): ChartDataDaily[] => {
//     return Object.keys(forecast).map((day) => ({
//       day,
//       temp: forecast[day].temp,
//       icon: forecast[day].icon,
//     }));
//   };

//   if (!weather || !weather.forecast_day || chartData.length === 0) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border-2 border-slate-100 border-opacity-5 rounded-2xl mx-2 my-2 py-4 px-4 bg-gradient-to-br shadow-[0_3px_10px_rgb(0,0,0,0.5)] backdrop-blur-2xl w-full sm:max-w-lg">
//       <div className="flex items-center justify-start w-full">
//         <p className="font-medium text-white uppercase">5 day step forecast</p>
//       </div>
//       <hr className="my-1" />
//       <div className="absolute inset-0 z-0 w-full px-[11px] py-2 top-[60px]">
//         <TemperatureAreaChart
//           data={chartData}
//           strokeColor={formatAreaStroke(chartData, units)}
//           fillColor={formatAreaFill(chartData, units)}
//         />
//       </div>
//       <div className="relative z-10 flex flex-wrap items-center justify-between w-full text-white">
//         {chartData.map((data, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center justify-center w-1/2 sm:w-auto"
//           >
//             <p className="text-sm font-light">{data.day}</p>
//             <img
//               src={iconUrlFromCode(data.icon)}
//               alt="forecast icon"
//               className="w-12"
//             />
//             <p>{formatTemperature(data.temp, units)}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ForecastDaily;

import { useEffect, useState } from "react";
import type {
  WeatherData,
  Units,
  ForecastDay,
  ChartDataDaily,
} from "../../types";
import {
  iconUrlFromCode,
  formatTemperature,
} from "../../utils/helperFunctions";
import { formatAreaFill, formatAreaStroke } from "../../utils/styleFunctions";
import { Panel } from "../ui/Panel";
import { TemperatureAreaChart } from "../charts/TemperatureAreaChart";
import { MiniTempSpark } from "../charts/MiniTempSpark";

export function ForecastDaily({
  weather,
  units,
}: {
  weather: WeatherData | null;
  units: Units;
}) {
  const [chartData, setChartData] = useState<ChartDataDaily[]>([]);

  useEffect(() => {
    if (weather?.forecast_day) {
      setChartData(transformForecastData(weather.forecast_day));
    }
  }, [weather]);

  const transformForecastData = (forecast: ForecastDay): ChartDataDaily[] => {
    return Object.keys(forecast).map((day) => ({
      day,
      temp: forecast[day].temp,
      icon: forecast[day].icon,
    }));
  };

  if (!weather?.forecast_day || chartData.length === 0)
    return <div>Loading...</div>;

  const stroke = formatAreaStroke(chartData, units);
  const fill = formatAreaFill(chartData, units);

  return (
    <Panel title="5 day step forecast" className="overflow-hidden">
      <hr className="mb-3 border-white/10" />

      {/* Mobile: chart on top */}
      <div className="sm:hidden">
        <TemperatureAreaChart
          data={chartData}
          strokeColor={stroke}
          fillColor={fill}
          height={84}
        />
      </div>

      {/* Desktop/tablet: chart overlay stays in same position */}
      <div className="relative hidden sm:block">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 px-2 pt-1">
          <TemperatureAreaChart
            data={chartData}
            strokeColor={stroke}
            fillColor={fill}
            height={84}
          />
        </div>
      </div>

      <div className="relative z-10 mt-3 flex flex-wrap justify-between gap-y-3 text-white">
        {chartData.map((d, idx) => {
          const a = chartData[idx];
          const b = chartData[idx + 1] ?? chartData[idx - 1] ?? chartData[idx];
          const miniPoints = [{ temp: a.temp }, { temp: b.temp }];

          return (
            <div key={idx} className="w-1/2 px-1 sm:w-auto sm:px-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-full sm:hidden">
                  <MiniTempSpark
                    points={miniPoints}
                    fill={fill}
                    stroke={stroke}
                  />
                </div>
                <p className="text-xs font-light text-white/90 sm:text-sm">
                  {d.day}
                </p>
                <img
                  src={iconUrlFromCode(d.icon)}
                  alt="forecast icon"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
                <p className="text-sm font-medium sm:text-base">
                  {formatTemperature(d.temp, units)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
