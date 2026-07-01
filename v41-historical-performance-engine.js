// Sports Edge V41 - Historical Performance Engine
// Add this file AFTER data/mlb/historical-performance.js and app.js in index.html.
(function () {
  const rows = window.SPORTS_EDGE_MLB_HISTORICAL_PERFORMANCE || [];
  const money = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  function clean(str) { return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function pct(n) { return Number.isFinite(n) ? `${n.toFixed(1)}%` : '0.0%'; }
  function units(n) { return `${n >= 0 ? '+' : ''}${Number(n || 0).toFixed(2)}U`; }
  function resultClass(n) { return Number(n) > 0 ? 'se-num-green' : Number(n) < 0 ? 'se-num-red' : 'se-num-gold'; }
  function badgeNumber(value, className = 'se-num-gold') { return `<span class="se-number-badge ${className}">${value}</span>`; }

  function statsFor(list) {
    const graded = list.filter(r => Number.isFinite(Number(r.resultUnits)));
    const wins = graded.filter(r => Number(r.resultUnits) > 0).length;
    const losses = graded.filter(r => Number(r.resultUnits) < 0).length;
    const pushes = graded.filter(r => Number(r.resultUnits) === 0).length;
    const net = graded.reduce((s, r) => s + Number(r.resultUnits || 0), 0);
    const risk = graded.length || 1; // 1U flat denominator for ROI display.
    return { count: graded.length, wins, losses, pushes, net, roi: (net / risk) * 100, hitRate: graded.length ? (wins / graded.length) * 100 : 0 };
  }

  function categoryRows(category) { return rows.filter(r => r.category === category); }

  function teamTokensFromPick(pick) {
    const text = clean([pick.pick, pick.matchup, pick.edge, pick.notes].join(' '));
    const tokens = [];
    const teamWords = ['yankees','red sox','rays','royals','mariners','guardians','cubs','brewers','braves','giants','phillies','nationals','rangers','blue jays','mets','marlins','rockies','padres','cardinals','twins','astros','reds','orioles','white sox','athletics','angels','diamondbacks','dodgers','pirates','tigers'];
    teamWords.forEach(t => { if (text.includes(t)) tokens.push(t); });
    // also keep common abbreviations from matchup subtitles
    ['nyy','bos','tb','kc','sea','cle','chc','mil','atl','sf','phi','wsh','tex','tor','nym','mia','col','sd','stl','min','hou','cin','bal','cws','laa','ari','lad','pit','det'].forEach(t => { if (text.includes(t)) tokens.push(t); });
    return [...new Set(tokens)];
  }

  function categoryForPick(p) {
    const txt = clean([p.pick, p.edge, p.rank].join(' '));
    if (txt.includes('f5')) return 'F5';
    if (txt.includes('series')) return 'Series';
    if (txt.includes(' ml') || txt.endsWith(' ml')) return 'Moneyline';
    if (/\bo\d|\bu\d/.test(txt) || txt.includes(' over') || txt.includes(' under')) return 'Over/Under';
    if (txt.includes('prop')) return 'Prop';
    return 'Other';
  }

  function matchedRowsForPick(p, limit = 10) {
    const category = categoryForPick(p);
    const tokens = teamTokensFromPick(p);
    let candidates = rows.filter(r => r.category === category || category === 'Other');
    if (tokens.length) {
      candidates = candidates.filter(r => {
        const blob = clean([r.bet, r.notes, r.pitchingMatchup].join(' '));
        return tokens.some(t => blob.includes(t));
      });
    }
    return candidates.sort((a,b) => String(b.date).localeCompare(String(a.date))).slice(0, limit);
  }

  function renderMatchedEvidence(p) {
    const matches = matchedRowsForPick(p, 8);
    if (!matches.length) return '<p class="subtle">No matching historical result rows found for this exact category/team context yet.</p>';
    const s = statsFor(matches);
    const rowsHtml = matches.map(r => {
      const cls = resultClass(r.resultUnits);
      return `<div class="se-history-row">
        <span>${r.displayDate || r.date}</span>
        <strong>${r.bet}</strong>
        <span class="se-market-pill">${r.category}</span>
        <span class="${cls}"><strong>${r.result}</strong> ${units(r.resultUnits)}</span>
        ${r.pitchingMatchup ? `<small class="se-matchup-note">${r.pitchingMatchup}</small>` : (r.notes ? `<small class="se-matchup-note">${r.notes}</small>` : '')}
      </div>`;
    }).join('');
    return `<div class="se-v41-evidence">
      <div class="se-stat-strip">
        ${badgeNumber(`${s.wins}-${s.losses}${s.pushes ? '-' + s.pushes : ''}`, 'se-num-blue')}<small>Matched Record</small>
        ${badgeNumber(pct(s.hitRate), s.hitRate >= 50 ? 'se-num-green' : 'se-num-red')}<small>Hit Rate</small>
        ${badgeNumber(units(s.net), resultClass(s.net))}<small>Net Units</small>
        ${badgeNumber(pct(s.roi), s.roi >= 0 ? 'se-num-green' : 'se-num-red')}<small>ROI</small>
      </div>
      <div class="se-history-table">${rowsHtml}</div>
    </div>`;
  }

  function renderPerformanceEngine() {
    const target = document.querySelector('#performance .performance-lab-layout') || document.querySelector('#performance');
    if (!target || document.querySelector('#v41HistoricalEnginePanel')) return;
    const categories = ['F5', 'Moneyline', 'Over/Under', 'Series', 'Prop'];
    const cards = categories.map(cat => {
      const s = statsFor(categoryRows(cat));
      return `<article class="se-category-card">
        <h3>${cat === 'Over/Under' ? 'Over / Under' : cat}</h3>
        <div class="se-card-metrics">
          ${badgeNumber(`${s.wins}-${s.losses}${s.pushes ? '-' + s.pushes : ''}`, 'se-num-blue')}
          ${badgeNumber(pct(s.hitRate), s.hitRate >= 50 ? 'se-num-green' : 'se-num-red')}
          ${badgeNumber(units(s.net), resultClass(s.net))}
          ${badgeNumber(pct(s.roi), s.roi >= 0 ? 'se-num-green' : 'se-num-red')}
        </div>
        <small>Record • Hit Rate • Net Units • ROI</small>
      </article>`;
    }).join('');
    const panel = document.createElement('section');
    panel.id = 'v41HistoricalEnginePanel';
    panel.className = 'model-panel se-v41-panel';
    panel.innerHTML = `<div class="board-header"><div><p class="eyebrow">Historical Performance Engine</p><h2>Database-powered category proof</h2><p>Calculated from the uploaded MLB result ledger. Positive unit values are wins, negative values are losses, and ROI uses the result column as net units.</p></div></div><div class="se-category-grid">${cards}</div>`;
    target.prepend(panel);
  }

  const originalOpenPick = window.openPick;
  if (typeof originalOpenPick === 'function') {
    window.openPick = function (i) {
      originalOpenPick(i);
      try {
        const p = typeof dailyPicks !== 'undefined' ? dailyPicks[i] : null;
        const body = document.querySelector('#modalBody');
        if (!p || !body || body.querySelector('#v41MatchedHistoricalEvidence')) return;
        const details = document.createElement('details');
        details.id = 'v41MatchedHistoricalEvidence';
        details.className = 'detail-accordion';
        details.open = true;
        details.innerHTML = `<summary>Historical Performance Match</summary><div class="detail-accordion-body">${renderMatchedEvidence(p)}</div>`;
        const firstExisting = body.querySelector('.detail-accordion');
        if (firstExisting) body.insertBefore(details, firstExisting); else body.appendChild(details);
      } catch (err) {
        console.warn('V41 historical evidence failed safely:', err);
      }
    };
  }

  function boot() {
    renderPerformanceEngine();
    document.querySelectorAll('[data-page="performance"], .jump[data-page="performance"]').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(renderPerformanceEngine, 75));
    });
  }

  window.SportsEdgeHistoricalEngine = { rows, statsFor, matchedRowsForPick, renderMatchedEvidence };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
