import React, { useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { PoemData } from "../types";

interface WeatherPoemProps {
  poemData: PoemData | null;
}

const WeatherPoem: React.FC<WeatherPoemProps> = ({ poemData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const linesPerPage = 6;

  if (!poemData) {
    return <div>Loading...</div>;
  }

  const startIdx = (currentPage - 1) * linesPerPage;
  const endIdx = startIdx + linesPerPage;
  const visibleLines = poemData.lines.slice(startIdx, endIdx);
  const totalPages = Math.ceil(poemData.lines.length / linesPerPage);

  const highlightweatherWord = (phrase: string) => {
    if (!poemData?.weatherWord) {
      return phrase;
    }
    const escapedWord = poemData.weatherWord.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const regex = new RegExp(String.raw`\b(${escapedWord})`, "gi");
    const parts = phrase.split(regex);
    return parts.map((part) =>
      regex.test(part) ? (
        <span
          className="font-semibold underline decoration-white/80"
          key={part}
        >
          {part}
        </span>
      ) : (
        part
      ),
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
    <div className="w-full rounded-2xl border-2 border-slate-100/5 bg-gradient-to-br px-4 py-3 shadow-xl backdrop-blur-3xl">
      <div className="flex items-center justify-start">
        <p className="font-medium uppercase text-white">Weather Poem</p>
      </div>
      <hr className="my-2 border-white/20" />

      <div className="flex flex-col">
        <div className="mb-3">
          <p className="text-lg font-medium text-white sm:text-xl">
            {poemData.title}
          </p>
          <p className="mt-1 text-sm font-normal text-white/90">
            — by {poemData.author}
          </p>
        </div>

        <div className="mb-3 min-h-[11.7rem] text-sm italic font-light leading-relaxed text-white sm:text-base">
          {visibleLines.map((line, i) => {
            const originalIndex = startIdx + i;

            return (
              <React.Fragment key={originalIndex}>
                {highlightweatherWord(line)}
                {i < visibleLines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {poemData.lines.length > linesPerPage && (
        <div className="mt-auto">
          <hr className="mb-2 border-white/20" />
          <div className="flex items-center justify-center gap-2 text-white">
            <IconBtn onClick={() => go("first")} aria-label="First page">
              <FaAnglesLeft />
            </IconBtn>
            <IconBtn onClick={() => go("back")} aria-label="Previous page">
              <FaAngleLeft />
            </IconBtn>
            <span className="px-2 text-sm text-white sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <IconBtn onClick={() => go("next")} aria-label="Next page">
              <FaAngleRight />
            </IconBtn>
            <IconBtn onClick={() => go("last")} aria-label="Last page">
              <FaAnglesRight />
            </IconBtn>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPoem;

function IconBtn({
  onClick,
  children,
  "aria-label": ariaLabel,
}: {
  readonly onClick: () => void;
  readonly children: React.ReactNode;
  readonly "aria-label"?: string;
}) {
  return (
    <button
      className="rounded-full bg-white/10 p-2 transition-colors duration-200 hover:bg-white/20 active:bg-white/25"
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
