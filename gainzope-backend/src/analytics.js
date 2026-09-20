import { z } from 'zod';
import { db } from './db.js';

const visitSchema = z.object({
  device: z.enum(['mobile', 'desktop', 'tablet', 'unknown']).optional().default('desktop'),
  path: z.string().trim().max(250).optional().default('/'),
  referrer: z.string().trim().max(300).optional().default('direct'),
  sessionId: z.string().trim().min(5).max(100)
});

export async function recordVisit(input) {
  const visit = visitSchema.parse(input);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  await db().collection('pageVisits').insertOne({
    createdAt: now,
    date: dateStr,
    device: visit.device,
    path: visit.path,
    referrer: visit.referrer,
    sessionId: visit.sessionId
  });

  return { recorded: true };
}

export async function getWebsiteAnalytics() {
  const visitsCollection = db().collection('pageVisits');
  const subsCollection = db().collection('waitlistSubscribers');
  const campaignsCollection = db().collection('emailCampaigns');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // 14 days timeline dates
  const timelineDates = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    timelineDates.push(d.toISOString().slice(0, 10));
  }
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 14);

  const [
    totalVisits,
    uniqueVisitorsList,
    todayVisits,
    todayUniqueList,
    totalSubscribers,
    launchSubscribers,
    footerSubscribers,
    deviceAgg,
    referrerAgg,
    recentVisitsAgg,
    recentSubsAgg,
    campaignsTotal
  ] = await Promise.all([
    visitsCollection.countDocuments(),
    visitsCollection.distinct('sessionId'),
    visitsCollection.countDocuments({ date: todayStr }),
    visitsCollection.distinct('sessionId', { date: todayStr }),
    subsCollection.countDocuments({ status: 'active' }),
    subsCollection.countDocuments({ status: 'active', source: { $regex: /launch/i } }),
    subsCollection.countDocuments({ status: 'active', source: { $not: { $regex: /launch/i } } }),
    visitsCollection.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]).toArray(),
    visitsCollection.aggregate([
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray(),
    visitsCollection.aggregate([
      { $match: { date: { $in: timelineDates } } },
      { $group: { _id: '$date', visits: { $sum: 1 }, unique: { $addToSet: '$sessionId' } } }
    ]).toArray(),
    subsCollection.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $substr: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, 0, 10] },
          count: { $sum: 1 }
        }
      }
    ]).toArray(),
    campaignsCollection.countDocuments()
  ]);

  const uniqueVisitors = uniqueVisitorsList.length;
  const todayUniqueVisitors = todayUniqueList.length;

  const visitsMap = new Map();
  recentVisitsAgg.forEach((item) => {
    visitsMap.set(item._id, { visits: item.visits, unique: (item.unique || []).length });
  });

  const subsMap = new Map();
  recentSubsAgg.forEach((item) => {
    subsMap.set(item._id, item.count);
  });

  const timeline = timelineDates.map((date) => {
    const v = visitsMap.get(date) || { visits: 0, unique: 0 };
    const s = subsMap.get(date) || 0;
    const label = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(date));
    return {
      date,
      label,
      subscribers: s,
      uniqueVisitors: v.unique,
      visits: v.visits
    };
  });

  const deviceBreakdown = {
    desktop: 0,
    mobile: 0,
    tablet: 0
  };
  deviceAgg.forEach((d) => {
    if (d._id in deviceBreakdown) {
      deviceBreakdown[d._id] = d.count;
    } else {
      deviceBreakdown.desktop += d.count;
    }
  });

  const conversionRate = uniqueVisitors > 0
    ? Number(Math.min(100, (totalSubscribers / uniqueVisitors) * 100).toFixed(1))
    : (totalSubscribers > 0 ? 100 : 0);

  return {
    campaignsTotal,
    conversionRate,
    deviceBreakdown,
    footerSubscribers,
    launchSubscribers,
    referrers: referrerAgg.map((r) => ({ count: r.count, source: r._id || 'Direct' })),
    timeline,
    todayUniqueVisitors,
    todayVisits,
    totalSubscribers,
    totalVisits,
    uniqueVisitors
  };
}
