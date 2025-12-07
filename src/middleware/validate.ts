import type { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        issues: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
