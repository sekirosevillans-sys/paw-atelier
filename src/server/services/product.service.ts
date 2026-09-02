import { productRepository } from "@/server/repositories/product.repository";
import { ProductFilterInput } from "@/server/schemas/product.schema";

export class ProductService {
  async getCatalog(filters: ProductFilterInput) {
    return productRepository.findMany(filters);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    return product;
  }

  async getFeaturedProducts() {
    return productRepository.getFeatured();
  }
}

export const productService = new ProductService();
