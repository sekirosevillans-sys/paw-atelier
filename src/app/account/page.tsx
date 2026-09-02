import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { orderService } from "@/server/services/order.service";
import { formatCurrency } from "@/lib/utils";
import { Package, Calendar, MapPin, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const orders = await orderService.getUserOrders(user.id);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-5xl">
      {/* User greeting header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/80 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-olive text-white font-editorial text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-editorial text-3xl font-bold tracking-tight">
              Bienvenido, {user.name}
            </h1>
            <p className="text-xs text-stone-500">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {user.role === "ADMIN" && (
            <Button asChild variant="outline" className="rounded-full text-xs">
              <Link href="/admin">Panel de Administración</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Orders History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-semibold">
            Historial de Pedidos Atelier
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {orders.length} orden(es) registradas
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-stone-50/50">
            <Package className="mx-auto h-12 w-12 text-stone-400 mb-3" />
            <h3 className="font-editorial text-xl font-semibold mb-1">
              Aún no tienes pedidos registrados
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              Cuando adquieras piezas en nuestra boutique, podrás seguir su preparación y trayecto aquí.
            </p>
            <Button asChild className="rounded-full">
              <Link href="/catalog">Explorar Catálogo</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "es-ES",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 mb-4 gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-foreground">
                        Pedido #{order.orderNumber}
                      </span>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Realizado el {formattedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        {order.status === "PROCESSING"
                          ? "En Preparación"
                          : order.status === "SHIPPED"
                          ? "En Camino"
                          : order.status === "DELIVERED"
                          ? "Entregado"
                          : order.status}
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        {formatCurrency(order.grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className="text-stone-700">
                          <strong>{item.quantity}×</strong> {item.title}
                        </span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                    <Link
                      href={`/order/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-olive hover:underline"
                    >
                      <span>Ver comprobante completo</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
