import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState; // 1=connected, 2=connecting
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ecommerceearn-backend',
    db: dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected'
  });
});

export default router;
