import express from "express";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById,
} from "../controllers/customer.controller";

import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Admin-only routes
router.post("/customers", authMiddleware, adminMiddleware, createCustomer);
router.patch("/customers/:id", authMiddleware, adminMiddleware, updateCustomer);
router.delete(
  "/customers/:id",
  authMiddleware,
  adminMiddleware,
  deleteCustomer,
);

// Read routes (accessible to authenticated users)
router.get("/customers/", authMiddleware, getCustomers);
router.get("/customers/:id", authMiddleware, getCustomerById);

export default router;
