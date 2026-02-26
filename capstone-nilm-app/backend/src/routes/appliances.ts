import express from 'express';
import { query } from '../lib/db';
import { HttpError } from '../lib/httpError';
import { requireAuth } from '../middleware/auth';

export const appliancesRouter = express.Router();

appliancesRouter.patch('/:applianceId', requireAuth, async (req: any, res, next) => {
  try {
    const applianceId = parseInt(req.params.applianceId, 10);
    const { name, ratedPower, icon, portNumber, isActive } = req.body || {};

    // Update tblappliances + (optionally) the underlying type name/power
    const rows = (await query(
      `SELECT a.appliance_id, a.appliance_type_id
       FROM tblappliances a
       WHERE a.appliance_id = ?`,
      [applianceId]
    )) as any[];
    if (rows.length === 0) throw new HttpError(404, 'Appliance not found');
    const typeId = rows[0].appliance_type_id;

    const updatesA: string[] = [];
    const paramsA: any[] = [];
    if (icon !== undefined) {
      updatesA.push('appliance_icon = ?');
      paramsA.push(icon);
    }
    if (portNumber !== undefined) {
      updatesA.push('appliance_port_number = ?');
      paramsA.push(portNumber);
    }
    if (isActive !== undefined) {
      updatesA.push('appliance_is_active = ?');
      paramsA.push(isActive ? 1 : 0);
    }
    if (updatesA.length > 0) {
      paramsA.push(applianceId);
      await query(`UPDATE tblappliances SET ${updatesA.join(', ')}, updated_at = NOW() WHERE appliance_id = ?`, paramsA);
    }

    if (name !== undefined || ratedPower !== undefined) {
      const updatesT: string[] = [];
      const paramsT: any[] = [];
      if (name !== undefined) {
        updatesT.push('appliance_type_name = ?');
        paramsT.push(name);
      }
      if (ratedPower !== undefined) {
        updatesT.push('appliance_type_typical_power_w = ?');
        paramsT.push(ratedPower);
      }
      paramsT.push(typeId);
      await query(`UPDATE tblappliance_types SET ${updatesT.join(', ')} WHERE appliance_type_id = ?`, paramsT);
    }

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

appliancesRouter.delete('/:applianceId', requireAuth, async (req: any, res, next) => {
  try {
    const applianceId = parseInt(req.params.applianceId, 10);
    await query('DELETE FROM tblappliances WHERE appliance_id = ?', [applianceId]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

