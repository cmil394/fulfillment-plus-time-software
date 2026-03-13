import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as timeEntryController from "../controllers/time-entry.controller";

const router = Router();

router.use(authMiddleware);

router.get("/time-entries", timeEntryController.getMyEntries);
router.post("/time-entries/start", timeEntryController.startTimer);
router.get("/time-entries/active", timeEntryController.getActiveTimer);
router.patch("/time-entries/active/stop", timeEntryController.stopTimer);
router.get(
  "/time-entries/by-user/:userId",
  timeEntryController.getEntriesByUser,
);
router.get(
  "/time-entries/by-customer/:customerId",
  timeEntryController.getEntriesByCustomer,
);

export default router;
