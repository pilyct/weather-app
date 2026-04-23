import { MdClose } from "react-icons/md";
import { SavedLocation } from "../types";
import { formatTemperature, iconUrlFromCode } from "../utils/helperFunctions";

interface SavedLocationsProps {
  savedLocations: SavedLocation[];
  units: "metric" | "imperial";
  onDelete: (id: string) => void;
  onSelect: (location: SavedLocation) => void;
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  savedLocations,
  units,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="w-full rounded-2xl border-2 border-slate-100/5 bg-gradient-to-br px-6 py-5 shadow-xl backdrop-blur-2xl">
      <div className="flex items-center justify-start">
        <p className="font-medium uppercase text-white">Saved locations</p>
      </div>
      <hr className="my-2 border-white/20" />

      {savedLocations.length > 0 && (
        <ul className="mt-4 space-y-1">
          {savedLocations.map((loc) => {
            return (
              <li
                key={loc.id}
                className="relative overflow-hidden flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm text-white/90"
              >
                {/* Content */}
                <button
                  className="relative z-10 flex-1 text-left cursor-pointer hover:text-white"
                  onClick={() => onSelect(loc)}
                >
                  {loc.city_name}
                  <span className="ml-1 text-white/50">{loc.country}</span>
                </button>
                {loc.icon !== undefined && (
                  <img
                    src={iconUrlFromCode(loc.icon)}
                    alt=""
                    className="relative z-10 h-8 w-8"
                  />
                )}
                {loc.temperature !== undefined && (
                  <span className="relative z-10 mx-3 text-white/70">
                    {formatTemperature(loc.temperature, units)}
                  </span>
                )}
                {/* {loc.temp_max !== undefined && (
                  <span className="relative z-10 mx-3 text-white/70 text-xs">
                    H: {formatTemperature(loc.temp_max, units)}
                  </span>
                )}
                {loc.temp_min !== undefined && (
                  <span className="relative z-10 mx-3 text-white/70 text-xs">
                    L: {formatTemperature(loc.temp_min, units)}
                  </span>
                )} */}
                <button
                  onClick={() => onDelete(loc.id)}
                  className="relative z-10 rounded p-0.5 text-white/50 transition hover:bg-white/15 hover:text-white"
                  aria-label={`Remove ${loc.city_name}`}
                >
                  <MdClose size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {savedLocations.length === 0 && (
        <p className="mt-4 text-center text-sm text-white/40">
          No saved locations yet
        </p>
      )}
    </div>
  );
};

export default SavedLocations;
