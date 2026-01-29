import { Router } from "express";
import {
  getWeatherData,
  getCitySuggestions,
} from "./controllers/weatherController";
import { getPoemData } from "./controllers/poetryController";

const router = Router();

router.get("/weather", getWeatherData);
router.get("/cities/suggestions", getCitySuggestions);
router.get("/poem", getPoemData);

export default router;
