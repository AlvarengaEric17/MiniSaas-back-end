const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export interface Company {
  id: string;
  name: string;
  email: string;
  slug: string;
  premium: boolean;
  maxProducts: number;
  createdAt: string;
  _count: {
    products: number;
  };
}

export interface AdminStats {
  totalCompanies: number;
  premiumCompanies: number;
  freeCompanies: number;
  totalProducts: number;
  premiumPercentage: string;
}

export const adminService = {
  async getCompanies(adminEmail: string, adminPassword: string): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/admin/companies`, {
      method: "GET",
      headers: {
        "x-admin-email": adminEmail,
        "x-admin-password": adminPassword,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch companies");
    }

    const data = await response.json();
    return data.data;
  },

  async getStats(adminEmail: string, adminPassword: string): Promise<AdminStats> {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: {
        "x-admin-email": adminEmail,
        "x-admin-password": adminPassword,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch stats");
    }

    const data = await response.json();
    return data.data;
  },

  async updateCompanyPremium(
    companyId: string,
    premium: boolean,
    maxProducts?: number,
    adminEmail?: string,
    adminPassword?: string
  ): Promise<Company> {
    const response = await fetch(
      `${API_BASE_URL}/admin/company/${companyId}/premium`,
      {
        method: "PUT",
        headers: {
          "x-admin-email": adminEmail || "",
          "x-admin-password": adminPassword || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          premium,
          maxProducts
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update company");
    }

    const data = await response.json();
    return data.data;
  }
};
