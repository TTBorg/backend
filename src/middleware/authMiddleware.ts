import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JsonWebTokenError, JwtPayload, Secret } from 'jsonwebtoken';
import { Admin } from '../models/adminModel';

// In-memory token blacklist
const tokenBlacklist = new Set();

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

// Middleware to check for a valid token and blacklist
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const token = req.headers.authorization?.split(' ')[1];
      console.log(token);
      // if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        throw res.status(403).json({ error: 'Token has been invalidated. Please log in again.' });
      }
      const secret: Secret = process.env.JWT_SECRET || '';

      const decoded = <any>jwt.verify(token, secret);
      const user = await Admin.findById(decoded.id);
      if (!user?.verified_mail) {
        throw res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User is not verified' });
      }
      (req as CustomRequest).token = decoded;
      next();
    }
    else {
      res.status(401).json({ error: 'Token has been invalidated. Please log in again.' });
    }
  } catch (error: any) {
    console.log(error)
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });  
  }
};

// Function to add a token to the blacklist (for use in the logout route)
const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

export { blacklistToken };
