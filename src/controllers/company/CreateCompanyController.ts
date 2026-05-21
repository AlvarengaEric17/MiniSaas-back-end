// src/controllers/company/CreateCompanyController.ts
import { Request, Response } from "express";
import { CreateCompanyService } from "@/services/company/CreateCompanyService";
import { CreateCompanyInput } from "@/schemas/companySchema";

export class CreateCompanyController {
  async handle(req: Request, res: Response): Promise<void> {
    const { name, email, password, slug } = req.body as CreateCompanyInput;

    const service = new CreateCompanyService();
    const company = await service.execute({ name, email, password, slug });

    res.status(201).json(company);
  }
}
