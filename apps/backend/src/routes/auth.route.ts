import { Router, Request, Response } from 'express';
import { User, UserRole } from '../models/user.model';
import { hashPassword, comparePassword, generateJWT } from '../utils/auth';

const router = Router();

const validRoles: UserRole[] = ['ADMIN', 'BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'INFLUENCER', 'CUSTOMER'];
const isValidRole = (role: any): role is UserRole => validRoles.includes(role);

// POST /auth/register
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, name, firebaseUid } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const roleToUse: UserRole = isValidRole(role) ? role : 'CUSTOMER';

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);

    // Generate a random UID if not provided (using crypto for UUID)
    const { randomUUID } = require('crypto');
    const uid = randomUUID();

    const user = await User.create({
      uid,
      email: normalizedEmail,
      passwordHash,
      role: roleToUse,
      name,
      firebaseUid
    });

    const token = generateJWT(user);
    res.status(201).json({ token, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// POST /auth/login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.isActive || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateJWT(user);
    res.json({ token, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

export default router;
