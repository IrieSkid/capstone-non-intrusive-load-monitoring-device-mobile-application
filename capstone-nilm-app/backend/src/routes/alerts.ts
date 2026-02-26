import express from 'express';
import { query } from '../lib/db';
import { requireAuth } from '../middleware/auth';

export const alertsRouter = express.Router();

alertsRouter.post('/:alertId/resolve', requireAuth, async (req, res, next) => {
  try {
    const alertId = parseInt((req as any).params.alertId, 10);
    await query('UPDATE tblalerts SET alert_status = ? WHERE alert_id = ?', ['resolved', alertId]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

alertsRouter.post('/:alertId/acknowledge', requireAuth, async (req, res, next) => {
  try {
    const alertId = parseInt((req as any).params.alertId, 10);
    await query('UPDATE tblalerts SET alert_status = ? WHERE alert_id = ?', ['resolved', alertId]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

alertsRouter.post('/:alertId/dismiss', requireAuth, async (req, res, next) => {
  try {
    const alertId = parseInt((req as any).params.alertId, 10);
    await query('UPDATE tblalerts SET alert_status = ? WHERE alert_id = ?', ['resolved', alertId]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

