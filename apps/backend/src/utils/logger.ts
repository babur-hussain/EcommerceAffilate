import pino from 'pino';

const level = process.env.LOG_LEVEL || 'info';

export const logger = pino({
  level,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const loggerWithContext = (context: { requestId?: string; userId?: string }) => {
  return logger.child(context);
};
