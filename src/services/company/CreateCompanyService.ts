// src/services/company/CreateCompanyService.ts
import { prisma } from "@/prisma";
import bcryptjs from "bcryptjs";
import { CreateCompanyInput } from "@/schemas/companySchema";

export class CreateCompanyService {
  async execute(data: CreateCompanyInput) {
    // Check if company already exists
    const companyExists = await prisma.company.findUnique({
      where: { email: data.email },
    });

    if (companyExists) {
      throw new Error("Company already exists");
    }

    // Check if slug is unique
    const slugExists = await prisma.company.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists) {
      throw new Error("Slug already taken");
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(data.password, 10);

    // Create company
    const company = await prisma.company.create({
      data: {
        name: data.name,
        email: data.email,
        slug: data.slug,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        logo: true,
        premium: true,
        maxProducts: true,
        createdAt: true,
      },
    });

    return company;
  }
}
