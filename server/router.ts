import { Router } from "express";
import {
  getWeatherData,
  getWeatherByCoords,
  getCitySuggestions,
} from "./controllers/weatherController";
import { getPoemData } from "./controllers/poetryController";
import {
  getLocations,
  saveLocation,
  deleteLocation,
} from "./controllers/locationsController";

const router = Router();

router.get("/weather", getWeatherData);
router.get("/weather/coords", getWeatherByCoords);
router.get("/cities/suggestions", getCitySuggestions);
router.get("/poem", getPoemData);

router.get("/locations", getLocations);
router.post("/locations", saveLocation);
router.delete("/locations/:id", deleteLocation);

export default router;
