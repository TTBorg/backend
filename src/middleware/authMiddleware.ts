import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JsonWebTokenError, JwtPayload, Secret } from 'jsonwebtoken';
import { Admin } from '../models/adminModel';

// In-memory token blacklist
const tokenBlacklist = new Set();

export interface CustomRequest extends Request {
  token: { id: string, email?: string, role: string, pmId: string } | JwtPayload;
}

// Middleware to check for a valid token and blacklist

export function authMiddleware(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        throw new JsonWebTokenError('Token not found');
      }
      const token = (req.headers.authorization as string).split(' ')[1];
      if (tokenBlacklist.has(token)) {
        throw new JsonWebTokenError('Token has been blacklisted');
      }
      else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
        if (decoded.role !== role) {
          throw new JsonWebTokenError('You are not authorized to access this route');
        } else if (decoded.verified === false) {
          throw new JsonWebTokenError('You are not verified');
        }
        else {
          (req as CustomRequest).token = decoded;
          next();
        }

      }
    }
    catch (error: any) {
      console.log(error)
      res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    }
  }
}

// Function to add a token to the blacklist (for use in the logout route)
const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

export { blacklistToken };
