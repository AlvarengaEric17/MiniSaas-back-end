import api from "./api";

export interface AuthResponse {
  token: string;
  company: {
    id: string;
    name: string;
    email: string;
    slug: string;
    logo?: string;
    premium: boolean;
    maxProducts: number;
  };
}

export const authService = {
  async signup(name: string, email: string, password: string, slug: string) {
    const response = await api.post<AuthResponse>("/company", {
      name,
      email,
      password,
      slug,
    });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>("/session", {
      email,
      password,
    });
    return response.data;
  },

  async getMe() {
    const response = await api.get("/me");
    return response.data;
  },

  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  isAuthenticated() {
    return this.getToken() !== null;
  },
};
