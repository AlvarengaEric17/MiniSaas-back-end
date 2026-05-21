import { Request, Response } from "express";
import { prisma } from "@/prisma";

interface UpdateCompanyRequest extends Request {
  body: {
    companyId: string;
    premium: boolean;
    maxProducts?: number;
  };
}

export class UpdateCompanyPremiumController {
  async handle(req: UpdateCompanyRequest, res: Response): Promise<void> {
    try {
      const { companyId, premium, maxProducts } = req.body;

      if (!companyId) {
        res.status(400).json({ error: "Company ID is required" });
        return;
      }

      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });

      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      const updateData: any = { premium };
      if (maxProducts !== undefined) {
        updateData.maxProducts = maxProducts;
      }

      const updatedCompany = await prisma.company.update({
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

      res.status(200).json({
        success: true,
        message: `Company ${premium ? "enabled" : "disabled"} as premium`,
        data: updatedCompany
      });
    } catch (error) {
      throw error;
    }
  }
}
