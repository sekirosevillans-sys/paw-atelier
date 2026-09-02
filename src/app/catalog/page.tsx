import React from "react";
import { prisma } from "@/lib/prisma";
import { productService } from "@/server/services/product.service";
import { CatalogClient } from "./CatalogClient";

interface CatalogPageProps {
  searchParams: Promise<{
    species?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    search?: string;
    sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "rating";
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const filters = {
    species: (params.species as any) || "ALL",
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: (params.inStockOnly as any) || undefined,
    search: params.search,
    sortBy: params.sortBy || "relevance",
    page: params.page ? Number(params.page) : 1,
    limit: 24,
  };

  const [{ products, pagination }, categories, brands] = await Promise.all([
    productService.getCatalog(filters),
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <React.Suspense fallback={<div className="container mx-auto p-12 text-xs text-stone-500">Cargando catálogo Atelier...</div>}>
      <CatalogClient
        initialProducts={products}
        categories={categories}
        brands={brands}
        pagination={pagination}
      />
    </React.Suspense>
  );
}
