import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = "1h";

export interface AuthRequest extends Request {
  userId?: number;
}

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Request does not contain an access token.",
      error: "authorization_required",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      iat: number;
      exp: number;
    };

    req.userId = payload.userId;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "The token has expired.",
        error: "token_expired",
      });
    }

    return res.status(401).json({
      message: "Signature verification failed.",
      error: "invalid_token",
    });
  }
};
