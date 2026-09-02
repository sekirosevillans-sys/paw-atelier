import { prisma } from "@/lib/prisma";
import { ProductFilterInput } from "@/server/schemas/product.schema";

export class ProductRepository {
  async findMany(filters: ProductFilterInput) {
    const {
      species,
      category,
      brand,
      minPrice,
      maxPrice,
      inStockOnly,
      search,
      sortBy,
      page,
      limit,
    } = filters;

    const where: any = {
      isActive: true,
    };

    if (species && species !== "ALL") {
      where.OR = [{ species }, { species: "ALL" }];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (brand) {
      where.brand = {
        slug: brand,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined || inStockOnly) {
      where.variants = {
        some: {
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
          ...(inStockOnly && { stock: { gt: 0 } }),
        },
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price_asc") {
      orderBy = { variants: { _count: "asc" } }; // handled at app layer or sorting
    } else if (sortBy === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          variants: true,
          images: {
            orderBy: { order: "asc" },
          },
          reviews: {
            select: { rating: true },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    // Calcular rating promedio
    const enrichedProducts = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
          : 5.0;
      const startingPrice = Math.min(...p.variants.map((v) => v.price));
      const comparePrice = p.variants.find((v) => v.compareAtPrice)?.compareAtPrice;
      const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

      return {
        ...p,
        avgRating: Number(avgRating.toFixed(1)),
        reviewsCount: p.reviews.length,
        startingPrice,
        comparePrice,
        totalStock,
      };
    });

    if (sortBy === "price_asc") {
      enrichedProducts.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price_desc") {
      enrichedProducts.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "rating") {
      enrichedProducts.sort((a, b) => b.avgRating - a.avgRating);
    }

    return {
      products: enrichedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: {
          orderBy: { price: "asc" },
        },
        images: {
          orderBy: { order: "asc" },
        },
        attributes: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) return null;

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 5.0;

    return {
      ...product,
      avgRating: Number(avgRating.toFixed(1)),
      reviewsCount: product.reviews.length,
    };
  }

  async getFeatured() {
    return prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        category: true,
        brand: true,
        variants: true,
        images: { orderBy: { order: "asc" } },
        reviews: { select: { rating: true } },
      },
      take: 8,
    });
  }
}

export const productRepository = new ProductRepository();
