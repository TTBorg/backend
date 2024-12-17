import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import { StatusCodes } from 'http-status-codes';

export function verifiedMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req);
      next();
    } catch (error) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  };
}