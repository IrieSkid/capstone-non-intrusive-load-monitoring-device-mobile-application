import express from 'express';
import { query } from '../lib/db';
import { HttpError } from '../lib/httpError';
import { requireAuth } from '../middleware/auth';

export const devicesRouter = express.Router();

devicesRouter.get('/:deviceId', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const rows = (await query('SELECT * FROM tbldevices WHERE device_id = ?', [deviceId])) as any[];
    if (rows.length === 0) throw new HttpError(404, 'Device not found');
    res.json({ device: rows[0] });
  } catch (e) {
    next(e);
  }
});

devicesRouter.patch('/:deviceId', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const { name, macAddress, isOnline } = req.body || {};

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push('device_name = ?');
      params.push(name);
    }
    if (macAddress !== undefined) {
      updates.push('device_identifier = ?');
      params.push(macAddress);
    }
    if (isOnline !== undefined) {
      updates.push('device_status = ?');
      params.push(isOnline ? 'online' : 'offline');
      updates.push('device_last_seen = NOW()');
    }

    if (updates.length === 0) return res.json({ ok: true });
    params.push(deviceId);
    await query(`UPDATE tbldevices SET ${updates.join(', ')} WHERE device_id = ?`, params);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

devicesRouter.delete('/:deviceId', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    await query('DELETE FROM tbldevices WHERE device_id = ?', [deviceId]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Get appliances for a device
devicesRouter.get('/:deviceId/appliances', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
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
       WHERE a.appliance_device_id = ?
       ORDER BY a.appliance_id DESC`,
      [deviceId]
    )) as any[];
    res.json({ appliances: rows });
  } catch (e) {
    next(e);
  }
});

// Add appliance for device
devicesRouter.post('/:deviceId/appliances', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const { userId, name, category, ratedPower, icon, portNumber, isActive } = req.body || {};
    if (!userId || !name || !category) throw new HttpError(400, 'Missing appliance fields');

    // category
    const cats = (await query('SELECT category_id FROM tblappliance_categories WHERE category_name = ?', [category])) as any[];
    let categoryId = cats[0]?.category_id;
    if (!categoryId) {
      const r = (await query('INSERT INTO tblappliance_categories (category_name) VALUES (?)', [category])) as any;
      categoryId = r.insertId;
    }

    // type
    const types = (await query('SELECT appliance_type_id FROM tblappliance_types WHERE appliance_type_name = ?', [name])) as any[];
    let typeId = types[0]?.appliance_type_id;
    if (!typeId) {
      const r = (await query(
        `INSERT INTO tblappliance_types
         (appliance_type_category_id, appliance_type_name, appliance_type_typical_power_w, appliance_type_power_factor,
          appliance_type_nominal_frequency_hz, appliance_type_frequency_tolerance, appliance_type_power_pattern)
         VALUES (?, ?, ?, 0.9, 60.0, 0.5, 'constant')`,
        [categoryId, name, ratedPower ?? 0]
      )) as any;
      typeId = r.insertId;
    }

    const r2 = (await query(
      `INSERT INTO tblappliances
       (appliance_user_id, appliance_device_id, appliance_type_id, appliance_custom_name, appliance_icon, appliance_port_number,
        appliance_is_active, appliance_usage_minutes, appliance_last_detected, created_at, updated_at)
       VALUES (?, ?, ?, NULL, ?, ?, ?, 0, NULL, NOW(), NOW())`,
      [parseInt(userId, 10), deviceId, typeId, icon || '⚡', portNumber || null, isActive ? 1 : 0]
    )) as any;

    const applianceId = r2.insertId;
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
       WHERE a.appliance_id = ?`,
      [applianceId]
    )) as any[];

    res.json({ appliance: rows[0] });
  } catch (e) {
    next(e);
  }
});

devicesRouter.post('/:deviceId/appliances/defaults', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const { userId } = req.body || {};
    if (!userId) throw new HttpError(400, 'Missing userId');

    const defaults = [
      { name: 'Air Conditioner', category: 'Cooling', ratedPower: 1500, icon: '❄️', portNumber: 1 },
      { name: 'Refrigerator', category: 'Kitchen', ratedPower: 150, icon: '🧊', portNumber: 2 },
      { name: 'Electric Fan', category: 'Cooling', ratedPower: 75, icon: '🌀', portNumber: 3 },
      { name: 'LED TV', category: 'Entertainment', ratedPower: 120, icon: '📺', portNumber: 4 },
      { name: 'Rice Cooker', category: 'Kitchen', ratedPower: 700, icon: '🍚', portNumber: 5 },
      { name: 'Computer', category: 'Computing', ratedPower: 200, icon: '💻', portNumber: 6 },
      { name: 'Lights', category: 'Lighting', ratedPower: 60, icon: '💡', portNumber: 7 },
    ];

    const created: any[] = [];
    for (const d of defaults) {
      const resp = await (async () => {
        // reuse handler logic by direct inserts
        const cats = (await query('SELECT category_id FROM tblappliance_categories WHERE category_name = ?', [d.category])) as any[];
        let categoryId = cats[0]?.category_id;
        if (!categoryId) {
          const r = (await query('INSERT INTO tblappliance_categories (category_name) VALUES (?)', [d.category])) as any;
          categoryId = r.insertId;
        }
        const types = (await query('SELECT appliance_type_id FROM tblappliance_types WHERE appliance_type_name = ?', [d.name])) as any[];
        let typeId = types[0]?.appliance_type_id;
        if (!typeId) {
          const r = (await query(
            `INSERT INTO tblappliance_types
             (appliance_type_category_id, appliance_type_name, appliance_type_typical_power_w, appliance_type_power_factor,
              appliance_type_nominal_frequency_hz, appliance_type_frequency_tolerance, appliance_type_power_pattern)
             VALUES (?, ?, ?, 0.9, 60.0, 0.5, 'constant')`,
            [categoryId, d.name, d.ratedPower]
          )) as any;
          typeId = r.insertId;
        }
        const r2 = (await query(
          `INSERT INTO tblappliances
           (appliance_user_id, appliance_device_id, appliance_type_id, appliance_custom_name, appliance_icon, appliance_port_number,
            appliance_is_active, appliance_usage_minutes, appliance_last_detected, created_at, updated_at)
           VALUES (?, ?, ?, NULL, ?, ?, 0, 0, NULL, NOW(), NOW())`,
          [parseInt(userId, 10), deviceId, typeId, d.icon, d.portNumber]
        )) as any;
        return r2.insertId;
      })();

      created.push(resp);
    }

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
       WHERE a.appliance_device_id = ?
       ORDER BY a.appliance_id DESC`,
      [deviceId]
    )) as any[];

    res.json({ appliances: rows });
  } catch (e) {
    next(e);
  }
});

// Readings
devicesRouter.post('/:deviceId/readings', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const { reading, appliances } = req.body || {};
    if (!reading?.timestamp) throw new HttpError(400, 'Missing reading');

    const rooms = (await query('SELECT room_id FROM tblrooms WHERE room_device_id = ? LIMIT 1', [deviceId])) as any[];
    if (rooms.length === 0) throw new HttpError(404, 'Room not found for device');
    const roomId = rooms[0].room_id;

    const header = (await query(
      `INSERT INTO tblreading_headers (reading_header_room_id, reading_header_device_id, reading_header_time)
       VALUES (?, ?, ?)`,
      [roomId, deviceId, new Date(reading.timestamp)]
    )) as any;
    const headerId = header.insertId;

    await query(
      `INSERT INTO tblreading_details
       (reading_detail_header_id, reading_detail_voltage, reading_detail_current, reading_detail_power_w,
        reading_detail_frequency, reading_detail_power_factor, reading_detail_thd_percentage, reading_detail_energy_kwh)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        headerId,
        reading.voltage,
        reading.current,
        reading.power,
        reading.frequency,
        reading.powerFactor,
        reading.thd ?? 0,
        reading.energy,
      ]
    );

    // Optional per-appliance detections
    if (Array.isArray(appliances) && appliances.length > 0) {
      const detHeader = (await query(
        `INSERT INTO tblappliance_detection_headers
         (detection_header_room_id, detection_header_reading_header_id, detection_header_time)
         VALUES (?, ?, ?)`,
        [roomId, headerId, new Date(reading.timestamp)]
      )) as any;
      const detHeaderId = detHeader.insertId;

      for (const a of appliances) {
        // In the app, appliance.id is the per-device appliance_id (tblappliances.appliance_id)
        const applianceId = parseInt(a.id, 10);
        if (!applianceId) continue;

        // Look up the underlying appliance_type_id to satisfy the foreign key
        const rows = (await query(
          'SELECT appliance_type_id FROM tblappliances WHERE appliance_id = ? LIMIT 1',
          [applianceId]
        )) as any[];
        if (!rows.length) {
          // No matching appliance row; skip this detection to avoid FK errors
          continue;
        }
        const typeId = rows[0].appliance_type_id;

        await query(
          `INSERT INTO tblappliance_detection_details
           (detection_detail_header_id, detection_detail_appliance_type_id, detection_detail_status,
            detection_detail_confidence, detection_detail_detected_power, detection_detail_detected_frequency, detection_detail_detected_thd)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            detHeaderId,
            typeId,
            a.isOn ? 'ON' : 'OFF',
            a.confidence ?? 0.9,
            a.power ?? 0,
            reading.frequency ?? 60,
            a.thd ?? 0,
          ]
        );
      }
    }

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

devicesRouter.get('/:deviceId/readings/recent', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 100, 500);
    const rows = (await query(
      `SELECT rd.*, rh.reading_header_time as timestamp
       FROM tblreading_details rd
       JOIN tblreading_headers rh ON rd.reading_detail_header_id = rh.reading_header_id
       WHERE rh.reading_header_device_id = ?
       ORDER BY rh.reading_header_time DESC
       LIMIT ?`,
      [deviceId, limit]
    )) as any[];
    res.json({ readings: rows });
  } catch (e) {
    next(e);
  }
});

devicesRouter.get('/:deviceId/readings', requireAuth, async (req: any, res, next) => {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const start = req.query.start ? new Date(req.query.start as string) : null;
    const end = req.query.end ? new Date(req.query.end as string) : null;
    if (!start || !end) throw new HttpError(400, 'Missing start or end');

    const rows = (await query(
      `SELECT rd.*, rh.reading_header_time as timestamp
       FROM tblreading_details rd
       JOIN tblreading_headers rh ON rd.reading_detail_header_id = rh.reading_header_id
       WHERE rh.reading_header_device_id = ?
         AND rh.reading_header_time >= ?
         AND rh.reading_header_time <= ?
       ORDER BY rh.reading_header_time ASC`,
      [deviceId, start, end]
    )) as any[];
    res.json({ readings: rows });
  } catch (e) {
    next(e);
  }
});

