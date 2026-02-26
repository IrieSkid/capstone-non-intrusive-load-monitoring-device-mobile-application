import express from 'express';
import { query } from '../lib/db';
import { HttpError } from '../lib/httpError';
import { requireAuth } from '../middleware/auth';

export const usersRouter = express.Router();

function assertSelf(req: any, userIdParam: string) {
  const userId = parseInt(userIdParam, 10);
  if (!req.auth?.userId || req.auth.userId !== userId) {
    throw new HttpError(403, 'Forbidden');
  }
  return userId;
}

usersRouter.get('/:userId', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const rows = (await query(
      `SELECT u.*, r.role_name, s.status_name
       FROM tblusers u
       JOIN tblroles r ON u.user_role_id = r.role_id
       JOIN tbluser_status s ON u.user_status_id = s.status_id
       WHERE u.user_id = ?`,
      [userId]
    )) as any[];
    if (rows.length === 0) throw new HttpError(404, 'User not found');
    res.json({ user: rows[0] });
  } catch (e) {
    next(e);
  }
});

usersRouter.put('/:userId', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const { firstName, lastName, phoneNumber } = req.body || {};

    const updates: string[] = [];
    const params: any[] = [];

    if (firstName !== undefined || lastName !== undefined) {
      // Pull current name to merge safely
      const rows = (await query('SELECT user_name FROM tblusers WHERE user_id = ?', [userId])) as any[];
      const current = rows[0]?.user_name?.toString() || '';
      const parts = current.split(' ').filter(Boolean);
      const currentFirst = parts[0] || '';
      const currentLast = parts.slice(1).join(' ') || '';
      const newName = `${firstName ?? currentFirst} ${lastName ?? currentLast}`.trim();
      updates.push('user_name = ?');
      params.push(newName);
    }

    if (phoneNumber !== undefined) {
      updates.push('user_phone = ?');
      params.push(phoneNumber || null);
    }

    if (updates.length === 0) {
      res.json({ ok: true });
      return;
    }

    params.push(userId);
    await query(`UPDATE tblusers SET ${updates.join(', ')} WHERE user_id = ?`, params);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Devices for a user (linked via rooms)
usersRouter.get('/:userId/devices', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const rows = (await query(
      `SELECT d.*, r.room_tenant_id as user_id
       FROM tbldevices d
       LEFT JOIN tblrooms r ON d.device_id = r.room_device_id
       WHERE r.room_tenant_id = ?`,
      [userId]
    )) as any[];
    res.json({ devices: rows });
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/:userId/devices', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const { name, macAddress } = req.body || {};
    if (!name || !macAddress) throw new HttpError(400, 'Missing device name or macAddress');

    const result = (await query(
      `INSERT INTO tbldevices (device_name, device_identifier, device_status, device_last_seen, created_at)
       VALUES (?, ?, 'online', NOW(), NOW())`,
      [name, macAddress]
    )) as any;

    const deviceId = result.insertId;

    // Ensure a room exists linking this user and device
    const existingRoom = (await query('SELECT room_id FROM tblrooms WHERE room_tenant_id = ? LIMIT 1', [userId])) as any[];
    if (existingRoom.length === 0) {
      await query(
        `INSERT INTO tblrooms (room_name, room_tenant_id, room_device_id, room_rate_per_kwh, room_status)
         VALUES (?, ?, ?, 12.00, 'occupied')`,
        [`Room ${deviceId}`, userId, deviceId]
      );
    } else {
      await query('UPDATE tblrooms SET room_device_id = ? WHERE room_id = ?', [deviceId, existingRoom[0].room_id]);
    }

    const rows = (await query('SELECT * FROM tbldevices WHERE device_id = ?', [deviceId])) as any[];
    res.json({ device: rows[0] });
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/:userId/devices/mock', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const name = 'Smart Energy Monitor';
    const macAddress = `MOCK-${Date.now()}`;

    const result = (await query(
      `INSERT INTO tbldevices (device_name, device_identifier, device_status, device_last_seen, created_at)
       VALUES (?, ?, 'online', NOW(), NOW())`,
      [name, macAddress]
    )) as any;
    const deviceId = result.insertId;

    // Create/link room
    const existingRoom = (await query('SELECT room_id FROM tblrooms WHERE room_tenant_id = ? LIMIT 1', [userId])) as any[];
    if (existingRoom.length === 0) {
      await query(
        `INSERT INTO tblrooms (room_name, room_tenant_id, room_device_id, room_rate_per_kwh, room_status)
         VALUES (?, ?, ?, 12.00, 'occupied')`,
        [`Room ${deviceId}`, userId, deviceId]
      );
    } else {
      await query('UPDATE tblrooms SET room_device_id = ? WHERE room_id = ?', [deviceId, existingRoom[0].room_id]);
    }

    const rows = (await query('SELECT * FROM tbldevices WHERE device_id = ?', [deviceId])) as any[];
    res.json({ device: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Appliances for a user (via tblappliances)
usersRouter.get('/:userId/appliances', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const rows = (await query(
      `SELECT a.appliance_id, a.appliance_user_id, a.appliance_device_id, a.appliance_type_id,
              COALESCE(a.appliance_custom_name, t.appliance_type_name) as name,
              c.category_name as category,
              t.appliance_type_typical_power_w as ratedPower,
              a.appliance_icon as icon,
              a.appliance_port_number as portNumber,
              a.appliance_is_active as isActive,
              a.appliance_usage_minutes as usageMinutes,
              a.appliance_last_detected as lastDetected,
              a.created_at, a.updated_at
       FROM tblappliances a
       JOIN tblappliance_types t ON a.appliance_type_id = t.appliance_type_id
       JOIN tblappliance_categories c ON t.appliance_type_category_id = c.category_id
       WHERE a.appliance_user_id = ?
       ORDER BY a.appliance_id DESC`,
      [userId]
    )) as any[];
    res.json({ appliances: rows });
  } catch (e) {
    next(e);
  }
});

// Alerts for a user
usersRouter.get('/:userId/alerts', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const rooms = (await query('SELECT room_id FROM tblrooms WHERE room_tenant_id = ?', [userId])) as any[];
    const roomIds = rooms.map(r => r.room_id);
    if (roomIds.length === 0) return res.json({ alerts: [] });

    const rows = (await query(
      `SELECT * FROM tblalerts
       WHERE alert_room_id IN (${roomIds.map(() => '?').join(',')})
       ORDER BY created_at DESC`,
      roomIds
    )) as any[];
    res.json({ alerts: rows });
  } catch (e) {
    next(e);
  }
});

usersRouter.get('/:userId/rate', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const rooms = (await query('SELECT room_rate_per_kwh FROM tblrooms WHERE room_tenant_id = ? LIMIT 1', [userId])) as any[];
    if (rooms.length > 0) {
      return res.json({ ratePerKwh: parseFloat(rooms[0].room_rate_per_kwh) || 12.0, currency: 'PHP' });
    }
    const settings = (await query(
      `SELECT setting_value FROM tblsystem_settings WHERE setting_key = 'default_rate_per_kwh'`
    )) as any[];
    const rate = settings.length > 0 ? parseFloat(settings[0].setting_value) || 12.0 : 12.0;
    res.json({ ratePerKwh: rate, currency: 'PHP' });
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/:userId/rate', requireAuth, async (req: any, res, next) => {
  try {
    const userId = assertSelf(req, req.params.userId);
    const { ratePerKwh } = req.body || {};
    if (ratePerKwh === undefined) throw new HttpError(400, 'Missing ratePerKwh');

    const rooms = (await query('SELECT room_id FROM tblrooms WHERE room_tenant_id = ? LIMIT 1', [userId])) as any[];
    if (rooms.length === 0) throw new HttpError(404, 'Room not found for user');
    await query('UPDATE tblrooms SET room_rate_per_kwh = ? WHERE room_id = ?', [ratePerKwh, rooms[0].room_id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

