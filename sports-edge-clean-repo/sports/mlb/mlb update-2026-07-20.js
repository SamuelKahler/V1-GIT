// Sports Edge controlled MLB update: July 16-20, 2026.
// This layer is intentionally separate from the master historical file.
// Records are normalized and deduplicated before insertion.
(function(){
  const clean = value => String(value ?? '')
    .toLowerCase()
    .replace(/[’']/g,'')
    .replace(/\b(guardians|tigers|twins|rays|dodgers|braves|pirates|mariners|reds|white sox|rangers|cubs|mets|phillies|marlins|brewers|padres|royals|cardinals|angels|athletics|blue jays|astros|nationals|red sox)\b/g,'')
    .replace(/[^a-z0-9.+-]+/g,'')
    .replace(/now.*/,'');
  const pickKey = p => `${p.slate}|${clean(p.pick)}`;
  const f5Key = p => `${p.date}|${clean(p.bet)}`;
  const appendUnique = (target, incoming, keyFn, merge=false) => {
    const index = new Map(target.map((row,i)=>[keyFn(row),i]));
    let added=0, merged=0, skipped=0;
    incoming.forEach(row=>{
      const key=keyFn(row);
      if(index.has(key)){
        if(merge){ Object.assign(target[index.get(key)], row); merged++; }
        else skipped++;
      } else { target.unshift(row); index.set(key,0); added++; }
    });
    return {added,merged,skipped};
  };
  const why = (note, units='') => [note, units ? `Units: ${units}` : 'No unit size supplied; excluded from units/ROI.'];
  const p = (slate,pick,odds,status='PENDING',edge='',units='',rank='Tracked',score=null,breakdown={}) => ({slate,rank,pick,odds,score,status,edge:edge||`${pick} ${odds}`,units,breakdown,why:why(status==='LIVE'?'Live play supplied by project owner.':'User-entered tracked pick.',units)});

  const julyPicks = [
    // July 20 — CLE ML was marked DISREGARD and is intentionally excluded.
    p('July 20, 2026','F5 MIN -0.5','-105','PENDING','F5 MIN -.5 -105, .5U','.5U'),
    p('July 20, 2026','PIT ML','-104','LIVE','PIT ML -104 - LIVE'),
    p('July 20, 2026','F5 TB +0.5','-105','LIVE','F5 TB +.5 -105 - LIVE'),
    p('July 20, 2026','F5 LAD +0.5','+125','PENDING','F5 LAD +.5 +125'),
    p('July 20, 2026','ATL ML','-133','PENDING','ATL ML -133, .6U','.6U'),
    p('July 20, 2026','CWS / TEX O7.5','-115','LIVE','CWS / TEX O 7.5 -115 - LIVE'),
    p('July 20, 2026','DET / CHC O11.5','+100','LIVE','DET / CHC O 11.5 +100 - LIVE'),
    p('July 20, 2026','SEA ML','-145','LIVE','SEA ML -145 - LIVE'),
    p('July 20, 2026','CIN / SEA O7.5','-115','PENDING','CIN / SEA O 7.5 -115'),
    p('July 20, 2026',"A's / ARI U9.5",'-112','PENDING',"A's / ARI U 9.5 -112"),
    p('July 20, 2026','STL / LAA U9','-114','PENDING','STL / LAA U 9 -114'),
    p('July 20, 2026','BAL Series ML','+151','PENDING','BAL SERIES +151, .25U','.25U','Series'),
    p('July 20, 2026','NYM Series ML','+195','PENDING','NYM SERIES +195, .3U','.3U','Series'),

    // July 19 — CWS/TOR O8 was marked DISREGARD and is intentionally excluded.
    p('July 19, 2026','CWS ML','-115','LIVE','CWS ML -115; previously scored 0 - LIVE'),
    p('July 19, 2026','BOS ML','-125','LIVE','BOS ML -125 - LIVE'),
    p('July 19, 2026','F5 NYM -0.5','-115','PENDING','F5 NYM -.5 -115, .5U','.5U','Top Play',8.0,{'Projection':'61.5%','Implied Probability':'53.5%','Model Edge':'+8.0 pts'}),
    p('July 19, 2026','NYM / PHI U8.5','+100','LIVE','NYM / PHI U 8.5 +100, .25U & LIVE','.25U'),
    p('July 19, 2026','ATL ML','-102','LIVE','ATL ML -102 - LIVE'),
    p('July 19, 2026','PIT / CLE U7','-105','LIVE','PIT / CLE U 7 -105 - LIVE'),
    p('July 19, 2026','SD ML','-103','LIVE','SD ML opened +109, now -103; no CLV - LIVE'),
    p('July 19, 2026','MIA ML','+109','PENDING','MIA ML +109; AtS, .3U','.3U'),
    p('July 19, 2026','MIA To Score First','-150','PENDING','MIA TO SCORE FIRST -150'),
    p('July 19, 2026','F5 WSH -0.5','-125','LIVE','F5 WSH -.5 -125 - LIVE','','Top Play',8.4,{'Projection':'64.0%','Implied Probability':'55.6%','Model Edge':'+8.4 pts'}),
    p('July 19, 2026','F5 DET -0.5','-115','LIVE','F5 DET -.5 -115 - LIVE','','Top Play',9.5,{'Projection':'63.0%','Implied Probability':'53.5%','Model Edge':'+9.5 pts'}),

    // July 17
    p('July 17, 2026','MIN / CHC O9','-105','LIVE','MIN / CHC O 9 -105 - LIVE'),
    p('July 17, 2026','TOR ML','-115','PENDING','TOR ML -115; previously allowed 10+'),
    p('July 17, 2026','CWS / TOR O8.5','-110','LIVE','CWS / TOR O 8.5 -110 - LIVE'),
    p('July 17, 2026','F5 PHI -0.5','-125','PENDING','F5 PHI -.5 -125'),
    p('July 17, 2026','NYM / PHI O8.5','-118','LIVE','NYM / PHI O 8.5 -118, .4U & LIVE','.4U'),
    p('July 17, 2026','MIA ML','+124','PENDING','MIA ML +124, .4U','.4U'),
    p('July 17, 2026','TB / BOS U9.5','-105','PENDING','TB / BOS U 9.5 -105'),
    p('July 17, 2026','STL ML','+100','PENDING','STL ML +100'),
    p('July 17, 2026','STL / ARI U9','-107','PENDING','STL / ARI U 9 -107'),
    p('July 17, 2026','F5 KC -0.5','+115','PENDING','F5 KC -.5 +115'),
    p('July 17, 2026','SD / KC U11','-110','PENDING','SD / KC U 11 -110'),
    p('July 17, 2026','HOU ML','-110','PENDING','HOU ML -110'),
    p('July 17, 2026','F5 SEA -0.5','+100','LIVE','F5 SEA -.5 opened -105, now +100, .3U & LIVE','.3U'),
    p('July 17, 2026','TEX ML','-105','PENDING','TEX ML -105; previously allowed 10+'),

    // July 16
    p('July 16, 2026','LAD ML','-117','LIVE','LAD ML -117; no CLV - LIVE'),
    p('July 16, 2026','F5 PIT +0.5','-140','PENDING','F5 PIT +.5 -140'),
    p('July 16, 2026','CWS / TOR O8.5','-110','PENDING','CWS / TOR O 8.5 -110'),
    p('July 16, 2026','CWS +0.5','-130','PENDING','CWS +.5 opened -145, now -130, .6U','.6U'),
    p('July 16, 2026','TEX ML','+166','LIVE','TEX ML +166 - LIVE'),
    p('July 16, 2026','MIA / MIL O8','-115','LIVE','MIA / MIL O 8 -115 - LIVE'),
    p('July 16, 2026','MIA ML','+129','PENDING','MIA ML +129, .25U','.25U'),
    p('July 16, 2026','MIN / CHC O11','-125','LIVE','MIN / CHC opened O10.5 -101, now O11 -125, .45U & LIVE','.45U'),
    p('July 16, 2026','CHC ML','-137','PENDING','CHC ML -137'),
    p('July 16, 2026','SD / KC U10','-105','PENDING','SD / KC U 10 -105'),
    p('July 16, 2026','SD ML','-113','PENDING','SD ML -113; no CLV'),
    p('July 16, 2026','DET / LAA O8.5','-105','PENDING','DET / LAA O 8.5 -105'),
    p('July 16, 2026','STL ML','-115','LIVE','STL ML -115 - LIVE'),
    p('July 16, 2026','WSH ML','-110','PENDING','WSH ML -110; no CLV'),
    p('July 16, 2026',"WSH / A's O10",'-110','PENDING',"WSH / A's O 10 -110"),
    p('July 16, 2026','CLE Series ML','-110','PENDING','CLE SERIES -110','','Series'),
    p('July 16, 2026','SD Series ML','-120','PENDING','SD SERIES -120','','Series'),
    p('July 16, 2026','DET Series ML','-145','PENDING','DET SERIES opened -140, now -145, .7U','.7U','Series')
  ];

  const f5JulyRows = [
    ['7/2/2026','SEA','Seattle Mariners','SEA Mariners -.5','-140',-1.40,'loss',7.1],
    ['7/2/2026','MIL','Milwaukee Brewers','MIL Brewers -.5','-125',-1.25,'loss',7.6],
    ['7/2/2026','TEX','Texas Rangers','TEX Rangers -.5','+120',1.20,'win',6.3],
    ['7/3/2026','TB','Tampa Bay Rays','TB Rays -.5','-120',-1.20,'loss',6.9],
    ['7/3/2026','TOR','Toronto Blue Jays','TOR Blue Jays -.5','-135',1.00,'win',7.0],
    ['7/4/2026','MIL','Milwaukee Brewers','MIL Brewers -.5','-120',-1.20,'loss',7.42],
    ['7/4/2026','ATL','Atlanta Braves','ATL Braves -.5','-130',1.00,'win',7.42],
    ['7/4/2026','SEA','Seattle Mariners','SEA Mariners -.5','-125',1.00,'win',7.12],
    ['7/6/2026','ARI','Arizona Diamondbacks','ARI Diamondbacks +.5','-135',1.00,'win',null],
    ['7/6/2026','SF','San Francisco Giants','SF Giants +.5','-140',1.00,'win',null],
    ['7/7/2026','PHI','Philadelphia Phillies','PHI Phillies -.5','-125',1.00,'win',null],
    ['7/7/2026','CHC','Chicago Cubs','CHC Cubs -.5','-125',1.00,'win',null],
    ['7/7/2026','WSH','Washington Nationals','WSH Nationals -.5','-105',-1.05,'loss',null],
    ['7/10/2026','ATL','Atlanta Braves','ATL Braves -.5','-120',1.00,'win',7.38],
    ['7/10/2026','HOU','Houston Astros','HOU Astros -.5','-110',-1.10,'loss',6.8],
    ['7/10/2026','DET','Detroit Tigers','DET Tigers -.5','+110',-1.00,'loss',6.8],
    ['7/11/2026','PHI','Philadelphia Phillies','PHI Phillies -.5','-105',1.00,'win',null],
    ['7/11/2026','SEA','Seattle Mariners','SEA Mariners -.5','-115',-1.15,'loss',null],
    ['7/12/2026','TOR','Toronto Blue Jays','TOR Blue Jays -.5','-105',-1.05,'loss',8.1],
    ['7/12/2026','WSH','Washington Nationals','WSH Nationals -.5','+105',1.00,'win',8.3],
    ['7/12/2026','HOU','Houston Astros','HOU Astros +.5','-115',-1.15,'loss',7.6],
    ['7/17/2026','CWS','Chicago White Sox','CWS White Sox +.5','-135',1.00,'win',null],
    ['7/18/2026','SEA','Seattle Mariners','SEA Mariners -.5','-105',-1.05,'loss',null],
    ['7/18/2026','KC','Kansas City Royals','KC Royals -.5','+115',1.15,'win',null],
    ['7/18/2026','PHI','Philadelphia Phillies','PHI Phillies -.5','-125',1.00,'win',null]
  ].map((r,i)=>({id:`f5-july-${String(i+1).padStart(3,'0')}`,date:r[0],team:r[1],teamName:r[2],bet:r[3],odds:r[4],result:r[5],outcome:r[6],score:r[7]}));

  const pickAudit = appendUnique(trackedPickResults, julyPicks, pickKey, true);
  // Global cleanup: if the same dated pick exists more than once, retain the richer official/unit-bearing row.
  const bestByPick = new Map();
  trackedPickResults.forEach(row=>{
    const key=pickKey(row), current=bestByPick.get(key);
    const quality=x=>(String(x.rank).toLowerCase()==='official'?100:0)+(String(x.units||'').trim()?20:0)+(typeof x.score==='number'?10:0)+(String(x.odds||'').trim()?1:0);
    if(!current || quality(row)>quality(current)) bestByPick.set(key,row);
  });
  const globalPickDuplicatesRemoved = trackedPickResults.length-bestByPick.size;
  trackedPickResults.splice(0,trackedPickResults.length,...bestByPick.values());
  const f5Audit = appendUnique(f5PerformanceBets, f5JulyRows, f5Key, false);
  window.SPORTS_EDGE_IMPORT_AUDIT = Object.assign({}, window.SPORTS_EDGE_IMPORT_AUDIT, {
    july2026Picks: pickAudit,
    july2026F5: f5Audit,
    disregarded: ['2026-07-20 CLE ML -101','2026-07-19 CWS/TOR O8 -115'],
    sourceDuplicateRowsRemoved: 3,
    globalPickDuplicatesRemoved,
    note: 'Repeated DET/WSH/NYM F5 projection block was merged into the corresponding July 19 picks.'
  });
})();
