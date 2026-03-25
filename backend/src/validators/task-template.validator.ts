import { z } from "zod";

export const createTaskTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateTaskTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const assignTaskTemplateSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
});

export type CreateTaskTemplateInput = z.infer<typeof createTaskTemplateSchema>;
export type UpdateTaskTemplateInput = z.infer<typeof updateTaskTemplateSchema>;
export type AssignTaskTemplateInput = z.infer<typeof assignTaskTemplateSchema>;
