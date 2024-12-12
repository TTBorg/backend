import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';

// In-memory token blacklist
const tokenBlacklist = new Set();

// Middleware to check for a valid token and blacklist
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  // Check if token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res.status(403).json({ error: 'Token has been invalidated. Please log in again.' });
  }

  try {
    const secret = process.env.JWT_SECRET || ''
    const decoded = jwt.verify(token, secret);
    // req.user = decoded;
    return next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Function to add a token to the blacklist (for use in the logout route)
const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

export { authMiddleware, blacklistToken };
