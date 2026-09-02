import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productService } from "@/server/services/product.service";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await productService.getProductBySlug(slug);
    return {
      title: `${product.title} | PawAtelier Boutique`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch (e) {
    return {
      title: "Pieza de Diseño | PawAtelier",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await productService.getProductBySlug(slug);
    return <ProductDetailClient product={product} />;
  } catch (error) {
    notFound();
  }
}
