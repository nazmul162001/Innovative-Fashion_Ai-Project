import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[inovative-api]', err);
  const status = typeof err?.status === 'number' ? err.status : 500;
  res.status(status).json({
    error: 'server_error',
    message: status === 500 ? 'Unexpected server error' : String(err?.message ?? err),
  });
};
