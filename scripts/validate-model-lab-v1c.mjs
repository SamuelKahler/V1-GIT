import fs from 'node:fs';

const app = fs.readFileSync('sports/mlb/mlb-app.js','utf8');
const api = fs.readFileSync('api/model-analyst.js','utf8');
const css = fs.readFileSync('styles.css','utf8');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));

const required = [
  [!app.includes("API Verified July Record:</strong>" ) || !app.includes("+ apiGradeSummaryHtml()"), 'aggregate July record is not rendered in Today\'s Picks'],
  [app.includes("fetch('/api/model-analyst'"), 'frontend calls AI Analyst endpoint'],
  [app.includes('Why this rank?') && app.includes('Biggest risk'), 'AI Analyst customer questions exist'],
  [api.includes("https://api.openai.com/v1/responses"), 'Responses API is used server-side'],
  [api.includes("process.env.OPENAI_API_KEY"), 'OpenAI key remains server-side'],
  [api.includes("runF5Model"), 'AI endpoint recomputes the deterministic F5 model server-side'],
  [api.includes('weighted empirical estimate') && api.includes('estimated edge'), 'AI prompt preserves model calibration language'],
  [css.includes('.model-ai-analyst') && css.includes('.model-ai-response'), 'AI Analyst presentation styles exist'],
  [pkg.scripts['validate:model-lab-v1c'], 'V1C validator is registered']
];

const failures = required.filter(([ok])=>!ok).map(([,label])=>label);
if (failures.length) {
  console.error('MODEL_LAB_V1C_VALIDATION_FAILED');
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('MODEL_LAB_V1C_AI_ANALYST_VALIDATION_PASSED');
