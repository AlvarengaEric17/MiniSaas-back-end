// src/controllers/product/ListProductsController.ts
import { Request, Response } from "express";
import { ListProductsService } from "@/services/product/ListProductsService";

export class ListProductsController {
  async handle(req: Request, res: Response): Promise<void> {
    const companyId = req.company_id as string;
    const { active } = req.query;

    let activeFilter: boolean | undefined;
    if (active === "true") activeFilter = true;
    if (active === "false") activeFilter = false;

    const service = new ListProductsService();
    const products = await service.execute(companyId, activeFilter);

    res.status(200).json(products);
  }
}
