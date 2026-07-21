export default async function handler(req, res) {
  try {
    const key = process.env.ODDS_API_KEY;

    if (!key) {
      return res.status(500).json({
        ok: false,
        error: "ODDS_API_KEY is missing in Vercel Environment Variables"
      });
    }

    const url = `https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=${key}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({
      ok: response.ok,
      source: "The Odds API",
      events: data,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
