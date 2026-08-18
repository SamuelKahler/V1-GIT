SPORTS EDGE — MODEL LAB V1C / AI ANALYST

Purpose
- Adds an AI explanation layer to the deterministic Custom F5 Model.
- Removes the customer-facing "API Verified July Record" aggregate banner while preserving the grading system behind the scenes.

Vercel environment variables required for AI Analyst
- OPENAI_API_KEY        required
- MODEL_LAB_AI_ENABLED  set to true for deployments where AI Analyst should be available
- OPENAI_MODEL          optional; defaults to gpt-5.6-terra

No Supabase migration is required for this release.

Important architecture rule
The AI does not generate, change, or re-score the model pick. The server recomputes the requested F5 model result, then sends only the verified structured result to the AI for explanation.

Preview acceptance
1. Run the F5 model.
2. Click Why this rank? on a model result.
3. Confirm the AI discusses the displayed factors/weights and does not introduce unsupported stats.
4. Change weights, rerun the model, ask again, and confirm the explanation changes with the deterministic model result.
5. Check Today's Picks and confirm the API Verified July Record banner is gone.
