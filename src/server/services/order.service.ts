import { prisma } from "@/lib/prisma";
import { CheckoutInput } from "@/server/schemas/checkout.schema";
import { couponService } from "@/server/services/coupon.service";
import { createPaymentSession } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";

export class OrderService {
  async createOrder(
    input: CheckoutInput,
    userId?: string,
    sessionToken?: string
  ) {
    const {
      email,
      shippingAddress,
      shippingMethod,
      couponCode,
      idempotencyKey,
      notes,
    } = input;

    // 1. Verificar idempotencia: Si ya existe una orden con esta clave, devolverla
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
      include: {
        items: true,
        payment: true,
      },
    });

    if (existingOrder) {
      return {
        order: existingOrder,
        isExisting: true,
      };
    }

    // 2. Obtener el carrito activo
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          ...(userId ? [{ userId, status: "ACTIVE" }] : []),
          ...(sessionToken ? [{ sessionToken, status: "ACTIVE" }] : []),
        ],
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isMain: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("CARRITO_VACIO: No hay productos en el carrito para procesar.");
    }

    // 3. Ejecutar transacción atómica de reserva y creación
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;

      // Validar stock de cada variante en la transacción
      for (const item of cart.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new Error(`PRODUCTO_NO_DISPONIBLE: La variante ya no existe.`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(
            `STOCK_INSUFICIENTE: "${item.variant.product.title} (${item.variant.title})" solo tiene ${variant.stock} unidades disponibles.`
          );
        }

        subtotal += variant.price * item.quantity;
      }

      subtotal = Number(subtotal.toFixed(2));

      // 4. Calcular cupón de descuento si se proporcionó
      let discountTotal = 0;
      if (couponCode) {
        try {
          const couponResult = await couponService.validateCoupon(
            couponCode,
            subtotal
          );
          discountTotal = couponResult.discountAmount;

          // Incrementar contador de uso del cupón
          await tx.coupon.update({
            where: { code: couponCode.toUpperCase() },
            data: { usedCount: { increment: 1 } },
          });
        } catch (couponError: any) {
          throw new Error(`ERROR_CUPON: ${couponError.message}`);
        }
      }

      // 5. Calcular coste de flete
      let shippingFee = 0;
      const freeShippingThreshold = 60.0;
      const isFreeShipping = subtotal - discountTotal >= freeShippingThreshold;

      if (shippingMethod === "STANDARD") {
        shippingFee = isFreeShipping ? 0.0 : 4.99;
      } else if (shippingMethod === "EXPRESS") {
        shippingFee = 9.99;
      } else if (shippingMethod === "ECO_BOUTIQUE") {
        shippingFee = 12.99;
      }

      // 6. Calcular impuestos estimados (8% sales tax)
      const taxableAmount = Math.max(0, subtotal - discountTotal);
      const taxTotal = Number((taxableAmount * 0.08).toFixed(2));
      const grandTotal = Number(
        (taxableAmount + shippingFee + taxTotal).toFixed(2)
      );

      const orderNumber = generateOrderNumber();

      // 7. Crear la orden
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          guestEmail: email,
          status: "PROCESSING",
          subtotal,
          discountTotal,
          shippingFee,
          taxTotal,
          grandTotal,
          idempotencyKey,
          shippingAddress: JSON.stringify(shippingAddress),
          couponCode: couponCode || null,
          notes: notes || null,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              title: `${item.variant.product.title} - ${item.variant.title}`,
              sku: item.variant.sku,
              price: item.variant.price,
              quantity: item.quantity,
              imageUrl: item.variant.product.images[0]?.url || null,
            })),
          },
          payment: {
            create: {
              provider: "STRIPE",
              status: "PAID", // En modo test se aprueba directamente
              amount: grandTotal,
              currency: "USD",
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      // 8. Decrementar stock y registrar kardex
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryMovement.create({
          data: {
            variantId: item.variantId,
            change: -item.quantity,
            reason: `SALE_ORDER_${orderNumber}`,
          },
        });
      }

      // 9. Vaciar el carrito
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    return {
      order: result,
      isExisting: false,
    };
  }

  async getOrderByIdOrNumber(identifier: string) {
    return prisma.order.findFirst({
      where: {
        OR: [{ id: identifier }, { orderNumber: identifier }],
      },
      include: {
        items: true,
        payment: true,
      },
    });
  }

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const orderService = new OrderService();
