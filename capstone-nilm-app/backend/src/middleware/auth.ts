import jwt from 'jsonwebtoken';
import { HttpError } from '../lib/httpError';

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: number;
    email?: string;
    role?: string;
  };
};

export function requireAuth(req: any, _res: any, next: any) {
  const header = req.headers?.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (!token) {
    return next(new HttpError(401, 'Missing Authorization header'));
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded: any = jwt.verify(token, secret);
    req.auth = {
      userId: parseInt(decoded.userId, 10),
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (e) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
}

