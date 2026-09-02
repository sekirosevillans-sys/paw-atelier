import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateInventorySchema = z.object({
  variantId: z.string().min(1),
  stock: z.number().int().min(0),
});

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateInventorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { variantId, stock } = parsed.data;

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
      include: { product: true },
    });

    return NextResponse.json({
      success: true,
      message: `Stock para ${updated.title} actualizado a ${stock} unidades`,
      variant: updated,
    });
  } catch (error: any) {
    console.error("[ADMIN_INVENTORY_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Error al actualizar stock" },
      { status: 500 }
    );
  }
}
