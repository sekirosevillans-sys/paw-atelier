import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  species: z.enum(["DOG", "CAT", "ALL"]),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  basePrice: z.number().positive(),
  featured: z.boolean().default(false),
  variantTitle: z.string().default("Estándar"),
  sku: z.string().min(3),
  initialStock: z.number().int().min(0).default(10),
  imageUrl: z.string().url().optional(),
});

const updateProductStatusSchema = z.object({
  productId: z.string().min(1),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de producto inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        species: data.species,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        isFeatured: data.featured,
        isActive: true,
        images: {
          create: [
            {
              url: data.imageUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200",
              alt: data.title,
              order: 0,
              isMain: true,
            },
          ],
        },
        variants: {
          create: [
            {
              title: data.variantTitle,
              sku: data.sku,
              price: data.basePrice,
              stock: data.initialStock,
            },
          ],
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Producto artesanal registrado exitosamente",
      product,
    });
  } catch (error: any) {
    console.error("[ADMIN_PRODUCT_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Error al registrar producto" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateProductStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { productId, status, featured } = parsed.data;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(status && { isActive: status === "ACTIVE" }),
        ...(typeof featured === "boolean" && { isFeatured: featured }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Estado del producto actualizado",
      product: updated,
    });
  } catch (error: any) {
    console.error("[ADMIN_PRODUCT_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Error al modificar producto" },
      { status: 500 }
    );
  }
}
