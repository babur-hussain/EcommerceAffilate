import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/auth';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const payload = verifyJWT(token);
        (req as any).user = {
            id: payload.sub,
            role: payload.role
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const protect = authenticateToken;

export const restrictTo = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
};
