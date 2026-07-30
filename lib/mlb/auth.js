import crypto from 'node:crypto';

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function requireAdmin(req, res) {
  const expected = process.env.MLB_IMPORT_ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({ error: 'MLB_IMPORT_ADMIN_TOKEN_NOT_CONFIGURED' });
    return false;
  }
  const supplied = req.headers['x-sports-edge-admin-token'] || String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!safeEqual(supplied, expected)) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return false;
  }
  return true;
}
