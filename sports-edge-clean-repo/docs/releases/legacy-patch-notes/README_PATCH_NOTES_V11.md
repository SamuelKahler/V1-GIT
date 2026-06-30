# Sports Edge V11 - Premium Model Center

## What changed
- Converted Model Center into a subscription-gated premium tab.
- Free users now see a paywall/value proposition instead of the model weights.
- Added demo unlock/lock buttons so the prototype can be tested without real auth.
- Added F5 model weight sliders for paid/premium mode.
- Added custom Grade A board that recalculates and re-ranks eligible picks as sliders move.
- Preserved default F5 framework: SP Edge 30%, Opponent Early Offense 15%, Team F5 Splits 15%, Ballpark/Weather 10%, Lineup Construction 10%, Travel 5%, Market 10%, Umpire 5%.

## Production note
The unlock button is demo-only. For a real subscription, connect it to Stripe Checkout + user authentication, then replace localStorage access with a verified paid user session.
