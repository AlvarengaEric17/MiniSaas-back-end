// src/controllers/product/CreateProductController.ts
import { Request, Response } from "express";
import { CreateProductService } from "@/services/product/CreateProductService";
import { uploadToCloudinary } from "@/config/cloudinary";

export class CreateProductController {
  async handle(req: Request, res: Response): Promise<void> {
    const companyId = req.company_id as string;
    const { name, description, price, active } = req.body;
    let imageUrl: string | undefined;

    // Upload image if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const service = new CreateProductService();
    const product = await service.execute(companyId, {
      name,
      description,
      price,
      active,
      image: imageUrl,
    });

    res.status(201).json(product);
  }
}
