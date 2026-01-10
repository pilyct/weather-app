// import { AreaChart, Area, ResponsiveContainer } from 'recharts';
// import { ChartDataHourly, ChartDataDaily } from '../Types';

// interface TemperatureAreaChartProps {
//   data: ChartDataHourly[] | ChartDataDaily[],
//   fillColor: string,
//   strokeColor: string
// }

// const TemperatureAreaChart: React.FC<TemperatureAreaChartProps> = ({ data, fillColor, strokeColor }) => {
//   return (
//     <ResponsiveContainer width="100%" height={80}>
//       <AreaChart data={data}>
//         <Area type="monotone" dataKey="temp" stroke={strokeColor} fill={fillColor} />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default TemperatureAreaChart;
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export type TempPoint = { temp: number; time?: string; day?: string };

export function TemperatureAreaChart({
  data,
  fillColor,
  strokeColor,
  height = 80,
}: {
  data: TempPoint[];
  fillColor: string;
  strokeColor: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey="temp"
          stroke={strokeColor}
          fill={fillColor}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
