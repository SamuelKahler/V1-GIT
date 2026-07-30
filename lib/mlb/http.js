export function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload, null, 2));
}

export async function readJson(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { const error = new Error('Request body must be valid JSON.'); error.statusCode = 400; throw error; }
}

export function handleError(response, error) {
  sendJson(response, error?.statusCode || 500, { ok:false, error:error?.message || 'Unexpected error' });
}
