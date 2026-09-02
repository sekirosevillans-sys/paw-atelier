"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/products?limit=50");
        if (res.ok) {
          const data = await res.json();
          const filtered = data.products.filter((p: any) =>
            wishlistIds.includes(p.id)
          );
          setProducts(filtered);
        }
      } catch (e) {
        console.error("Error loading wishlist products:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  if (wishlistIds.length === 0 || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-stone-50/50 p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="font-editorial text-3xl font-bold mb-3">
            Tu Lista de Deseos está Vacía
          </h1>
          <p className="text-sm text-stone-600 mb-8 leading-relaxed">
            Guarda aquí las piezas que te enamoren haciendo clic en el icono de corazón en cada producto.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/catalog">Explorar Catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-border/80 pb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Tus Favoritos Atelier
        </h1>
        <p className="text-sm text-stone-600">
          Tienes {products.length} pieza(s) guardadas para consentir a tu compañero.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const mainImage =
            product.images?.find((img: any) => img.isMain)?.url ||
            product.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=400&q=80";

          const defaultVariant = product.variants?.[0];

          return (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-sand-100">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id, product.title)}
                  className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-terracotta shadow-xs hover:scale-110 active:scale-95 transition-all"
                  aria-label="Quitar de lista de deseos"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-editorial text-base font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors"
                  >
                    {product.title}
                  </Link>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-base font-bold text-foreground">
                    {formatCurrency(product.startingPrice || defaultVariant?.price || 0)}
                  </span>

                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => defaultVariant && addItem(defaultVariant.id, 1)}
                    className="rounded-xl text-xs gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Mover a Bolsa</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
