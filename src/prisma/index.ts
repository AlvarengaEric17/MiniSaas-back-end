// src/prisma/index.ts
import { PrismaClient } from '@prisma/client';

// Criamos uma instância simples do PrismaClient.
// O Prisma, por padrão, já sabe ler a DATABASE_URL do arquivo .env
export const prisma = new PrismaClient();