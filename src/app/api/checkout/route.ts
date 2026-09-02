import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { orderService } from "@/server/services/order.service";
import { checkoutSchema } from "@/server/schemas/checkout.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos de checkout inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("paw_cart_session")?.value;

    const result = await orderService.createOrder(
      parsed.data,
      user?.id,
      sessionToken
    );

    return NextResponse.json(
      {
        message: "Pedido procesado exitosamente",
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        grandTotal: result.order.grandTotal,
        status: result.order.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en checkout:", error);
    const status =
      error.message.includes("STOCK_INSUFICIENTE") ||
      error.message.includes("PRODUCTO_NO_DISPONIBLE")
        ? 409
        : 400;

    return NextResponse.json(
      { error: error.message.replace(/^[A-Z_]+:\s*/, "") },
      { status }
    );
  }
}
