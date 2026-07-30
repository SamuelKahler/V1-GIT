import { requireAdminToken } from '../../lib/mlb/auth.js';
import { handleError, readJson, sendJson } from '../../lib/mlb/http.js';
import { importDateRange } from '../../lib/mlb/importer.js';

export default async function handler(request,response) {
  try {
    if(request.method !== 'POST') return sendJson(response,405,{ok:false,error:'Use POST.'});
    requireAdminToken(request);
    const body=await readJson(request);
    const result=await importDateRange({startDate:body.startDate,endDate:body.endDate,dryRun:body.dryRun === true});
    sendJson(response,200,{ok:true,...result});
  } catch(error) { handleError(response,error); }
}
