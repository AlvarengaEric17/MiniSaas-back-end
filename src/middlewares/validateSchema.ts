import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodObject } from "zod";

export const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Se o seu schema é um ZodObject que contém a chave 'body', 
    // nós extraímos apenas o que está dentro de 'body' para validar o req.body
    const schemaShape = (schema as any).shape;
    
    if (schemaShape && schemaShape.body) {
      schemaShape.body.parse(req.body);
    } else {
      // Caso não use o padrão { body: ... }, valida o req.body inteiro
      schema.parse(req.body);
    }
    
    next();
  } catch (error: any) {
    console.error("❌ Erro de Validação:", JSON.stringify(error.errors, null, 2));
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: error.errors 
    });
  }
};