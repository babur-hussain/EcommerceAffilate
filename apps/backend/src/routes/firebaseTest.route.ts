import express from 'express';
import { verifyFirebaseToken, verifyFirebaseTokenOptional } from '../middlewares/firebaseAuth';

const router = express.Router();

/**
 * Test route - Protected with Firebase authentication
 * Returns the authenticated user's Firebase data
 */
router.get('/protected', verifyFirebaseToken, (req, res) => {
  res.json({
    message: 'Successfully authenticated with Firebase!',
    firebaseUser: req.firebaseUser,
  });
});

/**
 * Test route - Optional Firebase authentication
 * Works for both authenticated and guest users
 */
router.get('/optional', verifyFirebaseTokenOptional, (req, res) => {
  if (req.firebaseUser) {
    res.json({
      message: 'Authenticated user',
      firebaseUser: req.firebaseUser,
    });
  } else {
    res.json({
      message: 'Guest user (no authentication)',
    });
  }
});

export default router;
