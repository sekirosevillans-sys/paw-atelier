"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

interface CatalogClientProps {
  initialProducts: any[];
  categories: any[];
  brands: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function CatalogClient({
  initialProducts,
  categories,
  brands,
  pagination,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [species, setSpecies] = useState(searchParams.get("species") || "ALL");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "relevance");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStockOnly") === "true"
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Actualizar URL cuando cambian los filtros
  const applyFilters = (newFilters: Record<string, string | boolean | undefined>) => {
    const params = new URLSearchParams();

    const merged = {
      species: species !== "ALL" ? species : undefined,
      category: category || undefined,
      sortBy: sortBy !== "relevance" ? sortBy : undefined,
      search: search || undefined,
      inStockOnly: inStockOnly ? "true" : undefined,
      ...newFilters,
    };

    Object.entries(merged).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== "false" && val !== "ALL") {
        params.set(key, String(val));
      }
    });

    router.push(`/catalog?${params.toString()}`);
  };

  const handleSpeciesChange = (newSpecies: string) => {
    setSpecies(newSpecies);
    applyFilters({ species: newSpecies });
  };

  const handleCategoryChange = (newCategory: string) => {
    const next = category === newCategory ? "" : newCategory;
    setCategory(next);
    applyFilters({ category: next });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    applyFilters({ sortBy: newSort });
  };

  const handleInStockToggle = (checked: boolean) => {
    setInStockOnly(checked);
    applyFilters({ inStockOnly: checked ? "true" : undefined });
  };

  const clearAllFilters = () => {
    setSpecies("ALL");
    setCategory("");
    setSortBy("relevance");
    setSearch("");
    setInStockOnly(false);
    router.push("/catalog");
  };

  const hasActiveFilters =
    species !== "ALL" || category !== "" || search !== "" || inStockOnly;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header and Title */}
      <div className="mb-8 border-b border-border/70 pb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Catálogo Atelier
        </h1>
        <p className="text-sm text-stone-600">
          Mostrando {pagination.total} piezas artesanales diseñadas para el bienestar animal.
        </p>

        {/* Species Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: "ALL", label: "Todos los Compañeros" },
            { id: "DOG", label: "Perros" },
            { id: "CAT", label: "Gatos" },
            { id: "SMALL_PET", label: "Pequeños Amigos" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSpeciesChange(item.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                species === item.id
                  ? "bg-olive text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-8">
          {/* Header Filters */}
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-editorial text-lg font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filtros
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Categorías
            </h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    category === cat.slug
                      ? "bg-stone-200 font-semibold text-foreground"
                      : "text-stone-600 hover:bg-stone-100 hover:text-foreground"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-stone-400">
                    {cat._count?.products || ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Disponibilidad
            </h4>
            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => handleInStockToggle(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>Solo piezas en stock</span>
            </label>
          </div>
        </aside>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Sorting & Mobile Filter Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
            {/* Mobile filter trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden rounded-full gap-2"
            >
              <Filter className="h-3.5 w-3.5" />
              Filtros
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-terracotta" />
              )}
            </Button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
              <label htmlFor="sortBy" className="text-xs text-stone-500 font-medium">
                Ordenar por:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="relevance">Destacados & Novedades</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificación</option>
              </select>
            </div>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-stone-400">Filtros activos:</span>
              {species !== "ALL" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
                  Especie: {species}
                  <button onClick={() => handleSpeciesChange("ALL")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
                  Categoría: {category}
                  <button onClick={() => handleCategoryChange("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
                  En Stock
                  <button onClick={() => handleInStockToggle(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {initialProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-3xl bg-stone-50/50 p-8">
              <h3 className="font-editorial text-2xl font-semibold mb-2">
                No encontramos piezas con estos filtros
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-6">
                Prueba relajando tus criterios de búsqueda o explora nuestra colección completa.
              </p>
              <Button onClick={clearAllFilters} variant="default" className="rounded-full">
                Restablecer Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xs bg-background p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <h3 className="font-editorial text-xl font-bold">Filtros</h3>
                  <button onClick={() => setIsFilterDrawerOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Categorías Mobile */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider">Categorías</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleCategoryChange(cat.slug);
                          setIsFilterDrawerOpen(false);
                        }}
                        className={`block w-full text-left rounded-lg p-2 text-xs ${
                          category === cat.slug ? "bg-stone-200 font-bold" : "text-stone-600"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full rounded-full"
                >
                  Ver Resultados
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
