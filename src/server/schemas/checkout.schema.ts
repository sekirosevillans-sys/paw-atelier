import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido").max(100),
  address1: z.string().min(5, "La dirección es requerida").max(150),
  address2: z.string().max(100).optional(),
  city: z.string().min(2, "La ciudad es requerida").max(100),
  state: z.string().min(2, "El estado o provincia es requerido").max(100),
  postalCode: z.string().min(3, "El código postal es requerido").max(20),
  country: z.string().min(2).max(2).default("US"),
  phone: z.string().min(7, "El teléfono es requerido para la entrega").max(25),
});

export const checkoutSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(["STANDARD", "EXPRESS", "ECO_BOUTIQUE"]).default("STANDARD"),
  couponCode: z.string().trim().optional(),
  idempotencyKey: z.string().min(10, "Clave de idempotencia requerida"),
  paymentProvider: z.enum(["STRIPE", "STRIPE_TEST_SIMULATOR"]).default("STRIPE"),
  notes: z.string().max(300).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
