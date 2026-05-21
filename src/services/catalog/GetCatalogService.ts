// src/services/catalog/GetCatalogService.ts
import { prisma } from "@/prisma";

export class GetCatalogService {
  async execute(slug: string) {
    // Get company by slug
    const company = await prisma.company.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        logo: true,
        premium: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Get only active products
    const products = await prisma.product.findMany({
      where: {
        companyId: company.id,
        active: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        createdAt: true,
      },
    });

    return {
      company,
      products,
    };
  }
}
