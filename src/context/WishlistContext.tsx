"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string, title?: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("paw_wishlist");
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading wishlist:", e);
    }
  }, []);

  const toggleWishlist = (productId: string, title?: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      let updated: string[];
      if (exists) {
        updated = prev.filter((id) => id !== productId);
        toast.info(title ? `"${title}" removido de tus favoritos` : "Removido de favoritos");
      } else {
        updated = [...prev, productId];
        toast.success(title ? `"${title}" añadido a tus favoritos` : "Añadido a favoritos ❤️");
      }
      try {
        localStorage.setItem("paw_wishlist", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving wishlist:", e);
      }
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        totalWishlist: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist debe ser usado dentro de un WishlistProvider");
  }
  return context;
}
