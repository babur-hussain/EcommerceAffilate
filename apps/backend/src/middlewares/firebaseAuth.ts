import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin";
import { User, UserRole } from "../models/user.model";
import { logger } from "../utils/logger";

// Extend Express Request type to include Firebase user
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: {
        uid: string;
        email?: string;
        emailVerified: boolean;
        phoneNumber?: string;
        displayName?: string;
        photoURL?: string;
        accountType?: string; // 'new' or 'convert' - stored in Firebase custom claims
      };
      user?: {
        id: string;
        role: UserRole;
        businessId?: string;
        accountType?: string;
      };
    }
  }
}

const attachUserContext = async (req: Request, decodedToken: any) => {
  req.firebaseUser = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    emailVerified: decodedToken.email_verified || false,
    phoneNumber: decodedToken.phone_number,
    displayName: decodedToken.name,
    photoURL: decodedToken.picture,
    accountType: decodedToken.accountType, // Read from Firebase custom claims
  };

  const normalizedEmail = decodedToken.email?.toLowerCase().trim();

  let user = await User.findOne({ firebaseUid: decodedToken.uid });
  if (user) {
    logger.debug({ userId: user._id }, 'User found by firebaseUid');
  } else if (normalizedEmail) {
    logger.debug({ email: normalizedEmail }, 'User not found by firebaseUid, checking email');
    user = await User.findOne({ email: normalizedEmail });
    if (user) logger.debug({ userId: user._id }, 'User found by email');
  }

  if (!user) {
    logger.info('Creating new user');
    logger.debug({ uid: decodedToken.uid, email: normalizedEmail }, 'Creating user...');
    // Use role from custom claims if available, otherwise default to CUSTOMER
    // Map legacy role names to valid enum values
    let role = decodedToken.role || "CUSTOMER";
    const roleMapping: Record<string, string> = {
      SELLER_OWNER: "BUSINESS_OWNER",
      SELLER_MANAGER: "BUSINESS_MANAGER",
      SELLER_STAFF: "BUSINESS_STAFF",
      SELLER: "BUSINESS_OWNER",
    };
    role = roleMapping[role] || role;

    // Ensure email is present
    const finalEmail = normalizedEmail || `${decodedToken.uid}@noemail.com`;

    try {
      user = await User.create({
        uid: decodedToken.uid,
        email: finalEmail,
        name: decodedToken.name || "User",
        profileImage: decodedToken.picture,
        firebaseUid: decodedToken.uid,
        role: role,
        isActive: true,
      });
      logger.info({ newUserId: user._id }, 'User created successfully');
    } catch (createError: any) {
      logger.error({ error: createError, validationErrors: createError.errors }, "❌ Failed to create user in Mongo");

      // If duplicate key error (E11000), try to find the conflicting user
      if (createError.code === 11000) {
        logger.warn("⚠️ Duplicate key error, attempting to recover...");
        // Use any found user to proceed
        user = await User.findOne({
          $or: [
            { uid: decodedToken.uid },
            { email: finalEmail },
            { firebaseUid: decodedToken.uid }
          ]
        });
        if (user) {
          logger.info({ userId: user._id }, "✅ Recovered existing user from conflict");
          // Update firebaseUid if needed
          if (!user.firebaseUid) {
            user.firebaseUid = decodedToken.uid;
            await user.save();
          }
        } else {
          throw createError;
        }
      } else {
        throw createError;
      }
    }
  } else {
    // Update existing user fields if missing
    logger.debug('Checking for user field updates');
    let updated = false;
    if (!user.firebaseUid) {
      user.firebaseUid = decodedToken.uid;
      updated = true;
    }
    if (!user.uid) {
      user.uid = decodedToken.uid;
      updated = true;
    }
    if (normalizedEmail && !user.email) {
      user.email = normalizedEmail;
      updated = true;
    }
    if (decodedToken.name && !user.name) {
      user.name = decodedToken.name;
      updated = true;
    }
    if (decodedToken.picture && !user.profileImage) {
      user.profileImage = decodedToken.picture;
      updated = true;
    }

    if (updated) {
      await user.save();
    }
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    businessId: user.businessId?.toString(),
    accountType: decodedToken.accountType, // Pass accountType from Firebase custom claims
  };
};

export { attachUserContext };

/**
 * Middleware to verify Firebase ID tokens
 * Extracts token from Authorization header and verifies using Firebase Admin SDK
 */
export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    logger.info(
      {
        authHeader: authHeader
          ? authHeader.substring(0, 30) + "..."
          : "undefined",
      },
      "verifyFirebaseToken called"
    );

    if (!authHeader) {
      logger.error("❌ No authorization header provided");
      res.status(401).json({ error: "No authorization header provided" });
      return;
    }

    // Check for Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      logger.error(
        { header: authHeader.substring(0, 20) },
        "❌ Invalid authorization header format:"
      );
      res
        .status(401)
        .json({
          error:
            "Invalid authorization header format. Expected: Bearer <token>",
        });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      logger.error("❌ No token provided after Bearer");
      res.status(401).json({ error: "No token provided" });
      return;
    }

    logger.debug(
      { tokenLength: token.length },
      'Verifying Firebase token'
    );
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    logger.debug({ uid: decodedToken.uid }, 'Token verified');

    // Attach user + firebase context
    await attachUserContext(req, decodedToken);

    next();
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === "auth/id-token-expired") {
      logger.error("❌ Token expired");
      res.status(401).json({ error: "Token expired. Please sign in again." });
      return;
    }

    if (error.code === "auth/argument-error") {
      logger.error({ message: error.message }, "❌ Invalid token format");
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    if (error.code === "auth/id-token-revoked") {
      logger.error("❌ Token revoked");
      res
        .status(401)
        .json({ error: "Token has been revoked. Please sign in again." });
      return;
    }

    // Generic error
    logger.error(
      { code: error.code, message: error.message, error },
      "❌ Firebase token verification error"
    );
    res
      .status(401)
      .json({ error: "Invalid or expired token", details: error.message });
  }
};

/**
 * Optional middleware to verify token but not fail if missing
 * Useful for routes that work for both authenticated and guest users
 */
export const verifyFirebaseTokenOptional = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const token = authHeader.substring(7);

    if (token) {
      const decodedToken = await adminAuth.verifyIdToken(token);
      await attachUserContext(req, decodedToken);
    }

    next();
  } catch (error) {
    // Silently fail and continue without authentication
    next();
  }
};
