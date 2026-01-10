import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function MiniTempSpark({
  points,
  fill,
  stroke,
}: {
  points: { temp: number }[];
  fill: string;
  stroke: string;
}) {
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points}>
          <Area type="monotone" dataKey="temp" stroke={stroke} fill={fill} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
