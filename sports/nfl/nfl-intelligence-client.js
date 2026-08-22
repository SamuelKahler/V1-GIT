(function(){
  async function fetchJson(url){
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    const payload = await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(payload?.error?.message || payload?.error || `NFL intelligence request failed (${response.status}).`);
    return payload;
  }
  window.NFL_INTELLIGENCE_READY = (async()=>{
    try {
      const payload = await fetchJson('/api/nfl?action=dashboard');
      window.NFL_BACKBONE = payload.dashboard || null;
      window.dispatchEvent(new CustomEvent('sports-edge:nfl-backbone-ready', { detail: window.NFL_BACKBONE }));
      return window.NFL_BACKBONE;
    } catch(error){
      console.warn('[Sports Edge NFL] Supabase backbone unavailable; keeping bundled reference data.', error);
      window.NFL_BACKBONE = null;
      return null;
    }
  })();
})();
