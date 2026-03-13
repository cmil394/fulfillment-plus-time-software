import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as timeEntryController from "../controllers/time-entry.controller";

const router = Router();

router.use(authMiddleware);

router.get("/time-entries", timeEntryController.getMyEntries);
router.post("/time-entries/start", timeEntryController.startTimer);
router.get("/time-entries/active", timeEntryController.getActiveTimer);
router.patch("/time-entries/active/stop", timeEntryController.stopTimer);
router.get("/time-entries/:userId", timeEntryController.getEntriesByUser);
router.get(
  "/time-entries/:customerId",
  timeEntryController.getEntriesByCustomer,
);

export default router;
