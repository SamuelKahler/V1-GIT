import { runF5PromptRuntime, DEFAULT_PROMPT_WEIGHTS, PROMPT_FACTOR_LABELS, PROMPT_FACTOR_ORDER } from '../lib/mlb/f5-prompt-runtime.js';

const WINDOW_MS = 60_000;
const MAX_RUNS_PER_WINDOW = 6;
const buckets = new Map();
function clientKey(req){ return String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim(); }
function allowed(req){
  const key=clientKey(req), now=Date.now(), prior=buckets.get(key)||[], active=prior.filter(ts=>now-ts<WINDOW_MS);
  if(active.length>=MAX_RUNS_PER_WINDOW) return false;
  active.push(now); buckets.set(key,active); return true;
}

export default async function handler(req,res){
  try{
    if(req.method!=='POST') return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
    if(!allowed(req)) return res.status(429).json({ok:false,error:'Model Lab run limit reached. Try again in a minute.'});
    const result=await runF5PromptRuntime({date:req.body?.date||undefined,weights:req.body?.weights||undefined});
    res.setHeader('Cache-Control','no-store, max-age=0');
    return res.status(200).json({ok:true,defaults:DEFAULT_PROMPT_WEIGHTS,labels:PROMPT_FACTOR_LABELS,order:PROMPT_FACTOR_ORDER,...result});
  }catch(error){return res.status(Number(error?.statusCode)||500).json({ok:false,error:error?.message||'F5 prompt runtime failed.'});}
}
