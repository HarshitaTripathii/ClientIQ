import { Router } from "express";
import {
  createClient,
  createInsights,
  getClient,
  listClients,
  runAutomation,
  updateClient,
  updateInsights,
} from "../controllers/clientController.js";

const router = Router();

router.get("/", listClients);
router.post("/", createClient);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.post("/:id/generate-insights", createInsights);
router.put("/:id/insights", updateInsights);
router.post("/:id/trigger-automation", runAutomation);

export default router;
