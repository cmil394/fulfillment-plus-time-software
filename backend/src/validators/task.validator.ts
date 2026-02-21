import { z } from "zod";

export const createTaskSchema = z.object({
  customerId: z.string().uuid("Valid customer ID is required"),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  fixedRate: z.number().positive("Fixed rate must be positive").optional(),
});

export const updateTaskSchema = z.object({
  name: z.string().min(1, "Task name is required").optional(),
  description: z.string().optional(),
  fixedRate: z.number().positive("Fixed rate must be positive").optional(),
  active: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
