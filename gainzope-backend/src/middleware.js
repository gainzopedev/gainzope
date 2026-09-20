import { config } from './config.js';
import { getFirebaseAdmin } from './firebase-admin.js';

import { isFirebaseAdminReady } from './firebase-admin.js';

function parseJwtPayload(jwt = '') {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export async function requireAdmin(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ error: 'Authentication is required.' });

  try {
    let decoded;
    if (isFirebaseAdminReady()) {
      decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
    } else {
      const payload = parseJwtPayload(token);
      if (!payload) return response.status(401).json({ error: 'Invalid authentication token.' });
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return response.status(401).json({ error: 'Token expired. Please sign in again.' });
      }
      decoded = payload;
    }

    const email = decoded.email?.toLowerCase();
    const isAllowed = decoded.admin === true || (email && config.adminEmails.has(email));
    if (!isAllowed) return response.status(403).json({ error: 'Admin access is required.' });

    request.admin = { email: email || null, uid: decoded.uid || decoded.sub };
    return next();
  } catch {
    return response.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export async function attachOptionalUser(request, _response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next();
  try {
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
    request.user = { uid: decoded.uid };
  } catch {
    request.user = null;
  }
  return next();
}
