"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error creando cuenta");
      }

      toast.success("Cuenta creada exitosamente. Iniciando sesión...");

      // Iniciar sesión automáticamente
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!loginRes?.error) {
        router.push("/account");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al registrarse.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-sand-50/40">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/80 bg-background p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-olive text-white font-editorial font-bold text-xl mb-3">
              P
            </div>
            <h1 className="font-editorial text-2xl font-bold">Únete a PawAtelier</h1>
            <p className="mt-1 text-xs text-stone-400">Cargando registro seguro...</p>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-stone-100 rounded-xl" />
            <div className="h-10 bg-stone-100 rounded-xl" />
            <div className="h-10 bg-stone-100 rounded-xl" />
            <div className="h-12 bg-olive/20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-sand-50/40">
      <div
        suppressHydrationWarning
        className="w-full max-w-md space-y-8 rounded-3xl border border-border/80 bg-background p-8 shadow-sm"
      >
        <div className="text-center" suppressHydrationWarning>
          <div
            suppressHydrationWarning
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-olive text-white font-editorial font-bold text-xl mb-3"
          >
            P
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Únete a PawAtelier
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Crea tu perfil y accede a beneficios exclusivos y seguimiento de pedidos.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Mateo Valenzuela"
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mateo@ejemplo.com"
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contraseña (mínimo 8 caracteres, 1 mayúscula y 1 número)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            className="w-full rounded-xl py-6 text-sm font-semibold shadow-md gap-2 mt-2"
          >
            <span>Crear Mi Cuenta</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-border/60">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
