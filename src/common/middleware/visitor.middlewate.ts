import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      visitor: string;
    }
  }
}

@Injectable()
export class VisitorMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { visitor: header } = req.headers;
    req.visitor = (Array.isArray(header) ? header[0] : header) || uuid();

    return next();
  }
}
