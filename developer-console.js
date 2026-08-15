(function initializeDeveloperConsole() {
  'use strict';

  const SESSION_KEY = 'sports-edge-mlb-admin-token';
  const LOCAL_KEY = 'sports-edge-mlb-admin-token-remembered';
  const API_PATH = '/api/mlb';
  const PICKS_API_PATH = '/api/admin-picks';
  let lastPickPreviewText = '';
  let lastPickPreviewCount = 0;
  let stopBackfillRequested = false;

  const byId = (id) => document.getElementById(id);
  const logElement = byId('operationsLog');

  function isoDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function yesterday() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 1);
    return isoDate(date);
  }

  function daysAgo(days) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - days);
    return isoDate(date);
  }

  function token() {
    return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(LOCAL_KEY) || '';
  }

  function log(title, value) {
    const timestamp = new Date().toLocaleTimeString();
    const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    logElement.textContent += `\n\n[${timestamp}] ${title}\n${text}`;
    logElement.scrollTop = logElement.scrollHeight;
  }

  function setBusy(button, busy, busyText) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = busyText || 'Working...';
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  async function request(action, payload = {}, method = 'POST') {
    const adminToken = token();
    if (!adminToken) throw new Error('Developer Console is locked.');

    let url = API_PATH;
    const options = {
      method,
      cache: 'no-store',
      headers: { 'x-sports-edge-admin-token': adminToken }
    };

    if (method === 'GET') {
      const params = new URLSearchParams({ action, ...payload });
      url += `?${params.toString()}`;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify({ action, ...payload });
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || `Request failed (${response.status}).`);
    }
    return data;
  }

  async function picksRequest(action, text = '', method = 'POST') {
    const adminToken = token();
    if (!adminToken) throw new Error('Developer Console is locked.');
    const options = {
      method,
      cache: 'no-store',
      headers: { 'x-sports-edge-admin-token': adminToken }
    };
    let url = PICKS_API_PATH;
    if (method === 'GET') {
      url += '?limit=120';
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify({ action, text });
    }
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) throw new Error(data?.error || `Request failed (${response.status}).`);
    return data;
  }

  function renderPickPreview(rows = []) {
    const target = byId('pickPreview');
    if (!target) return;
    if (!rows.length) { target.innerHTML = '<div class="dev-note">No picks to show.</div>'; return; }
    target.innerHTML = rows.map(row => `
      <div class="pick-preview-row">
        <strong>${row.date || '—'}</strong>
        <span>${row.pick || row.raw_pick || row.raw_line || '—'}</span>
        <span>${row.odds == null ? 'Odds —' : `Odds ${Number(row.odds) > 0 ? '+' : ''}${row.odds}`}</span>
        <span>${row.units == null ? 'No unit' : `${row.units}U`}</span>
        <span class="${row.official || row.has_explicit_units ? 'pick-official' : 'pick-research'}">${row.official || row.has_explicit_units ? 'OFFICIAL' : 'RESEARCH'}</span>
      </div>`).join('');
  }

  async function previewPicks() {
    const button = byId('previewPicks');
    const text = byId('pickEntryText').value.trim();
    const result = await runButton(button, 'Pick preview', () => picksRequest('preview', text));
    lastPickPreviewText = text;
    lastPickPreviewCount = result.count || 0;
    renderPickPreview(result.preview || []);
    byId('publishPicks').disabled = !lastPickPreviewCount;
  }

  async function publishPicks() {
    const button = byId('publishPicks');
    const text = byId('pickEntryText').value.trim();
    if (!lastPickPreviewCount || text !== lastPickPreviewText) {
      log('Publish blocked', 'Preview the current text before publishing.');
      return;
    }
    const result = await runButton(button, 'Publish picks', () => picksRequest('publish', text));
    renderPickPreview(result.preview || []);
    log('Published pick dates', `${(result.dates || []).join(', ')} | ${result.count || 0} picks`);
  }

  async function refreshPublishedPicks() {
    const button = byId('refreshPublishedPicks');
    const result = await runButton(button, 'Recent published picks', () => picksRequest('', '', 'GET'));
    renderPickPreview((result.rows || []).map(row => ({...row, pick: row.raw_pick, official: row.has_explicit_units})));
  }


  function metric(label, value) {
    return `<div class="dev-metric"><strong>${value ?? '—'}</strong><span>${label}</span></div>`;
  }

  function renderHealth(data) {
    const database = data?.health?.database || data?.audit || data || {};
    byId('healthMetrics').innerHTML = [
      metric('Database', data?.status || (data?.ok ? 'Connected' : 'Unknown')),
      metric('Games', database.games ?? database.totalGames ?? '—'),
      metric('Final games', database.finalGames ?? '—'),
      metric('Duplicate gamePk', database.duplicateGamePks ?? database.duplicate_game_pks ?? '—')
    ].join('');
  }

  async function runButton(button, title, fn) {
    setBusy(button, true);
    try {
      const result = await fn();
      log(`${title} — SUCCESS`, result);
      return result;
    } catch (error) {
      log(`${title} — ERROR`, error.message);
      throw error;
    } finally {
      setBusy(button, false);
    }
  }

  function unlock() {
    const supplied = byId('adminToken').value.trim();
    if (supplied.length < 32) {
      log('Unlock failed', 'Token must contain at least 32 characters.');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, supplied);
    if (byId('rememberToken').checked) localStorage.setItem(LOCAL_KEY, supplied);
    byId('adminToken').value = '';
    byId('unlockCard').classList.add('dev-hidden');
    byId('consoleContent').classList.remove('dev-hidden');
    log('Console unlocked', 'Private token stored in this browser only.');
    refreshHealth();
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LOCAL_KEY);
    byId('consoleContent').classList.add('dev-hidden');
    byId('unlockCard').classList.remove('dev-hidden');
    log('Console locked', 'Stored administrator token removed from this browser.');
  }

  async function refreshHealth() {
    const button = document.querySelector('[data-action="status"]');
    const result = await runButton(button, 'Database health', () => request('status', {}, 'GET'));
    renderHealth(result);
  }

  async function runAudit() {
    const button = document.querySelector('[data-action="audit"]');
    const result = await runButton(button, 'Full database audit', () => request('audit', {}, 'GET'));
    renderHealth(result);
  }

  async function importRange(dryRun) {
    const button = byId(dryRun ? 'dryRun' : 'importRange');
    const startDate = byId('startDate').value;
    const endDate = byId('endDate').value || startDate;
    await runButton(button, dryRun ? 'MLB import dry run' : 'MLB date-range import', () => request('import', {
      startDate, endDate, dryRun, concurrency: 3
    }));
    if (!dryRun) await refreshHealth();
  }

  async function importYesterday() {
    const button = byId('importYesterday');
    const date = yesterday();
    byId('startDate').value = date;
    byId('endDate').value = date;
    await runButton(button, `Import yesterday (${date})`, () => request('import', {
      startDate: date, endDate: date, dryRun: false, concurrency: 3
    }));
    await refreshHealth();
  }

  async function releaseATest() {
    const button = byId('releaseATest');
    const date = byId('testDate').value;
    const result = await runButton(button, `Release A acceptance (${date})`, () => request('releaseATest', {
      date, concurrency: 3
    }));
    log(result.passed ? 'RELEASE A PASSED' : 'RELEASE A DID NOT PASS', result.checks || result);
    await refreshHealth();
  }

  async function rebuildEnvironments() {
    const button = byId('rebuildEnvironments');
    const startDate = byId('envStartDate').value;
    const endDate = byId('envEndDate').value || startDate;
    await runButton(button, 'Environment rebuild', () => request('environments', { startDate, endDate }));
  }

  function addDays(dateText, days) {
    const date = new Date(`${dateText}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return isoDate(date);
  }

  function dayDifference(start, end) {
    return Math.floor((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000) + 1;
  }

  async function startBackfill() {
    const button = byId('startBackfill');
    const stopButton = byId('stopBackfill');
    const start = byId('seasonStart').value;
    const end = byId('seasonEnd').value;
    if (!start || !end || start > end) {
      log('Backfill error', 'Choose a valid season start and end date.');
      return;
    }

    stopBackfillRequested = false;
    setBusy(button, true, 'Backfill Running...');
    stopButton.disabled = false;
    const totalDays = dayDifference(start, end);
    let completedDays = 0;
    let cursor = start;

    try {
      while (cursor <= end && !stopBackfillRequested) {
        const batchEnd = [addDays(cursor, 6), end].sort()[0];
        log('Backfill batch started', `${cursor} through ${batchEnd}`);
        const result = await request('import', {
          startDate: cursor,
          endDate: batchEnd,
          dryRun: false,
          concurrency: 3
        });
        log('Backfill batch completed', result);
        completedDays += dayDifference(cursor, batchEnd);
        const percent = Math.min(100, Math.round((completedDays / totalDays) * 100));
        byId('backfillProgress').style.width = `${percent}%`;
        byId('backfillLabel').textContent = `${completedDays} of ${totalDays} days processed (${percent}%).`;
        cursor = addDays(batchEnd, 1);
      }
      log('Backfill finished', stopBackfillRequested ? 'Stopped after current batch.' : 'All requested batches completed.');
      await refreshHealth();
    } catch (error) {
      log('Backfill stopped by error', error.message);
    } finally {
      setBusy(button, false);
      stopButton.disabled = true;
    }
  }

  function initializeDates() {
    const prior = daysAgo(2);
    const today = isoDate(new Date());
    byId('startDate').value = prior;
    byId('endDate').value = prior;
    byId('testDate').value = prior;
    byId('envStartDate').value = prior;
    byId('envEndDate').value = prior;
    byId('seasonStart').value = `${today.slice(0, 4)}-03-15`;
    byId('seasonEnd').value = yesterday();
  }

  byId('unlockButton').addEventListener('click', unlock);
  byId('lockButton').addEventListener('click', lock);
  byId('importYesterday').addEventListener('click', importYesterday);
  byId('importRange').addEventListener('click', () => importRange(false));
  byId('dryRun').addEventListener('click', () => importRange(true));
  byId('releaseATest').addEventListener('click', releaseATest);
  byId('rebuildEnvironments').addEventListener('click', rebuildEnvironments);
  byId('startBackfill').addEventListener('click', startBackfill);
  byId('stopBackfill').addEventListener('click', () => { stopBackfillRequested = true; byId('backfillLabel').textContent = 'Stop requested. Finishing current batch...'; });
  byId('clearLog').addEventListener('click', () => { logElement.textContent = 'Log cleared.'; });
  byId('previewPicks').addEventListener('click', previewPicks);
  byId('publishPicks').addEventListener('click', publishPicks);
  byId('refreshPublishedPicks').addEventListener('click', refreshPublishedPicks);
  byId('pickEntryText').addEventListener('input', () => { lastPickPreviewText = ''; lastPickPreviewCount = 0; byId('publishPicks').disabled = true; });
  document.querySelector('[data-action="status"]').addEventListener('click', refreshHealth);
  document.querySelector('[data-action="audit"]').addEventListener('click', runAudit);

  initializeDates();
  if (token()) {
    byId('unlockCard').classList.add('dev-hidden');
    byId('consoleContent').classList.remove('dev-hidden');
    refreshHealth().catch(() => {});
  }
})();
