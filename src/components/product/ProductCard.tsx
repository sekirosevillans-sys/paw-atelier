"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/utils";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    species: string;
    category?: { name: string; slug: string };
    brand?: { name: string; slug: string } | null;
    variants: Array<{
      id: string;
      title: string;
      price: number;
      compareAtPrice?: number | null;
      stock: number;
    }>;
    images: Array<{ url: string; altText?: string | null; isMain: boolean }>;
    avgRating?: number;
    reviewsCount?: number;
    startingPrice?: number;
    comparePrice?: number | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const mainImage =
    product.images.find((img) => img.isMain)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80";

  const secondaryImage =
    product.images[1]?.url || mainImage;

  const defaultVariant = product.variants[0];
  const startingPrice =
    product.startingPrice ?? defaultVariant?.price ?? 0;
  const comparePrice =
    product.comparePrice ?? defaultVariant?.compareAtPrice;

  const discountPercentage =
    comparePrice && comparePrice > startingPrice
      ? Math.round(((comparePrice - startingPrice) / comparePrice) * 100)
      : null;

  const isFavorite = isInWishlist(product.id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant) return;
    setIsAdding(true);
    await addItem(defaultVariant.id, 1);
    setIsAdding(false);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id, product.title);
  };

  const speciesLabels: Record<string, { label: string; variant: "amber" | "secondary" | "success" }> = {
    DOG: { label: "Perro", variant: "amber" },
    CAT: { label: "Gato", variant: "secondary" },
    SMALL_PET: { label: "Pequeños", variant: "success" },
    ALL: { label: "Universal", variant: "secondary" },
  };

  const speciesBadge = speciesLabels[product.species] || speciesLabels.DOG;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image Gallery Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-sand-100"
      >
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          <Badge variant={speciesBadge.variant} className="text-[10px] uppercase font-bold tracking-wider">
            {speciesBadge.label}
          </Badge>
          {discountPercentage && (
            <Badge variant="terracotta" className="text-[10px] font-bold">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-110 active:scale-95"
          aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-terracotta text-terracotta"
                : "text-stone-600 hover:text-terracotta"
            }`}
          />
        </button>

        {/* Quick Add overlay button on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || !defaultVariant || defaultVariant.stock <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/95 py-2.5 text-xs font-semibold text-white shadow-md backdrop-blur-xs hover:bg-olive-light transition-all active:scale-98 disabled:opacity-50"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>
              {defaultVariant?.stock > 0
                ? isAdding
                  ? "Agregando..."
                  : "Añadir a la bolsa"
                : "Agotado"}
            </span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand / Category */}
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{product.brand?.name || product.category?.name}</span>
          <RatingStars
            rating={product.avgRating ?? 5.0}
            size="sm"
            showNumber
          />
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="font-editorial text-base font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors mb-1.5"
        >
          {product.title}
        </Link>

        {/* Short Description */}
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        {/* Price & Mobile Add CTA */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">
              {formatCurrency(startingPrice)}
            </span>
            {comparePrice && comparePrice > startingPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(comparePrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || !defaultVariant || defaultVariant.stock <= 0}
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-olive text-white shadow-xs active:scale-90 disabled:opacity-50"
            aria-label="Añadir a la bolsa"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
