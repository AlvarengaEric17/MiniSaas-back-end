import { Request, Response } from "express";
import { prisma } from "@/prisma";

interface AdminStatsRequest extends Request {
  body: {
    adminEmail?: string;
  };
}

export class AdminStatsController {
  async handle(req: AdminStatsRequest, res: Response): Promise<void> {
    try {
      const [
        totalCompanies,
        premiumCompanies,
        totalProducts,
        companiesCount
      ] = await Promise.all([
        prisma.company.count(),
        prisma.company.count({ where: { premium: true } }),
        prisma.product.count(),
        prisma.company.findMany({
          select: {
            _count: {
              select: { products: true }
            }
          }
        })
      ]);

      const stats = {
        totalCompanies,
        premiumCompanies,
        freeCompanies: totalCompanies - premiumCompanies,
        totalProducts,
        premiumPercentage: ((premiumCompanies / totalCompanies) * 100).toFixed(2) + "%"
      };

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      throw error;
    }
  }
}
