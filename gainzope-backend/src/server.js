import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { getWebsiteAnalytics, recordVisit } from './analytics.js';
import { listCampaigns, sendCampaign, sendTestCampaign } from './campaigns.js';
import { config } from './config.js';
import { connectDatabase, isDatabaseReady } from './db.js';
import { initializeFirebaseAdmin, isFirebaseAdminReady } from './firebase-admin.js';
import { requireAdmin } from './middleware.js';
import { addWaitlistEmail, listWaitlistEmails } from './waitlist.js';

const app = express();
const defaultLocalOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];
const allowedOrigins = Array.from(new Set([config.websiteOrigin, config.adminOrigin, ...defaultLocalOrigins].filter(Boolean)));

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed.'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  maxAge: 86400
}));
app.use(express.json({ limit: '32kb' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/health', (_request, response) => response.status(isDatabaseReady() ? 200 : 503).json({ database: isDatabaseReady() ? 'connected' : 'unavailable', firebaseAdmin: isFirebaseAdminReady(), status: isDatabaseReady() ? 'ok' : 'degraded' }));

app.post('/api/analytics/visit', rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }), async (request, response, next) => {
  try {
    response.status(201).json(await recordVisit(request.body));
  } catch (error) { next(error); }
});

app.get('/api/admin/website/analytics', requireAdmin, async (_request, response, next) => {
  try {
    response.json(await getWebsiteAnalytics());
  } catch (error) { next(error); }
});

app.post('/api/waitlist', rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }), async (request, response, next) => {
  try {
    response.status(201).json(await addWaitlistEmail(request.body));
  } catch (error) { next(error); }
});

app.get('/api/admin/website/email-subscribers', requireAdmin, async (request, response, next) => {
  try {
    const page = Math.max(1, Number(request.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(request.query.limit) || 25));
    response.json(await listWaitlistEmails({ search: String(request.query.search || ''), page, limit }));
  } catch (error) { next(error); }
});

app.get('/api/admin/website/email-campaigns', requireAdmin, async (_request, response, next) => {
  try {
    response.json({ items: await listCampaigns() });
  } catch (error) { next(error); }
});

const campaignRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

app.post('/api/admin/website/email-campaigns/test', campaignRateLimit, requireAdmin, async (request, response, next) => {
  try {
    response.json(await sendTestCampaign(request.body));
  } catch (error) { next(error); }
});

app.post('/api/admin/website/email-campaigns/send', campaignRateLimit, requireAdmin, async (request, response, next) => {
  try {
    response.json(await sendCampaign(request.body, request.admin));
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => {
  if (error instanceof ZodError) return response.status(400).json({ error: 'Invalid request.', details: error.flatten() });
  if (error.message === 'Database is not connected.') return response.status(503).json({ error: 'Database is temporarily unavailable. Check MongoDB Atlas network access and try again.' });
  if (
    error.message === 'Invalid subscription id.' ||
    error.message.includes('Email sending is not configured') ||
    error.message.includes('There are no active') ||
    error.message.includes('A test email') ||
    error.message.includes('Brevo') ||
    error.status === 400 ||
    error.status === 401 ||
    error.status === 403
  ) {
    return response.status(error.status || 400).json({ error: error.message, details: error.details });
  }
  console.error(error);
  return response.status(500).json({ error: 'Unexpected server error.' });
});

initializeFirebaseAdmin();
app.listen(config.port, () => console.log(`GAINZOPE backend listening on port ${config.port}`));

async function connectWithRetry() {
  try {
    await connectDatabase();
    console.log('MongoDB connected.');
  } catch (error) {
    console.error(`MongoDB unavailable: ${error.code || error.message}. Retrying in 15 seconds.`);
    setTimeout(connectWithRetry, 15000);
  }
}

void connectWithRetry();

export default app;
