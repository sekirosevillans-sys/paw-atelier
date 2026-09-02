"use client";

import React from "react";
import { SessionProvider } from "./SessionProvider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <MiniCartDrawer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "font-sans text-sm rounded-xl shadow-lg border border-border/80",
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
