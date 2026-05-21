import api from "./api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  active?: boolean;
  image?: File;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productService = {
  async createProduct(data: CreateProductData) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    if (data.active !== undefined) {
      formData.append("active", data.active.toString());
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post<Product>("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getProducts(active?: boolean) {
    const params: any = {};
    if (active !== undefined) {
      params.active = active.toString();
    }

    const response = await api.get<Product[]>("/products", { params });
    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductData) {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined) formData.append("price", data.price.toString());
    if (data.active !== undefined) formData.append("active", data.active.toString());
    if (data.image) formData.append("image", data.image);

    const response = await api.put<Product>(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },
};
