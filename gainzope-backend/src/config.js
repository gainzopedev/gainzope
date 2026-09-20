import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';

const directory = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(directory, '../.env') });
dotenv.config({ path: resolve(directory, '../../gainzope-site/.env') });

const required = ['MONGODB_URI'];

for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
}

const getFirebaseSecret = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path && existsSync(path)) {
    try {
      return readFileSync(path, 'utf8');
    } catch {
      return '';
    }
  }
  return '';
};

export const config = {
  adminEmails: new Set((process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean)),
  adminOrigin: process.env.ADMIN_ORIGIN || 'http://localhost:5174',
  emailFrom: process.env.EMAIL_FROM || '',
  firebaseServiceAccountJson: getFirebaseSecret(),
  mongoUri: process.env.MONGODB_URI,
  port: Number(process.env.PORT || 4000),
  brevoApiKey: process.env.BREVO_API_KEY || process.env.RESEND_API_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  websiteOrigin: process.env.WEBSITE_ORIGIN || 'http://localhost:5173'
};
