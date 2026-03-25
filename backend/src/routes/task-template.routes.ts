import express from "express";
import {
  getTaskTemplates,
  getTaskTemplateById,
  createTaskTemplate,
  updateTaskTemplate,
  deleteTaskTemplate,
  assignTaskTemplate,
} from "../controllers/task-template.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/task-templates", authMiddleware, getTaskTemplates);
router.get("/task-templates/:id", authMiddleware, getTaskTemplateById);

router.post(
  "/task-templates",
  authMiddleware,
  adminMiddleware,
  createTaskTemplate,
);
router.patch(
  "/task-templates/:id",
  authMiddleware,
  adminMiddleware,
  updateTaskTemplate,
);
router.delete(
  "/task-templates/:id",
  authMiddleware,
  adminMiddleware,
  deleteTaskTemplate,
);

// Assign template
router.post(
  "/task-templates/:id/assign",
  authMiddleware,
  adminMiddleware,
  assignTaskTemplate,
);

export default router;
