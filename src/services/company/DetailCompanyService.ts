// src/services/company/DetailCompanyService.ts
import { prisma } from "@/prisma";

export class DetailCompanyService {
  async execute(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        logo: true,
        premium: true,
        maxProducts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }
}
