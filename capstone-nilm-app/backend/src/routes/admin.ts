import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../lib/db';
import { HttpError } from '../lib/httpError';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

export const adminRouter = express.Router();

// All admin routes require auth + admin role
adminRouter.use(requireAuth, requireAdmin);

// ---- Users ----

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const rows = (await query(
      `SELECT u.user_id, u.user_name, u.user_email, u.user_phone, u.created_at,
              r.role_name, s.status_name
       FROM tblusers u
       JOIN tblroles r ON u.user_role_id = r.role_id
       JOIN tbluser_status s ON u.user_status_id = s.status_id
       ORDER BY u.user_id ASC`
    )) as any[];
    res.json({ users: rows });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/users', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, role, status } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      throw new HttpError(400, 'Missing required fields');
    }

    const existing = (await query('SELECT user_id FROM tblusers WHERE user_email = ?', [email])) as any[];
    if (existing.length > 0) {
      throw new HttpError(409, 'Email already registered');
    }

    const roleName = role || 'tenant';
    const roles = (await query('SELECT role_id FROM tblroles WHERE role_name = ?', [roleName])) as any[];
    if (!roles.length) throw new HttpError(400, 'Invalid role');
    const roleId = roles[0].role_id;

    const statusName = status || 'active';
    const statuses = (await query('SELECT status_id FROM tbluser_status WHERE status_name = ?', [statusName])) as any[];
    if (!statuses.length) throw new HttpError(400, 'Invalid status');
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
      `SELECT u.user_id, u.user_name, u.user_email, u.user_phone, u.created_at,
              r.role_name, s.status_name
       FROM tblusers u
       JOIN tblroles r ON u.user_role_id = r.role_id
       JOIN tbluser_status s ON u.user_status_id = s.status_id
       WHERE u.user_id = ?`,
      [userId]
    )) as any[];

    res.json({ user: rows[0] });
  } catch (e) {
    next(e);
  }
});

adminRouter.delete('/users/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    // Soft delete: mark as inactive
    const statuses = (await query('SELECT status_id FROM tbluser_status WHERE status_name = ?', ['inactive'])) as any[];
    if (!statuses.length) throw new HttpError(500, 'Inactive status not found');
    await query('UPDATE tblusers SET user_status_id = ? WHERE user_id = ?', [statuses[0].status_id, userId]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/users/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { role, status } = req.body || {};

    if (!role && !status) {
      throw new HttpError(400, 'Nothing to update');
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (role) {
      const roles = (await query('SELECT role_id FROM tblroles WHERE role_name = ?', [role])) as any[];
      if (!roles.length) throw new HttpError(400, 'Invalid role');
      updates.push('user_role_id = ?');
      params.push(roles[0].role_id);
    }

    if (status) {
      const statuses = (await query('SELECT status_id FROM tbluser_status WHERE status_name = ?', [status])) as any[];
      if (!statuses.length) throw new HttpError(400, 'Invalid status');
      updates.push('user_status_id = ?');
      params.push(statuses[0].status_id);
    }

    params.push(userId);
    await query(`UPDATE tblusers SET ${updates.join(', ')} WHERE user_id = ?`, params);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ---- Rooms ----

adminRouter.get('/rooms', async (_req, res, next) => {
  try {
    const rows = (await query(
      `SELECT r.room_id, r.room_name, r.room_rate_per_kwh, r.room_status,
              t.user_id as tenant_id, t.user_name as tenant_name, t.user_email as tenant_email,
              d.device_id, d.device_name, d.device_identifier
       FROM tblrooms r
       LEFT JOIN tblusers t ON r.room_tenant_id = t.user_id
       LEFT JOIN tbldevices d ON r.room_device_id = d.device_id
       ORDER BY r.room_id ASC`
    )) as any[];
    res.json({ rooms: rows });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/rooms', async (req, res, next) => {
  try {
    const { roomName, tenantId, deviceId, ratePerKwh, status } = req.body || {};
    if (!roomName) throw new HttpError(400, 'roomName is required');

    const result = (await query(
      `INSERT INTO tblrooms (room_name, room_tenant_id, room_device_id, room_rate_per_kwh, room_status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        roomName,
        tenantId || null,
        deviceId || null,
        ratePerKwh ?? 12.0,
        status || 'occupied',
      ]
    )) as any;

    const roomId = result.insertId;
    const rows = (await query(
      `SELECT r.room_id, r.room_name, r.room_rate_per_kwh, r.room_status,
              t.user_id as tenant_id, t.user_name as tenant_name, t.user_email as tenant_email,
              d.device_id, d.device_name, d.device_identifier
       FROM tblrooms r
       LEFT JOIN tblusers t ON r.room_tenant_id = t.user_id
       LEFT JOIN tbldevices d ON r.room_device_id = d.device_id
       WHERE r.room_id = ?`,
      [roomId]
    )) as any[];

    res.json({ room: rows[0] });
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/rooms/:roomId', async (req, res, next) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);
    const { roomName, tenantId, deviceId, ratePerKwh, status } = req.body || {};

    const updates: string[] = [];
    const params: any[] = [];

    if (roomName !== undefined) {
      updates.push('room_name = ?');
      params.push(roomName);
    }
    if (tenantId !== undefined) {
      updates.push('room_tenant_id = ?');
      params.push(tenantId || null);
    }
    if (deviceId !== undefined) {
      updates.push('room_device_id = ?');
      params.push(deviceId || null);
    }
    if (ratePerKwh !== undefined) {
      updates.push('room_rate_per_kwh = ?');
      params.push(ratePerKwh);
    }
    if (status !== undefined) {
      updates.push('room_status = ?');
      params.push(status);
    }

    if (!updates.length) throw new HttpError(400, 'Nothing to update');
    params.push(roomId);
    await query(`UPDATE tblrooms SET ${updates.join(', ')} WHERE room_id = ?`, params);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

