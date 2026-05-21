import { Request, Response } from "express";
import { prisma } from "@/prisma";

interface UpdatePhoneRequest extends Request {
  body: {
    phone: string;
  };
  company_id?: string;
}

export class UpdateCompanyPhoneController {
  async handle(req: UpdatePhoneRequest, res: Response): Promise<void> {
    try {
      const { phone } = req.body;
      const companyId = req.company_id;

      if (!companyId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!phone || phone.trim().length === 0) {
        res.status(400).json({ error: "Phone number is required" });
        return;
      }

      // Remove non-numeric characters except + prefix
      const cleanPhone = phone.replace(/[^\d+]/g, "");

      if (cleanPhone.length < 10) {
        res.status(400).json({ error: "Phone number must be at least 10 digits" });
        return;
      }

      const company = await prisma.company.update({
        where: { id: companyId },
        data: { phone: cleanPhone },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          slug: true
        }
      });

      res.status(200).json({
        success: true,
        message: "Phone number updated successfully",
        data: company
      });
    } catch (error) {
      throw error;
    }
  }
}
