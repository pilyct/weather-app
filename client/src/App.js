import './App.css';
import { useState, useEffect } from 'react';

import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import WeatherPoem from './components/WeatherPoem';

function App() {
  const [city, setCity] = useState('Berlin');
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState(null);
  const [poemData, setPoemData] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherResponse = await fetch(`http://localhost:3000/weather?city=${encodeURIComponent(city)}`);
        if (!weatherResponse.ok) {
          throw new Error(`Error: ${weatherResponse.statusText}`);
        }
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
  
        const keyword = weatherData.weather[0].description; 
        const [, secondWord] = keyword.split(' ');

        const poetryResponse = await fetch(`https://poetrydb.org/lines,random/[${secondWord}];5`);
        if (!poetryResponse.ok) {
          throw new Error(`Error: ${poetryResponse.statusText}`);
        }
        const poetryData = await poetryResponse.json();
  
        if (poetryData && poetryData.length > 0) {
          let maxOccurrences = 0;
          let selectedPoem = null;
  
          poetryData.forEach((poem) => {
            const occurrences = (poem.lines.join(' ').match(new RegExp(secondWord, 'gi')) || []).length;
  
            if (occurrences > maxOccurrences) {
              maxOccurrences = occurrences;
              selectedPoem = poem;
            }
          });
  
          if (selectedPoem) {
            setPoemData({
              title: selectedPoem.title,
              author: selectedPoem.author,
              lines: selectedPoem.lines,
            });
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();

  }, [city, units]);



  const formatBackground = () => {
    if (!weather) return 'from-sky-200 via-sky-600 to-sky-900';
    const threshold = units === 'metric' ? 19 : 60
    if (weather.main.temp <= threshold) return 'from-slate-300 via-cyan-700 to-blue-900';

    return 'from-amber-200 via-orange-700 to-rose-900';
  }

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-28 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <div className='flex flex-row items-center justify-center py-3'>
        <img src={require('./nimbus.png')} alt='logo' className='w-14 text-white'/>
        <h1 className=' text-white text-3xl font-medium text-decoration-line: underline underline-offset-8 '>NimbusCast</h1>
      </div>
      <TopButtons setCity={setCity} />
      <Inputs setCity={setCity} units={units} setUnits={setUnits}/>

      { weather && poemData && (
        <div>
          <TimeAndLocation weather ={weather} />
          <TemperatureAndDetails weather={weather} units={units} />
          <WeatherPoem {...poemData} keyword={(weather.weather[0].description.split(' ')[1] || 'weather')}/> 
        </div>
      )}
  
    </div>
  );
}

export default App;