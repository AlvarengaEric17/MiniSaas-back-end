// src/controllers/catalog/GetCatalogController.ts
import { Request, Response } from "express";
import { GetCatalogService } from "@/services/catalog/GetCatalogService";

export class GetCatalogController {
  async handle(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;

    const service = new GetCatalogService();
    const catalog = await service.execute(slug);

    res.status(200).json(catalog);
  }
}
