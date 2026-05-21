// src/controllers/product/UpdateProductController.ts
import { Request, Response } from "express";
import { UpdateProductService } from "@/services/product/UpdateProductService";
import { uploadToCloudinary } from "@/config/cloudinary";

export class UpdateProductController {
  async handle(req: Request, res: Response): Promise<void> {
    const companyId = req.company_id as string;
    const { id } = req.params;
    const { name, description, price, active } = req.body;
    let imageUrl: string | undefined;

    // Upload image if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const service = new UpdateProductService();
    const product = await service.execute(companyId, id, {
      name,
      description,
      price,
      active,
      image: imageUrl,
    });

    res.status(200).json(product);
  }
}
