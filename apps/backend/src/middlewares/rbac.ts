import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/auth";
import { UserRole } from "../models/user.model";
import { adminAuth } from "../config/firebaseAdmin";
import { User } from "../models/user.model";

const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.substring("Bearer ".length);
};

const attachUser = (
  req: Request,
  payload: { sub: string; role: string; businessId?: string }
) => {
  (req as any).user = {
    id: payload.sub,
    role: payload.role,
    businessId: payload.businessId,
  };
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // If Firebase middleware already attached a user, respect it
    const existingUser = (req as any).user as
      | { id?: string; role?: string }
      | undefined;
    if (existingUser?.id && existingUser?.role) {
      return next();
    }

    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Try JWT first
    try {
      const payload = verifyJWT(token);
      attachUser(req, payload);
      return next();
    } catch (jwtError) {
      // JWT failed, try Firebase
    }

    // Try Firebase token
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!mongoUser) {
        return res.status(401).json({ error: "User not found" });
      }

      (req as any).firebaseUser = decodedToken;
      (req as any).user = {
        id: mongoUser._id.toString(),
        role: mongoUser.role,
        businessId: mongoUser.businessId?.toString(),
      };
      return next();
    } catch (firebaseError) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const requireRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      const user = (req as any).user as { role?: UserRole } | undefined;
      if (!user || !user.role || !roles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    });
  };
};

export const requireAdmin = requireRoles(["ADMIN"]);
export const requireBrand = requireRoles([
  "BUSINESS_OWNER",
  "BUSINESS_MANAGER",
  "BUSINESS_STAFF",
  "SELLER_OWNER",
  "ADMIN",
]);
// Allow any authenticated user to use cart/shopping features
export const requireCustomer = requireRoles([
  "CUSTOMER",
  "INFLUENCER",
  "BUSINESS_OWNER",
  "BUSINESS_MANAGER",
  "BUSINESS_STAFF",
  "SELLER_OWNER",
  "ADMIN",
]);
