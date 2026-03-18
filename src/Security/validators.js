import { z } from "zod";

export const todoIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9]+$/, { message: "id must be a positive integer" })
    .transform(Number),
});

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(255, "title is too long"),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "title cannot be empty")
    .max(255, "title is too long")
    .optional(),
  completed: z.boolean().optional(),
});
