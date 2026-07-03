import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import convertRoutes from './routes/convert.routes.js';
import historyRoutes from './routes/history.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { success } from './utils/apiResponse.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/health', (_req, res) => {
    res.json(success({ status: 'ok', timestamp: new Date().toISOString() }));
  });

  app.use('/auth', authRoutes);
  app.use('/convert', convertRoutes);
  app.use('/history', historyRoutes);
  app.use('/subscription', subscriptionRoutes);
  app.use('/admin', adminRoutes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { message: 'Not found' } });
  });

  app.use(errorHandler);

  return app;
}
