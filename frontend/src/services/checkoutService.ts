import { CartItem } from "@/contexts/CartContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    companyName: string;
    total: number;
    itemsCount: number;
    whatsappUrl: string;
    whatsappPhone: string;
  };
}

export const checkoutService = {
  async sendToWhatsApp(
    slug: string,
    items: CartItem[],
    customerName: string = "Cliente",
    customerPhone: string = ""
  ): Promise<CheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        slug,
        items,
        customerName,
        customerPhone
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to process checkout");
    }

    const data = await response.json();
    return data;
  }
};
