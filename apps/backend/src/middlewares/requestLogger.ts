import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { loggerWithContext } from '../utils/logger';

const SLOW_REQUEST_THRESHOLD_MS = 3000;

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  (req as any).requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const child = loggerWithContext({ requestId, userId: (req as any)?.user?.id });

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const rounded = Number(durationMs.toFixed(2));

    const logData = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: rounded,
    };

    if (durationMs > SLOW_REQUEST_THRESHOLD_MS) {
      child.warn(logData, '🐌 Slow request detected');
    } else {
      child.info(logData);
    }
  });

  next();
};
