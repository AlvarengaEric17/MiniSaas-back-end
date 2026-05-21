// import axios from "axios";

// // 1. Limpa qualquer barra no final da URL para evitar concatenação incorreta
// const cleanBaseURL = (process.env.NEXT_PUBLIC_API_URL || "https://potential-adventure-jvpjgpv6pp92544v-3333.app.github.dev").replace(/\/$/, "");

// const api = axios.create({
//   baseURL: cleanBaseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;



// src/services/api.ts
import axios from "axios";

const cleanBaseURL = (process.env.NEXT_PUBLIC_API_URL || "https://potential-adventure-jvpjgpv6pp92544v-3333.app.github.dev").replace(/\/$/, "");

const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // CERTIFIQUE-SE QUE ESTA STRING É IGUAL À QUE VOCÊ USA NO LOGIN
  const token = localStorage.getItem("token"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;