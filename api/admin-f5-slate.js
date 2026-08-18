import { requireAdmin } from '../lib/mlb/auth.js';
import { requireMethod, parseJsonBody, sendError, sendSuccess, getQueryValue } from '../lib/mlb/http.js';
import { requestSupabase } from '../lib/mlb/supabase.js';
import { parseAuthoritativeF5Slate } from '../lib/mlb/f5-prompt-runtime.js';

async function latest(limit=20){return requestSupabase(`/rest/v1/sports_edge_f5_slates?select=slate_date,raw_text,games,published_at&order=slate_date.desc,published_at.desc&limit=${Math.max(1,Math.min(100,Number(limit)||20))}`);}
export default async function handler(req,res){
  try{
    const method=requireMethod(req,['GET','POST']); requireAdmin(req);
    if(method==='GET'){const rows=await latest(getQueryValue(req,'limit'));return sendSuccess(res,{rows,count:Array.isArray(rows)?rows.length:0});}
    const body=parseJsonBody(req), action=String(body.action||'preview').toLowerCase(), text=String(body.text||'').trim();
    if(!text){const e=new Error('Paste an authoritative F5 slate first.');e.statusCode=400;throw e;}
    const parsed=parseAuthoritativeF5Slate(text,{defaultDate:body.date||undefined});
    if(!parsed.date){const e=new Error('Slate date is required. Add a date line such as 08/17.');e.statusCode=400;throw e;}
    if(!parsed.games.length){const e=new Error('No F5 games were detected.');e.statusCode=400;throw e;}
    const invalid=parsed.games.filter(g=>!(g.sides||[]).length);
    const preview=parsed.games.map(g=>({date:parsed.date,game:`${g.away} @ ${g.home}`,venue:g.venue,firstPitch:g.firstPitch,awayStarter:g.awayStarter,homeStarter:g.homeStarter,markets:g.sides}));
    if(action==='preview') return sendSuccess(res,{date:parsed.date,preview,count:preview.length,warnings:invalid.map(g=>`${g.away} @ ${g.home} has no recognized F5 price.`)});
    if(action!=='publish'){const e=new Error('action must be preview or publish.');e.statusCode=400;throw e;}
    await requestSupabase('/rest/v1/rpc/sports_edge_publish_f5_slate',{method:'POST',body:{p_slate_date:parsed.date,p_raw_text:text,p_games:parsed.games}});
    return sendSuccess(res,{published:true,date:parsed.date,preview,count:preview.length,warnings:invalid.map(g=>`${g.away} @ ${g.home} has no recognized F5 price.`)});
  }catch(error){sendError(res,error);}
}
