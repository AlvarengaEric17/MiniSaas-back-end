import { prisma } from "@/prisma";

export class AdminService {
  async getAllCompanies() {
    return await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        premium: true,
        maxProducts: true,
        createdAt: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getCompanyById(companyId: string) {
    return await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        premium: true,
        maxProducts: true,
        createdAt: true,
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async updateCompanyPremium(
    companyId: string,
    premium: boolean,
    maxProducts?: number
  ) {
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const updateData: any = { premium };
    if (maxProducts !== undefined) {
      updateData.maxProducts = maxProducts;
    }

    return await prisma.company.update({
      where: { id: companyId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        premium: true,
        maxProducts: true,
        createdAt: true,
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async getStats() {
    const [
      totalCompanies,
      premiumCompanies,
      totalProducts
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { premium: true } }),
      prisma.product.count()
    ]);

    return {
      totalCompanies,
      premiumCompanies,
      freeCompanies: totalCompanies - premiumCompanies,
      totalProducts,
      premiumPercentage: totalCompanies > 0 
        ? ((premiumCompanies / totalCompanies) * 100).toFixed(2) + "%"
        : "0%"
    };
  }
}

export const adminService = new AdminService();
