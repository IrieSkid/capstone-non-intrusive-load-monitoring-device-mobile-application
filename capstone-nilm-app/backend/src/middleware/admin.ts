import { HttpError } from '../lib/httpError';

export function requireAdmin(req: any, _res: any, next: any) {
  const role = req.auth?.role;
  if (role !== 'admin') {
    return next(new HttpError(403, 'Admin access required'));
  }
  return next();
}

