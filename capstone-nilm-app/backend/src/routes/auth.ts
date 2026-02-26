import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import { query } from '../lib/db';
import { HttpError } from '../lib/httpError';
import { requireAuth } from '../middleware/auth';

export const authRouter = express.Router();

function toUser(row: any) {
  const name = (row.user_name || '').toString();
  const parts = name.split(' ').filter(Boolean);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return {
    id: row.user_id.toString(),
    email: row.user_email,
    firstName,
    lastName,
    phoneNumber: row.user_phone || undefined,
    role: row.role_name,
    isActive: row.status_name === 'active',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, role } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      throw new HttpError(400, 'Missing required fields');
    }

    const existing = (await query('SELECT user_id FROM tblusers WHERE user_email = ?', [email])) as any[];
    if (existing.length > 0) {
      throw new HttpError(409, 'Email already registered');
    }

    const roleName = role || 'tenant';
    const roles = (await query('SELECT role_id FROM tblroles WHERE role_name = ?', [roleName])) as any[];
    if (roles.length === 0) throw new HttpError(400, 'Invalid role');
    const roleId = roles[0].role_id;

    const statuses = (await query('SELECT status_id FROM tbluser_status WHERE status_name = ?', ['active'])) as any[];
    if (statuses.length === 0) throw new HttpError(500, 'Missing active status seed');
    const statusId = statuses[0].status_id;

    const hashed = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`.trim();

    const result = (await query(
      `INSERT INTO tblusers (user_role_id, user_status_id, user_name, user_email, user_password, user_phone, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [roleId, statusId, fullName, email, hashed, phoneNumber || null]
    )) as any;

    const userId = result.insertId;
    const rows = (await query(
      `SELECT u.*, r.role_name, s.status_name
       FROM tblusers u
       JOIN tblroles r ON u.user_role_id = r.role_id
       JOIN tbluser_status s ON u.user_status_id = s.status_id
       WHERE u.user_id = ?`,
      [userId]
    )) as any[];

    if (rows.length === 0) throw new HttpError(500, 'Failed to create user');
    res.json({ user: toUser(rows[0]) });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw new HttpError(400, 'Missing email or password');

    const rows = (await query(
      `SELECT u.*, r.role_name, s.status_name
       FROM tblusers u
       JOIN tblroles r ON u.user_role_id = r.role_id
       JOIN tbluser_status s ON u.user_status_id = s.status_id
       WHERE u.user_email = ?`,
      [email]
    )) as any[];

    if (rows.length === 0) throw new HttpError(401, 'Invalid email or password');
    const row = rows[0];

    const ok = await bcrypt.compare(password, row.user_password);
    if (!ok) throw new HttpError(401, 'Invalid email or password');
    if (row.status_name !== 'active') throw new HttpError(403, 'Account is not active');

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign(
      { userId: row.user_id.toString(), email: row.user_email, role: row.role_name },
      secret,
      { expiresIn: '7d' }
    );

    res.json({ user: toUser(row), token });
  } catch (e) {
    next(e);
  }
});

authRouter.get('/me', requireAuth, async (req: any, res, next) => {
  try {
    const userId = req.auth.userId;
    const rows = (await query(
      `SELECT u.*, r.role_name, s.status_name
       FROM tblusers u
       JOIN tblroles r ON u.user_role_id = r.role_id
       JOIN tbluser_status s ON u.user_status_id = s.status_id
       WHERE u.user_id = ?`,
      [userId]
    )) as any[];

    if (rows.length === 0) throw new HttpError(404, 'User not found');
    res.json({ user: toUser(rows[0]) });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/reset-password', async (req, res) => {
  // Placeholder. Implement email workflow later.
  res.json({ ok: true });
});

