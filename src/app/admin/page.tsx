import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
    redirect("/login?unauthorized=true");
  }

  const [orders, products, lowStockVariants, categories, brands] = await Promise.all([
    prisma.order.findMany({
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      include: { variants: true, category: true, images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AdminDashboardClient
      initialOrders={orders}
      initialProducts={products}
      initialLowStock={lowStockVariants}
      categories={categories}
      brands={brands}
    />
  );
}
