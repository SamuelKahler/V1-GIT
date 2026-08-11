(function initializeMLBIntelligenceClient(global) {
  'use strict';

  const ADMIN_TOKEN_STORAGE_KEY = 'sports-edge-mlb-admin-token';

  function apiError(message, status, details) {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    return error;
  }

  async function parseResponse(response) {
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      throw apiError(data?.error || `MLB Intelligence request failed (${response.status}).`, response.status, data?.details);
    }
    return data;
  }

  async function adminRequest(path, payload, token) {
    const adminToken = token || global.sessionStorage?.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
    if (!adminToken) throw apiError('MLB Intelligence admin token is required.', 401);

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sports-edge-admin-token': adminToken
      },
      body: JSON.stringify(payload || {})
    });

    return parseResponse(response);
  }

  async function publicRequest(path, payload) {
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(path, {
          method: 'POST',
          cache: 'no-store',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload || {})
        });
        if ([502,503,504].includes(response.status) && attempt < 3) {
          lastError = apiError(`Evidence service temporarily unavailable (${response.status}).`, response.status);
          await new Promise(resolve => setTimeout(resolve, 350 * attempt));
          continue;
        }
        return await parseResponse(response);
      } catch (error) {
        lastError = error;
        if (attempt >= 3) break;
        await new Promise(resolve => setTimeout(resolve, 350 * attempt));
      } finally {
        clearTimeout(timeout);
      }
    }
    throw apiError(lastError?.message || 'Evidence service network request failed after retries.', lastError?.status || 503);
  }

  const client = Object.freeze({
    setAdminToken(token) {
      const value = String(token || '').trim();
      if (value.length < 32) throw apiError('Admin token must contain at least 32 characters.', 400);
      global.sessionStorage?.setItem(ADMIN_TOKEN_STORAGE_KEY, value);
      return true;
    },
    clearAdminToken() {
      global.sessionStorage?.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    },
    async query(criteria, options = {}) {
      const result = await adminRequest('/api/mlb', { action: 'query', criteria }, options.token);
      return result.intelligence;
    },
    async evidence(criteria, options = {}) {
      const result = await adminRequest('/api/mlb', {
        action: 'evidence',
        criteria,
        minimumSample: options.minimumSample,
        maximumVariants: options.maximumVariants,
        limit: options.limit
      }, options.token);
      return result.report;
    },
    async customerIntelligence(criteria, options = {}) {
      const result = await publicRequest('/api/mlb', {
        action: 'customerIntelligence',
        criteria,
        minimumSample: options.minimumSample || 10,
        maximumVariants: options.maximumVariants || 6,
        limit: options.limit || 50
      });
      return result.intelligence;
    },
    async publicEvidence(criteria, options = {}) {
      const result = await publicRequest('/api/mlb', {
        action: 'publicEvidence',
        criteria,
        minimumSample: options.minimumSample || 10,
        maximumVariants: options.maximumVariants || 6,
        limit: options.limit || 50
      });
      return result.report;
    }
  });

  global.SportsEdgeMLBIntelligence = client;
})(window);
