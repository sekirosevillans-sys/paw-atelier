"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const isFreeShipping = cart?.isFreeShipping ?? false;
  const amountNeeded = cart?.amountNeededForFreeShipping ?? 60;
  const progress = cart?.progressToFreeShipping ?? 0;

  const discountAmount = couponApplied?.discountAmount || 0;
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingFee = effectiveSubtotal >= 60 || isFreeShipping ? 0 : 4.99;
  const estimatedTax = Number((effectiveSubtotal * 0.08).toFixed(2));
  const grandTotal = Number(
    (effectiveSubtotal + shippingFee + estimatedTax).toFixed(2)
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Ingresa un código de cupón válido");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cupón inválido");
      }

      setCouponApplied({
        code: data.code,
        discountAmount: data.discountAmount,
      });
      toast.success(data.message || "¡Cupón aplicado!");
    } catch (err: any) {
      toast.error(err.message || "Error validando cupón");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-stone-50/50 p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-6">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-editorial text-3xl font-bold mb-3">
            Tu Bolsa de Compras está Vacía
          </h1>
          <p className="text-sm text-stone-600 mb-8 leading-relaxed">
            Aún no has agregado ninguna pieza de nuestra boutique a tu selección. Explora camas ergonómicas, arneses y delicias orgánicas.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/catalog">Descubrir Colección</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight mb-8">
        Tu Bolsa de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Banner */}
          <div className="rounded-2xl border border-border/70 bg-stone-50 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              {isFreeShipping ? (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <Sparkles className="h-4 w-4" /> ¡Felicidades! Tienes Envío Gratis desbloqueado
                </span>
              ) : (
                <span className="text-stone-600">
                  Agrega <strong>{formatCurrency(amountNeeded)}</strong> más para envío gratuito de cortesía.
                </span>
              )}
              <span className="font-bold text-stone-500">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-olive transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-2xl border border-border/80 bg-card divide-y divide-border/60 overflow-hidden shadow-xs">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-sand-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-editorial text-base font-semibold hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-stone-500 mt-1">
                      {item.variantTitle} {item.size && `• Talla: ${item.size}`}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      SKU: {item.sku}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-2 sm:hidden">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl border border-border bg-stone-50 p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-stone-500 hover:text-foreground disabled:opacity-30"
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
                      className="p-1.5 text-stone-500 hover:text-foreground disabled:opacity-30"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="text-base font-bold text-foreground">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                    aria-label={`Eliminar ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-stone-500 pt-2">
            <Link
              href="/catalog"
              className="font-semibold text-olive hover:underline"
            >
              ← Continuar comprando en el catálogo
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-6 sticky top-28">
            <h2 className="font-editorial text-xl font-bold pb-2 border-b border-border/60">
              Resumen de Pedido
            </h2>

            {/* Subtotal breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cart?.totalItems || 0} productos)</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-terracotta font-medium">
                  <span>Descuento ({couponApplied.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Envío</span>
                <span className="font-semibold text-foreground">
                  {shippingFee === 0 ? "GRATIS" : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Impuestos estimados (8%)</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(estimatedTax)}
                </span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-foreground">
                <span>Total Estimado</span>
                <span className="font-editorial text-xl">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-border/60">
              <label className="block text-xs font-semibold text-stone-700">
                Cupón Promocional
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Ej. BIENVENIDA10"
                  className="flex-1 rounded-xl border border-border bg-stone-50 px-3 py-2 text-xs uppercase font-medium focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  isLoading={isApplyingCoupon}
                  className="rounded-xl px-4 text-xs font-semibold"
                >
                  Aplicar
                </Button>
              </div>
              <p className="text-[11px] text-stone-400">
                Prueba <strong>BIENVENIDA10</strong> (10% desc.) o <strong>ENVIOBOUTIQUE</strong>
              </p>
            </form>

            {/* Checkout Button */}
            <Button
              asChild
              size="lg"
              variant="accent"
              className="w-full rounded-2xl py-6 text-base font-semibold shadow-md gap-2"
            >
              <Link href="/checkout">
                Continuar al Pago
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-stone-400">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Garantía de Satisfacción 30 Días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
