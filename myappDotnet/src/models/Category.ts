import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, { message: "Name must not be empty" }),
  description: z.string().min(1, { message: "Description must not be empty" }),
});

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type CategoryRequest = z.infer<typeof categorySchema>;

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Name must not be empty" }),
  description: z.string().min(1, { message: "Description must not be empty" }),
  status: z.enum([CategoryStatus.ACTIVE, CategoryStatus.INACTIVE]),
});

export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
