import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";
import { readLimiter } from "../middleware/rate-limiting.middleware";
import * as reportController from "../controllers/report.controller";

const router = Router();

router.get(
  "/reports/customer/:customerId",
  authMiddleware,
  adminMiddleware,
  readLimiter,
  reportController.getCustomerReport,
);

export default router;
