import { z } from "zod";

export const addToCartSchema = z.object({
  variantId: z.string().min(1, "El identificador de la variante es requerido"),
  quantity: z.number().int("La cantidad debe ser entera").positive("La cantidad debe ser mayor a 0").max(99, "Máximo 99 unidades por ítem"),
});

export const updateCartItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(0, "La cantidad no puede ser negativa").max(99),
});

export const removeCartItemSchema = z.object({
  variantId: z.string().min(1),
});
