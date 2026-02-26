import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { devicesRouter } from './routes/devices';
import { appliancesRouter } from './routes/appliances';
import { alertsRouter } from './routes/alerts';
import { adminRouter } from './routes/admin';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/devices', devicesRouter);
app.use('/appliances', appliancesRouter);
app.use('/alerts', alertsRouter);
app.use('/admin', adminRouter);

// Basic error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  // eslint-disable-next-line no-console
  console.error('API error:', err);
  const status = typeof err?.status === 'number' ? err.status : 500;
  res.status(status).json({ error: err?.message || 'Internal server error' });
});

const port = parseInt(process.env.API_PORT || '3001', 10);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ NILM API listening on port ${port}`);
});

