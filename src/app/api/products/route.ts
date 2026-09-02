import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
import { productFilterSchema } from "@/server/schemas/product.schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryObj: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      queryObj[key] = val;
    });

    const parsed = productFilterSchema.safeParse(queryObj);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Parámetros de búsqueda inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await productService.getCatalog(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al consultar catálogo." },
      { status: 500 }
    );
  }
}
