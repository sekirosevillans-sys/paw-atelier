import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, status } = parsed.data;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, payment: true },
    });

    return NextResponse.json({
      success: true,
      message: `Orden #${updated.orderNumber} actualizada a estado ${status}`,
      order: updated,
    });
  } catch (error: any) {
    console.error("[ADMIN_ORDER_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Error al actualizar estado de la orden" },
      { status: 500 }
    );
  }
}
