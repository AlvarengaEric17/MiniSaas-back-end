import { z } from "zod";

// Helper para converter string "true"/"false" para boolean
const stringToBoolean = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val === 'true';
  }
  return val;
}, z.boolean());

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be a positive number"),
    active: stringToBoolean.optional().default(true),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    price: z.coerce.number().positive("Price must be a positive number").optional(),
    active: stringToBoolean.optional(), // Aplicado o preprocess aqui também
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

export const deleteProductSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

export const listProductsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    active: z.enum(["true", "false"]).optional(),
  }),
  params: z.object({}).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
