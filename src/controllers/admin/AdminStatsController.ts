import { Request, Response } from "express";
import { adminService } from "@/services/admin/AdminService";

interface AdminStatsRequest extends Request {
  body: {
    adminEmail?: string;
  };
}

export class AdminStatsController {
  async handle(req: AdminStatsRequest, res: Response): Promise<void> {
    try {
      const stats = await adminService.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      throw error;
    }
  }
}
