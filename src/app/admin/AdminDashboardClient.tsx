"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Plus,
  Edit2,
  CheckCircle2,
  Truck,
  Box,
  Check,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminDashboardClientProps {
  initialOrders: any[];
  initialProducts: any[];
  initialLowStock: any[];
  categories: any[];
  brands: any[];
}

export function AdminDashboardClient({
  initialOrders,
  initialProducts,
  initialLowStock,
  categories,
  brands,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "products">("overview");
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [lowStock, setLowStock] = useState(initialLowStock);

  // States for new product modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    species: "DOG",
    categoryId: categories[0]?.id || "",
    brandId: brands[0]?.id || "",
    basePrice: 45.0,
    variantTitle: "Estándar",
    sku: "ART-PAW-01",
    initialStock: 15,
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200",
  });

  // Filter for inventory
  const [inventorySearch, setInventorySearch] = useState("");

  // Orders update handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al actualizar pedido");
        return;
      }

      toast.success(data.message || "Pedido actualizado");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.error("Error de conexión al servidor");
    }
  };

  // Inventory stock update handler
  const handleUpdateStock = async (variantId: string, delta: number) => {
    // Find current variant
    let currentStock = 0;
    products.forEach((p) => {
      const v = p.variants?.find((item: any) => item.id === variantId);
      if (v) currentStock = v.stock;
    });

    const newStock = Math.max(0, currentStock + delta);

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock: newStock }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al modificar stock");
        return;
      }

      toast.success(`Stock ajustado: ${newStock} u.`);

      // Update local state
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          variants: p.variants?.map((v: any) =>
            v.id === variantId ? { ...v, stock: newStock } : v
          ),
        }))
      );

      // Recompute low stock
      setLowStock((prev) => {
        const filtered = prev.filter((v) => v.id !== variantId);
        if (newStock <= 5) {
          const matchedVariant = products
            .flatMap((p) => p.variants)
            .find((v: any) => v?.id === variantId);
          if (matchedVariant) {
            filtered.push({ ...matchedVariant, stock: newStock });
          }
        }
        return filtered;
      });
    } catch (err) {
      toast.error("Error al actualizar inventario");
    }
  };

  // Toggle Featured status on product
  const handleToggleFeatured = async (productId: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, featured: !currentVal }),
      });

      if (!res.ok) throw new Error("Error al modificar estado destacado");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, featured: !currentVal } : p
        )
      );
      toast.success(
        !currentVal ? "Pieza destacada en portada" : "Removida de destacados"
      );
    } catch (err) {
      toast.error("Error al cambiar destacado");
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al crear producto");
        setIsSubmitting(false);
        return;
      }

      toast.success("¡Nueva pieza artesanal añadida al catálogo!");
      setProducts((prev) => [data.product, ...prev]);
      setIsCreateModalOpen(false);
      setIsSubmitting(false);
      // Reset
      setNewProduct({
        title: "",
        description: "",
        species: "DOG",
        categoryId: categories[0]?.id || "",
        brandId: brands[0]?.id || "",
        basePrice: 45.0,
        variantTitle: "Estándar",
        sku: "ART-PAW-01",
        initialStock: 15,
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200",
      });
    } catch (err) {
      toast.error("Error al procesar registro");
      setIsSubmitting(false);
    }
  };

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalItemsSold = orders.reduce(
    (acc, o) => acc + (o.items?.reduce((sum: number, it: any) => sum + it.quantity, 0) || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-olive">
            Centro de Mando & Logística
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
            Panel de Operaciones Atelier
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="rounded-xl bg-olive text-white hover:bg-olive/90 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Pieza Artesanal</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
            <Link href="/catalog" target="_blank">
              <ExternalLink className="h-3.5 w-3.5 text-stone-500" />
              <span>Ver Tienda</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-8 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "overview"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Vista General
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <span>Gestión de Pedidos</span>
          <span className="rounded-full bg-olive/20 text-olive px-1.5 py-0.2 text-[10px] font-bold">
            {orders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === "inventory"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <span>Inventario & Stock</span>
          {lowStock.length > 0 && (
            <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-[10px] font-bold">
              {lowStock.length} alertas
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === "products"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <span>Catálogo de Piezas</span>
          <span className="rounded-full bg-stone-200 text-stone-700 px-1.5 py-0.2 text-[10px] font-bold">
            {products.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-10">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Facturación Total
                </span>
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Transacciones auditadas
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Órdenes Totales
                </span>
                <ShoppingBag className="h-5 w-5 text-olive" />
              </div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {orders.length}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                {totalItemsSold} piezas despachadas
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Piezas en Catálogo
                </span>
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {products.length}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                {products.reduce((acc, p) => acc + (p.variants?.length || 0), 0)} variantes activas
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Bajo Inventario
                </span>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {lowStock.length}
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                Variantes con ≤ 5 unidades
              </p>
            </div>
          </div>

          {/* Quick Orders & Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <h2 className="font-editorial text-xl font-bold">
                  Últimos Pedidos Recibidos
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-olive hover:underline"
                >
                  Ver todos ({orders.length}) →
                </button>
              </div>

              <div className="divide-y divide-border/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b">
                      <th className="pb-3">Nº Orden</th>
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-foreground">
                          #{o.orderNumber}
                        </td>
                        <td className="py-3 text-stone-600">
                          {o.guestEmail || "Cliente Registrado"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              o.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : o.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-foreground">
                          {formatCurrency(o.grandTotal)}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/order/${o.orderNumber}`}
                            className="font-semibold text-olive hover:underline inline-flex items-center gap-1"
                          >
                            <span>Ver</span>
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="font-editorial text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Alertas de Stock
              </h2>
              <p className="text-xs text-stone-500">
                Variantes con bajo stock que requieren reposición inmediata.
              </p>

              <div className="space-y-3 divide-y divide-border/40 pt-2">
                {lowStock.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-6">
                    Todo el inventario cuenta con existencias suficientes.
                  </p>
                ) : (
                  lowStock.slice(0, 5).map((variant: any) => (
                    <div
                      key={variant.id}
                      className="pt-3 first:pt-0 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground line-clamp-1">
                          {variant.product?.title || variant.title}
                        </p>
                        <p className="text-stone-400">
                          {variant.title} (SKU: {variant.sku})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-red-100 px-2 py-0.5 font-bold text-red-700">
                          {variant.stock} u.
                        </span>
                        <button
                          onClick={() => handleUpdateStock(variant.id, 10)}
                          className="rounded-lg border border-border bg-white px-2 py-1 text-[11px] font-semibold hover:bg-stone-100"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold">
                Gestión de Órdenes y Envíos
              </h2>
              <p className="text-xs text-stone-500">
                Supervisa el ciclo de preparación y actualiza el tracking para los clientes.
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b">
                  <th className="pb-3">Nº Pedido</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Artículos</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Estado Actual</th>
                  <th className="pb-3 text-right">Actualizar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 font-mono font-bold text-foreground">
                      #{o.orderNumber}
                    </td>
                    <td className="py-4 text-stone-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <p className="font-semibold text-stone-800">
                        {o.shippingAddress?.fullName || o.guestEmail || "Cliente"}
                      </p>
                      <p className="text-stone-400 text-[11px]">
                        {o.guestEmail || "Registrado"}
                      </p>
                    </td>
                    <td className="py-4 text-stone-600">
                      {o.items?.length || 1} producto(s)
                    </td>
                    <td className="py-4 font-bold text-foreground">
                      {formatCurrency(o.grandTotal)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          o.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "PROCESSING"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(o.id, e.target.value)
                          }
                          className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-primary"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <Link
                          href={`/order/${o.orderNumber}`}
                          className="rounded-lg border border-border p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          title="Ver detalle del pedido"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & STOCK */}
      {activeTab === "inventory" && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold">
                Control de Stock e Inventario
              </h2>
              <p className="text-xs text-stone-500">
                Ajusta las existencias en tiempo real por variante artesanal.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Buscar pieza o SKU..."
                className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="divide-y divide-border/60 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b">
                  <th className="pb-3">Pieza de Colección</th>
                  <th className="pb-3">Variante / SKU</th>
                  <th className="pb-3">Precio Base</th>
                  <th className="pb-3">Stock Actual</th>
                  <th className="pb-3 text-right">Ajuste de Unidades</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products
                  .filter(
                    (p) =>
                      !inventorySearch ||
                      p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                      p.variants?.some((v: any) =>
                        v.sku.toLowerCase().includes(inventorySearch.toLowerCase())
                      )
                  )
                  .flatMap((p) =>
                    (p.variants || []).map((variant: any) => (
                      <tr key={variant.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4">
                          <p className="font-semibold text-stone-900">{p.title}</p>
                          <p className="text-stone-400 text-[11px]">
                            {p.category?.name || "Atelier"}
                          </p>
                        </td>
                        <td className="py-4">
                          <p className="font-medium text-stone-700">{variant.title}</p>
                          <span className="font-mono text-[11px] text-stone-400">
                            {variant.sku}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-foreground">
                          {formatCurrency(variant.price || p.basePrice)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 font-bold ${
                              variant.stock <= 3
                                ? "bg-red-100 text-red-800"
                                : variant.stock <= 8
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {variant.stock} unidades
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateStock(variant.id, -1)}
                              className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold hover:bg-stone-100"
                              title="Restar 1 unidad"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleUpdateStock(variant.id, 1)}
                              className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold hover:bg-stone-100"
                              title="Añadir 1 unidad"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleUpdateStock(variant.id, 10)}
                              className="rounded-lg border border-olive/40 bg-olive/10 text-olive px-2.5 py-1 text-xs font-bold hover:bg-olive/20"
                              title="Añadir lote de 10 unidades"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS CATALOG */}
      {activeTab === "products" && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold">
                Catálogo de Productos Atelier
              </h2>
              <p className="text-xs text-stone-500">
                Gestiona la publicación, variantes y vitrina destacada de la tienda.
              </p>
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
              className="rounded-xl bg-olive text-white hover:bg-olive/90 gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Producto</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border/80 bg-white p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      {p.species === "DOG" ? "Perros" : p.species === "CAT" ? "Gatos" : "Unisex"}
                    </span>
                    <button
                      onClick={() => handleToggleFeatured(p.id, p.featured)}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        p.featured
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-stone-50 text-stone-400 border border-stone-200 hover:text-stone-700"
                      }`}
                    >
                      {p.featured ? "⭐ Destacado" : "☆ Destacar"}
                    </button>
                  </div>

                  <h3 className="font-editorial font-bold text-base text-stone-900 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 mb-4">
                    {p.description}
                  </p>
                </div>

                <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase">Precio</span>
                    <p className="font-bold text-sm text-foreground">
                      {formatCurrency(p.basePrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Ver PDP
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="font-editorial text-2xl font-bold">
                Registrar Nueva Pieza Artesanal
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Título del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  placeholder="ej. Arnés Ergonómico de Cuero Curtido al Vegetal"
                  className="w-full rounded-xl border border-border px-3 py-2 focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descripción Artesanal *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  placeholder="Describe los materiales, procedencia y confección ética..."
                  className="w-full rounded-xl border border-border px-3 py-2 focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Especie Destino
                  </label>
                  <select
                    value={newProduct.species}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, species: e.target.value })
                    }
                    className="w-full rounded-xl border border-border px-3 py-2"
                  >
                    <option value="DOG">Perros</option>
                    <option value="CAT">Gatos</option>
                    <option value="ALL">Para Ambos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, categoryId: e.target.value })
                    }
                    className="w-full rounded-xl border border-border px-3 py-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Precio Base ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={newProduct.basePrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        basePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stock Inicial *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.initialStock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        initialStock: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-border px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Variante Inicial
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.variantTitle}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, variantTitle: e.target.value })
                    }
                    placeholder="Talla M / Cognac"
                    className="w-full rounded-xl border border-border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    SKU Único *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                    placeholder="ART-PAW-09"
                    className="w-full rounded-xl border border-border px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  URL de Imagen de Portada
                </label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-border px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={newProduct.featured}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, featured: e.target.checked })
                  }
                  className="rounded border-border"
                />
                <label htmlFor="featured-check" className="font-semibold text-stone-700">
                  Destacar inmediatamente en la vitrina de la portada
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="rounded-xl bg-olive text-white hover:bg-olive/90 text-xs font-semibold px-5"
                >
                  Guardar y Publicar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
