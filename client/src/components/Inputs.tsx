import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import type { Units } from "../types";

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
    <div className="my-4 mx-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
