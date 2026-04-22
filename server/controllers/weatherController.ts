import { Request, Response } from "express";
import { DateTime } from "luxon";
import openWeatherMap from "../models/weatherData";

interface GeoData {
  lat: number;
  lon: number;
}

interface WeatherData {
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  weather: {
    icon: string;
    main: string;
    description: string;
  }[];
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  rain?: {
    "1h": number;
  };
  timezone: number;
}

interface ForecastData {
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
  }[];
}

async function getWeatherData(req: Request, res: Response): Promise<void> {
  try {
    const city = (req.query.city as string) || "Berlin";
    const country = (req.query.country as string) || "";

    const geoData = await fetchGeoData(city, country);
    if (!geoData) {
      res.status(404).json({ error: "City not found" });
      return;
    }

    const { lat, lon } = geoData;

    const weatherData = await fetchWeatherData(lat, lon);
    const forecastData = await fetchForecastData(lat, lon);

    const formattedSunrise = formatTime(
      weatherData.sys.sunrise,
      weatherData.timezone,
    );
    const formattedSunset = formatTime(
      weatherData.sys.sunset,
      weatherData.timezone,
    );
    const localTime = formatLocalTime(weatherData.timezone);

    const responseData = {
      ...filterWeatherData(
        city,
        weatherData,
        formattedSunrise,
        formattedSunset,
        localTime,
      ),
      ...filterForecastData(forecastData, weatherData.timezone),
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch weather data, please try again" });
  }
}

async function fetchGeoData(
  city: string,
  country: string,
): Promise<GeoData | null> {
  const geoUrl = new URL(`${openWeatherMap.GEO_URL}`);
  geoUrl.search = new URLSearchParams({
    q: `${city},${country}`,
    limit: "1",
    appid: openWeatherMap.API_KEY || "",
  }).toString();

  const geoResponse = await fetch(geoUrl.toString());
  const geoData = await geoResponse.json();
  return geoData.length ? geoData[0] : null;
}

async function fetchWeatherData(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const weatherUrl = new URL(`${openWeatherMap.BASE_URL}/weather`);
  weatherUrl.search = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    appid: openWeatherMap.API_KEY || "",
    units: "metric",
  }).toString();

  const weatherResponse = await fetch(weatherUrl.toString());
  return await weatherResponse.json();
}

async function fetchForecastData(
  lat: number,
  lon: number,
): Promise<ForecastData> {
  const forecastUrl = new URL(`${openWeatherMap.BASE_URL}/forecast`);
  forecastUrl.search = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    appid: openWeatherMap.API_KEY || "",
    units: "metric",
  }).toString();

  const forecastResponse = await fetch(forecastUrl.toString());
  return await forecastResponse.json();
}

function formatTime(timestamp: number, timezoneOffset: number): string {
  return DateTime.fromMillis(timestamp * 1000)
    .plus({ seconds: timezoneOffset })
    .toFormat("hh:mm a");
}

function formatLocalTime(timezoneOffset: number): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utcTime + timezoneOffset * 1000).toLocaleString(
    "en-US",
    options,
  );
}

function filterWeatherData(
  city: string,
  weatherData: WeatherData,
  sunrise: string,
  sunset: string,
  localTime: string,
) {
  return {
    city_name: city,
    country: weatherData.sys.country,
    coordinates: weatherData.coord,
    icon: weatherData.weather[0].icon,
    weather_main: weatherData.weather[0].main,
    weather_description: weatherData.weather[0].description,
    temperature: weatherData.main.temp,
    temp_max: weatherData.main.temp_max,
    temp_min: weatherData.main.temp_min,
    feels_like: weatherData.main.feels_like,
    humidity: weatherData.main.humidity,
    wind_speed: weatherData.wind.speed,
    rain_1h: weatherData.rain ? weatherData.rain["1h"] : 0,
    sunrise,
    sunset,
    local_time: localTime,
  };
}

function filterForecastData(
  forecastData: ForecastData,
  timezoneOffset: number,
) {
  const filteredForecastData = forecastData.list.map((forecast) => {
    const forecastDateTime = DateTime.fromSeconds(forecast.dt).plus({
      seconds: timezoneOffset,
    });
    return {
      dt: forecast.dt,
      dt_txt: forecast.dt_txt,
      temp: forecast.main.temp,
      weather_main: forecast.weather[0].main,
      description: forecast.weather[0].description,
      wind_speed: forecast.wind.speed,
      time: forecastDateTime.toFormat("h:mm a"),
      date: forecastDateTime.toFormat("yyyy-MM-dd"),
      week_day: forecastDateTime.toFormat("ccc"),
      icon: forecast.weather[0].icon,
    };
  });

  const forecastHourly: any[] = [];
  const forecastDaily: { [key: string]: any } = {};

  filteredForecastData.forEach((forecast) => {
    forecastHourly.push({
      time: forecast.time,
      date: forecast.date,
      temp: forecast.temp,
      weather_main: forecast.weather_main,
      description: forecast.description,
      wind_speed: forecast.wind_speed,
      icon: forecast.icon,
    });

    if (forecast.date !== DateTime.local().toFormat("yyyy-MM-dd")) {
      forecastDaily[forecast.week_day] = {
        date: forecast.date,
        time: forecast.time,
        temp: forecast.temp,
        icon: forecast.icon,
      };
    }
  });

  return {
    forecast_time: forecastHourly,
    forecast_day: forecastDaily,
  };
}

async function getWeatherByCoords(req: Request, res: Response): Promise<void> {
  try {
    const lat = Number.parseFloat(req.query.lat as string);
    const lon = Number.parseFloat(req.query.lon as string);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      res.status(400).json({ error: "Invalid coordinates" });
      return;
    }

    const cityName = await fetchCityNameFromCoords(lat, lon);
    const weatherData = await fetchWeatherData(lat, lon);
    const forecastData = await fetchForecastData(lat, lon);

    const formattedSunrise = formatTime(
      weatherData.sys.sunrise,
      weatherData.timezone,
    );
    const formattedSunset = formatTime(
      weatherData.sys.sunset,
      weatherData.timezone,
    );
    const localTime = formatLocalTime(weatherData.timezone);

    const responseData = {
      ...filterWeatherData(
        cityName,
        weatherData,
        formattedSunrise,
        formattedSunset,
        localTime,
      ),
      ...filterForecastData(forecastData, weatherData.timezone),
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch weather data, please try again" });
  }
}

async function fetchCityNameFromCoords(
  lat: number,
  lon: number,
): Promise<string> {
  const reverseUrl = new URL(openWeatherMap.GEO_REVERSE_URL);
  reverseUrl.search = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    limit: "1",
    appid: openWeatherMap.API_KEY || "",
  }).toString();

  const response = await fetch(reverseUrl.toString());
  const data = await response.json();
  return data.length ? data[0].name : "Unknown";
}

// ----------------
async function getCitySuggestions(req: Request, res: Response): Promise<void> {
  try {
    const query = (req.query.query as string) || "";

    if (!query || query.length < 2) {
      res.json([]);
      return;
    }

    const geoUrl = new URL(`${openWeatherMap.GEO_URL}`);
    geoUrl.search = new URLSearchParams({
      q: query,
      limit: "5", // get up to 5 suggestions
      appid: openWeatherMap.API_KEY || "",
    }).toString();

    const geoResponse = await fetch(geoUrl.toString());
    const geoData = await geoResponse.json();

    // format the response to include city, state, country
    const suggestions = geoData.map((location: any) => ({
      name: location.name,
      state: location.state || "",
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      // create a display label for the dropdown
      label: location.state
        ? `${location.name}, ${location.state}, ${location.country}`
        : `${location.name}, ${location.country}`,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch city suggestions" });
  }
}

export { getWeatherData, getWeatherByCoords, getCitySuggestions };
