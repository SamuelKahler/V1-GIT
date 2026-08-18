# Model Lab V1C — AI Analyst

- Added `/api/model-analyst` using the OpenAI Responses API.
- AI Analyst recomputes the F5 model server-side from the submitted weights before explaining it.
- Added four customer questions: ranking, weight impact, risk, and sensitivity.
- Added AI Analyst result cards to the full Model Center and an "Ask AI why #1 ranks first" action in the persistent sidebar.
- Kept deterministic Sports Edge scoring separate from language-model explanation.
- Added rate limiting and deployment-level AI enable switch.
- Removed the customer-facing API Verified July Record aggregate banner from Today's Picks while leaving API grading infrastructure intact.
