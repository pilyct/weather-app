const iconUrlFromCode = (code: string): string =>
  `https://openweathermap.org/img/wn/${code}@2x.png`;

const convertCelsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

const formatTemperature = (
  temp: number,
  units: "metric" | "imperial",
): string => {
  return units === "metric"
    ? temp.toFixed() + " °C"
    : convertCelsiusToFahrenheit(temp).toFixed() + " °F";
};

export { iconUrlFromCode, convertCelsiusToFahrenheit, formatTemperature };
