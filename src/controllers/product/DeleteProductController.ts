// src/controllers/product/DeleteProductController.ts
import { Request, Response } from "express";
import { DeleteProductService } from "@/services/product/DeleteProductService";

export class DeleteProductController {
  async handle(req: Request, res: Response): Promise<void> {
    const companyId = req.company_id as string;
    const { id } = req.params;

    const service = new DeleteProductService();
    const result = await service.execute(companyId, id);

    res.status(200).json(result);
  }
}
