import { prisma } from "@/lib/prisma";

export class CouponService {
  async validateCoupon(code: string, subtotal: number) {
    const formattedCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: formattedCode },
    });

    if (!coupon) {
      throw new Error("CUPON_NO_ENCONTRADO: El código ingresado no existe.");
    }

    if (!coupon.isActive) {
      throw new Error("CUPON_INACTIVO: Esta promoción ya no está disponible.");
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new Error("CUPON_EXPIRADO: Esta promoción ha caducado.");
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new Error("CUPON_AGOTADO: Se ha alcanzado el límite de usos para este cupón.");
    }

    if (subtotal < coupon.minSubtotal) {
      throw new Error(
        `COMPRA_MINIMA_NO_ALCANZADA: Este cupón requiere una compra mínima de $${coupon.minSubtotal.toFixed(2)}.`
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    discountAmount = Number(discountAmount.toFixed(2));
    const newTotal = Number(Math.max(0, subtotal - discountAmount).toFixed(2));

    return {
      isValid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discountAmount,
      newSubtotal: newTotal,
      message: `¡Cupón aplicado exitosamente! Ahorras $${discountAmount.toFixed(2)}.`,
    };
  }
}

export const couponService = new CouponService();
