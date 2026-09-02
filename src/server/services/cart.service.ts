import { prisma } from "@/lib/prisma";

export class CartService {
  async getOrCreateCart(userId?: string, sessionToken?: string) {
    if (userId) {
      // 1. Si viene también sessionToken, fusionar items del carrito de sesión al de usuario
      if (sessionToken) {
        const sessionCart = await prisma.cart.findUnique({
          where: { sessionToken },
          include: { items: true },
        });

        if (sessionCart && sessionCart.items.length > 0) {
          let userCart = await prisma.cart.findFirst({
            where: { userId, status: "ACTIVE" },
            include: { items: true },
          });

          if (!userCart) {
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId, sessionToken: null },
            });
          } else {
            for (const sItem of sessionCart.items) {
              await prisma.cartItem.upsert({
                where: {
                  cartId_variantId: {
                    cartId: userCart.id,
                    variantId: sItem.variantId,
                  },
                },
                update: { quantity: { increment: sItem.quantity } },
                create: {
                  cartId: userCart.id,
                  variantId: sItem.variantId,
                  quantity: sItem.quantity,
                },
              });
            }
            await prisma.cart.delete({ where: { id: sessionCart.id } });
          }
        }
      }

      let cart = await prisma.cart.findFirst({
        where: { userId, status: "ACTIVE" },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { where: { isMain: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId, status: "ACTIVE" },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        images: { where: { isMain: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
      return this.formatCart(cart);
    }

    if (sessionToken) {
      let cart = await prisma.cart.findUnique({
        where: { sessionToken },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { where: { isMain: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { sessionToken, status: "ACTIVE" },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        images: { where: { isMain: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
      return this.formatCart(cart);
    }

    throw new Error("SESSION_OR_USER_REQUIRED");
  }

  async addItem(cartId: string, variantId: string, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new Error("VARIANT_NOT_FOUND");
    }

    if (variant.stock <= 0) {
      throw new Error("OUT_OF_STOCK");
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
    });

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQuantity > variant.stock) {
      throw new Error(`STOCK_LIMIT_EXCEEDED: Solo quedan ${variant.stock} unidades`);
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          variantId,
          quantity: newQuantity,
        },
      });
    }

    return this.getCartById(cartId);
  }

  async updateQuantity(cartId: string, variantId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(cartId, variantId);
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) throw new Error("VARIANT_NOT_FOUND");

    if (quantity > variant.stock) {
      throw new Error(`STOCK_LIMIT_EXCEEDED: Solo quedan ${variant.stock} unidades`);
    }

    await prisma.cartItem.update({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
      data: { quantity },
    });

    return this.getCartById(cartId);
  }

  async removeItem(cartId: string, variantId: string) {
    await prisma.cartItem.deleteMany({
      where: {
        cartId,
        variantId,
      },
    });

    return this.getCartById(cartId);
  }

  async getCartById(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isMain: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) throw new Error("CART_NOT_FOUND");
    return this.formatCart(cart);
  }

  private formatCart(cart: any) {
    let subtotal = 0;
    let totalItems = 0;

    const items = (cart.items || []).map((item: any) => {
      const price = item.variant.price;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      totalItems += item.quantity;

      const mainImage =
        item.variant.product.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=400&q=80";

      return {
        id: item.id,
        variantId: item.variantId,
        productId: item.variant.productId,
        title: item.variant.product.title,
        variantTitle: item.variant.title,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        price,
        compareAtPrice: item.variant.compareAtPrice,
        quantity: item.quantity,
        stock: item.variant.stock,
        lineTotal,
        image: mainImage,
        isOutOfStock: item.variant.stock <= 0,
      };
    });

    // Envío gratis si el subtotal >= $60
    const freeShippingThreshold = 60.0;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const progressToFreeShipping = Math.min(
      100,
      Math.round((subtotal / freeShippingThreshold) * 100)
    );
    const amountNeededForFreeShipping = Math.max(
      0,
      Number((freeShippingThreshold - subtotal).toFixed(2))
    );

    return {
      id: cart.id,
      items,
      totalItems,
      subtotal: Number(subtotal.toFixed(2)),
      freeShippingThreshold,
      isFreeShipping,
      progressToFreeShipping,
      amountNeededForFreeShipping,
    };
  }
}

export const cartService = new CartService();
