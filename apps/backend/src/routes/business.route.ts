import { Router, Request, Response } from 'express';
import { Business } from '../models/business.model';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { logger } from '../utils/logger';
import { adminAuth } from '../config/firebaseAdmin';

console.log('📦 BUSINESS ROUTE MODULE LOADING...');

const router = Router();

console.log('📦 BUSINESS ROUTER CREATED');

// Test endpoint to verify route is accessible
router.get('/business/test', (req: Request, res: Response) => {
  console.log('✅ /business/test handler reached');
  res.json({ message: 'Business route is working!' });
});

console.log('📦 /business/test route registered');

// POST /api/business/register - Comprehensive business/seller registration
// Uses verifyFirebaseToken middleware for simpler authentication
router.post('/business/register', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    console.log('📝 Business registration request received');
    
    // Get user from middleware
    const firebaseUser = (req as any).firebaseUser;
    const user = (req as any).user;
    
    if (!firebaseUser || !user) {
      console.log('❌ No user context from middleware');
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    const firebaseUid = firebaseUser.uid;
    console.log('✅ User authenticated:', firebaseUid);

    // Extract all registration data
    const {
      accountType,
      businessIdentity,
      ownerDetails,
      addresses,
      taxLegal,
      bankDetails,
      verification,
      storeProfile,
      logistics,
      compliance,
      advanced
    } = req.body;

    // Validate required fields
    if (!accountType || !businessIdentity || !ownerDetails || !addresses || !taxLegal || !bankDetails || !storeProfile || !logistics || !compliance) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['accountType', 'businessIdentity', 'ownerDetails', 'addresses', 'taxLegal', 'bankDetails', 'storeProfile', 'logistics', 'compliance']
      });
    }

    // Check if business already exists for this user
    const existingBusiness = await Business.findOne({ firebaseUid });
    if (existingBusiness) {
      console.log('❌ Business already exists for user');
      return res.status(400).json({ error: 'Business already registered for this user' });
    }
    
    // Get the MongoDB user
    const mongoUser = await User.findById(user.id);
    if (!mongoUser) {
      console.log('❌ MongoDB user not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create business document
    console.log('📝 Creating business document...');
    const business = new Business({
      userId: mongoUser._id,
      firebaseUid,
      accountType,
      businessIdentity,
      ownerDetails,
      addresses,
      taxLegal,
      bankDetails,
      verification: verification || { isVerified: false },
      storeProfile,
      logistics,
      compliance: {
        ...compliance,
        acceptedAt: new Date()
      },
      advanced: advanced || {},
      isActive: true
    });
    
    await business.save();
    console.log('✅ Business saved to MongoDB:', business._id);
    
    // Update user role to SELLER_OWNER (for dashboard access)
    mongoUser.role = 'SELLER_OWNER';
    mongoUser.businessId = business._id.toString();
    await mongoUser.save();
    console.log('✅ User role updated to SELLER_OWNER');
    
    // Set Firebase custom claims
    try {
      await adminAuth.setCustomUserClaims(firebaseUid, {
        accountType: accountType,
        role: 'SELLER_OWNER',
        businessId: business._id.toString()
      });
      console.log('✅ Firebase custom claims set');
    } catch (claimsError: any) {
      console.error('⚠️ Failed to set custom claims:', claimsError.message);
      // Continue even if claims fail - business is registered
    }
    
    logger.info('Business registered successfully', { 
      businessId: business._id, 
      userId: mongoUser._id,
      accountType 
    });
    
    return res.status(201).json({
      success: true,
      message: 'Business registered successfully',
      business: {
        id: business._id,
        tradeName: business.businessIdentity.tradeName,
        accountType: business.accountType,
        isActive: business.isActive
      },
      user: {
        id: mongoUser._id,
        email: mongoUser.email,
        role: mongoUser.role,
        businessId: mongoUser.businessId
      }
    });
    
  } catch (error: any) {
    console.error('❌ Business registration error:', error.message);
    logger.error('Business registration error', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Business registration failed',
      details: error.message 
    });
  }
});

// POST /api/business - Create a business (owner-only). Admin bypasses restrictions.
router.post('/business', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user as { id?: string; role?: string; businessId?: string } | undefined;
    if (!authUser?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { name, legalName, gstNumber } = req.body || {};

    if (!name || !legalName) {
      return res.status(400).json({ error: 'name and legalName are required' });
    }

    // Allow only if user is not already attached to a business (unless ADMIN)
    if (authUser.role !== 'ADMIN' && authUser.businessId) {
      return res.status(400).json({ error: 'User already associated with a business' });
    }

    // Create business
    const business = await Business.create({
      name,
      legalName,
      gstNumber,
      ownerUserId: authUser.id,
      isActive: true,
    });

    // Update user to SELLER_OWNER and set businessId (unless ADMIN creating for others)
    if (authUser.role !== 'ADMIN') {
      await User.findByIdAndUpdate(
        authUser.id,
        { role: 'SELLER_OWNER', businessId: business._id },
        { new: true }
      );
    }

    res.status(201).json({ business });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create business', message: error.message });
  }
});

// GET /api/business/products - Get products for the authenticated seller's business
router.get('/business/products', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user as { id?: string; role?: string; businessId?: string } | undefined;
    if (!authUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user has a business
    if (!authUser.businessId) {
      return res.status(403).json({ error: 'No business associated with this account' });
    }

    // Find products for this business
    const products = await Product.find({ businessId: authUser.businessId })
      .populate('brand', 'name logo')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${products.length} products for business ${authUser.businessId}`);

    res.json(products);
  } catch (error: any) {
    console.error('❌ Error fetching business products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

// GET /api/business/brands - Get brands for the authenticated seller's business
router.get('/business/brands', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user as { id?: string; role?: string; businessId?: string } | undefined;
    if (!authUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!authUser.businessId) {
      return res.status(403).json({ error: 'No business associated with this account' });
    }

    const brands = await Brand.find({ businessId: authUser.businessId })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${brands.length} brands for business ${authUser.businessId}`);

    res.json(brands);
  } catch (error: any) {
    console.error('❌ Error fetching business brands:', error.message);
    res.status(500).json({ error: 'Failed to fetch brands', message: error.message });
  }
});

export default router;
