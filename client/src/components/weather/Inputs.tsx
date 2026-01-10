// import React, { useState } from 'react';
// import { BiSearch } from 'react-icons/bi';

// interface InputsProps {
//   setCity: (city: string) => void;
//   setUnits: (units: 'metric' | 'imperial') => void;
// }

// const Inputs: React.FC<InputsProps> = ({ setCity, setUnits }) => {
//   const [cityName, setCityName] = useState<string>('');

//   const handleSearchClick = () => {
//     if (cityName !== '') {
//       setCity(cityName);
//       setCityName('');
//     }
//   };

//   return (
//     <div className='flex flex-row justify-center px-4 my-6 ml-6'>
//       <div className='flex flex-row items-center justify-center w-3/5'>
//         <input
//           value={cityName}
//           onChange={(e) => setCityName(e.currentTarget.value)}
//           type='text'
//           placeholder='Search by city...'
//           className='w-full p-2.5 font-light capitalize shadow-xl text-md focus:outline-none placeholder:lowercase'
//         />

//         <div className='bg-gray-700 p-2.5'>
//           <BiSearch
//             size={25}
//             className='text-white transition ease-out cursor-pointer hover:scale-125'
//             onClick={handleSearchClick}
//           />
//         </div>
//       </div>

//       <div className='flex flex-row items-center justify-center w-1/5'>
//         <button
//           className='text-xl text-white transition ease-out cursor-pointer hover:scale-125'
//           onClick={() => setUnits('metric')}
//         >
//           ºC
//         </button>

//         <p className='mx-1 text-white'> | </p>

//         <button
//           className='text-xl text-white transition ease-out cursor-pointer hover:scale-125'
//           onClick={() => setUnits('imperial')}
//         >
//           ºF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Inputs;

import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import type { Units } from "../../types";

export default function Inputs({
  setCity,
  setUnits,
}: {
  setCity: (city: string) => void;
  setUnits: (units: Units) => void;
}) {
  const [cityName, setCityName] = useState("");

  const handleSearchClick = () => {
    const trimmed = cityName.trim();
    if (trimmed) {
      setCity(trimmed);
      setCityName("");
    }
  };

  return (
    <div className="my-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center overflow-hidden rounded-xl border border-white/10 bg-white/10">
        <input
          value={cityName}
          onChange={(e) => setCityName(e.currentTarget.value)}
          type="text"
          placeholder="Search by city..."
          className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none sm:text-base"
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex items-center justify-center px-3 py-2 text-white/90 hover:bg-white/10"
          aria-label="Search"
        >
          <BiSearch size={22} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-white">
        <button
          className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
          onClick={() => setUnits("metric")}
        >
          °C
        </button>
        <span className="text-white/60">|</span>
        <button
          className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
          onClick={() => setUnits("imperial")}
        >
          °F
        </button>
      </div>
    </div>
  );
}
