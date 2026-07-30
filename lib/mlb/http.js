const DEFAULT_TIMEOUT_MS = 12000;

export async function fetchJson(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Sports-Edge-MLB-Intelligence/2.0',
          ...(options.headers || {})
        },
        signal: controller.signal
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP_${response.status}: ${text.slice(0, 500)}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 300 * attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error('REQUEST_FAILED');
}

export async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, runner));
  return results;
}
