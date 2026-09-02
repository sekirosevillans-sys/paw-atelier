import { NextResponse } from "next/server";
import { couponService } from "@/server/services/coupon.service";
import { applyCouponSchema } from "@/server/schemas/coupon.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = applyCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos de cupón inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await couponService.validateCoupon(
      parsed.data.code,
      parsed.data.subtotal
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message.replace(/^[A-Z_]+:\s*/, "") },
      { status: 400 }
    );
  }
}
