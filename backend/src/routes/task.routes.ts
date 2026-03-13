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
router.post("/tasks", authMiddleware, adminMiddleware, createTask);
router.patch("/tasks/:id", authMiddleware, adminMiddleware, updateTask);
router.delete("/tasks/:id", authMiddleware, adminMiddleware, deleteTask);

// Read routes
router.get("/tasks/", authMiddleware, getTasks);
router.get("/tasks/customer/:customerId", authMiddleware, getTasksByCustomer);
router.get("/tasks/:id", authMiddleware, getTaskById);

export default router;
