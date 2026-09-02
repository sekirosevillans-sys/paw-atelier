import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award } from "lucide-react";
import { productService } from "@/server/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  const featuredProducts = await productService.getFeaturedProducts();

  const speciesCategories = [
    {
      title: "Perros Nobles",
      description: "Camas viscoelásticas, collares de piel toscana y abrigos de lana merina.",
      href: "/catalog?species=DOG",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Gatos Distinguidos",
      description: "Rascadores esculturales en madera de roble y comederos cerámicos anti-reflujo.",
      href: "/catalog?species=CAT",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Pequeños Compañeros",
      description: "Casas botánicas de mimbre natural y forraje biológico alpino.",
      href: "/catalog?species=SMALL_PET",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO EDITORIAL */}
      <section className="relative overflow-hidden bg-sand-100/70 py-16 lg:py-24 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-olive/20 bg-olive/10 px-3.5 py-1 text-xs font-semibold text-olive">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Edición Primavera 2026 • Artesanía Sostenible</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                Mobiliario & accesorios de autor para compañeros{" "}
                <span className="italic font-normal text-olive">extraordinarios</span>.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Diseñamos objetos que armonizan con la estética de tu hogar y protegen la salud postural y el bienestar emocional de tu mascota. Sin plásticos efímeros, con amor duradero.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="rounded-full shadow-md gap-2"
                >
                  <Link href="/catalog">
                    Explorar Colección
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-white/80 hover:bg-white"
                >
                  <Link href="/about">Nuestra Filosofía</Link>
                </Button>
              </div>

              {/* Mini Social Proof */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/80">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Cliente satisfecho"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Cliente satisfecho"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Cliente satisfecho"
                  />
                </div>
                <div className="text-xs text-stone-600">
                  <span className="font-bold text-foreground">Más de 2,400 familias</span> han transformado el descanso de sus mascotas.
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white bg-sand-200">
                <Image
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80"
                  alt="Perro descansando en una cama de diseño PawAtelier"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="rounded-xl bg-terracotta/15 p-2.5 text-terracotta">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Certificación Ortopédica</p>
                  <p className="text-[11px] text-muted-foreground">Alivio comprobado en articulaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORÍAS POR ESPECIE */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Creado para Cada Especie
            </h2>
            <p className="text-sm text-stone-600 max-w-md">
              Cada anatomía tiene requerimientos únicos. Explora nuestras líneas dedicadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {speciesCategories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-stone-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-editorial text-2xl font-bold text-white">
                      {cat.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6 flex flex-1 flex-col justify-between">
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-olive group-hover:underline">
                    <span>Ver catálogo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COLECCIÓN DESTACADA */}
      <section className="py-16 bg-sand-50/50 border-t border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-olive mb-1 block">
                Selección de Autor
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
                Piezas Destacadas de la Colección
              </h2>
            </div>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/catalog">Ver todo el catálogo ({featuredProducts.length}+)</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  variants: product.variants,
                  images: product.images,
                  avgRating: 4.9,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. EL MANIFIESTO DE ARTESANÍA */}
      <section className="py-20 bg-olive text-sand-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-sand-200">
              Nuestro Compromiso
            </span>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold leading-tight">
              &ldquo;Rechazamos el plástico descartable. Honramos la vida de tu mascota con objetos que perduran generaciones.&rdquo;
            </h2>

            <p className="text-sm sm:text-base text-sand-200/90 leading-relaxed max-w-2xl mx-auto">
              Cada cama, comedero y arnés que sale de nuestro taller ha sido testeado por etólogos y veterinarios. Empleamos tintes vegetales libres de cromo y maderas certificadas por el FSC.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <Button
                asChild
                variant="accent"
                className="rounded-full px-8 py-6 text-base font-semibold shadow-lg"
              >
                <Link href="/about">Conocer Nuestro Taller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
