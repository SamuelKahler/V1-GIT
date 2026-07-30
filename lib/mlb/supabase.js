function configuration() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const error = new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in Vercel.');
    error.statusCode = 503;
    throw error;
  }
  return { url, key };
}

export async function callRpc(functionName, body = {}) {
  const { url, key } = configuration();
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method:'POST',
    headers:{ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Accept:'application/json' },
    body:JSON.stringify(body)
  });
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
  if (!response.ok) {
    const error = new Error(`Supabase RPC ${functionName} failed (${response.status}): ${typeof payload === 'string' ? payload : payload?.message || 'Unknown error'}`);
    error.statusCode = 502;
    error.details = payload;
    throw error;
  }
  return payload;
}
