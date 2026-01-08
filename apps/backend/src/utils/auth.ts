import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
import { env } from '../config/env';

const SALT_ROUNDS = 10;
const getJwtSecret = (): string => {
  return env.JWT_SECRET;
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateJWT = (user: Pick<IUser, '_id' | 'role'>): string => {
  const secret = getJwtSecret();
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const verifyJWT = (token: string): { sub: string; role: string } => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as { sub: string; role: string };
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring('Bearer '.length);
    const payload = verifyJWT(token);

    if (payload.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    (req as any).user = payload;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
