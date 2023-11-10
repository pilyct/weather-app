import React from "react";

export default function TopButtons({setQuery}) {

  const cities = [
    {
      id:1,
      title: 'London'
    },
    {
      id:2,
      title: 'Sydney'
    },
    {
      id:3,
      title: 'Tokyo'
    },
    {
      id:4,
      title: 'Toronto'
    },
    {
      id:5,
      title: 'Paris'
    },
  ]

  // TODO: add text-decoration underline when hover and selecting city


  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        <button key={city.id} className="text-white text-lg font-medium" onClick={() => setQuery({q: city.title})}>{city.title}</button>
      ))}
    </div>

  );
}