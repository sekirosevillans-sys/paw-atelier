"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MiniCartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading } =
    useCart();

  if (!isOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const isFreeShipping = cart?.isFreeShipping ?? false;
  const amountNeeded = cart?.amountNeededForFreeShipping ?? 60;
  const progress = cart?.progressToFreeShipping ?? 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside
          aria-label="Bolsa de compras"
          className="w-screen max-w-md transform bg-background shadow-2xl transition-transform duration-300 ease-in-out flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-editorial text-xl font-semibold">
                Tu Bolsa de Compras
              </h2>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">
                {cart?.totalItems || 0}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              aria-label="Cerrar bolsa de compras"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="border-b border-border/60 bg-stone-50 px-6 py-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {isFreeShipping ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" /> ¡Envío gratuito desbloqueado!
                </span>
              ) : (
                <span className="text-stone-600">
                  Agrega <strong className="text-foreground">{formatCurrency(amountNeeded)}</strong> más para obtener <strong className="text-olive">Envío Gratis</strong>
                </span>
              )}
              <span className="font-medium text-stone-500">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-olive transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="rounded-full bg-stone-100 p-6 text-stone-400 mb-4">
                  <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
                </div>
                <h3 className="font-editorial text-xl font-semibold mb-2">
                  Tu bolsa está vacía
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                  Descubre piezas de diseño pensadas exclusivamente para el bienestar de tu mascota.
                </p>
                <Button
                  onClick={closeCart}
                  asChild
                  variant="default"
                  className="rounded-full px-6"
                >
                  <Link href="/catalog">Explorar la Colección</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variantTitle} {item.size && `• ${item.size}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                        aria-label={`Eliminar ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-lg border border-border bg-stone-50">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-1.5 text-stone-500 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 text-stone-500 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {items.length > 0 && (
            <div className="border-t border-border/80 bg-stone-50/50 p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal estimado</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Impuestos y envío</span>
                  <span>Calculados en el checkout</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  asChild
                  onClick={closeCart}
                  className="w-full rounded-xl py-6 text-base font-semibold shadow-md gap-2"
                  variant="accent"
                >
                  <Link href="/checkout">
                    Iniciar Checkout Seguro
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={closeCart}
                  asChild
                  className="w-full rounded-xl"
                >
                  <Link href="/cart">Ver Bolsa Detallada</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-stone-400">
                <span>🔒 Pago Encriptado SSL</span>
                <span>•</span>
                <span>📦 30 Días de Garantía</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
