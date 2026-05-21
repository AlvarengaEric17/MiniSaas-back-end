import { Request, Response } from "express";
import { prisma } from "@/prisma";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest extends Request {
  body: {
    slug: string;
    items: CartItem[];
    customerName?: string;
    customerPhone?: string;
  };
}

export class CheckoutController {
  async handle(req: CheckoutRequest, res: Response): Promise<void> {
    try {
      const { slug, items, customerName = "Cliente", customerPhone = "" } = req.body;

      if (!slug || !items || items.length === 0) {
        res.status(400).json({ error: "Invalid cart data" });
        return;
      }

      // Get company by slug
      const company = await prisma.company.findUnique({
        where: { slug }
      });

      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      if (!company.phone) {
        res.status(400).json({ 
          error: "Company has not configured their WhatsApp phone number" 
        });
        return;
      }

      // Calculate total
      let total = 0;
      let itemsText = "📦 *Lista de Compras*\n\n";

      items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemsText += `${index + 1}. ${item.name}\n`;
        itemsText += `   💰 R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}\n\n`;
      });

      // Build WhatsApp message
      const message = `
👋 *Novo Pedido - ${company.name}*

*Cliente:* ${customerName}
${customerPhone ? `*Telefone:* ${customerPhone}` : ""}

${itemsText}

*━━━━━━━━━━━━━━━━━━━*
*TOTAL: R$ ${total.toFixed(2)}*
*━━━━━━━━━━━━━━━━━━━*

Acesse o catálogo: https://seu-dominio.com/${slug}
`.trim();

      // Generate WhatsApp link
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${company.phone}?text=${encodedMessage}`;

      res.status(200).json({
        success: true,
        message: "Checkout processed successfully",
        data: {
          companyName: company.name,
          total,
          itemsCount: items.length,
          whatsappUrl,
          whatsappPhone: company.phone
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
