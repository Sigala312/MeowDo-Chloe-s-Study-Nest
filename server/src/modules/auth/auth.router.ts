import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller.js';
import { validateRequest, authenticateJWT } from '../../middleware/auth.middleware.js';
import { registerSchema, loginSchema, appleAuthSchema } from './auth.schema.js';

const router = Router();

// 1. 一般帳密 (掛載 validateRequest 中間件)
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);

// 2. Google 第三方登入
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], 
  prompt: 'select_account',session: false }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  AuthController.handleGoogleCallback
);

// 3. Apple 第三方登入 (掛載 validateRequest 中間件)
router.post('/apple', validateRequest(appleAuthSchema), AuthController.appleLogin);

// 4. 個人資料與數據 (掛載 authenticateJWT 中間件)
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;