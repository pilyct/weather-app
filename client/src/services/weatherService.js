import { DateTime } from 'luxon';

const API_KEY = "fa874ea5150e390f26fba58cd82e6c39";
const BASE_URL = "https://api.openweathermap.org/data/2.5";


// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=fa874ea5150e390f26fba58cd82e6c39&units=metric
// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,alerts&appid=fa874ea5150e390f26fba58cd82e6c39&units=metric

const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({...searchParams, appid:API_KEY});

  return fetch(url)
  .then((res) => res.json())
};

const formatCurrentWeather = (data) => {
  const {
    coord: {lat, lon},
    main: {temp, feels_like, temp_min, temp_max, humidity},
    name,
    dt,
    sys: {country, sunrise, sunset},
    weather,
    wind: {speed}
  } = data

  const {main: details, description, icon} = weather[0]

  return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, details, description, icon, speed}
}

// const formatForecastWeather = (data) => {
//   let { timezone, daily, hourly } = data;
//   daily = daily.slice(1,6).map(d => {
//     return {
//       title: formatToLocalTime(d.dt, timezone, 'ccc'),
//       temp: d.temp.day,
//       icon: d.weather[0].icon
//     }
//   });


//   hourly = hourly.slice(1,6).map(d => {
//     return {
//       title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
//       temp: d.temp.day,
//       icon: d.weather[0].icon
//     }
//   });
  
//   return { timezone, daily, hourly }
// };


const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather)
  
  //const {lat, lon} = formattedCurrentWeather

  // const formattedForecastWeather = await getWeatherData('onecall', {
  //   lat, lon, exclude: 'current,minutely,alerts', units:searchParams.units,
  // }).then(formatForecastWeather)

  return {
    ...formattedCurrentWeather,
    //...formattedForecastWeather
  };
};


const formatToLocalTime = (secs, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode }