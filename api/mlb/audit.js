import { requireAdmin } from '../../lib/mlb/auth.js';
import { handleOptions, requireMethod, sendError, sendSuccess } from '../../lib/mlb/http.js';
import { callRpc } from '../../lib/mlb/supabase.js';
export default async function handler(request,response){if(handleOptions(request,response))return;try{requireMethod(request,'GET');requireAdmin(request);sendSuccess(response,{service:'sports-edge-mlb-intelligence',checkedAt:new Date().toISOString(),audit:await callRpc('sports_edge_mlb_audit',{})});}catch(error){sendError(response,error);}}
