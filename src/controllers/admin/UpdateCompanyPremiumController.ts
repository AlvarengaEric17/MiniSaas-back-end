import { Request, Response } from "express";
import { adminService } from "@/services/admin/AdminService";

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

      const updatedCompany = await adminService.updateCompanyPremium(
        companyId,
        premium,
        maxProducts
      );

      res.status(200).json({
        success: true,
        message: `Company ${premium ? "enabled" : "disabled"} as premium`,
        data: updatedCompany
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Company not found") {
        res.status(404).json({ error: "Company not found" });
      } else {
        throw error;
      }
    }
  }
}
