import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { cartService } from "@/server/services/cart.service";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "@/server/schemas/cart.schema";

async function getSessionToken() {
  const cookieStore = await cookies();
  let sessionToken = cookieStore.get("paw_cart_session")?.value;
  let isNew = false;

  if (!sessionToken) {
    sessionToken = crypto.randomUUID();
    isNew = true;
  }

  return { sessionToken, isNew };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const { sessionToken, isNew } = await getSessionToken();

    const cart = await cartService.getOrCreateCart(user?.id, sessionToken);

    const response = NextResponse.json(cart);
    if (isNew && !user) {
      response.cookies.set("paw_cart_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Error al obtener carrito:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de agregado inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const { sessionToken, isNew } = await getSessionToken();
    const cart = await cartService.getOrCreateCart(user?.id, sessionToken);

    const updatedCart = await cartService.addItem(
      cart.id,
      parsed.data.variantId,
      parsed.data.quantity
    );

    const response = NextResponse.json(updatedCart);
    if (isNew && !user) {
      response.cookies.set("paw_cart_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Error al agregar al carrito:", error);
    const status = error.message.includes("STOCK_LIMIT_EXCEEDED") ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsed = updateCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const { sessionToken } = await getSessionToken();
    const cart = await cartService.getOrCreateCart(user?.id, sessionToken);

    const updatedCart = await cartService.updateQuantity(
      cart.id,
      parsed.data.variantId,
      parsed.data.quantity
    );

    return NextResponse.json(updatedCart);
  } catch (error: any) {
    console.error("Error al actualizar carrito:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsed = removeCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de eliminación inválidos" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const { sessionToken } = await getSessionToken();
    const cart = await cartService.getOrCreateCart(user?.id, sessionToken);

    const updatedCart = await cartService.removeItem(
      cart.id,
      parsed.data.variantId
    );

    return NextResponse.json(updatedCart);
  } catch (error: any) {
    console.error("Error al eliminar del carrito:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
