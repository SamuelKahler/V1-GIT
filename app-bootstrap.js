(function bootstrapSportsEdge() {
  'use strict';

  const scripts = [
    'sports/mlb/mlb-data.js',
    'sports/nfl/data/nfl-props.js',
    'sports/nfl/data/nfl-systems.js',
    'sports/nfl/data/nfl-win-trends.js',
    'sports/nfl/data/nfl-games.js',
    'sports/mlb/core/sports-edge-database.js',
    'sports/mlb/core/master-ledger.js',
    'sports/mlb/core/intelligence-engine.js',
    'sports/mlb/core/intelligence-pipeline.js',
    'sports/mlb/core/recent-results.js',
    'sports/mlb/core/mlb-intelligence-client.js',
    'sports/mlb/mlb-app.js',
    'sports/mlb/core/performance-engine.js',
    'sports/nfl/nfl-app.js'
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }

  (async () => {
    try {
      if (window.SPORTS_EDGE_DAILY_IMPORT_READY) await window.SPORTS_EDGE_DAILY_IMPORT_READY;
      for (const src of scripts) await loadScript(src);
    } catch (error) {
      console.error('[Sports Edge] Application bootstrap failed.', error);
      const target = document.querySelector('main') || document.body;
      const notice = document.createElement('div');
      notice.style.cssText = 'margin:24px;padding:18px;border:1px solid #fecaca;border-radius:14px;background:#fff7f7;color:#7f1d1d;font-weight:700;';
      notice.textContent = 'Sports Edge could not finish loading. Refresh the page or try again shortly.';
      target.prepend(notice);
    }
  })();
})();
