import { Request, Response } from "express";
import { adminService } from "@/services/admin/AdminService";

export class ListCompaniesController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const companies = await adminService.getAllCompanies();

      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      throw error;
    }
  }
}
