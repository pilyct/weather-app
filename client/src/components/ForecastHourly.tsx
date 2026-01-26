import TemperatureAreaChart from "./TemperatureAreaChart";
import { WeatherData, ChartDataHourly } from "../types";
import { iconUrlFromCode, formatTemperature } from "../utils/helperFunctions";
import {
  formatAreaFillEnhanced,
  formatAreaStrokeEnhanced,
} from "../utils/styleFunctions";

interface ForecastHourlyProps {
  weather: WeatherData | null;
  units: "metric" | "imperial";
}

const ForecastHourly: React.FC<ForecastHourlyProps> = ({ weather, units }) => {
  if (!weather || !weather.forecast_time) {
    return <div>Loading...</div>;
  }

  // First 5 hours of forecast data
  const forecastData = weather.forecast_time.slice(0, 5);

  // Transform data for area chart
  const chartData: ChartDataHourly[] = forecastData.map((data) => ({
    time: data.time,
    temp: data.temp,
  }));

  // Get gradient configurations
  const fillConfig = formatAreaFillEnhanced(chartData, units);
  const strokeConfig = formatAreaStrokeEnhanced(chartData, units);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-100/5 bg-gradient-to-br px-4 py-4 shadow-xl backdrop-blur-2xl">
      <div className="flex items-center justify-start">
        <p className="font-medium uppercase text-white">3 Hour Step Forecast</p>
      </div>
      <hr className="my-2 border-white/20" />

      {/* Chart background layer */}
      <div className="pointer-events-none absolute left-0 right-0 top-[70px] h-30 px-3 sm:top-[90px] md:top-[90px]">
        <TemperatureAreaChart
          data={chartData}
          strokeColor={strokeConfig.color}
          fillColor={fillConfig.color}
          fillGradient={
            fillConfig.useGradient && fillConfig.stops
              ? {
                  id: fillConfig.gradientId!,
                  stops: fillConfig.stops,
                }
              : undefined
          }
          strokeGradient={
            strokeConfig.useGradient && strokeConfig.stops
              ? {
                  id: strokeConfig.gradientId!,
                  stops: strokeConfig.stops,
                }
              : undefined
          }
        />
      </div>

      {/* Forecast items */}
      <div className="relative z-10 mt-2 flex items-center justify-between text-white">
        {forecastData.map((data, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-1"
          >
            <p className="text-xs font-light sm:text-sm">{data.time}</p>
            <img
              src={iconUrlFromCode(data.icon)}
              alt={`${data.time} forecast`}
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
            <p className="text-sm font-medium sm:text-base">
              {formatTemperature(data.temp, units)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastHourly;
