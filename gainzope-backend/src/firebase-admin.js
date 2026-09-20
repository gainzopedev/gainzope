import admin from 'firebase-admin';
import { config } from './config.js';

let initialized = false;

export function initializeFirebaseAdmin() {
  if (!config.firebaseServiceAccountJson) return false;
  const credential = admin.credential.cert(JSON.parse(config.firebaseServiceAccountJson));
  admin.initializeApp({ credential });
  initialized = true;
  return true;
}

export function getFirebaseAdmin() {
  if (!initialized) throw new Error('Firebase Admin is not configured.');
  return admin;
}

export function isFirebaseAdminReady() {
  return initialized;
}
