// src/controllers/company/AuthCompanyController.ts
import { Request, Response } from "express";
import { AuthCompanyService } from "@/services/company/AuthCompanyService";
import { AuthInput } from "@/schemas/companySchema";

export class AuthCompanyController {
  async handle(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as AuthInput;

    const service = new AuthCompanyService();
    const result = await service.execute({ email, password });

    res.status(200).json(result);
  }
}
