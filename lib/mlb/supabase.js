import { fetchJson } from './http.js';

function credentials() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_ENV_NOT_CONFIGURED');
  return { url: url.replace(/\/$/, ''), key };
}

export async function rpc(functionName, payload = {}) {
  const { url, key } = credentials();
  return fetchJson(`${url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    attempts: 2,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function hasSupabaseCredentials() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
