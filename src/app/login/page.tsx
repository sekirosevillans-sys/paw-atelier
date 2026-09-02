"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        toast.error("Credenciales inválidas. Verifica tu correo y contraseña.");
        setIsLoading(false);
        return;
      }

      toast.success("¡Bienvenido de vuelta!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error("Error al iniciar sesión.");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: "client" | "admin") => {
    if (role === "admin") {
      setEmail("admin@pawatelier.com");
      setPassword("Admin123!");
    } else {
      setEmail("cliente@ejemplo.com");
      setPassword("Cliente123!");
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/80 bg-background p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-olive text-white font-editorial font-bold text-xl mb-3">
            P
          </div>
          <h1 className="font-editorial text-2xl font-bold">Acceso Atelier</h1>
          <p className="mt-1 text-xs text-stone-400">Cargando formulario seguro...</p>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-stone-100 rounded-xl" />
          <div className="h-10 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-olive/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
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
          Acceso Atelier
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Ingresa a tu cuenta para gestionar pedidos y favoritos.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="hola@ejemplo.com"
              className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-stone-700">
              Contraseña
            </label>
          </div>
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
          <span>Iniciar Sesión</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="rounded-2xl border border-dashed border-border p-4 bg-stone-50/50 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 text-center">
          Accesos Rápidos Demo
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("client")}
            className="rounded-lg border border-border bg-white p-2 text-center text-xs font-semibold hover:bg-stone-100 transition-colors"
          >
            👤 Cliente Demo
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="rounded-lg border border-olive/30 bg-olive/5 p-2 text-center text-xs font-semibold text-olive hover:bg-olive/10 transition-colors"
          >
            🛡️ Admin Demo
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-stone-500 pt-2 border-t border-border/60">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-sand-50/40">
      <Suspense fallback={<div className="text-xs text-stone-500">Cargando acceso...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
