// import { WeatherData } from "../types";

// interface TimeAndLocationProps {
//   weather: WeatherData;
// }

// const TimeAndLocation: React.FC<TimeAndLocationProps> = ({ weather }) => {
//   return (
//     <div>
//       <div className="flex items-center justify-around my-6">
//         <p className="text-xl text-white font-extralight">
//           {weather.local_time}
//         </p>
//       </div>

//       <div className="flex items-center justify-around my-3">
//         <p className="text-3xl font-medium text-white">
//           {weather.city_name}, {weather.country}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TimeAndLocation;

import type { WeatherData } from "../../types";

export default function TimeAndLocation({ weather }: { weather: WeatherData }) {
  return (
    <div className="mt-3">
      <p className="text-center text-sm font-light text-white/90 sm:text-base">
        {weather.local_time}
      </p>

      <p className="mt-2 text-center text-2xl font-semibold text-white sm:text-3xl">
        {weather.city_name}, {weather.country}
      </p>
    </div>
  );
}
