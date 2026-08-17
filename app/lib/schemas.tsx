import { z } from "zod";


export const LoginSchema = z.object({
  email: z.string({required_error:'Required'}),
  password: z.string({required_error:'Required'}),
})

export const ProductSchema = z.object({
  category: z.string({ required_error: "Required" }),
  name: z.string({ required_error: "Required" }),
  weight: z.string({required_error: "Required" }),
  dosage: z.string({required_error: "Required" }),
  expirationDate: z.string({required_error: "Required" }),
  description: z.string().optional(),
  price: z.number({ required_error: "Required" }),
  image: z.string({ required_error: "Required" }),
});

export const EditProductSchema = z.object({
  newCategory: z.optional(z.string()),
  newName: z.optional(z.string()),
  oldName: z.string(),
  oldCategory: z.string(),
  weight: z.optional(z.string()),
  dosage: z.optional(z.string()),
  expirationDate: z.optional(z.string()),
  description: z.optional(z.string()),
  price: z.optional(z.number()),
  image: z.optional(z.string()),
});

export const AddProductSchema = z.object({
  category: z.string(),
  name: z.string(),
  weight: z.string(),
  dosage: z.string(),
  expirationDate: z.string(),
  description: z.string().optional(),
  price: z.number(),
  image: z.string(),
});

export type ProductType = z.infer<typeof ProductSchema>;
export type LoginType = z.infer<typeof LoginSchema>
export type EditType = z.infer<typeof EditProductSchema>
export type AddType = z.infer<typeof AddProductSchema>
