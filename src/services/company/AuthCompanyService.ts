// src/services/company/AuthCompanyService.ts
import { prisma } from "@/prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthInput } from "@/schemas/companySchema";

export class AuthCompanyService {
  async execute(data: AuthInput) {
    // Find company by email
    const company = await prisma.company.findUnique({
      where: { email: data.email },
    });

    if (!company) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const passwordMatch = await bcryptjs.compare(data.password, company.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: company.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return {
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        slug: company.slug,
        logo: company.logo,
        premium: company.premium,
        maxProducts: company.maxProducts,
      },
    };
  }
}
