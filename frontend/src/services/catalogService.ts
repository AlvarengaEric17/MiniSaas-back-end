import api from "./api";

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  createdAt: string;
}

export interface Catalog {
  company: {
    id: string;
    name: string;
    email: string;
    slug: string;
    logo?: string;
    premium: boolean;
  };
  products: CatalogProduct[];
}

export const catalogService = {
  async getCatalog(slug: string) {
    // This route doesn't need authentication
    const response = await api.get<Catalog>(`/catalog/${slug}`);
    return response.data;
  },
};
