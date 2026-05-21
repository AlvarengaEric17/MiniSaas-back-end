// src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "@/routes";
import { errorHandler } from "@/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3333;

// --- CORS FORÇADO (O PRIMEIRO DA FILA) ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Libera para qualquer origem
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-email, x-admin-password");

  // Se for o método OPTIONS (preflight), retorna 200 imediatamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Mantemos o middleware do CORS para garantir a segurança no resto
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});