import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { loggerWithContext } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  (req as any).requestId = requestId;

  const child = loggerWithContext({ requestId, userId: (req as any)?.user?.id });

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    child.info({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    });
  });

  next();
};
