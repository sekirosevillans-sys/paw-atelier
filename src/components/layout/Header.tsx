"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cart, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin =
    (session?.user as any)?.role === "ADMIN" ||
    (session?.user as any)?.role === "STAFF";

  const navLinks = [
    { label: "Perros", href: "/catalog?species=DOG" },
    { label: "Gatos", href: "/catalog?species=CAT" },
    { label: "Pequeños Amigos", href: "/catalog?species=SMALL_PET" },
    { label: "Colección Completa", href: "/catalog" },
    { label: "Sobre Nosotros", href: "/about" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all">
      {/* Top Banner */}
      <div className="bg-olive text-sand-50 px-4 py-1.5 text-center text-xs font-medium tracking-wide">
        <span>
          ✨ Envío de cortesía en órdenes superiores a $60 • Hecho éticamente para tu compañero
        </span>
      </div>

      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-foreground lg:hidden"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-olive text-sand-50 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <span className="font-editorial text-xl font-bold italic">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-2xl font-bold tracking-tight text-foreground">
                PawAtelier
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Boutique Canina & Felina
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 pl-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary font-semibold" : "text-stone-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 rounded-full p-2.5 text-stone-600 hover:bg-stone-100 hover:text-foreground transition-colors"
            aria-label="Buscar productos"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center justify-center rounded-full p-2.5 text-stone-600 hover:bg-stone-100 hover:text-foreground transition-colors"
            aria-label={`Ver favoritos (${totalWishlist} guardados)`}
          >
            <Heart className="h-5 w-5" />
            {totalWishlist > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">
                {totalWishlist}
              </span>
            )}
          </Link>

          {/* User Account / Auth */}
          {session?.user ? (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border bg-stone-50 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-stone-100 transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-olive text-white flex items-center justify-center text-[10px]">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline-block max-w-[90px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
                <ChevronDown className="h-3 w-3 text-stone-400" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-2 border-b border-border/60 text-xs">
                  <p className="font-semibold text-foreground truncate">{session.user.name}</p>
                  <p className="text-muted-foreground truncate">{session.user.email}</p>
                </div>

                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  Mis Pedidos
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-olive hover:bg-olive/10 transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Panel de Administración
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full p-2 text-stone-600 hover:bg-stone-100 hover:text-foreground transition-colors"
              aria-label="Iniciar Sesión"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline-block text-xs font-medium">
                Acceso
              </span>
            </Link>
          )}

          {/* Cart Bag Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center justify-center rounded-xl bg-olive px-3.5 py-2 text-sand-50 hover:bg-olive-light transition-all active:scale-95 shadow-sm"
            aria-label={`Bolsa de compras con ${cart?.totalItems || 0} productos`}
          >
            <ShoppingBag className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-bold">{cart?.totalItems || 0}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-border bg-stone-50 px-4 py-3 sm:px-6">
          <form
            onSubmit={handleSearchSubmit}
            className="container mx-auto max-w-2xl flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cama ortopédica, arnés de cuero, premios orgánicos..."
                autoFocus
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-olive-light"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-xl p-2 text-stone-500 hover:bg-stone-200"
              aria-label="Cerrar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-6 lg:hidden shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-foreground hover:text-primary transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4">
              {session?.user ? (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-stone-700"
                  >
                    <User className="h-4 w-4" /> Mi Cuenta & Pedidos
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-semibold text-olive"
                    >
                      <ShieldCheck className="h-4 w-4" /> Panel de Administración
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 pt-2"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
                >
                  Iniciar Sesión / Registrarse
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
