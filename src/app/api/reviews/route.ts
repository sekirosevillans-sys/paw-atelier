import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(),
  comment: z.string().trim().min(5, "El comentario debe tener al menos 5 caracteres").max(1000),
  authorName: z.string().trim().min(2, "Ingresa tu nombre").max(60),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de reseña inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const review = await prisma.review.create({
      data: {
        productId: parsed.data.productId,
        userId: user?.id || null,
        authorName: parsed.data.authorName,
        rating: parsed.data.rating,
        title: parsed.data.title || null,
        comment: parsed.data.comment,
        isVerified: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear reseña:", error);
    return NextResponse.json({ error: "Error al publicar la reseña." }, { status: 500 });
  }
}
