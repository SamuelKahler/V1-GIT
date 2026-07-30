import crypto from 'node:crypto';

export function requireAdminToken(request) {
  const expected = process.env.MLB_IMPORT_ADMIN_TOKEN;
  if (!expected || expected.length < 32) {
    const error = new Error('MLB_IMPORT_ADMIN_TOKEN is missing or shorter than 32 characters.');
    error.statusCode = 503;
    throw error;
  }
  const supplied = request.headers['x-sports-edge-admin-token'];
  if (typeof supplied !== 'string') {
    const error = new Error('Missing x-sports-edge-admin-token header.');
    error.statusCode = 401;
    throw error;
  }
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    const error = new Error('Invalid admin token.');
    error.statusCode = 403;
    throw error;
  }
}
