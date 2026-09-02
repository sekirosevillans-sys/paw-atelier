import { z } from "zod";

export const applyCouponSchema = z.object({
  code: z.string().trim().min(2, "El código debe tener al menos 2 caracteres").max(30),
  subtotal: z.number().nonnegative("El subtotal no puede ser negativo"),
});

export const createCouponSchema = z.object({
  code: z.string().trim().min(3).max(30).toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive("El valor del descuento debe ser mayor a 0"),
  minSubtotal: z.number().nonnegative().default(0),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});
