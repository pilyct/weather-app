// import React, { useState } from "react";
// import {
//   FaAngleLeft,
//   FaAngleRight,
//   FaAnglesLeft,
//   FaAnglesRight,
// } from "react-icons/fa6";
// import { PoemData } from "../../types";

// interface WeatherPoemProps {
//   poemData: PoemData | null;
// }

// const WeatherPoem: React.FC<WeatherPoemProps> = ({ poemData }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const linesPerPage = 6;

//   if (!poemData) {
//     return <div>Loading...</div>;
//   }

//   const startIdx = (currentPage - 1) * linesPerPage;
//   const endIdx = startIdx + linesPerPage;
//   const visibleLines = poemData.lines.slice(startIdx, endIdx);
//   const totalPages = Math.ceil(poemData.lines.length / linesPerPage);

//   const highlightweatherWord = (phrase: string) => {
//     if (!poemData || !poemData.weatherWord) {
//       return phrase;
//     }

//     const regex = new RegExp(
//       `\\b(${poemData.weatherWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
//       "gi"
//     );
//     const parts = phrase.split(regex);

//     return parts.map((part, index) =>
//       regex.test(part) ? (
//         <span className="font-semibold underline" key={index}>
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   const handlePaginationClick = (
//     action: "first" | "back" | "next" | "last"
//   ) => {
//     switch (action) {
//       case "first":
//         setCurrentPage(1);
//         break;
//       case "back":
//         setCurrentPage(Math.max(currentPage - 1, 1));
//         break;
//       case "next":
//         setCurrentPage(Math.min(currentPage + 1, totalPages));
//         break;
//       case "last":
//         setCurrentPage(totalPages);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="border-2 border-slate-100 border-opacity-5 rounded-2xl mx-2 my-2 py-4 px-4 bg-gradient-to-br shadow-[0_3px_10px_rgb(0,0,0,0.5)] backdrop-blur-3xl w-full max-w-sm sm:max-w-md md:max-w-lg h-96 flex flex-col">
//       <div className="flex items-center justify-start">
//         <p className="font-medium text-white uppercase">Weather Poem</p>
//       </div>
//       <hr className="my-2" />
//       <div className="flex-grow pl-2 overflow-hidden">
//         <div className="flex flex-col items-start justify-start mb-2">
//           <p className="mt-2 mr-2 text-xl font-medium text-white">
//             {poemData.title}
//           </p>
//           <p className="font-normal text-white">{`— by ${poemData.author}`}</p>
//         </div>
//         <div className="h-56 mt-4 mb-2 overflow-hidden italic font-light text-white text-medium">
//           {visibleLines.map((line, index) => (
//             <React.Fragment key={index}>
//               {highlightweatherWord(line)}
//               {index < visibleLines.length - 1 && <br />}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//       {poemData.lines.length > linesPerPage && (
//         <div className="mt-2">
//           <hr className="my-2 border-gray-300" />
//           <div className="flex items-center justify-center px-3 text-white">
//             <button
//               className="p-2 mx-1 bg-gray-700 rounded-full focus:outline-none"
//               onClick={() => handlePaginationClick("first")}
//             >
//               <FaAnglesLeft />
//             </button>
//             <button
//               className="p-2 mx-1 bg-gray-700 rounded-full focus:outline-none"
//               onClick={() => handlePaginationClick("back")}
//             >
//               <FaAngleLeft />
//             </button>
//             <span className="mx-1 text-sm text-white">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               className="p-2 mx-1 bg-gray-700 rounded-full focus:outline-none"
//               onClick={() => handlePaginationClick("next")}
//             >
//               <FaAngleRight />
//             </button>
//             <button
//               className="p-2 mx-1 bg-gray-700 rounded-full -2 focus:outline-none"
//               onClick={() => handlePaginationClick("last")}
//             >
//               <FaAnglesRight />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeatherPoem;

import React, { useMemo, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import type { PoemData } from "../../types";
import { Panel } from "../ui/Panel";

export function WeatherPoem({ poemData }: { poemData: PoemData | null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const linesPerPage = 6;

  const totalPages = useMemo(() => {
    if (!poemData?.lines?.length) return 1;
    return Math.ceil(poemData.lines.length / linesPerPage);
  }, [poemData]);

  const visibleLines = useMemo(() => {
    if (!poemData?.lines?.length) return [];
    const start = (currentPage - 1) * linesPerPage;
    return poemData.lines.slice(start, start + linesPerPage);
  }, [poemData, currentPage]);

  const highlightWeatherWord = (phrase: string) => {
    const word = poemData?.weatherWord;
    if (!word) return phrase;

    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b(${escaped})\\b`, "gi");
    const parts = phrase.split(regex);

    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span className="font-semibold underline underline-offset-4" key={idx}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const go = (action: "first" | "back" | "next" | "last") => {
    setCurrentPage((p) => {
      if (action === "first") return 1;
      if (action === "back") return Math.max(p - 1, 1);
      if (action === "next") return Math.min(p + 1, totalPages);
      return totalPages;
    });
  };

  return (
    <Panel title="Weather Poem" className="flex flex-col">
      {!poemData ? (
        <div className="py-6 text-white/80">Loading...</div>
      ) : (
        <>
          <hr className="mb-3 border-white/10" />

          <div className="flex-1">
            <p className="text-lg font-semibold text-white sm:text-xl">
              {poemData.title}
            </p>
            <p className="mt-1 text-sm text-white/80">{`— by ${poemData.author}`}</p>

            <div className="mt-4 min-h-36 text-sm italic font-light leading-6 text-white sm:text-base">
              {visibleLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  {highlightWeatherWord(line)}
                  {idx < visibleLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {poemData.lines.length > linesPerPage && (
            <div className="mt-4">
              <hr className="mb-3 border-white/10" />
              <div className="flex items-center justify-center gap-2 text-white">
                <IconBtn onClick={() => go("first")}>
                  <FaAnglesLeft />
                </IconBtn>
                <IconBtn onClick={() => go("back")}>
                  <FaAngleLeft />
                </IconBtn>
                <span className="px-2 text-xs text-white/80 sm:text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <IconBtn onClick={() => go("next")}>
                  <FaAngleRight />
                </IconBtn>
                <IconBtn onClick={() => go("last")}>
                  <FaAnglesRight />
                </IconBtn>
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

function IconBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="rounded-full bg-white/10 p-2 hover:bg-white/15"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
