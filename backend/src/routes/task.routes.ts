import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById,
  getTasksByCustomer,
} from "../controllers/task.controller";

import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Admin-only routes (create, update, delete)
router.post("/", authMiddleware, adminMiddleware, createTask);
router.patch("/:id", authMiddleware, adminMiddleware, updateTask);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTask);

// Read routes
router.get("/", authMiddleware, getTasks);
router.get("/customer/:customerId", authMiddleware, getTasksByCustomer);
router.get("/:id", authMiddleware, getTaskById);

export default router;
