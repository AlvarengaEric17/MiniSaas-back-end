// // src/services/product/UpdateProductService.ts
// import { prisma } from "@/prisma";
// import { UpdateProductInput } from "@/schemas/productSchema";

// interface UpdateProductRequest extends UpdateProductInput {
//   image?: string;
// }

// export class UpdateProductService {
//   async execute(
//     companyId: string,
//     productId: string,
//     data: UpdateProductRequest
//   ) {
//     // Verify product belongs to company
//     const product = await prisma.product.findFirst({
//       where: {
//         id: productId,
//         companyId,
//       },
//     });

//     if (!product) {
//       throw new Error("Product not found");
//     }

//     // Update product
//     const updatedProduct = await prisma.product.update({
//       where: { id: productId },
//       data: {
//         name: data.name,
//         description: data.description,
//         price: data.price,
//         active: data.active,
//         image: data.image,
//       },
//     });

//     return updatedProduct;
//   }
// }



// src/services/product/UpdateProductService.ts
import { prisma } from "@/prisma";
import { UpdateProductInput } from "@/schemas/productSchema";

interface UpdateProductRequest extends UpdateProductInput {
  image?: string;
}

export class UpdateProductService {
  async execute(
    companyId: string,
    productId: string,
    data: UpdateProductRequest
  ) {
    // Verify product belongs to company
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        companyId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Preparamos um objeto para atualização apenas com campos definidos
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    
    // Conversão explícita para Number se o preço existir
    if (data.price !== undefined) {
      updateData.price = Number(data.price);
    }

    // Conversão explícita para Boolean se o active existir
    if (data.active !== undefined) {
      updateData.active = String(data.active) === "true";
    }

    if (data.image) updateData.image = data.image;

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return updatedProduct;
  }
}