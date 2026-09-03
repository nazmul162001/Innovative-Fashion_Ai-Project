import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { cartRouter } from './routes/cart';
import { healthRouter } from './routes/health';
import { productsRouter } from './routes/products';
import { errorHandler } from './middleware/errorHandler';

/**
 * Express app — ready to mount under Next.js `/api` via serverless-http later.
 * Local: `npm run server:dev` (port from PORT / 4000).
 */
export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') ?? true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.use('/health', healthRouter);
  app.use('/products', productsRouter);
  app.use('/cart', cartRouter);

  app.use(errorHandler);

  return app;
}

export type AppServer = ReturnType<typeof createServer>;
