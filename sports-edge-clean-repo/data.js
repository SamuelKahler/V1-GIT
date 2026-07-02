const baseTrendRows = [
  {team:'WSH',style:'PROP',description:"WSH Jake Irvin 7 k's",opponent:'@ CHC',date:'2026-03-29',situation:'AWAY UNDERDOG',hitRate:'-',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'-'},
  {team:'WSH',style:'PROP',description:"WSH Foster Griffin 6 k's",opponent:'vs. LAD',date:'2026-04-05',situation:'HOME UNDERDOG',hitRate:'-',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'-'},
  {team:'WSH',style:'PREV_ALLOWED 10+',description:'WSH as away underdog',opponent:'@ PIT',date:'2026-04-14',situation:'NO REST',hitRate:'-',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'-'},
  {team:'WSH',style:'OVER',description:'WSH',opponent:'-',date:'2026-04-25',situation:'AWAY UNDERDOG',hitRate:'56.4%',duration:'since 2025',supportingGames:'@ PIT',additionalExamples:'-',notes:'-'},
  {team:'WSH',style:'SWEEP',description:'WSH',opponent:'@ CIN',date:'2026-05-14',situation:'AWAY UNDERDOG',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'WSH F Griffin',notes:'-'},
  {team:'WSH',style:'PREV_ALLOWED 10+',description:'WSH',opponent:'vs. NYM',date:'2026-05-19',situation:'HOME UNDERDOG',hitRate:'-%',duration:'-',supportingGames:'WSH F Griffin',additionalExamples:'-',notes:'& DIVISION'},
  {team:'CLE',style:'UNDER',description:'CLE',opponent:'-',date:'2026-04-08',situation:'HOME UNDERDOG',hitRate:'60.6%',duration:'since 2025',supportingGames:'-',additionalExamples:'vs. KC',notes:'-'},
  {team:'CLE',style:'UNDER',description:'CLE',opponent:'-',date:'2026-04-08',situation:'DIVISION',hitRate:'64.8%',duration:'since 2025',supportingGames:'vs. KC',additionalExamples:'vs. KC; @ SEA',notes:'-'},
  {team:'CLE',style:'ML',description:'CLE',opponent:'-',date:'2026-04-08',situation:'DIVISION',hitRate:'66.7%',duration:'since 2025',supportingGames:'-',additionalExamples:'-',notes:'-'},
  {team:'CLE',style:'UNDER',description:'CLE',opponent:'-',date:'2026-04-25',situation:'AWAY UNDERDOG',hitRate:'58.6%',duration:'since 2025',supportingGames:'@ LAD',additionalExamples:'@ TOR; @ ATL; vs. KC; @ SEA',notes:'-'},
  {team:'CLE',style:'UNDER',description:'CLE',opponent:'-',date:'2026-04-25',situation:'AFTER A WIN',hitRate:'60.7%',duration:'since 2025',supportingGames:'vs. HOU',additionalExamples:'@ TOR; vs. BAL; @ STL; @ ATL',notes:'-'},
  {team:'CLE',style:'ML',description:'CLE',opponent:'-',date:'2026-04-25',situation:'AFTER A WIN',hitRate:'57.3%',duration:'since 2024',supportingGames:'-',additionalExamples:'@ TOR; vs. HOU; @ STL; @ ATL',notes:'-'},
  {team:'CLE',style:'UNDER',description:'CLE',opponent:'-',date:'2026-04-25',situation:'NO REST',hitRate:'57%',duration:'since 2025',supportingGames:'-',additionalExamples:'@ TOR; vs. HOU x2; vs. BAL; @ STL; @ ATL',notes:'-'},
  {team:'CLE',style:'SWEEP',description:'CLE',opponent:"@ A's",date:'2026-05-03',situation:'AWAY FAVORITE',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'CLE P Messick',notes:'-'},
  {team:'ATL',style:'OVER',description:'ATL',opponent:'-',date:'2026-04-17',situation:'1-DAY REST',hitRate:'71.4%',duration:'since 2025',supportingGames:'vs. LAA',additionalExamples:'@ PHI',notes:'⚓'},
  {team:'ATL',style:'UNDER',description:'ATL',opponent:'-',date:'2026-04-24',situation:'HOME FAVORITE',hitRate:'61.8%',duration:'since 2025',supportingGames:'vs. PHI; vs. KC',additionalExamples:'vs. MIA x2; vs. CLE',notes:'-'},
  {team:'ATL',style:'UNDER',description:'ATL',opponent:'-',date:'2026-04-24',situation:'AFTER A WIN',hitRate:'57.3%',duration:'since 2025',supportingGames:'vs. PHI; @ PHI; vs. KC',additionalExamples:'@ WSH; vs. MIA; vs. CLE; @ LAA',notes:'-'},
  {team:'ATL',style:'UNDER',description:'ATL',opponent:'-',date:'2026-04-24',situation:'NO REST',hitRate:'58.8%',duration:'since 2025',supportingGames:'vs. PHI; @ WSH',additionalExamples:'vs. MIA; @ LAA',notes:'-'},
  {team:'ATL',style:'SWEEP',description:'ATL',opponent:'vs. CHC',date:'2026-05-14',situation:'HOME FAVORITE',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'ATL C Sale',notes:'> -200 favorites'},
  {team:'ATL',style:'SWEEP',description:'ATL',opponent:'vs. TOR',date:'2026-06-04',situation:'HOME FAVORITE',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'ATL C Sale',notes:'> -200 favorites'},
  {team:'SD',style:'UNDER',description:'SD',opponent:'-',date:'2026-03-27',situation:'AFTER A LOSS',hitRate:'54.9%',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'-'},
  {team:'SD',style:'UNDER',description:'SD',opponent:'-',date:'2026-04-17',situation:'AWAY UNDERDOG',hitRate:'58.8%',duration:'since 2024',supportingGames:'@ LAA; @ BOS; @ PIT',additionalExamples:'-',notes:'-'},
  {team:'SD',style:'PROP',description:"SD Michael King 8 k's",opponent:'@ ARI',date:'2026-04-26',situation:'AWAY FAVORITE',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'& DIVISION'},
  {team:'SD',style:'SWEEP',description:'SD',opponent:'@ SEA',date:'2026-05-17',situation:'AWAY UNDERDOG',hitRate:'-%',duration:'-',supportingGames:'SD L Giolito',additionalExamples:'-',notes:'& DIVISION'},
  {team:'SD',style:'PROP',description:"SD Michael King 9 k's",opponent:'vs. LAD',date:'2026-05-18',situation:'HOME UNDERDOG',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'& DIVISION'},
  {team:'SEA',style:'OVER',description:'SEA',opponent:'-',date:'2026-04-24',situation:'1-DAY REST',hitRate:'62.2%',duration:'since 2024',supportingGames:'@ HOU',additionalExamples:'@ STL; @ LAA',notes:'-'},
  {team:'SEA',style:'OVER',description:'SEA',opponent:'-',date:'2026-04-25',situation:'AWAY FAVORITE',hitRate:'54.6%',duration:'since 2023',supportingGames:'-',additionalExamples:'@ SD; @ LAA',notes:'-'},
  {team:'SEA',style:'PROP',description:"SEA George Kirby 7 k's",opponent:'@ HOU',date:'2026-05-11',situation:'AWAY FAVORITE',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'& DIVISION'},
  {team:'SEA',style:'PROP',description:"SEA Bryan Woo 9 k's",opponent:'@ HOU',date:'2026-05-12',situation:'AWAY FAVORITE',hitRate:'-%',duration:'-',supportingGames:'-',additionalExamples:'-',notes:'& DIVISION'},
  {team:'SEA',style:'SWEEP',description:'SEA',opponent:"@ A's",date:'2026-05-27',situation:'AWAY FAVORITE',hitRate:'-%',duration:'-',supportingGames:'SEA L Gilbert',additionalExamples:'-',notes:'& DIVISION'}
];


function normalizeStyle(style){
  const s = String(style || '').trim();
  if (!s) return 'UNCLASSIFIED';
  if (s.toUpperCase() === 'ATS' || s === 'AtS') return 'AtS';
  if (s.toUpperCase() === 'SPRD') return 'SPRD';
  return s.toUpperCase();
}
function parseRawTrendRows(raw){
  return raw.trim().split(/\n+/).map(line => line.split('\t')).filter(cols => cols.length >= 5).map(cols => {
    const [style, description, opponent, date, situation, hitRate, duration, support, examples, notes] = cols;
    const desc = (description || '').trim();
    const teamMatch = desc.match(/^([A-Z]{1,3})(?:\s|$)/);
    const team = teamMatch ? teamMatch[1] : desc.split(' ')[0] || '-';
    return {
      team: team.replace(/[^A-Z]/g,'') || '-',
      style: normalizeStyle(style),
      description: desc || '-',
      opponent: (opponent || '-').trim() || '-',
      date: (date || '-').trim() || '-',
      situation: (situation || '-').trim().toUpperCase() || '-',
      hitRate: (hitRate || '-').trim() || '-',
      duration: (duration || '-').trim() || '-',
      supportingGames: (support || '-').trim().replace(/"/g,'').replace(/\n/g,'; ') || '-',
      additionalExamples: (examples || '-').trim().replace(/"/g,'').replace(/\n/g,'; ') || '-',
      notes: (notes || '-').trim() || '-'
    };
  });
}

const importedMlbTrendsRaw = `
UNDER	CIN	-	6/15/2026	AFTER A LOSS	51.9%	since 2024	-	-	FADE in 2026
OVER	NYY	-	6/14/2026	AWAY FAVORITE	52.5%	since 2024	@ HOU x2; @ TB	@ BOS x2	FADE in 2026
OVER	A's	-	6/14/2026	AWAY UNDERDOG	52.8%	since 2025	@ SEA x2; @ NYY; @ TOR	@ NYM	-
OVER	MIL	-	6/15/2026	1-DAY REST	52.9%	since 2025	-	@ DET	63.6% hit rate in 2026
UNDER	PIT	-	6/14/2026	HOME FAVORITE	52.9%	since 2023	vs. MIA; vs. TB	vs. COL; vs. MIN; vs. WSH	-
OVER	LAD	-	6/14/2026	AFTER A WIN	53.2%	-	-	-	FADE in 2026
UNDER	LAA	-	6/14/2026	AFTER A LOSS	53.2%	since 2025	-	@ KC; vs. TOR; @ CIN	50% hit rate in 2026
UNDER	PIT	-	6/14/2026	NO REST	53.2%	since 2023	-	-	FADE in 2026
UNDER	CWS	-	6/14/2026	AWAY UNDERDOG	53.4%	since 2025	-	@ A's; @ MIA	FADE in 2026
UNDER	NYY	-	6/14/2026	AFTER A WIN	53.6%	since 2024	-	-	-
UNDER	PIT	-	4/12/2026	DIVISION	53.7%	since 2024	-	@ CHC; @ CIN	FADE in 2026
OVER	STL	-	6/15/2026	AWAY UNDERDOG	53.8%	since 2025	@ HOU; @ DET	@ MIA	-
UNDER	PHI	-	6/14/2026	NO REST	53.8%	since 2024	-	-	53.6% hit rate in 2026
SPRD	PHI	-	6/15/2026	AFTER A LOSS	54%	since 2025	-	@ ATL; @ CHC x2; vs. ARI; vs. TEX	-
OVER	TEX	-	6/14/2026	AWAY UNDERDOG	54%	since 2024	@ BOS; @ NYY; @ LAD	@ DET; @ SEA; @ BAL	56.3% hit rate in 2026
UNDER	A's	-	4/25/2026	NO REST	54%	since 2025	@ TEX; @ NYM	@ SEA x2; vs. CWS	-
UNDER	ATL	-	6/15/2026	AFTER A WIN	54.1%	since 2025	-	-	-
SPRD	CIN	-	6/14/2026	DIVISION	54.1%	-	-	-	-
OVER	PHI	-	6/14/2026	HOME FAVORITE	54.1%	since 2025	vs. CWS; vs. A's; vs. COL; vs. CHC	vs. PHI; vs. CIN; vs. CLE; vs. ARI	56.3% hit rate in 2026
UNDER	CIN	-	6/14/2026	NO REST	54.1%	since 2023	@ TB	@ MIN; @ MIA	-
UNDER	HOU	-	6/15/2026	1-DAY REST	54.2%	since 2024	-	vs. NYY; @ A's	FADE in 2026
OVER	STL	-	6/15/2026	1-DAY REST	54.3%	since 2025	@ HOU	vs. SEA; vs. BOS	-
OVER	A's	-	6/15/2026	AFTER A LOSS	54.4%	since 2025	vs. CWS; @ TOR	vs. TEX	-
UNDER	CLE	-	6/15/2026	1-DAY REST	54.4%	since 2024	-	@ TOR; @ LAA	-
UNDER	ATL	-	6/15/2026	NO REST	54.4%	since 2025	vs. PHI; @ WSH	vs. MIA; @ LAA	-
OVER	ARI	-	6/14/2026	AWAY UNDERDOG	54.4%	since 2023	@ BAL; @ PHI; @ NYM	@ PHI	-
UNDER	KC	-	6/15/2026	AWAY FAVORITE	54.6%	since 2024	-	@ DET; @ CLE	-
OVER	ARI	-	6/14/2026	AFTER A WIN	54.6%	since 2024	-	-	60.6% hit rate in 2026
OVER	SEA	-	6/14/2026	AWAY FAVORITE	54.6%	since 2023	-	@ SD; @ LAA	-
UNDER	COL	-	6/14/2026	AWAY UNDERDOG	54.6%	since 2023	@ NYM	-	-
ML	CIN	-	6/15/2026	HOME UNDERDOG	54.7%	since 2025	vs. DET; vs. BOS (OT)	-	-
ML	SF	-	6/15/2026	1-DAY REST	54.8%	since 2025	-	-	-
UNDER	PIT	-	6/15/2026	AWAY UNDERDOG	54.8%	since 2023	@ TEX; @ NYM	@ CHC	63.6% hit rate in 2026
ML	ARI	-	6/15/2026	AFTER A WIN	54.8%	since 2025	@ NYM	vs. CWS; vs. TOR; @ BAL	-
OVER	CHC	-	6/15/2026	AFTER A LOSS	54.9%	since 2025	-	-	-
UNDER	PIT	-	6/14/2026	AFTER A LOSS	54.9%	since 2023	@ NYM	@ TEX; vs. TB	50% hit rate in 2026
SPRD	CIN	-	6/14/2026	AFTER A LOSS	55.1%	-	@ MIN; vs. LAA	vs. PIT	-
UNDER	PHI	-	6/14/2026	AFTER A WIN	55.2%	since 2023	-	-	63.9% hit rate in 2026
OVER	TOR	-	6/15/2026	AFTER A WIN	55.3%	since 2025	@ LAA; vs. MIN	vs. A's	-
UNDER	TB	-	6/14/2026	AFTER A WIN	55.4%	-	vs. MIN; @ CWS	vs. NYY	53.9% hit rate in 2026
ML	CHC	-	6/15/2026	AFTER A LOSS	55.5%	since 2023	-	-	-
UNDER	CIN	-	6/15/2026	DIVISION	55.6%	since 2025	vs. PIT	-	-
UNDER	CLE	-	6/15/2026	NO REST	55.6%	since 2025	-	@ TOR; vs. HOU x2; vs. BAL; @ STL; @ ATL	54.1% hit rate in 2026
UNDER	KC	-	6/14/2026	1-DAY REST	55.6%	since 2024	@ DET	vs. LAA	-
OVER	A's	-	4/16/2026	HOME UNDERDOG	55.6%	since 2025	-	vs. HOU	-
UNDER	CIN	-	6/15/2026	AFTER A WIN	55.8%	since 2025	@ TB; vs. SF	@ MIN; vs. LAA; @ MIA	-
OVER	TOR	-	6/15/2026	NO REST	55.8%	since 2025	vs. CLE; @ ARI; vs. MIN	@ MIL	-
OVER	NYY	-	4/17/2026	AFTER A LOSS	55.8%	since 2024	vs. LAA	vs. KC	FADE in 2026
OVER	WSH	-	6/15/2026	AWAY UNDERDOG	55.9%	since 2025	@ PIT	-	57.6% hit rate in 2026
OVER	PIT	-	6/15/2026	HOME UNDERDOG	56%	since 2023	vs. TB; vs. BAL	-	-
OVER	CWS	-	6/14/2026	HOME UNDERDOG	56.1%	since 2025	vs. TB	vs. TB	59.4% hit rate in 2026
UNDER	NYY	-	6/15/2026	HOME FAVORITE	56.2%	since 2025	vs. NYY; vs. A's	-	-
OVER	TEX	-	6/15/2026	AWAY FAVORITE	56.3%	since 2025	@ BAL	-	52.6% hit rate in 2026
UNDER	SD	-	6/15/2026	AWAY UNDERDOG	56.3%	since 2024	@ LAA; @ BOS; @ PIT	-	-
UNDER	CIN	-	6/15/2026	HOME FAVORITE	56.4%	since 2023	vs. SF; vs. PIT	vs. LAA	FADE in 2026
OVER	SF	-	6/15/2026	HOME UNDERDOG	56.5%	since 2024	vs. MIA	vs. LAD	55.6% hit rate in 2026
ML	CLE	-	6/15/2026	AFTER A WIN	56.5%	since 2024	-	@ TOR; vs. HOU; @ STL; @ ATL	-
UNDER	CLE	-	6/15/2026	AFTER A WIN	56.5%	since 2025	vs. HOU	@ TOR; vs. BAL; @ STL; @ ATL	-
UNDER	PIT	-	6/15/2026	AWAY FAVORITE	56.6%	since 2024	-	@ TEX; @ CIN	-
UNDER	KC	-	6/15/2026	AWAY UNDERDOG	56.6%	since 2024	@ CIN; @ SEA; @ NYY; @ DET; @ ATL; @ CLE	@ TEX	73.3% hit rate in 2026
UNDER	DET	-	6/14/2026	DIVISION	56.8%	since 2025	vs. CLE; @ KC; vs. KC	vs. MIN	59.1% hit rate in 2026
UNDER	A's	-	4/25/2026	AFTER A WIN	56.9%	since 2025	@ TEX; @ NYY	@ SEA; vs. CWS; vs. TEX; vs. HOU	-
UNDER	KC	-	6/15/2026	AFTER A WIN	57%	since 2025	vs. CWS	vs. BAL	59.3% hit rate in 2026
UNDER	KC	-	6/15/2026	NO REST	57.1%	since 2024	@ NYY	vs. BAL x2; @ DET	55% hit rate in 2026
UNDER	TEX	-	6/15/2026	AFTER A WIN	57.1%	since 2024	@ A's x2	vs. A's; vs. PIT; @ PHI; @ BAL	-
OVER	BAL	-	6/15/2026	HOME FAVORITE	57.1%	since 2025	vs. BOS x2; vs. BAL; vs. SF	-	57.1% hit rate in 2026
UNDER	CLE	-	6/15/2026	AWAY UNDERDOG	57.1%	since 2025	@ LAD	@ TOR; @ ATL; vs. KC; @ SEA	-
UNDER	CIN	-	6/14/2026	HOME UNDERDOG	57.1%	since 2024	-	vs. DET; vs. PIT	-
OVER	NYY	-	6/15/2026	1-DAY REST	57.6%	since 2025	vs. MIA	@ BOS	-
UNDER	CIN	-	6/15/2026	DIVISION	57.7%	since 2024	-	vs. PIT	-
UNDER	KC	-	6/15/2026	HOME FAVORITE	57.7%	since 2024	vs. CWS; vs. MIN	vs. BAL x2	-
UNDER	ATL	-	6/15/2026	HOME FAVORITE	58.1%	since 2025	vs. PHI; vs. KC	vs. MIA x2; vs. CLE	58.3% hit rate in 2026
ML	MIL	-	6/15/2026	NO REST	58.5%	since 2025	vs. TOR	@ DET; vs. WSH	58.2% hit rate in 2026
UNDER	KC	-	6/15/2026	AFTER A LOSS	58.6%	since 2024	@ NYY; vs. CWS; @ ATL	vs. BAL; @ DET	-
UNDER	LAA	-	6/15/2026	1-DAY REST	58.7%	since 2024	-	@ KC	66.7% hit rate in 2026
OVER	ARI	-	6/14/2026	1-DAY REST	59.2%	since 2024	vs. TOR	@ PHI	75% hit rate in 2026
UNDER	BAL	-	6/15/2026	AWAY FAVORITE	59.3%	since 2025	-	@ KC; @ CWS	-
UNDER	SD	-	6/14/2026	AFTER A LOSS	59.4%	since 2026	-	-	-
UNDER	DET	-	6/15/2026	AFTER A LOSS	60%	since 2026	-	-	-
UNDER	SF	-	4/19/2026	AWAY FAVORITE	60%	since 2024	-	@ BAL	SF L Webb; SF R Ray
UNDER	KC	-	6/15/2026	DIVISION	60.6%	since 2024	-	-	55.6% hit rate in 2026
OVER	SF	-	6/15/2026	AWAY UNDERDOG	60.6%	since 2025	-	@ CIN; @ BAL	-
UNDER	SF	-	6/15/2026	1-DAY REST	61.3%	since 2025	-	-	72.7% hit rate in 2026
UNDER	TB	-	6/15/2026	1-DAY REST	61.3%	since 2025	-	-	-
UNDER	CIN	-	6/15/2026	AWAY FAVORITE	61.5%	since 2025	-	-	61.5% hit rate in 2026
UNDER	CLE	-	6/15/2026	HOME UNDERDOG	61.9%	since 2025	-	vs. KC	71.4% hit rate in 2026
OVER	MIA	-	6/15/2026	1-DAY REST	62.1%	since 2025	@ SF; vs. MIA	-	75% hit rate in 2026
UNDER	CLE	-	6/15/2026	DIVISION	63.2%	since 2025	-	@ SEA	62.5% hit rate in 2026
OVER	ATL	-	6/15/2026	1-DAY REST	63.3%	since 2025	vs. LAA	@ PHI	-
ML	MIL	-	6/15/2026	AFTER A WIN	63.4%	since 2025	vs. TOR	-	66.7% hit rate in 2026
OVER	SEA	-	6/15/2026	1-DAY REST	63.5%	since 2024	@ HOU	@ STL; @ LAA	62.5% hit rate in 2026
UNDER	TEX	-	6/15/2026	HOME FAVORITE	63.9%	since 2024	vs. PIT x2; vs. CIN	-	58.3% hit rate in 2026
OVER	MIN	-	6/15/2026	AFTER A LOSS	64.9%	since 2026	-	-	-
OVER	MIN	-	6/15/2026	AWAY UNDERDOG	65.2%	since 2026	@ KC; @ BAL	@ TOR; @ BAL	-
ML	CLE	-	6/15/2026	DIVISION	67.6%	since 2025	-	-	68.8% hit rate in 2026
UNDER	CHC	-	6/15/2026	1-DAY REST	70%	since 2026	vs. NYM	-	-
OVER	DET	-	6/15/2026	1-DAY REST	71%	since 2025	-	vs. KC	55.6% hit rate in 2026
UNDER	PHI	-	6/15/2026	1-DAY REST	72.7%	since 2026	-	vs. ATL	-
PREV_SCRD 10+	WSH	vs. ATL	4/22/2026	AWAY UNDERDOG	-	-	-	WSH Z Littell	-
ATS	MIA	-	4/19/2026	AWAY UNDERDOG	-	-	vs. MIL; @ ATL	@ DET	-
PROP	HOU Peter Lambert 8 k's	vs. STL	4/17/2026	HOME FAVORITE	-	-	-	-	-
PROP	STL Kyle Leahy 6 k's	@ HOU	4/17/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	LAA Jose Soriano 8 k's	vs. SD	4/17/2026	HOME FAVORITE	-	-	-	-	-
PROP	SEA Logan Gilbert 7 k's	vs. TEX	4/17/2026	DIVISION	-	-	-	-	-
PROP	SD Walker Buehler 7 k's	vs. SEA	4/16/2026	HOME UNDERDOG	-	-	-	-	-
PROP	WSH Foster Griffin 7 k's	@ PIT	4/16/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	MIN Mick Abel 10 k's	vs. BOS	4/14/2026	HOME UNDERDOG	-	-	-	-	-
PROP	BAL Dean Kremer 9 k's	vs. ARI	4/13/2026	HOME FAVORITE	-	-	-	-	-
PROP	TEX Jacob deGrom 9 k's	@ LAD	4/12/2026	AWAY UNDERDOG	-	-	-	-	W
PROP	TB Drew Rasmussen 7 k's	vs. NYY	4/12/2026	HOME UNDERDOG	-	-	-	-	& DIVISION
PROP	LAA Jose Soriano 10 k's	@ CIN	4/12/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	TB Steven Matz 7 k's	vs. NYY	4/10/2026	DIVISION	-	-	-	-	-
PROP	ARI Michael Soroka 10 k's	@ PHI	4/10/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PHI Jesus Luzardo 8 k's	vs. ARI	4/10/2026	HOME FAVORITE	-	-	-	-	-
PROP	CLE Joey Cantillo 9 k's	vs. KC	4/8/2026	HOME UNDERDOG	-	-	-	-	-
ML	TEX as home underdog	vs. SEA	4/8/2026	DIVISION	-	-	-	-	-
UNDER	TEX as home underdog	vs. SEA	4/8/2026	DIVISION	-	-	-	-	-
PROP	MIL Jacob Misiorowski 10 k's	@ BOS	4/7/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	CIN Chase Burns 9 k's	@ TEX	4/5/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	HOU Tatsuya Imai 9 k's	@ A's	4/4/2026	AWAY UNDERDOG	-	-	-	-	& DIVISION
ML	HOU as away underdog	@ A's	4/4/2026	DIVISION	-	-	-	-	-
PROP	LAD Tyler Glasnow 9 k's	@ WSH	4/4/2026	AWAY FAVORITE	-	-	-	-	-
PROP	PHI Jesus Luzardo 11 k's	@ COL	4/4/2026	AWAY FAVORITE	-	-	-	-	-
PROP	TOR Kevin Gausman 10 k's	vs. COL	4/1/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIL Jacob Misiorowski 7 k's	vs. TB	4/1/2026	HOME FAVORITE	-	-	-	-	-
PROP	NYY Cam Schlittler 7 k's	@ SEA	4/1/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	TEX Jacob deGrom 7 k's	-	3/31/2026	AWAY FAVORITE	-	-	-	-	-
PROP	HOU Hunter Brown O 8 k's	vs. BOS	3/31/2026	HOME FAVORITE	-	-	-	-	-
SPRD	NYY as away favorite	@ SEA	3/31/2026	CONFERENCE	-	-	-	-	-
PROP	CIN Chase Burns 7 k's	vs. PIT	3/30/2026	DIVISION	-	-	-	-	-
PROP	MIL Kyle Harrison 8 k's	vs. TB	3/30/2026	HOME FAVORITE	-	-	-	-	-
PROP	SEA Luis Castilllo 7 k's	vs. NYY	3/30/2026	HOME UNDERDOG	-	-	-	-	-
PROP	PHI Jesus Luzardo 7 k's	vs. TEX	3/29/2026	HOME FAVORITE	-	-	-	-	-
PROP	SEA Emerson Hancock 9 k's	vs. CLE	3/29/2026	HOME FAVORITE	-	-	-	-	-
PROP	TOR Dylan Cease 12 k's	vs. A's	3/28/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIA Eury Perez 8 k's	vs. COL	3/28/2026	HOME FAVORITE	-	-	-	-	-
PROP	BOS Garrett Crochet 8 k's	@ CIN	3/26/2026	AWAY FAVORITE	-	-	-	-	-
PROP	MIL Jacob Misiorowski 11 k's	vs. CWS	3/26/2026	HOME FAVORITE	-	-	-	-	-
SWEEP	STL	@ NYM	6/11/2026	AWAY UNDERDOG	-%	-	-	STL H Dobbins	-
ATS	CHC	@ COL	6/11/2026	AWAY FAVORITE	-%	-	CHC E Cabrera	-	-
PREV_ALLOWED 10+	PIT	vs. LAD	6/10/2026	HOME UNDERDOG	-%	-	PIT J Jones	-	-
PREV_ALLOWED 0	STL	@ NYM	6/10/2026	AWAY UNDERDOG	-%	-	STL A Pallante	-	-
SWEEP	NYY	@ CLE	6/10/2026	AWAY UNDERDOG	-%	-	NYY C Rodon	-	-
PROP	CHC Shota Imanaga 7 k's	@ COL	6/10/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	TOR Dylan Cease 11 k's	vs. PHI	6/9/2026	HOME	-%	-	-	-	-
PREV_ALLOWED 10+	TOR	vs. BAL	6/6/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PREV_SCRD 10+	BAL	@ TOR	6/6/2026	AWAY UNDERDOG	-%	-	-	BAL K Bradish	& DIVISION
PROP	PIT Paul Skenes 7 k's	@ HOU	6/3/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	CIN Chase Burns 9 k's	vs. KC	6/3/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TOR Kevin Gausman 8 k's	@ ATL	6/2/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	PIT Braxton Ashcraft 11 k's	vs. MIN	5/31/2026	HOME FAVORITE	-%	-	-	-	-
ATS	MIA	@ NYM	5/31/2026	AWAY UNDERDOG	-%	-	-	-	MIA bullpen day
PROP	ATL Spencer Strider 8 k's	@ CIN	5/31/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	SEA Bryan Woo 9 k's	vs. ARI	5/30/2026	HOME FAVORITE	-%	-	-	-	-
PROP	ATL Chris Sale 8 k's	@ BOS	5/28/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	CIN Nick Lodolo 7 k's	@ NYM	5/25/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIL Jacob Misiorowski 12 k's	vs. STL	5/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	LAD Emmet Sheehan 8 k's	vs. COL	5/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TOR Dylan Cease 8 k's	vs. PIT	5/24/2026	HOME FAVORITE	-%	-	-	-	-
PROP	ATL Spencer Strider 9 k's	@ MIA	5/21/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	NYY Cam Schlittler 7 k's	vs. TOR	5/20/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	TOR Dylan Cease 11 k's	@ NYY	5/19/2026	AWAY UNDERDOG	-%	-	-	-	& DIVISION
PROP	NYY Ryan Weathers 7 k's	vs. TOR	5/18/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	SEA George Kirby 6 k's	vs. SD	5/17/2026	HOME FAVORITE	-%	-	-	-	-
PROP	ATL Chris Sale 8 k's	vs. CHC	5/14/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TOR Dylan Cease 9 k's	vs. TB	5/13/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	CHC Shota Imanaga 10 k's	vs. CIN	5/7/2026	HOME FAVORITE	-%	-	-	-	-
PROP	SEA Emerson Hancock 14 k's	vs. KC	5/2/2026	HOME FAVORITE	-%	-	-	-	-
PROP	NYY W Warren 9 k's	vs. BAL	5/1/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	ATL Chris Sale 9 k's	vs. PHI	4/26/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TB Shane McClanahan 7 k's	vs. MIN	4/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	KC Cole Ragans 11 k's	vs. LAA	4/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	BOS Payton Tolle 11 k's	vs. NYY	4/23/2026	DIVISION	-%	-	-	-	-
PROP	TEX Jacob deGrom 10 k's	vs. PIT	4/23/2026	HOME FAVORITE	-%	-	-	-	-
PROP	LAD Shohei Ohtani 7 k's	@ SF	4/22/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	CIN Chase Burns 8 k's	@ TB	4/21/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	TOR Dylan Cease 12 k's	@ LAA	4/20/2026	AWAY TEAM	-%	-	-	-	-
PROP	BAL Kyle Bradish 7 k's	@ KC	4/20/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	BOS Garrett Crochet 8 k's	vs. DET	4/19/2026	NO REST	-%	-	-	-	-
PROP	MIL Jacob Misiorowski 9 k's	@ MIA	4/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIN Bailey Ober 10 k's	vs. CIN	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	CHC Jameson Taillon 10 k's	vs. PIT	4/12/2026	DIVISION	-%	-	-	-	-
PROP	KC Kris Bubic 11 k's	vs. CWS	4/10/2026	DIVISION	-%	-	-	-	-
PROP	CHC Shota Imanaga 9 k's	vs. PIT	4/10/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	PIT Braxton Ashcraft 8 k's	vs. BAL	4/5/2026	HOME FAVORITE	-%	-	-	-	-
PROP	CHC Matthew Boyd 10 k's	vs. LAA	4/1/2026	HOME FAVORITE	-%	-	-	-	-
PROP	PIT Carmen Mlodzinski 8 k's	@ NYM	3/29/2026	AWAY UNDERDOG	-%	-	-	-	avoid the sweep
PROP	CHC Shota Imanaga 7 k's	vs. WSH	3/29/2026	HOME FAVORITE	-%	-	-	-	-
`;

const fullPropHistoryRaw = `
PROP	NYM Freddy Peralta 7 k's	vs. PIT	3/26/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIL Jacob Misiorowski 11 k's	vs. CWS	3/26/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIN Joe Ryan 7 k's	@ BAL	3/26/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	BOS Garrett Crochet 8 k's	@ CIN	3/26/2026	AWAY FAVORITE	-	-	-	-	-
PROP	HOU Hunter Brown O 9 k's	vs. LAA	3/26/2026	HOME FAVORITE	-	-	-	-	-
PROP	PHI Cristopher Sanches 10 k's	vs. TEX	3/26/2026	HOME FAVORITE	-	-	-	-	-
PROP	CLE Tanner Bibee 7 k's	vs. SEA	3/26/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	SEA Logan Gilbert 7 k's	vs. CLE	3/26/2026	HOME FAVORITE	-	-	-	-	-
PROP	CHC Matthew Boyd 7 k's	vs. WSH	3/26/2026	HOME FAVORITE	-%	-	-	-	-
PROP	NYY Cam Schlittler 8 k's	@ SF	3/27/2026	AWAY FAVORITE	-	-	-	-	-
PROP	TOR Kevin Gausman 11 k's	vs. A's	3/27/2026	HOME FAVORITE	-	-	-	-	-
PROP	CLE Gavin Williams 7 k's	@ SEA	3/27/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	TOR Dylan Cease 12 k's	vs. A's	3/28/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIN Taj Bradley 8 k's	@ BAL	3/28/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PHI Aaron Nola 7 k's	vs. TEX	3/28/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIA Eury Perez 8 k's	vs. COL	3/28/2026	HOME FAVORITE	-	-	-	-	-
PROP	LAA Reid Detmers 9 k's	@ HOU	3/28/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	KC Michael Wacha 7 k's	@ ATL	3/28/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	SD Randy Vasquez 8 k's	vs. DET	3/28/2026	HOME	-	-	-	-	-
PROP	SEA Bryan Woo 9 k's	vs. CLE	3/28/2026	HOME FAVORITE	-	-	-	-	-
PROP	TEX MacKenzie Gore 7 k's	@ PHI	3/29/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PHI Jesus Luzardo 7 k's	vs. TEX	3/29/2026	HOME FAVORITE	-	-	-	-	-
PROP	NYM Nolan McLean 8 k's	vs. PIT	3/29/2026	HOME FAVORITE	-	-	-	-	-
PROP	WSH Jake Irvin 7 k's	@ CHC	3/29/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	SEA Emerson Hancock 9 k's	vs. CLE	3/29/2026	HOME FAVORITE	-	-	-	-	-
PROP	PIT Carmen Mlodzinski 8 k's	@ NYM	3/29/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	CHC Shota Imanaga 7 k's	vs. WSH	3/29/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TEX Jack Leiter 8 k's	@ BAL	3/30/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	CIN Chase Burns 7 k's	vs. PIT	3/30/2026	DIVISION	-	-	-	-	-
PROP	MIL Kyle Harrison 8 k's	vs. TB	3/30/2026	HOME FAVORITE	-	-	-	-	-
PROP	HOU Lance McCullers 9 k's	vs. BOS	3/30/2026	HOME UNDERDOG	-	-	-	-	-
PROP	NYY Ryan Weathers 7 k's	@ SEA	3/30/2026	AWAY FAVORITE	-	-	-	-	-
PROP	SEA Luis Castilllo 7 k's	vs. NYY	3/30/2026	HOME UNDERDOG	-	-	-	-	-
PROP	SF Landen Roupp 7 k's	@ SD	3/30/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	TEX Jacob deGrom 7 k's	-	3/31/2026	AWAY FAVORITE	-	-	-	-	-
PROP	PHI Andrew Painter 8 k's	vs. WSH	3/31/2026	HOME FAVORITE	-	-	-	-	-
PROP	NYM Kodai Senga 9 k's	@ STL	3/31/2026	-	-	-	-	-	-
PROP	HOU Hunter Brown O 8 k's	vs. BOS	3/31/2026	HOME FAVORITE	-	-	-	-	-
PROP	DET Casey Mize 9 k's	@ ARI	3/31/2026	AWAY	-	-	-	-	-
PROP	A's Luis Severino 7 k's	@ ATL	4/1/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PHI Cristopher Sanches 7 k's	vs. WSH	4/1/2026	HOME FAVORITE	-	-	-	-	-
PROP	TOR Kevin Gausman 10 k's	vs. COL	4/1/2026	HOME FAVORITE	-	-	-	-	-
PROP	NYM Freddy Peralta 7 k's	@ STL	4/1/2026	AWAY FAVORITE	-	-	-	-	-
PROP	TB Drew Rasmussen 8 k's	@ MIL	4/1/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	MIL Jacob Misiorowski 7 k's	vs. TB	4/1/2026	HOME FAVORITE	-	-	-	-	-
PROP	NYY Cam Schlittler 7 k's	@ SEA	4/1/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	SD Nick Pivetta 8 k's	vs. SF	4/1/2026	HOME FAVORITE	-	-	-	-	-
PROP	CLE Gavin Williams 10 k's	@ LAD	4/1/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	CHC Matthew Boyd 10 k's	vs. LAA	4/1/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TEX MacKenzie Gore 9 k's	vs. CIN	4/3/2026	HOME FAVORITE	-	-	-	-	-
PROP	TB Jack Boyle 9 k's	@ MIN	4/3/2026	AWAY	-	-	-	-	-
PROP	A's Jeffrey Springs 7 k's	vs. HOU	4/3/2026	DIVISION	-	-	-	-	-
PROP	HOU Tatsuya Imai 9 k's	@ A's	4/4/2026	AWAY UNDERDOG	-	-	-	-	& DIVISION
PROP	LAD Tyler Glasnow 9 k's	@ WSH	4/4/2026	AWAY FAVORITE	-	-	-	-	-
PROP	TB Steven Matz 8 k's	@ MIN	4/4/2026	AWAY FAVORITE	-	-	-	-	-
PROP	KC Seth Lugo 7 k's	vs. MIL	4/4/2026	HOME FAVORITE	-	-	-	-	-
PROP	ATL Bryce Elder 8 k's	@ ARI	4/4/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PHI Jesus Luzardo 11 k's	@ COL	4/4/2026	AWAY FAVORITE	-	-	-	-	-
PROP	SF Landen Roupp 7 k's	vs. NYM	4/4/2026	HOME FAVORITE	-	-	-	-	L
PROP	LAA Jack Kochanwicz 7 k's	vs. SEA	4/4/2026	DIVISION	-	-	-	-	-
PROP	CIN Chase Burns 9 k's	@ TEX	4/5/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	WSH Foster Griffin 6 k's	vs. LAD	4/5/2026	HOME UNDERDOG	-	-	-	-	-
PROP	KC Kris Bubic 8 k's	vs. MIL	4/5/2026	HOME FAVORITE	-	-	-	-	-
PROP	TEX Jack Leiter 9 k's	vs. CIN	4/5/2026	HOME FAVORITE	-	-	-	-	-
PROP	NYM Kodai Senga 7 k's	@ SF	4/5/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PIT Braxton Ashcraft 8 k's	vs. BAL	4/5/2026	HOME FAVORITE	-%	-	-	-	-
PROP	CWS Shane Smith 8 k's	vs. BAL	4/5/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	KC Kris Bubic 8 k's	vs. MIL	4/5/2026	HOME FAVORITE	-%	-	-	-	-
PROP	MIN Joe Ryan 7 k's	vs. DET	4/6/2026	DIVISION	-	-	-	-	-
PROP	ATL Chris Sale 7 k's	@ LAA	4/6/2026	AWAY FAVORITE	-	-	-	-	-
PROP	LAA Jose Soriano 10 k's	vs. ATL	4/6/2026	HOME UNDERDOG	-	-	-	-	-
PROP	CWS Shane Smith 8 k's	vs. BAL	4/7/2026	HOME UNDERDOG	-	-	-	-	-
PROP	SD Nick Pivetta 8 k's	@ PIT	4/7/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	MIL Jacob Misiorowski 10 k's	@ BOS	4/7/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	A's Aaron Civale 6 k's	@ NYY	4/7/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	NYY Cam Schlittler 7 k's	vs. A's	4/7/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIN Taj Bradley 10 k's	vs. DET	4/7/2026	DIVISION	-	-	-	-	-
PROP	TEX Nathan Eovaldi 7 k's	vs. SEA	4/7/2026	DIVISION	-	-	-	-	-
PROP	STL Matthew Liberatore 6 k's	@ WSH	4/7/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	TOR Dylan Cease 8 k's	vs. LAD	4/8/2026	HOME UNDERDOG	-	-	-	-	-
PROP	Randy Vasquez 8 k's	vs. COL	4/8/2026	DIVISION	-	-	-	-	-
PROP	NYY Cam Schlittler 8 k's	@ TB	4/12/2026	AWAY FAVORITE	-%	-	-	-	& DIVISION
PROP	TEX MacKenzie Gore 9 k's	vs. SEA	4/8/2026	DIVISION	-	-	-	-	-
PROP	A's Luis Severino 7 k's	@ NYY	4/8/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	NYM Nolan McLean 8 k's	vs. ARI	4/9/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	CWS Anthony Kay 6 k's	@ KC	4/9/2026	DIVISION	-	-	-	-	-
PROP	SD Randy Vasquez 8 k's	vs. COL	4/9/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	TB Steven Matz 7 k's	vs. NYY	4/10/2026	DIVISION	-	-	-	-	-
PROP	ARI Michael Soroka 10 k's	@ PHI	4/10/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	DET Keider Montero 7 k's	vs. MIA	4/10/2026	HOME FAVORITE	-	-	-	-	-
PROP	PHI Jesus Luzardo 8 k's	vs. ARI	4/10/2026	HOME FAVORITE	-	-	-	-	-
PROP	KC Kris Bubic 11 k's	vs. CWS	4/10/2026	DIVISION	-%	-	-	-	-
PROP	CHC Shota Imanaga 9 k's	vs. PIT	4/10/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	PIT Braxton Ashcraft 9 k's	@ CHC	4/11/2026	DIVISION	-%	-	-	-	-
PROP	KC Michael Wacha 7 k's	vs. CWS	4/11/2026	DIVISION	-%	-	-	-	-
PROP	MIN Taj Bradley 7 k's	@ TOR	4/12/2026	NO REST	-	-	-	-	-
PROP	TEX Jacob deGrom 9 k's	@ LAD	4/12/2026	AWAY UNDERDOG	-	-	-	-	W
PROP	TB Drew Rasmussen 7 k's	vs. NYY	4/12/2026	HOME UNDERDOG	-	-	-	-	& DIVISION
PROP	LAA Jose Soriano 10 k's	@ CIN	4/12/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	CIN Chase Burns 8 k's	@ TB	4/21/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	CHC Jameson Taillon 10 k's	vs. PIT	4/12/2026	DIVISION	-%	-	-	-	-
PROP	BAL Dean Kremer 9 k's	vs. ARI	4/13/2026	HOME FAVORITE	-	-	-	-	-
PROP	ARI Ryne Nelson 7 k's	@ BAL	4/13/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PHI Cristopher Sanchez 8 k's	vs. CHC	4/13/2026	HOME FAVORITE	-	-	-	-	-
PROP	MIN Mick Abel 10 k's	vs. BOS	4/14/2026	HOME UNDERDOG	-	-	-	-	-
PROP	LAA Reid Detmers 9 k's	@ NYY	4/14/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	NYY Ryan Weathers 10 k's	vs. LAA	4/14/2026	HOME FAVORITE	-%	-	-	-	-
PROP	CHC Shota Imanaga 11 k's	@ PHI	4/15/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	ATL Bryce Elder 7 k's	vs. MIA	4/15/2026	HOME FAVORITE	-%	-	-	-	
PROP	SD Randy Vasquez 6 k's	vs. SEA	4/15/2026	HOME	-%	-	-	-	& DIVISION
PROP	SD Walker Buehler 7 k's	vs. SEA	4/16/2026	HOME UNDERDOG	-	-	-	-	-
PROP	WSH Foster Griffin 7 k's	@ PIT	4/16/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	PIT Braxton Ashcraft 7 k's	vs. WSH	4/16/2026	HOME FAVORITE	-%	-	-	-	-
PROP	HOU Peter Lambert 8 k's	vs. STL	4/17/2026	HOME FAVORITE	-	-	-	-	-
PROP	STL Kyle Leahy 6 k's	@ HOU	4/17/2026	AWAY UNDERDOG	-	-	-	-	-
PROP	LAA Jose Soriano 8 k's	vs. SD	4/17/2026	HOME FAVORITE	-	-	-	-	-
PROP	SEA Logan Gilbert 7 k's	vs. TEX	4/17/2026	DIVISION	-	-	-	-	-
PROP	CLE Gavin Williams 11 k's	vs. BAL	4/18/2026	HOME FAVORITE	-%	-	-	-	-
PROP	WSH Cade Cavalli 5 k's	vs. SF	4/18/2026	HOME	-%	-	-		
PROP	WSH Andrew Alvarez 6 k's	@ TB	6/21/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	SD Michael King 6 k's	@ LAA	4/19/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIA Eury Perez 7 k's	vs. MIL	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	BOS Garrett Crochet 8 k's	vs. DET	4/19/2026	NO REST	-%	-	-	-	-
PROP	DET Framber Valdez 7 k's	@ BOS	4/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	HOU Mike Burrows 7 k's	vs. STL	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	KC Cole Ragans 6 k's	-	4/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIL Jacob Misiorowski 9 k's	@ MIA	4/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIN Bailey Ober 10 k's	vs. CIN	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	SF Robbie Ray 7 k's	@ WSH	4/19/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	CLE Joey Cantillo 6 k's	vs. BAL	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	CWS Noah Schultz 6 k's	@ A's	4/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	CLE Joey Cantillo 9 k's	vs. KC	4/8/2026	HOME UNDERDOG	-	-	-	-	-
PROP	A's Jeffrey Springs 7 k's	vs. CWS	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	LAA Walbert Urena 8 k's	vs. SD	4/19/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	TOR Dylan Cease 12 k's	@ LAA	4/20/2026	AWAY	-%	-	-	-	-
PROP	MIA Max Meyer 8 k's	vs. STL	4/20/2026	HOME FAVORITE	-%	-	-	-	-
PROP	BAL Kyle Bradish 7 k's	@ KC	4/20/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	PIT Carmen Mlodzinski 6 k's	@ TEX	4/21/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	NYY Will Warren 11 k's	vs. KC	4/18/2026	HOME FAVORITE	-%	-	-	-	-
PROP	MIA Chris Paddack 7 k's	vs. STL	4/21/2026	HOME FAVORITE	-%	-	-	-	-
PROP	NYM Nolan McLean 10 k's	vs. MIN	4/21/2026	HOME FAVORITE	-%	-	-	-	-
PROP	SEA Luis Castilllo 7 k's	vs. A's	4/21/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	LAD Shohei Ohtani 7 k's	@ SF	4/22/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	DET Casey Mize 7 k's	vs. MIL	4/22/2026	HOME FAVORITE	-%	-	-	-	-
PROP	HOU Peter Lambert 8 k's	@ CLE	4/22/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIN Connor Prielipp 6 k's	@ NYM	4/22/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	NYY Max Fried 9 k's	@ BOS	4/22/2026	DIVISION	-%	-	-	-	-
PROP	BOS Payton Tolle 11 k's	vs. NYY	4/23/2026	DIVISION	-%	-	-	-	-
PROP	WSH Cade Cavalli 10 k's	vs. ATL	4/23/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	LAD Tyler Glasnow 9 k's	@ SF	4/23/2026	DIVISION	-%	-	-	-	-
PROP	TEX Jacob deGrom 10 k's	vs. PIT	4/23/2026	HOME FAVORITE	-%	-	-	-	-
PROP	CWS Davis Martin 7 k's	@ ARI	4/23/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	ARI Michael Soroka 6 k's	vs. CWS	4/23/2026	HOME FAVORITE	-%	-	-	-	-
PROP	NYM Nolan McLean 10 k's	vs. COL	4/24/2026	HOME FAVORITE	-%	-	-	-	-
PROP	LAD Emmet Sheehan 10 k's	vs. CHC	4/24/2026	HOME FAVORITE	-%	-	-	-	-
PROP	STL Andre Pallante 8 k's	vs. SEA	4/24/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	PIT Mitch Keller 6 k's	@ MIL	4/25/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	HOU Mike Burrows 8 k's	vs. NYY	4/25/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	MIA Eury Perez 6 k's	@ SF	4/25/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	TB Shane McClanahan 7 k's	vs. MIN	4/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	KC Cole Ragans 11 k's	vs. LAA	4/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	WSH Jake Irvin 9 k's	@ CWS	4/25/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIL Jacob Misiorowski 9 k's	vs. PIT	4/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	TEX MacKenzie Gore 7 k's	vs. A's	4/25/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	CWS Noah Schultz 8 k's	vs. WSH	4/25/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	BOS Garrett Crochet  k's	@ BAL	4/25/2026	AWAY UNDERDOG					-
PROP	SD Michael King 8 k's	@ ARI	4/26/2026	AWAY FAVORITE	-%	-	-	-	& DIVISION
PROP	ATL Chris Sale 9 k's	vs. PHI	4/26/2026	HOME FAVORITE	-%	-	-	-	
PROP	WSH Foster Griffin 8 k's	@ CWS	4/26/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	CHC Shota Imanaga 6 k's	@ LAD	4/26/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	NYY Cam Schlittler 8 k's	@ TEX	4/28/2026	AWAY FAVORITE	-%	-	-	-	
PROP	CLE Gavin Williams 9 k's	vs. TB	4/29/2026	HOME FAVORITE	-%	-	-	-	
PROP	WSH Cade Cavalli 10 k's	@ NYM	4/29/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	NYY W Warren 9 k's	vs. BAL	5/1/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	NYY Ryan Weathers 8 k's	vs. KC	4/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	ATL Chris Sale 11 k's	@ COL	5/2/2026	AWAY FAVORITE					
PROP	ATL Bryce Elder 9 k's	@ SEA	5/5/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	CLE Gavin Williams 7 k's	@ KC	5/5/2026	AWAY FAVORITE	-%	-	-	-	
PROP	NYY	vs. TEX	5/6/2026	HOME FAVORITE	-%	-	-	-	
PROP	SEA Bryan Woo 9 k's	vs. ATL	5/6/2026	AWAY FAVORITE	-%	-	-	-	
PROP	CHC Shota Imanaga 10 k's	vs. CIN	5/7/2026	HOME FAVORITE	-%	-	-	-	
PROP	TOR Dylan Cease 11 k's	vs. LAA	5/8/2026	HOME FAVORITE	-%	-	-	-	
PROP	WSH Foster Griffin 9 k's	@ MIA	5/8/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	STL Michael McGreevy 9 k's	@ SD	5/8/2026	AWAY UNDERDOG	-%	-	-		
PROP	SD Randy Vasquez 6 k's	vs. STL	5/9/2026	HOME FAVORITE	-%	-	-	-	
PROP	ATL Spencer Strider 9 k's	@ LAD	5/9/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	SEA Luis Castilllo 6 k's	@ CWS	5/9/2026	AWAY FAVORITE	-%	-	-	-	
PROP	STL Dustin May 7 k's	@ SD	5/9/2026	AWAY UNDERDOG	-%	-	-		
PROP	ATL Bryce Elder 8 k's	@ LAD	5/10/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	SEA George Kirby 7 k's	@ HOU	5/11/2026	AWAY FAVORITE	-%	-	-	-	& DIVISION
PROP	SEA Bryan Woo 9 k's	@ HOU	5/12/2026	AWAY FAVORITE	-%	-	-	-	& DIVISION
PROP	TOR Dylan Cease 9 k's	vs. TB	5/13/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	ATL Chris Sale 8 k's	vs. CHC	5/14/2026	HOME FAVORITE	-%	-	-	-	
PROP	WSH Foster Griffin 7 k's	@ CIN	5/14/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	SEA Luis Castilllo 6 k's	@ HOU	5/14/2026	AWAY	-%	-	-	-	
PROP	NYY Cam Schlittler 9 k's	@ NYM	5/15/2026	AWAY	-%	-	-	-	
PROP	SD Walker Buehler 6 k's	@ SEA	5/16/2026	AWAY UNDERDOG	-%	-	-	-	& DIVISION
PROP	WSH Cade Cavalli 8 k's	vs. BAL	5/16/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	CLE Gavin Williams 7 k's	vs. CIN	5/17/2026	HOME FAVORITE	-%	-	-	-	
PROP	SEA George Kirby 6 k's	vs. SD	5/17/2026	HOME FAVORITE	-%	-	-	-	
PROP	SEA Emerson Hancock 14 k's	vs. KC	5/2/2026	HOME FAVORITE	-%	-	-	-	
PROP	TEX Nathan Eovaldi 8 k's	@ HOU	5/17/2026	AWAY FAVORITE	-%	-	-	-	
PROP	SD Michael King 9 k's	vs. LAD	5/18/2026	HOME UNDERDOG	-%	-	-	-	& DIVISION
PROP	SEA Bryan Woo 8 k's	vs. CWS	5/18/2026	HOME FAVORITE	-%	-	-	-	
PROP	NYY Ryan Weathers 7 k's	vs. TOR	5/18/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	TOR Dylan Cease 11 k's	@ NYY	5/19/2026	AWAY UNDERDOG	-%	-	-	-	& DIVISION
PROP	STL Matthew Liberatore 9 k's	vs. PIT	5/19/2026	HOME FAVORITE	-%	-	-		
PROP	NYY Cam Schlittler 7 k's	vs. TOR	5/20/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	ATL Chris Sale 8 k's	@ MIA	5/20/2026	AWAY FAVORITE					
PROP	ATL Spencer Strider 9 k's	@ MIA	5/21/2026	AWAY FAVORITE	-%	-	-	-	
PROP	WSH Cade Cavalli 9 k's	vs. NYM	5/21/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	STL Dustin May 7 k's	vs. PIT	5/21/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	CLE Gavin Williams 11 k's	@ PHI	5/22/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	TOR Kevin Gausman 8 k's	vs. PIT	5/22/2026	HOME FAVORITE	-%	-	-	-	
PROP	TOR Patrick Corbin 7 k's	vs. PIT	5/23/2026	HOME UNDERDOG	-%	-	-	-	
PROP	TEX MacKenzie Gore 7 k's	@ LAA	5/24/2026	AWAY UNDERDOG	-%	-	-	-	& DIVISION
PROP	LAA Reid Detmers 14 k's	vs. TEX	5/24/2026	HOME FAVORITE	-%	-	-	-	
PROP	TOR Dylan Cease 8 k's	vs. PIT	5/24/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIL Brandon Sproat 7 k's	vs. LAD	5/24/2026	HOME UNDERDOG	-%	-	-	-	-
PROP	CIN Nick Lodolo 7 k's	@ NYM	5/25/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	CHC Ben Brown 7 k's	@ PIT	5/25/2026	AWAY FAVORITE	-%	-	-	-	& DIVISION
PROP	STL Matthew Liberatore 10 k's	@ MIL	5/25/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIL Jacob Misiorowski 12 k's	vs. STL	5/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	NYM Nolan McLean 6 k's	vs. CIN	5/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	SF Landen Roupp 7 k's	vs. ARI	5/25/2026	HOME FAVORITE	-%	-	-	-	
PROP	LAD Emmet Sheehan 8 k's	vs. COL	5/25/2026	HOME FAVORITE	-%	-	-	-	-
PROP	SEA Luis Castilllo 6 k's	@ A's	5/25/2026	DIVISION	-%	-	-	-	
PROP	STL Michael McGreevy 6 k's	@ MIL	5/26/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	WSH Cade Cavalli 7 k's	@ CLE	5/26/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	STL Dustin May 9 k's	@ MIL	5/27/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	ATL Chris Sale 8 k's	@ BOS	5/28/2026	AWAY FAVORITE	-%	-	-	-	
PROP	SEA Bryan Woo 9 k's	vs. ARI	5/30/2026	HOME FAVORITE	-%	-	-	-	
PROP	NYY Ryan Weathers 10 k's	@ A's	5/30/2026	AWAY FAVORITE	-%	-	-	-	
PROP	PIT Braxton Ashcraft 11 k's	vs. MIN	5/31/2026	HOME FAVORITE	-%	-	-	-	-
PROP	MIN Zebby Matthews 7 k's	@ PIT	5/31/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	ATL Spencer Strider 8 k's	@ CIN	5/31/2026	AWAY FAVORITE	-%	-	-	-	
PROP	BOS Ranger Suarez 10 k's	@ CLE	5/31/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	WSH Cade Cavalli 6 k's	vs. MIA	6/1/2026	HOME FAVORITE	-%	-	-	-	-
PROP	SEA Emerson Hancock 7 k's	vs. NYM	6/1/2026	HOME FAVORITE	-%	-	-	-	
PROP	TEX Nathan Eovaldi 7 k's	@ STL	6/2/2026	AWAY	-%	-	-	-	
PROP	TOR Kevin Gausman 8 k's	@ ATL	6/2/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	STL Dustin May 9 k's	vs. TEX	6/2/2026	HOME	-%	-	-	-	
PROP	SEA Logan Gilbert 8 k's	vs. NYM	6/2/2026	HOME FAVORITE	-%	-	-	-	
PROP	PIT Paul Skenes 7 k's	@ HOU	6/3/2026	AWAY FAVORITE	-%	-	-	-	-
PROP	Cristopher Sanchez 8 k's	vs. SD	6/3/2026	HOME FAVORITE	-%	-	-	-	
PROP	CLE Gavin Williams 6 k's	@ NYY	6/3/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	LAA Walbert Urena 7 k's	vs. COL	6/3/2026	HOME FAVORITE	-%	-	-	-	
PROP	KC Stephen Kolek 8 k's	@ CIN	6/3/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	STL Andre Pallante 7 k's	vs. KC	5/17/2026	HOME FAVORITE	-%	-	-		
PROP	SEA Bryan Woo 7 k's	@ DET	6/5/2026	AWAY FAVORITE	-%	-	-	-	
PROP	TOR Dylan Cease 11 k's	vs. PHI	6/9/2026	HOME	-%	-	-	-	
PROP	SEA George Kirby 10 k's	@ BAL	6/10/2026	AWAY	-%	-	-	-	
PROP	CHC Shota Imanaga 7 k's	@ COL	6/10/2026	AWAY FAVORITE	-%	-	-	-	
PROP	TB Drew Rasmussen 13 k's	vs. BOS	6/10/2026	HOME FAVORITE	-%	-	-	& DIVISION	
PROP	NYY Carlos Rodon 7 k's	@ CLE	6/10/2026	AWAY FAVORITE	-%	-	-	-	
PROP	SEA George Kirby 10 k's	@ BAL	6/10/2026	AWAY	-%	-	-	-	
PROP	PHI Jesus Luzardo 8 k's	@ TOR	6/10/2026	AWAY FAVORITE	-%	-	-	-	
PROP	TEX MacKenzie Gore 6 k's	@ KC	6/10/2026	AWAY FAVORITE	-%	-	-	-	
PROP	CHC Shota Imanaga 7 k's	@ COL	6/10/2026	AWAY FAVORITE	-%	-	-	-	
PROP	COL Michael Lorenzen 7 k's	vs. CHC	6/10/2026	HOME UNDERDOG	-%	-	-	-	
PROP	LAA Reid Detmers 9 k's	vs. HOU	6/10/2026	HOME FAVORITE	-%	-	-	& DIVISION	
PROP	NYM Christian Scott 6 k's	vs. STL	6/11/2026	HOME FAVORITE	-%	-	-	-	
PROP	SD Griffin Canning 6 k's	@ BAL	6/12/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	BOS Sonny Gray 7 k's	vs. TEX	6/12/2026	HOME FAVORITE	-%	-	-	-	
PROP	CLE Tanner Bibee 8 k's	vs. DET	6/12/2026	HOME FAVORITE	-%	-	-	& DIVISION	
PROP	NYM Nolan McLean 6 k's	vs. ATL	6/12/2026	HOME FAVORITE	-%	-	-	-	
PROP	CWS Anthony Kay 7 k's	vs. LAD	6/12/2026	HOME UNDERDOG	-%	-	-	-	
PROP	MIL Jacob Misiorowski 15 k's	vs. PHI	6/12/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIN Joe Ryan 8 k's	vs. STL	6/12/2026	HOME FAVORITE	-%	-	-	-	
PROP	TB Shane McClanahan 7 k's	@ LAA	6/12/2026	AWAY FAVORITE	-%	-	-	-	
PROP	A's Gage Jump 6 k's	vs. COL	6/12/2026	HOME FAVORITE	-%	-	-	-	
PROP	PIT Bubba Chandler 6 k's	vs. MIA	6/13/2026	HOME FAVORITE	-%	-	-	-	
PROP	BAL Trey Gibson 7 k's	vs. SD	6/13/2026	HOME FAVORITE	-%	-	-	-	
PROP	CIN Rhett Lowder 6 k's	vs. ARI	6/13/2026	HOME UNDERDOG	-%	-	-	-	
PROP	CWS Sean Burke 6 k's	vs. LAD	6/13/2026	HOME UNDERDOG	-%	-	-	-	
PROP	BOS Ranger Suarez 7 k's	vs. TEX	6/13/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIL Shane Drohan 7 k's	vs. PHI	6/13/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIA Max Meyer 9 k's	@ PIT	6/14/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	PIT Paul Skenes 10 k's	vs. MIA	6/14/2026	HOME FAVORITE	-%	-	-	-	
PROP	LAD Emmet Sheehan 8 k's	@ CWS	6/14/2026	AWAY FAVORITE	-%	-	-	-	
PROP	MIN Taj Bradley 7 k's	vs. STL	6/14/2026	HOME FAVORITE	-%	-	-	-	
PROP	HOU Spencer Arrighetti 7 k's	@ KC	6/14/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	PIT Zack Wheeler 9 k's	vs. MIA	6/15/2026	HOME FAVORITE	-%	-	-	-	
PROP	CIN Chase Burns 7 k's	vs. NYM	6/15/2026	HOME FAVORITE	-%	-	-	-	
PROP	TEX MacKenzie Gore 10 k's	vs. MIN	6/15/2026	HOME FAVORITE	-%	-	-	-	
PROP	HOU Kai-Wei Teng 9 k's	vs. DET	6/15/2026	HOME FAVORITE	-%	-	-	-	
PROP	PHI Jesus Luzardo 9 k's	vs. MIA	6/16/2026	HOME FAVORITE	-%	-	-	-	
PROP	TOR Dylan Cease 7 k's	@ BOS	6/16/2026	AWAY FAVORITE	-%	-	-	& DIVISION	
PROP	BOS Payton Tolle 6 k's	vs. TOR	6/16/2026	HOME UNDERDOG	-%	-	-	& DIVISION	
PROP	COL Ryan Feltner 7 k's	@ CHC	6/16/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	PIT Mitch Keller 7 k's	@ A's	6/16/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	A's Jack Perkins 6 k's	vs. PIT	6/16/2026	HOME FAVORITE	-%	-	-	-	
PROP	SEA Logan Gilbert 10 k's	vs. BAL	6/16/2026	HOME FAVORITE	-%	-	-	-	
PROP	NYM Nolan McLean 9 k's	@ CIN	6/17/2026	AWAY FAVORITE	-%	-	-	-	
PROP	STL Kyle Leahy 7 k's	vs. SD	6/17/2026	HOME FAVORITE	-%	-	-	-	
PROP	NYY Carlos Rodon 7 k's	vs. CWS	6/17/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIL Brandon Sproat 6 k's	vs. CLE	6/17/2026	HOME FAVORITE	-%	-	-	-	
PROP	BAL Kyle Bradish 12 k's	@ SEA	6/17/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	PIT Braxton Ashcraft 7 k's	@ A's	6/17/2026	AWAY FAVORITE	-%	-	-	-	
PROP	CLE Parker Messick 9 k's	@ MIL	6/18/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	MIN Joe Ryan 7 k's	@ TEX	6/18/2026	AWAY FAVORITE	-%	-	-	-	
PROP	BAL Shane Baz 9 k's	@ SEA	6/18/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	SEA Bryan Woo 9 k's	vs. BAL	6/18/2026	HOME FAVORITE	-%	-	-	-	
PROP	NYY Ryan Weathers 8 k's	vs. CWS	6/18/2026	HOME FAVORITE	-%	-	-	-	
PROP	DET Tarik Skubal 8 k's	vs. CWS	6/19/2026	HOME FAVORITE	-%	-	-	-	& DIVISION
PROP	NYY Cam Schlittler 13 k's	vs. CIN	6/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	SF Landen Roupp 7 k's	@ MIA	6/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIL Jacob Misiorowski 7 k's	@ ATL	6/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	TEX Jacob deGrom 9 k's	vs. SD	6/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	Tanner Bibee 7 k's	@ HOU	6/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	HOU Tatsuya Imai 11 k's	vs. CLE	6/19/2026	HOME FAVORITE	-%	-	-	-	-
PROP	BAL Trey Gibson 8 k's	@ LAD	6/19/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	SEA Bryce Miller 7 k's	vs. BOS	6/19/2026	HOME	-%	-	-	-	-
PROP	CIN Andrew Abbott 6 k's	@ NYY	6/20/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	NYY Will Warren 8 k's	vs. CIN	6/20/2026	HOME FAVORITE	-%	-	-	-	
PROP	SD Walker Buehler 7 k's	@ TEX	6/20/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	MIL Kyle Harrison 7 k's	@ ATL	6/20/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	ATL Chris Sale 7 k's	vs. MIL	6/20/2026	HOME FAVORITE	-%	-	-	-	
PROP	MIA Max Meyer 7 k's	vs. SF	6/20/2026	HOME FAVORITE	-%	-	-	-	
PROP	CLE Joey Cantillo 9 k's	@ HOU	6/20/2026	AWAY FAVORITE	-%	-	-	-	
PROP	HOU Spencer Arrighetti 8 k's	vs. CLE	6/20/2026	HOME FAVORITE	-%	-	-	-	
PROP	PIT Paul Skenes 8 k's	@ COL	6/20/2026	AWAY FAVORITE	-%	-	-	-	
PROP	LAA Walbert Urena 6 k's	@ A's	6/20/2026	AWAY UNDERDOG	-%	-	-	-	& DIVISION
PROP	BOS Connelly Early 7 k's	@ SEA	6/20/2026	AWAY UNDERDOG	-%	-	-	-	-
PROP	MIA Ryan Gusto 6 k's	vs. SF	6/21/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	CIN Chase Burns 7 k's	@ NYY	6/21/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	MIL Robert Gasser 7 k's	@ ATL	6/21/2026	AWAY UNDERDOG	-%	-	-	-	
PROP	CIN Chase Burns 9 k's	vs. KC	6/3/2026	HOME FAVORITE	-%	-	-	-	
PROP	TEX Nathan Eovaldi 9 k's	vs. SD	6/21/2026	HOME FAVORITE	-%	-	-	-	
PROP	A's Jack Perkins 8 k's	vs. LAA	6/21/2026	HOME FAVORITE	-%	-	-	-	
PROP	SEA Logan Gilbert 8 k's	vs. BOS	6/21/2026	HOME FAVORITE	-%	-	-	-	
PROP	PHI Zack Wheeler 7 k's	vs. NYM	6/21/2026	HOME FAVORITE	-%	-	-	-	
`;

const extraTrendRows = [
  ...parseRawTrendRows(importedMlbTrendsRaw),
  ...parseRawTrendRows(fullPropHistoryRaw)
];


// V15: authoritative game-log outcome rows parsed from the green/red WINS/LOSSES sheet.
// WINS column => WIN evidence; LOSSES column => LOSS evidence; both => MIXED evidence.
const gameLogOutcomeRows = [
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "vs. ATL",
    "date": "2026-04-22",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH Z Littell",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH Z Littell"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "MIA",
    "style": "AtS",
    "description": "MIA",
    "opponent": "-",
    "date": "2026-04-19",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "vs. MIL; @ ATL",
    "additionalExamples": "@ DET",
    "notes": "-",
    "gameLogOutcome": "MIXED",
    "winEvidence": [
      "vs. MIL",
      "@ ATL"
    ],
    "lossEvidence": [
      "@ DET"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYM",
    "style": "AtS",
    "description": "NYM",
    "opponent": "@ CHC",
    "date": "2026-04-19",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "NYM T Myers / D Peterson",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "NYM T Myers / D Peterson"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_ALLOWED 10+",
    "description": "WSH",
    "opponent": "@ PIT",
    "date": "2026-04-14",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYM",
    "style": "PREV_SCRD 0",
    "description": "NYM",
    "opponent": "vs. A's",
    "date": "2026-04-11",
    "situation": "HOME FAVORITE",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "NYM K Senga",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "NYM K Senga"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "MIA",
    "style": "PREV_SCRD 0",
    "description": "MIA as away underdog",
    "opponent": "@ DET",
    "date": "2026-04-11",
    "situation": "NO REST",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PHI",
    "style": "PREV_SCRD 0",
    "description": "PHI",
    "opponent": "@ SF",
    "date": "2026-04-08",
    "situation": "AWAY FAVORITE",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "KC",
    "style": "AtS",
    "description": "KC",
    "opponent": "@ ATL",
    "date": "2026-03-29",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "SWEEP",
    "description": "STL",
    "opponent": "@ NYM",
    "date": "2026-06-11",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL H Dobbins",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL H Dobbins"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "AtS",
    "description": "CHC",
    "opponent": "@ COL",
    "date": "2026-06-11",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC E Cabrera",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC E Cabrera"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 10+",
    "description": "PIT",
    "opponent": "vs. LAD",
    "date": "2026-06-10",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT J Jones",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT J Jones"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_ALLOWED 0",
    "description": "STL",
    "opponent": "@ NYM",
    "date": "2026-06-10",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "STL A Pallante",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "STL A Pallante"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "AtS",
    "description": "CLE",
    "opponent": "vs. NYY",
    "date": "2026-06-10",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CLE P Messick",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CLE P Messick"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "@ CLE",
    "date": "2026-06-10",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY C Rodon",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY C Rodon"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "SWEEP",
    "description": "STL",
    "opponent": "vs. CIN",
    "date": "2026-06-07",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "STL M McGreevy",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "STL M McGreevy"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "PREV_ALLOWED 0",
    "description": "CLE",
    "opponent": "@ TEX",
    "date": "2026-06-07",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CLE J Cantillo",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CLE J Cantillo"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "SWEEP",
    "description": "WSH",
    "opponent": "@ ARI",
    "date": "2026-06-07",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH C Cavalli",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH C Cavalli"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "SWEEP",
    "description": "ATL",
    "opponent": "vs. PIT",
    "date": "2026-06-07",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "ATL B Elder",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "ATL B Elder"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_ALLOWED 0",
    "description": "SEA",
    "opponent": "@ DET",
    "date": "2026-06-07",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_ALLOWED 10+",
    "description": "TOR",
    "opponent": "vs. BAL",
    "date": "2026-06-06",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_SCRD 10+",
    "description": "STL",
    "opponent": "vs. CIN",
    "date": "2026-06-06",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "STL M Liberatore",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "STL M Liberatore"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "@ ARI",
    "date": "2026-06-06",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH Z Littell",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH Z Littell"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_SCRD 0",
    "description": "SD",
    "opponent": "vs. NYM",
    "date": "2026-06-06",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "PREV_SCRD 10+",
    "description": "BAL",
    "opponent": "@ TOR",
    "date": "2026-06-06",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL K Bradish",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL K Bradish"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_ALLOWED 10+",
    "description": "CHC",
    "opponent": "vs. SF",
    "date": "2026-06-06",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC B Brown",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC B Brown"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 10+",
    "description": "PIT",
    "opponent": "@ HOU",
    "date": "2026-06-04",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT J Jones",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT J Jones"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "AtS",
    "description": "TOR",
    "opponent": "@ ATL",
    "date": "2026-06-04",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "SWEEP",
    "description": "ATL",
    "opponent": "vs. TOR",
    "date": "2026-06-04",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "ATL C Sale",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "ATL C Sale"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "SWEEP",
    "description": "CLE",
    "opponent": "@ NYY",
    "date": "2026-06-04",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CLE S Cecconi",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CLE S Cecconi"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "AtS",
    "description": "SD",
    "opponent": "@ PHI",
    "date": "2026-06-04",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "AtS",
    "description": "NYY",
    "opponent": "vs. CLE",
    "date": "2026-06-04",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY C Rodon",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY C Rodon"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "AtS",
    "description": "CHC",
    "opponent": "vs. A's",
    "date": "2026-06-04",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC S Imanaga",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC S Imanaga"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_SCRD 10+",
    "description": "PIT",
    "opponent": "@ HOU",
    "date": "2026-06-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT P Skenes",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT P Skenes"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "AtS",
    "description": "STL",
    "opponent": "vs. TEX",
    "date": "2026-06-03",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "STL A Pallante",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "STL A Pallante"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "AtS",
    "description": "WSH",
    "opponent": "vs. MIA",
    "date": "2026-06-03",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TB",
    "style": "AtS",
    "description": "TB",
    "opponent": "vs. DET",
    "date": "2026-06-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TEX",
    "style": "SWEEP",
    "description": "TEX",
    "opponent": "@ STL",
    "date": "2026-06-03",
    "situation": "AWAY",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "SWEEP",
    "description": "SEA",
    "opponent": "vs. NYM",
    "date": "2026-06-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA G Kirby",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA G Kirby"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "SWEEP",
    "description": "PIT",
    "opponent": "vs. MIN",
    "date": "2026-05-31",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT B Ashcraft",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT B Ashcraft"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "KC",
    "style": "AtS",
    "description": "KC",
    "opponent": "@ TEX",
    "date": "2026-05-31",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "KC Michael Wacha",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "KC Michael Wacha"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "MIA",
    "style": "AtS",
    "description": "MIA",
    "opponent": "@ NYM",
    "date": "2026-05-31",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "SWEEP",
    "description": "ATL",
    "opponent": "@ CIN",
    "date": "2026-05-31",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "ATL S Strider",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "ATL S Strider"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CIN",
    "style": "AtS",
    "description": "CIN",
    "opponent": "vs. ATL",
    "date": "2026-05-31",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CIN Nick Lodolo",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CIN Nick Lodolo"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "SWEEP",
    "description": "SEA",
    "opponent": "vs. ARI",
    "date": "2026-05-31",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA B Miller",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA B Miller"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 10+",
    "description": "PIT",
    "opponent": "vs. CHC",
    "date": "2026-05-28",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT P Skenes",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT P Skenes"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "PREV_SCRD 0",
    "description": "ATL",
    "opponent": "@ BOS",
    "date": "2026-05-28",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "ATL C Sale",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "ATL C Sale"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_SCRD 10+",
    "description": "CHC",
    "opponent": "@ PIT",
    "date": "2026-05-28",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC C Rea",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC C Rea"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_SCRD 10+",
    "description": "PIT",
    "opponent": "vs. CHC",
    "date": "2026-05-27",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT B Chandler",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT B Chandler"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_SCRD 0",
    "description": "STL",
    "opponent": "@ MIL",
    "date": "2026-05-27",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL D May",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL D May"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "AtS",
    "description": "STL",
    "opponent": "@ MIL",
    "date": "2026-05-27",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL D May",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL D May"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "SWEEP",
    "description": "WSH",
    "opponent": "@ CLE",
    "date": "2026-05-27",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH PJ Poulin / M Mikolas",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH PJ Poulin / M Mikolas"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "AtS",
    "description": "CLE",
    "opponent": "vs. WSH",
    "date": "2026-05-27",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CLE G Williams",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CLE G Williams"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "SWEEP",
    "description": "SEA",
    "opponent": "@ A's",
    "date": "2026-05-27",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA L Gilbert",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA L Gilbert"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "SWEEP",
    "description": "BAL",
    "opponent": "vs. TB",
    "date": "2026-05-27",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "BAL T Gibson",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "BAL T Gibson"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_SCRD 10+",
    "description": "NYY",
    "opponent": "@ KC",
    "date": "2026-05-27",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY G Cole",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY G Cole"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "@ KC",
    "date": "2026-05-27",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY G Cole",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY G Cole"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_ALLOWED 10+",
    "description": "CHC",
    "opponent": "@ PIT",
    "date": "2026-05-27",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC J Taillon",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC J Taillon"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "@ CLE",
    "date": "2026-05-26",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH C Cavalli",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH C Cavalli"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_SCRD 0",
    "description": "SD",
    "opponent": "vs. PHI",
    "date": "2026-05-26",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "AtS",
    "description": "PIT",
    "opponent": "@ TOR",
    "date": "2026-05-24",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT M Keller",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT M Keller"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "PREV_SCRD 0",
    "description": "ATL",
    "opponent": "vs. WSH",
    "date": "2026-05-24",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "ATL M Perez",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "ATL M Perez"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "MIN",
    "style": "SWEEP",
    "description": "MIN",
    "opponent": "@ BOS",
    "date": "2026-05-24",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "MIN T Bradley",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "MIN T Bradley"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "PREV_SCRD 0",
    "description": "CLE",
    "opponent": "@ PHI",
    "date": "2026-05-24",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CLE P Messick",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CLE P Messick"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "SWEEP",
    "description": "TOR",
    "opponent": "vs. PIT",
    "date": "2026-05-24",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "TOR D Cease",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "TOR D Cease"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_SCRD 0",
    "description": "SEA",
    "opponent": "@ KC",
    "date": "2026-05-24",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA B Woo",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA B Woo"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "SWEEP",
    "description": "SD",
    "opponent": "vs. A's",
    "date": "2026-05-24",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "AtS",
    "description": "CHC",
    "opponent": "vs. HOU",
    "date": "2026-05-24",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CHC S Imanaga",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CHC S Imanaga"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "PREV_ALLOWED 0",
    "description": "CLE",
    "opponent": "@ PHI",
    "date": "2026-05-23",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CLE C Cecconi",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CLE C Cecconi"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_ALLOWED 0",
    "description": "SEA",
    "opponent": "@ KC",
    "date": "2026-05-23",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA G Kirby",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA G Kirby"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 0",
    "description": "PIT",
    "opponent": "@ STL",
    "date": "2026-05-21",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT B Chandler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT B Chandler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_SCRD 0",
    "description": "STL",
    "opponent": "vs. PIT",
    "date": "2026-05-21",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "AtS",
    "description": "BAL",
    "opponent": "@ TB",
    "date": "2026-05-20",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL K Bradish",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL K Bradish"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "AtS",
    "description": "CHC",
    "opponent": "vs. MIL",
    "date": "2026-05-20",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CHC E Cabrera",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CHC E Cabrera"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "PREV_SCRD 0",
    "description": "ATL",
    "opponent": "@ MIA",
    "date": "2026-05-19",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "ATL M Perez",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "ATL M Perez"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "PREV_ALLOWED 10+",
    "description": "BAL",
    "opponent": "@ TB",
    "date": "2026-05-19",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_ALLOWED 10+",
    "description": "WSH",
    "opponent": "vs. NYM",
    "date": "2026-05-19",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH F Griffin",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH F Griffin"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_ALLOWED 0",
    "description": "SD",
    "opponent": "vs. LAD",
    "date": "2026-05-19",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_SCRD 0",
    "description": "PIT",
    "opponent": "vs. PHI",
    "date": "2026-05-17",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT P Skenes",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT P Skenes"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "AtS",
    "description": "PIT",
    "opponent": "vs. PHI",
    "date": "2026-05-17",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT P Skenes",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT P Skenes"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "SWEEP",
    "description": "SD",
    "opponent": "@ SEA",
    "date": "2026-05-17",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD L Giolito",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD L Giolito"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "PREV_ALLOWED 10+",
    "description": "BAL",
    "opponent": "@ WSH",
    "date": "2026-05-17",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "BAL B Young",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "BAL B Young"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "AtS",
    "description": "BAL",
    "opponent": "@ WSH",
    "date": "2026-05-17",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "BAL B Young",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "BAL B Young"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "vs. BAL",
    "date": "2026-05-17",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH R Lovelady / M Mikolas",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH R Lovelady / M Mikolas"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "SWEEP",
    "description": "WSH",
    "opponent": "vs. BAL",
    "date": "2026-05-17",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH R Lovelady / M Mikolas",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH R Lovelady / M Mikolas"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "MIN",
    "style": "AtS",
    "description": "MIN",
    "opponent": "vs. NYM",
    "date": "2026-05-17",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "MIN B Ober",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "MIN B Ober"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "KC",
    "style": "AtS",
    "description": "KC",
    "opponent": "@ STL",
    "date": "2026-05-17",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "KC S KOLEK",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "KC S KOLEK"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "AtS",
    "description": "SEA",
    "opponent": "vs. SD",
    "date": "2026-05-17",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA G Kirby",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA G Kirby"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "SWEEP",
    "description": "STL",
    "opponent": "vs. KC",
    "date": "2026-05-17",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL A Pallante",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL A Pallante"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 10+",
    "description": "PIT",
    "opponent": "vs. PHI",
    "date": "2026-05-16",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT B Chandler",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT B Chandler"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_ALLOWED 0",
    "description": "SD",
    "opponent": "@ SEA",
    "date": "2026-05-16",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD W Buehler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD W Buehler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_SCRD 0",
    "description": "SEA",
    "opponent": "vs. SD",
    "date": "2026-05-16",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA L Gilbert",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA L Gilbert"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_SCRD 10+",
    "description": "CHC",
    "opponent": "@ CWS",
    "date": "2026-05-16",
    "situation": "AWAY",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CHC J Taillon",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CHC J Taillon"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 10+",
    "description": "PIT",
    "opponent": "vs. COL",
    "date": "2026-05-14",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT M Montgomery / C Mlodzinski",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT M Montgomery / C Mlodzinski"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "SWEEP",
    "description": "ATL",
    "opponent": "vs. CHC",
    "date": "2026-05-14",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "ATL C Sale",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "ATL C Sale"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "SWEEP",
    "description": "WSH",
    "opponent": "@ CIN",
    "date": "2026-05-14",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH F Griffin",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH F Griffin"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "AtS",
    "description": "CHC",
    "opponent": "@ ATL",
    "date": "2026-05-14",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC B Brown",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC B Brown"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "@ CIN",
    "date": "2026-05-13",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "SWEEP",
    "description": "CLE",
    "opponent": "vs. LAA",
    "date": "2026-05-13",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CLE P Messick",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CLE P Messick"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_SCRD 10+",
    "description": "SEA",
    "opponent": "@ HOU",
    "date": "2026-05-13",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA B Miller",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA B Miller"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "AtS",
    "description": "TOR",
    "opponent": "vs. TB",
    "date": "2026-05-13",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "TOR D Cease",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "TOR D Cease"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_SCRD 10+",
    "description": "PIT",
    "opponent": "@ SF",
    "date": "2026-05-10",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_SCRD 10+",
    "description": "TOR",
    "opponent": "vs. LAA",
    "date": "2026-05-10",
    "situation": "HOME",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "AtS",
    "description": "NYY",
    "opponent": "@ MIL",
    "date": "2026-05-10",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "NYY C Rodon",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "NYY C Rodon"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "AtS",
    "description": "BAL",
    "opponent": "vs. A's",
    "date": "2026-05-10",
    "situation": "HOME",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "BAL K Akin / C Bassitt",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "BAL K Akin / C Bassitt"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_SCRD 0",
    "description": "CHC",
    "opponent": "@ TEX",
    "date": "2026-05-10",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CHC J Taillon",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CHC J Taillon"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_ALLOWED 0",
    "description": "TOR",
    "opponent": "vs. LAA",
    "date": "2026-05-09",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "TOR T Yesavage",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "TOR T Yesavage"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_SCRD 0",
    "description": "NYY",
    "opponent": "@ MIL",
    "date": "2026-05-09",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_SCRD 0",
    "description": "SD",
    "opponent": "vs. STL",
    "date": "2026-05-09",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD R Vasquez",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD R Vasquez"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "AtS",
    "description": "SEA",
    "opponent": "vs. KC",
    "date": "2026-05-09",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA L Castillo",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA L Castillo"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_SCRD 10+",
    "description": "SEA",
    "opponent": "@ CWS",
    "date": "2026-05-09",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA L Castillo",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA L Castillo"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_ALLOWED 0",
    "description": "STL",
    "opponent": "@ SD",
    "date": "2026-05-09",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL D May",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL D May"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 0",
    "description": "PIT",
    "opponent": "@ ARI",
    "date": "2026-05-07",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT M Keller",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT M Keller"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "SWEEP",
    "description": "BAL",
    "opponent": "@ MIA",
    "date": "2026-05-07",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL C Povich",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL C Povich"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "vs. MIN",
    "date": "2026-05-07",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH J Irvin",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH J Irvin"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_SCRD 0",
    "description": "PIT",
    "opponent": "@ ARI",
    "date": "2026-05-06",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT P Skenes",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT P Skenes"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "AtS",
    "description": "TOR",
    "opponent": "@ TB",
    "date": "2026-05-06",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "TOR P Corbin",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "TOR P Corbin"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_SCRD 10+",
    "description": "SD",
    "opponent": "@ SF",
    "date": "2026-05-06",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_ALLOWED 10+",
    "description": "WSH",
    "opponent": "vs. MIN",
    "date": "2026-05-06",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH M Mikolas",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH M Mikolas"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_SCRD 10+",
    "description": "NYY",
    "opponent": "vs. BAL",
    "date": "2026-05-04",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY C Schlittler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY C Schlittler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "PREV_ALLOWED 10+",
    "description": "BAL",
    "opponent": "@ NYY",
    "date": "2026-05-04",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL S Baz",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL S Baz"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_SCRD 10+",
    "description": "PIT",
    "opponent": "vs. CIN",
    "date": "2026-05-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT B Ashcraft",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT B Ashcraft"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "SWEEP",
    "description": "PIT",
    "opponent": "vs. CIN",
    "date": "2026-05-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT B Ashcraft",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT B Ashcraft"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_SCRD 10+",
    "description": "TOR",
    "opponent": "@ MIN",
    "date": "2026-05-03",
    "situation": "AWAY",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "TOR T Yesavage",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "TOR T Yesavage"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "AtS",
    "description": "SD",
    "opponent": "vs. CWS",
    "date": "2026-05-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD G Canning",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD G Canning"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "SWEEP",
    "description": "CLE",
    "opponent": "@ A's",
    "date": "2026-05-03",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CLE P Messick",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CLE P Messick"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_ALLOWED 0",
    "description": "CHC",
    "opponent": "vs. ARI",
    "date": "2026-05-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC C Rea",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC C Rea"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "SWEEP",
    "description": "CHC",
    "opponent": "vs. ARI",
    "date": "2026-05-03",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC C Rea",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC C Rea"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "SWEEP",
    "description": "STL",
    "opponent": "vs. LAD",
    "date": "2026-05-03",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL D May",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL D May"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "SWEEP",
    "description": "ATL",
    "opponent": "vs. DET",
    "date": "2026-04-30",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "ATL B Elder",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "ATL B Elder"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 10+",
    "description": "WSH",
    "opponent": "@ NYM",
    "date": "2026-04-30",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH M Mikolas",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH M Mikolas"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 10+",
    "description": "PIT",
    "opponent": "vs. STL",
    "date": "2026-04-29",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT B Chandler",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT B Chandler"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_SCRD 10+",
    "description": "STL",
    "opponent": "@ PIT",
    "date": "2026-04-29",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "STL A Pallante",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "STL A Pallante"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_ALLOWED 0",
    "description": "TOR",
    "opponent": "vs. BOS",
    "date": "2026-04-29",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "TOR E Lauer",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "TOR E Lauer"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "@ TEX",
    "date": "2026-04-29",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "AtS",
    "description": "CLE",
    "opponent": "vs. TB",
    "date": "2026-04-29",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CLE G Williams",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CLE G Williams"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CLE",
    "style": "PREV_SCRD 0",
    "description": "CLE",
    "opponent": "vs. TB",
    "date": "2026-04-29",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CLE G Williams",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CLE G Williams"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_SCRD 0",
    "description": "WSH",
    "opponent": "@ NYM",
    "date": "2026-04-29",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "WSH C Cavalli",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "WSH C Cavalli"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_SCRD 0",
    "description": "TOR",
    "opponent": "vs. BOS",
    "date": "2026-04-28",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "TOR T Yesavage",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "TOR T Yesavage"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_ALLOWED 10+",
    "description": "SEA",
    "opponent": "@ MIN",
    "date": "2026-04-28",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA L Gilbert",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA L Gilbert"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "SWEEP",
    "description": "PIT",
    "opponent": "@ MIL",
    "date": "2026-04-26",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT C Mlodzinski",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT C Mlodzinski"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "AtS",
    "description": "STL",
    "opponent": "vs. SEA",
    "date": "2026-04-26",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL M McGreevy",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL M McGreevy"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "PREV_ALLOWED 10+",
    "description": "STL",
    "opponent": "vs. SEA",
    "date": "2026-04-26",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "STL M McGreevy",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "STL M McGreevy"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "@ HOU",
    "date": "2026-04-26",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "NYY L Gil",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "NYY L Gil"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_SCRD 10+",
    "description": "SEA",
    "opponent": "@ STL",
    "date": "2026-04-26",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA E Hancock",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA E Hancock"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "SWEEP",
    "description": "SEA",
    "opponent": "@ STL",
    "date": "2026-04-26",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA E Hancock",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA E Hancock"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "PREV_ALLOWED 10+",
    "description": "BAL",
    "opponent": "vs. BOS",
    "date": "2026-04-26",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL K Bradish",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL K Bradish"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_ALLOWED 10+",
    "description": "CHC",
    "opponent": "@ LAD",
    "date": "2026-04-26",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CHC S Imanaga",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CHC S Imanaga"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 0",
    "description": "PIT",
    "opponent": "@ MIL",
    "date": "2026-04-25",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "PIT M Keller",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "PIT M Keller"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "PREV_SCRD 10+",
    "description": "BAL",
    "opponent": "vs. BOS",
    "date": "2026-04-25",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL T Rogers",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL T Rogers"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "@ BOS",
    "date": "2026-04-23",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY C Schlittler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY C Schlittler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_ALLOWED 0",
    "description": "SD",
    "opponent": "@ COL",
    "date": "2026-04-22",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SD W Buehler",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SD W Buehler"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "SWEEP",
    "description": "TOR",
    "opponent": "@ LAA",
    "date": "2026-04-22",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "TOR E Lauer",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "TOR E Lauer"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BOS",
    "style": "PREV_SCRD 0",
    "description": "BOS as home underdog",
    "opponent": "-",
    "date": "2026-04-22",
    "situation": "DIVISION",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "vs. NYY",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "vs. NYY"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CIN",
    "style": "SWEEP",
    "description": "CIN",
    "opponent": "-",
    "date": "2026-04-22",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "@ MIN",
    "additionalExamples": "@ TB",
    "notes": "-",
    "gameLogOutcome": "MIXED",
    "winEvidence": [
      "@ MIN"
    ],
    "lossEvidence": [
      "@ TB"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "A's",
    "style": "SWEEP",
    "description": "A's as away underdog",
    "opponent": "-",
    "date": "2026-04-22",
    "situation": "DIVISION",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "@ SEA",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "@ SEA"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "LAA",
    "style": "AtS",
    "description": "LAA",
    "opponent": "vs. TOR",
    "date": "2026-04-22",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "LAA J Soriano",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "LAA J Soriano"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "AtS",
    "description": "SEA",
    "opponent": "vs. A's",
    "date": "2026-04-22",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA L Gilbert",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA L Gilbert"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_ALLOWED 0",
    "description": "NYY",
    "opponent": "@ BOS",
    "date": "2026-04-22",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY M Fried",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY M Fried"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "AtS",
    "description": "TOR",
    "opponent": "@ ARI",
    "date": "2026-04-19",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "TOR K Gausman",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "TOR K Gausman"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "HOU",
    "style": "AtS",
    "description": "HOU as home favorite",
    "opponent": "-",
    "date": "2026-04-19",
    "situation": "NO REST",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "MIN",
    "style": "AtS",
    "description": "MIN as home favorite",
    "opponent": "-",
    "date": "2026-04-19",
    "situation": "NO REST",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "vs. CIN",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "vs. CIN"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "vs. KC",
    "date": "2026-04-19",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY R Weather",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY R Weather"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "SWEEP",
    "description": "CHC",
    "opponent": "vs. NYM",
    "date": "2026-04-19",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "CHC J Assad",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "CHC J Assad"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PHI",
    "style": "AtS",
    "description": "PHI vs. DIVISION",
    "opponent": "-",
    "date": "2026-04-19",
    "situation": "NO REST",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "vs. ATL",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "vs. ATL"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ARI",
    "style": "SWEEP",
    "description": "ARI as home underdog",
    "opponent": "-",
    "date": "2026-04-19",
    "situation": "NO REST",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "vs. TOR",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "vs. TOR"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "SWEEP",
    "description": "ATL",
    "opponent": "@ PHI",
    "date": "2026-04-19",
    "situation": "AWAY",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "ATL G Holmes",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "ATL G Holmes"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_SCRD 10+",
    "description": "NYY",
    "opponent": "vs. KC",
    "date": "2026-04-19",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY R Weather",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY R Weather"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_SCRD 10+",
    "description": "CHC",
    "opponent": "vs. NYM",
    "date": "2026-04-18",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "WSH",
    "style": "PREV_ALLOWED 10+",
    "description": "WSH",
    "opponent": "vs. SF",
    "date": "2026-04-18",
    "situation": "HOME",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "WSH C Cavalli",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "WSH C Cavalli"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_SCRD 0",
    "description": "SD",
    "opponent": "@ LAA",
    "date": "2026-04-18",
    "situation": "AWAY",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD G Marquez",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD G Marquez"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "PREV_SCRD 0",
    "description": "SEA",
    "opponent": "vs. TEX",
    "date": "2026-04-18",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SEA G Kirby",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SEA G Kirby"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "PREV_ALLOWED 0",
    "description": "ATL",
    "opponent": "@ PHI",
    "date": "2026-04-18",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "ATL C Sale",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "ATL C Sale"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "STL",
    "style": "SWEEP",
    "description": "STL",
    "opponent": "@ HOU",
    "date": "2026-04-17",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "STL M Liberatore",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "STL M Liberatore"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "PREV_ALLOWED 0",
    "description": "PIT",
    "opponent": "vs. WSH",
    "date": "2026-04-16",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT B Ashcraft",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT B Ashcraft"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "SWEEP",
    "description": "SD",
    "opponent": "vs. SEA",
    "date": "2026-04-16",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD W Buehler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD W Buehler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "AtS",
    "description": "SEA",
    "opponent": "@ SD",
    "date": "2026-04-16",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA L Castillo",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA L Castillo"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_SCRD 10+",
    "description": "CHC",
    "opponent": "@ PHI",
    "date": "2026-04-15",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "ATL",
    "style": "PREV_ALLOWED 10+",
    "description": "ATL",
    "opponent": "vs. MIA",
    "date": "2026-04-14",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "ATL R Lopez",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "ATL R Lopez"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_ALLOWED 10+",
    "description": "CHC",
    "opponent": "@ PHI",
    "date": "2026-04-14",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "UNDEFINED",
    "winEvidence": [],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "PIT",
    "style": "SWEEP",
    "description": "PIT",
    "opponent": "@ CHC",
    "date": "2026-04-12",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "PIT B Chandler",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "PIT B Chandler"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "AtS",
    "description": "NYY",
    "opponent": "@ TB",
    "date": "2026-04-12",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "NYY C Schlittler",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "NYY C Schlittler"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_SCRD 10+",
    "description": "TOR",
    "opponent": "vs. MIN",
    "date": "2026-04-11",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "TOR E Lauer",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "TOR E Lauer"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "CHC",
    "style": "PREV_SCRD 0",
    "description": "CHC",
    "opponent": "vs. PIT",
    "date": "2026-04-11",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "CHC E Cabrera",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "CHC E Cabrera"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "AtS",
    "description": "TOR",
    "opponent": "vs. LAD",
    "date": "2026-04-08",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "TOR D Cease",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "TOR D Cease"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "SWEEP",
    "description": "BAL",
    "opponent": "@ CWS",
    "date": "2026-04-08",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "BAL K Bradish",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "BAL K Bradish"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SEA",
    "style": "AtS",
    "description": "SEA",
    "opponent": "@ TEX",
    "date": "2026-04-08",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SEA B Woo",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SEA B Woo"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "PREV_ALLOWED 0",
    "description": "SD",
    "opponent": "@ PIT",
    "date": "2026-04-07",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "SD N Pivetta",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "SD N Pivetta"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "TOR",
    "style": "PREV_ALLOWED 10+",
    "description": "TOR",
    "opponent": "vs. LAD",
    "date": "2026-04-07",
    "situation": "HOME UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "TOR K Gausman",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "TOR K Gausman"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "AtS",
    "description": "BAL",
    "opponent": "@ PIT",
    "date": "2026-04-05",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "BAL C Bassitt",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "BAL C Bassitt"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "vs. MIA",
    "date": "2026-04-05",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "-",
    "additionalExamples": "NYY M Fried",
    "notes": "-",
    "gameLogOutcome": "LOSS",
    "winEvidence": [],
    "lossEvidence": [
      "NYY M Fried"
    ],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_ALLOWED 0",
    "description": "NYY",
    "opponent": "@ SEA",
    "date": "2026-04-01",
    "situation": "AWAY UNDERDOG",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY Cam Schlittler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY Cam Schlittler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "SD",
    "style": "AtS",
    "description": "SD",
    "opponent": "vs. SF",
    "date": "2026-04-01",
    "situation": "-",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "SD N Pivetta",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "SD N Pivetta"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "BAL",
    "style": "AtS",
    "description": "BAL",
    "opponent": "vs. TEX",
    "date": "2026-04-01",
    "situation": "HOME FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "BAL T Rogers",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "BAL T Rogers"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_ALLOWED 0",
    "description": "NYY",
    "opponent": "@ SF",
    "date": "2026-03-28",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY W Warren",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY W Warren"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "SWEEP",
    "description": "NYY",
    "opponent": "@ SF",
    "date": "2026-03-28",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY W Warren",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY W Warren"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  },
  {
    "team": "NYY",
    "style": "PREV_ALLOWED 0",
    "description": "NYY",
    "opponent": "@ SF",
    "date": "2026-03-27",
    "situation": "AWAY FAVORITE",
    "hitRate": "-%",
    "duration": "-",
    "supportingGames": "NYY Cam Schlittler",
    "additionalExamples": "-",
    "notes": "-",
    "gameLogOutcome": "WIN",
    "winEvidence": [
      "NYY Cam Schlittler"
    ],
    "lossEvidence": [],
    "outcomeSource": "WINS/LOSSES columns from green/red sheet"
  }
];

function trendMergeKey(row){
  return [row.date,row.team,String(row.style||'').toUpperCase(),row.opponent,row.situation].join('|');
}
function mergeTrendRowsWithOutcomes(baseRows, outcomeRows){
  const map = new Map();
  baseRows.forEach(row => map.set(trendMergeKey(row), {...row}));
  outcomeRows.forEach(row => {
    const key = trendMergeKey(row);
    const existing = map.get(key);
    if(existing){
      map.set(key, {...existing, ...row, hitRate: existing.hitRate || row.hitRate, duration: existing.duration || row.duration, notes: existing.notes && existing.notes !== '-' ? existing.notes : row.notes});
    } else {
      map.set(key, row);
    }
  });
  return Array.from(map.values());
}

const trendRows = mergeTrendRowsWithOutcomes([...baseTrendRows, ...extraTrendRows], gameLogOutcomeRows);

const importSummary = {
  version: 'V4 expanded MLB trends import',
  importedRows: extraTrendRows.length,
  baseRows: baseTrendRows.length,
  totalRows: trendRows.length,
  note: 'Rows with unclear 10+ meaning remain stored by Style and Description without forced classification. ATS/AtS is displayed as AtS (avoid the sweep). WINS/LOSSES are displayed as Supporting Games and Additional Examples.'
};


const trackedPickResults = [

  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "NYY / DET U8",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Today's pick: Yankees / Tigers under 8.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Status pending until graded.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "NYY ML",
    "odds": "-133",
    "score": null,
    "status": "PENDING",
    "edge": "No CLV note included by user.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "No CLV noted.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Top Play",
    "pick": "F5 TB -0.5",
    "odds": "-135",
    "score": 7.1,
    "status": "PENDING",
    "edge": "Cleanest pitching-first favorite on the slate; Drew Rasmussen edge over Michael Wacha with Tampa F5 run-prevention advantage.",
    "units": "",
    "breakdown": {
      "Starting Pitcher Edge": 8.7,
      "Opponent Early Offense": 7.4,
      "Team F5 Split Performance": 6.8,
      "Ballpark + Weather": 5.0,
      "Lineup Construction": 5.8,
      "Travel / Environment": 5.0,
      "Market Inefficiency": 6.1,
      "Umpire / Micro": 5.0
    },
    "why": [
      "Drew Rasmussen: 80 IP, 2.59 ERA, 0.88 WHIP, 27% K, 23% K-BB on the June 22 chart.",
      "Rasmussen first time through order: .254 OBP / .339 SLG / .593 OPS.",
      "Michael Wacha trails materially: 18.8% K, 7.3% BB, 4.33 xFIP, and .711 OPS first time through.",
      "Tampa F5 profile is good at 2.23 scored / 2.01 allowed while Kansas City is weaker at 2.19 scored / 2.71 allowed.",
      "Model price edge is positive but narrower at -135."
    ]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "KC / TB U7.5",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Today's pick: Royals / Rays under 7.5.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Status pending until graded.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "MIA ML",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "Today's pick: Miami moneyline.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Status pending until graded.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "F5 MIL -0.5",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Starred F5 Milwaukee plus-money play from 06/22 slate.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Starred by user.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Top Play",
    "pick": "F5 CHC -0.5",
    "odds": "+105",
    "score": 6.9,
    "status": "PENDING",
    "edge": "Best plus-money favorite on the board; Shota Imanaga graded materially above Kodai Senga.",
    "units": "",
    "breakdown": {
      "Starting Pitcher Edge": 7.6,
      "Opponent Early Offense": 7.3,
      "Team F5 Split Performance": 6.1,
      "Ballpark + Weather": 4.7,
      "Lineup Construction": 6.2,
      "Travel / Environment": 5.0,
      "Market Inefficiency": 7.8,
      "Umpire / Micro": 5.0
    },
    "why": [
      "At +105, implied probability is only 48.8%; model makes Chicago roughly 52-53% F5 favorite.",
      "Imanaga profile: 24% K rate, 18% K-BB, with opponent wOBA context ranked 25th on chart.",
      "Senga profile: 9.00 ERA, 1.88 WHIP, 10% K-BB against a Cubs offense ranked 10th in opposing context.",
      "Cubs F5 runs: 2.53 scored / 2.61 allowed; Mets: 2.30 scored / 2.71 allowed.",
      "Weather in New York adds volatility, but plus-money price clears the issue."
    ]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "NYM ML",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Today's pick: Mets moneyline.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Status pending until graded.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "CLE ML",
    "odds": "-110",
    "score": null,
    "status": "LIVE",
    "edge": "Today's pick: Guardians moneyline. User marked live at entry.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Marked LIVE by user.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "LAD / MIN O9.5",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Today's pick: Dodgers / Twins over 9.5.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Status pending until graded.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Tracked",
    "pick": "STL ML",
    "odds": "-144",
    "score": null,
    "status": "PENDING",
    "edge": "Today's pick: Cardinals moneyline.",
    "units": "",
    "breakdown": {},
    "why": ["User-entered 06/22 tracked pick.", "Status pending until graded.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Series",
    "pick": "Astros Series ML",
    "odds": "+133",
    "score": null,
    "status": "PENDING",
    "edge": "Series edge: Houston +9.0%. Vegas no-vig: TOR 58.5% / HOU 41.5%. Model: TOR 49.5% / HOU 50.5%. Decision: BET ASTROS +133.",
    "units": "",
    "breakdown": {},
    "why": ["Series Board play from 06/22 update.", "Model makes Houston a slight series favorite while market prices Houston as the dog.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Series",
    "pick": "Twins Series ML",
    "odds": "+170",
    "score": null,
    "status": "PENDING",
    "edge": "Series edge: Minnesota +8.9%. Vegas no-vig: LAD 64.3% / MIN 35.7%. Model: LAD 55.4% / MIN 44.6%. Decision: BET TWINS +170.",
    "units": "",
    "breakdown": {},
    "why": ["Series Board play from 06/22 update.", "Dodgers priced aggressively versus model probability.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Series Lean",
    "pick": "Guardians Series ML",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Series edge: Cleveland +5.9%. Vegas no-vig: CLE 51.1% / CWS 48.9%. Model: CLE 57.0% / CWS 43.0%. Decision: LEAN GUARDIANS -115.",
    "units": "",
    "breakdown": {},
    "why": ["Series Board lean from 06/22 update.", "Model edge is positive but lower than the Astros/Twins series bets.", "No unit size supplied; excluded from units/ROI"]
  },
  {
    "slate": "June 22, 2026",
    "rank": "Series Lean",
    "pick": "Reds Series ML",
    "odds": "+141",
    "score": null,
    "status": "PENDING",
    "edge": "Series edge: Cincinnati +4.9%. Vegas no-vig: MIL 59.8% / CIN 40.2%. Model: MIL 54.9% / CIN 45.1%. Decision: LEAN REDS +141.",
    "units": "",
    "breakdown": {},
    "why": ["Brandon Woodruff is returning from a 7-week IL stint with right shoulder inflammation.", "Woodruff had a 6.00 ERA in rehab and last MLB start was April 30.", "First start back in Great American Ball Park adds volatility and creates a Reds series lean."]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "CWS / DET o* 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "LIVE",
    "edge": "CWS / DET o* 8.5 -115 NOW 9 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +157; SCRD 0",
    "odds": "+157",
    "score": null,
    "status": "LIVE",
    "edge": "Cin ml +157; SCRD 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Cin / NYY o** 9.5 -105, .5U",
    "odds": "-105",
    "score": null,
    "status": "LIVE",
    "edge": "Cin / NYY o** 9.5 -105, .5U & LIVE",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "Units: .5U"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Tor_ ml +105; ALLOWED 10+",
    "odds": "+105",
    "score": null,
    "status": "LIVE",
    "edge": "Tor_ ml +105; ALLOWED 10+ - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Tor / CHC o 9 -120",
    "odds": "-120",
    "score": null,
    "status": "LIVE",
    "edge": "Tor / CHC o 9 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Sd / Tex u 7.5 -105",
    "odds": "-105",
    "score": null,
    "status": "LIVE",
    "edge": "Sd / Tex u 7.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Sd ml +115",
    "odds": "+115",
    "score": null,
    "status": "LIVE",
    "edge": "Sd ml +115",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -133",
    "odds": "-133",
    "score": null,
    "status": "LIVE",
    "edge": "Atl ml -133 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "WSH / tb o 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "LIVE",
    "edge": "WSH / tb o 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "F5 phi -.5 -135",
    "odds": "-135",
    "score": null,
    "status": "LIVE",
    "edge": "F5 phi -.5 -135",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "MIA ml -136; no CLV",
    "odds": "-136",
    "score": null,
    "status": "LIVE",
    "edge": "MIA ml -136; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +120",
    "odds": "+120",
    "score": null,
    "status": "LIVE",
    "edge": "CLE ml +120",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "F5 HOU -.5 -110",
    "odds": "-110",
    "score": null,
    "status": "LIVE",
    "edge": "F5 HOU -.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "BOS / sea o 7.5 +100",
    "odds": "+100",
    "score": null,
    "status": "LIVE",
    "edge": "BOS / sea o 7.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "F5 lad -.5 -150",
    "odds": "-150",
    "score": null,
    "status": "LIVE",
    "edge": "F5 lad -.5 -150",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 20, 2026",
    "rank": "Tracked",
    "pick": "Sea ml -125",
    "odds": "-125",
    "score": null,
    "status": "LIVE",
    "edge": "Sea ml -125",
    "units": "",
    "breakdown": {},
    "why": [
      "Today's ungraded bet marked live by rule.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "Tor / CHC o 7.5 -107",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / CHC o 7.5 -107",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "F5 mil -.5 -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "F5 mil -.5 -130 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "Cle +.5 +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Cle +.5 +105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "F5 pit -.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 pit -.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "Stl ml -120, .35U",
    "odds": "-120",
    "score": null,
    "status": "LOSS",
    "edge": "Stl ml -120, .35U❌ & LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "CWS series +150, .3U",
    "odds": "+150",
    "score": null,
    "status": "PENDING",
    "edge": "CWS series +150, .3U",
    "units": ".3U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .3U"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "Sd series +154, .25U",
    "odds": "+154",
    "score": null,
    "status": "PENDING",
    "edge": "Sd series +154, .25U",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 19, 2026",
    "rank": "Tracked",
    "pick": "Min series +144 , .65U",
    "odds": "+144",
    "score": null,
    "status": "PENDING",
    "edge": "Min series +144 , .65U",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .65U"
    ]
  },
  {
    "slate": "June 18, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +119; AtS, .25U",
    "odds": "+119",
    "score": null,
    "status": "SUCCESS",
    "edge": "CLE ml +119; AtS, .25U✅",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 18, 2026",
    "rank": "Tracked",
    "pick": "Tex ml +105; 10+",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Tex ml +105; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 18, 2026",
    "rank": "Tracked",
    "pick": "F5 min -.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 min -.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 18, 2026",
    "rank": "Tracked",
    "pick": "F5 mil -.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "F5 mil -.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 18, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5 +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5 +105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 18, 2026",
    "rank": "Tracked",
    "pick": "Bal / sea o* 8 -103, .6U",
    "odds": "-103",
    "score": null,
    "status": "LOSS",
    "edge": "Bal / sea o* 8 -103, .6U NOW 7.5 -115, .65U❌",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "Units: .65U"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "Cin ml* +111; SWEEP",
    "odds": "+111",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml* +111; SWEEP - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "Kc ml +114; AtS",
    "odds": "+114",
    "score": null,
    "status": "PENDING",
    "edge": "Kc ml +114; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "Kc / WSH o 10.5 -110, .425U",
    "odds": "-110",
    "score": null,
    "status": "LOSS",
    "edge": "Kc / WSH o 10.5 -110, .425U❌",
    "units": ".425U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .425U"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "F5 WSH -.5 +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 WSH -.5 +105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "MIA ml -105; no CLV",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "MIA ml -105; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "F5 mia -.5 +120, .4U",
    "odds": "+120",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 mia -.5 +120, .4U✅",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "MIA / phi o 9.5 -110, .25U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "MIA / phi o 9.5 -110, .25U✅",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "Sd ml +105; AtS",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml +105; AtS - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "Tb ml +127; no CLV; AtS & 10+",
    "odds": "+127",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml +127; no CLV; AtS & 10+ - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "Tb / lad u 7.5 -125; no CLV",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Tb / lad u 7.5 -125; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "F5 NYY -.5 -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "F5 NYY -.5 -130",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 17, 2026",
    "rank": "Tracked",
    "pick": "F5 sea -.5 +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 sea -.5 +105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "MIA ml +148",
    "odds": "+148",
    "score": null,
    "status": "PENDING",
    "edge": "MIA ml +148",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "F5 CWS +.5 -125",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CWS +.5 -125",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "Sf / atl u_ 9 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / atl u_ 9 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "F5 CLE +.5 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CLE +.5 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -162",
    "odds": "-162",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -162",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "CLE / mil o 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / mil o 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -103",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -103",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "Sd / stl u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / stl u 8 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "Pit ml +121, .6U",
    "odds": "+121",
    "score": null,
    "status": "SUCCESS",
    "edge": "Pit ml +121, .6U ✅",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "June 16, 2026",
    "rank": "Tracked",
    "pick": "F5 tb +.5 -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "F5 tb +.5 -130",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 15, 2026",
    "rank": "Tracked",
    "pick": "MIA / phi o_ 7.5 -107",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / phi o_ 7.5 -107 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 15, 2026",
    "rank": "Tracked",
    "pick": "Sd / stl o 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / stl o 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 15, 2026",
    "rank": "Tracked",
    "pick": "Tb / lad u 9 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Tb / lad u 9 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 15, 2026",
    "rank": "Tracked",
    "pick": "Tb ml +137, .4U",
    "odds": "+137",
    "score": null,
    "status": "LOSS",
    "edge": "Tb ml +137, .4U❌",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Mia / pit o 7 -118",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Mia / pit o 7 -118 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Sea / wsh o 10 -119",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / wsh o 10 -119",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Sd / bal o 10 -115, .35U",
    "odds": "-115",
    "score": null,
    "status": "LOSS",
    "edge": "Sd / bal o 10 -115, .35U ❌& LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Nyy ml -125",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Nyy ml -125 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Det ml -110; AtS",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Det ml -110; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Atl ml +105, .65U",
    "odds": "+105",
    "score": null,
    "status": "LOSS",
    "edge": "Atl ml +105, .65U❌",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .65U"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Phi ml -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Phi ml -120 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Phi / mil u 6.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / mil u 6.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Hou ml +100; SWEEP",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Hou ml +100; SWEEP",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Chc ml +115; AtS",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "Chc ml +115; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Chc / sf o 8 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Chc / sf o 8 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 14, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -120; AtS",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -120; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "Stl / min u 9 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Stl / min u 9 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "NYY ml -130, .4U",
    "odds": "-130",
    "score": null,
    "status": "SUCCESS",
    "edge": "NYY ml -130, .4U✅",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "Sd / bal o 10 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / bal o 10 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "DET / CLE u 7.5 -102",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "DET / CLE u 7.5 -102",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +115",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml +115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -101, .8U",
    "odds": "-101",
    "score": null,
    "status": "SUCCESS",
    "edge": "Atl ml -101, .8U✅",
    "units": ".8U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .8U"
    ]
  },
  {
    "slate": "June 13, 2026",
    "rank": "Tracked",
    "pick": "F5 Tex -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 Tex -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "MIA / pit o 8.5 -102, .6U",
    "odds": "-102",
    "score": null,
    "status": "SUCCESS",
    "edge": "MIA / pit o 8.5 -102, .6U✅",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "Sd / bal o 9.5 +100, .25U",
    "odds": "+100",
    "score": null,
    "status": "SUCCESS",
    "edge": "Sd / bal o 9.5 +100, .25U✅ & LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "Sd ml* +110; no CLV",
    "odds": "+110",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml* +110; no CLV",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "Ari / cin o* 9.5 -116",
    "odds": "-116",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / cin o* 9.5 -116",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "F5 tb -.5 -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "F5 tb -.5 -130",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "F5 atl +.5 -135",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl +.5 -135",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "Atl / NYM o 8 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / NYM o 8 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "Atl ml* +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml* +105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "NYY ml_ -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "NYY ml_ -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 12, 2026",
    "rank": "Tracked",
    "pick": "F5 bal -.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "F5 bal -.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 11, 2026",
    "rank": "Tracked",
    "pick": "Ari ml_ +105; AtS & 10+",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Ari ml_ +105; AtS & 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 11, 2026",
    "rank": "Tracked",
    "pick": "Stl ml** +128; SWEEP, .5U",
    "odds": "+128",
    "score": null,
    "status": "LOSS",
    "edge": "Stl ml** +128; SWEEP, .5U❌",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "Marked loser by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "June 11, 2026",
    "rank": "Tracked",
    "pick": "Min ml +107",
    "odds": "+107",
    "score": null,
    "status": "PENDING",
    "edge": "Min ml +107",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 11, 2026",
    "rank": "Tracked",
    "pick": "F5 lad -.5 -130, .675U",
    "odds": "-130",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 lad -.5 -130, .675U✅",
    "units": ".675U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .675U"
    ]
  },
  {
    "slate": "June 11, 2026",
    "rank": "Tracked",
    "pick": "CWS ml +100; SWEEP",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "CWS ml +100; SWEEP",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "BOS ml +135; AtS",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "BOS ml +135; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "F5 CLE -.5 +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CLE -.5 +105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "CLE ml -110; AtS",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml -110; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "F5 sea -.5 +120",
    "odds": "+120",
    "score": null,
    "status": "PENDING",
    "edge": "F5 sea -.5 +120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "WSH ml -110; SWEEP",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml -110; SWEEP - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "F5 WSH +.5 +125, .6U",
    "odds": "+125",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 WSH +.5 +125, .6U✅",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "Min ml +145",
    "odds": "+145",
    "score": null,
    "status": "PENDING",
    "edge": "Min ml +145",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 10, 2026",
    "rank": "Tracked",
    "pick": "Stl ml +114, .7U",
    "odds": "+114",
    "score": null,
    "status": "SUCCESS",
    "edge": "Stl ml +114, .7U✅",
    "units": ".7U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .7U"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "F5 sea +.5",
    "odds": "-",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 sea +.5 - LIVE ✅",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "Sea / bal u 8.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / bal u 8.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "Bal ml_ +104",
    "odds": "+104",
    "score": null,
    "status": "PENDING",
    "edge": "Bal ml_ +104",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "F5 pit -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 pit -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "NYY / CLE u 8.5 -104",
    "odds": "-104",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / CLE u 8.5 -104",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml +100 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "Tb ml** +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml** +100 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "Ari / Mia o 7.5 -118",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / Mia o 7.5 -118 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "MIA ml -151; no CLV",
    "odds": "-151",
    "score": null,
    "status": "PENDING",
    "edge": "MIA ml -151; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "Stl / NYM o_ 7.5 -121",
    "odds": "-121",
    "score": null,
    "status": "PENDING",
    "edge": "Stl / NYM o_ 7.5 -121",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "Tex / kc o 9.5 -103",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / kc o 9.5 -103 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 9, 2026",
    "rank": "Tracked",
    "pick": "F5 cin -.5 -125, .35U",
    "odds": "-125",
    "score": null,
    "status": "LOSS",
    "edge": "F5 cin -.5 -125, .35U❌ & LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "F5 sea -.5 +105, .3U",
    "odds": "+105",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 sea -.5 +105, .3U✅",
    "units": ".3U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .3U"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "Bal ml +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Bal ml +105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "BOS / tb o 8 -102, .25U",
    "odds": "-102",
    "score": null,
    "status": "LOSS",
    "edge": "BOS / tb o 8 -102, .25U❌",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "F5 phi -.5 -140",
    "odds": "-140",
    "score": null,
    "status": "PENDING",
    "edge": "F5 phi -.5 -140 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "F5 HOU -.5 +110, .75U",
    "odds": "+110",
    "score": null,
    "status": "LOSS",
    "edge": "F5 HOU -.5 +110, .75U❌",
    "units": ".75U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .75U"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "HOU / LAA u 9 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "HOU / LAA u 9 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "F5 cin +.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 cin +.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +122",
    "odds": "+122",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +122",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "WSH / sf o 8 -115, 1U",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / sf o 8 -115, 1U",
    "units": "1U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: 1U"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +125; no CLV",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +125; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 8, 2026",
    "rank": "Tracked",
    "pick": "Mil ml -150; NO CLV",
    "odds": "-150",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml -150; NO CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "No CLV noted.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "CWS / phi o 9 -116",
    "odds": "-116",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / phi o 9 -116 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "PIT ML +132; AtS",
    "odds": "+132",
    "score": null,
    "status": "PENDING",
    "edge": "PIT ML +132; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "Bal / tor o 8.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / tor o 8.5 +100 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "A’s ml* -109; AtS & 10+, .5U",
    "odds": "-109",
    "score": null,
    "status": "SUCCESS",
    "edge": "A’s ml* -109; AtS & 10+, .5U✅",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "Marked winner by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "A’s / HOU o 9 -112",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / HOU o 9 -112",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "Min ml -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Min ml -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +124",
    "odds": "+124",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +124",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "Cin / stl o 9.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / stl o 9.5 +100 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "CLE / Tex u 7.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / Tex u 7.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 7, 2026",
    "rank": "Tracked",
    "pick": "F5 mil -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 mil -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 6, 2026",
    "rank": "Tracked",
    "pick": "F5 sea -.5 +100, .25U",
    "odds": "+100",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 sea -.5 +100, .25U✅",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 6, 2026",
    "rank": "Tracked",
    "pick": "Sea / DET u 9 -118",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / DET u 9 -118",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 6, 2026",
    "rank": "Tracked",
    "pick": "Cin / stl o 9 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / stl o 9 -115 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "CWS / phi o 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / phi o 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "BOS / NYY o _ 8 -114",
    "odds": "-114",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / NYY o _ 8 -114",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "Bal / tor o 8 -116",
    "odds": "-116",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / tor o 8 -116",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "F5 tb -.5 -100, .75U",
    "odds": "-100",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 tb -.5 -100, .75U✅",
    "units": ".75U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .75U"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "Tb / Mia o 7.5 -120, .65U",
    "odds": "-120",
    "score": null,
    "status": "LOSS",
    "edge": "Tb / Mia o 7.5 -120, .65U❌",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .65U"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "Pit / atl u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / atl u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "F5 sd -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 sd -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "F5 CLE -.5 +105, .35U",
    "odds": "+105",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 CLE -.5 +105, .35U✅",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "June 5, 2026",
    "rank": "Tracked",
    "pick": "CLE / Tex u 7.5 -110, .4U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "CLE / Tex u 7.5 -110, .4U✅",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "June 3, 2026",
    "rank": "Tracked",
    "pick": "MIA / WSH o 8 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / WSH o 8 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 3, 2026",
    "rank": "Tracked",
    "pick": "F5 min -.5 -125, .6U",
    "odds": "-125",
    "score": null,
    "status": "LOSS",
    "edge": "F5 min -.5 -125, .6U❌",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "June 3, 2026",
    "rank": "Tracked",
    "pick": "F5 sea -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 sea -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 3, 2026",
    "rank": "Tracked",
    "pick": "F5 cin -.5 -120, .6U",
    "odds": "-120",
    "score": null,
    "status": "LOSS",
    "edge": "F5 cin -.5 -120, .6U❌",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "June 3, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5 -110, .25U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "F5 atl -.5 -110, .25U ✅& LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "June 2, 2026",
    "rank": "Tracked",
    "pick": "F5 Ari +.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 Ari +.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 2, 2026",
    "rank": "Tracked",
    "pick": "F5 sd +.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 sd +.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 2, 2026",
    "rank": "Tracked",
    "pick": "MIA / WSH o 9 -110, .65U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "MIA / WSH o 9 -110, .65U ✅& LIVE✅",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .65U"
    ]
  },
  {
    "slate": "June 2, 2026",
    "rank": "Tracked",
    "pick": "Kc / cin o 9 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / cin o 9 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 2, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -119, .8U",
    "odds": "-119",
    "score": null,
    "status": "SUCCESS",
    "edge": "Atl ml -119, .8U✅",
    "units": ".8U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .8U"
    ]
  },
  {
    "slate": "June 1, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -163; no CLV",
    "odds": "-163",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -163; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 1, 2026",
    "rank": "Tracked",
    "pick": "MIA / WSH o_ 8 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / WSH o_ 8 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 1, 2026",
    "rank": "Tracked",
    "pick": "Mil ml -152",
    "odds": "-152",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml -152",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 1, 2026",
    "rank": "Tracked",
    "pick": "Mil -1.5 +146",
    "odds": "+146",
    "score": null,
    "status": "PENDING",
    "edge": "Mil -1.5 +146",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 1, 2026",
    "rank": "Tracked",
    "pick": "CWS ml +135",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "CWS ml +135",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "June 1, 2026",
    "rank": "Tracked",
    "pick": "Col / LAA u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Col / LAA u 8 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 31, 2026",
    "rank": "Tracked",
    "pick": "Min / pit o* 7.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Min / pit o* 7.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 31, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 31, 2026",
    "rank": "Tracked",
    "pick": "DET / CWS u 8 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "DET / CWS u 8 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 31, 2026",
    "rank": "Tracked",
    "pick": "F5 mil -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 mil -.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 31, 2026",
    "rank": "Tracked",
    "pick": "Kc / Tex u 7.5 -106",
    "odds": "-106",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / Tex u 7.5 -106 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 30, 2026",
    "rank": "Tracked",
    "pick": "CWS* ml +101",
    "odds": "+101",
    "score": null,
    "status": "PENDING",
    "edge": "CWS* ml +101 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 30, 2026",
    "rank": "Tracked",
    "pick": "Min / pit o 8.5 -105, .35U",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Min / pit o 8.5 -105, .35U & LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 30, 2026",
    "rank": "Tracked",
    "pick": "MIL ml -113; NO CLV",
    "odds": "-113",
    "score": null,
    "status": "PENDING",
    "edge": "MIL ml -113; NO CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "No CLV noted.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 30, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5 +115, .5U",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5 +115, .5U NOW +120, .55U",
    "units": ".55U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .55U"
    ]
  },
  {
    "slate": "May 30, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -133; no CLV, .25U",
    "odds": "-133",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -133; no CLV, .25U NOW -125, .3U",
    "units": ".3U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .3U"
    ]
  },
  {
    "slate": "May 30, 2026",
    "rank": "Tracked",
    "pick": "Atl / cin o 9.5, .65U",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / cin o 9.5, .65U & LIVE",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .65U"
    ]
  },
  {
    "slate": "May 29, 2026",
    "rank": "Tracked",
    "pick": "Atl / cin o 9.5 -105 , .6U",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / cin o 9.5 -105 , .6U NOW -115",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .6U"
    ]
  },
  {
    "slate": "May 29, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -144; no CLV",
    "odds": "-144",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -144; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 29, 2026",
    "rank": "Tracked",
    "pick": "Min / pit o 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Min / pit o 8 -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 29, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -101",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -101 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 29, 2026",
    "rank": "Tracked",
    "pick": "Kc / Tex u 7.5 -115, .65U",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / Tex u 7.5 -115, .65U",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .65U"
    ]
  },
  {
    "slate": "May 28, 2026",
    "rank": "Tracked",
    "pick": "LAA ML +114",
    "odds": "+114",
    "score": null,
    "status": "PENDING",
    "edge": "LAA ML +114",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 28, 2026",
    "rank": "Tracked",
    "pick": "F5 pit -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 pit -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 28, 2026",
    "rank": "Tracked",
    "pick": "F5 CWS -.5, .6U",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CWS -.5, .6U & LIVE",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .6U"
    ]
  },
  {
    "slate": "May 28, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -135",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -135 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 28, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "MIA / tor o 7.5 -117",
    "odds": "-117",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / tor o 7.5 -117 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "WSH / CLE o 8 -103",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / CLE o 8 -103",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Stl ml +125; AtS",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "Stl ml +125; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "A’s ml +110; AtS",
    "odds": "+110",
    "score": null,
    "status": "PENDING",
    "edge": "A’s ml +110; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Sf ml +110; AtS",
    "odds": "+110",
    "score": null,
    "status": "PENDING",
    "edge": "Sf ml +110; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Sd ml +135; AtS",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml +135; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -111; AtS",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -111; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "F5 pit -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 pit -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "CHC / pit o 8.5 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "CHC / pit o 8.5 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -125; no CLV",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -125; no CLV",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "F5 cin +.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 cin +.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +100; SWEEP",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +100; SWEEP",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "F5 NYY -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 NYY -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "Kc ml +125; AtS & 10+",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "Kc ml +125; AtS & 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 27, 2026",
    "rank": "Tracked",
    "pick": "NYY / Kc u 9 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / Kc u 9 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "WSH / CLE o 7.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / CLE o 7.5 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +111; no CLV",
    "odds": "+111",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +111; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "Tb / bal o 8.5 -119",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "Tb / bal o 8.5 -119 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "TB ML -113; no CLV",
    "odds": "-113",
    "score": null,
    "status": "PENDING",
    "edge": "TB ML -113; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "DET ml -135",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "DET ml -135",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "CHC / pit o 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "CHC / pit o 8 -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "F5 atl +.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl +.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -110, .35U",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -110, .35U & LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "MIA / tor o 7.5 -124",
    "odds": "-124",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / tor o 7.5 -124 NOW 8 -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "F5 cin -.5 -105 , .65U",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "F5 cin -.5 -105 , .65U NOW +100, .7U",
    "units": ".7U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .7U"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "F5 NYY -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 NYY -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "NYY / kc u 8.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / kc u 8.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "Phi / sd u 7.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / sd u 7.5 -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 26, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "F5 pit -.5 -130, .25U",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "F5 pit -.5 -130, .25U & LIVE NOW -125 - LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "F5 phi -.5 -135",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "F5 phi -.5 -135 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "F5 CHC -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CHC -.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "Stl ml -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Stl ml -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "Hou / chc o 7.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Hou / chc o 7.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "CWS ml -105; no CLV",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CWS ml -105; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 23, 2026",
    "rank": "Tracked",
    "pick": "WSH / atl o 8.5 -115, 1U",
    "odds": "-115",
    "score": null,
    "status": "LOSS",
    "edge": "WSH / atl o 8.5 -115, 1U❌",
    "units": "1U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: 1U"
    ]
  },
  {
    "slate": "May 22, 2026",
    "rank": "Tracked",
    "pick": "Astros series +161",
    "odds": "+161",
    "score": null,
    "status": "PENDING",
    "edge": "Astros series +161",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 22, 2026",
    "rank": "Tracked",
    "pick": "Cardinals series +105, .75U",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Cardinals series +105, .75U",
    "units": ".75U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .75U"
    ]
  },
  {
    "slate": "May 22, 2026",
    "rank": "Tracked",
    "pick": "Mariners -140, .35U",
    "odds": "-140",
    "score": null,
    "status": "PENDING",
    "edge": "Mariners -140, .35U",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 22, 2026",
    "rank": "Tracked",
    "pick": "F5 mil +.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 mil +.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 22, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +154",
    "odds": "+154",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml +154",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "Cin / phi o_ 9.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / phi o_ 9.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "F5 Cin +.5 -125",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "F5 Cin +.5 -125",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "Bal / tb o 8.5 -108",
    "odds": "-108",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / tb o 8.5 -108",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "Col ml +105; 10+",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "Col ml +105; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "Sf / Ari u 8.5 -104",
    "odds": "-104",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / Ari u 8.5 -104 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "CWS / sea o 7.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / sea o 7.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "F5 NYY -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 NYY -.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "BOS / kc u 7.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / kc u 7.5 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "Mil ml +101; AtS, .35U",
    "odds": "+101",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml +101; AtS, .35U NOW -107, .25U & LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Avoid the Sweep context.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 20, 2026",
    "rank": "Tracked",
    "pick": "Stl ml -115, .25U",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Stl ml -115, .25U",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "F5 CLE -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CLE -.5 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "f5 mil -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "f5 mil -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "F5 BOS -.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "F5 BOS -.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "Atl / mia o 8 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / mia o 8 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "Cin / phi o 8.5 -115, .55U",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / phi o 8.5 -115, .55U & LIVE",
    "units": ".55U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .55U"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "Bal ml +100; 10+",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Bal ml +100; 10+ - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +118; 10+",
    "odds": "+118",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +118; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "HOU / min o* 8.5 -104, .75U",
    "odds": "-104",
    "score": null,
    "status": "LOSS",
    "edge": "HOU / min o* 8.5 -104, .75U NOW -115, .675U❌",
    "units": ".675U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "Units: .675U"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "Stl ml -118; no CLV",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Stl ml -118; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "Sf ml +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Sf ml +100 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 19, 2026",
    "rank": "Tracked",
    "pick": "CWS / sea o* 7.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / sea o* 7.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "F5 CHC -.5 -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "F5 CHC -.5 -130",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "F5 tb -.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "F5 tb -.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "Cin / phi o 9 -112, .25U",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / phi o 9 -112, .25U & LIVE NOW 10 -105 - LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "Atl / mia u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / mia u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "BOS / kc o 9 -116",
    "odds": "-116",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / kc o 9 -116",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "Mil / CHC o 10.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Mil / CHC o 10.5 -115 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "A’s ml -135",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "A’s ml -135",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 18, 2026",
    "rank": "Tracked",
    "pick": "CWS / sea o 7.5 +105",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / sea o 7.5 +105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 17, 2026",
    "rank": "Tracked",
    "pick": "F5 pit -.5 +110, .35U",
    "odds": "+110",
    "score": null,
    "status": "LOSS",
    "edge": "F5 pit -.5 +110, .35U ❌",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 17, 2026",
    "rank": "Tracked",
    "pick": "Bal / WSH o 10",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / WSH o 10 -  LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 17, 2026",
    "rank": "Tracked",
    "pick": "BOS / atl u 8.5 -104",
    "odds": "-104",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / atl u 8.5 -104",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 17, 2026",
    "rank": "Tracked",
    "pick": "Tor / DET u 7.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / DET u 7.5 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 17, 2026",
    "rank": "Tracked",
    "pick": "Cin / CLE o 8.5 -105, .25U",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / CLE o 8.5 -105, .25U NOW -120 - LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "DET ml -125",
    "odds": "-125",
    "score": null,
    "status": "LOSS",
    "edge": "DET ml -125 NOW -113, .35U❌",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "KC / stl u 9 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "KC / stl u 9 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Phi / pit u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / pit u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Bal / WSH o 10 -110, .85U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "Bal / WSH o 10 -110, .85U✅",
    "units": ".85U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .85U"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -142",
    "odds": "-142",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -142",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Cin / CLE o 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / CLE o 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Tex / HOU o 8 -102",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / HOU o 8 -102",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Mil ml -125",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml -125 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -125 , .35U",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -125 , .35U NOW -120",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 16, 2026",
    "rank": "Tracked",
    "pick": "F5 atl -.5 +124, .3U",
    "odds": "+124",
    "score": null,
    "status": "PENDING",
    "edge": "F5 atl -.5 +124, .3U",
    "units": ".3U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .3U"
    ]
  },
  {
    "slate": "May 15, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 15, 2026",
    "rank": "Tracked",
    "pick": "CWS ml +125",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "CWS ml +125",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 15, 2026",
    "rank": "Tracked",
    "pick": "Tex / HOU o 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / HOU o 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "WSH / cin o 8 -119",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / cin o 8 -119",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +135; SWEEP",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +135; SWEEP",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "DET ml +145; SWEEP, .5U",
    "odds": "+145",
    "score": null,
    "status": "PENDING",
    "edge": "DET ml +145; SWEEP, .5U NOW +136, .45U",
    "units": ".45U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Sweep trend context.",
      "Units: .45U"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "DET / NYM u_ 7.5 -118",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "DET / NYM u_ 7.5 -118",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "Sd ml +124",
    "odds": "+124",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml +124",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "Sd / mil o 8 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / mil o 8 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 14, 2026",
    "rank": "Tracked",
    "pick": "Sea / HOU o 9 -109, .675U",
    "odds": "-109",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / HOU o 9 -109, .675U & LIVE",
    "units": ".675U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .675U"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "NYY / bal u 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / bal u 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "LAA ml +122; AtS",
    "odds": "+122",
    "score": null,
    "status": "PENDING",
    "edge": "LAA ml +122; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "WSH / cin o 9 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / cin o 9 -115 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "Tb ml_ +135; SWEEP",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml_ +135; SWEEP",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "Sd / mil u 7 -105, .4U",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / mil u 7 -105, .4U NOW -125, .25U & LIVE",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "Sd ml +125, .35U",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml +125, .35U NOW +137, .4U",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .4U"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "Kc / CWS u* 8 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / CWS u* 8 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 13, 2026",
    "rank": "Tracked",
    "pick": "MIA / min o* 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / min o* 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "LAA / CLE u_ 8.5 -109",
    "odds": "-109",
    "score": null,
    "status": "PENDING",
    "edge": "LAA / CLE u_ 8.5 -109",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "WSH / cin o 10 -112, 1.25U",
    "odds": "-112",
    "score": null,
    "status": "SUCCESS",
    "edge": "WSH / cin o 10 -112, 1.25U NOW 9.5 -115 ✅",
    "units": "1.25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: 1.25U"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "Phi / BOS u 8.5 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / BOS u 8.5 -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -120 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "CHC / atl o 9 -108, .35U",
    "odds": "-108",
    "score": null,
    "status": "LOSS",
    "edge": "CHC / atl o 9 -108, .35U NOW 8.5 -110, .4U❌",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "MIA / min o 9 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / min o 9 +100 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "Ari / Tex o_ 8 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / Tex o_ 8 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "Stl ml +125",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "Stl ml +125",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 12, 2026",
    "rank": "Tracked",
    "pick": "CWS: 5%",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "CWS: 5%",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 11, 2026",
    "rank": "Tracked",
    "pick": "NYY / bal u 9 -116",
    "odds": "-116",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / bal u 9 -116",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 11, 2026",
    "rank": "Tracked",
    "pick": "Ari / Tex u 7.5 -110 -> Tex 64.9% as home favorite since 2025",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / Tex u 7.5 -110 —> Tex 64.9% as home favorite since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 11, 2026",
    "rank": "Tracked",
    "pick": "Tex ml -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "Tex ml -130",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 9, 2026",
    "rank": "Tracked",
    "pick": "LAA ml +151",
    "odds": "+151",
    "score": null,
    "status": "PENDING",
    "edge": "LAA ml +151",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 8, 2026",
    "rank": "Tracked",
    "pick": "HOU / cin u 9 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "HOU / cin u 9 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 8, 2026",
    "rank": "Tracked",
    "pick": "Cin ml -128",
    "odds": "-128",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml -128",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 8, 2026",
    "rank": "Tracked",
    "pick": "Col / phi u 7.5 -121",
    "odds": "-121",
    "score": null,
    "status": "PENDING",
    "edge": "Col / phi u 7.5 -121 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "Tor / tb u 7.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / tb u 7.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "Atl / sea o 8 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / sea o 8 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "Bal / Mia o 8.5 -112, .65U",
    "odds": "-112",
    "score": null,
    "status": "SUCCESS",
    "edge": "Bal / Mia o 8.5 -112, .65U✅",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .65U"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "BOS / DET o 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / DET o 8 -110,NOW 8.5 -115 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "DET ml -120: 10+ & AtS",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "DET ml -120: 10+ & AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +115; 10+",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +115; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "CLE / kc u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / kc u 8 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +109",
    "odds": "+109",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml +109",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 6, 2026",
    "rank": "Tracked",
    "pick": "Pit / Ari u 8 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / Ari u 8 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "Tor / tb o 8 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / tb o 8 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "Tor ml +101",
    "odds": "+101",
    "score": null,
    "status": "PENDING",
    "edge": "Tor ml +101",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "Bal ml +180; 10+",
    "odds": "+180",
    "score": null,
    "status": "PENDING",
    "edge": "Bal ml +180; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "Bal / NYY u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / NYY u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "CLE / kc u 9 -109, .35U",
    "odds": "-109",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / kc u 9 -109, .35U & LIVE NOW -105",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .35U"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "Mil ml -116, .4U",
    "odds": "-116",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml -116, .4U",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .4U"
    ]
  },
  {
    "slate": "May 4, 2026",
    "rank": "Tracked",
    "pick": "Mil -1.5 +160, .325U",
    "odds": "+160",
    "score": null,
    "status": "PENDING",
    "edge": "Mil -1.5 +160, .325U NOW +145, .25U",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Units: .25U"
    ]
  },
  {
    "slate": "May 3, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +100; AtS",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +100; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 2, 2026",
    "rank": "Tracked",
    "pick": "Bal / NYY u 8.5. -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / NYY u 8.5. -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 2, 2026",
    "rank": "Tracked",
    "pick": "Kyle Bradish o 5.5 k’s -136 + Ryan Weathers O 6.5 k’s -> +179, .32U",
    "odds": "-136",
    "score": null,
    "status": "PENDING",
    "edge": "Kyle Bradish o 5.5 k’s -136 + Ryan Weathers O 6.5 k’s —> +179, .32U",
    "units": ".32U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .32U"
    ]
  },
  {
    "slate": "May 2, 2026",
    "rank": "Tracked",
    "pick": "Ari / CHC o 7.5 +110",
    "odds": "+110",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / CHC o 7.5 +110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 2, 2026",
    "rank": "Tracked",
    "pick": "CLE / A’s u 10.5 -114",
    "odds": "-114",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / A’s u 10.5 -114 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 2, 2026",
    "rank": "Tracked",
    "pick": "Carmen Mlodzinski I 4.5 k’s -125",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Carmen Mlodzinski I 4.5 k’s -125",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 2, 2026",
    "rank": "Tracked",
    "pick": "Sf ml -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sf ml -115 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 1, 2026",
    "rank": "Tracked",
    "pick": "Ari / CHC o 7 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / CHC o 7 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 1, 2026",
    "rank": "Tracked",
    "pick": "Tex / DET o 7.5 -119 -> DET 87.5% w/ rest advantage since 2025, DET 54.4% as home favorite since 2025 det 69.2% w/ 1 day rest since 2025",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / DET o 7.5 -119 —> DET 87.5% w/ rest advantage since 2025, DET 54.4% as home favorite since 2025 det 69.2% w/ 1 day rest since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 1, 2026",
    "rank": "Tracked",
    "pick": "Cin / pit u 8 -110 -> cin 58.8% vs. division since 2025, pit 57.4% vs. division since 2025",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / pit u 8 -110 —> cin 58.8% vs. division since 2025, pit 57.4% vs. division since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 1, 2026",
    "rank": "Tracked",
    "pick": "Bal / NYY u 8.5 +100 -> NYY 59.1% as home favorite since 2025, NYY 58.1% vs division since 2025, bal 53.7% vs division since 2025, bal 56.5% as away underdog since 2025",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / NYY u 8.5 +100 —> NYY 59.1% as home favorite since 2025, NYY 58.1% vs division since 2025, bal 53.7% vs division since 2025, bal 56.5% as away underdog since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 1, 2026",
    "rank": "Tracked",
    "pick": "Jack Flaherty o 5.5 k’s +116",
    "odds": "+116",
    "score": null,
    "status": "PENDING",
    "edge": "Jack Flaherty o 5.5 k’s +116,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "May 1, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +117, .35U",
    "odds": "+117",
    "score": null,
    "status": "LOSS",
    "edge": "Cin ml +117, .35U NOW +115❌",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "AtS DET ml +104",
    "odds": "+104",
    "score": null,
    "status": "PENDING",
    "edge": "AtS DET ml +104",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "DET / atl u 8.5 -115 -> atl 57.5% after a win since 2025, atl 58.1% as home favorite since 2025, .3U",
    "odds": "-115",
    "score": null,
    "status": "SUCCESS",
    "edge": "DET / atl u 8.5 -115 —> atl 57.5% after a win since 2025, atl 58.1% as home favorite since 2025, .3U ✅NOW 9 -120, .35U",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "Phi C Sanchez O 6.5 k’s +105, .4U",
    "odds": "+105",
    "score": null,
    "status": "SUCCESS",
    "edge": "Phi C Sanchez O 6.5 k’s +105, .4U NOW +100, .35U✅",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "Stl / pit u 7.5 -122",
    "odds": "-122",
    "score": null,
    "status": "PENDING",
    "edge": "Stl / pit u 7.5 -122",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "Col / cin u 9 -112 -> cin 59% w/ no rest since 2025, cin 66% as home favorite since 2025, cin 53.7% after a loss since 2025",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "Col / cin u 9 -112 —> cin 59% w/ no rest since 2025, cin 66% as home favorite since 2025, cin 53.7% after a loss since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "Kc / A’s u 9.5 -105 -> kc 58.6% w/ no rest since 2025, kc 56.5% as away underdog since 2025, kc 56.8% after a loss since 2025, A’s 56% after a win since 2025, A’s 53.9% as home favorite since 2025, A’s 56% after a win since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / A’s u 9.5 -105 —> kc 58.6% w/ no rest since 2025, kc 56.5% as away underdog since 2025, kc 56.8% after a loss since 2025, A’s 56% after a win since 2025, A’s 53.9% as home favorite since 2025, A’s 56% after a win since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "Tor / min o 8 -105 -> tor 55.2% w/ no rest since 2025, tor 54.8% as away favorite since 2025, min 53.3% as home underdog since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / min o 8 -105 —> tor 55.2% w/ no rest since 2025, tor 54.8% as away favorite since 2025, min 53.3% as home underdog since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 30, 2026",
    "rank": "Tracked",
    "pick": "GRAND SALAMI UNDER",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "GRAND SALAMI UNDER",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 29, 2026",
    "rank": "Tracked",
    "pick": "LAA / CWS o 8.5 -120, .5U",
    "odds": "-120",
    "score": null,
    "status": "LOSS",
    "edge": "LAA / CWS o 8.5 -120, .5U❌",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "April 29, 2026",
    "rank": "Tracked",
    "pick": "Min ml +113",
    "odds": "+113",
    "score": null,
    "status": "PENDING",
    "edge": "Min ml +113",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 29, 2026",
    "rank": "Tracked",
    "pick": "NYY / Tex u 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / Tex u 8.5 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 28, 2026",
    "rank": "Tracked",
    "pick": "Sf / phi o 8 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / phi o 8 -111 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 28, 2026",
    "rank": "Tracked",
    "pick": "Col / cin u 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Col / cin u 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 28, 2026",
    "rank": "Tracked",
    "pick": "Ari / mil o 8 -110, .4U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "Ari / mil o 8 -110, .4U✅",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "April 28, 2026",
    "rank": "Tracked",
    "pick": "NYY ml -124, .25U",
    "odds": "-124",
    "score": null,
    "status": "SUCCESS",
    "edge": "NYY ml -124, .25U✅",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +115",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "BOS / bal u 9 -105 -> bal 69.6% w/ 1 day rest since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / bal u 9 -105 —> bal 69.6% w/ 1 day rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "BOS / bal o 9 -117 -> bal 56.1% as home favorite since 2025",
    "odds": "-117",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / bal o 9 -117 —> bal 56.1% as home favorite since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "CLE / tor u 8 -115 -> CLE 56.9% w/ 1 day off since 2024",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / tor u 8 -115 —> CLE 56.9% w/ 1 day off since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "CLE / tor o 8 -102 -> CLE 54.4% as away favorite since 2024, tor 62.1% w/ 1 day off since 2025",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / tor o 8 -102 —> CLE 54.4% as away favorite since 2024, tor 62.1% w/ 1 day off since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "CLE ml -125 -> CLE 57.4% w/ 1 day off since 2024",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml -125 —> CLE 57.4% w/ 1 day off since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Min / tb u 7.5 -115 -> tb 59.1% w/ 1 day rest since 2025",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Min / tb u 7.5 -115 —> tb 59.1% w/ 1 day rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Phi / atl o 9 -105 -> atl 58.5% w/ 1 day rest since 2024",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / atl o 9 -105 —> atl 58.5% w/ 1 day rest since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Phi / atl u 9 -111 -> atl 58.7% vs division since 2024, atl 63% as home favorite since 2024",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / atl u 9 -111 —> atl 58.7% vs division since 2024, atl 63% as home favorite since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "A’s / Tex o 8.5 +100 -> A’s 75% w/ 1 day rest since 2025",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / Tex o 8.5 +100 —> A’s 75% w/ 1 day rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "A’s / Tex u 8.5 -120 -> Tex 65.1% as home favorite since 2024",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / Tex u 8.5 -120 —> Tex 65.1% as home favorite since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "HOU ml +120 -> HOU 58.3% as home underdog since 2024",
    "odds": "+120",
    "score": null,
    "status": "PENDING",
    "edge": "HOU ml +120 —> HOU 58.3% as home underdog since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Sea / stl o 8 -102 -> sea 63% w/ 1 day rest since 2024",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / stl o 8 -102 —> sea 63% w/ 1 day rest since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Sea / stl u 8 -118 -> stl 57.8% as home underdog since 2025",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / stl u 8 -118 —> stl 57.8% as home underdog since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Stl ml +135 -> stl 60% as home underdog since 2025, stl 56.7% w/ 1 day rest since 2025",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Stl ml +135 —> stl 60% as home underdog since 2025, stl 56.7% w/ 1 day rest since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "MIA / sf o 7t -105 -> mia 72.7% as away favorite since 2025, 60.9% w/ 1 day rest since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / sf o 7t -105 —> mia 72.7% as away favorite since 2025, 60.9% w/ 1 day rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 24, 2026",
    "rank": "Tracked",
    "pick": "Mia series",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Mia series",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 23, 2026",
    "rank": "Tracked",
    "pick": "Atl / WSH o 9 -115 ->",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / WSH o 9 -115 —>",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 23, 2026",
    "rank": "Tracked",
    "pick": "CWS ml +128; allowed 10+",
    "odds": "+128",
    "score": null,
    "status": "PENDING",
    "edge": "CWS ml +128; allowed 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 23, 2026",
    "rank": "Tracked",
    "pick": "Sf / lad o 7 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / lad o 7 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Stl / mia o 8.5 -115 -> stl 58.5% as away underdog since 2025, Mia 55% after a loss since 2025, mia 55.2% as home favorite since 2025",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Stl / mia o 8.5 -115 —> stl 58.5% as away underdog since 2025, Mia 55% after a loss since 2025, mia 55.2% as home favorite since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Cin / tb u 8 -105 -> Cin 55.3% w/ no rest since 2023",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / tb u 8 -105 —> Cin 55.3% w/ no rest since 2023,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +120 -> Cin 53.1% after a win since 2023, .5U",
    "odds": "+120",
    "score": null,
    "status": "LOSS",
    "edge": "Cin ml +120 —> Cin 53.1% after a win since 2023, .5U❌",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "HOU / CLE u 8 -115 -> CLE 59% after a win since 2024, CLE 55.3% w/ no rest",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "HOU / CLE u 8 -115 —> CLE 59% after a win since 2024, CLE 55.3% w/ no rest",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Bal / kc u 9 -110 -> kc 57.9% w/ no rest since 2024, kc 58.9% as home favorite since 2024",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / kc u 9 -110 —> kc 57.9% w/ no rest since 2024, kc 58.9% as home favorite since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Tor / LAA o 8 -115 -> tor 57.3% after a win since 2025, tor 55.4% w/ no rest since 2025",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / LAA o 8 -115 —> tor 57.3% after a win since 2025, tor 55.4% w/ no rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Tor ml +124 -> tor 59.3% after a win since 2025, tor 58.2% w/ no rest since 2025",
    "odds": "+124",
    "score": null,
    "status": "PENDING",
    "edge": "Tor ml +124 —> tor 59.3% after a win since 2025, tor 58.2% w/ no rest since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "BOS ml +115; scored 0",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "BOS ml +115; scored 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "NYY / BOS u 7.5 -101",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / BOS u 7.5 -101",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "Atl ml -154; no CLV",
    "odds": "-154",
    "score": null,
    "status": "PENDING",
    "edge": "Atl ml -154; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 22, 2026",
    "rank": "Tracked",
    "pick": "CWS / Ari o 9 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / Ari o 9 -120 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "Mil / DET o 8.5 -106 -> DET 60.9% w/ 1-day off since 2024",
    "odds": "-106",
    "score": null,
    "status": "PENDING",
    "edge": "Mil / DET o 8.5 -106 —> DET 60.9% w/ 1-day off since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "Cin / tb u 7.5 -115 -> Cin 60.3% w/ no rest since 2025, Cin 60.6% after a win since 2025",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / tb u 7.5 -115 —> Cin 60.3% w/ no rest since 2025, Cin 60.6% after a win since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "Cin ml -115, .65U",
    "odds": "-115",
    "score": null,
    "status": "SUCCESS",
    "edge": "Cin ml -115, .65U✅",
    "units": ".65U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .65U"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "Atl / WSH u 8.5 -105 -> atl 61% after a win since 2024, atl 59.8% w/ no rest since 2024, atl 59.8% vs division since 2024",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / WSH u 8.5 -105 —> atl 61% after a win since 2024, atl 59.8% w/ no rest since 2024, atl 59.8% vs division since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "NYY ml +105 ->",
    "odds": "+105",
    "score": null,
    "status": "PENDING",
    "edge": "NYY ml +105 —>",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "NYY / BOS u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / BOS u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "Bal / kc u 9 -110 -> Kc 61.2% after a loss since 2024, kc 59.5% as home favorite since 2024, kc 58.1% w/ no rest since 2024",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / kc u 9 -110 —> Kc 61.2% after a loss since 2024, kc 59.5% as home favorite since 2024, kc 58.1% w/ no rest since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 21, 2026",
    "rank": "Tracked",
    "pick": "Phi / CHC u 8.5 -101 -> phi 66.7% as away underdog since 2025, phi 58.6% w/ no rest since 2025, CHC 53% as home favorite since 2024",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / CHC u 8.5 -101 —> phi 66.7% as away underdog since 2025, phi 58.6% w/ no rest since 2025, CHC 53% as home favorite since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 20, 2026",
    "rank": "Tracked",
    "pick": "HOU / cle u 7.5 -121 -> HOU 54.3% as away underdog since 2024, CLE 56.3% w/ no rest since 2025, CLE 58.2% after a win since 2025",
    "odds": "-121",
    "score": null,
    "status": "PENDING",
    "edge": "HOU / cle u 7.5 -121 —> HOU 54.3% as away underdog since 2024, CLE 56.3% w/ no rest since 2025, CLE 58.2% after a win since 2025, - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 20, 2026",
    "rank": "Tracked",
    "pick": "Stl / mia o 8.5 -115 -> stl 59.4% as away underdog since 2025, Mia 63.6% as home favorite since 2024, .625U",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Stl / mia o 8.5 -115 —> stl 59.4% as away underdog since 2025, Mia 63.6% as home favorite since 2024, .625U",
    "units": ".625U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .625U"
    ]
  },
  {
    "slate": "April 20, 2026",
    "rank": "Tracked",
    "pick": "Atl / WSH o 8 -115 -> WSH 54.2% as home underdog since 2023",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / WSH o 8 -115 —> WSH 54.2% as home underdog since 2023,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 20, 2026",
    "rank": "Tracked",
    "pick": "Bal / kc u 9 -115 -> Kc 61.2% after a loss since 2024, Kc 58.3% w/ no rest since 2024",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / kc u 9 -115 —> Kc 61.2% after a loss since 2024, Kc 58.3% w/ no rest since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 20, 2026",
    "rank": "Tracked",
    "pick": "Phi ml -101 -> phi 60.4% after a loss since 2024, phi 58% w/ no rest",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "Phi ml -101 —> phi 60.4% after a loss since 2024, phi 58% w/ no rest - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 20, 2026",
    "rank": "Tracked",
    "pick": "Phi / CHC u 7.5 -105; no CLV -> CHC 57.1% after a win since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Phi / CHC u 7.5 -105; no CLV —> CHC 57.1% after a win since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Kc ml +125; allowed 10+",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "Kc ml +125; allowed 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Kc / NYY u 7.5 -102 -> Kc 61% after a loss since 2024, Kc 55.8% as away underdog since 2024, Kc 58.2% w/ no rest since 2024",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / NYY u 7.5 -102 —> Kc 61% after a loss since 2024, Kc 55.8% as away underdog since 2024, Kc 58.2% w/ no rest since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Sf / WSH o 8.5 +100 -> sf 54.1% after a win since 2025",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / WSH o 8.5 +100 —> sf 54.1% after a win since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Sf / WSH u 8.5 -120 -> sf 61.5% as away favorite since 2025",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / WSH u 8.5 -120 —> sf 61.5% as away favorite since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Tb / pit u 7.5 -107 -> pit 55.2% after a loss since 2023",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "Tb / pit u 7.5 -107 —> pit 55.2% after a loss since 2023,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Mil ml -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Bal / CLE u 7 -107 -> bal 56.4% after a loss since 2025, bal 58.2% as away underdog since 2025, bal 55.6% w/ no rest since 2025",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / CLE u 7 -107 —> bal 56.4% after a loss since 2025, bal 58.2% as away underdog since 2025, bal 55.6% w/ no rest since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "CWS / A’s u 9.5 -105 -> A’s 55.7% after a win since 2025, A’s 56% as home favorite since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / A’s u 9.5 -105 —> A’s 55.7% after a win since 2025, A’s 56% as home favorite since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Tor / Ari o 8 -111 -> tor 55.8% w/ no rest since 2025",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / Ari o 8 -111 —> tor 55.8% w/ no rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 19, 2026",
    "rank": "Tracked",
    "pick": "Tex / sea o 7 -118 -> sea 53.4% after a win since 2023",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / sea o 7 -118 —> sea 53.4% after a win since 2023,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Kc / NYY u 8 -110 ->",
    "odds": "-110",
    "score": null,
    "status": "LOSS",
    "edge": "Kc / NYY u 8 -110 —>, ❌❌NOW -105",
    "units": "",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Cin / mia u 8 -115 ->",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / mia u 8 -115 —>",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "NYM ml -110; allowed 10+",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "NYM ml -110; allowed 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "NYM / CHC u 8.5 -119 -> CHC 56.3% after a win since 2025",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "NYM / CHC u 8.5 -119 —> CHC 56.3% after a win since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "CWS / A’s o 9 -118 -> A’s 56.2% after a loss since 2025",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / A’s o 9 -118 —> A’s 56.2% after a loss since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "CWS / A’s u 9 -103 -> A’s 58.3% as home favorite since 2025",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / A’s u 9 -103 —> A’s 58.3% as home favorite since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Tb / pit u 7 +101 -> tb 55.7% as away underdog since 2024, pit 56.7% w/ no rest since 2024",
    "odds": "+101",
    "score": null,
    "status": "PENDING",
    "edge": "Tb / pit u 7 +101 —> tb 55.7% as away underdog since 2024, pit 56.7% w/ no rest since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "WSH ml -103; allowed 10+",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml -103; allowed 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Sf / WSH o 9.5 -115 -> WSH 54.1% after a loss since 2025, WSH 58.2% as home underdog since 2025, .35U",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / WSH o 9.5 -115 —> WSH 54.1% after a loss since 2025, WSH 58.2% as home underdog since 2025, .35U & LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Mil / mia o 7.5 -105 -> Mia 55.1% after a loss since 2025, Mia 57.1% as home favorite since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Mil / mia o 7.5 -105 —> Mia 55.1% after a loss since 2025, Mia 57.1% as home favorite since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "DET ml -155; scored 0",
    "odds": "-155",
    "score": null,
    "status": "PENDING",
    "edge": "DET ml -155; scored 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "DET / BOS o 7 -103 -> det 56.3% after a loss since 2024",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "DET / BOS o 7 -103 —> det 56.3% after a loss since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "DET / BOS u 7 -115 -> BOS 57.9% as home underdog since 2024",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "DET / BOS u 7 -115 —> BOS 57.9% as home underdog since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Bal / CLE u 7.5 -115 -> bal 55.2% w/ no rest since 2025, bal 57.6% as away underdog since 2025, CLE 55.8% w/ no rest since 2024",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / CLE u 7.5 -115 —> bal 55.2% w/ no rest since 2025, bal 57.6% as away underdog since 2025, CLE 55.8% w/ no rest since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Bal / CLE o 7.5 -105 -> bal 57.5% after a win since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / CLE o 7.5 -105 —> bal 57.5% after a win since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 18, 2026",
    "rank": "Tracked",
    "pick": "Phi ml -125; no CLV & scored 0",
    "odds": "-125",
    "score": null,
    "status": "PENDING",
    "edge": "Phi ml -125; no CLV & scored 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Ari / bal o 9 -196 -> Ari 54.2% after a win since 2025, Ari 55.4% as away underdog since 2025",
    "odds": "-196",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / bal o 9 -196 —> Ari 54.2% after a win since 2025, Ari 55.4% as away underdog since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Ari ml +133 -> 56.2% after a win since 2025, .4U",
    "odds": "+133",
    "score": null,
    "status": "SUCCESS",
    "edge": "Ari ml +133 —> 56.2% after a win since 2025, .4U NOW +115, .35U✅",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "CLE / stl u 8.5 -113 -> 58.7% as away underdog since 2025, CLE 56.1% w/ no rest since 2025",
    "odds": "-113",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / stl u 8.5 -113 —> 58.7% as away underdog since 2025, CLE 56.1% w/ no rest since 2025",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "CLE ml -105 -> CLE 52.9% as away underdog since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml -105 —> CLE 52.9% as away underdog since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "BOS ml -137; AtS & scored 0",
    "odds": "-137",
    "score": null,
    "status": "PENDING",
    "edge": "BOS ml -137; AtS & scored 0 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Phi ml-142; allowed 10+",
    "odds": "-142",
    "score": null,
    "status": "PENDING",
    "edge": "Phi ml-142; allowed 10+ - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "CHC / phi u 8.5 -105 -> phi 58.2% w/ no rest since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CHC / phi u 8.5 -105 —> phi 58.2% w/ no rest since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Kc / DET u 8 -105 -> Kc 61.2% after a loss since 2024, Kc 55.6% as away underdog since 2024, Kc 63.1% vs division since 2024, Kc 58.3% w/ no rest since 2024, DET 56.1% vs division since 2025",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / DET u 8 -105 —> Kc 61.2% after a loss since 2024, Kc 55.6% as away underdog since 2024, Kc 63.1% vs division since 2024, Kc 58.3% w/ no rest since 2024, DET 56.1% vs division since 2025,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Laa / NYY o 10.5 -115 -> laa 67.1% after a win since 2025, laa 55.6% w/ no rest since 2025, NYY 59% after a loss since 2024",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Laa / NYY o 10.5 -115 —> laa 67.1% after a win since 2025, laa 55.6% w/ no rest since 2025, NYY 59% after a loss since 2024 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Tor / mil u 7.5 -115 -> mil 63.6% as home underdog since 2025",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Tor / mil u 7.5 -115 —> mil 63.6% as home underdog since 2025 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -115 -> sd 57.1% after a win since 2024",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -115 —> sd 57.1% after a win since 2024",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -105 -> sd 60.5% as home underdog since 2024",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -105 —> sd 60.5% as home underdog since 2024,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 15, 2026",
    "rank": "Tracked",
    "pick": "Tex / A’s u 9.5 -102 -> A’s 57.1% after a win since 2025, A’s 60.9% as home favorite since 2025, A’s 54.2% w/ no rest",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / A’s u 9.5 -102 —> A’s 57.1% after a win since 2025, A’s 60.9% as home favorite since 2025, A’s 54.2% w/ no rest",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "Ari / bal o 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / bal o 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "Ari / bal u 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / bal u 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +154; allowed 10+",
    "odds": "+154",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +154; allowed 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "Sf / cin u 9 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / cin u 9 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "Sf / cin o 9 -103 ->",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / cin o 9 -103 —>",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "Sf ml -110 ->",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Sf ml -110 —>",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 14, 2026",
    "rank": "Tracked",
    "pick": "Kc / DET u 7.5 -100 ->, .6U",
    "odds": "-100",
    "score": null,
    "status": "SUCCESS",
    "edge": "Kc / DET u 7.5 -100 —>, .6U✅",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "April 13, 2026",
    "rank": "Tracked",
    "pick": "Ari / bal o 8.5 -119",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / bal o 8.5 -119",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 13, 2026",
    "rank": "Tracked",
    "pick": "Ari / bal u 8.5 -101",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / bal u 8.5 -101",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 13, 2026",
    "rank": "Tracked",
    "pick": "CHC / phi u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "CHC / phi u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 13, 2026",
    "rank": "Tracked",
    "pick": "WSH / pit o 7.5 -101",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / pit o 7.5 -101",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 13, 2026",
    "rank": "Tracked",
    "pick": "WSH / pit u 7.5 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / pit u 7.5 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "Ari / phi o 8.5 -107",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / phi o 8.5 -107",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "Sf / bal u 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / bal u 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "Sf / bal o 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / bal o 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "Min / tor o 8 -104",
    "odds": "-104",
    "score": null,
    "status": "PENDING",
    "edge": "Min / tor o 8 -104",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "Tb ml +127; sweep",
    "odds": "+127",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml +127; sweep",
    "units": "",
    "breakdown": {},
    "why": [
      "Sweep trend context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "MIA ml +166; AtS, .3U",
    "odds": "+166",
    "score": null,
    "status": "LOSS",
    "edge": "MIA ml +166; AtS, .3U NOW +156, .25U❌",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Avoid the Sweep context.",
      "Marked loser by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "LAA / cin u 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "LAA / cin u 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 12, 2026",
    "rank": "Tracked",
    "pick": "LAA / cin o 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "LAA / cin o 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "Ari / phi o 8.5 -113",
    "odds": "-113",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / phi o 8.5 -113",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "Mia ml +121; scored 0",
    "odds": "+121",
    "score": null,
    "status": "PENDING",
    "edge": "Mia ml +121; scored 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "Pit / CHC u 6.5 +100, .3U",
    "odds": "+100",
    "score": null,
    "status": "LOSS",
    "edge": "Pit / CHC u 6.5 +100, .3U & LIVE NOW 6.5 -105, .25U❌",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked loser by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "Min / tor u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Min / tor u 8 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "Min / tor o 8 -109",
    "odds": "-109",
    "score": null,
    "status": "PENDING",
    "edge": "Min / tor o 8 -109",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "NYM ml -160; scored 0",
    "odds": "-160",
    "score": null,
    "status": "PENDING",
    "edge": "NYM ml -160; scored 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "CWS / kc u 9 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / kc u 9 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "CLE ML +100; allowed 10+",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ML +100; allowed 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "cle / atl u 8 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "cle / atl u 8 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 11, 2026",
    "rank": "Tracked",
    "pick": "Sf / bal u 7.5 -119",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / bal u 7.5 -119",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Pit / CHC u 6.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / CHC u 6.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Pit / CHC o 6.5 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / CHC o 6.5 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Ari / phi o* 8.5 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / phi o* 8.5 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "LAA / cin u 9 -109",
    "odds": "-109",
    "score": null,
    "status": "PENDING",
    "edge": "LAA / cin u 9 -109",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Min / tor u 9 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Min / tor u 9 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "A’s / NYM u 8.5 -113",
    "odds": "-113",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / NYM u 8.5 -113",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "NYY / tb o 8 -118",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "NYY / tb o 8 -118",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "CLE / atl u 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / atl u 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "CLE / atl o 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / atl o 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +115",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml +115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Sf / bal o 8.5 -109",
    "odds": "-109",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / bal o 8.5 -109",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Sf / bal u 8.5 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Sf / bal u 8.5 -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "CWS / kc u 8 -118,  .6U",
    "odds": "-118",
    "score": null,
    "status": "SUCCESS",
    "edge": "CWS / kc u 8 -118,  .6U & LIVE NOW 7.5 -120, .4U✅ & LIVE",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "Kc -1.5 +125",
    "odds": "+125",
    "score": null,
    "status": "PENDING",
    "edge": "Kc -1.5 +125",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 10, 2026",
    "rank": "Tracked",
    "pick": "HOU / sea o 7.5 -107,  .6U",
    "odds": "-107",
    "score": null,
    "status": "SUCCESS",
    "edge": "HOU / sea o 7.5 -107,  .6U NOW 8 -105, .5U ✅",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "April 9, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +110, .35U",
    "odds": "+110",
    "score": null,
    "status": "LOSS",
    "edge": "Cin ml +110, .35U❌",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 9, 2026",
    "rank": "Tracked",
    "pick": "A’s / NYY u 8 -195",
    "odds": "-195",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / NYY u 8 -195",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 9, 2026",
    "rank": "Tracked",
    "pick": "DET / min o 8.5 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "DET / min o 8.5 -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 9, 2026",
    "rank": "Tracked",
    "pick": "DET / min u 8.5 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "DET / min u 8.5 -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 9, 2026",
    "rank": "Tracked",
    "pick": "Ari ml +135",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Ari ml +135",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 9, 2026",
    "rank": "Tracked",
    "pick": "Ari / NYM o 7 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / NYM o 7 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Sd / pit u 7 -103",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / pit u 7 -103",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Kc / CLE u 7 -112, .3U",
    "odds": "-112",
    "score": null,
    "status": "LOSS",
    "edge": "Kc / CLE u 7 -112, .3U & LIVE❌❌",
    "units": ".3U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .3U"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +109, .25U",
    "odds": "+109",
    "score": null,
    "status": "SUCCESS",
    "edge": "CLE ml +109, .25U✅",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Bal / CWS u_ 7.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / CWS u_ 7.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Tex ml +113",
    "odds": "+113",
    "score": null,
    "status": "PENDING",
    "edge": "Tex ml +113 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Phi ml -135 - scored 0; no CLV",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "Phi ml -135 - scored 0; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Atl / LAA u 8.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / LAA u 8.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Atl / LAA o 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / LAA o 8.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Ari / NYM o 7.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / NYM o 7.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 8, 2026",
    "rank": "Tracked",
    "pick": "Cin / Mia u 7.5 -112",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / Mia u 7.5 -112",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Kc / CLE u 7 -117",
    "odds": "-117",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / CLE u 7 -117 NOW U 6 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Bal / CWS u 7 -112",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / CWS u 7 -112",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Ari / NYM o 7 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / NYM o 7 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Cin / Mia u 7 +101, .4U",
    "odds": "+101",
    "score": null,
    "status": "LOSS",
    "edge": "Cin / Mia u 7 +101, .4U❌😭",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .4U"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "CHC ml +115",
    "odds": "+115",
    "score": null,
    "status": "PENDING",
    "edge": "CHC ml +115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Mil ml +127",
    "odds": "+127",
    "score": null,
    "status": "PENDING",
    "edge": "Mil ml +127",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Garrett crochet o 7.5 k’s -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Garrett crochet o 7.5 k’s -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "A’s / NYY o 8.5 -107",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / NYY o 8.5 -107",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "Tor ml +135; 10+",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Tor ml +135; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 7, 2026",
    "rank": "Tracked",
    "pick": "GRAND SALAMI UNDER 117.5, .6U",
    "odds": "-",
    "score": null,
    "status": "SUCCESS",
    "edge": "GRAND SALAMI UNDER 117.5, .6U✅",
    "units": ".6U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .6U"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -120 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Kc / CLE u 7 +100, .35U",
    "odds": "+100",
    "score": null,
    "status": "SUCCESS",
    "edge": "Kc / CLE u 7 +100, .35U ✅& LIVE",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +110",
    "odds": "+110",
    "score": null,
    "status": "SUCCESS",
    "edge": "Cin ml +110 :)",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Cin / Mia u 8 -111",
    "odds": "-111",
    "score": null,
    "status": "SUCCESS",
    "edge": "Cin / Mia u 8 -111 :)",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Janson Junk o 4.5 k’s -109",
    "odds": "-109",
    "score": null,
    "status": "LOSS",
    "edge": "Janson Junk o 4.5 k’s -109 :(",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Pit_ -1.5 +156",
    "odds": "+156",
    "score": null,
    "status": "LOSS",
    "edge": "Pit_ -1.5 +156 :(",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Mil -1.5_ +145",
    "odds": "+145",
    "score": null,
    "status": "SUCCESS",
    "edge": "Mil -1.5_ +145 NOW +140, .3U✅",
    "units": ".3U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .3U"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Casey mize o 4.5 k’s -162",
    "odds": "-162",
    "score": null,
    "status": "LOSS",
    "edge": "Casey mize o 4.5 k’s -162 :(",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Sea / Tex u 7.5 -115",
    "odds": "-115",
    "score": null,
    "status": "SUCCESS",
    "edge": "Sea / Tex u 7.5 -115 :)",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Atl / laa_ u 7.5 -102",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Atl / laa_ u 7.5 -102",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 6, 2026",
    "rank": "Tracked",
    "pick": "Andrew Painter O 4.5 k’s -127",
    "odds": "-127",
    "score": null,
    "status": "LOSS",
    "edge": "Andrew Painter O 4.5 k’s -127❌",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Bal ml +110; AtS",
    "odds": "+110",
    "score": null,
    "status": "PENDING",
    "edge": "Bal ml +110; AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Bal / pit u 8.5 -118",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / pit u 8.5 -118",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "MIA ml +225, AtS",
    "odds": "+225",
    "score": null,
    "status": "PENDING",
    "edge": "MIA ml +225, AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "MIA / NYY u 8 -105 m",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / NYY u 8 -105 m",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +177; AtS",
    "odds": "+177",
    "score": null,
    "status": "LOSS",
    "edge": "WSH ml +177; AtS :(",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Tor / CWS o 8 -115 .35U",
    "odds": "-115",
    "score": null,
    "status": "LOSS",
    "edge": "Tor / CWS o 8 -115 .35U❌",
    "units": ".35U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .35U"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Tb / min u 8 -110 .3U & .25U",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "Tb / min u 8 -110 .3U ✅& .25U✅",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -105 ->",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -105 —> LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Mil / kc u 8 -115",
    "odds": "-115",
    "score": null,
    "status": "LOSS",
    "edge": "Mil / kc u 8 -115 :(",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Tex ml -125; AtS & scored 0",
    "odds": "-125",
    "score": null,
    "status": "LOSS",
    "edge": "Tex ml -125; AtS & scored 0 :(",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "Previous score/allowed trigger context.",
      "Marked loser by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 5, 2026",
    "rank": "Tracked",
    "pick": "Cin / Tex u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "SUCCESS",
    "edge": "Cin / Tex u 8 -110 :)",
    "units": "",
    "breakdown": {},
    "why": [
      "Marked winner by user.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Hou ml -118; 10+",
    "odds": "-118",
    "score": null,
    "status": "PENDING",
    "edge": "Hou ml -118; 10+ - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Hou / a’s u",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Hou / a’s u",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Hou / a’s o",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Hou / a’s o",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -108; 10+",
    "odds": "-108",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -108; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Stl +135; scored 0",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Stl +135; scored 0",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "G2 mil -1.5",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "G2 mil -1.5",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "G2 mil / kc o",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "G2 mil / kc o",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "G2 kc ml",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "G2 kc ml",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Wsh ml +229; 10+",
    "odds": "+229",
    "score": null,
    "status": "PENDING",
    "edge": "Wsh ml +229; 10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Cin / tex u",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Cin / tex u",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 4, 2026",
    "rank": "Tracked",
    "pick": "Chc / clé u",
    "odds": "-",
    "score": null,
    "status": "PENDING",
    "edge": "Chc / clé u",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "Stl / DET o 8 -103",
    "odds": "-103",
    "score": null,
    "status": "PENDING",
    "edge": "Stl / DET o 8 -103",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "MIA / NYY o 7.5 -119",
    "odds": "-119",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / NYY o 7.5 -119",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "MIA / nyy u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "MIA / nyy u 8 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "Sd / BOS u 8.5 -102",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Sd / BOS u 8.5 -102",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "Tb / min u 7.5 -110, .5U",
    "odds": "-110",
    "score": null,
    "status": "LOSS",
    "edge": "Tb / min u 7.5 -110, .5U❌",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "Bal / pit o 8.5 -112",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "Bal / pit o 8.5 -112",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "Mil / kc u 9 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Mil / kc u 9 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "Sea / LAA o 8 -107",
    "odds": "-107",
    "score": null,
    "status": "PENDING",
    "edge": "Sea / LAA o 8 -107,",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 3, 2026",
    "rank": "Tracked",
    "pick": "HOU / A’s u 10 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "HOU / A’s u 10 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 1, 2026",
    "rank": "Tracked",
    "pick": "Pit / cin u 7.5 -116, .5U",
    "odds": "-116",
    "score": null,
    "status": "LOSS",
    "edge": "Pit / cin u 7.5 -116, .5U❌",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "April 1, 2026",
    "rank": "Tracked",
    "pick": "Cin +1.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Cin +1.5 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 1, 2026",
    "rank": "Tracked",
    "pick": "Bal ml -112 - AtS",
    "odds": "-112",
    "score": null,
    "status": "PENDING",
    "edge": "Bal ml -112 - AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "April 1, 2026",
    "rank": "Tracked",
    "pick": "NYM -1.5 +100, .25U",
    "odds": "+100",
    "score": null,
    "status": "LOSS",
    "edge": "NYM -1.5 +100, .25U❌",
    "units": ".25U",
    "breakdown": {},
    "why": [
      "Marked loser by user.",
      "Units: .25U"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "TEX Jacob deGrom O 5.5 k’s -130",
    "odds": "-130",
    "score": null,
    "status": "PENDING",
    "edge": "TEX Jacob deGrom O 5.5 k’s -130",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "CIN+ Brandon Williamson O 4.5 k’s +112",
    "odds": "+112",
    "score": null,
    "status": "PENDING",
    "edge": "CIN+ Brandon Williamson O 4.5 k’s +112",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "Phi ml -189; no CLV",
    "odds": "-189",
    "score": null,
    "status": "PENDING",
    "edge": "Phi ml -189; no CLV - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "A’s / atl o 9 -108",
    "odds": "-108",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / atl o 9 -108",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "Atl Jose Suarez o 4.5 k’s -135",
    "odds": "-135",
    "score": null,
    "status": "PENDING",
    "edge": "Atl Jose Suarez o 4.5 k’s -135",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "Atl -1.5 +135",
    "odds": "+135",
    "score": null,
    "status": "PENDING",
    "edge": "Atl -1.5 +135 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 31, 2026",
    "rank": "Tracked",
    "pick": "CHC -1.5 +160",
    "odds": "+160",
    "score": null,
    "status": "PENDING",
    "edge": "CHC -1.5 +160",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 30, 2026",
    "rank": "Tracked",
    "pick": "Min / kc u 9.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Min / kc u 9.5 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 30, 2026",
    "rank": "Tracked",
    "pick": "Tex / bal o 9.5 -102",
    "odds": "-102",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / bal o 9.5 -102",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 30, 2026",
    "rank": "Tracked",
    "pick": "CWS / mia u 8 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "CWS / mia u 8 -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 30, 2026",
    "rank": "Tracked",
    "pick": "Pit / cin u 8 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / cin u 8 -115",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 30, 2026",
    "rank": "Tracked",
    "pick": "CLE / lad u 8.5 -101",
    "odds": "-101",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / lad u 8.5 -101",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 30, 2026",
    "rank": "Tracked",
    "pick": "CLE ml +161",
    "odds": "+161",
    "score": null,
    "status": "PENDING",
    "edge": "CLE ml +161",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Kc ml_ +124 - KC AtS",
    "odds": "+124",
    "score": null,
    "status": "PENDING",
    "edge": "Kc ml_ +124 - KC AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Kc / atl u 8 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / atl u 8 -105",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Min / bal u 9 -117",
    "odds": "-117",
    "score": null,
    "status": "PENDING",
    "edge": "Min / bal u 9 -117 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Tex / phi u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / phi u 8 -110 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Phi -1.5 +145",
    "odds": "+145",
    "score": null,
    "status": "PENDING",
    "edge": "Phi -1.5 +145",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "A’s_ ml +132 - A’s AtS",
    "odds": "+132",
    "score": null,
    "status": "PENDING",
    "edge": "A’s_ ml +132 - A’s AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "A’s / tor o 9 +100 l",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / tor o 9 +100 l",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Pit ml +150 - pit AtS",
    "odds": "+150",
    "score": null,
    "status": "PENDING",
    "edge": "Pit ml +150 - pit AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "CWS ml +145 - CWS AtS",
    "odds": "+145",
    "score": null,
    "status": "PENDING",
    "edge": "CWS ml +145 - CWS AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "LAA ml +147 - LAA GU10+",
    "odds": "+147",
    "score": null,
    "status": "PENDING",
    "edge": "LAA ml +147 - LAA GU10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "Tb ml -120 - tb AtS",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Tb ml -120 - tb AtS",
    "units": "",
    "breakdown": {},
    "why": [
      "Avoid the Sweep context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "WSH ml +202 - WSH GU10+",
    "odds": "+202",
    "score": null,
    "status": "PENDING",
    "edge": "WSH ml +202 - WSH GU10+",
    "units": "",
    "breakdown": {},
    "why": [
      "Previous score/allowed trigger context.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 29, 2026",
    "rank": "Tracked",
    "pick": "CLE / sea u 7.5 -104",
    "odds": "-104",
    "score": null,
    "status": "PENDING",
    "edge": "CLE / sea u 7.5 -104",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "WSH / CHC o 9.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "WSH / CHC o 9.5 -105 NOW O 8.5 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "CHC -1.5 -105",
    "odds": "-105",
    "score": null,
    "status": "PENDING",
    "edge": "CHC -1.5 -105 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "A’s / tor o 8.5 +100",
    "odds": "+100",
    "score": null,
    "status": "PENDING",
    "edge": "A’s / tor o 8.5 +100",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "Min / bal u 7.5 +101",
    "odds": "+101",
    "score": null,
    "status": "PENDING",
    "edge": "Min / bal u 7.5 +101",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "Tex / phi u 7.5 -117",
    "odds": "-117",
    "score": null,
    "status": "PENDING",
    "edge": "Tex / phi u 7.5 -117",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "BOS / cin u 8 -111",
    "odds": "-111",
    "score": null,
    "status": "PENDING",
    "edge": "BOS / cin u 8 -111",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "Cin ml +127*",
    "odds": "+127",
    "score": null,
    "status": "PENDING",
    "edge": "Cin ml +127*",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "Pit / NYM u 8 -110",
    "odds": "-110",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / NYM u 8 -110",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 28, 2026",
    "rank": "Tracked",
    "pick": "Pit / NYM o 8 -113",
    "odds": "-113",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / NYM o 8 -113",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 27, 2026",
    "rank": "Tracked",
    "pick": "NYY ML -131 ->",
    "odds": "-131",
    "score": null,
    "status": "PENDING",
    "edge": "NYY ML -131 —>",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 27, 2026",
    "rank": "Tracked",
    "pick": "Kc / atl u 7.5 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "Kc / atl u 7.5 -120 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 27, 2026",
    "rank": "Tracked",
    "pick": "Sd ml -122",
    "odds": "-122",
    "score": null,
    "status": "PENDING",
    "edge": "Sd ml -122",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 27, 2026",
    "rank": "Tracked",
    "pick": "DET / sd u 7.5 -120",
    "odds": "-120",
    "score": null,
    "status": "PENDING",
    "edge": "DET / sd u 7.5 -120",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 27, 2026",
    "rank": "Tracked",
    "pick": "CLE / sea u 7.5 -115",
    "odds": "-115",
    "score": null,
    "status": "SUCCESS",
    "edge": "CLE / sea u 7.5 -115 NOW U 7 +100, .5U✅",
    "units": ".5U",
    "breakdown": {},
    "why": [
      "Line movement / NOW price included in original note.",
      "Marked winner by user.",
      "Units: .5U"
    ]
  },
  {
    "slate": "March 27, 2026",
    "rank": "Tracked",
    "pick": "Ari / lad o 8.5 -115",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Ari / lad o 8.5 -115 - LIVE",
    "units": "",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "No unit size supplied; excluded from units/ROI"
    ]
  },
  {
    "slate": "March 26, 2026",
    "rank": "Tracked",
    "pick": "Pit / NYM u 7 -115, .4U -> PIT 2024: 56.9% under (128)",
    "odds": "-115",
    "score": null,
    "status": "PENDING",
    "edge": "Pit / NYM u 7 -115, .4U —> PIT 2024: 56.9% under (128)",
    "units": ".4U",
    "breakdown": {},
    "why": [
      "User-entered tracked pick.",
      "Units: .4U"
    ]
  }
];



// V21: Official Betting History imported from user-provided unit/result ledger.
// Every row in this table represents a play that was actually bet. RESULT is net units.
const officialBetHistoryRaw = `
DATE	BET	MLB PROP	RESULT	NOTES
3/26/2026	NYM Mets / PIT Pirates U 9	MLB TOT	-0.28	MLB LIVE
3/26/2026	PIT Pirates / NYM Mets U 7	MLB TOT	-0.45	🤡
3/27/2026	CLE Guardians / SEA Mariners U 7	MLB TOT	0.50	
3/28/2026	A's / TOR Blue Jays O 5.5	MLB TOT	0.33	MLB LIVE
4/1/2026	NYM Mets -1.5	MLB SPRD	-0.25	@ STL
4/1/2026	CIN Reds / PIT Pirates U 10.5	MLB TOT	-0.29	MLB LIVE
4/1/2026	DET Tigers ML	MLB ML	-0.25	MLB LIVE
4/1/2026	MIN Twins / KC Royals U 8	MLB TOT	-0.70	J Ryan vs. N Cameron
4/3/2026	TB Rays / MIN Twins U 7.5	MLB TOT	-0.55	J Boyle vs. B Ober
4/5/2026	TB Rays / MIN Twins U 7.5	MLB TOT	0.55	N Martinez vs. S Woods Richardson
4/5/2026	TOR Blue Jays / CWS White Sox O 8	MLB TOT	-0.40	
4/6/2026	TEX Rangers / SEA Mariners U 8.5	MLB TOT	0.27	MLB LIVE
4/7/2026	CIN Reds / MIA Marlins U 7	MLB TOT	-0.40	
4/7/2026	MLB Grand Salami U 117.5	MLB TOT	0.58	
4/8/2026	CLE Guardians ML	MLB ML	0.27	vs. KC
4/8/2026	KC Royals / CLE Guardians U 9	MLB TOT	-0.30	MLB LIVE
4/8/2026	PHI Phillies ML	MLB ML	-0.25	MLB LIVE
4/9/2026	CIN Reds ML	MLB ML	-0.35	@ MIA; R Lowder vs. M Meyer
4/10/2026	HOU Astros / SEA Mariners O 8	MLB TOT	0.50	T Imai vs. E Hancock
4/11/2026	PIT Pirates / CHC Cubs U 6.5	MLB TOT	-0.25	B Ashcraft vs. E Cabrera
4/12/2026	MIA Marlins ML	MLB ML	-0.25	🤡 S Alcantara vs. T Skubal
4/15/2026	SD Padres ML	MLB ML	0.40	vs. SEA; E Hancock vs. R Vasquez
4/15/2026	ARI Diamondbacks ML	MLB ML	0.40	@ BAL; E Rodriguez vs. K Bradish
4/16/2026	SEA Mariners / SD Padres O 8.5	MLB TOT	-0.35	#TMED
4/18/2026	KC Royals / NYY Yankees U 9.5	MLB TOT	-0.25	🤡
4/18/2026	KC Royals / NYY Yankees U 8.5	MLB TOT	-0.67	🤡
4/19/2026	SF Giants / WSH Nationals O 6.5	MLB TOT	-0.18	
4/19/2026	SF Giants / WSH Nationals O 7.5	MLB TOT	-0.10	
4/20/2026	STL Cardinals / MIA Marlins O 8.5	MLB TOT	-0.72	M McGreevy vs. M Meyer
4/21/2026	CIN Reds ML	MLB ML	0.65	@ TB; C Burns vs. S Matz
4/22/2026	CIN Reds ML	MLB ML	-0.50	@ TB; B Williamson vs. N Martinez
4/23/2026	PIT Pirates	MLB SERIES	-0.65	🤡 @ TEX
4/26/2026	MIA Marlins	MLB SERIES	-0.45	@ SF
4/26/2026	LAA Angels	MLB SERIES	-0.65	@ CWS
4/28/2026	BOS Red Sox / TOR Blue Jays U	MLB TOT	0.35	NRFI; P Tolle vs. T Yesavage
4/28/2026	NYY Yankees ML	MLB ML	0.25	C Schlittler vs. J deGrom
4/28/2026	LAA Angels + MIN Twins	MLB SERIES	-0.35	🤡
4/28/2026	COL Rockies / CIN Reds	MLB TOT	-0.33	#TMJD; NRFI; K Freeland vs. C Burns
4/28/2026	ARI Diamondbacks / MIL Brewers O 8	MLB TOT	0.40	M Kelly vs. C Patrick
4/28/2026	BOS Red Sox / TOR Blue Jays U	MLB TOT	0.35	#TMJD
4/28/2026	NYY Yankees ML	MLB ML	0.25	@ TEX; C Schlittler vs. J deGrom
4/29/2026	LAA Angels	MLB SERIES	-0.65	@ CWS
4/29/2026	LAA Angels / CWS White Sox O 8.5	MLB TOT	-0.60	Y Kikuchi vs. E Fedde
4/30/2026	DET Tigers / ATL Braves U 9	MLB TOT	0.35	F Valdez vs. B Elder
4/30/2026	PHI Cristopher Sanchez O 6.5 k's	MLB PROP	0.35	
5/1/2026	CIN Reds ML	MLB ML	-0.35	@ PIT; B Singer vs. M Keller
5/1/2026	MIA Marlins ML	MLB ML	-0.60	vs. PHI; Z Wheeler vs. E Perez
5/1/2026	TBL Lightning ML	MLB ML	0.25	MLB LIVE; PLAYOFFS RD 1 vs. MTL
5/2/2026	ATL Braves ML + SD Padres ML	MLB PAR	-0.35	
5/4/2026	MIL Brewers ML	MLB ML	-0.45	@ STL; C Patrick vs. K Leahy
5/4/2026	MIL Brewers -1.5	MLB SPRD	-0.25	@ STL; C Patrick vs. K Leahy
5/4/2026	CLE Guardians / KC Royals U 9	MLB TOT	0.37	T Bibee vs. M Wacha
5/4/2026	CLE Guardians / KC Royals U 10.5	MLB TOT	0.25	MLB LIVE; T Bibee vs. M Wacha
5/4/2026	ATL Braves +.5	MLB F5	0.85	@ SEA; JR Ritchie vs. L Gilbert
5/5/2026	ATL Braves +.5	MLB F5	0.55	@ SEA; B Elder vs. G Kirby
5/6/2026	BAL Orioles / MIA Marlins O 8.5	MLB TOT	0.65	
5/6/2026	TB Rays -.5	MLB F5	0.50	vs. TOR; P Corbin vs. S McClanahan
5/7/2026	NYY Yankees -.5	MLB F5	-0.30	
5/8/2026	CIN Reds ML	MLB ML	-0.35	MLB LIVE
5/9/2026	CHC Cubs -.5	MLB F5	-0.75	@ TEX; E Cabrera vs. J Leiter
5/9/2026	NYY Yankees ML	MLB ML	-0.33	😭 8th inning BS
5/10/2026	TB Rays ML	MLB F5	0.47	@ BOS; N Martinez vs. P Tolle
5/10/2026	MIA Marlins ML	MLB ML	0.35	C Cavalli vs. S Alcantara
5/11/2026	TB Rays +.5	MLB F5	0.35	D Rasmussen vs. K Gausman
5/12/2026	WSH Nationals / CIN Reds O 9.5	MLB TOT	1.25	M Mikolas vs. B Singer
5/12/2026	CHC Cubs / ATL Braves O 8.5	MLB TOT	-0.43	C Rea vs. G Holmes
5/13/2026	SEA Mariners SERIES	MLB SERIES	0.50	@ HOU
5/13/2026	NYY Yankees -.5	MLB F5	-0.69	M Fried vs. K Bradish
5/13/2026	TB Rays ML	MLB ML	-0.30	@ TOR; G Jax vs. D Cease
5/13/2026	SD Padres / MIL Brewers U 7	MLB TOT	0.25	
5/13/2026	SD Padres ML	MLB ML	0.53	@ MIL; M King vs. J Misiorowski
5/14/2026	SEA Mariners / HOU Astros O 9	MLB TOT	0.67	L Castillo vs. M Burrows
5/14/2026	DET Tigers ML	MLB ML	-0.45	@ NYM; K Montero vs. N McLean
5/14/2026	CHC Cubs ML	MLB ML	-0.25	
5/14/2026	STL Cardinals SERIES	MLB SERIES	0.47	@ A's
5/15/2026	NYY Yankees -.5	MLB F5	0.38	
5/16/2026	ATL Braves -.5	MLB F5	0.37	P Tolle vs. B Elder
5/16/2026	ATL Braves ML	MLB ML	-0.42	
5/16/2026	DET Tigers ML	MLB ML	-0.38	vs. TOR; M Fluharty vs. C Mize
5/16/2026	BAL Orioles / WSH Nationals O 10	MLB TOT	0.85	
5/17/2026	PIT Pirates -.5	MLB F5	-0.35	Z Wheeler vs. P Skenes
5/17/2026	CWS White Sox SERIES	MLB SERIES	0.52	vs. CHC
5/17/2026	TB Rays -.5	MLB F5	0.37	@ MIA
5/19/2026	CIN Reds / PHI Phillies O 8.5	MLB TOT	-0.60	C Burns vs. J Luzardo
5/19/2026	HOU Astros / MIN Twins O 8.5	MLB TOT	-0.78	J Alexander vs. Z Matthews
5/20/2026	CIN Reds +.5	MLB F5	0.75	A Abott vs. A Nola
5/20/2026	CIN Reds SERIES	MLB SERIES	0.38	
5/20/2026	CLE Guardians SERIES	MLB SERIES	0.47	
5/20/2026	STL Cardinals ML	MLB ML	-0.28	🤡 vs. PIT; C Mlodzinski vs. M McGreevy
5/20/2026	MIL Brewers ML	MLB ML	0.25	K Harrison vs. E Cabrera
5/20/2026	ATL Braves +.5	MLB F5	0.25	
5/21/2026	ATL Braves -.5	MLB F5	1.00	S Strider vs. S Alcantara
5/22/2026	TB Rays ML	MLB ML	0.72	
5/23/2026	PIT Pirates -.5	MLB F5	-0.62	P Skenes vs. P Corbin
5/23/2026	ATL Braves / WSH Nationals O 5.5	MLB TOT	-1.00	MLB LIVE
5/24/2026	SEA Mariners SERIES	MLB SERIES	-0.48	
5/24/2026	TB Rays ML + SEA Mariners SERIES	MLB SERIES	-0.33	
5/25/2026	TB Rays -.5	MLB F5	-0.25	
5/26/2026	CIN Reds -.5	MLB F5	0.70	C Burns vs. D Peterson
5/26/2026	ATL Braves ML	MLB ML	0.35	S Strider vs. R Suarez
5/27/2026	TB Rays SERIES	MLB SERIES	-0.88	
5/27/2026	CIN Reds +1.5	MLB SPRD	-0.77	
5/28/2026	CWS White Sox -.5	MLB F5	0.60	S Woods Richardson vs. D Martin
5/28/2026	PIT Pirates -.5	MLB F5	-0.28	
5/29/2026	ATL Braves / CIN Reds O 9.5	MLB TOT	0.60	G Holmes vs. C Paddack
5/29/2026	TEX Rangers / KC Royals U 9.5	MLB TOT	-0.27	MLB LIVE
5/29/2026	TEX Rangers / KC Royals U 7.5	MLB TOT	-0.75	S Kolek vs. M Gore
5/30/2026	TOR Blue Jays SERIES	MLB SERIES	0.42	
5/30/2026	ATL Braves / CIN Reds O 9.5	MLB TOT	-0.70	M Perez vs. B Singer
5/30/2026	ATL Braves ML	MLB ML	0.30	
5/30/2026	MIN Twins / PIT Pirates O 8.5	MLB TOT	0.35	
5/30/2026	ATL Braves -.5	MLB F5	0.72	M Perez vs. B Singer
6/2/2026	ATL Braves ML	MLB ML	0.80	
6/2/2026	MIA Marlins / WSH Nationals O 9	MLB TOT	0.65	L Bachar vs. R Lovelady
6/2/2026	MIA Marlins / WSH Nationals O 5.5	MLB TOT	0.30	MLB LIVE
6/3/2026	MIN Twins -.5	MLB F5	-0.75	E Fedde vs. T Bradley
6/3/2026	ATL Braves -.5	MLB F5	0.30	P Corbin vs. G Holmes
6/3/2026	CIN Reds -.5	MLB F5	-0.68	S Kolek vs. C Burns
6/5/2026	CLE Guardians / TEX Rangers U 7.5	MLB TOT	0.40	P Messick vs. K Rocker
6/5/2026	CLE Guardians -.5	MLB F5	0.37	P Messick vs. K Rocker
6/5/2026	TB Rays -.5	MLB F5	0.75	D Rasmussen vs. R Gusto
6/5/2026	TB Rays / MIA Marlins O 7.5	MLB TOT	-0.77	D Rasmussen / R Gusto
6/6/2026	SEA Mariners -.5	MLB F5	0.25	B Miller vs. K Montero
6/6/2026	TB Rays -.5	MLB F5	-0.30	S McClanahan vs. L Bachar
6/7/2026	A's ML	MLB ML	0.30	
6/7/2026	SF Giants	MLB SERIES	0.38	@ CHC
6/8/2026	BOS Red Sox / TB Rays O 8	MLB TOT	-0.25	C Early / I Seymour
6/8/2026	SEA Mariners -.5	MLB F5	0.32	E Hancock / T Gibson
6/8/2026	HOU Astros -.5	MLB F5	-0.75	S Arrighetti / G Rodriguez
6/9/2026	SEA Mariners +.5	MLB F5	0.25	
6/9/2026	CIN Reds -.5	MLB F5	-0.42	C Burns / L Giolito; blew 2-0 lead
6/10/2026	STL Cardinals ML	MLB ML	0.80	A Pallante / W Warren; @ NYM
6/10/2026	WSH Nationals -.5	MLB F5	0.73	F Griffin / R Ray
6/11/2026	ARI Diamondbacks	MLB SERIES	-0.57	@ MIA
6/11/2026	STL Cardinals ML	MLB ML	-0.50	H Dobbins / C Scott
6/11/2026	COL Rockies	MLB SERIES	0.46	
6/11/2026	LAD Dodgers -.5	MLB F5	0.67	J Wrobleski / M Keller
6/12/2026	SD Padres / BAL Orioles O 9.5	MLB TOT	0.25	G Canning / S Baz
6/12/2026	MIA Marlins / PIT Pirates O 8.5	MLB TOT	0.60	S Alcantara / B Ashcraft
6/13/2026	ATL Braves ML	MLB ML	0.80	M Perez / S Manaea
6/14/2026	CHC Cubs / SF Giants O 4.5	MLB TOT	0.35	MLB LIVE
6/14/2026	ATL Braves ML	MLB ML	-0.65	
6/15/2026	TB Rays ML	MLB ML	-0.40	N Martinez / E Lauer; @ LAD; blew 3-0 lead
`;

function parseOfficialBetHistory(raw){
  return raw.trim().split(/\n+/).slice(1).map((line, idx) => {
    const cols = line.split('\t');
    const [date, bet, type, result, ...noteParts] = cols;
    const units = Number(result);
    return {
      id: idx + 1,
      date: (date || '').trim(),
      bet: (bet || '').trim(),
      type: (type || '').replace('MLB ', '').trim() || 'OTHER',
      result: Number.isFinite(units) ? units : 0,
      notes: noteParts.join(' ').trim(),
      status: Number.isFinite(units) ? (units > 0 ? 'WIN' : units < 0 ? 'LOSS' : 'PUSH') : 'UNVERIFIED'
    };
  }).filter(r => r.date && r.bet);
}

const officialBetHistory = parseOfficialBetHistory(officialBetHistoryRaw);


const june23TrackedPicks = [
  {slate:'June 23, 2026', rank:'Tracked', pick:'NYY / DET U8', odds:'-114', score:null, status:'PENDING', edge:'NYY / DET U 8 -114, .6U', units:'.6U', breakdown:{}, why:['Official play with user-supplied unit size.', 'Total categorized as Under.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'F5 DET +0.5', odds:'-155', score:null, status:'LIVE', edge:'F5 DET +.5 -155 - LIVE', units:'', breakdown:{}, why:['Live first-five play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'NYY ML', odds:'-110', score:null, status:'LIVE', edge:'NYY ml_ -110 - LIVE', units:'', breakdown:{}, why:['Live moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'MIL ML', odds:'-110', score:null, status:'PENDING', edge:'Mil ml* -110', units:'', breakdown:{}, why:['Tracked moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'NYM ML', odds:'-105', score:null, status:'PENDING', edge:'NYM ml -105', units:'', breakdown:{}, why:['Tracked moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'CLE ML', odds:'-120', score:null, status:'PENDING', edge:'CLE ml_ -120', units:'', breakdown:{}, why:['Tracked moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'ARI / STL U8.5', odds:'-110', score:null, status:'PENDING', edge:'Ari / stl u 8.5 -110', units:'', breakdown:{}, why:['Tracked under play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 23, 2026', rank:'Tracked', pick:'ATL ML', odds:'-115', score:null, status:'PENDING', edge:'Atl ml* -115', units:'', breakdown:{}, why:['Tracked moneyline play.', 'No unit size supplied; excluded from units/ROI.']}
];
trackedPickResults.unshift(...june23TrackedPicks);

const june24TrackedPicks = [
  {
    slate:'June 24, 2026',
    rank:'Top Play',
    pick:'Rangers F5 -0.5',
    matchup:'TEX @ MIA',
    odds:'+100',
    score:6.90,
    status:'PENDING',
    edge:'Clean starter mismatch at a reasonable plus-money price: deGrom over Eury Perez with Texas improving against RHP.',
    units:'',
    breakdown:{
      'Starting Pitcher Edge':'deGrom: 29.5% K, 5.4% BB, 24.1% K-BB, 1.03 WHIP, 3.75 FIP',
      'Opponent SP Risk':'Eury Perez contact damage: 15.0% barrel rate, 42.5% hard-hit rate, 5.02 xERA',
      'Team F5 Context':'Rangers 2.38 F5 R/G; Marlins 2.50 F5 R/G and 0.55 first-inning R/G',
      'Environment':'loanDepot Park roof closed; reduced weather variance',
      'Market':'F5 -0.5 at +100 gives 50.0% implied probability'
    },
    why:[
      'Jacob deGrom gives Texas the cleanest pure starter mismatch still priced reasonably.',
      'Perez misses bats but the contact profile creates F5 crooked-inning risk.',
      'Texas is more dangerous against right-handed pitching than its season-long public reputation suggests.',
      'Miami does not bring an elite early-pressure offense into a deGrom start.'
    ]
  },
  {
    slate:'June 24, 2026',
    rank:'Top Play',
    pick:'Braves F5 -0.5',
    matchup:'ATL @ SD',
    odds:'+115',
    score:6.91,
    status:'PENDING',
    edge:'Best market inefficiency play: Atlanta gets plus money against a replacement-level starter profile after JP Sears was called up.',
    units:'',
    breakdown:{
      'Market Inefficiency':'Atlanta F5 -0.5 at +115 after Padres starter change creates stale/under-adjusted price risk',
      'Starter Context':'JP Sears called up after Lucas Giolito IL; Sears carried a 7.92 ERA in Triple-A El Paso',
      'Opponent Early Offense':'Padres rank last in F5 runs per game at 1.95',
      'Team F5 Context':'Atlanta top-10 at 2.76 F5 runs; Atlanta 10th in opponent F5 runs allowed at 2.36',
      'Weather':'Neutral San Diego weather'
    },
    why:[
      'This is less about loving Martin Perez and more about buying Atlanta at a plus price against a replacement-level starter setup.',
      'San Diego has a weak early-offense profile and ranks 30th in first-five runs per game.',
      'Atlanta owns the stronger early-game profile and the market appears slow to adjust to the starter change.'
    ]
  }
];
trackedPickResults.unshift(...june24TrackedPicks);



// V33: 06/24 and 06/25 daily pick update.
// Preserve user-provided units only. Full-game 06/24 results are graded from final scores; F5 entries without verified F5 data remain unverified unless user marked them.
const june24June25DailyUpdate = [
  {slate:'June 25, 2026', rank:'Tracked', pick:'KC / TB U8.5', matchup:'KC @ TB', odds:'-115', score:null, status:'PENDING', edge:'KC / TB U 8.5 -115', units:'', breakdown:{}, why:['06/25 tracked total.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'TB ML', matchup:'KC @ TB', odds:'-141', score:null, status:'LIVE', edge:'TB ML -141 - LIVE', units:'', breakdown:{}, why:['06/25 live moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'F5 SEA -0.5', matchup:'SEA @ PIT', odds:'-110', score:null, status:'LIVE', edge:'F5 SEA -.5 -110 - LIVE', units:'', breakdown:{}, why:['06/25 live first-five play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:"A's ML", matchup:"ATH @ SF", odds:'+115', score:null, status:'PENDING', edge:"A’s +115; AtS", units:'', breakdown:{}, why:['06/25 tracked moneyline play.', 'AtS note: avoid the sweep.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:"A's / SF U8.5", matchup:'ATH @ SF', odds:'+100', score:null, status:'PENDING', edge:"A’s / SF U 8.5 +100", units:'', breakdown:{}, why:['06/25 tracked under play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'PHI / WSH O8.5', matchup:'PHI @ WSH', odds:'-103', score:null, status:'PENDING', edge:'Phi / WSH O 8.5 -103', units:'', breakdown:{}, why:['06/25 tracked over play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'TEX / TOR O8', matchup:'TEX @ TOR', odds:'+100', score:null, status:'PENDING', edge:'Tex / tor O 8 +100', units:'', breakdown:{}, why:['06/25 tracked over play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'TOR ML', matchup:'TEX @ TOR', odds:'-153', score:null, status:'PENDING', edge:'Tor ML -153', units:'', breakdown:{}, why:['06/25 tracked moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'NYM ML', matchup:'CHC @ NYM', odds:'-115', score:null, status:'PENDING', edge:'NYM ML -115; allowed 10+', units:'', breakdown:{}, why:['06/25 tracked moneyline play.', 'Game-log note: opponent allowed 10+.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'CHC / NYM O8.5', matchup:'CHC @ NYM', odds:'-110', score:null, status:'PENDING', edge:'CHC / NYM O 8.5 -110', units:'', breakdown:{}, why:['06/25 tracked over play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'NYY / BOS U7.5', matchup:'NYY @ BOS', odds:'-103', score:null, status:'PENDING', edge:'NYY / BOS U 7.5 -103', units:'', breakdown:{}, why:['06/25 tracked under play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'F5 NYY -0.5', matchup:'NYY @ BOS', odds:'-110', score:null, status:'PENDING', edge:'F5 NYY -.5 -110', units:'', breakdown:{}, why:['06/25 tracked first-five play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'NYY ML', matchup:'NYY @ BOS', odds:'-163', score:null, status:'PENDING', edge:'NYY ML* -163', units:'', breakdown:{}, why:['06/25 tracked moneyline play.', 'Star marker preserved in edge note.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 25, 2026', rank:'Tracked', pick:'ARI / STL O9', matchup:'ARI @ STL', odds:'-102', score:null, status:'PENDING', edge:'Ari / stl O 9 -102', units:'', breakdown:{}, why:['06/25 tracked over play.', 'No unit size supplied; excluded from units/ROI.']},

  {slate:'June 24, 2026', rank:'Tracked', pick:'TEX / MIA U7.5', matchup:'TEX @ MIA', odds:'-115', score:null, status:'WIN', edge:'Tex / Mia U 7.5 -115', units:'', breakdown:{}, why:['Final score TEX 2, MIA 4 = 6 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'F5 TEX -0.5', matchup:'TEX @ MIA', odds:'+105', score:null, status:'LOSS', edge:'F5 Tex -.5 +105, .35U ❌ & LIVE', units:'.35U', breakdown:{}, why:['User marked this official unit play as a loss.', 'Counts toward units/ROI because .35U was supplied.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'CWS ML', matchup:'CLE @ CWS', odds:'-105', score:null, status:'LOSS', edge:'CWS ML* -105; SWEEP - LIVE', units:'', breakdown:{}, why:['Final score CLE 4, CWS 3.', 'Sweep note preserved.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'F5 LAA -0.5', matchup:'BAL @ LAA', odds:'+110', score:null, status:'UNVERIFIED', edge:'F5 LAA -.5 +110 - LIVE', units:'', breakdown:{}, why:['F5 result requires inning-by-inning verification.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'BAL / LAA O9.5', matchup:'BAL @ LAA', odds:'+100', score:null, status:'WIN', edge:'Bal / LAA O 9.5 +100 - LIVE', units:'', breakdown:{}, why:['Final score BAL 6, LAA 7 = 13 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'KC / TB U7.5', matchup:'KC @ TB', odds:'-115', score:null, status:'LOSS', edge:'KC / TB U 7.5 -115', units:'', breakdown:{}, why:['Final score KC 3, TB 5 = 8 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'SEA ML', matchup:'SEA @ PIT', odds:'-102', score:null, status:'LOSS', edge:'Sea ML -102 - LIVE', units:'', breakdown:{}, why:['Final score SEA 1, PIT 11.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'WSH ML', matchup:'PHI @ WSH', odds:'+110', score:null, status:'LOSS', edge:'WSH ML +110; allowed 10+', units:'', breakdown:{}, why:['Final score PHI 5, WSH 4.', 'Game-log note: allowed 10+.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'PHI / WSH O9.5', matchup:'PHI @ WSH', odds:'-115', score:null, status:'LOSS', edge:'Phi / WSH O 9.5 -115 - LIVE', units:'', breakdown:{}, why:['Final score PHI 5, WSH 4 = 9 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'HOU / TOR O8.5', matchup:'HOU @ TOR', odds:'-115', score:null, status:'LOSS', edge:'HOU / TOR O 8.5 -115, .6U ❌', units:'.6U', breakdown:{}, why:['Final score HOU 3, TOR 1 = 4 total runs.', 'Counts toward units/ROI because .6U was supplied.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'HOU ML', matchup:'HOU @ TOR', odds:'+120', score:null, status:'WIN', edge:'HOU ML +120 - LIVE', units:'', breakdown:{}, why:['Final score HOU 3, TOR 1.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'CIN ML', matchup:'MIL @ CIN', odds:'+112', score:null, status:'LOSS', edge:'Cin ML +112; AtS & allowed 10+', units:'', breakdown:{}, why:['Final score MIL 6, CIN 5.', 'AtS and allowed 10+ notes preserved.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'MIN ML', matchup:'LAD @ MIN', odds:'+148', score:null, status:'LOSS', edge:'Min ML +148; allowed 10+', units:'', breakdown:{}, why:['Final score LAD 4, MIN 3.', 'Game-log note: allowed 10+.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'ARI / STL O9', matchup:'ARI @ STL', odds:'-115', score:null, status:'WIN', edge:'Ari / stl O 9 -115', units:'', breakdown:{}, why:['Final score ARI 9, STL 4 = 13 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'STL ML', matchup:'ARI @ STL', odds:'-120', score:null, status:'LOSS', edge:'Stl ML* -120', units:'', breakdown:{}, why:['Final score ARI 9, STL 4.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Tracked', pick:'SD ML', matchup:'ATL @ SD', odds:'+100', score:null, status:'WIN', edge:'SD ML +100; SWEEP', units:'', breakdown:{}, why:['Final score ATL 2, SD 5.', 'Sweep note preserved.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 24, 2026', rank:'Top Play', pick:'F5 ATL -0.5', matchup:'ATL @ SD', odds:'+115', score:6.91, status:'UNVERIFIED', edge:'F5 ATL -.5 +115', units:'', breakdown:{}, why:['F5 result requires inning-by-inning verification.', 'No unit size supplied; excluded from units/ROI.']}
];

for(let i = trackedPickResults.length - 1; i >= 0; i--){
  if(trackedPickResults[i].slate === 'June 24, 2026' || trackedPickResults[i].slate === 'June 25, 2026'){
    trackedPickResults.splice(i, 1);
  }
}
trackedPickResults.unshift(...june24June25DailyUpdate);


const june26June27DailyUpdate = [
  // June 27 card
  {slate:'June 27, 2026', rank:'Tracked', pick:'HOU ML', matchup:'HOU @ DET', odds:'+110', score:null, status:'WIN', edge:'HOU ML +110; PREV_SCORED 0 - LIVE', units:'', breakdown:{}, why:['Final score HOU 8, DET 6 verified from MLB schedule feed.', 'Game-log note preserved: PREV_SCORED 0.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'NYY ML', matchup:'NYY @ BOS', odds:'-125', score:null, status:'LOSS', edge:'NYY ML -125', units:'', breakdown:{}, why:['Final score NYY 1, BOS 4 verified from MLB schedule feed.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 27, 2026', rank:'Official', pick:'NYY / BOS U8.5', matchup:'NYY @ BOS', odds:'-105', score:null, status:'WIN', edge:'NYY / BOS U 8.5 -105, moved to 8 -105, .35U', units:'.35U', breakdown:{}, why:['Official under play with user-supplied .35U.', 'Final score NYY 1, BOS 4 = 5 total runs, under both 8.5 and 8.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'TEX / TOR O8', matchup:'TEX @ TOR', odds:'-110', score:null, status:'WIN', edge:'TEX / TOR O 8 -110 - LIVE', units:'', breakdown:{}, why:['Final score TEX 7, TOR 4 = 11 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'F5 TOR -0.5', matchup:'TEX @ TOR', odds:'', score:7.08, status:'UNVERIFIED', edge:'TOR F5 Run Line -0.5 vs. TEX. Projected F5 win probability 66.0%, expected edge +7.7%.', units:'', breakdown:{'Sportsbook Odds':'-140 in model note; user-entered pick did not include current ticket price.','Implied Probability':'58.3% at -140 model-note price.','Projected F5 Win Probability':'66.0%','Expected Edge':'+7.7%','Final Model Score':'7.08 / 10'}, why:['Model note supports Toronto F5 -0.5 as a positive-edge F5 position.', 'F5 score requires inning-by-inning feed to grade automatically.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'KC ML', matchup:'KC @ CWS', odds:'+110', score:null, status:'LOSS', edge:'KC ML +110; PREV_ALLOWED 10+ - LIVE', units:'', breakdown:{}, why:['Final score KC 1, CWS 2.', 'Game-log note preserved: PREV_ALLOWED 10+.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'TB ML', matchup:'ARI @ TB', odds:'-144', score:null, status:'LIVE', edge:'TB ML -144; no CLV - LIVE', units:'', breakdown:{}, why:['Live/pending moneyline play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 27, 2026', rank:'Official', pick:'WSH ML', matchup:'WSH @ BAL', odds:'-108', score:null, status:'LIVE', edge:'WSH ML +100, moved to -108, .55U & LIVE', units:'.55U', breakdown:{}, why:['Official play with user-supplied .55U.', 'Live/pending moneyline play.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'CHC / MIL O8', matchup:'CHC @ MIL', odds:'-108', score:null, status:'LIVE', edge:'CHC / MIL O 8 -108 - LIVE', units:'', breakdown:{}, why:['Live/pending total play.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 27, 2026', rank:'Tracked', pick:'ATL ML', matchup:'ATL @ SF', odds:'+111', score:null, status:'PENDING', edge:'ATL ML +111', units:'', breakdown:{}, why:['Tracked moneyline play.', 'No unit size supplied; excluded from units/ROI.']},

  // June 26 card
  {slate:'June 26, 2026', rank:'Tracked', pick:'TEX / TOR O8.5', matchup:'TEX @ TOR', odds:'-115', score:null, status:'WIN', edge:'TEX / TOR O 8.5 -115 - LIVE', units:'', breakdown:{}, why:['Final score TEX 5, TOR 4 = 9 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 26, 2026', rank:'Top Play', pick:'F5 TEX -0.5', matchup:'TEX @ TOR', odds:'+110', score:6.50, status:'UNVERIFIED', edge:'Texas Rangers F5 -0.5 +110. Projected F5 win probability 53.3%, expected edge +5.7%.', units:'', breakdown:{'SP Edge':'7.6 — Eovaldi 23.7% K, 5.7% BB, 18.0% K-BB vs Corbin 10.5% projected K-BB.','Opponent Run Suppression':'6.8 — Toronto ranks last in MLB in F5 scoring at 1.91 runs per game.','Team F5 Splits':'5.2','Ballpark/Weather':'5.0 — roof/indoor context limits weather noise.','Lineup Construction':'5.6 — Texas RH bats can punish a declining Corbin.','Market Inefficiency':'8.5 — plus-money favorite versus weak Toronto early scoring environment.'}, why:['Nathan Eovaldi is the clearly better starter despite not being at his previous-season peak.', 'Patrick Corbin has a poor recent profile with a 6.64 ERA, 1.82 WHIP, and 5% K-BB over the noted last-30-day window.', 'Toronto early offense is the key opponent-suppression angle.', 'F5 result requires inning-by-inning scoring data to grade.']},
  {slate:'June 26, 2026', rank:'Tracked', pick:'NYY ML', matchup:'NYY @ BOS', odds:'-115', score:null, status:'LOSS', edge:'NYY ML -115 - LIVE', units:'', breakdown:{}, why:['Final score NYY 1, BOS 6.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 26, 2026', rank:'Tracked', pick:'NYY / BOS U8.5', matchup:'NYY @ BOS', odds:'-101', score:null, status:'WIN', edge:'NYY / BOS U 8.5 -101', units:'', breakdown:{}, why:['Final score NYY 1, BOS 6 = 7 total runs.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 26, 2026', rank:'Tracked', pick:'PHI ML', matchup:'PHI @ NYM', odds:'-160', score:null, status:'WIN', edge:'PHI ML -160; no CLV - LIVE', units:'', breakdown:{}, why:['Final score PHI 2, NYM 1.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 26, 2026', rank:'Tracked', pick:'SEA ML', matchup:'SEA @ CLE', odds:'-110', score:null, status:'WIN', edge:'SEA ML -110 - LIVE', units:'', breakdown:{}, why:['Final score SEA 3, CLE 1.', 'No unit size supplied; excluded from units/ROI.']},
  {slate:'June 26, 2026', rank:'Official', pick:'TB ML', matchup:'ARI @ TB', odds:'-136', score:null, status:'WIN', edge:'TB ML -136; no CLV, .5U ✅ & LIVE', units:'.5U', breakdown:{}, why:['Official play with user-supplied .5U.', 'Final score ARI 1, TB 6.']},
  {slate:'June 26, 2026', rank:'Top Play', pick:'F5 MIA -0.5', matchup:'MIA @ STL', odds:'+120', score:6.40, status:'UNVERIFIED', edge:'Miami Marlins F5 -0.5 +120. Projected F5 win probability 52.8%, expected edge +7.3%.', units:'', breakdown:{'SP Edge':'8.3 — Max Meyer 27% K rate and 18% K-BB versus Michael McGreevy 16% K and 10% K-BB.','Opponent Run Suppression':'5.4','Team F5 Splits':'4.8','Ballpark/Weather':'6.0 — Busch Stadium fair-to-slightly pitcher friendly.','Lineup Construction':'4.8','Game Context':'5.0','Market Inefficiency':'8.0 — plus-money price carries the edge.'}, why:['Best price-to-pitching play on the board.', 'Meyer has the strikeout path while McGreevy has more sequencing/contact-quality vulnerability.', 'Cardinals offense is not soft, so price is the key reason this remains playable.', 'F5 result requires inning-by-inning scoring data to grade.']},
  {slate:'June 26, 2026', rank:'Official', pick:'ATL / SF O8.5', matchup:'ATL @ SF', odds:'-106', score:null, status:'LOSS', edge:'ATL / SF O 8.5 -106; no CLV, .35U & LIVE', units:'.35U', breakdown:{}, why:['Official play with user-supplied .35U.', 'Final score ATL 3, SF 1 = 4 total runs.']},
  {slate:'June 26, 2026', rank:'Official', pick:"A's / LAA U8.5", matchup:"A's @ LAA", odds:'-110', score:null, status:'LOSS', edge:"A's / LAA U 8.5 -110, .5U", units:'.5U', breakdown:{}, why:['Official play with user-supplied .5U.', 'Final score A’s 9, LAA 3 = 12 total runs.']},
  {slate:'June 26, 2026', rank:'Top Play', pick:'F5 LAD -0.5', matchup:'LAD @ SD', odds:'-105', score:7.10, status:'UNVERIFIED', edge:'Dodgers F5 -0.5 -105. Team-level F5 matchup led by elite Dodgers first-five scoring/prevention.', units:'', breakdown:{'SP Edge':'6.6 — not a pure starting-pitcher blowout, but Dodgers team ecosystem carries the play.','Opponent Run Suppression':'8.8 — Padres early offense grades weak against RHP.','Team F5 Splits':'8.2 — Dodgers 2.96 F5 runs/game and 1.88 opponent F5 runs allowed.','Ballpark/Weather':'5.5 — Petco can suppress scoring and increase tie risk.','Lineup Construction':'8.5 — elite Dodgers lineup depth.','Market Inefficiency':'7.0'}, why:['Cleanest team-level F5 matchup on the board.', 'Dodgers bring stronger early scoring and prevention while Padres rate near the bottom of F5 offense.', 'F5 result requires inning-by-inning scoring data to grade.']},

  // June 26 series card
  {slate:'June 26, 2026', rank:'Series', pick:'PHI Series ML', matchup:'PHI @ NYM', odds:'+115', score:null, status:'PENDING', edge:'PHI SERIES +115; +13.8 pts edge', units:'', breakdown:{}, why:['Series board play. Detailed model note stored in Series Board and Research Journal.']},
  {slate:'June 26, 2026', rank:'Series', pick:'BRAVES Series ML', matchup:'ATL @ SF', odds:'-135', score:null, status:'PENDING', edge:'BRAVES SERIES -135, .35U; +11.7 pts edge', units:'.35U', breakdown:{}, why:['Official series play with user-supplied .35U.', 'Detailed model note stored in Series Board and Research Journal.']},
  {slate:'June 26, 2026', rank:'Series', pick:'REDS Series ML', matchup:'CIN @ PIT', odds:'+161', score:null, status:'WIN', edge:'REDS SERIES +161; +8.7 edge', units:'', breakdown:{}, why:['Series board underdog play.', 'Detailed model note stored in Series Board and Research Journal.']},
  {slate:'June 26, 2026', rank:'Series', pick:'MARLINS Series ML', matchup:'MIA @ STL', odds:'+119', score:null, status:'WIN', edge:'MARLINS SERIES +119', units:'', breakdown:{}, why:['Series board underdog play.', 'Detailed model note stored in Series Board and Research Journal.']},
  {slate:'June 26, 2026', rank:'Series', pick:"A's Series ML", matchup:"A's @ LAA", odds:'-105', score:null, status:'PENDING', edge:"A’S SERIES -105; +7.1 pts edge", units:'', breakdown:{}, why:['Series board midrange value play.', 'Detailed model note stored in Series Board and Research Journal.']}
];

for(let i = trackedPickResults.length - 1; i >= 0; i--){
  if(trackedPickResults[i].slate === 'June 26, 2026' || trackedPickResults[i].slate === 'June 27, 2026') trackedPickResults.splice(i, 1);
}
trackedPickResults.unshift(...june26June27DailyUpdate);


// V37: 06/28 daily card update. Games in progress remain LIVE/PENDING until final score data is available.
const june28DailyUpdate = [
  {slate:'June 28, 2026', rank:'Official', pick:'ARI ML', matchup:'ARI @ TB', odds:'+165', score:null, status:'LOSS', edge:'ARI ML +165; AtS, .3U', units:'.3U', breakdown:{}, why:['06/28 official moneyline play with user-supplied .3U.', 'Final score: ARI 1, TB 5.']},
  {slate:'June 28, 2026', rank:'Tracked', pick:'SEA / CLE O7.5', matchup:'SEA @ CLE', odds:'-105', score:null, status:'WIN', edge:'SEA / CLE O 7.5 -105', units:'', breakdown:{}, why:['Final score: SEA 5, CLE 6 = 11 total runs.', 'Over 7.5 cashed.']},
  {slate:'June 28, 2026', rank:'Tracked', pick:'CHC / MIL O8', matchup:'CHC @ MIL', odds:'-119', score:null, status:'LOSS', edge:'CHC / MIL O 8 -119', units:'', breakdown:{}, why:['Final score: CHC 4, MIL 3 = 7 total runs.', 'Over 8 did not cash.']},
  {slate:'June 28, 2026', rank:'Tracked', pick:'KC ML', matchup:'KC @ CWS', odds:'+116', score:null, status:'WIN', edge:'KC ML +116; AtS', units:'', breakdown:{}, why:['Final score: KC 5, CWS 4.', 'AtS note preserved.']},
  {slate:'June 28, 2026', rank:'Tracked', pick:'STL ML', matchup:'MIA @ STL', odds:'-125', score:null, status:'WIN', edge:'STL ML -125', units:'', breakdown:{}, why:['Final score: MIA 1, STL 2.']},
  {slate:'June 28, 2026', rank:'Tracked', pick:'NYY ML', matchup:'NYY @ BOS', odds:'-105', score:null, status:'LOSS', edge:'NYY ML -105', units:'', breakdown:{}, why:['Final score: NYY 4, BOS 5 in 10 innings.']},
  {slate:'June 28, 2026', rank:'Top Play', pick:'F5 NYY -0.5', matchup:'NYY @ BOS', odds:'-110', score:6.30, status:'LOSS', edge:'Yankees F5 -0.5 -110. Projected F5 win probability about 60%, expected edge +7.6%.', units:'', breakdown:{'Implied Probability':'52.4%','Projected F5 Win Probability':'~60%','Expected Edge':'+7.6%','Final Model Score':'6.30/10'}, why:['Matchup: Yankees @ Red Sox at Fenway Park.', 'After five innings, NYY trailed BOS 0-2, so NYY F5 -0.5 lost.', 'Model note preserved for review.']}
];
for(let i = trackedPickResults.length - 1; i >= 0; i--){
  if(trackedPickResults[i].slate === 'June 28, 2026') trackedPickResults.splice(i, 1);
}
trackedPickResults.unshift(...june28DailyUpdate);


// V39: 06/29 daily card update. Current games remain LIVE until final-score and F5/prop data are fully graded.
const june29DailyUpdate = [
  {slate:'June 29, 2026', rank:'Tracked', pick:'CWS / BAL O9.5', matchup:'CWS @ BAL', odds:'+100', score:null, status:'LIVE', edge:'CWS / BAL O 9.5 +100 - LIVE', units:'', breakdown:{}, why:['06/29 tracked over play.', 'Live/pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'PHI ML', matchup:'PIT @ PHI', odds:'-110', score:null, status:'LIVE', edge:'PHI ML -110 - LIVE', units:'', breakdown:{}, why:['06/29 tracked moneyline play.', 'Live/pending until final score is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'DET / NYY O8', matchup:'DET @ NYY', odds:'-119', score:null, status:'LIVE', edge:'DET / NYY O 8 -119 - LIVE', units:'', breakdown:{}, why:['06/29 tracked over play.', 'Live/pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'NYM / TOR O8.5', matchup:'NYM @ TOR', odds:'-120', score:null, status:'LIVE', edge:'NYM / TOR O 8.5 -120', units:'', breakdown:{}, why:['06/29 tracked over play.', 'Pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'TOR ML', matchup:'NYM @ TOR', odds:'-125', score:null, status:'LIVE', edge:'TOR ML -125 - LIVE', units:'', breakdown:{}, why:['06/29 tracked moneyline play.', 'Live/pending until final score is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'TEX / CLE O7.5', matchup:'TEX @ CLE', odds:'-115', score:null, status:'LIVE', edge:'TEX / CLE O 7.5 -115', units:'', breakdown:{}, why:['06/29 tracked over play.', 'Pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'WSH ML', matchup:'WSH @ BOS', odds:'+145', score:null, status:'LIVE', edge:'WSH ML +145; no CLV - LIVE', units:'', breakdown:{}, why:['06/29 tracked moneyline play.', 'No CLV note preserved.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'MIL ML', matchup:'CIN @ MIL', odds:'-136', score:null, status:'LIVE', edge:'MIL* ML -136 - LIVE', units:'', breakdown:{}, why:['06/29 starred moneyline play.', 'Live/pending until final score is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'CIN / MIL O9', matchup:'CIN @ MIL', odds:'-105', score:null, status:'LIVE', edge:'CIN / MIL O 9 -105 - LIVE', units:'', breakdown:{}, why:['06/29 tracked over play.', 'Live/pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Official', pick:'SD / CHC O11', matchup:'SD @ CHC', odds:'-118', score:null, status:'LIVE', edge:'SD / CHC O 11 -118, .5U', units:'.5U', breakdown:{}, why:['06/29 official total with user-supplied .5U.', 'Pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'SD ML', matchup:'SD @ CHC', odds:'+125', score:null, status:'LIVE', edge:'SD ML +125 - LIVE', units:'', breakdown:{}, why:['06/29 tracked moneyline play.', 'Live/pending until final score is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'MIN / HOU O9', matchup:'MIN @ HOU', odds:'-110', score:null, status:'LIVE', edge:'MIN / HOU O 9 -110 - LIVE', units:'', breakdown:{}, why:['06/29 tracked over play.', 'Live/pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'F5 MIA -0.5', matchup:'MIA @ COL', odds:'-115', score:null, status:'LIVE', edge:'F5 MIA -0.5 -115 - LIVE', units:'', breakdown:{}, why:['06/29 tracked first-five play.', 'Requires score after five innings to grade.']},
  {slate:'June 29, 2026', rank:'Official', pick:'MIA / COL O11.5', matchup:'MIA @ COL', odds:'-116', score:null, status:'LIVE', edge:'MIA / COL O 11.5 -116, .4U & LIVE', units:'.4U', breakdown:{}, why:['06/29 official total with user-supplied .4U.', 'Live/pending until final total is complete.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'F5 SEA +0.5', matchup:'LAA @ SEA', odds:'-145', score:null, status:'PENDING', edge:'F5 SEA +0.5 -145', units:'', breakdown:{}, why:['06/29 tracked first-five play.', 'Requires score after five innings to grade.']},
  {slate:'June 29, 2026', rank:'Tracked', pick:'SF +0.5', matchup:'SF @ ARI', odds:'+100', score:null, status:'PENDING', edge:'SF +0.5 +100', units:'', breakdown:{}, why:['06/29 tracked spread/run-line style play.', 'Pending until final grading data is available.']}
];
for(let i = trackedPickResults.length - 1; i >= 0; i--){
  if(trackedPickResults[i].slate === 'June 29, 2026') trackedPickResults.splice(i, 1);
}
trackedPickResults.unshift(...june29DailyUpdate);

const dailyPicks = trackedPickResults;

const journal = [
  {title:'Pitching-Driven Mispricing',date:'June 12, 2026',items:['McClanahan home/dome splits should be monitored aggressively','Angels F5 opponents remain fade targets vs quality LHP','Books may anchor to full-season ERA instead of matchup-specific K rates']},
  {title:'Market Inefficiency / Public Bias',date:'June 12, 2026',items:['Braves as road underdogs are a systematic ATS/F5 lean','Public overvalues home favorite framing when opponent offense is materially stronger']},
  {title:'Misiorowski Tax',date:'June 12, 2026',items:['Elite pitchers lose EV when priced too aggressively','If Brewers F5 drops below -150, re-evaluate immediately']},
  {title:'Pitching Heavy + Market Mispricing',date:'June 13, 2026',items:['deGrom home starts should be targeted at -115 or better','Schlittler road pricing remains undervalued','Brown F5/first-time-through-order line is underpriced']},
  {title:'Regression Trap',date:'June 13, 2026',items:['Nola xFIP vs ERA gap creates tail opportunity','Liberatore xFIP/ERA profile creates fade opportunity when priced as favorite','Soriano reputation can create overpriced fade spots']},
  {title:'Patterns From Latest Slate',date:'Latest Slate',items:['Burns is building a Cy Young case but remains mispriced in F5 markets','Wheeler K-BB% over 16% should continue to generate F5 value','Lauer as Dodgers SP is an automatic flag to evaluate Rays/opponent underdog']},

  {title:'June 22 Series Mispricing Board',date:'June 22, 2026',items:['Astros +133 series is the strongest edge: model HOU 50.5% vs market 41.5%.','Twins +170 series is the second major edge: model MIN 44.6% vs market 35.7%.','Guardians -115 and Reds +141 are leans, not full green-light bets.']},
  {title:'June 22 Pitching-First F5 Notes',date:'June 22, 2026',items:['Tampa F5 -0.5 is driven by Drew Rasmussen first-time-through dominance and Kansas City offensive weakness.','Chicago F5 -0.5 is a plus-money favorite created by Shota Imanaga vs Kodai Senga mismatch.','Weather volatility in New York keeps Cubs below Tampa despite strong price edge.']},
  {title:'Woodruff Return Flag',date:'June 22, 2026',items:['Brandon Woodruff returning from a 7-week IL stint creates uncertainty in Game 1.','6.00 ERA in rehab and Great American Ball Park environment make Milwaukee series pricing vulnerable.','Track first-start-back pitchers as a recurring market overconfidence pattern.']},

  {title:'June 24 F5 Starter-Mismatch Board',date:'June 24, 2026',items:[
    'Rangers F5 -0.5 (+100): deGrom creates the cleanest pure starter mismatch on the slate, with a 24.1% K-BB profile and reduced weather variance from the closed roof in Miami.',
    'Key Texas angle: Rangers improve materially against right-handed pitching, while Eury Perez carries contact-damage risk through a 15.0% barrel rate, 42.5% hard-hit rate, and 5.02 xERA.',
    'Braves F5 -0.5 (+115): market inefficiency comes from the Padres starter change to JP Sears, who carried a 7.92 Triple-A ERA, while San Diego ranks last in F5 runs per game.',
    'Key Atlanta angle: plus-money F5 price is attached to the stronger early-game team profile, not just the starting pitcher.'
  ]},
  {title:'June 24 Series Board Notes',date:'June 24, 2026',items:[
    'CWS +205 shows the strongest positive model edge on the board at +13.1% versus Vegas implied probability.',
    'CLE +120 and BAL +156 both qualify as green BET series positions with +9% range edges.',
    'NYY -245, ATL -245, MIL -140, and SEA -186 profile as over-priced favorites and should be treated as fades at current numbers.',
    'BOS -119 and TOR -101 are passes because the model edge is too thin or negative.'
  ]},
  {title:'Casey Mize F5 Edge vs Yankees',date:'June 23, 2026',items:[
    'Casey Mize profile: 20.0% K-BB, 3.71 xFIP, 2.58 ERA, 4.8% barrel rate, and 81.2 mph average exit velocity create elite contact-suppression context.',
    'Home dominance matters: 1.27 home ERA and 0.78 WHIP support Detroit F5 +0.5 as a pitching-led position.',
    'Rodon volatility is the opposing flag: erratic command, walk issues, and extreme 4th-inning instability create middle-inning risk.',
    'SP Edge score estimated near 8.4, driven by K-BB differential, Mize contact quality, and prior success against New York.',
    'Model note: Detroit lineup vs LHP remains a caution, so this is primarily a Mize containment play rather than an offense-led play.'
  ]},
  {title:'June 26 F5 Model Board',date:'June 26, 2026',items:[
    'Marlins F5 -0.5 +120: Max Meyer gives Miami the clearest price-to-pitching edge on the board, projecting 52.8% against a 45.5% implied price and grading 6.4 overall.',
    'Rangers F5 -0.5 +110: Eovaldi versus Corbin is a plus-money F5 angle built on SP edge, Toronto early-offense weakness, and market inefficiency. Final model score: 6.5.',
    'Dodgers F5 -0.5: the strongest team-level F5 ecosystem, backed by top-tier first-five scoring/prevention and a weak Padres early offense. Final model score: 7.1 on user ticket, with a separate -140 market note grading 8.05.'
  ]},
  {title:'June 26 Series Model Board',date:'June 26, 2026',items:[
    'Phillies +115: clearest favorite-side series value, driven by Wheeler/Luzardo certainty, stronger SP/bullpen xFIP profile, and Mets TBD uncertainty. Edge: +13.8 pts.',
    'Braves -135: bullpen and rotation certainty versus Giants TBD map makes Atlanta playable even after a short skid. Edge: +11.7 pts.',
    'Reds +161: best underdog series angle because the market overcharges for home field and the Skenes effect. Edge: +8.7 pts.',
    'Marlins +119: sneaky plus-money series angle from bullpen snapshot, Max Meyer Game 1, and unresolved Games 2/3.',
    'Athletics -105: best midrange price because Oakland owns the better broad team profile and should not be behind the Angels in series pricing. Edge: +7.1 pts.'
  ]},
  {title:'June 27 Daily Card Notes',date:'June 27, 2026',items:[
    'Official unit plays entered: NYY/BOS Under (.35U) and WSH ML (.55U).',
    'Disregarded play excluded: SEA/CLE Under 7.5 -120 marked DISREGARD by user.',
    'F5 TOR -0.5, SEA F5 -0.5, and LAD F5 -0.5 model notes are stored as F5 research context rather than overloading the card layout.'
  ]},

];

const seriesBoardPicks = [


  {
    date:'June 26, 2026',
    result:'PENDING',
    matchup:'Phillies @ Mets',
    away:'PHI', home:'NYM',
    favorite:'Phillies', dog:'Mets',
    pick:'PHI Series ML',
    odds:'+115', type:'BET', grade:'A+',
    vegas:'Near coin-flip market', model:'PHI edge from SP/bullpen certainty', edge:'+13.8 pts', decision:'BET PHILLIES +115',
    why:['Clearest favorite-side value on the board.', 'Phillies own the better team SP xFIP and relief xFIP profile.', 'Wheeler/Luzardo certainty plus Mets TBD Games 1 and 3 creates a major series edge.', 'Mets bullpen workload was a negative factor entering the series.']
  },
  {
    date:'June 26, 2026',
    result:'PENDING',
    matchup:'Braves @ Giants',
    away:'ATL', home:'SF',
    favorite:'Braves', dog:'Giants',
    pick:'BRAVES Series ML',
    odds:'-135', type:'BET', grade:'A',
    vegas:'Favorite priced below model', model:'ATL +11.7 pts edge', edge:'+11.7 pts', decision:'BET BRAVES -135',
    why:['Atlanta is the favorite worth laying because of rotation and bullpen certainty.', 'Giants entered with a weak bullpen snapshot and TBD/TBD/TBD pitching map.', 'Atlanta projected starters Lopez, Elder, and Sale create a much cleaner series path.']
  },
  {
    date:'June 26, 2026',
    result:'WIN',
    matchup:'Reds @ Pirates',
    away:'CIN', home:'PIT',
    favorite:'Pirates', dog:'Reds',
    pick:'REDS Series ML',
    odds:'+161', type:'BET', grade:'A-',
    vegas:'PIT favored by home/Skenes tax', model:'CIN +8.7 edge', edge:'+8.7 pts', decision:'BET REDS +161',
    why:['Favorite underdog series angle.', 'Market is charging too much for home field and the Skenes effect.', 'Result update: Cincinnati took the series by winning the first two games on 06/26 and 06/27.']
  },
  {
    date:'June 26, 2026',
    result:'WIN',
    matchup:'Marlins @ Cardinals',
    away:'MIA', home:'STL',
    favorite:'Cardinals', dog:'Marlins',
    pick:'MARLINS Series ML',
    odds:'+119', type:'LEAN', grade:'B+',
    vegas:'Plus-money dog', model:'MIA bullpen/front-starter edge', edge:'Positive dog edge', decision:'LEAN MARLINS +119',
    why:['Sneaky plus-money dog because Miami owns the better current bullpen snapshot.', 'Max Meyer versus Michael McGreevy gives Miami a strong Game 1 path.', 'Result update: Miami took the series by winning the first two games on 06/26 and 06/27.']
  },
  {
    date:'June 26, 2026',
    result:'PENDING',
    matchup:"Athletics @ Angels",
    away:"A's", home:'LAA',
    favorite:"Athletics", dog:'Angels',
    pick:"A's Series ML",
    odds:'-105', type:'BET', grade:'B+',
    vegas:'Midrange near-pickem', model:"A's +7.1 pts edge", edge:'+7.1 pts', decision:"BET ATHLETICS -105",
    why:['Best midrange series price on the board.', 'Oakland has the better broad team profile, including offensive shape and starter-level run prevention context.', 'The market should not have treated Los Angeles as the stronger series side.']
  },
  {
    date:'June 24, 2026',
    matchup:'Red Sox vs Blue Jays',
    favorite:'Red Sox',
    dog:'Blue Jays',
    pick:'BOS Series ML',
    odds:'-119',
    type:'PASS',
    grade:'C',
    vegas:'BOS 54.3%',
    model:'BOS 56.0%',
    edge:'BOS +1.7%',
    decision:'PASS',
    why:['Small positive model edge, but not enough separation to justify a bet.', 'Toronto side is negative versus model, so there is no actionable series play here.']
  },
  {
    date:'June 24, 2026',
    matchup:'Blue Jays vs Red Sox',
    favorite:'Blue Jays',
    dog:'Red Sox',
    pick:'TOR Series ML',
    odds:'-101',
    type:'PASS',
    grade:'C-',
    vegas:'TOR 50.2%',
    model:'TOR 44.0%',
    edge:'TOR -6.2%',
    decision:'PASS',
    why:['Model is materially below the market price.', 'No bet because the edge is negative.']
  },
  {
    date:'June 24, 2026',
    matchup:'Yankees vs White Sox',
    favorite:'Yankees',
    dog:'White Sox',
    pick:'NYY Series ML',
    odds:'-245',
    type:'FADE',
    grade:'D',
    vegas:'NYY 71.0%',
    model:'NYY 54.1%',
    edge:'NYY -16.9%',
    decision:'FADE',
    why:['Market prices New York like a dominant series favorite, but the model is far lower.', 'Too much tax at -245.']
  },
  {
    date:'June 24, 2026',
    matchup:'White Sox vs Yankees',
    favorite:'Yankees',
    dog:'White Sox',
    pick:'CWS Series ML',
    odds:'+205',
    type:'BET',
    grade:'A+',
    vegas:'CWS 32.8%',
    model:'CWS 45.9%',
    edge:'CWS +13.1%',
    decision:'BET CWS +205',
    why:['Largest positive series edge in this update.', 'The model gives Chicago far more true series probability than the market implies.']
  },
  {
    date:'June 24, 2026',
    matchup:'Braves vs Giants',
    favorite:'Braves',
    dog:'Giants',
    pick:'ATL Series ML',
    odds:'-245',
    type:'FADE',
    grade:'D+',
    vegas:'ATL 71.0%',
    model:'ATL 61.1%',
    edge:'ATL -9.9%',
    decision:'FADE',
    why:['Atlanta may still be favored, but the market price is too aggressive versus the model.', 'Avoid paying the favorite tax at -245.']
  },
  {
    date:'June 24, 2026',
    matchup:'Giants vs Braves',
    favorite:'Braves',
    dog:'Giants',
    pick:'SF Series ML',
    odds:'+205',
    type:'LEAN',
    grade:'B',
    vegas:'SF 32.8%',
    model:'SF 38.9%',
    edge:'SF +6.1%',
    decision:'LEAN SF +205',
    why:['Plus-money side has a positive model edge.', 'Classified as a lean because the edge is solid but not as strong as CWS/CLE/BAL.']
  },
  {
    date:'June 24, 2026',
    matchup:'Brewers vs Guardians',
    favorite:'Brewers',
    dog:'Guardians',
    pick:'MIL Series ML',
    odds:'-140',
    type:'FADE',
    grade:'D',
    vegas:'MIL 58.3%',
    model:'MIL 45.2%',
    edge:'MIL -13.1%',
    decision:'FADE',
    why:['Model makes Milwaukee below market by a wide margin.', 'Favorite price is not supported by the series model.']
  },
  {
    date:'June 24, 2026',
    matchup:'Guardians vs Brewers',
    favorite:'Brewers',
    dog:'Guardians',
    pick:'CLE Series ML',
    odds:'+120',
    type:'BET',
    grade:'A',
    vegas:'CLE 45.5%',
    model:'CLE 54.8%',
    edge:'CLE +9.3%',
    decision:'BET CLE +120',
    why:['Model makes Cleveland more likely than the market despite plus money.', 'This is a clean positive edge at a playable dog price.']
  },
  {
    date:'June 24, 2026',
    matchup:'Mariners vs Orioles',
    favorite:'Mariners',
    dog:'Orioles',
    pick:'SEA Series ML',
    odds:'-186',
    type:'FADE',
    grade:'D',
    vegas:'SEA 65.0%',
    model:'SEA 51.8%',
    edge:'SEA -13.2%',
    decision:'FADE',
    why:['Seattle is only a slight model favorite but priced like a much stronger series favorite.', 'Avoid the inflated favorite price.']
  },
  {
    date:'June 24, 2026',
    matchup:'Orioles vs Mariners',
    favorite:'Mariners',
    dog:'Orioles',
    pick:'BAL Series ML',
    odds:'+156',
    type:'BET',
    grade:'A-',
    vegas:'BAL 39.1%',
    model:'BAL 48.2%',
    edge:'BAL +9.1%',
    decision:'BET BAL +156',
    why:['Baltimore is close to coin-flip in the model but priced as a much longer dog.', 'Positive edge lands in the green-light range.']
  },

  {
    date:'June 22, 2026',
    result:'WIN',
    away:'HOU', home:'TOR',
    matchup:'Astros @ Blue Jays',
    favorite:'Blue Jays',
    dog:'Astros',
    pick:'Astros Series ML',
    odds:'+133',
    type:'BET',
    grade:'A',
    vegas:'TOR 58.5% / HOU 41.5%',
    model:'TOR 49.5% / HOU 50.5%',
    edge:'HOU +9.0%',
    decision:'BET ASTROS +133',
    why:[
      'The market makes Toronto a clear series favorite, but the model makes Houston a slight true-probability favorite.',
      'This creates the strongest plus-money series edge on the board.',
      'Result update: Houston won the series 2-1 over Toronto.'
    ]
  },
  {
    date:'June 22, 2026',
    result:'LOSS',
    away:'LAD', home:'MIN',
    matchup:'Dodgers @ Twins',
    favorite:'Dodgers',
    dog:'Twins',
    pick:'Twins Series ML',
    odds:'+170',
    type:'BET',
    grade:'A',
    vegas:'LAD 64.3% / MIN 35.7%',
    model:'LAD 55.4% / MIN 44.6%',
    edge:'MIN +8.9%',
    decision:'BET TWINS +170',
    why:[
      'Dodgers are priced like a dominant series favorite, but the model pulls them down to 55.4%.',
      'Minnesota is still projected below 50%, but the price is too high relative to the model probability.',
      'Result update: Minnesota lost the series; Dodgers swept the three-game set.'
    ]
  },
  {
    date:'June 22, 2026',
    result:'LOSS',
    away:'CLE', home:'CWS',
    matchup:'Guardians @ White Sox',
    favorite:'Guardians',
    dog:'White Sox',
    pick:'Guardians Series ML',
    odds:'-115',
    type:'LEAN',
    grade:'B+',
    vegas:'CLE 51.1% / CWS 48.9%',
    model:'CLE 57.0% / CWS 43.0%',
    edge:'CLE +5.9%',
    decision:'LEAN GUARDIANS -115',
    why:[
      'The model makes Cleveland a stronger favorite than the market does.',
      'The edge is positive, but not as aggressive as the Houston or Minnesota series edges.',
      'Result update: Cleveland lost the series 2-1 to Chicago.'
    ]
  },
  {
    date:'June 22, 2026',
    result:'LOSS',
    away:'MIL', home:'CIN',
    matchup:'Brewers @ Reds',
    favorite:'Brewers',
    dog:'Reds',
    pick:'Reds Series ML',
    odds:'+141',
    type:'LEAN',
    grade:'B',
    vegas:'MIL 59.8% / CIN 40.2%',
    model:'MIL 54.9% / CIN 45.1%',
    edge:'CIN +4.9%',
    decision:'LEAN REDS +141',
    why:[
      'Cincinnati has a positive model edge at plus money, but it is smaller than the strongest series plays.',
      'The key variable is Brandon Woodruff returning from a 7-week IL stint with right shoulder inflammation.',
      'Result update: Cincinnati lost the series; Milwaukee swept the three-game set.'
    ]
  }
];

const seriesModule = [
  {step:'1. Map the Series',detail:'Identify every game in the series, expected home/away order, rest/travel context, and projected starting pitchers before Game 1 begins.'},
  {step:'2. Score Starting Pitching',detail:'Rate each projected SP matchup using K-BB%, xFIP/FIP profile, recent form, first-time-through order strength, pitch mix, and opponent lineup fit.'},
  {step:'3. Check Injuries and Lineups',detail:'Account for missing hitters, catcher impact, bullpen absences, late scratches, platoon issues, and lineup depth that can shift true win probability.'},
  {step:'4. Measure Team Form',detail:'Evaluate last 7/10 games, scoring trend, bullpen workload, defensive context, travel, and whether the club is entering the series with momentum or fatigue.'},
  {step:'5. Convert Variables to Scores',detail:'Turn each qualitative edge into a consistent 0-10 score so series probability is built from repeatable inputs instead of gut feel.'},
  {step:'6. Calculate True Probability',detail:'Blend the matchup scores across the series to estimate each team’s true series win probability.'},
  {step:'7. Compare to Vegas',detail:'Convert series prices to no-vig implied probability, then compare the market number against the model probability.'},
  {step:'8. Classify the Decision',detail:'If the edge is strong and the price is playable, mark it as a BET. If the edge is positive but thinner or riskier, mark it as a LEAN. If the model and market agree, pass.'}
];


const ncaaFootballPropRows = [
  {
    "position": "WR",
    "team": "ALABAMA",
    "player": "Ryan Williams",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "175",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ALABAMA",
    "player": "Ryan Williams",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "120",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ALABAMA",
    "player": "Ryan Williams",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "120",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ALABAMA",
    "player": "Ryan Williams",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "110",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ALABAMA",
    "player": "Ryan Williams",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "65.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ARIZONA",
    "player": "Noah Fifita",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "102",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ARIZONA",
    "player": "Noah Fifita",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "158",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ARIZONA",
    "player": "Noah Fifita",
    "prop": "OVER PASSING TDs",
    "hit": "YES",
    "odds": "114",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ARIZONA",
    "player": "Noah Fifita",
    "prop": "OVER PASSING TDs",
    "hit": "YES",
    "odds": "165",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "LSU",
    "player": "Sam Leavitt",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "TEXAS",
    "player": "Raleek Brown",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "57.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ARKANSAS STATE",
    "player": "Jaylen Raynor",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ARKANSAS STATE",
    "player": "Jaylen Raynor",
    "prop": "OVER PASSING TDs",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ARKANSAS",
    "player": "O'Mega Blake",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "125",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ARKANSAS",
    "player": "O'Mega Blake",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "71.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "UNLV",
    "player": "Jackson Arnold",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "34.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "UNLV",
    "player": "Jackson Arnold",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "43.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "AUBURN",
    "player": "Jeremiah Cobb",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "59.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "AUBURN",
    "player": "Jeremiah Cobb",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "51.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "AUBURN",
    "player": "Bryson Washington",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "52.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "AUBURN",
    "player": "Bryson Washington",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "47.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "AUBURN",
    "player": "Bryson Washington",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "105.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "BOISE STATE",
    "player": "Latrell Caples",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "RUTGERS",
    "player": "Dylan Lonergan",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "RUTGERS",
    "player": "Dylan Lonergan",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "308.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "BYU",
    "player": "Bear Bachmeier",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "53.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "CAL",
    "player": "J Sagapolutele",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "YES",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "CAL",
    "player": "Trond Grizzell",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "165",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "CAL",
    "player": "Trond Grizzell",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "57.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS TECH",
    "player": "Brendan Sorsby",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "45.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS TECH",
    "player": "Brendan Sorsby",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "41.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS TECH",
    "player": "Brendan Sorsby",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "145",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS TECH",
    "player": "Brendan Sorsby",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "127",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "DELAWARE",
    "player": "Nick Minicucci",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "DELAWARE STATE",
    "player": "Marquis Gillis",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "DELAWARE",
    "player": "Jake Thaw",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "DELAWARE",
    "player": "Jake Thaw",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "DELAWARE",
    "player": "Kyre Duplessis",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "DELAWARE",
    "player": "Kyre Duplessis",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MIAMI",
    "player": "Darian Mensah",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "YES",
    "odds": "182",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MIAMI",
    "player": "Darian Mensah",
    "prop": "OVER PASSING TDs",
    "hit": "YES",
    "odds": "118",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "MIAMI",
    "player": "Cooper Barkate",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "62.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "ILLINOIS",
    "player": "Katin Houser",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "EAST CAROLINA",
    "player": "Brock Spalding",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "FLORIDA ATLANTIC",
    "player": "Gemari Sands",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "FLORIDA ATLANTIC",
    "player": "Easton Messer",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "FLORIDA STATE",
    "player": "Thomas Castellanos",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "52.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "FLORIDA STATE",
    "player": "Thomas Castellanos",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "49",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "GEORGIA",
    "player": "Gunner Stockton",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "28",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "GEORGIA",
    "player": "Gunner Stockton",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "34.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "GEORGIA",
    "player": "Gunner Stockton",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "25.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "GEORGIA",
    "player": "Gunner Stockton",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "34.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "HAWAII",
    "player": "Micah Alejado",
    "prop": "OVER PASSING TDs",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "HAWAII",
    "player": "Pofele Ashlock",
    "prop": "ANYT TD",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "HAWAII",
    "player": "Pofele Ashlock",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "HOUSTON",
    "player": "Connor Weigman",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "157",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "HOUSTON",
    "player": "Connor Weigman",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "125",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "HOUSTON",
    "player": "Connor Weigman",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "130",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "IDAHO STATE",
    "player": "Jordan Cooke",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "IDAHO STATE",
    "player": "Dason Brooks",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ILLINOIS",
    "player": "Justin Bowick",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "222",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "ILLINOIS",
    "player": "Justin Bowick",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "165",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "IOWA",
    "player": "Jaziun Patterson",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "IOWA",
    "player": "Terrell Washington Jr.",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "IOWA",
    "player": "Xavier Williams",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PENN STATE",
    "player": "Rocco Becht",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "115",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PENN STATE",
    "player": "Rocco Becht",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "122",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PENN STATE",
    "player": "Rocco Becht",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "224.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PENN STATE",
    "player": "Rocco Becht",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "231.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PENN STATE",
    "player": "Rocco Becht",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "230.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "IOWA STATE",
    "player": "Carson Hansen",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "99.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "IOWA STATE",
    "player": "Carson Hansen",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "71.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "KANSAS",
    "player": "Daniel Hishaw Jr.",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "KANSAS",
    "player": "Leshon Williams",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "115",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "220",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "109",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "YES",
    "odds": "130",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "204.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "235.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "221.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KANSAS STATE",
    "player": "Avery Johnson",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "227.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "KANSAS STATE",
    "player": "Jayce Brown",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "65.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "KANSAS STATE",
    "player": "Jayce Brown",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "71.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "KANSAS",
    "player": "Cam Pickett",
    "prop": "ANYT TD",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "66%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "KANSAS",
    "player": "Cam Pickett",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "33%",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "LSU",
    "player": "Caden Durham",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MARYLAND",
    "player": "Malik Washington",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "136",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "40%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MARYLAND",
    "player": "Malik Washington",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "114",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "40%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MARYLAND",
    "player": "Malik Washington",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "223",
    "newTeam": "NO",
    "trackedHitRate": "40%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MARYLAND",
    "player": "Malik Washington",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "250.5",
    "newTeam": "NO",
    "trackedHitRate": "40%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "MEMPHIS",
    "player": "Brendon Lewis",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "MEMPHIS",
    "player": "Sutton Smith",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "MIAMI",
    "player": "Malachi Toney",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "73",
    "newTeam": "NO",
    "trackedHitRate": "66%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "MIAMI",
    "player": "Malachi Toney",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "77.5",
    "newTeam": "NO",
    "trackedHitRate": "66%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "MIAMI",
    "player": "Malachi Toney",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "62.5",
    "newTeam": "NO",
    "trackedHitRate": "33%",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "MICHIGAN",
    "player": "Justice Haynes",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "MINNESOTA",
    "player": "Darius Taylor",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "MINNESOTA",
    "player": "Fame Ijeboi",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "NC STATE",
    "player": "CJ Bailey",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "230.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "NEW MEXICO STATE",
    "player": "Logan Fife",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "NEW MEXICO STATE",
    "player": "Donovan Faupel",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "TE",
    "team": "NEW MEXICO",
    "player": "Dorian Thomas",
    "prop": "ANYT TD",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "66%",
    "year": "2025"
  },
  {
    "position": "TE",
    "team": "NEW MEXICO",
    "player": "Dorian Thomas",
    "prop": "ANYT TD",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "NORTH TEXAS",
    "player": "Drew Mestemaker",
    "prop": "OVER PASSING TDs",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "NOTRE DAME",
    "player": "CJ Carr",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "YES",
    "odds": "153",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "NOTRE DAME",
    "player": "CJ Carr",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "150",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "NOTRE DAME",
    "player": "Jordan Faison",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "57.5",
    "newTeam": "NO",
    "trackedHitRate": "100%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "OHIO",
    "player": "Parker Navarro",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "63.5",
    "newTeam": "NO",
    "trackedHitRate": "100%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OHIO",
    "player": "Chase Hendricks",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "70",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OHIO STATE",
    "player": "Jeremiah Smith",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "127",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OHIO STATE",
    "player": "Jeremiah Smith",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "179",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OHIO STATE",
    "player": "Jeremiah Smith",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "195",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "OKLAHOMA",
    "player": "John Mateer",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "206",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "OKLAHOMA",
    "player": "John Mateer",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "278.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OKLAHOMA",
    "player": "Isaiah Sategna",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "64",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OKLAHOMA",
    "player": "Keontez Lewis",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "59.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OKLAHOMA",
    "player": "Keontez Lewis",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "700",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "OLE MISS",
    "player": "Kewan Lacy",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "120.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "OLE MISS",
    "player": "Kewan Lacy",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "77.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "OLE MISS",
    "player": "Kewan Lacy",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "72.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OLE MISS",
    "player": "Deuce Alexander",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "30",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OLE MISS",
    "player": "Deuce Alexander",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "46.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OLE MISS",
    "player": "Deuce Alexander",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "45.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "HOUSTON",
    "player": "Trent Walker",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "70.5",
    "newTeam": "YES",
    "trackedHitRate": "40%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "HOUSTON",
    "player": "Trent Walker",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "69.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PITTSBURGH",
    "player": "Mason Heintschel",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "139",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "PITTSBURGH",
    "player": "Mason Heintschel",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "243",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "VIRGINIA",
    "player": "Eli Holstein",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "PITTSBURGH",
    "player": "Raphael Williams",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "54.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "RUTGERS",
    "player": "Antwan Raymond",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "70.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "RUTGERS",
    "player": "Antwan Raymond",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "66.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "RUTGERS",
    "player": "Antwan Raymond",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "76.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "CAL",
    "player": "Ian Strong",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "65",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "CAL",
    "player": "Ian Strong",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "85.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "RUTGERS",
    "player": "KJ Duff",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "58",
    "newTeam": "NO",
    "trackedHitRate": "66%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "RUTGERS",
    "player": "KJ Duff",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "68",
    "newTeam": "NO",
    "trackedHitRate": "66%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "SAM HOUSTON",
    "player": "Hunter Watson",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "SMU",
    "player": "Kevin Jennings",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "249.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "SMU",
    "player": "Kevin Jennings",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "110",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "SMU",
    "player": "Jalen Cooper",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "SMU",
    "player": "Jalen Cooper",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "AUBURN",
    "player": "Byrum Brown",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "90",
    "newTeam": "YES",
    "trackedHitRate": "60%",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "KENNESAW STATE",
    "player": "Rickie Collins",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "SYRACUSE",
    "player": "Steve Angeli",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "KANSAS",
    "player": "Yasin Willis",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "72.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "INDIANA",
    "player": "Josh Hoover",
    "prop": "OVER PASSING TDs",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "INDIANA",
    "player": "Josh Hoover",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "270.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "INDIANA",
    "player": "Josh Hoover",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "282.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TCU",
    "player": "Jordan Dwyer",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TCU",
    "player": "Jordan Dwyer",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "165",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "230",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "105",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "57%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "110",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "57%",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "63",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "50.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "51",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TENNESSEE",
    "player": "Braylon Staley",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "42.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS A&M",
    "player": "Marcel Reed",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "YES",
    "odds": "130",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS A&M",
    "player": "Marcel Reed",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "YES",
    "odds": "122",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS A&M",
    "player": "Marcel Reed",
    "prop": "OVER 1.5 PASSING TDs",
    "hit": "NO",
    "odds": "122",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS A&M",
    "player": "Marcel Reed",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "224",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS A&M",
    "player": "Marcel Reed",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "244.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TEXAS A&M",
    "player": "Marcel Reed",
    "prop": "OVER PASSING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "259.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TEXAS A&M",
    "player": "Mario Craver",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "110",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TEXAS A&M",
    "player": "Mario Craver",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "130",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TEXAS A&M",
    "player": "Mario Craver",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "58",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TEXAS A&M",
    "player": "Mario Craver",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "84.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "FLORIDA STATE",
    "player": "Quintrevion Wisner",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "57.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "TOLEDO",
    "player": "Tucker Gleason",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "TOLEDO",
    "player": "Junior Vandeross",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "AUBURN",
    "player": "Tae Meadows",
    "prop": "OVER RUSHING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OREGON",
    "player": "Iverson Hooks",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "NEBRASKA",
    "player": "Kwazi Gilmer",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "NEBRASKA",
    "player": "Anthony Colandrea",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "115",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "162",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING TDs",
    "hit": "NO",
    "odds": "105",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING TDs",
    "hit": "YES",
    "odds": "150",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "231.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "275.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "269.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "USC",
    "player": "Jayden Maiava",
    "prop": "OVER PASSING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "262.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "UTAH",
    "player": "Devon Dampier",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "55.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OHIO STATE",
    "player": "Devin McCuin",
    "prop": "OVER RECEIVING YARDS",
    "hit": "-",
    "odds": "-",
    "line": "-",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "RB",
    "team": "VANDERBILT",
    "player": "Sedrick Alexander",
    "prop": "OVER RUSHING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "33.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OKLAHOMA",
    "player": "Trell Harris",
    "prop": "OVER RECEIVING YARDS",
    "hit": "YES",
    "odds": "-",
    "line": "57.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "OKLAHOMA",
    "player": "Trell Harris",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "54.5",
    "newTeam": "YES",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "WAKE FOREST",
    "player": "Chris Barnes",
    "prop": "OVER RECEIVING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "WASHINGTON",
    "player": "Demond Williams",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "43.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "WASHINGTON",
    "player": "Demond Williams",
    "prop": "OVER RUSHING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "40.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "WEST VIRGINIA",
    "player": "Cam Vaughn",
    "prop": "ANYT TD",
    "hit": "YES",
    "odds": "200",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "WEST VIRGINIA",
    "player": "Cam Vaughn",
    "prop": "ANYT TD",
    "hit": "NO",
    "odds": "155",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "WEST VIRGINIA",
    "player": "Cam Vaughn",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "58",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "WR",
    "team": "WEST VIRGINIA",
    "player": "Cam Vaughn",
    "prop": "OVER RECEIVING YARDS",
    "hit": "NO",
    "odds": "-",
    "line": "61.5",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "WESTERN KENTUCKY",
    "player": "Maverick McIvor",
    "prop": "OVER PASSING TDs",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  },
  {
    "position": "QB",
    "team": "WESTERN KENTUCKY",
    "player": "Maverick McIvor",
    "prop": "OVER PASSING YARDS",
    "hit": "",
    "odds": "-",
    "line": "-",
    "newTeam": "NO",
    "trackedHitRate": "",
    "year": "2025"
  }
];

// V42 F5 Performance Lab database. This is the dedicated ledger for every F5 play produced by the AI weights/prompts.
const mlbTeams = [
  {
    "abbr": "ARI",
    "name": "Arizona Diamondbacks"
  },
  {
    "abbr": "ATL",
    "name": "Atlanta Braves"
  },
  {
    "abbr": "BAL",
    "name": "Baltimore Orioles"
  },
  {
    "abbr": "BOS",
    "name": "Boston Red Sox"
  },
  {
    "abbr": "CHC",
    "name": "Chicago Cubs"
  },
  {
    "abbr": "CWS",
    "name": "Chicago White Sox"
  },
  {
    "abbr": "CIN",
    "name": "Cincinnati Reds"
  },
  {
    "abbr": "CLE",
    "name": "Cleveland Guardians"
  },
  {
    "abbr": "COL",
    "name": "Colorado Rockies"
  },
  {
    "abbr": "DET",
    "name": "Detroit Tigers"
  },
  {
    "abbr": "HOU",
    "name": "Houston Astros"
  },
  {
    "abbr": "KC",
    "name": "Kansas City Royals"
  },
  {
    "abbr": "LAA",
    "name": "Los Angeles Angels"
  },
  {
    "abbr": "LAD",
    "name": "Los Angeles Dodgers"
  },
  {
    "abbr": "MIA",
    "name": "Miami Marlins"
  },
  {
    "abbr": "MIL",
    "name": "Milwaukee Brewers"
  },
  {
    "abbr": "MIN",
    "name": "Minnesota Twins"
  },
  {
    "abbr": "NYM",
    "name": "New York Mets"
  },
  {
    "abbr": "NYY",
    "name": "New York Yankees"
  },
  {
    "abbr": "OAK",
    "name": "Oakland Athletics"
  },
  {
    "abbr": "PHI",
    "name": "Philadelphia Phillies"
  },
  {
    "abbr": "PIT",
    "name": "Pittsburgh Pirates"
  },
  {
    "abbr": "SD",
    "name": "San Diego Padres"
  },
  {
    "abbr": "SF",
    "name": "San Francisco Giants"
  },
  {
    "abbr": "SEA",
    "name": "Seattle Mariners"
  },
  {
    "abbr": "STL",
    "name": "St. Louis Cardinals"
  },
  {
    "abbr": "TB",
    "name": "Tampa Bay Rays"
  },
  {
    "abbr": "TEX",
    "name": "Texas Rangers"
  },
  {
    "abbr": "TOR",
    "name": "Toronto Blue Jays"
  },
  {
    "abbr": "WSH",
    "name": "Washington Nationals"
  }
];

const f5PerformanceBets = [
  {
    "id": "f5-001",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves +.5",
    "date": "5/4/2026",
    "odds": "+100",
    "result": 1.0,
    "outcome": "win",
    "score": 6.68
  },
  {
    "id": "f5-002",
    "team": "DET",
    "teamName": "Detroit Tigers",
    "bet": "DET Tigers -.5",
    "date": "5/5/2026",
    "odds": "-140",
    "result": -1.4,
    "outcome": "loss",
    "score": 7.14
  },
  {
    "id": "f5-003",
    "team": "LAD",
    "teamName": "Los Angeles Dodgers",
    "bet": "LAD Dodgers -.5",
    "date": "5/5/2026",
    "odds": "-135",
    "result": -1.35,
    "outcome": "loss",
    "score": 6.83
  },
  {
    "id": "f5-004",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves +.5",
    "date": "5/5/2026",
    "odds": "-135",
    "result": 1.0,
    "outcome": "win",
    "score": 6.42
  },
  {
    "id": "f5-005",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "5/6/2026",
    "odds": "+105",
    "result": 1.05,
    "outcome": "win",
    "score": 7.47
  },
  {
    "id": "f5-006",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "5/7/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.4
  },
  {
    "id": "f5-007",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "5/7/2026",
    "odds": "-120",
    "result": -1.2,
    "outcome": "loss",
    "score": 7.15
  },
  {
    "id": "f5-008",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates +.5",
    "date": "5/7/2026",
    "odds": "-125",
    "result": 1.0,
    "outcome": "win",
    "score": 6.44
  },
  {
    "id": "f5-009",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "5/8/2026",
    "odds": "-105",
    "result": 1.0,
    "outcome": "win",
    "score": 6.67
  },
  {
    "id": "f5-010",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "5/9/2026",
    "odds": "-100",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.16
  },
  {
    "id": "f5-011",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "5/9/2026",
    "odds": "-120",
    "result": 1.0,
    "outcome": "win",
    "score": 7.29
  },
  {
    "id": "f5-012",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays +.5",
    "date": "5/11/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 6.94
  },
  {
    "id": "f5-013",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "5/11/2026",
    "odds": "+105",
    "result": 1.05,
    "outcome": "win",
    "score": 6.82
  },
  {
    "id": "f5-014",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "5/12/2026",
    "odds": "+110",
    "result": 1.1,
    "outcome": "win",
    "score": 6.45
  },
  {
    "id": "f5-015",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates -.5",
    "date": "5/13/2026",
    "odds": "-140",
    "result": -1.4,
    "outcome": "loss",
    "score": 7.53
  },
  {
    "id": "f5-016",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "5/13/2026",
    "odds": "-115",
    "result": -1.15,
    "outcome": "loss",
    "score": 6.79
  },
  {
    "id": "f5-017",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "5/14/2026",
    "odds": "-110",
    "result": 1.0,
    "outcome": "win",
    "score": 7.4
  },
  {
    "id": "f5-018",
    "team": "CIN",
    "teamName": "Cincinnati Reds",
    "bet": "CIN Reds -.5",
    "date": "5/14/2026",
    "odds": "-115",
    "result": 1.0,
    "outcome": "win",
    "score": 7.27
  },
  {
    "id": "f5-019",
    "team": "NYM",
    "teamName": "New York Mets",
    "bet": "NYM Mets -.5",
    "date": "5/14/2026",
    "odds": "-120",
    "result": 1.0,
    "outcome": "win",
    "score": 6.39
  },
  {
    "id": "f5-020",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "5/15/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.72
  },
  {
    "id": "f5-021",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves -.5",
    "date": "5/15/2026",
    "odds": "-120",
    "result": 1.0,
    "outcome": "win",
    "score": 6.79
  },
  {
    "id": "f5-022",
    "team": "TOR",
    "teamName": "Toronto Blue Jays",
    "bet": "TOR Blue Jays -.5",
    "date": "5/15/2026",
    "odds": "+110",
    "result": 1.0,
    "outcome": "win",
    "score": 6.62
  },
  {
    "id": "f5-023",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates -.5",
    "date": "5/17/2026",
    "odds": "-115",
    "result": -1.15,
    "outcome": "loss",
    "score": 7.51
  },
  {
    "id": "f5-024",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "5/17/2026",
    "odds": "-125",
    "result": 1.0,
    "outcome": "win",
    "score": 6.91
  },
  {
    "id": "f5-025",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "5/17/2026",
    "odds": "-125",
    "result": -1.25,
    "outcome": "loss",
    "score": 6.39
  },
  {
    "id": "f5-026",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "5/18/2026",
    "odds": "-130",
    "result": -1.3,
    "outcome": "loss",
    "score": 7.97
  },
  {
    "id": "f5-027",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "5/18/2026",
    "odds": "-100",
    "result": 1.0,
    "outcome": "win",
    "score": 7.72
  },
  {
    "id": "f5-028",
    "team": "SD",
    "teamName": "San Diego Padres",
    "bet": "SD Padres +.5",
    "date": "5/18/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 6.59
  },
  {
    "id": "f5-029",
    "team": "CLE",
    "teamName": "Cleveland Guardians",
    "bet": "CLE Guardians -.5",
    "date": "5/19/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.2
  },
  {
    "id": "f5-030",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "5/19/2026",
    "odds": "+105",
    "result": 1.05,
    "outcome": "win",
    "score": 7.01
  },
  {
    "id": "f5-031",
    "team": "BOS",
    "teamName": "Boston Red Sox",
    "bet": "BOS Red Sox -.5",
    "date": "5/19/2026",
    "odds": "-105",
    "result": 1.0,
    "outcome": "win",
    "score": 6.5
  },
  {
    "id": "f5-032",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates -.5",
    "date": "5/21/2026",
    "odds": "-100",
    "result": 1.0,
    "outcome": "win",
    "score": 7.61
  },
  {
    "id": "f5-033",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves -.5",
    "date": "5/21/2026",
    "odds": "-100",
    "result": 1.0,
    "outcome": "win",
    "score": 6.67
  },
  {
    "id": "f5-034",
    "team": "PHI",
    "teamName": "Philadelphia Phillies",
    "bet": "PHI Phillies -.5",
    "date": "5/22/2026",
    "odds": "-115",
    "result": -1.15,
    "outcome": "loss",
    "score": 6.93
  },
  {
    "id": "f5-035",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves -.5",
    "date": "5/22/2026",
    "odds": "-135",
    "result": -1.35,
    "outcome": "loss",
    "score": 7.26
  },
  {
    "id": "f5-036",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "5/22/2026",
    "odds": "+105",
    "result": 1.05,
    "outcome": "win",
    "score": 6.5
  },
  {
    "id": "f5-037",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates -.5",
    "date": "5/23/2026",
    "odds": "-115",
    "result": -1.15,
    "outcome": "loss",
    "score": 7.48
  },
  {
    "id": "f5-038",
    "team": "PHI",
    "teamName": "Philadelphia Phillies",
    "bet": "PHI Phillies -.5",
    "date": "5/23/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 6.82
  },
  {
    "id": "f5-039",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "5/23/2026",
    "odds": "-120",
    "result": -1.2,
    "outcome": "loss",
    "score": 6.14
  },
  {
    "id": "f5-040",
    "team": "CIN",
    "teamName": "Cincinnati Reds",
    "bet": "CIN Reds -.5",
    "date": "5/26/2026",
    "odds": "+141",
    "result": 1.41,
    "outcome": "win",
    "score": 7.39
  },
  {
    "id": "f5-041",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "5/26/2026",
    "odds": "-150",
    "result": 1.0,
    "outcome": "win",
    "score": 7.02
  },
  {
    "id": "f5-042",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates -.5",
    "date": "5/28/2026",
    "odds": "-135",
    "result": -1.35,
    "outcome": "loss",
    "score": 7.53
  },
  {
    "id": "f5-043",
    "team": "CWS",
    "teamName": "Chicago White Sox",
    "bet": "CWS White Sox -.5",
    "date": "5/28/2026",
    "odds": "-135",
    "result": 1.0,
    "outcome": "win",
    "score": 6.71
  },
  {
    "id": "f5-044",
    "team": "WSH",
    "teamName": "Washington Nationals",
    "bet": "WSH Nationals +.5",
    "date": "5/30/2026",
    "odds": "-140",
    "result": -1.4,
    "outcome": "loss",
    "score": 7.21
  },
  {
    "id": "f5-045",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "5/30/2026",
    "odds": "-100",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.65
  },
  {
    "id": "f5-046",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "5/31/2026",
    "odds": "-140",
    "result": 1.0,
    "outcome": "win",
    "score": 7.12
  },
  {
    "id": "f5-047",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves -.5",
    "date": "5/31/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.8
  },
  {
    "id": "f5-048",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "5/31/2026",
    "odds": "-150",
    "result": 1.0,
    "outcome": "win",
    "score": 6.42
  },
  {
    "id": "f5-049",
    "team": "ARI",
    "teamName": "Arizona Diamondbacks",
    "bet": "ARI Diamondbacks +.5",
    "date": "6/2/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.58
  },
  {
    "id": "f5-050",
    "team": "SD",
    "teamName": "San Diego Padres",
    "bet": "SD Padres +.5",
    "date": "6/2/2026",
    "odds": "-100",
    "result": 1.0,
    "outcome": "win",
    "score": 6.5
  },
  {
    "id": "f5-051",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/2/2026",
    "odds": "-135",
    "result": 1.0,
    "outcome": "win",
    "score": 7.08
  },
  {
    "id": "f5-052",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "6/5/2026",
    "odds": "-100",
    "result": 1.0,
    "outcome": "win",
    "score": 8.04
  },
  {
    "id": "f5-053",
    "team": "SD",
    "teamName": "San Diego Padres",
    "bet": "SD Padres -.5",
    "date": "6/5/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.43
  },
  {
    "id": "f5-054",
    "team": "CLE",
    "teamName": "Cleveland Guardians",
    "bet": "CLE Guardians -.5",
    "date": "6/5/2026",
    "odds": "-140",
    "result": 1.0,
    "outcome": "win",
    "score": 7.33
  },
  {
    "id": "f5-055",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/6/2026",
    "odds": "-105",
    "result": 1.0,
    "outcome": "win",
    "score": 7.5
  },
  {
    "id": "f5-056",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "6/6/2026",
    "odds": "-100",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.08
  },
  {
    "id": "f5-057",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "6/6/2026",
    "odds": "-105",
    "result": -1.05,
    "outcome": "loss",
    "score": 7.05
  },
  {
    "id": "f5-058",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves -.5",
    "date": "6/6/2026",
    "odds": "-115",
    "result": 1.0,
    "outcome": "win",
    "score": 6.55
  },
  {
    "id": "f5-059",
    "team": "CWS",
    "teamName": "Chicago White Sox",
    "bet": "CWS White Sox +.5",
    "date": "6/6/2026",
    "odds": "+105",
    "result": 1.05,
    "outcome": "win",
    "score": 6.33
  },
  {
    "id": "f5-060",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "6/7/2026",
    "odds": "-130",
    "result": -1.3,
    "outcome": "loss",
    "score": 7.1
  },
  {
    "id": "f5-061",
    "team": "HOU",
    "teamName": "Houston Astros",
    "bet": "HOU Astros -.5",
    "date": "6/8/2026",
    "odds": "+100",
    "result": -1.3,
    "outcome": "loss",
    "score": 8.9
  },
  {
    "id": "f5-062",
    "team": "PHI",
    "teamName": "Philadelphia Phillies",
    "bet": "PHI Phillies -.5",
    "date": "6/8/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 8.3
  },
  {
    "id": "f5-063",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/8/2026",
    "odds": "+105",
    "result": 1.05,
    "outcome": "win",
    "score": 7.9
  },
  {
    "id": "f5-064",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/9/2026",
    "odds": "+100",
    "result": 1.0,
    "outcome": "win",
    "score": 7.5
  },
  {
    "id": "f5-065",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates +.5",
    "date": "6/9/2026",
    "odds": "+120",
    "result": 1.2,
    "outcome": "win",
    "score": 7.3
  },
  {
    "id": "f5-066",
    "team": "CIN",
    "teamName": "Cincinnati Reds",
    "bet": "CIN Reds -.5",
    "date": "6/9/2026",
    "odds": "+120",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.0
  },
  {
    "id": "f5-067",
    "team": "CLE",
    "teamName": "Cleveland Guardians",
    "bet": "CLE Guardians -.5",
    "date": "6/10/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.7
  },
  {
    "id": "f5-068",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/10/2026",
    "odds": "+120",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.1
  },
  {
    "id": "f5-069",
    "team": "WSH",
    "teamName": "Washington Nationals",
    "bet": "WSH Nationals -.5",
    "date": "6/10/2026",
    "odds": "+120",
    "result": 1.2,
    "outcome": "win",
    "score": 6.8
  },
  {
    "id": "f5-070",
    "team": "LAD",
    "teamName": "Los Angeles Dodgers",
    "bet": "LAD Dodgers -.5",
    "date": "6/11/2026",
    "odds": "-125",
    "result": 1.0,
    "outcome": "win",
    "score": 7.14
  },
  {
    "id": "f5-071",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "6/12/2026",
    "odds": "-130",
    "result": -1.3,
    "outcome": "loss",
    "score": 7.66
  },
  {
    "id": "f5-072",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves +.5",
    "date": "6/12/2026",
    "odds": "-100",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.51
  },
  {
    "id": "f5-073",
    "team": "BAL",
    "teamName": "Baltimore Orioles",
    "bet": "BAL Orioles -.5",
    "date": "6/12/2026",
    "odds": "-100",
    "result": 1.0,
    "outcome": "win",
    "score": 6.25
  },
  {
    "id": "f5-074",
    "team": "TEX",
    "teamName": "Texas Rangers",
    "bet": "TEX Rangers -.5",
    "date": "6/13/2026",
    "odds": "-115",
    "result": -1.15,
    "outcome": "loss",
    "score": 7.4
  },
  {
    "id": "f5-075",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "6/13/2026",
    "odds": "+115",
    "result": 1.15,
    "outcome": "win",
    "score": 7.1
  },
  {
    "id": "f5-076",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "6/13/2026",
    "odds": "+115",
    "result": -1.15,
    "outcome": "loss",
    "score": 6.9
  },
  {
    "id": "f5-077",
    "team": "CIN",
    "teamName": "Cincinnati Reds",
    "bet": "CIN Reds -.5",
    "date": "6/15/2026",
    "odds": "-115",
    "result": 1.0,
    "outcome": "win",
    "score": 7.71
  },
  {
    "id": "f5-078",
    "team": "PHI",
    "teamName": "Philadelphia Phillies",
    "bet": "PHI Phillies -.5",
    "date": "6/15/2026",
    "odds": "-140",
    "result": 1.0,
    "outcome": "win",
    "score": 7.3
  },
  {
    "id": "f5-079",
    "team": "CHC",
    "teamName": "Chicago Cubs",
    "bet": "CHC Cubs -.5",
    "date": "6/15/2026",
    "odds": "-140",
    "result": 1.0,
    "outcome": "win",
    "score": 6.71
  },
  {
    "id": "f5-080",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays +.5",
    "date": "6/15/2026",
    "odds": "+130",
    "result": 1.0,
    "outcome": "win",
    "score": 6.45
  },
  {
    "id": "f5-081",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays +.5",
    "date": "6/16/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.3
  },
  {
    "id": "f5-082",
    "team": "CLE",
    "teamName": "Cleveland Guardians",
    "bet": "CLE Guardians +.5",
    "date": "6/16/2026",
    "odds": "-120",
    "result": -1.2,
    "outcome": "loss",
    "score": 6.9
  },
  {
    "id": "f5-083",
    "team": "CWS",
    "teamName": "Chicago White Sox",
    "bet": "CWS White Sox +.5",
    "date": "6/16/2026",
    "odds": "-125",
    "result": -1.25,
    "outcome": "loss",
    "score": 6.2
  },
  {
    "id": "f5-084",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "6/19/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.5
  },
  {
    "id": "f5-085",
    "team": "CLE",
    "teamName": "Cleveland Guardians",
    "bet": "CLE Guardians +.5",
    "date": "6/19/2026",
    "odds": "-145",
    "result": 1.0,
    "outcome": "win",
    "score": 7.1
  },
  {
    "id": "f5-086",
    "team": "PIT",
    "teamName": "Pittsburgh Pirates",
    "bet": "PIT Pirates -.5",
    "date": "6/19/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.7
  },
  {
    "id": "f5-087",
    "team": "STL",
    "teamName": "St. Louis Cardinals",
    "bet": "STL Cardinals",
    "date": "6/19/2026",
    "odds": "+125",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.5
  },
  {
    "id": "f5-088",
    "team": "PHI",
    "teamName": "Philadelphia Phillies",
    "bet": "PHI Phillies -.5",
    "date": "6/20/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.8
  },
  {
    "id": "f5-089",
    "team": "LAD",
    "teamName": "Los Angeles Dodgers",
    "bet": "LAD Dodgers -.5",
    "date": "6/20/2026",
    "odds": "-150",
    "result": -1.5,
    "outcome": "loss",
    "score": 7.6
  },
  {
    "id": "f5-090",
    "team": "HOU",
    "teamName": "Houston Astros",
    "bet": "HOU Astros -.5",
    "date": "6/20/2026",
    "odds": "-110",
    "result": -1.1,
    "outcome": "loss",
    "score": 6.7
  },
  {
    "id": "f5-091",
    "team": "ATL",
    "teamName": "Atlanta Braves",
    "bet": "ATL Braves -.5",
    "date": "6/20/2026",
    "odds": "-110",
    "result": 1.0,
    "outcome": "win",
    "score": 6.3
  },
  {
    "id": "f5-092",
    "team": "SF",
    "teamName": "San Francisco Giants",
    "bet": "SF Giants -.5",
    "date": "6/21/2026",
    "odds": "-115",
    "result": -1.15,
    "outcome": "loss",
    "score": 7.3
  },
  {
    "id": "f5-093",
    "team": "PHI",
    "teamName": "Philadelphia Phillies",
    "bet": "PHI Phillies -.5",
    "date": "6/21/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.1
  },
  {
    "id": "f5-094",
    "team": "CIN",
    "teamName": "Cincinnati Reds",
    "bet": "CIN Reds -.5",
    "date": "6/21/2026",
    "odds": "-105",
    "result": 1.0,
    "outcome": "win",
    "score": 6.9
  },
  {
    "id": "f5-095",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/21/2026",
    "odds": "+110",
    "result": 1.1,
    "outcome": "win",
    "score": 6.6
  },
  {
    "id": "f5-096",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "6/22/2026",
    "odds": "-105",
    "result": -1.05,
    "outcome": "loss",
    "score": 7.1
  },
  {
    "id": "f5-097",
    "team": "TB",
    "teamName": "Tampa Bay Rays",
    "bet": "TB Rays -.5",
    "date": "6/22/2026",
    "odds": "-135",
    "result": -1.35,
    "outcome": "loss",
    "score": 7.1
  },
  {
    "id": "f5-098",
    "team": "DET",
    "teamName": "Detroit Tigers",
    "bet": "DET Tigers -.5",
    "date": "6/23/2026",
    "odds": "-115",
    "result": 1.0,
    "outcome": "win",
    "score": 7.6
  },
  {
    "id": "f5-099",
    "team": "BOS",
    "teamName": "Boston Red Sox",
    "bet": "BOS Red Sox -.5",
    "date": "6/23/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.2
  },
  {
    "id": "f5-100",
    "team": "CLE",
    "teamName": "Cleveland Guardians",
    "bet": "CLE Guardians -.5",
    "date": "6/23/2026",
    "odds": "-120",
    "result": -1.2,
    "outcome": "loss",
    "score": 6.8
  },
  {
    "id": "f5-101",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "6/25/2026",
    "odds": "-110",
    "result": -1.1,
    "outcome": "loss",
    "score": 7.2
  },
  {
    "id": "f5-102",
    "team": "KC",
    "teamName": "Kansas City Royals",
    "bet": "KC Royals +.5",
    "date": "6/25/2026",
    "odds": "-130",
    "result": -1.3,
    "outcome": "loss",
    "score": 6.5
  },
  {
    "id": "f5-103",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/25/2026",
    "odds": "-110",
    "result": -1.1,
    "outcome": "loss",
    "score": 6.4
  },
  {
    "id": "f5-104",
    "team": "MIA",
    "teamName": "Miami Marlins",
    "bet": "MIA Marlins -.5",
    "date": "6/26/2026",
    "odds": "+120",
    "result": -1.0,
    "outcome": "loss",
    "score": 6.4
  },
  {
    "id": "f5-105",
    "team": "TEX",
    "teamName": "Texas Rangers",
    "bet": "TEX Rangers -.5",
    "date": "6/26/2026",
    "odds": "+110",
    "result": 1.1,
    "outcome": "win",
    "score": 6.5
  },
  {
    "id": "f5-106",
    "team": "LAD",
    "teamName": "Los Angeles Dodgers",
    "bet": "LAD Dodgers -.5",
    "date": "6/26/2026",
    "odds": "-105",
    "result": -1.05,
    "outcome": "loss",
    "score": 7.1
  },
  {
    "id": "f5-107",
    "team": "LAD",
    "teamName": "Los Angeles Dodgers",
    "bet": "LAD Dodgers -.5",
    "date": "6/27/2026",
    "odds": "-140",
    "result": -1.4,
    "outcome": "loss",
    "score": 8.05
  },
  {
    "id": "f5-108",
    "team": "TOR",
    "teamName": "Toronto Blue Jays",
    "bet": "TOR Blue Jays -.5",
    "date": "6/27/2026",
    "odds": "-140",
    "result": -1.4,
    "outcome": "loss",
    "score": 7.08
  },
  {
    "id": "f5-109",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/27/2026",
    "odds": "-110",
    "result": -1.1,
    "outcome": "loss",
    "score": 6.33
  },
  {
    "id": "f5-110",
    "team": "MIL",
    "teamName": "Milwaukee Brewers",
    "bet": "MIL Brewers -.5",
    "date": "6/27/2026",
    "odds": "-120",
    "result": -1.2,
    "outcome": "loss",
    "score": 6.2
  },
  {
    "id": "f5-111",
    "team": "NYY",
    "teamName": "New York Yankees",
    "bet": "NYY Yankees -.5",
    "date": "6/28/2026",
    "odds": "-110",
    "result": -1.1,
    "outcome": "loss",
    "score": 6.3
  },
  {
    "id": "f5-112",
    "team": "LAD",
    "teamName": "Los Angeles Dodgers",
    "bet": "LAD Dodgers -.5",
    "date": "6/28/2026",
    "odds": "-130",
    "result": 1.0,
    "outcome": "win",
    "score": 7.6
  },
  {
    "id": "f5-113",
    "team": "HOU",
    "teamName": "Houston Astros",
    "bet": "HOU Astros -.5",
    "date": "6/28/2026",
    "odds": "-140",
    "result": -1.4,
    "outcome": "loss",
    "score": 6.15
  },
  {
    "id": "f5-114",
    "team": "MIA",
    "teamName": "Miami Marlins",
    "bet": "MIA Marlins -.5",
    "date": "6/29/2026",
    "odds": "-115",
    "result": 1.0,
    "outcome": "win",
    "score": 7.78
  },
  {
    "id": "f5-115",
    "team": "SEA",
    "teamName": "Seattle Mariners",
    "bet": "SEA Mariners -.5",
    "date": "6/29/2026",
    "odds": "-145",
    "result": 1.0,
    "outcome": "win",
    "score": 7.98
  },
  {
    "id": "f5-116",
    "team": "TEX",
    "teamName": "Texas Rangers",
    "bet": "TEX Rangers -.5",
    "date": "6/30/2026",
    "odds": "+105",
    "result": -1.0,
    "outcome": "loss",
    "score": 7.0
  }
];
