import dns from 'node:dns';
import { MongoClient } from 'mongodb';
import { config } from './config.js';

// Ensure SRV records can be queried reliably on Windows and local networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback error if environment restricts custom DNS
}

const client = new MongoClient(config.mongoUri);
let database;
let connectionPromise;

export async function connectDatabase() {
  if (database) return database;
  if (connectionPromise) return connectionPromise;
  connectionPromise = client.connect().then(async () => {
    database = client.db('gainzope');
    await database.collection('waitlistSubscribers').createIndex({ email: 1 }, { unique: true });
    await database.collection('emailCampaigns').createIndex({ createdAt: -1 });
    await database.collection('pageVisits').createIndex({ createdAt: -1 });
    await database.collection('pageVisits').createIndex({ sessionId: 1 });
    await database.collection('pageVisits').createIndex({ date: 1 });
    return database;
  }).finally(() => {
    connectionPromise = null;
  });
  return connectionPromise;
}

export function db() {
  if (!database) throw new Error('Database is not connected.');
  return database;
}

export function isDatabaseReady() {
  return Boolean(database);
}
