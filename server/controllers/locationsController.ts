import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

interface ForecastTime {
  time: string;
  date: string;
  temp: number;
  weather_main: string;
  description: string;
  wind_speed: number;
  icon: string;
}

interface SavedLocation {
  id: string;
  city_name: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  temp_max: number;
  temp_min: number;
  icon: string;
}

const DATA_DIR = path.join(__dirname, "../data");
const LOCATIONS_FILE = path.join(DATA_DIR, "locations.json");

function readLocations(): SavedLocation[] {
  try {
    if (!fs.existsSync(LOCATIONS_FILE)) return [];
    const raw = fs.readFileSync(LOCATIONS_FILE, "utf-8");
    return JSON.parse(raw) as SavedLocation[];
  } catch {
    return [];
  }
}

function writeLocations(locations: SavedLocation[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(locations, null, 2), "utf-8");
}

export function getLocations(_req: Request, res: Response): void {
  res.json(readLocations());
}

export function saveLocation(req: Request, res: Response): void {
  const {
    city_name,
    country,
    lat,
    lon,
    temperature,
    temp_max,
    temp_min,
    icon,
  } = req.body as Partial<SavedLocation>;

  if (
    !city_name ||
    !country ||
    lat === undefined ||
    lon === undefined ||
    temperature === undefined ||
    temp_max === undefined ||
    temp_min === undefined ||
    icon === undefined
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const locations = readLocations();

  if (locations.some((l) => l.lat === lat && l.lon === lon)) {
    res.status(409).json({ error: "Location already saved" });
    return;
  }

  const newLocation: SavedLocation = {
    id: randomUUID(),
    city_name,
    country,
    lat,
    lon,
    temperature,
    temp_max,
    temp_min,
    icon,
  };

  locations.push(newLocation);
  writeLocations(locations);
  res.status(201).json(newLocation);
}

export function deleteLocation(req: Request, res: Response): void {
  const { id } = req.params;
  const locations = readLocations();
  const idx = locations.findIndex((l) => l.id === id);

  if (idx === -1) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  locations.splice(idx, 1);
  writeLocations(locations);
  res.status(204).send();
}
