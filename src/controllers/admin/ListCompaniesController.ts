import { Request, Response } from "express";
import { prisma } from "@/prisma";

export class ListCompaniesController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const companies = await prisma.company.findMany({
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

      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      throw error;
    }
  }
}
