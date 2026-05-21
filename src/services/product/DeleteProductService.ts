// src/services/product/DeleteProductService.ts
import { prisma } from "@/prisma";

export class DeleteProductService {
  async execute(companyId: string, productId: string) {
    // Verify product belongs to company
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        companyId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    return { message: "Product deleted successfully" };
  }
}
