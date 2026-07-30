import { requireAdminToken } from '../../lib/mlb/auth.js';
import { handleError, sendJson } from '../../lib/mlb/http.js';
import { callRpc } from '../../lib/mlb/supabase.js';
export default async function handler(request,response){
 try { if(request.method!=='GET') return sendJson(response,405,{ok:false,error:'Use GET.'}); requireAdminToken(request); const database=await callRpc('sports_edge_mlb_status'); const passed=Number(database?.duplicateGamePks || 0)===0; sendJson(response,passed?200:409,{ok:passed,checks:{uniqueGamePk:passed,hasGames:Number(database?.games||0)>0,hasInnings:Number(database?.innings||0)>0},database}); }
 catch(error){ handleError(response,error); }
}
