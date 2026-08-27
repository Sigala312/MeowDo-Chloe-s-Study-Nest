import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ZodSchema, ZodError } from 'zod';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// 通用 Zod Schema 驗證 Middleware
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          // 將原本的 error.errors 改為 error.issues
          details: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // 檢查 token 是否存在（排除 undefined）
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded as { id: string; email?: string };
      return next();
    });
  } else {
    return res.status(401).json({ error: 'Authorization token required' });
  }
};