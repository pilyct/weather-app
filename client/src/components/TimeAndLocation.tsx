import { WeatherData } from "../types";

interface TimeAndLocationProps {
  weather: WeatherData;
}

const TimeAndLocation: React.FC<TimeAndLocationProps> = ({ weather }) => {
  return (
    <div>
      <div className="flex items-center justify-around my-2 md:my-6">
        <p className="text-md text-white font-extralight text-center md:text-xl">
          {weather.local_time}
        </p>
      </div>

      <div className="flex items-center justify-around md:my-3">
        <p className="text-xl font-medium text-white md:text-3xl">
          {weather.city_name}, {weather.country}
        </p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
