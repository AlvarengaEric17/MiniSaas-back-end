// src/controllers/company/DetailCompanyController.ts
import { Request, Response } from "express";
import { DetailCompanyService } from "@/services/company/DetailCompanyService";

export class DetailCompanyController {
  async handle(req: Request, res: Response): Promise<void> {
    const companyId = req.company_id as string;

    const service = new DetailCompanyService();
    const company = await service.execute(companyId);

    res.status(200).json(company);
  }
}
