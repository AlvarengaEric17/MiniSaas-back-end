// src/middlewares/validateSchema.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Definimos o que esperamos que o Zod retorne para não usar "any" puro
interface ValidationResult {
  body?: any;
  query?: any;
  params?: any;
}

export function validateSchema(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Executa a validação no objeto contendo as partes da requisição
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as ValidationResult;

      // 1. Atualizamos o req.body (permitido pelo Express)
      if (result.body) {
        req.body = result.body;
      }

      // 2. Armazenamos query e params validados no res.locals
      // Isso evita o erro de "getter" ao tentar sobrescrever req.query/req.params diretamente
      res.locals.validatedQuery = result.query;
      res.locals.validatedParams = result.params;

      next();
    } catch (error: any) {
      // Tratamento de erros do Zod
      if (error.errors) {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}