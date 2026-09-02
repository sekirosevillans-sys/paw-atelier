"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, refreshCart } = useCart();

  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingMethod, setShippingMethod] = useState<
    "STANDARD" | "EXPRESS" | "ECO_BOUTIQUE"
  >("STANDARD");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);

  // Test card mock states
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  useEffect(() => {
    // Generar idempotencyKey al montar el componente
    setIdempotencyKey(`idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

    // Prellenar con sesión si está logueado
    if (session?.user) {
      if (session.user.email) setEmail(session.user.email);
      if (session.user.name) setFullName(session.user.name);
    }
  }, [session]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const isFreeShipping = subtotal >= 60;

  let shippingFee = 4.99;
  if (shippingMethod === "STANDARD") {
    shippingFee = isFreeShipping ? 0.0 : 4.99;
  } else if (shippingMethod === "EXPRESS") {
    shippingFee = 9.99;
  } else if (shippingMethod === "ECO_BOUTIQUE") {
    shippingFee = 12.99;
  }

  const discountAmount = couponApplied?.discountAmount || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxTotal = Number((taxableAmount * 0.08).toFixed(2));
  const grandTotal = Number((taxableAmount + shippingFee + taxTotal).toFixed(2));

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCouponApplied({ code: data.code, discountAmount: data.discountAmount });
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !fullName || !address1 || !city || !state || !postalCode || !phone) {
      toast.error("Por favor completa todos los campos requeridos de envío.");
      return;
    }

    if (items.length === 0) {
      toast.error("Tu bolsa de compras está vacía.");
      router.push("/catalog");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        email,
        shippingAddress: {
          fullName,
          address1,
          address2: address2 || undefined,
          city,
          state,
          postalCode,
          country: "US",
          phone,
        },
        shippingMethod,
        couponCode: couponApplied?.code || undefined,
        idempotencyKey,
        paymentProvider: "STRIPE",
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar tu orden.");
      }

      await refreshCart();
      toast.success("¡Pedido confirmado con éxito!");
      router.push(`/order/${data.orderNumber}`);
    } catch (error: any) {
      toast.error(error.message || "Error al completar el pedido");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50/40 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header simple */}
        <div className="flex items-center justify-between border-b border-border/80 pb-6 mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a la Bolsa
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-olive text-white font-editorial font-bold text-sm">
              P
            </div>
            <span className="font-editorial text-xl font-bold">PawAtelier</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            <span>Pago Seguro Encriptado SSL</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Contact */}
            <div className="rounded-3xl border border-border/80 bg-background p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="font-editorial text-lg font-bold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-olive text-white text-xs">
                    1
                  </span>
                  Contacto del Tutor
                </h2>
                {!session && (
                  <Link
                    href="/login?callbackUrl=/checkout"
                    className="text-xs text-olive hover:underline font-semibold"
                  >
                    ¿Ya tienes cuenta? Inicia sesión
                  </Link>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Correo Electrónico para Confirmación y Factura *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="rounded-3xl border border-border/80 bg-background p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="font-editorial text-lg font-bold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-olive text-white text-xs">
                    2
                  </span>
                  Dirección de Entrega
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nombre Completo del Receptor *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Lucas Mendoza"
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Calle, Número y Casa/Apartamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="Avenida Los Robles 450, Depto 3B"
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ciudad"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Estado / Provincia *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Estado"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="76000"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Teléfono de Contacto para Reparto *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Method */}
            <div className="rounded-3xl border border-border/80 bg-background p-6 shadow-xs space-y-4">
              <h2 className="font-editorial text-lg font-bold flex items-center gap-2 border-b border-border/60 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-olive text-white text-xs">
                  3
                </span>
                Método de Entrega
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    shippingMethod === "STANDARD"
                      ? "border-olive bg-olive/5 ring-1 ring-olive"
                      : "border-border hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="STANDARD"
                      checked={shippingMethod === "STANDARD"}
                      onChange={() => setShippingMethod("STANDARD")}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold">Envío Estándar Atelier</p>
                      <p className="text-xs text-stone-500">Entrega en 3 a 5 días hábiles</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">
                    {isFreeShipping ? "GRATIS" : "$4.99"}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    shippingMethod === "EXPRESS"
                      ? "border-olive bg-olive/5 ring-1 ring-olive"
                      : "border-border hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="EXPRESS"
                      checked={shippingMethod === "EXPRESS"}
                      onChange={() => setShippingMethod("EXPRESS")}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold">Prioritario Exprés 48h</p>
                      <p className="text-xs text-stone-500">Despacho garantizado en 2 días</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">$9.99</span>
                </label>

                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    shippingMethod === "ECO_BOUTIQUE"
                      ? "border-olive bg-olive/5 ring-1 ring-olive"
                      : "border-border hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="ECO_BOUTIQUE"
                      checked={shippingMethod === "ECO_BOUTIQUE"}
                      onChange={() => setShippingMethod("ECO_BOUTIQUE")}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold">Entrega Eco-Boutique en Guante Blanco</p>
                      <p className="text-xs text-stone-500">Montaje de camas y empaque cero residuos</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">$12.99</span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment */}
            <div className="rounded-3xl border border-border/80 bg-background p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="font-editorial text-lg font-bold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-olive text-white text-xs">
                    4
                  </span>
                  Pago Seguro (Stripe Simulator)
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  Modo Seguro Test Activo
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-stone-50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-primary" /> Tarjeta de Crédito / Débito
                  </span>
                  <div className="flex gap-1.5">
                    <span className="rounded bg-white px-1.5 py-0.5 border text-[10px] font-bold">VISA</span>
                    <span className="rounded bg-white px-1.5 py-0.5 border text-[10px] font-bold">MC</span>
                    <span className="rounded bg-white px-1.5 py-0.5 border text-[10px] font-bold">AMEX</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                    Número de Tarjeta (Simulador de Prueba Autollenado)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    readOnly
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      readOnly
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      readOnly
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border/80 bg-background p-6 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-editorial text-xl font-bold pb-2 border-b border-border/60">
                Tu Orden ({items.length} artículos)
              </h3>

              {/* Items mini list */}
              <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-border/40">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-sand-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-foreground line-clamp-1">{item.title}</p>
                      <p className="text-stone-500">{item.variantTitle} × {item.quantity}</p>
                      <p className="font-bold text-foreground mt-0.5">{formatCurrency(item.lineTotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <div className="pt-2 border-t border-border/60">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Código de cupón"
                    className="flex-1 rounded-xl border border-border bg-stone-50 px-3 py-2 text-xs uppercase font-medium focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    size="sm"
                    className="rounded-xl text-xs"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-border/60 pt-4">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-terracotta font-medium">
                    <span>Descuento ({couponApplied.code})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Envío seleccionado</span>
                  <span className="font-semibold text-foreground">
                    {shippingFee === 0 ? "GRATIS" : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Impuestos estimados (8%)</span>
                  <span className="font-semibold text-foreground">{formatCurrency(taxTotal)}</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-foreground">
                  <span>Total a Pagar</span>
                  <span className="font-editorial text-2xl">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isProcessing || items.length === 0}
                isLoading={isProcessing}
                size="lg"
                variant="accent"
                className="w-full rounded-2xl py-6 text-base font-semibold shadow-md gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>{isProcessing ? "Confirmando Orden..." : `Pagar ${formatCurrency(grandTotal)}`}</span>
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Garantía de Satisfacción & Pago Idempotente</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
