import { React, useState } from "react";
import { UilSearch,
  //  UilMapMarker 
  } from '@iconscout/react-unicons'

export default function Inputs({setQuery, units, setUnits}) {
  const [city, setCity] = useState("");

  const handleSearchClick = () => {
    if (city !== '') setQuery({q: city})

    // TODO: if the name of the city is not correct, do nothing or send message from the input
    // TODO: after searching for a city, remove input
    // TODO: sometimes we need to include the country code to show the correct city --> example: Rome, IT 
  }

  const handleUnitChange = (e) => {
    const selectedUnit = e.currentTarget.name;
    if (units !== selectedUnit) setUnits(selectedUnit);
    // TODO: add ºC and ºF after the number
    // TODO: check values when ºF, they are different compare to ºC
  }

  return (
    <div className="flex flex-row justify-center my-6">

      <div className="flex flex-row w-3/4 items-center justify-center space-x-0">
        <input 
        value={city}
        onChange={(e) => setCity(e.currentTarget.value)}
        type="text" 
        placeholder="Search for city..."
        className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase"
        />
        
        <div className="bg-gray-700 p-2.5" >
          <UilSearch 
          size={25} 
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
          />
        </div>
        {/* <UilMapMarker  
        size={25} 
        className="text-white cursor-pointer transition ease-out hover:scale-125"
        /> */}
      </div>
      
      <div className="flex flex-row w-1/4 items-center justify-center">
        <button 
        name="metric" 
        className="text-xl text-white font-light transition ease-out hover:scale-125"
        onClick={handleUnitChange}
        >ºC</button>

        <p className="text-xl text-white mx-1">|</p>

        <button 
        name="imperial" 
        className="text-xl text-white font-light transition ease-out hover:scale-125"
        onClick={handleUnitChange}
        >ºF</button>
      </div>

    </div>

  );
}