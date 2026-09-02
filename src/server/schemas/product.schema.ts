import { z } from "zod";

export const productFilterSchema = z.object({
  species: z.enum(["DOG", "CAT", "SMALL_PET", "ALL"]).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  inStockOnly: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(["relevance", "price_asc", "price_desc", "newest", "rating"]).default("relevance"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type ProductFilterInput = z.infer<typeof productFilterSchema>;

export const createProductSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z.string().min(3).max(150),
  description: z.string().min(10),
  details: z.string().optional(),
  species: z.enum(["DOG", "CAT", "SMALL_PET", "ALL"]).default("DOG"),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const createVariantSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(3).max(50),
  title: z.string().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative().default(0),
});
