(function () {
  'use strict';

  const VALID_STATUSES = new Set([
    'PENDING', 'LIVE', 'WIN', 'LOSS', 'PUSH', 'VOID', 'UNVERIFIED', 'DISREGARD'
  ]);

  const TEAM_ALIASES = {
    ARI:'ARI', ARIZONA:'ARI', DIAMONDBACKS:'ARI',
    ATL:'ATL', ATLANTA:'ATL', BRAVES:'ATL',
    BAL:'BAL', BALTIMORE:'BAL', ORIOLES:'BAL',
    BOS:'BOS', BOSTON:'BOS', 'RED SOX':'BOS',
    CHC:'CHC', CHIC:'CHC', CHICAGO:'CHC', CUBS:'CHC',
    CWS:'CWS', 'WHITE SOX':'CWS',
    CIN:'CIN', CINCINNATI:'CIN', REDS:'CIN',
    CLE:'CLE', CLEVELAND:'CLE', GUARDIANS:'CLE',
    COL:'COL', COLORADO:'COL', ROCKIES:'COL',
    DET:'DET', DETROIT:'DET', TIGERS:'DET',
    HOU:'HOU', HOUSTON:'HOU', ASTROS:'HOU',
    KC:'KC', KCR:'KC', 'KANSAS CITY':'KC', ROYALS:'KC',
    LAA:'LAA', ANGELS:'LAA',
    LAD:'LAD', DODGERS:'LAD',
    MIA:'MIA', MIAMI:'MIA', MARLINS:'MIA',
    MIL:'MIL', MILWAUKEE:'MIL', BREWERS:'MIL',
    MIN:'MIN', MINNESOTA:'MIN', TWINS:'MIN',
    NYM:'NYM', METS:'NYM',
    NYY:'NYY', YANKEES:'NYY',
    ATH:'ATH', OAK:'ATH', "A'S":'ATH', ATHLETICS:'ATH',
    PHI:'PHI', PHILADELPHIA:'PHI', PHILLIES:'PHI',
    PIT:'PIT', PITTSBURGH:'PIT', PIRATES:'PIT',
    SD:'SD', SDP:'SD', 'SAN DIEGO':'SD', PADRES:'SD',
    SEA:'SEA', SEATTLE:'SEA', MARINERS:'SEA',
    SF:'SF', SFG:'SF', 'SAN FRANCISCO':'SF', GIANTS:'SF',
    STL:'STL', 'ST. LOUIS':'STL', CARDINALS:'STL',
    TB:'TB', TBR:'TB', TAMPA:'TB', RAYS:'TB',
    TEX:'TEX', TEXAS:'TEX', RANGERS:'TEX',
    TOR:'TOR', TORONTO:'TOR', 'BLUE JAYS':'TOR',
    WSH:'WSH', WAS:'WSH', WASHINGTON:'WSH', NATIONALS:'WSH'
  };

  function text(value) {
    return String(value == null ? '' : value).trim();
  }

  function cleanText(value) {
    return text(value)
      .replace(/[\uFFFD]/g, '')
      .replace(/Ãƒ|Ã¢|âš¾|â€™|â€œ|â€|â€“|â€”/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeStatus(value) {
    const s = cleanText(value).toUpperCase();
    const map = {
      SUCCESS:'WIN', W:'WIN', WON:'WIN', CHECK:'WIN',
      L:'LOSS', LOST:'LOSS',
      TIE:'PUSH', CANCELLED:'VOID', CANCELED:'VOID',
      OPEN:'PENDING', WAITING:'PENDING',
      IGNORE:'DISREGARD'
    };
    const normalized = map[s] || s || 'PENDING';
    return VALID_STATUSES.has(normalized) ? normalized : 'UNVERIFIED';
  }

  function normalizeDate(value) {
    const raw = cleanText(value);
    if (!raw) return null;
    const direct = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (direct) return `${direct[1]}-${direct[2].padStart(2,'0')}-${direct[3].padStart(2,'0')}`;
    const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (slash) {
      const year = slash[3].length === 2 ? `20${slash[3]}` : slash[3];
      return `${year}-${slash[1].padStart(2,'0')}-${slash[2].padStart(2,'0')}`;
    }
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,'0')}-${String(parsed.getDate()).padStart(2,'0')}`;
    }
    return null;
  }

  function normalizeTeam(value) {
    const raw = cleanText(value).toUpperCase().replace(/\./g,'').replace(/\s+/g,' ').trim();
    if (!raw) return null;
    if (TEAM_ALIASES[raw]) return TEAM_ALIASES[raw];
    for (const key of Object.keys(TEAM_ALIASES).sort((a,b)=>b.length-a.length)) {
      const re = new RegExp(`(^|[^A-Z])${key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Z]|$)`);
      if (re.test(raw)) return TEAM_ALIASES[key];
    }
    return null;
  }

  function normalizeMarket(rawPick, type) {
    const s = `${cleanText(type)} ${cleanText(rawPick)}`.toUpperCase();
    if (/SERIES/.test(s)) return 'SERIES';
    if (/\bF5\b|FIRST\s*5|FIRST\s*FIVE/.test(s)) {
      if (/\bO(?:VER)?\b|\bU(?:NDER)?\b|TOTAL/.test(s)) return 'TOTAL';
      if (/[-+]\s*\d+(?:\.5)?/.test(s) && !/\bML\b|MONEYLINE/.test(s)) return 'SPREAD';
      return 'MONEYLINE';
    }
    if (/\bML\b|MONEYLINE/.test(s)) return 'MONEYLINE';
    if (/\bO(?:VER)?\s*\d|\bU(?:NDER)?\s*\d|TOTAL/.test(s)) return 'TOTAL';
    if (/RUN\s*LINE|SPREAD|\bRL\b/.test(s)) return 'SPREAD';
    if (/\bK'?S\b|STRIKEOUT|PROP/.test(s)) return 'PLAYER_PROP';
    return 'UNKNOWN';
  }

  function normalizePeriod(rawPick, type) {
    const s = `${cleanText(type)} ${cleanText(rawPick)}`.toUpperCase();
    if (/SERIES/.test(s)) return 'SERIES';
    if (/\bF5\b|FIRST\s*5|FIRST\s*FIVE/.test(s)) return 'FIRST_FIVE';
    if (/PROP|STRIKEOUT|\bK'?S\b/.test(s)) return 'PLAYER_GAME';
    return 'FULL_GAME';
  }

  function parseOdds(value, rawPick) {
    const source = `${cleanText(value)} ${cleanText(rawPick)}`;
    const match = source.match(/(?:^|\s)([+-]\d{3,4})(?:\s|$|[,;])/);
    return match ? Number(match[1]) : null;
  }

  function parseLine(rawPick) {
    const s = cleanText(rawPick).toUpperCase();
    const total = s.match(/\b(?:O|OVER|U|UNDER)\s*\*?\s*(\d+(?:\.5)?)/);
    if (total) return Number(total[1]);
    const spread = s.match(/(?:^|\s)([+-]\d+(?:\.5)?)(?:\s|$)/);
    return spread ? Number(spread[1]) : null;
  }

  function sourceRows() {
    const rows = [];
    const add = (source, arrayName, data) => {
      if (!Array.isArray(data)) return;
      data.forEach((row, index) => rows.push({source, arrayName, sourceIndex:index, row}));
    };
    add('MLB_DATA','trackedPickResults',typeof trackedPickResults !== 'undefined' ? trackedPickResults : window.trackedPickResults);
    add('OFFICIAL_HISTORY','officialBetHistory',typeof officialBetHistory !== 'undefined' ? officialBetHistory : window.officialBetHistory);
    add('F5_HISTORY','f5PerformanceBets',typeof f5PerformanceBets !== 'undefined' ? f5PerformanceBets : window.f5PerformanceBets);
    add('SERIES_BOARD','seriesBoardPicks',typeof seriesBoardPicks !== 'undefined' ? seriesBoardPicks : window.seriesBoardPicks);
    add('DAILY_IMPORT','dailyImportPicks',typeof dailyImportPicks !== 'undefined' ? dailyImportPicks : (window.dailyImportPicks || window.DAILY_IMPORT_PICKS));
    return rows;
  }

  function toCanonical(sourceRow) {
    const row = sourceRow.row || {};
    const rawPick = cleanText(row.pick || row.bet || row.selection || row.edge || row.description);
    const rawDate = row.date || row.slate || row.gameDate;
    const team = normalizeTeam(row.team || row.selectedTeam || rawPick);
    const opponent = normalizeTeam(row.opponent || row.opp || row.matchup);
    const market = normalizeMarket(rawPick, row.type || row.category);
    const period = normalizePeriod(rawPick, row.type || row.category);
    const status = normalizeStatus(row.status || row.result);
    const date = normalizeDate(rawDate);
    const odds = parseOdds(row.odds, rawPick);
    const line = row.line != null && row.line !== '' ? Number(row.line) : parseLine(rawPick);
    return {
      preservationId: `LEGACY-${sourceRow.arrayName}-${String(sourceRow.sourceIndex + 1).padStart(6,'0')}`,
      source: sourceRow.source,
      sourceArray: sourceRow.arrayName,
      sourceIndex: sourceRow.sourceIndex,
      date,
      rawDate: cleanText(rawDate),
      rawPick,
      selectedTeam: team,
      opponent,
      market,
      period,
      line: Number.isFinite(line) ? line : null,
      odds: Number.isFinite(odds) ? odds : null,
      units: cleanText(row.units || row.unit || row.stake) || null,
      status,
      result: ['WIN','LOSS','PUSH','VOID'].includes(status) ? status : null,
      gamePk: row.gamePk || null,
      notes: row.notes || row.why || null,
      original: row
    };
  }

  function keyFor(record) {
    return [record.date || 'NO_DATE', record.selectedTeam || 'NO_TEAM', record.opponent || 'NO_OPP', record.period, record.market, record.line == null ? 'NO_LINE' : record.line].join('|');
  }

  function statusRank(status) {
    return ({WIN:90,LOSS:90,PUSH:90,VOID:80,LIVE:60,PENDING:50,UNVERIFIED:20,DISREGARD:10})[status] || 0;
  }

  function displaySourceRank(source) {
    return ({DAILY_IMPORT:40,MLB_DATA:30,SERIES_BOARD:20,F5_HISTORY:10,OFFICIAL_HISTORY:5})[source] || 0;
  }

  function displayRecordForGroup(group, authoritative) {
    const displayCandidate = [...group]
      .filter(record => ['MLB_DATA','DAILY_IMPORT'].includes(record.source))
      .sort((a,b) => displaySourceRank(b.source) - displaySourceRank(a.source) || b.sourceIndex - a.sourceIndex)[0];
    if (!displayCandidate) return null;
    const original = {...(displayCandidate.original || {})};
    const mergedStatus = authoritative.status;
    return {
      ...original,
      coreId: authoritative.id,
      slate: original.slate || original.date || displayCandidate.rawDate,
      pick: original.pick || original.bet || original.selection || displayCandidate.rawPick,
      odds: original.odds != null && original.odds !== '' ? original.odds : (displayCandidate.odds != null ? String(displayCandidate.odds) : ''),
      units: original.units != null ? original.units : displayCandidate.units,
      status: mergedStatus,
      result: authoritative.result,
      gamePk: authoritative.gamePk || original.gamePk || null,
      selectedTeam: authoritative.selectedTeam,
      opponent: authoritative.opponent,
      market: authoritative.market,
      period: authoritative.period,
      normalizedDate: authoritative.date,
      reconciliation: authoritative.reconciliation,
      sourceRecords: authoritative.sourceRecords,
      originalStatus: original.status || original.result || null
    };
  }

  function buildLedger() {
    const preserved = sourceRows().map(toCanonical);
    const groups = new Map();
    preserved.forEach(record => {
      const key = keyFor(record);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    });

    const ledger = [];
    const conflicts = [];
    const duplicates = [];
    for (const [key, group] of groups.entries()) {
      const statuses = new Set(group.map(r=>r.status));
      const odds = new Set(group.map(r=>r.odds).filter(v=>v!=null));
      const classification = group.length === 1 ? 'UNIQUE' : (statuses.size === 1 && odds.size <= 1 ? 'DUPLICATE' : 'CONFLICT');
      const preferred = [...group].sort((a,b)=>
        statusRank(b.status)-statusRank(a.status) ||
        (b.gamePk?1:0)-(a.gamePk?1:0) ||
        displaySourceRank(b.source)-displaySourceRank(a.source)
      )[0];
      const idSeed = key.replace(/[^A-Z0-9|.-]/gi,'').replace(/\|/g,'-');
      ledger.push({
        ...preferred,
        id:`MLB-${idSeed}`,
        reconciliation:classification,
        sourceRecords:group.map(r=>r.preservationId)
      });
      if (classification === 'CONFLICT') conflicts.push({key,records:group});
      if (classification === 'DUPLICATE') duplicates.push({key,records:group});
    }

    const uiPicks = ledger
      .map(record => {
        const group = groups.get(keyFor(record)) || [];
        return displayRecordForGroup(group, record);
      })
      .filter(Boolean)
      .sort((a,b) => String(a.normalizedDate || '').localeCompare(String(b.normalizedDate || '')) || String(a.pick || '').localeCompare(String(b.pick || '')));

    return {
      version:'2.0.0',
      generatedAt:new Date().toISOString(),
      preserved,
      ledger,
      uiPicks,
      audit:{
        preservedRows:preserved.length,
        masterRecords:ledger.length,
        duplicateGroups:duplicates.length,
        conflictGroups:conflicts.length,
        missingDate:preserved.filter(r=>!r.date).length,
        missingTeam:preserved.filter(r=>!r.selectedTeam).length,
        missingOpponent:preserved.filter(r=>!r.opponent).length,
        unknownMarket:preserved.filter(r=>r.market==='UNKNOWN').length,
        statusCounts:preserved.reduce((acc,r)=>{acc[r.status]=(acc[r.status]||0)+1;return acc;},{})
      },
      duplicates,
      conflicts
    };
  }

  const core = buildLedger();
  window.SportsEdgeCore = Object.freeze({
    version:core.version,
    generatedAt:core.generatedAt,
    picks:core.ledger,
    uiPicks:core.uiPicks,
    preserved:core.preserved,
    audit:core.audit,
    duplicates:core.duplicates,
    conflicts:core.conflicts,
    normalizeTeam,
    normalizeStatus,
    normalizeDate,
    rebuild:buildLedger
  });

  console.info('[Sports Edge Core] Master ledger initialized', core.audit);
})();
