// src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "@/routes";
import { errorHandler } from "@/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3333;

// Configuração robusta do CORS para o ambiente Codespaces
app.use(
  cors({
    origin: true, // Aceita dinamicamente a origem que faz a requisição (essencial para URLs do GitHub)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    preflightContinue: false, // O próprio pacote CORS intercepta e encerra a requisição OPTIONS
    optionsSuccessStatus: 204, // Responde ao navegador com status de sucesso 204 (No Content)
  })
);

// Parsers para o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Rotas da API
app.use(router);

// Tratamento global de erros (deve ser o último middleware)
app.use(errorHandler);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});