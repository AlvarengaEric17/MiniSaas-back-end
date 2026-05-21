// src/schemas/companySchema.ts
import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9\-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const authSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>["body"];
export type AuthInput = z.infer<typeof authSchema>["body"];
