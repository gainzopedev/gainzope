import { z } from 'zod';
import { db } from './db.js';

const waitlistSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().trim().max(100).optional().default('website-footer')
});

export async function addWaitlistEmail(input) {
  const { email, source } = waitlistSchema.parse(input);
  const normalizedEmail = email.toLowerCase();
  const now = new Date();
  const result = await db().collection('waitlistSubscribers').updateOne(
    { email: normalizedEmail },
    { $set: { status: 'active', updatedAt: now }, $setOnInsert: { email: normalizedEmail, source: source || 'website-footer', createdAt: now } },
    { upsert: true }
  );
  return { alreadyRegistered: result.matchedCount > 0, email: normalizedEmail, status: 'active' };
}

export async function listWaitlistEmails({ page = 1, limit = 50, search = '' }) {
  const filter = search ? { email: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } } : {};
  const collection = db().collection('waitlistSubscribers');
  const [items, total] = await Promise.all([
    collection.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    collection.countDocuments(filter)
  ]);
  return { items, page, limit, total };
}
