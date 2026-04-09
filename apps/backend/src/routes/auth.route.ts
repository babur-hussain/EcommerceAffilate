import { Router, Request, Response } from 'express';
import { User, UserRole } from '../models/user.model';
import { Business } from '../models/business.model';
import { hashPassword, comparePassword, generateJWT } from '../utils/auth';
import axios from 'axios';
import { kafkaProducer } from '../services/kafka.producer';
import { KAFKA_TOPICS } from '../config/kafka';


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
      return res.status(409).json({ error: 'Account already exists with this email. Please login instead.' });
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
    res.status(201).json({ 
      token, 
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
        profileImage: user.profileImage,
        referralCode: user.referralCode,
        businessId: user.businessId,
        isActive: user.isActive,
        affiliateLinks: user.affiliateLinks
      }
    });

    // Kafka: user.registered event
    void kafkaProducer.sendEvent(KAFKA_TOPICS.USER_EVENTS, 'user.registered', {
      userId: user._id.toString(),
      email: normalizedEmail,
      role: user.role,
    }, user._id.toString());
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

    // Fetch business status if user is a business user or influencer
    let businessStatus: string | undefined;
    if (user.businessId) {
      const business = await Business.findById(user.businessId).select('status').lean();
      businessStatus = business?.status;
    }

    res.json({
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
        profileImage: user.profileImage,
        referralCode: user.referralCode,
        businessId: user.businessId,
        businessStatus,
        isActive: user.isActive,
        affiliateLinks: user.affiliateLinks
      }
    });

    // Kafka: user.login event
    void kafkaProducer.sendEvent(KAFKA_TOPICS.USER_EVENTS, 'user.login', {
      userId: user._id.toString(),
      email: normalizedEmail,
      method: 'email',
    }, user._id.toString());
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});



// POST /auth/google
// Verifies Google ID Token and returns Backend JWT
router.post('/auth/google', async (req: Request, res: Response) => {

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Google ID Token is required' });
    }

    // Verify token with Google
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email, name, sub, picture } = googleRes.data;

    if (!email) {
      return res.status(400).json({ error: 'Invalid Google Token' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user
      const { randomUUID } = require('crypto');
      const passwordHash = await hashPassword(randomUUID()); // Random password for social login

      user = await User.create({
        uid: sub, // Use Google Subject ID as UID
        email: normalizedEmail,
        passwordHash,
        role: 'CUSTOMER',
        name: name || 'Google User',
        profileImage: picture,
        isActive: true
      });
    }

    // Generate JWT
    // Generate JWT
    const jwtToken = generateJWT(user);

    // Fetch business status if user has businessId
    let businessStatus: string | undefined;
    if (user.businessId) {
      const business = await Business.findById(user.businessId).select('status').lean();
      businessStatus = business?.status;
    }

    // Return same structure as login, but ensure user object has _id for Swift Codable
    res.json({
      token: jwtToken,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phoneNumber,
        referralCode: user.referralCode,
        businessId: user.businessId,
        businessStatus,
        isActive: user.isActive,
        affiliateLinks: user.affiliateLinks
      }
    });

    // Kafka: user.login event (Google)
    void kafkaProducer.sendEvent(KAFKA_TOPICS.USER_EVENTS, 'user.login', {
      userId: user._id.toString(),
      email: normalizedEmail,
      method: 'google',
      isNewUser: !user.createdAt || (Date.now() - new Date(user.createdAt).getTime()) < 5000,
    }, user._id.toString());

  } catch (error: any) {
    console.error('Google Login Error:', error.message);
    res.status(500).json({ error: 'Google Login failed', message: error.message });
  }
});

export default router;
