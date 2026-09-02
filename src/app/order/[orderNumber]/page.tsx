import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  Printer,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber }, { id: orderNumber }],
    },
    include: {
      items: true,
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  let address: any = {};
  try {
    address = JSON.parse(order.shippingAddress || "{}");
  } catch (e) {
    address = {};
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fecha estimada de entrega (5 días posteriores)
  const deliveryDate = new Date(
    new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      {/* Success Card Header */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 text-center mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
          ¡Gracias por tu compra en PawAtelier!
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2 mb-3">
          Tu Pedido ha sido Confirmado
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Hemos recibido tu orden <strong className="font-mono text-foreground">#{order.orderNumber}</strong> y nuestro equipo artesanal ya está preparando cada detalle con mimo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Detail Box 1 */}
        <div className="rounded-2xl border border-border/80 bg-stone-50/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive">
            <Calendar className="h-4 w-4" />
            <span>Fecha Estimada de Entrega</span>
          </div>
          <p className="font-editorial text-lg font-semibold capitalize text-foreground">
            {deliveryDate}
          </p>
          <p className="text-xs text-stone-500">Despacho asegurado y rastreable</p>
        </div>

        {/* Detail Box 2 */}
        <div className="rounded-2xl border border-border/80 bg-stone-50/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive">
            <MapPin className="h-4 w-4" />
            <span>Dirección de Destino</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            {address.fullName}
          </p>
          <p className="text-xs text-stone-600">
            {address.address1}, {address.city}, {address.state} {address.postalCode}
          </p>
        </div>

        {/* Detail Box 3 */}
        <div className="rounded-2xl border border-border/80 bg-stone-50/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive">
            <Truck className="h-4 w-4" />
            <span>Estado del Pedido</span>
          </div>
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            En Preparación Artesanal
          </span>
          <p className="text-xs text-stone-500">
            Recibirás el código de seguimiento por correo.
          </p>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="rounded-3xl border border-border/80 bg-background overflow-hidden shadow-xs mb-10">
        <div className="p-6 border-b border-border/60 flex items-center justify-between">
          <h2 className="font-editorial text-xl font-bold">Artículos Incluidos</h2>
          <span className="text-xs text-stone-500 font-medium">
            {order.items.length} pieza(s)
          </span>
        </div>

        <div className="divide-y divide-border/60 p-6">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-sand-100">
                  <Image
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400">SKU: {item.sku}</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Cantidad: <strong>{item.quantity}</strong> × {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-foreground">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="bg-stone-50/60 p-6 border-t border-border/60 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(order.subtotal)}
            </span>
          </div>

          {order.discountTotal > 0 && (
            <div className="flex justify-between text-terracotta font-medium">
              <span>Descuento aplicado {order.couponCode && `(${order.couponCode})`}</span>
              <span>-{formatCurrency(order.discountTotal)}</span>
            </div>
          )}

          <div className="flex justify-between text-stone-600">
            <span>Envío</span>
            <span className="font-semibold text-foreground">
              {order.shippingFee === 0 ? "GRATIS" : formatCurrency(order.shippingFee)}
            </span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Impuestos aplicados</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(order.taxTotal)}
            </span>
          </div>

          <div className="pt-3 border-t border-border flex justify-between text-lg font-bold text-foreground">
            <span>Total Pagado</span>
            <span className="font-editorial text-2xl">
              {formatCurrency(order.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="rounded-full px-8 gap-2">
          <Link href="/catalog">
            Seguir Descubriendo la Colección
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
