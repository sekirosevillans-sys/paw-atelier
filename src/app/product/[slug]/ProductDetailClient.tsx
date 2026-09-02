"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/lib/utils";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProductDetailClientProps {
  product: any;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, isLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant selection state
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Review Form state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const selectedVariant =
    product.variants.find((v: any) => v.id === selectedVariantId) ||
    product.variants[0];

  const images = product.images || [];
  const currentImage = images[selectedImageIndex] || images[0];

  const isFavorite = isInWishlist(product.id);

  // Unique sizes and colors available
  const sizes = Array.from(
    new Set(product.variants.map((v: any) => v.size).filter(Boolean))
  ) as string[];

  const colors = Array.from(
    new Set(product.variants.map((v: any) => v.color).filter(Boolean))
  ) as string[];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    await addItem(selectedVariant.id, quantity);
    setIsAdding(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      toast.error("Por favor completa tu nombre y comentario.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          authorName: reviewerName.trim(),
          title: reviewTitle.trim() || undefined,
          comment: reviewComment.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo publicar la reseña.");
      }

      const newReview = await res.json();
      setReviewsList([newReview, ...reviewsList]);
      setIsReviewModalOpen(false);
      setReviewerName("");
      setReviewTitle("");
      setReviewComment("");
      toast.success("¡Gracias por compartir tu opinión en el Atelier!");
    } catch (err: any) {
      toast.error(err.message || "Error al enviar la reseña");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isStockLow = selectedVariant?.stock > 0 && selectedVariant?.stock <= 3;
  const isOutOfStock = selectedVariant?.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3 w-3 text-stone-400" />
        <Link href="/catalog" className="hover:text-primary transition-colors">
          Catálogo
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3 text-stone-400" />
            <Link
              href={`/catalog?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-stone-400" />
        <span className="font-semibold text-foreground truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main Grid: Gallery + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] shrink-0">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-olive shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Image */}
          <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-border/80 bg-sand-100 shadow-sm">
            <Image
              src={currentImage?.url}
              alt={currentImage?.altText || product.title}
              fill
              priority
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Favorite Floating Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.title)}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95"
              aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite
                    ? "fill-terracotta text-terracotta"
                    : "text-stone-600 hover:text-terracotta"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Buy Box & Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-olive">
              {product.brand?.name || product.category?.name}
            </span>
            <div className="flex items-center gap-2">
              <RatingStars
                rating={product.avgRating ?? 5.0}
                size="sm"
                showNumber
                reviewsCount={reviewsList.length}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-editorial text-3xl font-bold text-foreground">
              {formatCurrency(selectedVariant?.price || 0)}
            </span>
            {selectedVariant?.compareAtPrice &&
              selectedVariant.compareAtPrice > selectedVariant.price && (
                <span className="text-sm text-stone-400 line-through font-medium">
                  {formatCurrency(selectedVariant.compareAtPrice)}
                </span>
              )}
            {selectedVariant?.compareAtPrice &&
              selectedVariant.compareAtPrice > selectedVariant.price && (
                <Badge variant="terracotta" className="text-xs font-bold">
                  Ahorras{" "}
                  {formatCurrency(
                    selectedVariant.compareAtPrice - selectedVariant.price
                  )}
                </Badge>
              )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-border/60" />

          {/* Variants Selector */}
          <div className="space-y-4">
            {/* If product has multiple variants */}
            {product.variants.length > 1 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Variante Seleccionada:{" "}
                  <span className="font-normal text-stone-600">
                    {selectedVariant?.title}
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setQuantity(1);
                      }}
                      className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                        selectedVariantId === v.id
                          ? "border-olive bg-olive/5 ring-1 ring-olive font-semibold"
                          : "border-border hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-xs text-foreground truncate w-full">
                        {v.title}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-1">
                        {formatCurrency(v.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Stock Status */}
            <div className="flex items-center gap-2 pt-1">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  Temporalmente Agotado
                </span>
              ) : isStockLow ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  ¡Últimas {selectedVariant.stock} unidades en taller!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  En Stock • Listo para envío inmediato
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart CTA */}
          <div className="flex items-center gap-4 pt-2">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-xl border border-border bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-2 text-stone-500 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))
                }
                disabled={
                  quantity >= (selectedVariant?.stock || 1) || isOutOfStock
                }
                className="p-2 text-stone-500 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Main Add CTA */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock}
              isLoading={isAdding}
              size="lg"
              variant="accent"
              className="flex-1 rounded-xl py-6 text-base font-semibold shadow-md gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {isOutOfStock ? "Agotado" : "Añadir a la Bolsa"}
            </Button>
          </div>

          {/* Atelier Guarantees Box */}
          <div className="rounded-2xl border border-border/80 bg-sand-50/60 p-4 space-y-3">
            <div className="flex items-center gap-3 text-xs text-stone-700">
              <Truck className="h-4 w-4 text-olive shrink-0" />
              <span>
                <strong>Envío gratuito</strong> en órdenes superiores a $60. Entrega en 2-4 días hábiles.
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-700">
              <RotateCcw className="h-4 w-4 text-terracotta shrink-0" />
              <span>
                <strong>Prueba de 30 días en casa:</strong> si a tu mascota no le enamora, lo retiramos sin costo.
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-700">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Certificación ética:</strong> libre de tóxicos, metales pesados y tintes industriales.
              </span>
            </div>
          </div>

          {/* Accordion with Technical Specifications */}
          <Accordion type="single" collapsible defaultValue="details" className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm font-semibold">
                Detalles del Producto & Materiales
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-3 whitespace-pre-line">{product.details || product.description}</p>
                {product.attributes?.length > 0 && (
                  <dl className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                    {product.attributes.map((attr: any) => (
                      <div key={attr.id} className="py-1">
                        <dt className="text-stone-400 font-medium">{attr.name}</dt>
                        <dd className="font-semibold text-foreground">{attr.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care">
              <AccordionTrigger className="text-sm font-semibold">
                Guía de Cuidado & Limpieza
              </AccordionTrigger>
              <AccordionContent>
                Funda desmontable lavable a máquina en ciclo delicado (30°C con jabón neutro). Secado al aire libre bajo sombra. Componentes de cuero: nutrir con cera de abejas orgánica cada 6 meses.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm font-semibold">
                Políticas de Envío & Empaque Consciente
              </AccordionTrigger>
              <AccordionContent>
                Todos los pedidos se despachan en cajas de cartón kraft 100% reciclado con cintas adhesivas de papel biodegradable. Despacho prioritario rastreable desde nuestro taller.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Reviews & Social Proof Section */}
      <section className="border-t border-border/80 pt-16 mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
              Experiencias de Familias Atelier
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Opiniones auténticas de tutores que han integrado esta pieza en su hogar.
            </p>
          </div>

          {/* Write a review button modal */}
          <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2">
                <MessageSquare className="h-4 w-4" />
                Escribir Reseña
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comparte tu Experiencia</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Calificación
                  </label>
                  <RatingStars
                    rating={reviewRating}
                    interactive
                    size="lg"
                    onRate={(r) => setReviewRating(r)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Ej. Sofía & Milo"
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Título de la Reseña (Opcional)
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Ej. Calidad insuperable, mi perro no se despega"
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Comentario Detallado
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Cuéntanos cómo ha sido la experiencia de uso, la durabilidad y qué opina tu compañero..."
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isSubmittingReview}
                    className="w-full rounded-full"
                  >
                    Publicar Opinión
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews List */}
        {reviewsList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Aún no hay reseñas para esta pieza. Sé el primero en compartir tu experiencia.
            </p>
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              Sé el primero en opinar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList.map((rev: any) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-border/80 bg-stone-50/50 p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <RatingStars rating={rev.rating} size="sm" />
                    <span className="text-[11px] text-stone-400">
                      {new Date(rev.createdAt).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {rev.title && (
                    <h4 className="font-editorial text-base font-semibold mb-1">
                      {rev.title}
                    </h4>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs">
                  <div className="h-6 w-6 rounded-full bg-olive/15 text-olive flex items-center justify-center font-bold text-[10px]">
                    {rev.authorName?.charAt(0) || "U"}
                  </div>
                  <span className="font-semibold text-foreground">
                    {rev.authorName}
                  </span>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-medium">
                      <Check className="h-3 w-3" /> Comprador Verificado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
