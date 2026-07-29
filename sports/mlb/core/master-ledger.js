(function(){
  'use strict';
  if(window.SportsEdgeDatabase){
    console.info('[Sports Edge Core] Compatibility layer connected to SportsEdgeDatabase V10.');
    return;
  }
  console.error('[Sports Edge Core] SportsEdgeDatabase did not load before master-ledger.js.');
})();
