"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Leaf, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido");
      return;
    }
    setIsSubscribed(true);
    toast.success("¡Bienvenido a la familia PawAtelier! Recibirás 10% en tu primera compra.");
  };

  return (
    <footer className="border-t border-border bg-stone-100/70 text-foreground">
      {/* Value Proposition Bar */}
      <div className="border-b border-border/60 bg-sand-100/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="rounded-xl bg-olive/10 p-2.5 text-olive">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Garantía Atelier 30 Días</h4>
                <p className="text-xs text-muted-foreground">Devolución sin preguntas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="rounded-xl bg-terracotta/10 p-2.5 text-terracotta">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Diseño Ergonómico Canino</h4>
                <p className="text-xs text-muted-foreground">Avalado por veterinarios</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Materiales Sostenibles</h4>
                <p className="text-xs text-muted-foreground">Textiles orgánicos y maderas FSC</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Envío de Cortesía +$60</h4>
                <p className="text-xs text-muted-foreground">Empaque reciclable premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-olive text-sand-50 font-editorial font-bold text-lg">
                P
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight">
                PawAtelier
              </span>
            </div>
            <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
              Elevando la vida cotidiana de tu mascota con mobiliario de autor, accesorios de piel curtida vegetal y nutrición orgánica gourmet.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                Únete al Círculo PawAtelier
              </h5>
              <p className="text-xs text-muted-foreground mb-3">
                Recibe invitaciones a colecciones cápsula y un 10% en tu primera orden.
              </p>
              {isSubscribed ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium">
                  ✨ ¡Gracias por suscribirte! Usa el código <strong>BIENVENIDA10</strong> en el checkout.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-olive-light transition-colors flex items-center gap-1"
                  >
                    <span>Unirme</span>
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Categorías */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Colecciones
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li>
                <Link href="/catalog?category=camas-y-descanso" className="hover:text-primary transition-colors">
                  Camas y Descanso Ortopédico
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=paseo-y-collares" className="hover:text-primary transition-colors">
                  Arneses & Correas de Piel
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=comederos-y-bebederos" className="hover:text-primary transition-colors">
                  Comederos Cerámicos
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=juguetes-de-diseno" className="hover:text-primary transition-colors">
                  Juguetes de Cuerda y Madera
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=higiene-y-spa" className="hover:text-primary transition-colors">
                  Boutique Spa & Cosmética
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Experiencia Atelier */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Experiencia
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Nuestra Filosofía
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary transition-colors">
                  Rastreo de Pedidos
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-primary transition-colors">
                  Lista de Deseos
                </Link>
              </li>
              <li>
                <Link href="/catalog?species=CAT" className="hover:text-primary transition-colors">
                  Línea Felina Exclusiva
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Atención */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Atención al Cliente
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li>
                <span className="block text-foreground font-medium">concierge@pawatelier.com</span>
              </li>
              <li>
                <span>Lunes a Sábado: 9:00 - 19:00</span>
              </li>
              <li className="pt-2">
                <span className="inline-block rounded-md bg-stone-200 px-2 py-1 text-[10px] font-semibold text-stone-700">
                  Devoluciones Gratuitas
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} PawAtelier Inc. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span>Privacidad y Cookies</span>
            <span>Términos del Servicio</span>
            <span>Declaración de Accesibilidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
