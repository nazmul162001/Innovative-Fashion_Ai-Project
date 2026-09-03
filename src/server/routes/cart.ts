import { Router } from 'express';

export const cartRouter = Router();

/** Placeholder — server-side cart sessions later. */
cartRouter.get('/', (_req, res) => {
  res.status(501).json({
    error: 'not_implemented',
    message: 'Cart API will be wired in a later integration.',
  });
});
