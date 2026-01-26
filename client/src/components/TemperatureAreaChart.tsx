import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChartDataHourly, ChartDataDaily } from "../types";

interface GradientStop {
  offset: string;
  color: string;
}

interface TemperatureAreaChartProps {
  data: ChartDataHourly[] | ChartDataDaily[];
  fillColor: string;
  strokeColor: string;
  // NEW: Optional gradient support
  fillGradient?: {
    id: string;
    stops: GradientStop[];
  };
  strokeGradient?: {
    id: string;
    stops: GradientStop[];
  };
}

const TemperatureAreaChart: React.FC<TemperatureAreaChartProps> = ({
  data,
  fillColor,
  strokeColor,
  fillGradient,
  strokeGradient,
}) => {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data}>
        {/* Define gradients in SVG defs if provided */}
        {(fillGradient || strokeGradient) && (
          <defs>
            {fillGradient && (
              <linearGradient id={fillGradient.id} x1="0" y1="0" x2="1" y2="0">
                {fillGradient.stops.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            )}
            {strokeGradient && (
              <linearGradient
                id={strokeGradient.id}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                {strokeGradient.stops.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            )}
          </defs>
        )}
        <Area
          type="monotone"
          dataKey="temp"
          stroke={strokeColor}
          fill={fillColor}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TemperatureAreaChart;
