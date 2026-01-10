// interface City {
//   id: number;
//   title: string;
//   country_code: string;
// }

// interface TopButtonsProps {
//   setCity: (city: string) => void;
// }

// const TopButtons: React.FC<TopButtonsProps> = ({ setCity }) => {
//   const cities: City[] = [
//     {
//       id: 1,
//       title: 'London',
//       country_code: 'GB'
//     },
//     {
//       id: 2,
//       title: 'Sydney',
//       country_code: 'AU'
//     },
//     {
//       id: 3,
//       title: 'Tokyo',
//       country_code: 'JP'
//     },
//     {
//       id: 4,
//       title: 'Toronto',
//       country_code: 'CA'
//     },
//     {
//       id: 5,
//       title: 'Paris',
//       country_code: 'FR'
//     },
//   ];

//   return (
//     <div className='flex items-center justify-around my-6'>
//       {cities.map((city) => (
//         <button
//           key={city.id}
//           className='text-lg font-medium text-white'
//           onClick={() => setCity(city.title)}
//         >
//           {city.title}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default TopButtons;

interface City {
  id: number;
  title: string;
  country_code: string;
}

export default function TopButtons({
  setCity,
}: {
  setCity: (city: string) => void;
}) {
  const cities: City[] = [
    { id: 1, title: "London", country_code: "GB" },
    { id: 2, title: "Sydney", country_code: "AU" },
    { id: 3, title: "Tokyo", country_code: "JP" },
    { id: 4, title: "Toronto", country_code: "CA" },
    { id: 5, title: "Paris", country_code: "FR" },
  ];

  return (
    <div className="my-4 flex flex-wrap items-center justify-center gap-2">
      {cities.map((c) => (
        <button
          key={c.id}
          className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 hover:bg-white/15"
          onClick={() => setCity(c.title)}
        >
          {c.title}
        </button>
      ))}
    </div>
  );
}
