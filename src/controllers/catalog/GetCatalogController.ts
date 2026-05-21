// src/controllers/catalog/GetCatalogController.ts
import { Request, Response } from "express";
import { GetCatalogService } from "@/services/catalog/GetCatalogService";

export class GetCatalogController {
  async handle(req: Request, res: Response): Promise<Response | void> {
    // Tratamos o slug garantindo que seja uma string única
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    // 1. Validação defensiva
    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    try {
      const service = new GetCatalogService();
      
      // O TypeScript agora aceita 'slug' pois garantimos que é do tipo 'string'
      const catalog = await service.execute(slug);

      return res.status(200).json(catalog);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}