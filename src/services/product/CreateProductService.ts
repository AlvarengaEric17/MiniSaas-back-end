// src/services/product/CreateProductService.ts
import { prisma } from "@/prisma";
import { CreateProductInput } from "@/schemas/productSchema";

interface CreateProductRequest extends CreateProductInput {
  image?: string;
}

export class CreateProductService {
  async execute(companyId: string, data: CreateProductRequest) {
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { maxProducts: true, premium: true },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Check product limit
    const productCount = await prisma.product.count({
      where: { companyId },
    });

    if (productCount >= company.maxProducts && !company.premium) {
      throw new Error("Product limit reached. Upgrade to premium for more products");
    }

    // Create product
    // Realizamos a conversão explícita para garantir compatibilidade com o banco
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price), // Garante que seja Float
        image: data.image,
        // Garante que seja booleano, tratando strings "true"/"false" corretamente
        active: typeof data.active === "string" 
          ? data.active === "true" 
          : (data.active ?? true),
        companyId,
      },
    });

    return product;
  }
}