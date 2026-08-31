import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js';
import categoryRouter from './modules/category/category.router.js';
import tagRouter from './modules/tag/tag.router.js';

// 載入環境變數
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// 1. 全域 Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. 初始化 Passport
app.use(passport.initialize());

// 3. 健康檢查路由 (Health Check)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 4. 掛載模組路由
app.use('/api/auth', authRouter);

app.use('/api/user', userRouter);

app.use('/api/category', categoryRouter);

app.use('/api/tag', tagRouter);

// 5. 處理 404 路由
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// 6. 全域錯誤處理 Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 7. 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;