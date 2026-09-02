"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  stock: number;
  lineTotal: number;
  image: string;
  isOutOfStock: boolean;
}

export interface CartState {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  progressToFreeShipping: number;
  amountNeededForFreeShipping: number;
}

interface CartContextType {
  cart: CartState | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Error cargando carrito:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "No se pudo agregar el producto");
        return;
      }

      setCart(data);
      setIsOpen(true);
      toast.success("Producto agregado a tu bolsa");
    } catch (err) {
      toast.error("Error al comunicarse con la tienda");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "No se pudo actualizar la cantidad");
        return;
      }

      setCart(data);
    } catch (err) {
      toast.error("Error al actualizar cantidad");
    }
  };

  const removeItem = async (variantId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });

      const data = await res.json();
      if (res.ok) {
        setCart(data);
        toast.info("Producto removido de tu bolsa");
      }
    } catch (err) {
      toast.error("Error al remover ítem");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}
