import { config } from './config.js';
import { getFirebaseAdmin } from './firebase-admin.js';
import { isFirebaseAdminReady } from './firebase-admin.js';

export async function requireAdmin(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ error: 'Authentication is required.' });

  try {
    if (!isFirebaseAdminReady()) {
      return response.status(503).json({ error: 'Admin authentication is not configured.' });
    }
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);

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
