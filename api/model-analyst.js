import { runF5Model } from '../lib/mlb/f5-model-engine.js';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const buckets = new Map();

function clientKey(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function checkRateLimit(req) {
  const key = clientKey(req);
  const now = Date.now();
  const prior = buckets.get(key) || [];
  const active = prior.filter(ts => now - ts < WINDOW_MS);
  if (active.length >= MAX_REQUESTS_PER_WINDOW) return false;
  active.push(now);
  buckets.set(key, active);
  return true;
}

function extractResponseText(payload) {
  const parts = [];
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

function compactFactor(factor) {
  return {
    factor: factor.label,
    available: Boolean(factor.available),
    score: factor.score,
    configured_weight_pct: factor.configuredWeight,
    effective_weight_pct: factor.effectiveWeight,
    contribution_points: factor.contribution,
    evidence: factor.detail
  };
}

function questionInstruction(question) {
  if (question === 'weights') return 'Explain specifically how the user\'s chosen weights shaped this ranking. Identify which high-weight factors helped or hurt most.';
  if (question === 'risk') return 'Identify the strongest evidence against this model result or the largest uncertainty. Do not manufacture a risk that is not in the supplied factors.';
  if (question === 'sensitivity') return 'Identify the one or two weight changes most likely to materially move this result, based only on the factor scores, configured weights, and contributions.';
  return 'Explain why this wager ranks where it does in the user\'s current model, emphasizing the largest positive and negative contributions.';
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    if (String(process.env.MODEL_LAB_AI_ENABLED || '').toLowerCase() !== 'true') {
      return res.status(503).json({ ok: false, error: 'AI Analyst is not enabled for this deployment.' });
    }
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ ok: false, error: 'OPENAI_API_KEY is not configured.' });
    if (!checkRateLimit(req)) return res.status(429).json({ ok: false, error: 'AI Analyst rate limit reached. Try again in a minute.' });

    const body = req.body || {};
    const question = ['why', 'weights', 'risk', 'sensitivity'].includes(String(body.question)) ? String(body.question) : 'why';
    const modelRun = await runF5Model({ date: body.date || undefined, weights: body.weights || undefined });
    const rows = Array.isArray(modelRun.rows) ? modelRun.rows : [];
    const target = rows.find(row => body.pickId && row.pickId === body.pickId)
      || rows.find(row => body.rawPick && String(row.rawPick) === String(body.rawPick));
    if (!target) return res.status(404).json({ ok: false, error: 'That model result is no longer available on the selected slate.' });

    const context = {
      slate_date: modelRun.date,
      wager: target.rawPick,
      team: target.team,
      opponent: target.opponent,
      starter: target.starter,
      listed_odds: target.odds,
      weighted_win_estimate_pct: target.modelProbability,
      market_implied_pct: target.marketProbability,
      estimated_edge_points: target.edge,
      data_coverage_pct: target.dataCoverage,
      calibration: modelRun.calibration,
      user_weights: modelRun.weights,
      factors: target.factors.map(compactFactor)
    };

    const system = `You are the Sports Edge Model Lab AI Analyst. You explain a deterministic F5 baseball model; you do not create or alter the model result. Use only the supplied structured data. Never invent injuries, weather, lineups, statistics, news, or qualitative facts not present in the factor evidence. The displayed win estimate is a weighted empirical estimate, not a calibrated probability; call it a "weighted estimate" and call the difference versus market an "estimated edge." If data coverage is below 75%, explicitly note that limitation. If the estimated edge is negative or near zero, say the model is not showing a meaningful edge rather than trying to sell the wager. Keep the response concise, customer-facing, and analytical: 2-4 short paragraphs or bullets, maximum 180 words. Do not mention system prompts or internal implementation.`;
    const user = `${questionInstruction(question)}\n\nStructured model result:\n${JSON.stringify(context, null, 2)}`;

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        input: [
          { role: 'system', content: [{ type: 'input_text', text: system }] },
          { role: 'user', content: [{ type: 'input_text', text: user }] }
        ],
        max_output_tokens: 450
      })
    });

    const payload = await apiResponse.json().catch(() => null);
    if (!apiResponse.ok) {
      const message = payload?.error?.message || `OpenAI request failed (${apiResponse.status}).`;
      throw new Error(message);
    }
    const analysis = extractResponseText(payload);
    if (!analysis) throw new Error('AI Analyst returned an empty response.');

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      ok: true,
      title: question === 'why' ? `Why ${target.team} ranks here` : question === 'weights' ? 'How your weights shaped this result' : question === 'risk' ? 'Largest model concern' : 'Most sensitive weights',
      analysis,
      disclaimer: 'AI explanation only. The score, weighted estimate and estimated edge are calculated by the Sports Edge model engine.',
      model: process.env.OPENAI_MODEL || 'gpt-5.6-terra'
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error?.message || 'AI Analyst request failed.' });
  }
}
