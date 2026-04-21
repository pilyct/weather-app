import { useState, useEffect, useRef } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import { getCitySuggestions } from "../services/api-service";
import type { Units, CitySuggestion } from "../types";

export default function Inputs({
  setCity,
  setCoords,
  setUnits,
}: {
  setCity: (city: string) => void;
  setCoords: (coords: { lat: number; lon: number }) => void;
  setUnits: (units: Units) => void;
}) {
  const [cityName, setCityName] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (cityName.trim().length >= 2) {
        const results = await getCitySuggestions(cityName.trim());
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [cityName]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: CitySuggestion) => {
    setGeoError(null);
    setCity(suggestion.name);
    setCityName("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    const trimmed = cityName.trim();
    if (trimmed) {
      setGeoError(null);
      setCity(trimmed);
      setCityName("");
      setShowSuggestions(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location access denied. Please allow it in your browser settings.",
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError("Location unavailable. Try searching manually.");
        } else {
          setGeoError("Could not get your location. Try searching manually.");
        }
      },
      { timeout: 10000 },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearchClick();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="my-4 mx-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full" ref={dropdownRef}>
        <div className="flex w-full items-center overflow-hidden rounded-xl border border-white/10 bg-white/10">
          <input
            value={cityName}
            onChange={(e) => {
              setCityName(e.currentTarget.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Search by city..."
            className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none sm:text-base"
          />
          <button
            type="button"
            onClick={handleGeolocate}
            disabled={geoLoading}
            className="flex items-center justify-center px-3 py-2 text-white/90 hover:bg-white/10 disabled:opacity-50"
            aria-label="Use my location"
            title="Use my location"
          >
            <BiCurrentLocation
              size={22}
              className={geoLoading ? "animate-spin" : ""}
            />
          </button>
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex items-center justify-center px-3 py-2 text-white/90 hover:bg-white/10"
            aria-label="Search"
          >
            <BiSearch size={22} />
          </button>
        </div>
        {geoError && <p className="mt-1 text-xs text-red-300">{geoError}</p>}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-white/10 bg-gray-800/95 backdrop-blur-sm shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.lat}-${suggestion.lon}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={`w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 ${
                  index === selectedIndex ? "bg-white/10" : ""
                }`}
              >
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-xs text-white/60">
                  {suggestion.state && `${suggestion.state}, `}
                  {suggestion.country}
                </div>
              </button>
            ))}
          </div>
        )}
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
