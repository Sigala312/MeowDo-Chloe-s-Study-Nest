import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

export class AuthController {
  // POST /api/auth/register
  static async register(req: Request, res: Response) {
    try {
      // req.body 已通過 Zod Middleware 驗證
      const result = await AuthService.register(req.body);

      return res.status(201).json({
        message: 'User registered successfully',
        token: result.token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          level: result.user.level,
          exp: result.user.exp,
          tokens: result.user.tokens,
        },
      });
    } catch (error: any) {
      if (error.message === 'EMAIL_EXISTS') {
        return res.status(409).json({ error: 'Email has already been registered' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);

      return res.json({
        token: result.token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          level: result.user.level,
          exp: result.user.exp,
          tokens: result.user.tokens,
        },
      });
    } catch (error: any) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/auth/apple
  static async appleLogin(req: Request, res: Response) {
    try {
      const result = await AuthService.authenticateApple(req.body);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid Apple token or authentication failed' });
    }
  }

  // GET /api/auth/google/callback
  static handleGoogleCallback(req: Request, res: Response) {
    const user = req.user as { token: string };
    return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${user.token}`);
  }

  // GET /api/auth/me
  static async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await AuthService.getUserProfile(userId);
      return res.json(user);
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}