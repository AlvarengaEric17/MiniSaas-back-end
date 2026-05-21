// src/services/product/ListProductsService.ts
import { prisma } from "@/prisma";

export class ListProductsService {
  async execute(companyId: string, active?: boolean) {
    const where: any = {
      companyId,
    };

    if (active !== undefined) {
      where.active = active;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return products;
  }
}
